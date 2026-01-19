import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OffsetPageInfo } from "@/lib/db/queries/dictionary";

interface HeaderPaginationProps {
  pageInfo: OffsetPageInfo;
  query?: string;
  language: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}

export function HeaderPagination({
  pageInfo,
  query,
  language,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: HeaderPaginationProps) {
  if (pageInfo.totalPages <= 1) {
    return null;
  }

  function buildPageUrl(page: number): Route {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (language !== "en") params.set("lang", language);
    tagSlugs.forEach((tag) => params.append("tag", tag));
    sourceSlugs.forEach((source) => params.append("source", source));
    sourcePartSlugs.forEach((part) => params.append("part", part));
    if (page > 1) params.set("page", String(page));
    const queryString = params.toString();
    return (queryString ? `/dictionary?${queryString}` : "/dictionary") as Route;
  }

  return (
    <div className="flex items-center rounded-full bg-dict-surface-2/80 backdrop-blur-sm">
      {/* Previous */}
      <Link
        href={buildPageUrl(pageInfo.currentPage - 1)}
        prefetch={true}
        className={`flex items-center justify-center size-7 rounded-l-full transition-colors duration-150 ${
          pageInfo.hasPrevPage
            ? "text-dict-text-secondary hover:text-dict-primary hover:bg-dict-hover"
            : "pointer-events-none text-dict-text-tertiary/40"
        }`}
        aria-disabled={!pageInfo.hasPrevPage}
        aria-label="Previous page"
        tabIndex={pageInfo.hasPrevPage ? 0 : -1}
      >
        <ChevronLeft className="size-3.5" />
      </Link>

      {/* Page indicator */}
      <div className="flex items-center gap-0.5 px-1 text-xs font-medium tabular-nums">
        <span className="text-dict-primary">{pageInfo.currentPage}</span>
        <span className="text-dict-text-tertiary/60">/</span>
        <span className="text-dict-text-secondary">{pageInfo.totalPages}</span>
      </div>

      {/* Next */}
      <Link
        href={buildPageUrl(pageInfo.currentPage + 1)}
        prefetch={true}
        className={`flex items-center justify-center size-7 rounded-r-full transition-colors duration-150 ${
          pageInfo.hasNextPage
            ? "text-dict-text-secondary hover:text-dict-primary hover:bg-dict-hover"
            : "pointer-events-none text-dict-text-tertiary/40"
        }`}
        aria-disabled={!pageInfo.hasNextPage}
        aria-label="Next page"
        tabIndex={pageInfo.hasNextPage ? 0 : -1}
      >
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}
