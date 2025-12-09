/**
 * Word Queries - Core word fetching and search
 */

import "server-only";

import { cache } from "react";
import { eq, and, ilike, asc, desc, inArray, count } from "drizzle-orm";
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

type SortField = "word_text" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export type { WordSerialized };

function serializeWord(word: Word): WordSerialized {
  return {
    ...word,
    created_at: word.created_at.toISOString(),
    updated_at: word.updated_at.toISOString(),
  };
}

function getOrderBy(sortBy: SortField, sortOrder: SortOrder) {
  const column =
    sortBy === "word_text"
      ? words.word_text
      : sortBy === "created_at"
        ? words.created_at
        : words.updated_at;
  return sortOrder === "asc" ? asc(column) : desc(column);
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

export const fetchWordsPaginated = cache(async function fetchWordsPaginated(options: {
  languageCode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<PaginatedResponse<WordSerialized>> {
  const {
    languageCode,
    page = 1,
    pageSize = 50,
    sortBy = "updated_at",
    sortOrder = "desc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;
  const offset = (page - 1) * pageSize;
  const empty: PaginatedResponse<WordSerialized> = {
    data: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
    hasMore: false,
  };

  const filterWordIds = await resolveFilterWordIds({ tagIds, sourceIds, sourcePartIds });
  if (filterWordIds !== null && filterWordIds.size === 0) return empty;

  const conditions = [];
  if (languageCode) conditions.push(eq(words.language_code, languageCode));
  if (filterWordIds !== null) conditions.push(inArray(words.id, [...filterWordIds]));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(words).where(whereClause),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)
      .orderBy(getOrderBy(sortBy, sortOrder)),
  ]);

  const total = countResult[0].totalCount;
  return {
    data: dataResult.map(serializeWord),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasMore: page < Math.ceil(total / pageSize),
  };
});

export const searchWords = cache(async function searchWords(options: {
  query: string;
  languageCode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}): Promise<PaginatedResponse<WordSerialized>> {
  const {
    query,
    languageCode = "en",
    page = 1,
    pageSize = 20,
    sortBy = "word_text",
    sortOrder = "asc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;
  const offset = (page - 1) * pageSize;
  const empty: PaginatedResponse<WordSerialized> = {
    data: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
    hasMore: false,
  };

  const filterWordIds = await resolveFilterWordIds({ tagIds, sourceIds, sourcePartIds });
  if (filterWordIds !== null && filterWordIds.size === 0) return empty;

  const conditions = [
    ilike(words.word_text, `${query}%`),
    eq(words.language_code, languageCode),
  ];
  if (filterWordIds !== null) conditions.push(inArray(words.id, [...filterWordIds]));
  const whereClause = and(...conditions);

  const [countResult, dataResult] = await Promise.all([
    neonDb.select({ totalCount: count() }).from(words).where(whereClause),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)
      .orderBy(getOrderBy(sortBy, sortOrder)),
  ]);

  const total = countResult[0].totalCount;
  return {
    data: dataResult.map(serializeWord),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasMore: page < Math.ceil(total / pageSize),
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
