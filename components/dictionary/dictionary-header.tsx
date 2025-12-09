"use client";

import { use } from "react";
import * as motion from "motion/react-client";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { SearchBar } from "./search-bar";
import { DictionaryFilters } from "./dictionary-filters";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";
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

interface DictionaryHeaderProps {
  initialQuery?: string;
  initialLanguage: string;
  wordsPromise: Promise<InitialFetchResult>;
}

export function DictionaryHeader({
  initialQuery,
  initialLanguage,
  wordsPromise,
}: DictionaryHeaderProps) {
  const result = use(wordsPromise);
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

  return (
    <header className="sticky top-0 z-40 bg-linear-to-b from-background from-80% to-transparent pb-6">
      <div className="container mx-auto px-4 py-4 sm:py-5">
        {/* Title Row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-dict-glow-color blur-xl rounded-xl" />
              <div className="dict-section-icon">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-dict-gradient">
                Dictionary
              </h1>
              <p className="text-dict-text-tertiary text-xs sm:text-sm hidden sm:block">
                Browse and search your vocabulary
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleExpanded}
            className="dict-expand-btn"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                Expand
              </>
            )}
          </button>
        </motion.div>

        {/* Search & Filters Row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="space-y-3"
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
    </header>
  );
}
