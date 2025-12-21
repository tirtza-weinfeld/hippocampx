"use client";

import { motion, useReducedMotion } from "motion/react";
import { LAYOUT } from "@/lib/db-viewer/er-layout";
import type { SchemaTable, ColumnSelection } from "@/lib/db-viewer/types";

interface HighlightedColumns {
  pk: { table: string; column: string } | null;
  fks: Array<{ table: string; column: string }>;
}

interface ERTableNodeProps {
  table: SchemaTable;
  x: number;
  y: number;
  onColumnSelect: (selection: ColumnSelection | null) => void;
  highlightedColumns: HighlightedColumns;
  zoom: number;
  highlightMode?: "hover" | "focused" | "preview" | null;
  onDragStart: (clientX: number, clientY: number) => void;
  onBringToFront: () => void;
  schemaIndex: number;
  domainIndex?: number;
  expanded?: boolean;
  onToggleExpanded?: () => void;
}

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

export function ERTableNode({
  table,
  x,
  y,
  onColumnSelect,
  highlightedColumns,
  zoom,
  highlightMode = null,
  onDragStart,
  onBringToFront,
  schemaIndex,
  domainIndex,
  expanded = false,
  onToggleExpanded,
}: ERTableNodeProps) {
  const reducedMotion = useReducedMotion();
  const hasDescriptions = table.description || table.columns.some(col => col.description || col.example);
  const height = LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
  const width = expanded && hasDescriptions
    ? LAYOUT.TABLE_WIDTH + LAYOUT.EXPANDED_WIDTH
    : LAYOUT.TABLE_WIDTH;
  const animationDuration = reducedMotion ? 0 : 0.25;

  // Calculate center point for zoom transform
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const getColumnHighlight = (colName: string): "pk" | "fk" | null => {
    // Check if this column is the highlighted PK
    if (highlightedColumns.pk?.table === table.name && highlightedColumns.pk.column === colName) {
      return "pk";
    }
    // Check if this column is one of the highlighted FKs
    if (highlightedColumns.fks.some(fk => fk.table === table.name && fk.column === colName)) {
      return "fk";
    }
    return null;
  };

  // Handle table drag start - works from anywhere on the table
  const handleTablePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onBringToFront();
    onDragStart(e.clientX, e.clientY);
  };

  return (
    <motion.g
      data-table-name={table.name}
      data-db-schema={(domainIndex ?? schemaIndex) % 6}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: zoom,
      }}
      transition={{ duration: animationDuration, ease: "easeOut" }}
      style={{
        transformOrigin: `${centerX}px ${centerY}px`,
        cursor: "grab",
        touchAction: "none", // Allow table drag on mobile
      }}
      onPointerDown={handleTablePointerDown}
      role="group"
      aria-label={`Table: ${table.name}, ${table.columns.length} columns${zoom !== 1 ? `, Zoom: ${Math.round(zoom * 100)}%` : ""}`}
      className="outline-none"
      pointerEvents="all"
    >
      {/* Card Background with shadow */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        className="db-er-card-bg fill-db-er-card"
        style={{
          stroke: "var(--db-er-schema)",
          strokeOpacity: 0.5,
        }}
      />

      {/* Highlight outline - different styles per mode */}
      {highlightMode === "hover" && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          rx={14}
          className="fill-none"
          strokeWidth={2}
          strokeDasharray="4 2"
          style={{ stroke: "var(--db-er-schema)" }}
        />
      )}
      {highlightMode === "focused" && (
        <rect
          x={x - 3}
          y={y - 3}
          width={width + 6}
          height={height + 6}
          rx={15}
          className="fill-none"
          strokeWidth={3}
          style={{ stroke: "var(--db-er-schema)" }}
        />
      )}
      {highlightMode === "preview" && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          rx={14}
          className="fill-none animate-pulse"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          style={{ stroke: "var(--db-er-schema)", opacity: 0.6 }}
        />
      )}

      {/* Header */}
      <rect
        x={x}
        y={y}
        width={width}
        height={LAYOUT.HEADER_HEIGHT}
        rx={12}
        className="fill-db-er-card-header"
      />
      <rect
        x={x}
        y={y + LAYOUT.HEADER_HEIGHT - 12}
        width={width}
        height={12}
        className="fill-db-er-card-header"
      />

      {/* Drag icon - 6 dot grip */}
      {/* <g
        className="transition-opacity duration-150"
        style={{ opacity: isHovered ? 0.6 : 0.2 }}
      >
        {[0, 5, 10].map(dy => (
          <g key={dy}>
            <circle cx={x + LAYOUT.TABLE_WIDTH - 16} cy={y + 14 + dy} r={1.5} className="fill-db-er-text-muted" />
            <circle cx={x + LAYOUT.TABLE_WIDTH - 10} cy={y + 14 + dy} r={1.5} className="fill-db-er-text-muted" />
          </g>
        ))}
      </g> */}

      {/* Table Name */}
      <text
        x={x + (hasDescriptions && onToggleExpanded ? 36 : 14)}
        y={y + 26}
        className="fill-db-er-text text-sm font-semibold tracking-tight cursor-pointer hover:underline"
        onClick={(e) => { e.stopPropagation(); copyToClipboard(table.name); }}
      >
        {table.name}
        {!expanded && (table.description || table.domain) && (
          <title>{`${table.description ?? ""}${table.domain ? `\n[${table.domain}]` : ""}`}</title>
        )}
      </text>



      {/* Table description when expanded */}
      {expanded && table.description && (
        <foreignObject
          x={x + LAYOUT.TABLE_WIDTH + 8}
          y={y + 4}
          width={LAYOUT.EXPANDED_WIDTH - 16}
          height={LAYOUT.HEADER_HEIGHT - 4}
        >
          <p className="text-[10px] font-medium text-db-er-text-muted leading-relaxed">
            {table.description}
            {table.domain && (
              <span className="text-db-er-text-type block text-[9px]">[{table.domain}]</span>
            )}
          </p>
        </foreignObject>
      )}

      {/* Expand toggle button - left side, only show if columns have descriptions */}
      {hasDescriptions && onToggleExpanded && (
        <g
          transform={`translate(${x + 10}, ${y + 12})`}
          onClick={(e) => { e.stopPropagation(); onToggleExpanded(); }}
          className="cursor-pointer"
          role="button"
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          <rect
            width={20}
            height={18}
            rx={4}
            className="fill-db-er-text-muted/10 hover:fill-db-er-text-muted/20 transition-colors"
          />
          <text
            x={10}
            y={13}
            textAnchor="middle"
            className="text-[10px] fill-db-er-text-muted select-none pointer-events-none"
          >
            {expanded ? "‹" : "›"}
          </text>
        </g>
      )}

      {/* Zoom Badge (only shown when zoom !== 1) */}
      {zoom !== 1 && (
        <g transform={`translate(${x + width - 50}, ${y + 12})`}>
          <rect
            width={40}
            height={18}
            rx={4}
            className="fill-db-er-text-muted/15"
          />
          <text
            x={20}
            y={13}
            textAnchor="middle"
            className="text-[9px] font-bold fill-db-er-text-muted"
            // style={{ fontFamily: "var(--font-mono)" }}
          >
            {Math.round(zoom * 100)}%
          </text>
        </g>
      )}

      {/* Columns */}
      {table.columns.map((col, i) => {
        const colY = y + LAYOUT.HEADER_HEIGHT + i * LAYOUT.COLUMN_HEIGHT;
        const hasColDescription = col.description || col.example;
        const isLastColumn = i === table.columns.length - 1;
        const isClickable = col.isPrimaryKey || col.foreignKey;
        const highlight = getColumnHighlight(col.name);

        const handleColumnClick = () => {
          onBringToFront(); // Bring table to front when clicking FK/PK
          if (col.foreignKey) {
            onColumnSelect({ table: table.name, column: col.name, type: "fk" });
          } else if (col.isPrimaryKey) {
            onColumnSelect({ table: table.name, column: col.name, type: "pk" });
          }
        };

        const rowHeight = LAYOUT.COLUMN_HEIGHT;

        return (
          <g
            key={col.name}
            role="listitem"
            aria-label={`${col.name}: ${col.type}`}
            className={isClickable ? "cursor-pointer" : undefined}
            onClick={isClickable ? handleColumnClick : undefined}
          >
            {/* Column hover background */}
            <rect
              x={x + 1}
              y={colY}
              width={width - 2}
              height={rowHeight}
              rx={isLastColumn ? 11 : 0}
              className={`db-er-column-row${isClickable ? " clickable" : ""}${
                highlight === "pk"
                  ? " fill-db-er-line-pk/20"
                  : highlight === "fk"
                    ? " fill-db-er-line-fk/20"
                    : ""
              }`}
            />

            {/* Column name */}
            <text
              x={x + 12}
              y={colY + 18}
              className="fill-db-er-text text-[11px] cursor-pointer hover:underline"
              onClick={(e) => { e.stopPropagation(); copyToClipboard(col.name); }}
            >
              {col.name}
              {!expanded && hasColDescription && (
                <title>{`${col.description ?? ""}${col.example ? `\nExample: ${col.example}` : ""}`}</title>
              )}
            </text>

            {/* Column type */}
            <text
              x={x + LAYOUT.TABLE_WIDTH - 12}
              y={colY + 18}
              textAnchor="end"
              className="fill-db-er-text-type text-[0.7rem] tracking-tighter"
            >
              {col.type}
            </text>

            {/* Inline description (horizontal expansion) */}
            {expanded && hasColDescription && (
              <foreignObject
                x={x + LAYOUT.TABLE_WIDTH + 8}
                y={colY + 2}
                width={LAYOUT.EXPANDED_WIDTH - 16}
                height={LAYOUT.COLUMN_HEIGHT}
              >
                <p className="text-[10px] text-db-er-text-muted leading-normal">
                  {col.description}
                  {col.example && (
                    <span className="text-db-er-text-type"> → {col.example}</span>
                  )}
                </p>
              </foreignObject>
            )}

            {/* Primary Key Badge */}
            {col.isPrimaryKey && (
              <g transform={`translate(${x + 100}, ${colY + 6})`}>
                <rect
                  width={20}
                  height={14}
                  rx={3}
                  className={highlight === "pk"
                    ? "fill-db-er-line-pk"
                    : "fill-db-er-pk-soft"
                  }
                />
                <text
                  x={10}
                  y={10}
                  textAnchor="middle"
                  className={highlight === "pk"
                    ? "fill-white text-[8px] font-bold"
                    : "fill-db-er-pk text-[8px] font-bold"
                  }
                >
                  PK
                </text>
              </g>
            )}

            {/* Foreign Key Badge */}
            {col.foreignKey && (
              <g transform={`translate(${x + (col.isPrimaryKey ? 124 : 100)}, ${colY + 6})`}>
                <rect
                  width={20}
                  height={14}
                  rx={3}
                  className={highlight === "fk"
                    ? "fill-db-er-line-fk"
                    : "fill-db-er-fk-soft"
                  }
                />
                <text
                  x={10}
                  y={10}
                  textAnchor="middle"
                  className={highlight === "fk"
                    ? "fill-white text-[8px] font-bold"
                    : "fill-db-er-fk text-[8px] font-bold"
                  }
                >
                  FK
                </text>
              </g>
            )}

            {/* Column separator */}
            {!isLastColumn && (
              <line
                x1={x + 8}
                y1={colY + rowHeight}
                x2={x + width - 8}
                y2={colY + rowHeight}
                className="stroke-db-er-border/50"
              />
            )}
          </g>
        );
      })}

      </motion.g>
  );
}
