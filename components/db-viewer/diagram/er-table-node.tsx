"use client";

import { motion } from "motion/react";
import { LAYOUT } from "@/lib/db-viewer/er-layout";
import type { SchemaTable } from "@/lib/db-viewer/types";

interface ERTableNodeProps {
  table: SchemaTable;
  x: number;
  y: number;
  isHidden: boolean;
  onToggleVisibility: () => void;
  onSelect?: () => void;
  reducedMotion?: boolean;
}

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  dimmed: { opacity: 0.3, scale: 0.95 },
} as const;

const columnVariants = {
  idle: { fill: "transparent" },
  hover: { fill: "oklch(0.95 0.003 264 / 8%)" },
} as const;

export function ERTableNode({
  table,
  x,
  y,
  isHidden,
  onToggleVisibility,
  onSelect,
  reducedMotion = false,
}: ERTableNodeProps) {
  const height = LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
  const animationDuration = reducedMotion ? 0 : 0.25;

  return (
    <motion.g
      variants={nodeVariants}
      initial="hidden"
      animate={isHidden ? "dimmed" : "visible"}
      transition={{ duration: animationDuration, ease: "easeOut" }}
      role="group"
      aria-label={`Table: ${table.name}, ${table.columns.length} columns, Provider: ${table.provider}`}
    >
      {/* Card Background with shadow */}
      <rect
        x={x}
        y={y}
        width={LAYOUT.TABLE_WIDTH}
        height={height}
        rx={12}
        className="fill-er-card stroke-er-border"
        style={{
          filter: "drop-shadow(0 2px 8px oklch(0 0 0 / 8%))",
        }}
      />

      {/* Header Background */}
      <rect
        x={x}
        y={y}
        width={LAYOUT.TABLE_WIDTH}
        height={LAYOUT.HEADER_HEIGHT}
        rx={12}
        className="fill-er-card-header"
      />
      {/* Header bottom fill to cover rounded corners */}
      <rect
        x={x}
        y={y + LAYOUT.HEADER_HEIGHT - 12}
        width={LAYOUT.TABLE_WIDTH}
        height={12}
        className="fill-er-card-header"
      />

      {/* Provider Accent Bar */}
      <rect
        x={x}
        y={y}
        width={4}
        height={LAYOUT.HEADER_HEIGHT}
        rx={2}
        className="fill-db-neon"
      />

      {/* Table Name */}
      <text
        x={x + 16}
        y={y + 26}
        className="fill-er-text text-[13px] font-semibold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {table.name}
      </text>

      {/* Provider Badge */}
      <g transform={`translate(${x + LAYOUT.TABLE_WIDTH - 50}, ${y + 12})`}>
        <rect
          width={40}
          height={18}
          rx={4}
          className="fill-db-neon/15"
        />
        <text
          x={20}
          y={13}
          textAnchor="middle"
          className="text-[9px] font-bold uppercase fill-db-neon"
        >
          neon
        </text>
      </g>

      {/* Columns */}
      {table.columns.map((col, i) => {
        const colY = y + LAYOUT.HEADER_HEIGHT + i * LAYOUT.COLUMN_HEIGHT;
        const isLastColumn = i === table.columns.length - 1;

        return (
          <g key={col.name} role="listitem" aria-label={`${col.name}: ${col.type}`}>
            {/* Column hover background */}
            <motion.rect
              x={x + 1}
              y={colY}
              width={LAYOUT.TABLE_WIDTH - 2}
              height={LAYOUT.COLUMN_HEIGHT}
              variants={columnVariants}
              initial="idle"
              whileHover="hover"
              rx={isLastColumn ? 11 : 0}
              className="fill-transparent"
            />

            {/* Column name */}
            <text
              x={x + 12}
              y={colY + 18}
              className="fill-er-text text-[11px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {col.name}
            </text>

            {/* Column type */}
            <text
              x={x + LAYOUT.TABLE_WIDTH - 12}
              y={colY + 18}
              textAnchor="end"
              className="fill-er-text-type text-[10px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {col.type.length > 12 ? `${col.type.slice(0, 12)}…` : col.type}
            </text>

            {/* Primary Key Badge */}
            {col.isPrimaryKey && (
              <g transform={`translate(${x + 100}, ${colY + 6})`}>
                <rect width={20} height={14} rx={3} className="fill-er-pk-soft" />
                <text
                  x={10}
                  y={10}
                  textAnchor="middle"
                  className="fill-er-pk text-[8px] font-bold"
                >
                  PK
                </text>
              </g>
            )}

            {/* Foreign Key Badge */}
            {col.foreignKey && (
              <g transform={`translate(${x + (col.isPrimaryKey ? 124 : 100)}, ${colY + 6})`}>
                <rect width={20} height={14} rx={3} className="fill-er-fk-soft" />
                <text
                  x={10}
                  y={10}
                  textAnchor="middle"
                  className="fill-er-fk text-[8px] font-bold"
                >
                  FK
                </text>
              </g>
            )}

            {/* Column separator */}
            {!isLastColumn && (
              <line
                x1={x + 8}
                y1={colY + LAYOUT.COLUMN_HEIGHT}
                x2={x + LAYOUT.TABLE_WIDTH - 8}
                y2={colY + LAYOUT.COLUMN_HEIGHT}
                className="stroke-er-border/50"
              />
            )}
          </g>
        );
      })}

      {/* Visibility Toggle Button */}
      <g
        transform={`translate(${x + LAYOUT.TABLE_WIDTH - 28}, ${y + height - 22})`}
        onClick={e => {
          e.stopPropagation();
          onToggleVisibility();
        }}
        className="cursor-pointer"
        role="button"
        aria-label={isHidden ? "Show table" : "Hide table"}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleVisibility();
          }
        }}
      >
        <motion.circle
          r={10}
          cx={10}
          cy={10}
          className="fill-transparent"
          whileHover={{ fill: "oklch(0.95 0.003 264)" }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
        />
        <path
          d={isHidden ? "M4 10h12M10 4v12" : "M4 10h12"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="text-er-text-muted"
        />
      </g>

      {/* Clickable header area for table selection */}
      {onSelect && !isHidden && (
        <rect
          x={x}
          y={y}
          width={LAYOUT.TABLE_WIDTH}
          height={LAYOUT.HEADER_HEIGHT}
          className="fill-transparent cursor-pointer"
          onClick={onSelect}
          role="button"
          aria-label={`Select ${table.name} table`}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
        />
      )}
    </motion.g>
  );
}
