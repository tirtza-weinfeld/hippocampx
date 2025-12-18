"use client";

import { useRef, useCallback } from "react";
import { motion } from "motion/react";
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
  reducedMotion?: boolean;
  zoom: number;
  onZoomToggle: () => void;
  onZoomSet: (zoom: number) => void;
  highlightMode?: "hover" | "focused" | "preview" | null;
  onDragStart: (clientX: number, clientY: number) => void;
  onBringToFront: () => void;
  schemaIndex: number;
}

interface PinchState {
  initialDistance: number;
  initialZoom: number;
}

const DOUBLE_TAP_DELAY = 300;

const columnVariants = {
  idle: { fill: "transparent" },
  hover: { fill: "oklch(0.95 0.003 264 / 8%)" },
} as const;

export function ERTableNode({
  table,
  x,
  y,
  onColumnSelect,
  highlightedColumns,
  reducedMotion = false,
  zoom,
  onZoomToggle,
  onZoomSet,
  highlightMode = null,
  onDragStart,
  onBringToFront,
  schemaIndex,
}: ERTableNodeProps) {
  const height = LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
  const animationDuration = reducedMotion ? 0 : 0.25;

  // Refs for gesture detection
  const lastTapRef = useRef<number>(0);
  const pinchRef = useRef<PinchState | null>(null);
  const activeTouchesRef = useRef<Map<number, PointerEvent>>(new Map());

  // Calculate center point for zoom transform
  const centerX = x + LAYOUT.TABLE_WIDTH / 2;
  const centerY = y + height / 2;

  // Double-tap detection and pinch start
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Always bring table to front on any click
      onBringToFront();

      // Track touch for pinch detection
      if (e.pointerType === "touch") {
        activeTouchesRef.current.set(e.pointerId, e.nativeEvent);

        // Pinch start: two fingers down
        if (activeTouchesRef.current.size === 2) {
          const touches = Array.from(activeTouchesRef.current.values());
          const dx = touches[1].clientX - touches[0].clientX;
          const dy = touches[1].clientY - touches[0].clientY;
          const distance = Math.hypot(dx, dy);
          pinchRef.current = { initialDistance: distance, initialZoom: zoom };
          e.stopPropagation();
          return;
        }

        // Double-tap detection (single finger)
        if (activeTouchesRef.current.size === 1) {
          const now = Date.now();
          if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            onZoomToggle();
            lastTapRef.current = 0;
            e.stopPropagation();
          } else {
            lastTapRef.current = now;
          }
        }
      }
    },
    [zoom, onZoomToggle, onBringToFront]
  );

  // Pinch move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch" && activeTouchesRef.current.has(e.pointerId)) {
        activeTouchesRef.current.set(e.pointerId, e.nativeEvent);

        if (pinchRef.current && activeTouchesRef.current.size === 2) {
          const touches = Array.from(activeTouchesRef.current.values());
          const dx = touches[1].clientX - touches[0].clientX;
          const dy = touches[1].clientY - touches[0].clientY;
          const distance = Math.hypot(dx, dy);
          const scale = distance / pinchRef.current.initialDistance;
          onZoomSet(pinchRef.current.initialZoom * scale);
          e.stopPropagation();
        }
      }
    },
    [onZoomSet]
  );

  // Pinch end
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      activeTouchesRef.current.delete(e.pointerId);
      if (activeTouchesRef.current.size < 2) {
        pinchRef.current = null;
      }
    }
  }, []);

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

    // Start drag
    onDragStart(e.clientX, e.clientY);

    // Also handle pinch/double-tap for mobile
    handlePointerDown(e);
  };

  return (
    <motion.g
      data-table-name={table.name}
      data-db-schema={schemaIndex % 6}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: zoom,
      }}
      transition={{ duration: animationDuration, ease: "easeOut" }}
      style={{
        transformOrigin: `${centerX}px ${centerY}px`,
        cursor: "grab",
      }}
      onPointerDown={handleTablePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="group"
      aria-label={`Table: ${table.name}, ${table.columns.length} columns${zoom !== 1 ? `, Zoom: ${Math.round(zoom * 100)}%` : ""}`}
      className="outline-none"
      pointerEvents="all"
    >
      {/* Card Background with shadow */}
      <rect
        x={x}
        y={y}
        width={LAYOUT.TABLE_WIDTH}
        height={height}
        rx={12}
        className="fill-db-er-card"
        style={{
          stroke: "var(--db-er-schema)",
          strokeOpacity: 0.5,
          filter: "drop-shadow(0 2px 8px oklch(0 0 0 / 8%))",
        }}
      />

      {/* Highlight outline - different styles per mode */}
      {highlightMode === "hover" && (
        <rect
          x={x - 2}
          y={y - 2}
          width={LAYOUT.TABLE_WIDTH + 4}
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
          width={LAYOUT.TABLE_WIDTH + 6}
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
          width={LAYOUT.TABLE_WIDTH + 4}
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
        width={LAYOUT.TABLE_WIDTH}
        height={LAYOUT.HEADER_HEIGHT}
        rx={12}
        className="fill-db-er-card-header"
      />
      <rect
        x={x}
        y={y + LAYOUT.HEADER_HEIGHT - 12}
        width={LAYOUT.TABLE_WIDTH}
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
        x={x + 14}
        y={y + 26}
        className="fill-db-er-text text-[13px] font-semibold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {table.name}
      </text>

      {/* Zoom Badge (only shown when zoom !== 1) */}
      {zoom !== 1 && (
        <g transform={`translate(${x + LAYOUT.TABLE_WIDTH - 50}, ${y + 12})`}>
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
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {Math.round(zoom * 100)}%
          </text>
        </g>
      )}

      {/* Columns */}
      {table.columns.map((col, i) => {
        const colY = y + LAYOUT.HEADER_HEIGHT + i * LAYOUT.COLUMN_HEIGHT;
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

        return (
          <g
            key={col.name}
            role="listitem"
            aria-label={`${col.name}: ${col.type}`}
            className={isClickable ? "cursor-pointer" : undefined}
            onClick={isClickable ? handleColumnClick : undefined}
          >
            {/* Column hover background */}
            <motion.rect
              x={x + 1}
              y={colY}
              width={LAYOUT.TABLE_WIDTH - 2}
              height={LAYOUT.COLUMN_HEIGHT}
              variants={columnVariants}
              initial="idle"
              whileHover={isClickable ? "hover" : "idle"}
              rx={isLastColumn ? 11 : 0}
              className={highlight === "pk"
                ? "fill-db-er-line-pk/20"
                : highlight === "fk"
                  ? "fill-db-er-line-fk/20"
                  : "fill-transparent"
              }
            />

            {/* Column name */}
            <text
              x={x + 12}
              y={colY + 18}
              className="fill-db-er-text text-[11px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {col.name}
            </text>

            {/* Column type */}
            <text
              x={x + LAYOUT.TABLE_WIDTH - 12}
              y={colY + 18}
              textAnchor="end"
              className="fill-db-er-text-type text-[10px]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {col.type.length > 12 ? `${col.type.slice(0, 12)}…` : col.type}
            </text>

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
                y1={colY + LAYOUT.COLUMN_HEIGHT}
                x2={x + LAYOUT.TABLE_WIDTH - 8}
                y2={colY + LAYOUT.COLUMN_HEIGHT}
                className="stroke-db-er-border/50"
              />
            )}
          </g>
        );
      })}

      </motion.g>
  );
}
