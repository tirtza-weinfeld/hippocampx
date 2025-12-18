"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DatabaseProvider } from "@/lib/db-viewer/types";

interface TableStat {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  schema: string;
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

function groupTablesBySchema(tables: TableStat[]): Map<string, TableStat[]> {
  const grouped = new Map<string, TableStat[]>();
  for (const table of tables) {
    const existing = grouped.get(table.schema) ?? [];
    existing.push(table);
    grouped.set(table.schema, existing);
  }
  return grouped;
}

function buildSchemaIndexMap(tables: TableStat[]): Map<string, number> {
  const schemas = [...new Set(tables.map(t => t.schema))];
  return new Map(schemas.map((s, i) => [s, i]));
}

export function MobileTableList({
  tables,
  selectedTable,
  onTableSelect,
}: MobileTableListProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(() => {
    return new Set(tables.map(t => t.schema));
  });

  const groupedTables = groupTablesBySchema(tables);
  const schemaIndexMap = buildSchemaIndexMap(tables);

  function toggleSchema(schema: string) {
    setExpandedSchemas(prev => {
      const next = new Set(prev);
      if (next.has(schema)) {
        next.delete(schema);
      } else {
        next.add(schema);
      }
      return next;
    });
  }

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
    <div className="space-y-4">
      {Array.from(groupedTables.entries()).map(([schema, schemaTables]) => {
        const isExpanded = expandedSchemas.has(schema);
        const schemaIndex = (schemaIndexMap.get(schema) ?? 0) % 6;
        const schemaColor = `var(--db-er-schema-${schemaIndex})`;

        return (
          <div key={schema}>
            {/* Schema Header */}
            <button
              type="button"
              onClick={() => toggleSchema(schema)}
              className="w-full flex items-center gap-3 px-1 py-2 mb-2"
              aria-expanded={isExpanded}
            >
              <motion.svg
                className="size-5 text-db-text-muted"
                viewBox="0 0 16 16"
                fill="currentColor"
                animate={{ rotate: isExpanded ? 0 : -90 }}
                transition={{ duration: 0.15 }}
              >
                <path
                  fillRule="evenodd"
                  d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </motion.svg>
              <span
                className="size-3 rounded-full shrink-0"
                style={{ background: schemaColor }}
              />
              <span className="text-sm font-semibold uppercase tracking-wide text-db-text-muted">
                {schema}
              </span>
              <span
                className="ml-auto text-xs tabular-nums px-2 py-0.5 rounded-lg font-medium"
                style={{
                  background: `color-mix(in oklch, ${schemaColor} 15%, transparent)`,
                  color: schemaColor,
                }}
              >
                {schemaTables.length}
              </span>
            </button>

            {/* Tables Grid */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {schemaTables.map((table, index) => (
                      <MobileTableCard
                        key={table.name}
                        table={table}
                        isSelected={selectedTable === table.name}
                        onSelect={() => onTableSelect(table.name)}
                        index={index}
                        schemaIndex={schemaIndex}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

interface MobileTableCardProps {
  table: TableStat;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  schemaIndex: number;
}

function MobileTableCard({ table, isSelected, onSelect, index, schemaIndex }: MobileTableCardProps) {
  const schemaColor = `var(--db-er-schema-${schemaIndex})`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-start p-4 rounded-2xl text-left transition-colors overflow-hidden border ${
        isSelected
          ? "border-transparent shadow-lg"
          : "bg-db-surface-raised/70 hover:bg-db-surface-raised border-db-border/50"
      }`}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, ${schemaColor}, color-mix(in oklch, ${schemaColor} 70%, transparent))`
          : undefined,
      }}
    >
      {/* Schema indicator */}
      <div
        className="absolute top-3 right-3 size-2.5 rounded-full"
        style={{
          background: isSelected ? "oklch(1 0 0 / 50%)" : schemaColor,
        }}
      />

      <p className={`text-sm font-semibold truncate w-full pr-4 ${
        isSelected ? "text-white" : "text-db-text"
      }`}>
        {formatTableName(table.name)}
      </p>

      <div
        className="mt-3 px-2 py-1 rounded-lg text-xs font-medium tabular-nums"
        style={{
          background: isSelected ? "oklch(1 0 0 / 20%)" : `color-mix(in oklch, ${schemaColor} 15%, transparent)`,
          color: isSelected ? "oklch(1 0 0)" : schemaColor,
        }}
      >
        {formatRowCount(table.rowCount)} rows
      </div>
    </motion.button>
  );
}
