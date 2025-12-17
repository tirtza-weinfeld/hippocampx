"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
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
import { TableSkeleton } from "./table-skeleton";

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
    window.history.replaceState(null, "", `/db/tables?table=${tableName}`);
  } else {
    window.history.replaceState(null, "", "/db/tables");
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
  const [selectedTable, setSelectedTable] = useState(serverSelectedTable);
  const [data, setData] = useState(initialData);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isPending, startTransition] = useTransition();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
                    <div className="size-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-db-neon/20 to-db-neon/5">
                      <svg className="size-6 text-db-neon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
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
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-medium uppercase tracking-wider bg-db-neon/10 text-db-neon">
                          <span className="size-1.5 rounded-full bg-db-neon" />
                          neon
                        </span>
                      </div>
                    </div>
                  </div>

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

        {/* Mobile FAB */}
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

interface WelcomeContentProps {
  tableCount: number;
}

function WelcomeContent({ tableCount }: WelcomeContentProps) {
  return (
    <div className="text-center max-w-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="inline-flex items-center justify-center mb-8"
      >
        <div className="size-20 rounded-3xl bg-gradient-to-br from-db-neon/15 via-transparent to-db-neon/5 flex items-center justify-center">
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
              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M13.125 18.375v-1.5m0 0c-.621 0-1.125-.504-1.125-1.125m1.125 1.125h7.5"
            />
          </svg>
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-2xl lg:text-3xl font-bold text-db-text mb-3"
      >
        Table Browser
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-db-text-muted mb-8"
      >
        <span className="font-semibold text-db-text">{tableCount} tables</span> on Neon PostgreSQL
      </motion.p>

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

      {/* Link to ER Diagram */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Link
          href="/db/diagram"
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-db-surface-raised/70 hover:bg-db-surface-raised text-db-text font-medium border border-db-border/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          View ER Diagram
        </Link>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center justify-center mt-8"
      >
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
          <span className="size-2 rounded-full bg-db-neon animate-pulse" />
          <span className="text-sm font-medium text-db-text-muted">Neon Connected</span>
        </div>
      </motion.div>
    </div>
  );
}
