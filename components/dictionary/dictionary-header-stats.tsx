import { LayoutList } from "lucide-react";
import { DictionaryFilters } from "./dictionary-filters";
import { HeaderPagination } from "./header-pagination";
import type { PageFetchResult } from "@/lib/db/queries/dictionary";

interface DictionaryHeaderStatsProps {
  entriesPromise: Promise<PageFetchResult>;
  query?: string;
  language: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}

/**
 * Server component that awaits data and renders filter stats + count + pagination.
 * Wrapped in Suspense in DictionaryHeader - streams in after shell renders.
 */
export async function DictionaryHeaderStats({
  entriesPromise,
  query,
  language,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: DictionaryHeaderStatsProps) {
  const result = await entriesPromise;

  return (
    <>
      <DictionaryFilters
        tags={result.filterStats.tags}
        sources={result.filterStats.sources}
        sourceParts={result.filterStats.sourceParts}
        selectedTagNames={result.selectedFilters.tagNames}
        selectedSourceTitles={result.selectedFilters.sourceTitles}
        selectedSourcePartNames={result.selectedFilters.sourcePartNames}
      />

      <div className="flex-1 min-w-0" />

      {/* Pagination */}
      <HeaderPagination
        pageInfo={result.pageInfo}
        query={query}
        language={language}
        tagSlugs={tagSlugs}
        sourceSlugs={sourceSlugs}
        sourcePartSlugs={sourcePartSlugs}
      />

      {/* Entry count */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dict-surface-2/80 backdrop-blur-sm text-dict-text-secondary text-xs font-medium">
        <LayoutList className="size-3 text-dict-primary" />
        <span className="tabular-nums">{result.pageInfo.totalCount.toLocaleString()}</span>
      </div>
    </>
  );
}
