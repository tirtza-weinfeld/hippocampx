/**
 * ============================================================================
 * TEMPORARY: Direct Neon Database Queries for Dictionary
 * ============================================================================
 *
 * Server-side database queries for dictionary words, definitions, and tags.
 * This replaces the Hippo API client temporarily while schema is finalized.
 *
 * OPTIMAL IMPLEMENTATION - This defines the behavior the Hippo API should match:
 * - Paginated responses with metadata (total, page, pageSize, totalPages, hasMore)
 * - Flexible sorting (by word_text, created_at, updated_at)
 * - Multiple search modes (prefix, contains, exact)
 * - Filter by tags
 * - Word forms CRUD
 * - Batch operations
 *
 * WHEN READY TO REVERT:
 * - Delete this file
 * - Delete lib/db/schema-dictionary.ts
 * - Delete lib/db/query-dictionary.ts
 * - Switch imports back to lib/api/railway-vocabulary-client.ts
 * - Remove NEON_DATABASE_URL from environment
 * ============================================================================
 */

import { cache } from "react";
import { eq, and, or, ilike, asc, desc, inArray, count } from "drizzle-orm";
import { dictionaryDb } from "../query-dictionary";
import {
  words,
  definitions,
  examples,
  tags,
  wordTags,
  wordRelations,
  wordForms,
  type Word,
  type Definition,
  type Example,
  type Tag,
  type WordForm,
  type WordSerialized,
  type DefinitionSerialized,
  type ExampleSerialized,
  type TagSerialized,
  type WordComplete,
  type DefinitionWithExamples,
} from "../schema-dictionary";

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

// Also export WordForm type
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

function serializeDefinition(def: Definition): DefinitionSerialized {
  return {
    ...def,
    part_of_speech: def.part_of_speech,
  };
}

function serializeExample(ex: Example): ExampleSerialized {
  return { ...ex };
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
// Word Queries - Paginated
// ============================================================================

export const fetchWords = cache(async function fetchWords(
  languageCode?: string,
  pageSize: number = 50,
  offset: number = 0
): Promise<WordSerialized[]> {
  // Legacy signature support - convert offset to page
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
  } = options;

  const offset = (page - 1) * pageSize;

  // Build conditions
  const conditions = [];
  if (languageCode) {
    conditions.push(eq(words.language_code, languageCode));
  }

  // If filtering by tags, we need to join with wordTags
  let wordIdsFromTags: number[] | null = null;
  if (tagIds && tagIds.length > 0) {
    const taggedWords = await dictionaryDb
      .select({ word_id: wordTags.word_id })
      .from(wordTags)
      .where(inArray(wordTags.tag_id, tagIds));
    wordIdsFromTags = [...new Set(taggedWords.map((tw) => tw.word_id))];

    if (wordIdsFromTags.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasMore: false,
      };
    }
    conditions.push(inArray(words.id, wordIdsFromTags));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [{ totalCount }] = await dictionaryDb
    .select({ totalCount: count() })
    .from(words)
    .where(whereClause);

  const total = totalCount;
  const totalPages = Math.ceil(total / pageSize);

  // Get paginated data
  const result = await dictionaryDb
    .select()
    .from(words)
    .where(whereClause)
    .limit(pageSize)
    .offset(offset)
    .orderBy(getOrderBy(sortBy, sortOrder));

  return {
    data: result.map(serializeWord),
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
});

// ============================================================================
// Search Queries - Paginated with Multiple Modes
// ============================================================================

export const searchWordsByPrefix = cache(async function searchWordsByPrefix(
  prefix: string,
  languageCode: string = "en",
  limit: number = 20
): Promise<WordSerialized[]> {
  // Legacy signature support
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
  } = options;

  const offset = (page - 1) * pageSize;

  // Build search condition based on mode
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

  // If filtering by tags
  if (tagIds && tagIds.length > 0) {
    const taggedWords = await dictionaryDb
      .select({ word_id: wordTags.word_id })
      .from(wordTags)
      .where(inArray(wordTags.tag_id, tagIds));
    const wordIdsFromTags = [...new Set(taggedWords.map((tw) => tw.word_id))];

    if (wordIdsFromTags.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        hasMore: false,
      };
    }
    conditions.push(inArray(words.id, wordIdsFromTags));
  }

  const whereClause = and(...conditions);

  // Get total count
  const [{ totalCount }] = await dictionaryDb
    .select({ totalCount: count() })
    .from(words)
    .where(whereClause);

  const total = totalCount;
  const totalPages = Math.ceil(total / pageSize);

  // Get paginated data
  const result = await dictionaryDb
    .select()
    .from(words)
    .where(whereClause)
    .limit(pageSize)
    .offset(offset)
    .orderBy(getOrderBy(sortBy, sortOrder));

  return {
    data: result.map(serializeWord),
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
  const result = await dictionaryDb
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
  const result = await dictionaryDb
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
  const [word] = await dictionaryDb
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
  const [word] = await dictionaryDb
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
  await dictionaryDb.delete(words).where(eq(words.id, wordId));
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

  const result = await dictionaryDb.insert(words).values(values).returning();
  return result;
}

export async function deleteWordsBatch(wordIds: number[]): Promise<void> {
  if (wordIds.length === 0) return;
  await dictionaryDb.delete(words).where(inArray(words.id, wordIds));
}

// ============================================================================
// Definition Queries
// ============================================================================

export const fetchDefinitionsByWordId = cache(async function fetchDefinitionsByWordId(
  wordId: number
): Promise<DefinitionWithExamples[]> {
  const defs = await dictionaryDb
    .select()
    .from(definitions)
    .where(eq(definitions.word_id, wordId))
    .orderBy(asc(definitions.order));

  const defsWithExamples = await Promise.all(
    defs.map(async (def) => {
      const exs = await dictionaryDb
        .select()
        .from(examples)
        .where(eq(examples.definition_id, def.id));
      return {
        ...serializeDefinition(def),
        examples: exs.map(serializeExample),
      };
    })
  );

  return defsWithExamples;
});

export async function createDefinition(
  wordId: number,
  definitionText: string,
  partOfSpeech: string | null,
  order: number = 0
): Promise<Definition> {
  const pos = (partOfSpeech?.toLowerCase() ?? "other") as Definition["part_of_speech"];

  const [definition] = await dictionaryDb
    .insert(definitions)
    .values({
      word_id: wordId,
      definition_text: definitionText,
      part_of_speech: pos,
      order,
    })
    .returning();

  // Update parent word's updated_at
  await dictionaryDb
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

  const [definition] = await dictionaryDb
    .update(definitions)
    .set({
      definition_text: definitionText,
      part_of_speech: pos,
    })
    .where(eq(definitions.id, definitionId))
    .returning();

  // Update parent word's updated_at
  await dictionaryDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, definition.word_id));

  return definition;
}

export async function deleteDefinition(definitionId: number): Promise<void> {
  const defResult = await dictionaryDb
    .select({ word_id: definitions.word_id })
    .from(definitions)
    .where(eq(definitions.id, definitionId));

  const def = defResult.at(0);

  await dictionaryDb.delete(definitions).where(eq(definitions.id, definitionId));

  if (def) {
    await dictionaryDb
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
  source?: string
): Promise<Example> {
  const [example] = await dictionaryDb
    .insert(examples)
    .values({
      definition_id: definitionId,
      example_text: exampleText,
      source: source ?? null,
    })
    .returning();

  return example;
}

export async function updateExample(
  exampleId: number,
  exampleText: string,
  source?: string
): Promise<Example> {
  const [example] = await dictionaryDb
    .update(examples)
    .set({
      example_text: exampleText,
      source: source ?? null,
    })
    .where(eq(examples.id, exampleId))
    .returning();

  return example;
}

export async function deleteExample(exampleId: number): Promise<void> {
  await dictionaryDb.delete(examples).where(eq(examples.id, exampleId));
}

// ============================================================================
// Tag Queries
// ============================================================================

export const fetchAllTags = cache(async function fetchAllTags(): Promise<TagSerialized[]> {
  const result = await dictionaryDb.select().from(tags).orderBy(asc(tags.name));
  return result.map(serializeTag);
});

export const fetchTagsByWordId = cache(async function fetchTagsByWordId(
  wordId: number
): Promise<TagSerialized[]> {
  const wordTagRows = await dictionaryDb
    .select({ tag_id: wordTags.tag_id })
    .from(wordTags)
    .where(eq(wordTags.word_id, wordId));

  if (wordTagRows.length === 0) {
    return [];
  }

  const tagIds = wordTagRows.map((row) => row.tag_id);
  const result = await dictionaryDb
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
  const [tag] = await dictionaryDb
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
  const [tag] = await dictionaryDb
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
  await dictionaryDb.delete(tags).where(eq(tags.id, tagId));
}

export async function addTagToWord(
  wordId: number,
  tagId: number
): Promise<void> {
  const existing = await dictionaryDb
    .select()
    .from(wordTags)
    .where(and(eq(wordTags.word_id, wordId), eq(wordTags.tag_id, tagId)));

  if (existing.length === 0) {
    await dictionaryDb.insert(wordTags).values({ word_id: wordId, tag_id: tagId });

    await dictionaryDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, wordId));
  }
}

export async function removeTagFromWord(
  wordId: number,
  tagId: number
): Promise<void> {
  await dictionaryDb
    .delete(wordTags)
    .where(and(eq(wordTags.word_id, wordId), eq(wordTags.tag_id, tagId)));

  await dictionaryDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));
}

export async function setWordTags(
  wordId: number,
  tagIds: number[]
): Promise<void> {
  // Remove all existing tags
  await dictionaryDb.delete(wordTags).where(eq(wordTags.word_id, wordId));

  // Add new tags
  if (tagIds.length > 0) {
    await dictionaryDb
      .insert(wordTags)
      .values(tagIds.map((tagId) => ({ word_id: wordId, tag_id: tagId })));
  }

  await dictionaryDb
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
  const result = await dictionaryDb
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
  const [form] = await dictionaryDb
    .insert(wordForms)
    .values({
      word_id: wordId,
      form_text: formText,
      form_type: formType ?? null,
    })
    .returning();

  await dictionaryDb
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
  const result = await dictionaryDb
    .update(wordForms)
    .set({
      form_text: formText,
      form_type: formType ?? null,
    })
    .where(eq(wordForms.id, formId))
    .returning();

  const form = result.at(0);
  if (form) {
    await dictionaryDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, form.word_id));
  }

  return form;
}

export async function deleteWordForm(formId: number): Promise<void> {
  const formResult = await dictionaryDb
    .select({ word_id: wordForms.word_id })
    .from(wordForms)
    .where(eq(wordForms.id, formId));

  const form = formResult.at(0);

  await dictionaryDb.delete(wordForms).where(eq(wordForms.id, formId));

  if (form) {
    await dictionaryDb
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, form.word_id));
  }
}

export async function setWordForms(
  wordId: number,
  forms: Array<{ formText: string; formType?: string }>
): Promise<WordForm[]> {
  // Remove all existing forms
  await dictionaryDb.delete(wordForms).where(eq(wordForms.word_id, wordId));

  // Add new forms
  if (forms.length === 0) return [];

  const result = await dictionaryDb
    .insert(wordForms)
    .values(
      forms.map((f) => ({
        word_id: wordId,
        form_text: f.formText,
        form_type: f.formType ?? null,
      }))
    )
    .returning();

  await dictionaryDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(eq(words.id, wordId));

  return result;
}

// Search by word form (find the parent word from a conjugated/declined form)
export const searchByWordForm = cache(async function searchByWordForm(
  formText: string,
  languageCode: string = "en"
): Promise<WordSerialized[]> {
  const matchingForms = await dictionaryDb
    .select({ word_id: wordForms.word_id })
    .from(wordForms)
    .where(ilike(wordForms.form_text, formText));

  if (matchingForms.length === 0) return [];

  const wordIds = [...new Set(matchingForms.map((f) => f.word_id))];

  const result = await dictionaryDb
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
  const rawRelations = await dictionaryDb
    .select()
    .from(wordRelations)
    .where(or(eq(wordRelations.word_id_1, wordId), eq(wordRelations.word_id_2, wordId)));

  const relations = await Promise.all(
    rawRelations.map(async (relation) => {
      const relatedWordId =
        relation.word_id_1 === wordId ? relation.word_id_2 : relation.word_id_1;
      const relatedWordResult = await dictionaryDb
        .select()
        .from(words)
        .where(eq(words.id, relatedWordId));

      const relatedWord = relatedWordResult.at(0);

      return {
        word_id_1: relation.word_id_1,
        word_id_2: relation.word_id_2,
        relation_type: relation.relation_type,
        related_word_text: relatedWord?.word_text ?? "",
        related_word_id: relatedWord?.id ?? 0,
      };
    })
  );

  return relations;
});

export async function createWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<void> {
  await dictionaryDb.insert(wordRelations).values({
    word_id_1: wordId1,
    word_id_2: wordId2,
    relation_type: relationType as "synonym" | "antonym" | "hypernym" | "hyponym" | "meronym" | "holonym" | "related",
  });

  // Update both words' updated_at
  await dictionaryDb
    .update(words)
    .set({ updated_at: new Date() })
    .where(inArray(words.id, [wordId1, wordId2]));
}

export async function deleteWordRelation(
  wordId1: number,
  wordId2: number,
  relationType: string
): Promise<void> {
  await dictionaryDb
    .delete(wordRelations)
    .where(
      and(
        eq(wordRelations.word_id_1, wordId1),
        eq(wordRelations.word_id_2, wordId2),
        eq(wordRelations.relation_type, relationType as "synonym" | "antonym" | "hypernym" | "hyponym" | "meronym" | "holonym" | "related")
      )
    );

  await dictionaryDb
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
  const wordResult = await dictionaryDb
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
// Statistics / Aggregation Queries
// ============================================================================

export const fetchWordCount = cache(async function fetchWordCount(
  languageCode?: string
): Promise<number> {
  const whereClause = languageCode ? eq(words.language_code, languageCode) : undefined;

  const [{ totalCount }] = await dictionaryDb
    .select({ totalCount: count() })
    .from(words)
    .where(whereClause);

  return totalCount;
});

export const fetchTagStats = cache(async function fetchTagStats(): Promise<
  Array<{ tag: TagSerialized; wordCount: number }>
> {
  const allTags = await dictionaryDb.select().from(tags).orderBy(asc(tags.name));

  const stats = await Promise.all(
    allTags.map(async (tag) => {
      const [{ tagCount }] = await dictionaryDb
        .select({ tagCount: count() })
        .from(wordTags)
        .where(eq(wordTags.tag_id, tag.id));

      return {
        tag: serializeTag(tag),
        wordCount: tagCount,
      };
    })
  );

  return stats;
});

export const fetchLanguageStats = cache(async function fetchLanguageStats(): Promise<
  Array<{ languageCode: string; wordCount: number }>
> {
  const result = await dictionaryDb
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
