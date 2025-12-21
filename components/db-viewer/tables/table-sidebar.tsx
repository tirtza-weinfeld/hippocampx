"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchInput } from "./search-input";
import { SchemaTableList } from "./sidebar-schema-list";
import { SidebarTooltip } from "./sidebar-tooltip";
import { groupTablesBySchema, buildSchemaIndexMap, buildDomainIndexMap, type TableStat } from "./sidebar-utils";
import type { HoveredTable } from "./sidebar-table-item";

interface TableSidebarProps {
  tables: TableStat[];
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function TableSidebar({
  tables,
  selectedTable,
  onTableSelect,
  isCollapsed,
  onCollapsedChange,
}: TableSidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(() => new Set(tables.map((t) => t.schema)));
  const [hoveredTable, setHoveredTable] = useState<HoveredTable | null>(null);

  const filteredTables = tables.filter(
    (table) => search === "" || table.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedTables = groupTablesBySchema(filteredTables);
  const schemaIndexMap = buildSchemaIndexMap(tables);
  const domainIndexMap = buildDomainIndexMap(tables);

  function toggleSchema(schema: string) {
    setExpandedSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(schema)) {
        next.delete(schema);
      } else {
        next.add(schema);
      }
      return next;
    });
  }

  return (
    <motion.aside
      data-collapsed={isCollapsed || undefined}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 300 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="group/sidebar relative flex flex-col h-full overflow-hidden shrink-0 pt-10 md:pt-0"
    >
      {/* Table list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pt-3 pb-2 group-data-[collapsed]/sidebar:px-1.5 group-data-[collapsed]/sidebar:pt-2 transition-all">
        {groupedTables.size > 0 && (
          <div className="flex flex-col gap-2 group-data-[collapsed]/sidebar:gap-1">
            {Array.from(groupedTables.entries()).map(([schema, schemaTables]) => {
              const isExpanded = expandedSchemas.has(schema);
              const schemaIndex = (schemaIndexMap.get(schema) ?? 0) % 6;

              return (
                <div
                  key={schema}
                  data-db-schema={schemaIndex}
                  className="rounded-lg p-1 group-data-[collapsed]/sidebar:p-0.5 transition-all"
                  style={{
                    background: `color-mix(in oklch, var(--db-er-schema-${schemaIndex}) 6%, transparent)`,
                  }}
                >
                  <SchemaHeader
                    schema={schema}
                    schemaIndex={schemaIndex}
                    count={schemaTables.length}
                    isExpanded={isExpanded}
                    onToggle={() => toggleSchema(schema)}
                  />
                  <AnimatePresence initial={false}>
                    {(isExpanded || isCollapsed) && (
                      <SchemaTableList
                        schemaTables={schemaTables}
                        schemaIndex={schemaIndex}
                        domainIndexMap={domainIndexMap}
                        selectedTable={selectedTable}
                        onTableSelect={onTableSelect}
                        onHover={setHoveredTable}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {filteredTables.length === 0 && <EmptyState />}
      </div>

      {/* Footer */}
      <SidebarFooter
        filteredCount={filteredTables.length}
        search={search}
        onSearchChange={setSearch}
        onToggle={() => onCollapsedChange(!isCollapsed)}
      />

      {/* Tooltip - only visible when collapsed (CSS controlled) */}
      <div className="hidden group-data-[collapsed]/sidebar:block">
        <SidebarTooltip hoveredTable={hoveredTable} />
      </div>
    </motion.aside>
  );
}

interface SidebarFooterProps {
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onToggle: () => void;
}

function SidebarFooter({ filteredCount, search, onSearchChange, onToggle }: SidebarFooterProps) {
  return (
    <div className="relative border-t border-db-border/30 p-3 group-data-[collapsed]/sidebar:p-2 transition-all">
      {/* Search - hidden when collapsed */}
      <div className="mb-3 group-data-[collapsed]/sidebar:hidden">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search tables..." />
      </div>

      {/* Footer row: info + toggle */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Info - hidden when collapsed */}
        {/* <div className="flex items-center gap-3 flex-1 min-w-0"> */}
          <button className="size-10 rounded-2xl bg-gradient-to-br from-db-neon/20 via-transparent to-db-neon/5 flex items-center justify-center shrink-0
          group-data-[collapsed]/sidebar:rotate-90
          "
          onClick={onToggle}
          >
            <svg className="size-5 text-db-text " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </button>
          <div className="min-w-0  group-data-[collapsed]/sidebar:hidden">
            <h2 className="text-sm font-semibold text-db-text">Tables</h2>
            <p className="text-xs text-db-text-muted">{filteredCount} on Neon</p>
          </div>
        </div>

      
      {/* </div> */}
    </div>
  );
}

interface SchemaHeaderProps {
  schema: string;
  schemaIndex: number;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function SchemaHeader({ schema, schemaIndex, count, isExpanded, onToggle }: SchemaHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-db-surface-raised/40 transition-colors group/schema group-data-[collapsed]/sidebar:hidden"
      aria-expanded={isExpanded}
    >
      <motion.svg
        className="size-3.5 text-db-text-muted group-hover/schema:text-db-text transition-colors"
        viewBox="0 0 16 16"
        fill="currentColor"
        animate={{ rotate: isExpanded ? 0 : -90 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      >
        <path
          fillRule="evenodd"
          d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </motion.svg>
      <span className="size-2 rounded-full shrink-0" style={{ background: `var(--db-er-schema-${schemaIndex})` }} />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-db-text-muted group-hover/schema:text-db-text transition-colors">
        {schema}
      </span>
      <span
        className="ml-auto text-[10px] tabular-nums px-1.5 py-0.5 rounded font-medium"
        style={{
          background: `color-mix(in oklch, var(--db-er-schema-${schemaIndex}) 12%, transparent)`,
          color: `var(--db-er-schema-${schemaIndex})`,
        }}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center group-data-[collapsed]/sidebar:hidden">
      <div className="size-12 rounded-2xl bg-db-surface-raised/50 flex items-center justify-center mb-3">
        <svg className="size-6 text-db-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-db-text-muted">No tables found</p>
      <p className="text-xs text-db-text-subtle mt-1">Try a different search</p>
    </div>
  );
}
