import { DictionaryFilters } from "./filters";
import { HeaderNavigator } from "./header-pagination";
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
 * Server component that awaits data and renders filter stats + navigator.
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

      {/* Spacer - hidden on small screens to keep controls compact */}
      <div className="hidden @lg:block flex-1 min-w-0" />

      {/* Unified navigator: count + pagination */}
      <HeaderNavigator
        pageInfo={result.pageInfo}
        query={query}
        language={language}
        tagSlugs={tagSlugs}
        sourceSlugs={sourceSlugs}
        sourcePartSlugs={sourcePartSlugs}
      />
    </>
  );
}
