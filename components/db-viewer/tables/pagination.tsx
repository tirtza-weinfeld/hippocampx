"use client";

import { motion } from "motion/react";
import { getVisiblePages } from "./table-helpers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  isPending,
  onPageChange,
}: PaginationProps) {
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="flex-shrink-0 flex items-center justify-between px-2 py-4 mb-2"
    >
      {/* Row count */}
      <p className="text-sm text-db-text-muted">
        <span className="font-medium text-db-text">{startRow.toLocaleString()}</span>
        <span className="mx-1.5 text-db-text-subtle">-</span>
        <span className="font-medium text-db-text">{endRow.toLocaleString()}</span>
        <span className="mx-2 text-db-text-subtle">of</span>
        <span className="font-medium text-db-text">{totalCount.toLocaleString()}</span>
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-db-text-muted hover:text-db-text hover:bg-db-surface-raised/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getVisiblePages(currentPage, totalPages).map((page, idx) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-db-text-subtle text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                disabled={isPending}
                className={`
                  min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all
                  ${page === currentPage
                    ? "bg-gradient-to-br from-db-neon to-db-neon/80 text-white shadow-md"
                    : "text-db-text-muted hover:text-db-text hover:bg-db-surface-raised/70"
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-db-text-muted hover:text-db-text hover:bg-db-surface-raised/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
