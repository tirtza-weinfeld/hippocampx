"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchInput } from "./search-input";
import { MobileBottomSheet } from "./mobile-bottom-sheet";
import { MobileTableList } from "./mobile-table-list";
import type { DatabaseProvider } from "@/lib/db-viewer/types";

interface TableStat {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  description?: string;
}

interface TableSidebarProps {
  tables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

function formatTableName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRowCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

export function TableSidebar({
  tables,
  selectedTable,
  onTableSelect,
  isCollapsed,
  onCollapsedChange,
}: TableSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredTables = tables.filter((table) => {
    return (
      search === "" ||
      table.name.toLowerCase().includes(search.toLowerCase()) ||
      table.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 300 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative hidden lg:flex flex-col h-full overflow-hidden flex-shrink-0"
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <CollapsedSidebar
            key="collapsed"
            tables={filteredTables}
            selectedTable={selectedTable}
            onTableSelect={onTableSelect}
            onExpand={() => onCollapsedChange(false)}
          />
        ) : (
          <ExpandedSidebar
            key="expanded"
            tables={tables}
            filteredTables={filteredTables}
            selectedTable={selectedTable}
            onTableSelect={onTableSelect}
            onCollapse={() => onCollapsedChange(true)}
            search={search}
            onSearchChange={setSearch}
          />
        )}
      </AnimatePresence>
    </motion.aside>
  );
}

interface CollapsedSidebarProps {
  tables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  onExpand: () => void;
}

function CollapsedSidebar({ tables, selectedTable, onTableSelect, onExpand }: CollapsedSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full py-3 px-2"
    >
      <button
        type="button"
        onClick={onExpand}
        className="p-2.5 rounded-xl bg-db-surface-raised/50 hover:bg-db-surface-raised transition-all text-db-text-muted hover:text-db-text mb-3"
        aria-label="Expand panel"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5">
        {tables.map((table, index) => {
          const isActive = selectedTable === table.name;

          return (
            <motion.button
              key={table.name}
              type="button"
              onClick={() => onTableSelect(table.name)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`
                w-full p-2 rounded-xl transition-all group
                ${isActive
                  ? "bg-gradient-to-br from-db-neon/20 to-db-neon/5 shadow-sm"
                  : "hover:bg-db-surface-raised/70"
                }
              `}
              title={formatTableName(table.name)}
            >
              <div className={`
                size-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                ${isActive
                  ? "bg-gradient-to-br from-db-neon to-db-neon/80 text-white shadow-md"
                  : "bg-db-neon/10 text-db-neon group-hover:bg-db-neon/15"
                }
              `}>
                {table.name.charAt(0).toUpperCase()}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

interface ExpandedSidebarProps {
  tables: TableStat[];
  filteredTables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  onCollapse: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

function ExpandedSidebar({
  tables,
  filteredTables,
  selectedTable,
  onTableSelect,
  onCollapse,
  search,
  onSearchChange,
}: ExpandedSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-db-neon/20 via-transparent to-db-neon/5 flex items-center justify-center">
              <svg className="size-5 text-db-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-db-text">Tables</h2>
              <p className="text-xs text-db-text-muted">{filteredTables.length} on Neon</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCollapse}
            className="p-2 rounded-xl hover:bg-db-surface-raised/70 transition-all text-db-text-muted hover:text-db-text"
            aria-label="Collapse panel"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search tables..."
        />
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4">
        {filteredTables.length > 0 && (
          <div className="space-y-0.5">
            {filteredTables.map((table, index) => (
              <TableItem
                key={table.name}
                table={table}
                isSelected={selectedTable === table.name}
                onSelect={() => onTableSelect(table.name)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTables.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="size-12 rounded-2xl bg-db-surface-raised/50 flex items-center justify-center mb-3">
              <svg className="size-6 text-db-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-db-text-muted">No tables found</p>
            <p className="text-xs text-db-text-subtle mt-1">Try a different search</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface TableItemProps {
  table: TableStat;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function TableItem({ table, isSelected, onSelect, index }: TableItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.015, duration: 0.2 }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
        ${isSelected
          ? "bg-gradient-to-r from-db-neon/15 to-db-neon/5"
          : "hover:bg-db-surface-raised/60"
        }
      `}
    >
      {/* Icon */}
      <div className={`
        size-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all flex-shrink-0
        ${isSelected
          ? "bg-db-neon text-white shadow-sm"
          : "bg-db-neon/10 text-db-neon group-hover:bg-db-neon/15"
        }
      `}>
        {table.name.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-colors ${
          isSelected ? "text-db-neon" : "text-db-text group-hover:text-db-text"
        }`}>
          {formatTableName(table.name)}
        </p>
      </div>

      {/* Row count */}
      <span className={`
        text-[11px] font-medium tabular-nums px-2 py-0.5 rounded-md transition-all
        ${isSelected
          ? "bg-db-neon/20 text-db-neon"
          : "text-db-text-subtle group-hover:text-db-text-muted"
        }
      `}>
        {formatRowCount(table.rowCount)}
      </span>
    </motion.button>
  );
}

interface MobileSidebarProps {
  tables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({
  tables,
  selectedTable,
  onTableSelect,
  isOpen,
  onClose,
}: MobileSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredTables = tables.filter((table) => {
    return (
      search === "" ||
      table.name.toLowerCase().includes(search.toLowerCase()) ||
      table.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  function handleTableSelect(tableName: string) {
    onTableSelect(tableName);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <MobileBottomSheet isOpen={isOpen} onClose={onClose}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="size-12 rounded-2xl bg-gradient-to-br from-db-neon/20 via-transparent to-db-neon/5 flex items-center justify-center"
              >
                <svg className="size-6 text-db-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </motion.div>
              <div>
                <h2 className="font-semibold text-db-text">Tables</h2>
                <p className="text-xs text-db-text-muted">
                  {filteredTables.length} on Neon
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-db-surface-raised/50 hover:bg-db-surface-raised transition-all"
              aria-label="Close"
            >
              <svg className="size-5 text-db-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-5 pb-4"
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search tables..."
            />
          </motion.div>

          {/* Table Grid */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-8 overscroll-contain">
            <MobileTableList
              tables={filteredTables}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
            />
          </div>
        </MobileBottomSheet>
      )}
    </AnimatePresence>
  );
}
