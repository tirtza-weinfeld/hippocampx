"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TableSidebar, MobileSidebar } from "./table-sidebar";
import { DataTable } from "./data-table";
import { ColumnFilter } from "./column-filter";
import {
  fetchTableData,
  fetchTableMetadata,
} from "@/lib/db-viewer/actions";
import { useHiddenColumns, getDbViewerActions } from "@/lib/db-viewer/store";
import type {
  DatabaseProvider,
  QueryResult,
  TableMetadata,
  SortConfig,
} from "@/lib/db-viewer/types";

interface TableStat {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  description?: string;
}

interface TableBrowserProps {
  initialStats: TableStat[];
  selectedTable?: string;
  initialData?: QueryResult | null;
  initialMetadata?: TableMetadata | null;
  currentPage?: number;
  currentSort?: SortConfig;
}

function formatTableName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function updateUrl(tableName: string | null) {
  if (tableName) {
    window.history.replaceState(null, "", `/db?table=${tableName}`);
  } else {
    window.history.replaceState(null, "", "/db");
  }
}

export function TableBrowser({
  initialStats,
  selectedTable: serverSelectedTable,
  initialData,
  initialMetadata,
  currentPage = 1,
  currentSort,
}: TableBrowserProps) {
  // Client-side state for table, data, metadata
  const [selectedTable, setSelectedTable] = useState(serverSelectedTable);
  const [data, setData] = useState(initialData);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isPending, startTransition] = useTransition();

  // Local UI state (not in URL)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Persisted column visibility from store
  const hiddenColumnsArray = useHiddenColumns(selectedTable);
  const hiddenColumns = useMemo(() => new Set(hiddenColumnsArray), [hiddenColumnsArray]);
  const { toggleColumn, showAllColumns, hideAllColumns } = getDbViewerActions();

  const columns = useMemo(() => metadata?.columns ?? [], [metadata?.columns]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !hiddenColumns.has(col.name));
  }, [columns, hiddenColumns]);

  function toggleColumnVisibility(columnName: string) {
    if (selectedTable) {
      toggleColumn(selectedTable, columnName);
    }
  }

  function handleShowAllColumns() {
    if (selectedTable) {
      showAllColumns(selectedTable);
    }
  }

  function handleHideAllColumns() {
    if (selectedTable && columns.length > 0) {
      hideAllColumns(selectedTable, columns.map((c) => c.name));
    }
  }

  function handleTableSelect(tableName: string) {
    // Don't refetch if clicking the same table
    if (tableName === selectedTable) {
      setMobileSidebarOpen(false);
      return;
    }

    setMobileSidebarOpen(false);
    setSelectedTable(tableName);
    setData(null);
    setMetadata(null);
    updateUrl(tableName);

    startTransition(async () => {
      const [newData, newMetadata] = await Promise.all([
        fetchTableData(tableName, { page: 1, pageSize: 25 }),
        fetchTableMetadata(tableName),
      ]);
      setData(newData);
      setMetadata(newMetadata);
    });
  }

  function handleBackToWelcome() {
    setSelectedTable(undefined);
    setData(null);
    setMetadata(null);
    updateUrl(null);
  }

  const selectedTableInfo = selectedTable
    ? initialStats.find((t) => t.name === selectedTable)
    : null;

  const isLoadingNewTable = isPending || (selectedTable && !data);

  return (
    <div className="flex h-full overflow-hidden bg-linear-to-r from-transparent via-db-surface to-transparent">
      {/* Desktop Sidebar */}
      <TableSidebar
        tables={initialStats}
        selectedTable={selectedTable ?? null}
        onTableSelect={handleTableSelect}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        tables={initialStats}
        selectedTable={selectedTable ?? null}
        onTableSelect={handleTableSelect}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div
                key={`table-${selectedTable}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col"
              >
                {/* Table Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Provider Icon */}
                    <div className={`
                      size-12 rounded-2xl flex items-center justify-center flex-shrink-0
                      ${selectedTableInfo?.provider === "neon"
                        ? "bg-gradient-to-br from-db-neon/20 to-db-neon/5"
                        : "bg-gradient-to-br from-db-vercel/20 to-db-vercel/5"
                      }
                    `}>
                      {selectedTableInfo?.provider === "neon" ? (
                        <svg className="size-6 text-db-neon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      ) : (
                        <svg className="size-6 text-db-vercel" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 19.5h20L12 2z"/>
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl lg:text-2xl font-bold text-db-text truncate">
                        {formatTableName(selectedTable)}
                      </h1>
                      <div className="flex items-center gap-3 mt-1">
                        {data && !isLoadingNewTable ? (
                          <p className="text-sm text-db-text-muted">
                            <span className="font-medium">{data.totalCount.toLocaleString()}</span> rows
                          </p>
                        ) : (
                          <div className="h-4 w-16 bg-db-surface-raised/50 rounded animate-pulse" />
                        )}
                        <span className={`
                          inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium uppercase tracking-wider
                          ${selectedTableInfo?.provider === "neon"
                            ? "bg-db-neon/10 text-db-neon"
                            : "bg-db-vercel/10 text-db-vercel"
                          }
                        `}>
                          <span className={`size-1.5 rounded-full ${
                            selectedTableInfo?.provider === "neon" ? "bg-db-neon" : "bg-db-vercel"
                          }`} />
                          {selectedTableInfo?.provider}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {columns.length > 0 && !isLoadingNewTable && (
                      <ColumnFilter
                        columns={columns}
                        hiddenColumns={hiddenColumns}
                        onToggleColumn={toggleColumnVisibility}
                        onShowAll={handleShowAllColumns}
                        onHideAll={handleHideAllColumns}
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleBackToWelcome}
                      disabled={isPending}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-db-text-muted hover:text-db-text hover:bg-db-surface-raised/70 transition-all disabled:opacity-50"
                    >
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden lg:inline">Close</span>
                    </button>
                  </div>
                </div>

                {/* Data content */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {isLoadingNewTable || !data ? (
                    <TableSkeleton />
                  ) : (
                    <DataTable
                      tableName={selectedTable}
                      initialData={data}
                      columns={visibleColumns}
                      currentPage={currentPage}
                      currentSort={currentSort}
                    />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center h-full p-8"
              >
                <WelcomeContent tableCount={initialStats.length} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Floating Action Button - Toggle */}
        <motion.button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`
            lg:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-xl font-medium shadow-lg transition-all
            ${mobileSidebarOpen
              ? "bg-db-surface-raised text-db-text border border-db-border/50 shadow-md"
              : "bg-gradient-to-r from-db-neon to-db-neon/80 text-white shadow-db-neon/25"
            }
            hover:scale-105 active:scale-95
          `}
        >
          <AnimatePresence mode="wait">
            {mobileSidebarOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </motion.svg>
            )}
          </AnimatePresence>
          <span className="text-sm font-medium">{mobileSidebarOpen ? "Close" : `${initialStats.length} Tables`}</span>
        </motion.button>
      </main>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      {/* Table skeleton */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
        <div className="h-full">
          {/* Header skeleton */}
          <div className="flex gap-4 p-4 bg-db-surface-raised/95">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <div className="h-4 w-20 bg-db-border/50 rounded animate-pulse mb-2" />
                <div className="h-5 w-16 bg-db-border/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
          {/* Row skeletons */}
          <div className="divide-y divide-db-border/20">
            {Array.from({ length: 8 }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex gap-4 p-4">
                {Array.from({ length: 4 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex-1 min-w-[120px]">
                    <div
                      className="h-4 bg-db-border/30 rounded animate-pulse"
                      style={{
                        width: `${60 + Math.random() * 30}%`,
                        animationDelay: `${(rowIdx * 4 + colIdx) * 50}ms`
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pagination skeleton */}
      <div className="flex-shrink-0 flex items-center justify-between px-2 py-4 mt-2">
        <div className="h-4 w-24 bg-db-border/30 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 bg-db-border/30 rounded-xl animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="size-10 bg-db-border/30 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-16 bg-db-border/30 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface WelcomeContentProps {
  tableCount: number;
}

function WelcomeContent({ tableCount }: WelcomeContentProps) {
  return (
    <div className="text-center max-w-md">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center mb-8"
      >
        <div className="size-20 rounded-3xl bg-gradient-to-br from-db-neon/15 via-transparent to-db-vercel/15 flex items-center justify-center">
          <svg
            className="size-10 text-db-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-2xl lg:text-3xl font-bold text-db-text mb-3"
      >
        Database Explorer
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-db-text-muted mb-8"
      >
        <span className="font-semibold text-db-text">{tableCount} tables</span> ready to explore
      </motion.p>

      {/* Hint */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center justify-center gap-2 text-sm text-db-text-muted"
      >
        <span className="hidden lg:inline-flex items-center gap-2">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Select a table from the sidebar
        </span>
        <span className="lg:hidden inline-flex items-center gap-2">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Tap the button below
        </span>
      </motion.div>

      {/* Connection Status */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-6 mt-10"
      >
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
          <span className="size-2 rounded-full bg-db-neon animate-pulse" />
          <span className="text-sm font-medium text-db-text-muted">Neon</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
          <span className="size-2 rounded-full bg-db-vercel animate-pulse" />
          <span className="text-sm font-medium text-db-text-muted">Vercel</span>
        </div>
      </motion.div>
    </div>
  );
}
