"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { WordListClient } from "./word-list-client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Word {
  id: number;
  word_text: string;
  language_code: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export function DictionarySearchWrapper({
  words,
  initialQuery,
  initialLanguage,
  serverQuery,
  headerContent,
  pagination,
}: {
  words: Word[];
  initialQuery?: string;
  initialLanguage: string;
  serverQuery?: string;
  headerContent: ReactNode;
  pagination?: PaginationInfo;
}) {
  const [clientFilter, setClientFilter] = useState("");

  function buildPageHref(pageNum: number) {
    const query: Record<string, string> = {};
    if (initialQuery) query.q = initialQuery;
    if (initialLanguage && initialLanguage !== "en") query.lang = initialLanguage;
    if (pageNum > 1) query.page = pageNum.toString();
    return { pathname: "/dictionary" as const, query };
  }

  return (
    <>
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          {headerContent}
          <div className="mt-6">
            <SearchBar
              initialQuery={initialQuery}
              initialLanguage={initialLanguage}
              onClientFilterChange={setClientFilter}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <WordListClient
          words={words}
          clientFilter={clientFilter}
          serverQuery={serverQuery}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1}-
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} words
            </p>
            <div className="flex items-center gap-2">
              {pagination.page > 1 ? (
                <Link href={buildPageHref(pagination.page - 1)}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="gap-1" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              <span className="text-sm text-muted-foreground px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.hasMore ? (
                <Link href={buildPageHref(pagination.page + 1)}>
                  <Button variant="outline" size="sm" className="gap-1">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="gap-1" disabled>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
