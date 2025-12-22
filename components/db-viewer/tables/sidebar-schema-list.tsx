"use client";

import { motion } from "motion/react";
import { TableItem, type HoveredTable } from "./sidebar-table-item";
import type { TableStat } from "./sidebar-utils";

interface SchemaTableListProps {
  schemaTables: TableStat[];
  schemaIndex: number;
  domainIndexMap: Map<string, number>;
  selectedTable: string | null;
  onTableSelect: (tableName: string) => void;
  onHover: (table: HoveredTable | null) => void;
}

export function SchemaTableList({
  schemaTables,
  schemaIndex,
  domainIndexMap,
  selectedTable,
  onTableSelect,
  onHover,
}: SchemaTableListProps) {
  const domains = [...new Set(schemaTables.map((t) => t.domain).filter((d): d is string => !!d))];
  const hasDomains = domains.length > 0;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-0.5 pt-0.5 group-data-[collapsed]/sidebar:gap-1 group-data-[collapsed]/sidebar:pt-0">
        {hasDomains
          ? [...domains, null].map((domain) => {
              const domainTables = schemaTables.filter((t) =>
                domain ? t.domain === domain : !t.domain
              );
              if (domainTables.length === 0) return null;
              const domainIdx = domain ? (domainIndexMap.get(domain) ?? 0) % 6 : schemaIndex;

              return (
                <div
                  key={domain ?? "__no_domain__"}
                  className="flex flex-col gap-px group-data-[collapsed]/sidebar:gap-0.5 rounded-lg transition-all"
                  style={
                    domain
                      ? {
                          background: `color-mix(in oklch, var(--db-er-schema-${domainIdx}) 5%, transparent)`,
                          padding: "4px",
                          marginTop: "2px",
                        }
                      : undefined
                  }
                >
                  {domain && (
                    <div
                      className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 group-data-[collapsed]/sidebar:hidden opacity-70"
                      style={{ color: `var(--db-er-schema-${domainIdx})` }}
                    >
                      {domain}
                    </div>
                  )}
                  {domainTables.map((table) => (
                    <TableItem
                      key={table.name}
                      table={table}
                      isSelected={selectedTable === table.name}
                      onSelect={() => onTableSelect(table.name)}
                      onHover={onHover}
                      schemaIndex={domain ? domainIdx : schemaIndex}
                    />
                  ))}
                </div>
              );
            })
          : schemaTables.map((table) => (
              <TableItem
                key={table.name}
                table={table}
                isSelected={selectedTable === table.name}
                onSelect={() => onTableSelect(table.name)}
                onHover={onHover}
                schemaIndex={schemaIndex}
              />
            ))}
      </div>
    </motion.div>
  );
}
