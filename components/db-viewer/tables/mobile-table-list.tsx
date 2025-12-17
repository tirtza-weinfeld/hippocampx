"use client";

import { motion } from "motion/react";
import type { DatabaseProvider } from "@/lib/db-viewer/types";

interface TableStat {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  description?: string;
}

interface MobileTableListProps {
  tables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
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

export function MobileTableList({
  tables,
  selectedTable,
  onTableSelect,
}: MobileTableListProps) {
  if (tables.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="size-14 rounded-2xl bg-db-surface-raised/50 flex items-center justify-center mb-4">
          <svg className="size-7 text-db-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-base font-medium text-db-text">No tables found</p>
        <p className="text-sm text-db-text-muted mt-1">Try a different search</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {tables.map((table, index) => (
        <MobileTableCard
          key={table.name}
          table={table}
          isSelected={selectedTable === table.name}
          onSelect={() => onTableSelect(table.name)}
          index={index}
        />
      ))}
    </div>
  );
}

interface MobileTableCardProps {
  table: TableStat;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function MobileTableCard({ table, isSelected, onSelect, index }: MobileTableCardProps) {
  const selectedStyles = "bg-linear-to-br from-db-neon to-db-neon/80 text-white shadow-lg";
  const defaultStyles = "bg-db-surface-raised/70 hover:bg-db-surface-raised border border-db-border/50";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-start p-4 rounded-2xl text-left transition-colors overflow-hidden ${isSelected ? selectedStyles : defaultStyles}`}
    >
      {/* Provider indicator */}
      <div className={`absolute top-3 right-3 size-2 rounded-full ${
        isSelected ? "bg-white/50" : "bg-db-neon"
      }`} />

      <p className={`text-sm font-semibold truncate w-full pr-4 ${
        isSelected ? "text-white" : "text-db-text"
      }`}>
        {formatTableName(table.name)}
      </p>

      {table.description && (
        <p className={`text-xs truncate w-full mt-0.5 ${
          isSelected ? "text-white/70" : "text-db-text-muted"
        }`}>
          {table.description}
        </p>
      )}

      <div className={`mt-3 px-2 py-1 rounded-lg text-xs font-medium tabular-nums ${
        isSelected ? "bg-white/20 text-white" : "bg-db-surface text-db-text-muted"
      }`}>
        {formatRowCount(table.rowCount)} rows
      </div>
    </motion.button>
  );
}
