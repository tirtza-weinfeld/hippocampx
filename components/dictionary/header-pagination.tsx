import Link from "next/link";
import type { Route } from "next";
import { ChevronLeft, ChevronRight, LayoutList } from "lucide-react";
import type { OffsetPageInfo } from "@/lib/db/queries/dictionary";

interface HeaderNavigatorProps {
  pageInfo: OffsetPageInfo;
  query?: string;
  language: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}

/**
 * Unified navigator showing entry count + pagination in one modern pill.
 */
export function HeaderNavigator({
  pageInfo,
  query,
  language,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: HeaderNavigatorProps) {
  const hasPagination = pageInfo.totalPages > 1;

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
    <div className="flex items-center h-9 rounded-full bg-dict-surface-2/80 backdrop-blur-sm">
      {/* Entry count */}
      <div className="flex items-center gap-1.5 h-full pl-3 pr-2 text-xs font-medium">
        <LayoutList className="size-3.5 text-dict-primary" />
        <span className="tabular-nums text-dict-text-secondary">{pageInfo.totalCount.toLocaleString()}</span>
      </div>

      {hasPagination && (
        <>
          {/* Divider */}
          <div className="w-px h-4 bg-dict-border/40" />

          {/* Pagination controls */}
          <div className="flex items-center h-full">
            {/* Previous */}
            <Link
              href={buildPageUrl(pageInfo.currentPage - 1)}
              prefetch={true}
              className={`flex items-center justify-center h-full px-2 transition-colors duration-150 ${
                pageInfo.hasPrevPage
                  ? "text-dict-text-secondary hover:text-dict-primary hover:bg-dict-hover"
                  : "pointer-events-none text-dict-text-tertiary/30"
              }`}
              aria-disabled={!pageInfo.hasPrevPage}
              aria-label="Previous page"
              tabIndex={pageInfo.hasPrevPage ? 0 : -1}
            >
              <ChevronLeft className="size-3.5" />
            </Link>

            {/* Page indicator */}
            <div className="flex items-center gap-0.5 text-xs font-medium tabular-nums select-none">
              <span className="text-dict-primary">{pageInfo.currentPage}</span>
              <span className="text-dict-text-tertiary/50">/</span>
              <span className="text-dict-text-tertiary">{pageInfo.totalPages}</span>
            </div>

            {/* Next */}
            <Link
              href={buildPageUrl(pageInfo.currentPage + 1)}
              prefetch={true}
              className={`flex items-center justify-center h-full px-2 rounded-r-full transition-colors duration-150 ${
                pageInfo.hasNextPage
                  ? "text-dict-text-secondary hover:text-dict-primary hover:bg-dict-hover"
                  : "pointer-events-none text-dict-text-tertiary/30"
              }`}
              aria-disabled={!pageInfo.hasNextPage}
              aria-label="Next page"
              tabIndex={pageInfo.hasNextPage ? 0 : -1}
            >
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </>
      )}

      {!hasPagination && <div className="pr-1" />}
    </div>
  );
}

// Keep old export for backwards compatibility during migration
export { HeaderNavigator as HeaderPagination };
