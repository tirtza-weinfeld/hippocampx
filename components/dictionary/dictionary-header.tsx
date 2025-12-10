"use client";

import { use } from "react";
import { motion } from "motion/react";
import { ChevronDown, LayoutList } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DictionaryFilters } from "./dictionary-filters";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";
import type { InitialFetchResult } from "@/lib/db/neon/queries/dictionary/index";

interface TagOption {
  id: number;
  name: string;
  category: string | null;
  senseCount: number;
}

interface SourceOption {
  id: number;
  title: string;
  type: string;
  entryCount: number;
}

interface SourcePartOption {
  id: number;
  name: string;
  type: string | null;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  entryCount: number;
}

interface DictionaryHeaderProps {
  initialQuery?: string;
  initialLanguage: string;
  entriesPromise: Promise<InitialFetchResult>;
}

export function DictionaryHeader({
  initialQuery,
  initialLanguage,
  entriesPromise,
}: DictionaryHeaderProps) {
  const result = use(entriesPromise);
  const isExpanded = useIsExpanded();
  const { toggleExpanded } = getDictionaryListActions();

  const filterData = {
    tags: result.filterStats.tags as TagOption[],
    sources: result.filterStats.sources as SourceOption[],
    sourceParts: result.filterStats.sourceParts as SourcePartOption[],
    selectedTagNames: result.selectedFilters.tagNames,
    selectedSourceTitles: result.selectedFilters.sourceTitles,
    selectedSourcePartNames: result.selectedFilters.sourcePartNames,
  };

  const totalCount = result.entries.pageInfo.totalCount;

  return (
    <header className="sticky top-0 z-40 @container">
      {/* Seamless gradient fade - blends into page */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-dict-surface-0/95 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-dict-border/30 to-transparent" />
      </div>

      <div className="relative container mx-auto px-3 @sm:px-4 py-2.5 @sm:py-3 space-y-2">
        {/* Row 1: Search bar */}
        <div>
          <SearchBar
            initialQuery={initialQuery}
            initialLanguage={initialLanguage}
          />
        </div>

        {/* Row 2: Filters + Count + Expand */}
        <div className="flex items-center gap-1.5 @sm:gap-2 flex-wrap">
          <DictionaryFilters
            tags={filterData.tags}
            sources={filterData.sources}
            sourceParts={filterData.sourceParts}
            selectedTagNames={filterData.selectedTagNames}
            selectedSourceTitles={filterData.selectedSourceTitles}
            selectedSourcePartNames={filterData.selectedSourcePartNames}
          />

          <div className="flex-1" />

          {/* Entry count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dict-surface-2 text-dict-text-secondary text-xs font-medium">
            <LayoutList className="size-3 text-dict-primary" />
            <span className="tabular-nums">{totalCount.toLocaleString()}</span>
          </div>

          {/* Expand/Collapse - smooth icon rotation */}
          <button
            type="button"
            onClick={toggleExpanded}
            className="inline-flex items-center justify-center size-7 rounded-full text-xs font-medium bg-dict-surface-2 text-dict-text-secondary transition-colors duration-150 hover:bg-dict-hover hover:text-dict-text"
            aria-label={isExpanded ? "Collapse definitions" : "Expand definitions"}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <ChevronDown className="size-3.5" />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Bottom fade for seamless blend */}
      <div
        className="absolute inset-x-0 bottom-0 h-4 bg-linear-to-b from-dict-surface-0/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </header>
  );
}
