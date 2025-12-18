"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { LAYOUT } from "@/lib/db-viewer/er-layout";

interface TablePosition {
  x: number;
  y: number;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface ERMinimapProps {
  positions: Partial<Record<string, TablePosition>>;
  hiddenTables: Set<string>;
  transform: Transform;
  containerWidth: number;
  containerHeight: number;
  schemaIndexMap: Map<string, number>;
  tables: Array<{ name: string; schema: string; columns: unknown[] }>;
  onPan: (x: number, y: number) => void;
}

const MINIMAP_WIDTH = 140;
const MINIMAP_HEIGHT = 100;
const PADDING = 10;

export function ERMinimap({
  positions,
  hiddenTables,
  transform,
  containerWidth,
  containerHeight,
  schemaIndexMap,
  tables,
  onPan,
}: ERMinimapProps) {
  // Calculate content bounds from all visible table positions
  const bounds = useMemo(() => {
    const visibleTables = tables.filter(t => !hiddenTables.has(t.name));
    if (visibleTables.length === 0) return { minX: 0, minY: 0, maxX: 100, maxY: 100 };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const table of visibleTables) {
      const pos = positions[table.name];
      if (!pos) continue;
      const height = LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + LAYOUT.TABLE_WIDTH);
      maxY = Math.max(maxY, pos.y + height);
    }

    // Add padding around content
    const padX = (maxX - minX) * 0.1;
    const padY = (maxY - minY) * 0.1;
    return {
      minX: minX - padX,
      minY: minY - padY,
      maxX: maxX + padX,
      maxY: maxY + padY,
    };
  }, [positions, hiddenTables, tables]);

  // Scale factor to fit content into minimap
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const scaleX = (MINIMAP_WIDTH - PADDING * 2) / contentWidth;
  const scaleY = (MINIMAP_HEIGHT - PADDING * 2) / contentHeight;
  const minimapScale = Math.min(scaleX, scaleY);

  // Transform diagram coords to minimap coords
  function toMinimap(x: number, y: number) {
    return {
      x: PADDING + (x - bounds.minX) * minimapScale,
      y: PADDING + (y - bounds.minY) * minimapScale,
    };
  }

  // Current viewport in diagram space
  const viewportX = -transform.x / transform.scale;
  const viewportY = -transform.y / transform.scale;
  const viewportW = containerWidth / transform.scale;
  const viewportH = containerHeight / transform.scale;

  // Viewport rect in minimap coords (clamped to minimap bounds)
  const vpRaw = toMinimap(viewportX, viewportY);
  const vpWidthRaw = viewportW * minimapScale;
  const vpHeightRaw = viewportH * minimapScale;

  // Clamp viewport to stay within minimap
  const vpX = Math.max(0, Math.min(vpRaw.x, MINIMAP_WIDTH));
  const vpY = Math.max(0, Math.min(vpRaw.y, MINIMAP_HEIGHT));
  const vpWidth = Math.max(10, Math.min(vpWidthRaw - Math.max(0, -vpRaw.x), MINIMAP_WIDTH - vpX));
  const vpHeight = Math.max(10, Math.min(vpHeightRaw - Math.max(0, -vpRaw.y), MINIMAP_HEIGHT - vpY));

  // Only show viewport indicator when zoomed in or panned (not showing everything)
  const minimapContentWidth = (MINIMAP_WIDTH - PADDING * 2);
  const minimapContentHeight = (MINIMAP_HEIGHT - PADDING * 2);
  const showViewport = vpWidth < minimapContentWidth * 0.95 || vpHeight < minimapContentHeight * 0.95;

  // Handle click to pan
  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click to diagram coords (center viewport on click)
    const diagramX = bounds.minX + (clickX - PADDING) / minimapScale;
    const diagramY = bounds.minY + (clickY - PADDING) / minimapScale;

    // Calculate transform to center viewport on this point
    const newX = -(diagramX - containerWidth / transform.scale / 2) * transform.scale;
    const newY = -(diagramY - containerHeight / transform.scale / 2) * transform.scale;

    onPan(newX, newY);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-20 left-4 db-er-glass overflow-hidden"
      style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
      onPointerDown={e => e.stopPropagation()}
    >
      <svg
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-crosshair"
        onClick={handleClick}
      >
        {/* Tables as small rects */}
        {tables
          .filter(t => !hiddenTables.has(t.name))
          .map(table => {
            const pos = positions[table.name];
            if (!pos) return null;
            const height = LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
            const mp = toMinimap(pos.x, pos.y);
            const schemaIdx = schemaIndexMap.get(table.schema) ?? 0;

            return (
              <rect
                key={table.name}
                x={mp.x}
                y={mp.y}
                width={LAYOUT.TABLE_WIDTH * minimapScale}
                height={height * minimapScale}
                rx={1}
                className="fill-db-er-card"
                style={{
                  stroke: `var(--db-er-schema-${schemaIdx})`,
                  strokeWidth: 0.5,
                }}
              />
            );
          })}

        {/* Viewport indicator - only show when zoomed/panned */}
        {showViewport && (
          <rect
            x={vpX}
            y={vpY}
            width={vpWidth}
            height={vpHeight}
            rx={2}
            className="fill-db-er-fk/10 stroke-db-er-fk/60"
            strokeWidth={1}
          />
        )}
      </svg>
    </motion.div>
  );
}
