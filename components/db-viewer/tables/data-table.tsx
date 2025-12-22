"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { QueryResult, SortConfig, ColumnInfo } from "@/lib/db-viewer/types";
import { fetchTableData } from "@/lib/db-viewer/actions";
import { SortIcon } from "./sort-icon";
import { Pagination } from "./pagination";
import { CellDetailModal, type CellInfo } from "./cell-detail-modal";
import {
  DATA_TYPE_COLORS,
  getTypeBadge,
  formatCellValue,
  isTruncated,
} from "./table-helpers";

interface DataTableProps {
  tableName: string;
  initialData: QueryResult;
  columns: ColumnInfo[];
  currentPage?: number;
  currentSort?: SortConfig;
}

function updateUrl(tableName: string, page: number, sort: SortConfig | null) {
  const params = new URLSearchParams();
  params.set("table", tableName);
  if (page > 1) params.set("page", String(page));
  if (sort) {
    params.set("sort", sort.column);
    params.set("dir", sort.direction);
  }
  window.history.replaceState(null, "", `/db?${params.toString()}`);
}

export function DataTable({
  tableName,
  initialData,
  columns,
  currentPage = 1,
  currentSort,
}: DataTableProps) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(currentPage);
  const [sort, setSort] = useState<SortConfig | null>(currentSort ?? null);
  const [isPending, startTransition] = useTransition();
  const [selectedCell, setSelectedCell] = useState<CellInfo | null>(null);

  const handleCellClick = (column: ColumnInfo, value: unknown) => {
    if (isTruncated(value)) {
      setSelectedCell({
        columnName: column.name,
        dataType: column.dataType,
        value,
      });
    }
  };

  function handleSort(column: string) {
    const currentDirection = sort?.column === column ? sort.direction : null;
    const newDirection: "asc" | "desc" = currentDirection === "asc" ? "desc" : "asc";
    const newSort = { column, direction: newDirection };

    setSort(newSort);
    setPage(1);
    updateUrl(tableName, 1, newSort);

    startTransition(async () => {
      const result = await fetchTableData(tableName, {
        page: 1,
        pageSize: 25,
        sort: newSort,
      });
      if (result) setData(result);
    });
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    updateUrl(tableName, newPage, sort);

    startTransition(async () => {
      const result = await fetchTableData(tableName, {
        page: newPage,
        pageSize: 25,
        sort: sort ?? undefined,
      });
      if (result) setData(result);
    });
  }

  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      {/* Table Container */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-db-surface/80 backdrop-blur-sm z-20 flex items-center justify-center"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-db-surface-raised/90 border border-db-border/50 shadow-xl">
                <motion.div
                  className="size-5 rounded-full border-2 border-db-neon border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-sm font-medium text-db-text">Loading...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-full overflow-auto scrollbar-thin">
          <table className="w-full border-collapse min-w-max ">
            <thead className="sticky top-0 z-10">
              <tr>
                {columns.map((column, idx) => {
                  const badge = getTypeBadge(column.dataType);
                  const sortDirection = sort?.column === column.propertyName
                    ? sort.direction
                    : null;
                  return (
                    <th
                      key={column.name}
                      onClick={() => handleSort(column.propertyName)}
                      className={`
                        group cursor-pointer select-none text-left transition-all
                        bg-db-surface-raised/95 backdrop-blur-sm
                        ${idx === 0 ? "rounded-tl-xl" : ""}
                        ${idx === columns.length - 1 ? "rounded-tr-xl" : ""}
                      `}
                    >
                      <div className="px-4 py-3 flex items-center gap-3 border-b border-db-border/30">
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-db-text truncate">
                              {column.name}
                            </span>
                            <SortIcon direction={sortDirection} />
                          </div>
                          <span className={`inline-flex w-fit px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                            {column.dataType}
                          </span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="h-64">
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                data.data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group transition-colors hover:bg-db-row-hover/50"
                  >
                    {columns.map((column, colIndex) => {
                      const value = row[column.propertyName];
                      const isNull = value === null || value === undefined;
                      const normalizedType = column.dataType.toLowerCase();
                      const isNumeric = ["integer", "real", "number"].includes(normalizedType);
                      const truncated = isTruncated(value);

                      return (
                        <td
                          key={column.name}
                          onClick={() => handleCellClick(column, value)}
                          className={`
                            px-4 py-3 text-sm border-b border-db-border/20
                            ${isNumeric ? "font-mono tabular-nums" : ""}
                            ${colIndex === 0 ? "rounded-bl-lg" : ""}
                            ${colIndex === columns.length - 1 ? "rounded-br-lg" : ""}
                            ${truncated ? "cursor-pointer hover:bg-db-surface-raised/30" : ""}
                          `}
                        >
                          {isNull ? (
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-db-surface-raised/50 text-db-text-subtle text-[10px] font-medium">
                              null
                            </span>
                          ) : (
                            <span className={` ${DATA_TYPE_COLORS[normalizedType] ?? "text-db-text"} break-words ${truncated ? "underline decoration-dotted decoration-db-border/50 underline-offset-2" : ""}`}>
                              {formatCellValue(value)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        totalCount={data.totalCount}
        pageSize={data.pageSize}
        isPending={isPending}
        onPageChange={handlePageChange}
      />

      {/* Cell Detail Modal */}
      <AnimatePresence>
        {selectedCell && (
          <CellDetailModal
            cell={selectedCell}
            onClose={() => setSelectedCell(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-db-text-muted">
      <div className="size-14 rounded-2xl bg-db-surface-raised/50 flex items-center justify-center">
        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-db-text">No data found</p>
        <p className="text-xs text-db-text-subtle mt-1">This table appears to be empty</p>
      </div>
    </div>
  );
}
