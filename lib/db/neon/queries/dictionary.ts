/**
 * Dictionary Queries - Neon Database
 */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { eq, and, or, ilike, asc, desc, inArray, count } from "drizzle-orm";
import { neonDb } from "../connection";
import {
  words,
  definitions,
  examples,
  tags,
  wordTags,
  wordRelations,
  wordForms,
  sources,
  sourceParts,
  type Word,
  type Definition,
  type Example,
  type Tag,
  type WordForm,
  type Source,
  type SourcePart,
  type WordSerialized,
  type DefinitionSerialized,
  type ExampleSerialized,
  type TagSerialized,
  type WordComplete,
  type DefinitionWithExamples,
} from "../schema";

// ============================================================================
// Types
// ============================================================================

export type SortField = "word_text" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";
export type SearchMode = "prefix" | "contains" | "exact";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FetchWordsOptions {
  languageCode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}

export interface SearchWordsOptions {
  query: string;
  languageCode?: string;
  mode?: SearchMode;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}

// Re-export serialized types for API compatibility
export type {
  WordSerialized as Word,
  DefinitionSerialized as Definition,
  ExampleSerialized as Example,
  TagSerialized as Tag,
  WordComplete,
  DefinitionWithExamples,
};

export type WordFormSerialized = WordForm;

// ============================================================================
// Serialization Helpers
// ============================================================================

function serializeWord(word: Word): WordSerialized {
  return {
    ...word,
    created_at: word.created_at.toISOString(),
    updated_at: word.updated_at.toISOString(),
  };
}

function serializeTag(tag: Tag): TagSerialized {
  return { ...tag };
}

// ============================================================================
// Sorting Helper
// ============================================================================

function getSortColumn(sortBy: SortField) {
  switch (sortBy) {
    case "word_text":
      return words.word_text;
    case "created_at":
      return words.created_at;
    case "updated_at":
      return words.updated_at;
    default:
      return words.updated_at;
  }
}

function getOrderBy(sortBy: SortField, sortOrder: SortOrder) {
  const column = getSortColumn(sortBy);
  return sortOrder === "asc" ? asc(column) : desc(column);
}

// ============================================================================
// Filter Helper - Optimized filter intersection
// ============================================================================

interface FilterOptions {
  tagIds?: number[];
  sourceIds?: number[];
  sourcePartIds?: number[];
}

/**
 * Resolves filter IDs to word IDs using optimized queries.
 * Returns null if no filters are applied, or Set of matching word IDs.
 * Returns empty Set if filters match no words.
 */
async function resolveFilterWordIds(
  options: FilterOptions
): Promise<Set<number> | null> {
  const { tagIds, sourceIds, sourcePartIds } = options;
  const hasTagFilter = tagIds && tagIds.length > 0;
  const hasSourceFilter = sourceIds && sourceIds.length > 0;
  const hasSourcePartFilter = sourcePartIds && sourcePartIds.length > 0;

  if (!hasTagFilter && !hasSourceFilter && !hasSourcePartFilter) {
    return null;
  }

  // Run filter queries in parallel
  const filterPromises: Promise<Set<number>>[] = [];

  // Tag filter - single query
  if (hasTagFilter) {
    filterPromises.push(
      neonDb
        .select({ word_id: wordTags.word_id })
        .from(wordTags)
        .where(inArray(wordTags.tag_id, tagIds))
        .then(function collectWordIds(rows) {
          return new Set(rows.map(function getId(r) { return r.word_id; }));
        })
    );
  }

  // Source filter - single JOIN query instead of 3 separate queries
  if (hasSourceFilter) {
    filterPromises.push(
      neonDb
        .select({ word_id: definitions.word_id })
        .from(sourceParts)
        .innerJoin(examples, eq(sourceParts.id, examples.source_part_id))
        .innerJoin(definitions, eq(examples.definition_id, definitions.id))
        .where(inArray(sourceParts.source_id, sourceIds))
        .then(function collectWordIds(rows) {
          return new Set(rows.map(function getId(r) { return r.word_id; }));
        })
    );
  }

  // Source part filter - single JOIN query instead of 2 separate queries
  if (hasSourcePartFilter) {
    filterPromises.push(
      neonDb
        .select({ word_id: definitions.word_id })
        .from(examples)
        .innerJoin(definitions, eq(examples.definition_id, definitions.id))
        .where(inArray(examples.source_part_id, sourcePartIds))
        .then(function collectWordIds(rows) {
          return new Set(rows.map(function getId(r) { return r.word_id; }));
        })
    );
  }

  const filterResults = await Promise.all(filterPromises);

  // Intersect all filter results
  let result = filterResults[0];
  for (let i = 1; i < filterResults.length; i++) {
    const nextSet = filterResults[i];
    result = new Set([...result].filter(function intersect(id) {
      return nextSet.has(id);
    }));
  }

  return result;
}

// ============================================================================
// Word Queries - Paginated
// ============================================================================

export const fetchWords = cache(async function fetchWords(
  languageCode?: string,
  pageSize: number = 50,
  offset: number = 0
): Promise<WordSerialized[]> {
  const page = Math.floor(offset / pageSize) + 1;
  const result = await fetchWordsPaginated({
    languageCode,
    page,
    pageSize,
  });
  return result.data;
});

export const fetchWordsPaginated = cache(async function fetchWordsPaginated(
  options: FetchWordsOptions = {}
): Promise<PaginatedResponse<WordSerialized>> {
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
  const emptyResult: PaginatedResponse<WordSerialized> = {
    data: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
    hasMore: false,
  };

  // Resolve filters using optimized parallel queries
  const filterWordIds = await resolveFilterWordIds({
    tagIds,
    sourceIds,
    sourcePartIds,
  });

  // If filters were applied but no words match, return empty
  if (filterWordIds !== null && filterWordIds.size === 0) {
    return emptyResult;
  }

  // Build conditions
  const conditions = [];
  if (languageCode) {
    conditions.push(eq(words.language_code, languageCode));
  }
  if (filterWordIds !== null) {
    conditions.push(inArray(words.id, [...filterWordIds]));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Run count and data queries in parallel
  const [countResult, dataResult] = await Promise.all([
    neonDb
      .select({ totalCount: count() })
      .from(words)
      .where(whereClause),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)
      .orderBy(getOrderBy(sortBy, sortOrder)),
  ]);

  const total = countResult[0].totalCount;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: dataResult.map(serializeWord),
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
});

// ============================================================================
// Search Queries
// ============================================================================

export const searchWordsByPrefix = cache(async function searchWordsByPrefix(
  prefix: string,
  languageCode: string = "en",
  limit: number = 20
): Promise<WordSerialized[]> {
  const result = await searchWords({
    query: prefix,
    languageCode,
    mode: "prefix",
    pageSize: limit,
  });
  return result.data;
});

export const searchWords = cache(async function searchWords(
  options: SearchWordsOptions
): Promise<PaginatedResponse<WordSerialized>> {
  const {
    query,
    languageCode = "en",
    mode = "prefix",
    page = 1,
    pageSize = 20,
    sortBy = "word_text",
    sortOrder = "asc",
    tagIds,
    sourceIds,
    sourcePartIds,
  } = options;

  const offset = (page - 1) * pageSize;
  const emptyResult: PaginatedResponse<WordSerialized> = {
    data: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
    hasMore: false,
  };

  // Resolve filters using optimized parallel queries
  const filterWordIds = await resolveFilterWordIds({
    tagIds,
    sourceIds,
    sourcePartIds,
  });

  // If filters were applied but no words match, return empty
  if (filterWordIds !== null && filterWordIds.size === 0) {
    return emptyResult;
  }

  // Build search condition
  let searchCondition;
  switch (mode) {
    case "exact":
      searchCondition = ilike(words.word_text, query);
      break;
    case "contains":
      searchCondition = ilike(words.word_text, `%${query}%`);
      break;
    case "prefix":
    default:
      searchCondition = ilike(words.word_text, `${query}%`);
      break;
  }

  // Build conditions
  const conditions = [searchCondition, eq(words.language_code, languageCode)];
  if (filterWordIds !== null) {
    conditions.push(inArray(words.id, [...filterWordIds]));
  }

  const whereClause = and(...conditions);

  // Run count and data queries in parallel
  const [countResult, dataResult] = await Promise.all([
    neonDb
      .select({ totalCount: count() })
      .from(words)
      .where(whereClause),
    neonDb
      .select()
      .from(words)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)
      .orderBy(getOrderBy(sortBy, sortOrder)),
  ]);

  const total = countResult[0].totalCount;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: dataResult.map(serializeWord),
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
});

// ============================================================================
// Single Word Queries
// ============================================================================

export const fetchWordById = cache(async function fetchWordById(
  wordId: number
): Promise<WordSerialized | null> {
  const result = await neonDb
    .select()
    .from(words)
    .where(eq(words.id, wordId));

  const word = result.at(0);
  return word ? serializeWord(word) : null;
});

export const fetchWordByText = cache(async function fetchWordByText(
  wordText: string,
  languageCode: string = "en"
): Promise<WordSerialized | null> {
  const result = await neonDb
    .select()
    .from(words)
    .where(and(eq(words.word_text, wordText), eq(words.language_code, languageCode)));

  const word = result.at(0);
  return word ? serializeWord(word) : null;
});

// ============================================================================
// Word CRUD Operations
// ============================================================================

export async function createWord(
  wordText: string,
  languageCode: string = "en"
): Promise<Word> {
  const [word] = await neonDb
    .insert(words)
    .values({
      word_text: wordText,
      language_code: languageCode,
    })
    .returning();

  return word;
}

export async function updateWord(
  wordId: number,
  wordText: string,
  languageCode: string
): Promise<Word> {
  const [word] = await neonDb
    .update(words)
    .set({
      word_text: wordText,
      language_code: languageCode,
      updated_at: new Date(),
    })
    .where(eq(words.id, wordId))
    .returning();

  return word;
}

export async function deleteWord(wordId: number): Promise<void> {
  await neonDb.delete(words).where(eq(words.id, wordId));
}

// ============================================================================
// Batch Word Operations
// ============================================================================

export async function createWordsBatch(
  wordData: Array<{ wordText: string; languageCode?: string }>
): Promise<Word[]> {
  if (wordData.length === 0) return [];

  const values = wordData.map((w) => ({
    word_text: w.wordText,
    language_code: w.languageCode ?? "en",
  }));

  const result = await neonDb.insert(words).values(values).returning();
  return result;
}

export async function deleteWordsBatch(wordIds: number[]): Promise<void> {
  if (wordIds.length === 0) return;
  await neonDb.delete(words).where(inArray(words.id, wordIds));
}

// ============================================================================
// Definition Queries
// ============================================================================

export const fetchDefinitionsByWordId = cache(async function fetchDefinitionsByWordId(
  wordId: number
): Promise<DefinitionWithExamples[]> {
  // Single query fetches definitions with examples and source info - eliminates N+1
  const rows = await neonDb
    .select({
      def_id: definitions.id,
      def_word_id: definitions.word_id,
      def_text: definitions.definition_text,
      def_pos: definitions.part_of_speech,
      def_order: definitions.order,
      ex_id: examples.id,
      ex_definition_id: examples.definition_id,
      ex_text: examples.example_text,
      ex_source_part_id: examples.source_part_id,
      sp_name: sourceParts.name,
      src_title: sources.title,
      src_type: sources.type,
    })
    .from(definitions)
    .leftJoin(examples, eq(definitions.id, examples.definition_id))
    .leftJoin(sourceParts, eq(examples.source_part_id, sourceParts.id))
    .leftJoin(sources, eq(sourceParts.source_id, sources.id))
    .where(eq(definitions.word_id, wordId))
    .orderBy(asc(definitions.order));

  // Group examples by definition
  const defMap = new Map<
    number,
    {
      definition: DefinitionSerialized;
      examples: Array<{
        id: number;
        definition_id: number;
        example_text: string;
        source_part_id: number | null;
        source_part_name: string | null;
        source_title: string | null;
        source_type: string | null;
      }>;
    }
  >();

  for (const row of rows) {
    if (!defMap.has(row.def_id)) {
      defMap.set(row.def_id, {
        definition: {
          id: row.def_id,
          word_id: row.def_word_id,
          definition_text: row.def_text,
          part_of_speech: row.def_pos,
          order: row.def_order,
        },
        examples: [],
      });
    }

    if (row.ex_id !== null && row.ex_definition_id !== null && row.ex_text !== null) {
      const defEntry = defMap.get(row.def_id);
      if (defEntry) {
        defEntry.examples.push({
          id: row.ex_id,
          definition_id: row.ex_definition_id,
          example_text: row.ex_text,
          source_part_id: row.ex_source_part_id,
          source_part_name: row.sp_name,
          source_title: row.src_title,
          source_type: row.src_type,
        });
      }
    }
  }

  // Convert to array maintaining order
  const result: DefinitionWithExamples[] = [];
  const seenIds = new Set<number>();

  for (const row of rows) {
    if (!seenIds.has(row.def_id)) {
      seenIds.add(row.def_id);
      const entry = defMap.get(row.def_id);
      if (entry) {
        result.push({
          ...entry.definition,
          examples: entry.examples,
        });
      }
    }
  }

  return result;
});

export async function createDefinition(
  wordId: number,
  definitionText: string,
  partOfSpeech: string | null,
  order: number = 0
): Promise<Definition> {
  const pos = (partOfSpeech?.toLowerCase() ?? "other") as Definition["part_of_speech"];

  const [definition] = await neonDb
    .insert(definitions)
    .values({
      word_id: wordId,
      definition_text: definitionText,
      part_of_speech: pos,
      order,
    })
    .returning();

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));

  return definition;
}

export async function updateDefinition(
  definitionId: number,
  definitionText: string,
  partOfSpeech: string | null
): Promise<Definition> {
  const pos = (partOfSpeech?.toLowerCase() ?? "other") as Definition["part_of_speech"];

  const [definition] = await neonDb
    .update(definitions)
    .set({
      definition_text: definitionText,
      part_of_speech: pos,
    })
    .where(eq(definitions.id, definitionId))
    .returning();

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, definition.word_id));

  return definition;
}

export async function deleteDefinition(definitionId: number): Promise<void> {
  const defResult = await neonDb
    .select({ word_id: definitions.word_id })
    .from(definitions)
    .where(eq(definitions.id, definitionId));

  const def = defResult.at(0);

  await neonDb.delete(definitions).where(eq(definitions.id, definitionId));

  if (def) {
    await neonDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, def.word_id));
  }
}

// ============================================================================
// Example Queries
// ============================================================================

export async function createExample(
  definitionId: number,
  exampleText: string,
  sourcePartId?: number
): Promise<Example> {
  const [example] = await neonDb
    .insert(examples)
    .values({
      definition_id: definitionId,
      example_text: exampleText,
      source_part_id: sourcePartId ?? null,
    })
    .returning();

  return example;
}

export async function updateExample(
  exampleId: number,
  exampleText: string,
  sourcePartId?: number
): Promise<Example> {
  const [example] = await neonDb
    .update(examples)
    .set({
      example_text: exampleText,
      source_part_id: sourcePartId ?? null,
    })
    .where(eq(examples.id, exampleId))
    .returning();

  return example;
}

export async function deleteExample(exampleId: number): Promise<void> {
  await neonDb.delete(examples).where(eq(examples.id, exampleId));
}

// ============================================================================
// Tag Queries
// ============================================================================

export const fetchAllTags = cache(async function fetchAllTags(): Promise<TagSerialized[]> {
  const result = await neonDb.select().from(tags).orderBy(asc(tags.name));
  return result.map(serializeTag);
});

export const fetchTagsByWordId = cache(async function fetchTagsByWordId(
  wordId: number
): Promise<TagSerialized[]> {
  const wordTagRows = await neonDb
    .select({ tag_id: wordTags.tag_id })
    .from(wordTags)
    .where(eq(wordTags.word_id, wordId));

  if (wordTagRows.length === 0) {
    return [];
  }

  const tagIds = wordTagRows.map((row) => row.tag_id);
  const result = await neonDb
    .select()
    .from(tags)
    .where(inArray(tags.id, tagIds))
    .orderBy(asc(tags.name));

  return result.map(serializeTag);
});

export const fetchWordsByTag = cache(async function fetchWordsByTag(
  tagId: number,
  options: Omit<FetchWordsOptions, "tagIds"> = {}
): Promise<PaginatedResponse<WordSerialized>> {
  return fetchWordsPaginated({ ...options, tagIds: [tagId] });
});

export const fetchWordsByTags = cache(async function fetchWordsByTags(
  tagIds: number[],
  options: Omit<FetchWordsOptions, "tagIds"> = {}
): Promise<PaginatedResponse<WordSerialized>> {
  return fetchWordsPaginated({ ...options, tagIds });
});

export async function createTag(
  name: string,
  description?: string
): Promise<Tag> {
  const [tag] = await neonDb
    .insert(tags)
    .values({
      name,
      description: description ?? null,
    })
    .returning();

  return tag;
}

export async function updateTag(
  tagId: number,
  name: string,
  description?: string
): Promise<Tag> {
  const [tag] = await neonDb
    .update(tags)
    .set({
      name,
      description: description ?? null,
    })
    .where(eq(tags.id, tagId))
    .returning();

  return tag;
}

export async function deleteTag(tagId: number): Promise<void> {
  await neonDb.delete(tags).where(eq(tags.id, tagId));
}

export async function addTagToWord(
  wordId: number,
  tagId: number
): Promise<void> {
  const existing = await neonDb
    .select()
    .from(wordTags)
    .where(and(eq(wordTags.word_id, wordId), eq(wordTags.tag_id, tagId)));

  if (existing.length === 0) {
    await neonDb.insert(wordTags).values({ word_id: wordId, tag_id: tagId });

    await neonDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, wordId));
  }
}

export async function removeTagFromWord(
  wordId: number,
  tagId: number
): Promise<void> {
  await neonDb
    .delete(wordTags)
    .where(and(eq(wordTags.word_id, wordId), eq(wordTags.tag_id, tagId)));

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));
}

export async function setWordTags(
  wordId: number,
  tagIds: number[]
): Promise<void> {
  await neonDb.delete(wordTags).where(eq(wordTags.word_id, wordId));

  if (tagIds.length > 0) {
    await neonDb
      .insert(wordTags)
      .values(tagIds.map((tagId) => ({ word_id: wordId, tag_id: tagId })));
  }

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));
}

// ============================================================================
// Word Forms Queries
// ============================================================================

export const fetchWordFormsByWordId = cache(async function fetchWordFormsByWordId(
  wordId: number
): Promise<WordFormSerialized[]> {
  const result = await neonDb
    .select()
    .from(wordForms)
    .where(eq(wordForms.word_id, wordId))
    .orderBy(asc(wordForms.form_type), asc(wordForms.form_text));

  return result;
});

export async function createWordForm(
  wordId: number,
  formText: string,
  formType?: string
): Promise<WordForm> {
  const [form] = await neonDb
    .insert(wordForms)
    .values({
      word_id: wordId,
      form_text: formText,
      form_type: formType ?? null,
    })
    .returning();

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));

  return form;
}

export async function updateWordForm(
  formId: number,
  formText: string,
  formType?: string
): Promise<WordForm | undefined> {
  const result = await neonDb
    .update(wordForms)
    .set({
      form_text: formText,
      form_type: formType ?? null,
    })
    .where(eq(wordForms.id, formId))
    .returning();

  const form = result.at(0);
  if (form) {
    await neonDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, form.word_id));
  }

  return form;
}

export async function deleteWordForm(formId: number): Promise<void> {
  const formResult = await neonDb
    .select({ word_id: wordForms.word_id })
    .from(wordForms)
    .where(eq(wordForms.id, formId));

  const form = formResult.at(0);

  await neonDb.delete(wordForms).where(eq(wordForms.id, formId));

  if (form) {
    await neonDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, form.word_id));
  }
}

export async function setWordForms(
  wordId: number,
  forms: Array<{ formText: string; formType?: string }>
): Promise<WordForm[]> {
  await neonDb.delete(wordForms).where(eq(wordForms.word_id, wordId));

  if (forms.length === 0) return [];

  const result = await neonDb
    .insert(wordForms)
    .values(
      forms.map((f) => ({
        word_id: wordId,
        form_text: f.formText,
        form_type: f.formType ?? null,
      }))
    )
    .returning();

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));

  return result;
}

export const searchByWordForm = cache(async function searchByWordForm(
  formText: string,
  languageCode: string = "en"
): Promise<WordSerialized[]> {
  const matchingForms = await neonDb
    .select({ word_id: wordForms.word_id })
    .from(wordForms)
    .where(ilike(wordForms.form_text, formText));

  if (matchingForms.length === 0) return [];

  const wordIds = [...new Set(matchingForms.map((f) => f.word_id))];

  const result = await neonDb
    .select()
    .from(words)
    .where(and(inArray(words.id, wordIds), eq(words.language_code, languageCode)));

  return result.map(serializeWord);
});

// ============================================================================
// Word Relations Queries
// ============================================================================

export const fetchWordRelations = cache(async function fetchWordRelations(
  wordId: number
): Promise<
  Array<{
    word_id_1: number;
    word_id_2: number;
    relation_type: string;
    related_word_text: string;
    related_word_id: number;
  }>
> {
  // Fetch relations with related word info in single query - eliminates N+1
  const rawRelations = await neonDb
    .select({
      word_id_1: wordRelations.word_id_1,
      word_id_2: wordRelations.word_id_2,
      relation_type: wordRelations.relation_type,
    })
    .from(wordRelations)
    .where(or(eq(wordRelations.word_id_1, wordId), eq(wordRelations.word_id_2, wordId)));

  if (rawRelations.length === 0) {
    return [];
  }

  // Collect all related word IDs
  const relatedWordIds = rawRelations.map(function getRelatedId(relation) {
    return relation.word_id_1 === wordId ? relation.word_id_2 : relation.word_id_1;
  });

  // Single query to fetch all related words
  const relatedWords = await neonDb
    .select({ id: words.id, word_text: words.word_text })
    .from(words)
    .where(inArray(words.id, relatedWordIds));

  // Create lookup map
  const wordMap = new Map<number, string>();
  for (const w of relatedWords) {
    wordMap.set(w.id, w.word_text);
  }

  return rawRelations.map(function transformRelation(relation) {
    const relatedWordId =
      relation.word_id_1 === wordId ? relation.word_id_2 : relation.word_id_1;
    return {
      word_id_1: relation.word_id_1,
      word_id_2: relation.word_id_2,
      relation_type: relation.relation_type,
      related_word_text: wordMap.get(relatedWordId) ?? "",
      related_word_id: relatedWordId,
    };
  });
});

export async function createWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<void> {
  await neonDb.insert(wordRelations).values({
    word_id_1: wordId1,
    word_id_2: wordId2,
    relation_type: relationType as "synonym" | "antonym" | "hypernym" | "hyponym" | "meronym" | "holonym" | "related",
  });

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(inArray(words.id, [wordId1, wordId2]));
}

export async function deleteWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<void> {
  await neonDb
    .delete(wordRelations)
    .where(
      and(
        eq(wordRelations.word_id_1, wordId1),
        eq(wordRelations.word_id_2, wordId2),
        eq(wordRelations.relation_type, relationType as "synonym" | "antonym" | "hypernym" | "hyponym" | "meronym" | "holonym" | "related")
      )
    );

  await neonDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(inArray(words.id, [wordId1, wordId2]));
}

// ============================================================================
// Composite Queries
// ============================================================================

export const fetchWordCompleteByText = cache(async function fetchWordCompleteByText(
  wordText: string,
  languageCode: string = "en"
): Promise<WordComplete | null> {
  const wordResult = await neonDb
    .select()
    .from(words)
    .where(
      and(eq(words.word_text, wordText), eq(words.language_code, languageCode))
    );

  const word = wordResult.at(0);
  if (!word) {
    return null;
  }

  const [defs, wordTagsList, relations] = await Promise.all([
    fetchDefinitionsByWordId(word.id),
    fetchTagsByWordId(word.id),
    fetchWordRelations(word.id),
  ]);

  return {
    ...serializeWord(word),
    definitions: defs,
    tags: wordTagsList,
    relations,
  };
});

export const fetchWordComplete = cache(async function fetchWordComplete(
  wordId: number
): Promise<WordComplete | null> {
  const word = await fetchWordById(wordId);

  if (!word) {
    return null;
  }

  const [defs, wordTagsList, relations] = await Promise.all([
    fetchDefinitionsByWordId(word.id),
    fetchTagsByWordId(word.id),
    fetchWordRelations(word.id),
  ]);

  return {
    ...word,
    definitions: defs,
    tags: wordTagsList,
    relations,
  };
});

// ============================================================================
// Word Preview Queries (for list display)
// ============================================================================

export interface WordPreview {
  id: number;
  word_text: string;
  language_code: string;
  definition_text: string | null;
  example_text: string | null;
}

export const fetchFirstDefinitionForWords = cache(async function fetchFirstDefinitionForWords(
  wordIds: number[]
): Promise<Map<number, { definition_text: string; example_text: string | null }>> {
  if (wordIds.length === 0) {
    return new Map();
  }

  const defs = await neonDb
    .select({
      word_id: definitions.word_id,
      definition_text: definitions.definition_text,
      definition_id: definitions.id,
      order: definitions.order,
    })
    .from(definitions)
    .where(inArray(definitions.word_id, wordIds))
    .orderBy(asc(definitions.order));

  const firstDefByWord = new Map<number, { definition_id: number; definition_text: string }>();
  for (const def of defs) {
    if (!firstDefByWord.has(def.word_id)) {
      firstDefByWord.set(def.word_id, {
        definition_id: def.definition_id,
        definition_text: def.definition_text,
      });
    }
  }

  const defIds = [...firstDefByWord.values()].map((d) => d.definition_id);
  if (defIds.length === 0) {
    return new Map();
  }

  const exs = await neonDb
    .select({
      definition_id: examples.definition_id,
      example_text: examples.example_text,
    })
    .from(examples)
    .where(inArray(examples.definition_id, defIds));

  const firstExampleByDef = new Map<number, string>();
  for (const ex of exs) {
    if (!firstExampleByDef.has(ex.definition_id)) {
      firstExampleByDef.set(ex.definition_id, ex.example_text);
    }
  }

  const result = new Map<number, { definition_text: string; example_text: string | null }>();
  for (const [wordId, def] of firstDefByWord) {
    result.set(wordId, {
      definition_text: def.definition_text,
      example_text: firstExampleByDef.get(def.definition_id) ?? null,
    });
  }

  return result;
});

// ============================================================================
// Statistics / Aggregation Queries
// ============================================================================

export const fetchWordCount = cache(async function fetchWordCount(
  languageCode?: string
): Promise<number> {
  const whereClause = languageCode ? eq(words.language_code, languageCode) : undefined;

  const [{ totalCount }] = await neonDb
    .select({ totalCount: count() })
    .from(words)
    .where(whereClause);

  return totalCount;
});

// Internal implementation for fetchTagStats
async function fetchTagStatsImpl(): Promise<
  Array<{ tag: TagSerialized; wordCount: number }>
> {
  // Single query with LEFT JOIN and GROUP BY - eliminates N+1 problem
  const result = await neonDb
    .select({
      id: tags.id,
      name: tags.name,
      description: tags.description,
      wordCount: count(wordTags.word_id),
    })
    .from(tags)
    .leftJoin(wordTags, eq(tags.id, wordTags.tag_id))
    .groupBy(tags.id, tags.name, tags.description)
    .orderBy(asc(tags.name));

  return result.map(function transformTagStat(row) {
    return {
      tag: {
        id: row.id,
        name: row.name,
        description: row.description,
      },
      wordCount: row.wordCount,
    };
  });
}

// Cross-request cached version with 5 minute revalidation
export const fetchTagStats = unstable_cache(
  fetchTagStatsImpl,
  ["dictionary-tag-stats"],
  { revalidate: 300, tags: ["dictionary-tags"] }
);

export const fetchLanguageStats = cache(async function fetchLanguageStats(): Promise<
  Array<{ languageCode: string; wordCount: number }>
> {
  const result = await neonDb
    .select({
      languageCode: words.language_code,
      wordCount: count(),
    })
    .from(words)
    .groupBy(words.language_code)
    .orderBy(desc(count()));

  return result.map((r) => ({
    languageCode: r.languageCode,
    wordCount: r.wordCount,
  }));
});

// ============================================================================
// Source Queries
// ============================================================================

export type SourceSerialized = Source;
export type SourcePartSerialized = SourcePart;

export const fetchAllSources = cache(async function fetchAllSources(): Promise<SourceSerialized[]> {
  const result = await neonDb
    .select()
    .from(sources)
    .orderBy(asc(sources.title));

  return result;
});

export const fetchSourceById = cache(async function fetchSourceById(
  sourceId: number
): Promise<SourceSerialized | null> {
  const result = await neonDb
    .select()
    .from(sources)
    .where(eq(sources.id, sourceId));

  return result.at(0) ?? null;
});

export const fetchSourceParts = cache(async function fetchSourceParts(
  sourceId: number
): Promise<SourcePartSerialized[]> {
  const result = await neonDb
    .select()
    .from(sourceParts)
    .where(eq(sourceParts.source_id, sourceId))
    .orderBy(asc(sourceParts.order), asc(sourceParts.name));

  return result;
});

// Internal implementation for fetchSourcesWithWordCount
async function fetchSourcesWithWordCountImpl(): Promise<
  Array<{ source: SourceSerialized; wordCount: number }>
> {
  // Single query with JOINs and subquery - eliminates N+1 problem
  // Chain: sources -> source_parts -> examples -> definitions -> words
  const wordCountsBySource = await neonDb
    .select({
      source_id: sources.id,
      word_id: definitions.word_id,
    })
    .from(sources)
    .leftJoin(sourceParts, eq(sources.id, sourceParts.source_id))
    .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
    .leftJoin(definitions, eq(examples.definition_id, definitions.id));

  // Count unique words per source in memory (more efficient than complex SQL)
  const sourceWordMap = new Map<number, Set<number>>();
  for (const row of wordCountsBySource) {
    if (!sourceWordMap.has(row.source_id)) {
      sourceWordMap.set(row.source_id, new Set());
    }
    if (row.word_id !== null) {
      const wordSet = sourceWordMap.get(row.source_id);
      if (wordSet) {
        wordSet.add(row.word_id);
      }
    }
  }

  // Fetch all sources
  const allSources = await neonDb.select().from(sources).orderBy(asc(sources.title));

  return allSources.map(function transformSourceStat(source) {
    return {
      source,
      wordCount: sourceWordMap.get(source.id)?.size ?? 0,
    };
  });
}

// Cross-request cached version with 5 minute revalidation
export const fetchSourcesWithWordCount = unstable_cache(
  fetchSourcesWithWordCountImpl,
  ["dictionary-sources-word-count"],
  { revalidate: 300, tags: ["dictionary-sources"] }
);

export interface SourcePartWithSource extends SourcePart {
  source_title: string;
  source_type: string;
}

// Internal implementation for fetchSourcePartsWithWordCount
async function fetchSourcePartsWithWordCountImpl(): Promise<
  Array<{ sourcePart: SourcePartWithSource; wordCount: number }>
> {
  // Single query with JOINs - eliminates N+1 problem
  // Chain: source_parts -> examples -> definitions -> words
  const wordCountsBySourcePart = await neonDb
    .select({
      source_part_id: sourceParts.id,
      source_id: sourceParts.source_id,
      name: sourceParts.name,
      order: sourceParts.order,
      source_title: sources.title,
      source_type: sources.type,
      word_id: definitions.word_id,
    })
    .from(sourceParts)
    .innerJoin(sources, eq(sourceParts.source_id, sources.id))
    .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
    .leftJoin(definitions, eq(examples.definition_id, definitions.id))
    .orderBy(asc(sources.title), asc(sourceParts.order), asc(sourceParts.name));

  // Group by source_part and count unique words
  const sourcePartMap = new Map<
    number,
    { sourcePart: SourcePartWithSource; wordIds: Set<number> }
  >();

  for (const row of wordCountsBySourcePart) {
    if (!sourcePartMap.has(row.source_part_id)) {
      sourcePartMap.set(row.source_part_id, {
        sourcePart: {
          id: row.source_part_id,
          source_id: row.source_id,
          name: row.name,
          order: row.order,
          source_title: row.source_title,
          source_type: row.source_type,
        },
        wordIds: new Set(),
      });
    }
    if (row.word_id !== null) {
      const partEntry = sourcePartMap.get(row.source_part_id);
      if (partEntry) {
        partEntry.wordIds.add(row.word_id);
      }
    }
  }

  // Convert to array maintaining order
  const result: Array<{ sourcePart: SourcePartWithSource; wordCount: number }> = [];
  const seenIds = new Set<number>();

  for (const row of wordCountsBySourcePart) {
    if (!seenIds.has(row.source_part_id)) {
      seenIds.add(row.source_part_id);
      const entry = sourcePartMap.get(row.source_part_id);
      if (entry) {
        result.push({
          sourcePart: entry.sourcePart,
          wordCount: entry.wordIds.size,
        });
      }
    }
  }

  return result;
}

// Cross-request cached version with 5 minute revalidation
export const fetchSourcePartsWithWordCount = unstable_cache(
  fetchSourcePartsWithWordCountImpl,
  ["dictionary-source-parts-word-count"],
  { revalidate: 300, tags: ["dictionary-source-parts"] }
);

export const fetchSourcePartById = cache(async function fetchSourcePartById(
  sourcePartId: number
): Promise<SourcePartWithSource | null> {
  const result = await neonDb
    .select({
      id: sourceParts.id,
      source_id: sourceParts.source_id,
      name: sourceParts.name,
      order: sourceParts.order,
      source_title: sources.title,
      source_type: sources.type,
    })
    .from(sourceParts)
    .innerJoin(sources, eq(sourceParts.source_id, sources.id))
    .where(eq(sourceParts.id, sourcePartId));

  return result.at(0) ?? null;
});
