"use client";

import { use } from "react";
import { motion } from "motion/react";
import { ChevronDown, LayoutList } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DictionaryFilters } from "./dictionary-filters";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";
import type {
  InitialFetchResult,
  FilterStats,
} from "@/lib/db/queries/dictionary";

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

  const filterStats: FilterStats = result.filterStats;
  const selectedFilters = result.selectedFilters;

  const totalCount = result.entries.pageInfo.totalCount;

  return (
    <header className="sticky top-0 z-40 @container">
      {/* Subtle blur background - minimal, blends with page */}
      <div className="absolute inset-0 -z-10 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]" aria-hidden="true" />

      <div className="relative container mx-auto pl-16 pr-3 @3xl:pl-3 @sm:pr-4 py-2.5 @sm:py-3 space-y-2">
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
            tags={filterStats.tags}
            sources={filterStats.sources}
            sourceParts={filterStats.sourceParts}
            selectedTagNames={selectedFilters.tagNames}
            selectedSourceTitles={selectedFilters.sourceTitles}
            selectedSourcePartNames={selectedFilters.sourcePartNames}
          />

          <div className="flex-1" />

          {/* Entry count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dict-surface-2/80 backdrop-blur-sm text-dict-text-secondary text-xs font-medium">
            <LayoutList className="size-3 text-dict-primary" />
            <span className="tabular-nums">{totalCount.toLocaleString()}</span>
          </div>

          {/* Expand/Collapse - smooth icon rotation */}
          <button
            type="button"
            onClick={toggleExpanded}
            className="inline-flex items-center justify-center size-7 rounded-full text-xs font-medium bg-dict-surface-2/80 backdrop-blur-sm text-dict-text-secondary transition-colors duration-150 hover:bg-dict-hover hover:text-dict-text"
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
    </header>
  );
}
