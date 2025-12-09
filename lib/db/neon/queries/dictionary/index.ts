/**
 * Dictionary Queries - Main export
 *
 * Cursor-based infinite scroll architecture.
 */

import "server-only";

import { cache } from "react";
import { slugify } from "@/lib/utils";

import {
  fetchWordsWithCursor,
  searchWordsWithCursor,
  fetchFirstDefinitionForWords,
  type WordSerialized,
} from "./word-queries";

import {
  fetchTagStats,
  fetchSourcesWithWordCount,
  fetchSourcePartsWithWordCount,
  resolveTagSlugs,
  resolveSourceSlugs,
  resolveSourcePartSlugs,
} from "./filter-stats";

import { fetchWordCompleteByText } from "./word-complete";

import {
  INFINITE_SCROLL_CONFIG,
  type InfiniteScrollCursor,
  type InfiniteScrollResult,
  type PageInfo,
  type WordWithPreview,
  type FilterStats,
  type SelectedFilters,
  type InitialFetchResult,
  type FetchMoreWithCursorOptions,
  type FetchInitialOptions,
} from "./types";

// Re-export types
export type {
  WordSerialized,
  InfiniteScrollCursor,
  InfiniteScrollResult,
  PageInfo,
  WordWithPreview,
  FilterStats,
  SelectedFilters,
  InitialFetchResult,
  FetchMoreWithCursorOptions,
  FetchInitialOptions,
};

export { INFINITE_SCROLL_CONFIG, fetchWordCompleteByText, fetchFirstDefinitionForWords };

/** Fetch initial words with filter stats - for page load */
export const fetchWordsInitial = cache(async (
  options: FetchInitialOptions
): Promise<InitialFetchResult> => {
  const {
    query,
    languageCode = "en",
    limit = INFINITE_SCROLL_CONFIG.defaultLimit,
    sortBy = "updated_at",
    sortOrder = "desc",
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
    ? await searchWordsWithCursor({
        query,
        languageCode,
        limit,
        sortBy,
        sortOrder,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchWordsWithCursor({
        languageCode,
        limit,
        sortBy,
        sortOrder,
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
    words: {
      data: wordsWithPreviews,
      pageInfo: wordsResult.pageInfo,
    },
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

/** Fetch more words with cursor - for infinite scroll */
export const fetchMoreWithCursor = cache(async (
  options: FetchMoreWithCursorOptions
): Promise<InfiniteScrollResult<WordWithPreview>> => {
  const {
    cursor,
    limit = INFINITE_SCROLL_CONFIG.defaultLimit,
    query,
    languageCode = "en",
    tagSlugs = [],
    sourceSlugs = [],
    sourcePartSlugs = [],
  } = options;

  const [tagIds, sourceIds, sourcePartIds] = await Promise.all([
    resolveTagSlugs(tagSlugs),
    resolveSourceSlugs(sourceSlugs),
    resolveSourcePartSlugs(sourcePartSlugs),
  ]);

  const sortBy = cursor?.sortBy ?? "updated_at";
  const sortOrder = cursor?.sortOrder ?? "desc";

  const wordsResult = query
    ? await searchWordsWithCursor({
        query,
        cursor,
        languageCode,
        limit,
        sortBy,
        sortOrder,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchWordsWithCursor({
        cursor,
        languageCode,
        limit,
        sortBy,
        sortOrder,
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
    data: wordsWithPreviews,
    pageInfo: wordsResult.pageInfo,
  };
});
