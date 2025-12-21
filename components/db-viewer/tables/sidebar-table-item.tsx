"use client";

import { motion } from "motion/react";
import { formatTableName, formatRowCount, type TableStat } from "./sidebar-utils";

export interface HoveredTable {
  name: string;
  schema: string;
  top: number;
}

interface TableItemProps {
  table: TableStat;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (table: HoveredTable | null) => void;
  schemaIndex: number;
}

export function TableItem({ table, isSelected, onSelect, onHover, schemaIndex }: TableItemProps) {
  const schemaColor = `var(--db-er-schema-${schemaIndex})`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onHover({ name: table.name, schema: table.schema, top: rect.top + rect.height / 2 });
      }}
      onMouseLeave={() => onHover(null)}
      initial={false}
      animate={{ opacity: 1 }}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors group/item
        group-data-[collapsed]/sidebar:p-1 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:gap-0
        ${isSelected ? "bg-db-surface-raised/80" : "hover:bg-db-surface-raised/50"}`}
    >
      {/* Icon */}
      <div
        className="size-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors shrink-0
          group-data-[collapsed]/sidebar:size-8 group-data-[collapsed]/sidebar:rounded-lg group-data-[collapsed]/sidebar:text-[11px]"
        style={{
          background: isSelected ? schemaColor : `color-mix(in oklch, ${schemaColor} 12%, transparent)`,
          color: isSelected ? "white" : schemaColor,
        }}
      >
        {table.name.charAt(0).toUpperCase()}
      </div>

      {/* Text - hidden when collapsed */}
      <div className="flex-1 min-w-0 group-data-[collapsed]/sidebar:hidden">
        <p className="text-sm font-medium truncate transition-colors" style={{ color: isSelected ? schemaColor : undefined }}>
          {isSelected ? (
            formatTableName(table.name)
          ) : (
            <span className="text-db-text group-hover/item:text-db-text">{formatTableName(table.name)}</span>
          )}
        </p>
      </div>

      {/* Row count - hidden when collapsed */}
      <span
        className="text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded transition-colors group-data-[collapsed]/sidebar:hidden"
        style={{
          background: isSelected ? `color-mix(in oklch, ${schemaColor} 15%, transparent)` : undefined,
          color: isSelected ? schemaColor : undefined,
        }}
      >
        <span className={isSelected ? "" : "text-db-text-subtle group-hover/item:text-db-text-muted"}>
          {formatRowCount(table.rowCount)}
        </span>
      </span>
    </motion.button>
  );
}
