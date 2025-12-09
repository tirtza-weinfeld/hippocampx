/**
 * Word Queries - Cursor-based infinite scroll
 */

import "server-only";

import { cache } from "react";
import { eq, and, ilike, asc, desc, inArray, count, or, gt, lt } from "drizzle-orm";
import { neonDb } from "../../connection";
import {
  words,
  definitions,
  examples,
  wordTags,
  sourceParts,
  type Word,
  type WordSerialized,
} from "../../schema";
import {
  INFINITE_SCROLL_CONFIG,
  type SortField,
  type SortOrder,
  type InfiniteScrollCursor,
  type InfiniteScrollResult,
} from "./types";

export type { WordSerialized };

function serializeWord(word: Word): WordSerialized {
  return {
    ...word,
    created_at: word.created_at.toISOString(),
    updated_at: word.updated_at.toISOString(),
  };
}

function getSortColumn(sortBy: SortField) {
  return sortBy === "word_text"
    ? words.word_text
    : sortBy === "created_at"
      ? words.created_at
      : words.updated_at;
}

export async function resolveFilterWordIds(options: {
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<Set<number> | null> {
  const { tagIds, sourceIds, sourcePartIds } = options;
  const hasTagFilter = tagIds && tagIds.length > 0;
  const hasSourceFilter = sourceIds && sourceIds.length > 0;
  const hasSourcePartFilter = sourcePartIds && sourcePartIds.length > 0;

  if (!hasTagFilter && !hasSourceFilter && !hasSourcePartFilter) return null;

  const [tagWordIds, sourceWordIds, sourcePartWordIds] = await Promise.all([
    hasTagFilter
      ? neonDb
          .select({ word_id: wordTags.word_id })
          .from(wordTags)
          .where(inArray(wordTags.tag_id, tagIds))
          .then(rows => new Set(rows.map(r => r.word_id)))
      : null,
    hasSourceFilter
      ? neonDb
          .select({ word_id: definitions.word_id })
          .from(sourceParts)
          .innerJoin(examples, eq(sourceParts.id, examples.source_part_id))
          .innerJoin(definitions, eq(examples.definition_id, definitions.id))
          .where(inArray(sourceParts.source_id, sourceIds))
          .then(rows => new Set(rows.map(r => r.word_id)))
      : null,
    hasSourcePartFilter
      ? neonDb
          .select({ word_id: definitions.word_id })
          .from(examples)
          .innerJoin(definitions, eq(examples.definition_id, definitions.id))
          .where(inArray(examples.source_part_id, sourcePartIds))
          .then(rows => new Set(rows.map(r => r.word_id)))
      : null,
  ]);

  let sourceRelated: Set<number> | null = null;
  if (sourceWordIds || sourcePartWordIds) {
    sourceRelated = new Set<number>();
    if (sourceWordIds) {
      for (const id of sourceWordIds) sourceRelated.add(id);
    }
    if (sourcePartWordIds) {
      for (const id of sourcePartWordIds) sourceRelated.add(id);
    }
  }

  if (tagWordIds && sourceRelated) {
    return new Set([...tagWordIds].filter(id => sourceRelated.has(id)));
  }
  return tagWordIds ?? sourceRelated ?? null;
}

/** Build cursor condition for WHERE clause */
function buildCursorCondition(
  cursor: InfiniteScrollCursor | null,
  sortBy: SortField,
  sortOrder: SortOrder
) {
  if (!cursor) return undefined;

  const sortColumn = getSortColumn(sortBy);
  const { afterSortValue, afterId } = cursor;

  // For date fields, convert ISO string back to Date for drizzle comparison
  const cursorValue = sortBy === "word_text"
    ? afterSortValue
    : new Date(afterSortValue);

  // Composite cursor: (sortValue, id) > (lastSortValue, lastId)
  if (sortOrder === "asc") {
    return or(
      gt(sortColumn, cursorValue),
      and(eq(sortColumn, cursorValue), gt(words.id, afterId))
    );
  }
  return or(
    lt(sortColumn, cursorValue),
    and(eq(sortColumn, cursorValue), lt(words.id, afterId))
  );
}

/** Get sort value from word based on sortBy field */
function getSortValue(word: Word, sortBy: SortField): string {
  if (sortBy === "word_text") return word.word_text;
  if (sortBy === "created_at") return word.created_at.toISOString();
  return word.updated_at.toISOString();
}

/** Cursor-based word fetch with filters */
export const fetchWordsWithCursor = cache(async (options: {
  cursor?: InfiniteScrollCursor | null;
  limit?: number;
  languageCode?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<InfiniteScrollResult<WordSerialized>> => {
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

  const empty: InfiniteScrollResult<WordSerialized> = {
    data: [],
    pageInfo: { hasNextPage: false, endCursor: null, totalCount: 0 },
  };

  const filterWordIds = await resolveFilterWordIds({ tagIds, sourceIds, sourcePartIds });
  if (filterWordIds !== null && filterWordIds.size === 0) return empty;

  const conditions = [];
  // Only show base forms (words without a parent base word)
  conditions.push(eq(words.form_type, "base"));
  if (languageCode) conditions.push(eq(words.language_code, languageCode));
  if (filterWordIds !== null) conditions.push(inArray(words.id, [...filterWordIds]));

  const cursorCondition = buildCursorCondition(cursor, sortBy, sortOrder);
  if (cursorCondition) conditions.push(cursorCondition);

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Build count conditions (without cursor for total)
  const countConditions = [];
  // Only count base forms
  countConditions.push(eq(words.form_type, "base"));
  if (languageCode) countConditions.push(eq(words.language_code, languageCode));
  if (filterWordIds !== null) countConditions.push(inArray(words.id, [...filterWordIds]));
  const countWhere = and(...countConditions);

  const sortColumn = getSortColumn(sortBy);

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(words).where(countWhere),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(limit + 1) // Fetch one extra to check hasNextPage
      .orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
        asc(words.id) // Tiebreaker
      ),
  ]);

  const hasNextPage = dataResult.length > limit;
  const data = hasNextPage ? dataResult.slice(0, -1) : dataResult;
  const lastItem = data.at(-1);

  return {
    data: data.map(serializeWord),
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
export const searchWordsWithCursor = cache(async (options: {
  query: string;
  cursor?: InfiniteScrollCursor | null;
  limit?: number;
  languageCode?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<InfiniteScrollResult<WordSerialized>> => {
  const {
    query,
    cursor = null,
    limit = INFINITE_SCROLL_CONFIG.searchLimit,
    languageCode = "en",
    sortBy = "word_text",
    sortOrder = "asc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;

  const empty: InfiniteScrollResult<WordSerialized> = {
    data: [],
    pageInfo: { hasNextPage: false, endCursor: null, totalCount: 0 },
  };

  const filterWordIds = await resolveFilterWordIds({ tagIds, sourceIds, sourcePartIds });
  if (filterWordIds !== null && filterWordIds.size === 0) return empty;

  const conditions = [
    // Only show base forms
    eq(words.form_type, "base"),
    ilike(words.word_text, `${query}%`),
    eq(words.language_code, languageCode),
  ];
  if (filterWordIds !== null) conditions.push(inArray(words.id, [...filterWordIds]));

  const cursorCondition = buildCursorCondition(cursor, sortBy, sortOrder);
  if (cursorCondition) conditions.push(cursorCondition);

  const whereClause = and(...conditions);

  // Count conditions (without cursor)
  const countConditions = [
    // Only count base forms
    eq(words.form_type, "base"),
    ilike(words.word_text, `${query}%`),
    eq(words.language_code, languageCode),
  ];
  if (filterWordIds !== null) countConditions.push(inArray(words.id, [...filterWordIds]));
  const countWhere = and(...countConditions);

  const sortColumn = getSortColumn(sortBy);

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(words).where(countWhere),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(limit + 1)
      .orderBy(
        sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
        asc(words.id)
      ),
  ]);

  const hasNextPage = dataResult.length > limit;
  const data = hasNextPage ? dataResult.slice(0, -1) : dataResult;
  const lastItem = data.at(-1);

  return {
    data: data.map(serializeWord),
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

export const fetchFirstDefinitionForWords = cache(
  async function fetchFirstDefinitionForWords(
    wordIds: number[]
  ): Promise<Map<number, { definition_text: string; example_text: string | null }>> {
    if (wordIds.length === 0) return new Map();

    const defs = await neonDb
      .select({
        word_id: definitions.word_id,
        definition_text: definitions.definition_text,
        definition_id: definitions.id,
      })
      .from(definitions)
      .where(inArray(definitions.word_id, wordIds))
      .orderBy(asc(definitions.order));

    const firstDef = new Map<number, { definition_id: number; definition_text: string }>();
    for (const d of defs) {
      if (!firstDef.has(d.word_id)) {
        firstDef.set(d.word_id, {
          definition_id: d.definition_id,
          definition_text: d.definition_text,
        });
      }
    }

    const defIds = [...firstDef.values()].map(d => d.definition_id);
    if (defIds.length === 0) return new Map();

    const exs = await neonDb
      .select({
        definition_id: examples.definition_id,
        example_text: examples.example_text,
      })
      .from(examples)
      .where(inArray(examples.definition_id, defIds));

    const firstEx = new Map<number, string>();
    for (const e of exs) {
      if (!firstEx.has(e.definition_id)) {
        firstEx.set(e.definition_id, e.example_text);
      }
    }

    const result = new Map<number, { definition_text: string; example_text: string | null }>();
    for (const [wordId, def] of firstDef) {
      result.set(wordId, {
        definition_text: def.definition_text,
        example_text: firstEx.get(def.definition_id) ?? null,
      });
    }
    return result;
  }
);
