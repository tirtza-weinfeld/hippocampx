/**
 * Entry Queries - Cursor-based infinite scroll for lexical entries
 *
 * Uses the new lexicalEntries/senses schema structure.
 */

import "server-only";

import { cache } from "react";
import { eq, and, ilike, asc, desc, inArray, count, or, gt, lt } from "drizzle-orm";
import { neonDb } from "../../connection";
import {
  lexicalEntries,
  senses,
  examples,
  senseTags,
  sourceParts,
  type LexicalEntry,
} from "../../schemas/dictionary";
import {
  INFINITE_SCROLL_CONFIG,
  type SortField,
  type SortOrder,
  type InfiniteScrollCursor,
  type InfiniteScrollResult,
  type EntryWithPreview,
} from "./types";

// ============================================================================
// SERIALIZATION
// ============================================================================

interface EntrySerialized {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
  createdAt: string;
  updatedAt: string;
}

function serializeEntry(entry: LexicalEntry): EntrySerialized {
  return {
    id: entry.id,
    lemma: entry.lemma,
    partOfSpeech: entry.part_of_speech,
    languageCode: entry.language_code,
    createdAt: entry.created_at?.toISOString() ?? new Date().toISOString(),
    updatedAt: entry.updated_at?.toISOString() ?? new Date().toISOString(),
  };
}

// ============================================================================
// SORT HELPERS
// ============================================================================

function getSortColumn(sortBy: SortField) {
  return sortBy === "lemma"
    ? lexicalEntries.lemma
    : sortBy === "created_at"
      ? lexicalEntries.created_at
      : lexicalEntries.updated_at;
}

function getSortValue(entry: LexicalEntry, sortBy: SortField): string {
  if (sortBy === "lemma") return entry.lemma;
  if (sortBy === "created_at") return entry.created_at?.toISOString() ?? "";
  return entry.updated_at?.toISOString() ?? "";
}

function buildCursorCondition(
  cursor: InfiniteScrollCursor | null,
  sortBy: SortField,
  sortOrder: SortOrder
) {
  if (!cursor) return undefined;

  const sortColumn = getSortColumn(sortBy);
  const { afterSortValue, afterId } = cursor;

  const cursorValue = sortBy === "lemma"
    ? afterSortValue
    : new Date(afterSortValue);

  if (sortOrder === "asc") {
    return or(
      gt(sortColumn, cursorValue),
      and(eq(sortColumn, cursorValue), gt(lexicalEntries.id, afterId))
    );
  }
  return or(
    lt(sortColumn, cursorValue),
    and(eq(sortColumn, cursorValue), lt(lexicalEntries.id, afterId))
  );
}

// ============================================================================
// FILTER RESOLUTION
// ============================================================================

/**
 * Resolve filter criteria to entry IDs.
 * Tags are on senses, sources are on examples → senses → entries.
 */
export async function resolveFilterEntryIds(options: {
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<Set<number> | null> {
  const { tagIds, sourceIds, sourcePartIds } = options;
  const hasTagFilter = tagIds && tagIds.length > 0;
  const hasSourceFilter = sourceIds && sourceIds.length > 0;
  const hasSourcePartFilter = sourcePartIds && sourcePartIds.length > 0;

  if (!hasTagFilter && !hasSourceFilter && !hasSourcePartFilter) return null;

  const [tagEntryIds, sourceEntryIds, sourcePartEntryIds] = await Promise.all([
    // Tags → senseTags → senses → entries
    hasTagFilter
      ? neonDb
          .select({ entry_id: senses.entry_id })
          .from(senseTags)
          .innerJoin(senses, eq(senseTags.sense_id, senses.id))
          .where(inArray(senseTags.tag_id, tagIds))
          .then(rows => new Set(rows.map(r => r.entry_id)))
      : null,
    // Sources → sourceParts → examples → senses → entries
    hasSourceFilter
      ? neonDb
          .select({ entry_id: senses.entry_id })
          .from(sourceParts)
          .innerJoin(examples, eq(sourceParts.id, examples.source_part_id))
          .innerJoin(senses, eq(examples.sense_id, senses.id))
          .where(inArray(sourceParts.source_id, sourceIds))
          .then(rows => new Set(rows.map(r => r.entry_id)))
      : null,
    // SourceParts → examples → senses → entries
    hasSourcePartFilter
      ? neonDb
          .select({ entry_id: senses.entry_id })
          .from(examples)
          .innerJoin(senses, eq(examples.sense_id, senses.id))
          .where(inArray(examples.source_part_id, sourcePartIds))
          .then(rows => new Set(rows.map(r => r.entry_id)))
      : null,
  ]);

  // Combine source-related filters (OR between source and sourcePart)
  let sourceRelated: Set<number> | null = null;
  if (sourceEntryIds || sourcePartEntryIds) {
    sourceRelated = new Set<number>();
    if (sourceEntryIds) {
      for (const id of sourceEntryIds) sourceRelated.add(id);
    }
    if (sourcePartEntryIds) {
      for (const id of sourcePartEntryIds) sourceRelated.add(id);
    }
  }

  // Intersect tag filter with source filters (AND between tag and source)
  if (tagEntryIds && sourceRelated) {
    return new Set([...tagEntryIds].filter(id => sourceRelated.has(id)));
  }
  return tagEntryIds ?? sourceRelated ?? null;
}

// ============================================================================
// MAIN QUERIES
// ============================================================================

/** Cursor-based entry fetch with filters */
export const fetchEntriesWithCursor = cache(async (options: {
  cursor?: InfiniteScrollCursor | null;
  limit?: number;
  languageCode?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<InfiniteScrollResult<EntrySerialized>> => {
  const {
    cursor = null,
    limit = INFINITE_SCROLL_CONFIG.defaultLimit,
    languageCode,
    sortBy = "updated_at",
    sortOrder = "desc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;

  const empty: InfiniteScrollResult<EntrySerialized> = {
    data: [],
    pageInfo: { hasNextPage: false, endCursor: null, totalCount: 0 },
  };

  const filterEntryIds = await resolveFilterEntryIds({ tagIds, sourceIds, sourcePartIds });
  if (filterEntryIds !== null && filterEntryIds.size === 0) return empty;

  const conditions = [];
  if (languageCode) conditions.push(eq(lexicalEntries.language_code, languageCode));
  if (filterEntryIds !== null) conditions.push(inArray(lexicalEntries.id, [...filterEntryIds]));

  const cursorCondition = buildCursorCondition(cursor, sortBy, sortOrder);
  if (cursorCondition) conditions.push(cursorCondition);

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Count conditions (without cursor)
  const countConditions = [];
  if (languageCode) countConditions.push(eq(lexicalEntries.language_code, languageCode));
  if (filterEntryIds !== null) countConditions.push(inArray(lexicalEntries.id, [...filterEntryIds]));
  const countWhere = countConditions.length > 0 ? and(...countConditions) : undefined;

  const sortColumn = getSortColumn(sortBy);

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(lexicalEntries).where(countWhere),
    neonDb
      .select()
      .from(lexicalEntries)
      .where(whereClause)
      .limit(limit + 1)
      .orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
        asc(lexicalEntries.id)
      ),
  ]);

  const hasNextPage = dataResult.length > limit;
  const data = hasNextPage ? dataResult.slice(0, -1) : dataResult;
  const lastItem = data.at(-1);

  return {
    data: data.map(serializeEntry),
    pageInfo: {
      hasNextPage,
      endCursor: lastItem
        ? {
            afterId: lastItem.id,
            afterSortValue: getSortValue(lastItem, sortBy),
            sortBy,
            sortOrder,
          }
        : null,
      totalCount: countResult[0].totalCount,
    },
  };
});

/** Cursor-based search with filters */
export const searchEntriesWithCursor = cache(async (options: {
  query: string;
  cursor?: InfiniteScrollCursor | null;
  limit?: number;
  languageCode?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<InfiniteScrollResult<EntrySerialized>> => {
  const {
    query,
    cursor = null,
    limit = INFINITE_SCROLL_CONFIG.searchLimit,
    languageCode = "en",
    sortBy = "lemma",
    sortOrder = "asc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;

  const empty: InfiniteScrollResult<EntrySerialized> = {
    data: [],
    pageInfo: { hasNextPage: false, endCursor: null, totalCount: 0 },
  };

  const filterEntryIds = await resolveFilterEntryIds({ tagIds, sourceIds, sourcePartIds });
  if (filterEntryIds !== null && filterEntryIds.size === 0) return empty;

  const conditions = [
    ilike(lexicalEntries.lemma, `${query}%`),
    eq(lexicalEntries.language_code, languageCode),
  ];
  if (filterEntryIds !== null) conditions.push(inArray(lexicalEntries.id, [...filterEntryIds]));

  const cursorCondition = buildCursorCondition(cursor, sortBy, sortOrder);
  if (cursorCondition) conditions.push(cursorCondition);

  const whereClause = and(...conditions);

  // Count conditions (without cursor)
  const countConditions = [
    ilike(lexicalEntries.lemma, `${query}%`),
    eq(lexicalEntries.language_code, languageCode),
  ];
  if (filterEntryIds !== null) countConditions.push(inArray(lexicalEntries.id, [...filterEntryIds]));
  const countWhere = and(...countConditions);

  const sortColumn = getSortColumn(sortBy);

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(lexicalEntries).where(countWhere),
    neonDb
      .select()
      .from(lexicalEntries)
      .where(whereClause)
      .limit(limit + 1)
      .orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
        asc(lexicalEntries.id)
      ),
  ]);

  const hasNextPage = dataResult.length > limit;
  const data = hasNextPage ? dataResult.slice(0, -1) : dataResult;
  const lastItem = data.at(-1);

  return {
    data: data.map(serializeEntry),
    pageInfo: {
      hasNextPage,
      endCursor: lastItem
        ? {
            afterId: lastItem.id,
            afterSortValue: getSortValue(lastItem, sortBy),
            sortBy,
            sortOrder,
          }
        : null,
      totalCount: countResult[0].totalCount,
    },
  };
});

// ============================================================================
// PREVIEW DATA
// ============================================================================

/** Fetch first sense definition and example for entries (for list preview) */
export const fetchFirstSenseForEntries = cache(
  async function fetchFirstSenseForEntries(
    entryIds: number[]
  ): Promise<Map<number, { definition: string; exampleText: string | null }>> {
    if (entryIds.length === 0) return new Map();

    // Get first sense per entry (ordered by order_index)
    const sensesData = await neonDb
      .select({
        entry_id: senses.entry_id,
        sense_id: senses.id,
        definition: senses.definition,
      })
      .from(senses)
      .where(inArray(senses.entry_id, entryIds))
      .orderBy(asc(senses.order_index));

    const firstSense = new Map<number, { sense_id: number; definition: string }>();
    for (const s of sensesData) {
      if (!firstSense.has(s.entry_id)) {
        firstSense.set(s.entry_id, {
          sense_id: s.sense_id,
          definition: s.definition,
        });
      }
    }

    const senseIds = [...firstSense.values()].map(s => s.sense_id);
    if (senseIds.length === 0) return new Map();

    // Get first example per sense
    const examplesData = await neonDb
      .select({
        sense_id: examples.sense_id,
        text: examples.text,
      })
      .from(examples)
      .where(inArray(examples.sense_id, senseIds));

    const firstExample = new Map<number, string>();
    for (const e of examplesData) {
      if (!firstExample.has(e.sense_id)) {
        firstExample.set(e.sense_id, e.text);
      }
    }

    // Build result map
    const result = new Map<number, { definition: string; exampleText: string | null }>();
    for (const [entryId, sense] of firstSense) {
      result.set(entryId, {
        definition: sense.definition,
        exampleText: firstExample.get(sense.sense_id) ?? null,
      });
    }
    return result;
  }
);

/** Build EntryWithPreview from entry data and sense preview */
export function buildEntryWithPreview(
  entry: EntrySerialized,
  preview: { definition: string; exampleText: string | null } | undefined
): EntryWithPreview {
  return {
    id: entry.id,
    lemma: entry.lemma,
    partOfSpeech: entry.partOfSpeech,
    languageCode: entry.languageCode,
    definition: preview?.definition ?? null,
    exampleText: preview?.exampleText ?? null,
  };
}
