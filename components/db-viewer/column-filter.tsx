"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import type { ColumnInfo } from "@/lib/db-viewer/types";

interface ColumnFilterProps {
  columns: ColumnInfo[];
  hiddenColumns: Set<string>;
  onToggleColumn: (columnName: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

const DATA_TYPE_BADGES: Record<string, { bg: string; text: string }> = {
  integer: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  smallint: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  bigint: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  real: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  "double precision": { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  numeric: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  serial: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  number: { bg: "bg-db-vercel/10", text: "text-db-vercel" },
  boolean: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  timestamp: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  "timestamp with time zone": { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  date: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  time: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  string: { bg: "bg-db-neon/10", text: "text-db-neon" },
  text: { bg: "bg-db-neon/10", text: "text-db-neon" },
  varchar: { bg: "bg-db-neon/10", text: "text-db-neon" },
  char: { bg: "bg-db-neon/10", text: "text-db-neon" },
  uuid: { bg: "bg-db-neon/10", text: "text-db-neon" },
  json: { bg: "bg-purple-500/10", text: "text-purple-500 dark:text-purple-400" },
  jsonb: { bg: "bg-purple-500/10", text: "text-purple-500 dark:text-purple-400" },
  array: { bg: "bg-orange-500/10", text: "text-orange-500 dark:text-orange-400" },
};

function getTypeBadge(dataType: string): { bg: string; text: string } {
  const normalized = dataType.toLowerCase();
  const exactMatch = DATA_TYPE_BADGES[normalized] as { bg: string; text: string } | undefined;
  if (exactMatch) return exactMatch;
  const baseType = normalized.split("(")[0].trim();
  const baseMatch = DATA_TYPE_BADGES[baseType] as { bg: string; text: string } | undefined;
  if (baseMatch) return baseMatch;
  if (normalized.includes("[]") || normalized.includes("array")) {
    return DATA_TYPE_BADGES.array;
  }
  return DATA_TYPE_BADGES.string;
}

export function ColumnFilter({
  columns,
  hiddenColumns,
  onToggleColumn,
  onShowAll,
  onHideAll,
}: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleCount = columns.length - hiddenColumns.size;

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-db-border bg-db-surface hover:bg-db-row-hover text-sm font-medium text-db-text transition-all"
      >
        <svg
          className="size-4 text-db-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5m0-1.5c0-.621.504-1.125 1.125-1.125m0 0h7.5"
          />
        </svg>
        <span className="hidden sm:inline">Columns</span>
        <span className="inline-flex items-center justify-center min-w-[2.5rem] px-1.5 py-0.5 rounded-lg bg-db-neon/10 text-[10px] font-semibold text-db-neon tabular-nums">
          {visibleCount}/{columns.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-db-border/50 bg-db-surface shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-db-border/30 bg-db-surface-raised/50">
                <span className="text-sm font-semibold text-db-text">Toggle columns</span>
                <div className="flex items-center gap-1 bg-db-surface rounded-lg p-0.5 border border-db-border/30">
                  <button
                    type="button"
                    onClick={onShowAll}
                    className="px-2.5 py-1 text-[11px] font-medium text-db-text-muted hover:text-db-text hover:bg-db-surface-raised rounded-md transition-all"
                  >
                    All
                  </button>
                  <div className="w-px h-4 bg-db-border/50" />
                  <button
                    type="button"
                    onClick={onHideAll}
                    className="px-2.5 py-1 text-[11px] font-medium text-db-text-muted hover:text-db-text hover:bg-db-surface-raised rounded-md transition-all"
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Column List */}
              <div className="max-h-72 overflow-y-auto scrollbar-thin p-2">
                {columns.map((column, idx) => {
                  const isVisible = !hiddenColumns.has(column.name);
                  const badge = getTypeBadge(column.dataType);

                  return (
                    <motion.button
                      key={column.name}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => onToggleColumn(column.name)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all hover:bg-db-surface-raised/50"
                    >
                      {/* Checkbox */}
                      <div
                        className={`
                          flex-shrink-0 size-4 rounded border-2 flex items-center justify-center transition-all
                          ${isVisible
                            ? "bg-db-neon border-db-neon"
                            : "border-db-border-subtle bg-transparent"
                          }
                        `}
                      >
                        {isVisible && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="size-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={4}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>

                      {/* Column Info */}
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <span
                          className={`text-sm truncate ${
                            isVisible ? "text-db-text" : "text-db-text-muted"
                          }`}
                        >
                          {column.name}
                        </span>
                        <span
                          className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${badge.bg} ${badge.text}`}
                        >
                          {column.dataType}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
