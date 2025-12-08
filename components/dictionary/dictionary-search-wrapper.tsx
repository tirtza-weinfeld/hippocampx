"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Route } from "next";
import { SearchBar } from "./search-bar";
import { WordListClient } from "./word-list-client";
import { DictionaryFilters } from "./dictionary-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutList } from "lucide-react";
import { motion } from "motion/react";

interface WordWithPreview {
  id: number;
  word_text: string;
  language_code: string;
  definition_text: string | null;
  example_text: string | null;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

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
  sourceTitle: string;
  sourceType: string;
  wordCount: number;
}

interface FilterData {
  tags: TagOption[];
  sources: SourceOption[];
  sourceParts: SourcePartOption[];
  selectedTagNames: string[];
  selectedSourceTitles: string[];
  selectedSourcePartNames: string[];
}

export function DictionarySearchWrapper({
  words,
  initialQuery,
  initialLanguage,
  serverQuery,
  headerContent,
  pagination,
  filterData,
}: {
  words: WordWithPreview[];
  initialQuery?: string;
  initialLanguage: string;
  serverQuery?: string;
  headerContent: ReactNode;
  pagination?: PaginationInfo;
  filterData?: FilterData;
}) {
  const [clientFilter, setClientFilter] = useState("");
  const searchParams = useSearchParams();

  function buildPageHref(pageNum: number): Route {
    const params = new URLSearchParams(searchParams.toString());

    if (pageNum > 1) {
      params.set("page", pageNum.toString());
    } else {
      params.delete("page");
    }

    const queryString = params.toString();
    return (queryString ? `/dictionary?${queryString}` : "/dictionary") as Route;
  }

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
              onClientFilterChange={setClientFilter}
            />
            {filterData && (
              <DictionaryFilters
                tags={filterData.tags}
                sources={filterData.sources}
                sourceParts={filterData.sourceParts}
                selectedTagNames={filterData.selectedTagNames}
                selectedSourceTitles={filterData.selectedSourceTitles}
                selectedSourcePartNames={filterData.selectedSourcePartNames}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results count badge */}
        {pagination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/40">
              <LayoutList className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {pagination.total.toLocaleString()} word{pagination.total !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        )}

        <WordListClient
          words={words}
          clientFilter={clientFilter}
          serverQuery={serverQuery}
        />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xs p-4 sm:p-5">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>
                {" - "}
                <span className="font-medium text-foreground">
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                </span>
                {" of "}
                <span className="font-medium text-foreground">
                  {pagination.total.toLocaleString()}
                </span>
                {" words"}
              </p>
              <div className="flex items-center gap-3 order-1 sm:order-2">
                {pagination.page > 1 ? (
                  <Link href={buildPageHref(pagination.page - 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 px-4 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 dark:hover:bg-sky-950/30 dark:hover:text-sky-400 dark:hover:border-sky-800 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1.5 px-4" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {pagination.page}
                  </span>
                  <span className="text-muted-foreground/60">/</span>
                  <span className="text-sm text-muted-foreground">
                    {pagination.totalPages}
                  </span>
                </div>
                {pagination.hasMore ? (
                  <Link href={buildPageHref(pagination.page + 1)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 px-4 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 dark:hover:bg-sky-950/30 dark:hover:text-sky-400 dark:hover:border-sky-800 transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1.5 px-4" disabled>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
