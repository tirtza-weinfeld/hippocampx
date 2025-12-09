/**
 * Dictionary Queries - Main export
 */

import "server-only";

import { cache } from "react";
import { slugify } from "@/lib/utils";

import {
  fetchWordsPaginated,
  searchWords,
  fetchFirstDefinitionForWords,
  type PaginatedResponse,
  type WordSerialized,
} from "./word-queries";

export { fetchFirstDefinitionForWords };
export type { WordSerialized };

import {
  fetchTagStats,
  fetchSourcesWithWordCount,
  fetchSourcePartsWithWordCount,
  resolveTagSlugs,
  resolveSourceSlugs,
  resolveSourcePartSlugs,
} from "./filter-stats";

import { fetchWordCompleteByText } from "./word-complete";

// Re-export for external use
export { fetchWordCompleteByText };
export type { PaginatedResponse };

export interface WordWithPreview {
  id: number;
  word_text: string;
  language_code: string;
  definition_text: string | null;
  example_text: string | null;
}

export interface FetchWordsByFiltersOptions {
  query?: string;
  languageCode?: string;
  page?: number;
  pageSize?: number;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}

export interface FetchWordsByFiltersResult {
  words: PaginatedResponse<WordWithPreview>;
  filterStats: {
    tags: Array<{ id: number; name: string; wordCount: number }>;
    sources: Array<{ id: number; title: string; type: string; wordCount: number }>;
    sourceParts: Array<{
      id: number;
      name: string;
      sourceId: number;
      sourceTitle: string;
      sourceType: string;
      wordCount: number;
    }>;
  };
  selectedFilters: {
    tagNames: string[];
    sourceTitles: string[];
    sourcePartNames: string[];
  };
}

export const fetchWordsByFilters = cache(async function fetchWordsByFilters(
  options: FetchWordsByFiltersOptions
): Promise<FetchWordsByFiltersResult> {
  const {
    query,
    languageCode = "en",
    page = 1,
    pageSize = 50,
    tagSlugs = [],
    sourceSlugs = [],
    sourcePartSlugs = [],
  } = options;

  const [tagStats, sourceStats, sourcePartStats, tagIds, sourceIds, sourcePartIds] =
    await Promise.all([
      fetchTagStats(),
      fetchSourcesWithWordCount(),
      fetchSourcePartsWithWordCount(),
      resolveTagSlugs(tagSlugs),
      resolveSourceSlugs(sourceSlugs),
      resolveSourcePartSlugs(sourcePartSlugs),
    ]);

  const wordsResult = query
    ? await searchWords({
        query,
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchWordsPaginated({
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  const wordIds = wordsResult.data.map(w => w.id);
  const defsMap = await fetchFirstDefinitionForWords(wordIds);

  const wordsWithPreviews: WordWithPreview[] = wordsResult.data.map(w => {
    const preview = defsMap.get(w.id);
    return {
      id: w.id,
      word_text: w.word_text,
      language_code: w.language_code,
      definition_text: preview?.definition_text ?? null,
      example_text: preview?.example_text ?? null,
    };
  });

  return {
    words: { ...wordsResult, data: wordsWithPreviews },
    filterStats: {
      tags: tagStats.map(s => ({ id: s.tag.id, name: s.tag.name, wordCount: s.wordCount })),
      sources: sourceStats.map(s => ({
        id: s.source.id,
        title: s.source.title,
        type: s.source.type,
        wordCount: s.wordCount,
      })),
      sourceParts: sourcePartStats.map(s => ({
        id: s.sourcePart.id,
        name: s.sourcePart.name,
        sourceId: s.sourcePart.source_id,
        sourceTitle: s.sourcePart.source_title,
        sourceType: s.sourcePart.source_type,
        wordCount: s.wordCount,
      })),
    },
    selectedFilters: {
      tagNames: tagStats
        .filter(s => tagSlugs.includes(slugify(s.tag.name)))
        .map(s => s.tag.name),
      sourceTitles: sourceStats
        .filter(s => sourceSlugs.includes(slugify(s.source.title)))
        .map(s => s.source.title),
      sourcePartNames: sourcePartStats
        .filter(s => sourcePartSlugs.includes(slugify(s.sourcePart.name)))
        .map(s => s.sourcePart.name),
    },
  };
});

// Simplified fetch for infinite scroll - returns only words data
export interface FetchMoreWordsOptions {
  query?: string;
  languageCode?: string;
  page: number;
  pageSize?: number;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}

export interface FetchMoreWordsResult {
  words: WordWithPreview[];
  hasMore: boolean;
  page: number;
  total: number;
}

export const fetchMoreWords = cache(async function fetchMoreWords(
  options: FetchMoreWordsOptions
): Promise<FetchMoreWordsResult> {
  const {
    query,
    languageCode = "en",
    page,
    pageSize = 50,
    tagSlugs = [],
    sourceSlugs = [],
    sourcePartSlugs = [],
  } = options;

  const [tagIds, sourceIds, sourcePartIds] = await Promise.all([
    resolveTagSlugs(tagSlugs),
    resolveSourceSlugs(sourceSlugs),
    resolveSourcePartSlugs(sourcePartSlugs),
  ]);

  const wordsResult = query
    ? await searchWords({
        query,
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchWordsPaginated({
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  const wordIds = wordsResult.data.map(w => w.id);
  const defsMap = await fetchFirstDefinitionForWords(wordIds);

  const wordsWithPreviews: WordWithPreview[] = wordsResult.data.map(w => {
    const preview = defsMap.get(w.id);
    return {
      id: w.id,
      word_text: w.word_text,
      language_code: w.language_code,
      definition_text: preview?.definition_text ?? null,
      example_text: preview?.example_text ?? null,
    };
  });

  return {
    words: wordsWithPreviews,
    hasMore: wordsResult.hasMore,
    page: wordsResult.page,
    total: wordsResult.total,
  };
});

// Separated fetch - returns words without definitions for PPD pattern
export interface WordsOnlyResult {
  words: PaginatedResponse<WordSerialized>;
  filterStats: FetchWordsByFiltersResult["filterStats"];
  selectedFilters: FetchWordsByFiltersResult["selectedFilters"];
}

export const fetchWordsOnly = cache(async function fetchWordsOnly(
  options: FetchWordsByFiltersOptions
): Promise<WordsOnlyResult> {
  const {
    query,
    languageCode = "en",
    page = 1,
    pageSize = 50,
    tagSlugs = [],
    sourceSlugs = [],
    sourcePartSlugs = [],
  } = options;

  const [tagStats, sourceStats, sourcePartStats, tagIds, sourceIds, sourcePartIds] =
    await Promise.all([
      fetchTagStats(),
      fetchSourcesWithWordCount(),
      fetchSourcePartsWithWordCount(),
      resolveTagSlugs(tagSlugs),
      resolveSourceSlugs(sourceSlugs),
      resolveSourcePartSlugs(sourcePartSlugs),
    ]);

  const wordsResult = query
    ? await searchWords({
        query,
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchWordsPaginated({
        languageCode,
        page,
        pageSize,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  return {
    words: wordsResult,
    filterStats: {
      tags: tagStats.map(s => ({ id: s.tag.id, name: s.tag.name, wordCount: s.wordCount })),
      sources: sourceStats.map(s => ({
        id: s.source.id,
        title: s.source.title,
        type: s.source.type,
        wordCount: s.wordCount,
      })),
      sourceParts: sourcePartStats.map(s => ({
        id: s.sourcePart.id,
        name: s.sourcePart.name,
        sourceId: s.sourcePart.source_id,
        sourceTitle: s.sourcePart.source_title,
        sourceType: s.sourcePart.source_type,
        wordCount: s.wordCount,
      })),
    },
    selectedFilters: {
      tagNames: tagStats
        .filter(s => tagSlugs.includes(slugify(s.tag.name)))
        .map(s => s.tag.name),
      sourceTitles: sourceStats
        .filter(s => sourceSlugs.includes(slugify(s.source.title)))
        .map(s => s.source.title),
      sourcePartNames: sourcePartStats
        .filter(s => sourcePartSlugs.includes(slugify(s.sourcePart.name)))
        .map(s => s.sourcePart.name),
    },
  };
});
