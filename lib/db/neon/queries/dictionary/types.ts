/**
 * Infinite Scroll Types - Dictionary
 *
 * Cursor-based pagination for O(1) performance at any scroll depth.
 * Industry standard pattern (Relay, Twitter, GraphQL).
 */

import "server-only";

/** Configuration for infinite scroll queries */
export const INFINITE_SCROLL_CONFIG = {
  defaultLimit: 50,
  searchLimit: 20,
} as const;

/** Sort field options for dictionary words */
export type SortField = "word_text" | "created_at" | "updated_at";

/** Sort order options */
export type SortOrder = "asc" | "desc";

/** Cursor for infinite scroll - composite key for stable sorted pagination */
export interface InfiniteScrollCursor {
  /** ID of last item for tiebreaker */
  afterId: number;
  /** Value of sort field for last item (e.g., word_text for alphabetical) */
  afterSortValue: string;
  /** Sort configuration to validate cursor matches current sort */
  sortBy: SortField;
  sortOrder: SortOrder;
}

/** Page info for infinite scroll results */
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: InfiniteScrollCursor | null;
  totalCount: number;
}

/** Result shape for infinite scroll queries */
export interface InfiniteScrollResult<T> {
  data: T[];
  pageInfo: PageInfo;
}

/** Options for fetching more items with cursor */
export interface FetchMoreWithCursorOptions {
  cursor: InfiniteScrollCursor | null;
  limit?: number;
  query?: string;
  languageCode?: string;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}

/** Options for initial fetch (no cursor) */
export interface FetchInitialOptions {
  query?: string;
  languageCode?: string;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}

/** Word with preview data for list display */
export interface WordWithPreview {
  id: number;
  word_text: string;
  language_code: string;
  definition_text: string | null;
  example_text: string | null;
}

/** Filter statistics for sidebar */
export interface FilterStats {
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
}

/** Selected filter names for display */
export interface SelectedFilters {
  tagNames: string[];
  sourceTitles: string[];
  sourcePartNames: string[];
}

/** Complete initial fetch result */
export interface InitialFetchResult {
  words: InfiniteScrollResult<WordWithPreview>;
  filterStats: FilterStats;
  selectedFilters: SelectedFilters;
}
