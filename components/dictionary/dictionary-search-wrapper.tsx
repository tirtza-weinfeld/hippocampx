"use client";

import { ReactNode, use } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "./search-bar";
import { WordListClient } from "./word-list-client";
import { DictionaryFilters } from "./dictionary-filters";
import { LayoutList } from "lucide-react";
import { motion } from "motion/react";
import type { InitialFetchResult } from "@/lib/db/neon/queries/dictionary/index";

interface TagOption {
  id: number;
  name: string;
  wordCount: number;
}

interface SourceOption {
  id: number;
  title: string;
  type: string;
  wordCount: number;
}

interface SourcePartOption {
  id: number;
  name: string;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  wordCount: number;
}

export function DictionarySearchWrapper({
  wordsPromise,
  initialQuery,
  initialLanguage,
  serverQuery,
  headerContent,
}: {
  wordsPromise: Promise<InitialFetchResult>;
  initialQuery?: string;
  initialLanguage: string;
  serverQuery?: string;
  headerContent: ReactNode;
}) {
  const searchParams = useSearchParams();
  const result = use(wordsPromise);

  // Extract filter slugs from search params
  const tagSlugs = searchParams.getAll("tag");
  const sourceSlugs = searchParams.getAll("source");
  const sourcePartSlugs = searchParams.getAll("sourcePart");

  const filterData = {
    tags: result.filterStats.tags as TagOption[],
    sources: result.filterStats.sources as SourceOption[],
    sourceParts: result.filterStats.sourceParts as SourcePartOption[],
    selectedTagNames: result.selectedFilters.tagNames,
    selectedSourceTitles: result.selectedFilters.sourceTitles,
    selectedSourcePartNames: result.selectedFilters.sourcePartNames,
  };

  return (
    <>
      {/* Header Section */}
      <div className="border-b border-border/30 bg-linear-to-b from-background to-muted/5">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          {headerContent}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8 space-y-4"
          >
            <SearchBar
              initialQuery={initialQuery}
              initialLanguage={initialLanguage}
            />
            <DictionaryFilters
              tags={filterData.tags}
              sources={filterData.sources}
              sourceParts={filterData.sourceParts}
              selectedTagNames={filterData.selectedTagNames}
              selectedSourceTitles={filterData.selectedSourceTitles}
              selectedSourcePartNames={filterData.selectedSourcePartNames}
            />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results count badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/40">
            <LayoutList className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {result.words.pageInfo.totalCount.toLocaleString()} word
              {result.words.pageInfo.totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        <WordListClient
          initialWords={result.words.data}
          initialPageInfo={result.words.pageInfo}
          serverQuery={serverQuery}
          initialLanguage={initialLanguage}
          filterKey={searchParams.toString()}
          tagSlugs={tagSlugs}
          sourceSlugs={sourceSlugs}
          sourcePartSlugs={sourcePartSlugs}
        />
      </div>
    </>
  );
}
