"use client";

import { use } from "react";
import * as motion from "motion/react-client";
import { LayoutList } from "lucide-react";
import { WordListClient } from "./word-list-client";
import type { InitialFetchResult } from "@/lib/db/neon/queries/dictionary/index";

interface DictionaryContentProps {
  wordsPromise: Promise<InitialFetchResult>;
  serverQuery?: string;
  initialLanguage: string;
  filterKey: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}

export function DictionaryContent({
  wordsPromise,
  serverQuery,
  initialLanguage,
  filterKey,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: DictionaryContentProps) {
  const result = use(wordsPromise);

  return (
    <div className="pt-6">
      {/* Results count badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="dict-results-badge">
          <LayoutList className="h-3.5 w-3.5" />
          <span>
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
        filterKey={filterKey}
        tagSlugs={tagSlugs}
        sourceSlugs={sourceSlugs}
        sourcePartSlugs={sourcePartSlugs}
      />
    </div>
  );
}
