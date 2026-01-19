/**
 * Dictionary Queries - Main export
 *
 * Cursor-based infinite scroll architecture for lexical entries.
 */

import "server-only";

import { cacheLife } from "next/cache";
import { slugify } from "@/lib/utils";

import {
  fetchEntriesWithCursor,
  searchEntriesWithCursor,
  fetchEntriesWithOffset,
  searchEntriesWithOffset,
  fetchFirstSenseForEntries,
  buildEntryWithPreview,
} from "./entry-queries";

import {
  fetchTagStats,
  fetchSourcesWithEntryCount,
  fetchSourcePartsWithEntryCount,
  resolveTagSlugs,
  resolveSourceSlugs,
  resolveSourcePartSlugs,
} from "./filter-stats";

import { fetchEntryCompleteByLemma } from "./entry-complete";

import {
  INFINITE_SCROLL_CONFIG,
  PAGINATION_CONFIG,
  type InfiniteScrollCursor,
  type InfiniteScrollResult,
  type PageInfo,
  type EntryWithPreview,
  type FilterStats,
  type SelectedFilters,
  type InitialFetchResult,
  type FetchMoreWithCursorOptions,
  type FetchInitialOptions,
  type EntryComplete,
  type OffsetPageInfo,
  type PageFetchResult,
} from "./types";

// Re-export types
export type {
  InfiniteScrollCursor,
  InfiniteScrollResult,
  PageInfo,
  EntryWithPreview,
  FilterStats,
  SelectedFilters,
  InitialFetchResult,
  FetchMoreWithCursorOptions,
  FetchInitialOptions,
  EntryComplete,
  OffsetPageInfo,
  PageFetchResult,
};

export { INFINITE_SCROLL_CONFIG, PAGINATION_CONFIG, fetchEntryCompleteByLemma, fetchFirstSenseForEntries };

/** Fetch initial entries with filter stats - for page load */
export async function fetchEntriesInitial(
  options: FetchInitialOptions
): Promise<InitialFetchResult> {
  'use cache'
  cacheLife('hours')

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
      fetchSourcesWithEntryCount(),
      fetchSourcePartsWithEntryCount(),
      resolveTagSlugs(tagSlugs),
      resolveSourceSlugs(sourceSlugs),
      resolveSourcePartSlugs(sourcePartSlugs),
    ]);

  const entriesResult = query
    ? await searchEntriesWithCursor({
        query,
        languageCode,
        limit,
        sortBy,
        sortOrder,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchEntriesWithCursor({
        languageCode,
        limit,
        sortBy,
        sortOrder,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  const entryIds = entriesResult.data.map(e => e.id);
  const sensesMap = await fetchFirstSenseForEntries(entryIds);

  const entriesWithPreviews: EntryWithPreview[] = entriesResult.data.map(e =>
    buildEntryWithPreview(e, sensesMap.get(e.id))
  );

  return {
    entries: {
      data: entriesWithPreviews,
      pageInfo: entriesResult.pageInfo,
    },
    filterStats: {
      tags: tagStats.map(s => ({
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
        categoryDisplayName: s.categoryDisplayName,
        senseCount: s.senseCount,
      })),
      sources: sourceStats.map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        entryCount: s.entryCount,
      })),
      sourceParts: sourcePartStats.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        sourceId: s.sourceId,
        sourceTitle: s.sourceTitle,
        sourceType: s.sourceType,
        entryCount: s.entryCount,
      })),
    },
    selectedFilters: {
      tagNames: tagStats
        .filter(s => tagSlugs.includes(slugify(s.name)))
        .map(s => s.name),
      sourceTitles: sourceStats
        .filter(s => sourceSlugs.includes(slugify(s.title)))
        .map(s => s.title),
      sourcePartNames: sourcePartStats
        .filter(s => sourcePartSlugs.includes(slugify(s.name)))
        .map(s => s.name),
    },
  };
}

/** Fetch more entries with cursor - for infinite scroll */
export async function fetchMoreWithCursor(
  options: FetchMoreWithCursorOptions
): Promise<InfiniteScrollResult<EntryWithPreview>> {
  'use cache'
  cacheLife('hours')

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

  const entriesResult = query
    ? await searchEntriesWithCursor({
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
    : await fetchEntriesWithCursor({
        cursor,
        languageCode,
        limit,
        sortBy,
        sortOrder,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  const entryIds = entriesResult.data.map(e => e.id);
  const sensesMap = await fetchFirstSenseForEntries(entryIds);

  const entriesWithPreviews: EntryWithPreview[] = entriesResult.data.map(e =>
    buildEntryWithPreview(e, sensesMap.get(e.id))
  );

  return {
    data: entriesWithPreviews,
    pageInfo: entriesResult.pageInfo,
  };
}

/** Fetch entries page with offset pagination - for URL-based navigation */
export async function fetchEntriesPage(options: {
  page?: number;
  limit?: number;
  query?: string;
  languageCode?: string;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}): Promise<PageFetchResult> {
  'use cache'
  cacheLife('hours')

  const {
    page = 1,
    limit = PAGINATION_CONFIG.defaultPageSize,
    query,
    languageCode = "en",
    tagSlugs = [],
    sourceSlugs = [],
    sourcePartSlugs = [],
  } = options;

  const offset = (page - 1) * limit;

  const [tagStats, sourceStats, sourcePartStats, tagIds, sourceIds, sourcePartIds] =
    await Promise.all([
      fetchTagStats(),
      fetchSourcesWithEntryCount(),
      fetchSourcePartsWithEntryCount(),
      resolveTagSlugs(tagSlugs),
      resolveSourceSlugs(sourceSlugs),
      resolveSourcePartSlugs(sourcePartSlugs),
    ]);

  const entriesResult = query
    ? await searchEntriesWithOffset({
        query,
        offset,
        limit,
        languageCode,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      })
    : await fetchEntriesWithOffset({
        offset,
        limit,
        languageCode,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
        sourceIds: sourceIds.length > 0 ? sourceIds : undefined,
        sourcePartIds: sourcePartIds.length > 0 ? sourcePartIds : undefined,
      });

  const entryIds = entriesResult.data.map(e => e.id);
  const sensesMap = await fetchFirstSenseForEntries(entryIds);

  const entriesWithPreviews: EntryWithPreview[] = entriesResult.data.map(e =>
    buildEntryWithPreview(e, sensesMap.get(e.id))
  );

  const totalPages = Math.ceil(entriesResult.totalCount / limit);

  return {
    entries: entriesWithPreviews,
    pageInfo: {
      currentPage: page,
      totalPages,
      totalCount: entriesResult.totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filterStats: {
      tags: tagStats.map(s => ({
        id: s.id,
        name: s.name,
        categoryId: s.categoryId,
        categoryDisplayName: s.categoryDisplayName,
        senseCount: s.senseCount,
      })),
      sources: sourceStats.map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        entryCount: s.entryCount,
      })),
      sourceParts: sourcePartStats.map(s => ({
        id: s.id,
        name: s.name,
        type: s.type,
        sourceId: s.sourceId,
        sourceTitle: s.sourceTitle,
        sourceType: s.sourceType,
        entryCount: s.entryCount,
      })),
    },
    selectedFilters: {
      tagNames: tagStats
        .filter(s => tagSlugs.includes(slugify(s.name)))
        .map(s => s.name),
      sourceTitles: sourceStats
        .filter(s => sourceSlugs.includes(slugify(s.title)))
        .map(s => s.title),
      sourcePartNames: sourcePartStats
        .filter(s => sourcePartSlugs.includes(slugify(s.name)))
        .map(s => s.name),
    },
  };
}
