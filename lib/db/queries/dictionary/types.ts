/**
 * Dictionary Query Types
 *
 * Types for the new lexical entry schema with cursor-based pagination.
 * Supports GraphRAG-ready hierarchical sources and sense-level relations.
 */

import "server-only";

// ============================================================================
// CONFIGURATION
// ============================================================================

export const INFINITE_SCROLL_CONFIG = {
  defaultLimit: 50,
  searchLimit: 20,
} as const;

// ============================================================================
// SORT & PAGINATION
// ============================================================================

export type SortField = "lemma" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";

/** Cursor for stable sorted pagination */
export interface InfiniteScrollCursor {
  afterId: number;
  afterSortValue: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: InfiniteScrollCursor | null;
  totalCount: number;
}

export interface InfiniteScrollResult<T> {
  data: T[];
  pageInfo: PageInfo;
}

// ============================================================================
// FETCH OPTIONS
// ============================================================================

export interface FetchMoreWithCursorOptions {
  cursor: InfiniteScrollCursor | null;
  limit?: number;
  query?: string;
  languageCode?: string;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}

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

// ============================================================================
// ENTRY PREVIEW (List Display)
// ============================================================================

/** Lexical entry with preview data for list display */
export interface EntryWithPreview {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
  /** First sense definition */
  definition: string | null;
  /** First example text */
  exampleText: string | null;
}

// ============================================================================
// FILTER STATISTICS
// ============================================================================

export interface TagStat {
  id: number;
  name: string;
  categoryId: string;
  categoryDisplayName: string;
  /** Count of senses with this tag */
  senseCount: number;
}

export interface SourceStat {
  id: number;
  title: string;
  type: string;
  /** Count of unique entries with examples from this source */
  entryCount: number;
}

export interface SourcePartStat {
  id: number;
  name: string;
  type: string | null;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  /** Count of unique entries with examples from this part */
  entryCount: number;
}

export interface FilterStats {
  tags: TagStat[];
  sources: SourceStat[];
  sourceParts: SourcePartStat[];
}

export interface SelectedFilters {
  tagNames: string[];
  sourceTitles: string[];
  sourcePartNames: string[];
}

// ============================================================================
// COMPLETE ENTRY (Detail View)
// ============================================================================

export interface ExampleWithSource {
  id: number;
  text: string;
  cachedCitation: string | null;
  sourcePartId: number | null;
  sourcePartName: string | null;
  sourceTitle: string | null;
  sourceType: string | null;
}

export interface SenseWithDetails {
  id: number;
  definition: string;
  orderIndex: number;
  isSynthetic: boolean;
  verificationStatus: string | null;
  examples: ExampleWithSource[];
}

export interface SenseRelationInfo {
  id: number;
  relationType: string;
  strength: number | null;
  explanation: string | null;
  isSynthetic: boolean;
  verificationStatus: string | null;
  targetSenseId: number;
  targetDefinition: string;
  targetEntryLemma: string;
  targetEntryId: number;
}

export interface WordFormInfo {
  id: number;
  formText: string;
  grammaticalFeatures: Record<string, unknown>;
}

export interface AudioInfo {
  id: number;
  audioUrl: string;
  transcript: string | null;
  durationMs: number | null;
  accentCode: string | null;
  contentType: string | null;
}

export interface EntryComplete {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  senses: SenseWithDetails[];
  forms: WordFormInfo[];
  audio: AudioInfo[];
  /** Outgoing relations from this entry's senses */
  relations: SenseRelationInfo[];
}

// ============================================================================
// INITIAL FETCH RESULT
// ============================================================================

export interface InitialFetchResult {
  entries: InfiniteScrollResult<EntryWithPreview>;
  filterStats: FilterStats;
  selectedFilters: SelectedFilters;
}
