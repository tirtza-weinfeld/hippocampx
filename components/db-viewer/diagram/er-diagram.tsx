"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { SchemaTopology, TablePosition } from "@/lib/db-viewer/types";
import { ERTableNode } from "./er-table-node";
import { ERCommandSurface } from "./er-command-surface";
import { ERRelationships } from "./er-relationships";
// import { ERMinimap } from "./er-minimap";
import { ERDefs } from "./er-defs";
import { ERSchemaBackgrounds } from "./er-schema-backgrounds";
import { useERDiagram } from "./use-er-diagram";

interface ERDiagramProps {
  topology: SchemaTopology;
}

export function ERDiagram({ topology }: ERDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const transitionDuration = prefersReducedMotion ? 0 : 0.5;

  const {
    containerRef,
    transform,
    selectedColumn,
    tableZooms,
    focusedTable,
    tableZIndexes,
    positions,
    hiddenTables,
    schemaIndexMap,
    domainIndexMap,
    schemaBounds,
    domainBounds,
    paths,
    highlightedColumns,
    isDragging,
    isDraggingTable,
    hoveredTable,
    previewTable,
    expandedTables,
    // containerSize,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
    handleColumnSelect,
    handleTableDragStart,
    handleSetScale,
    fitView,
    handleResetLayout,
    focusTable,
    setPreviewTable,
    handleHideAll,
    toggleTable,
    toggleSchema,
    showAllTables,
    // panTo,
    bringTableToFront,
    setFocusedTable,
    toggleTableExpanded,
  } = useERDiagram(topology);

  return (
    <div
      ref={containerRef}
      className="relative size-full pb-14 sm:pb-0 db-er-canvas overflow-hidden select-none outline-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ cursor: isDraggingTable ? "move" : isDragging ? "grabbing" : "grab" }}
      role="application"
      aria-label="Entity Relationship Diagram - drag to pan"
    >
      <svg
        ref={svgRef}
        className="size-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <ERDefs />
        <ERSchemaBackgrounds schemaBounds={schemaBounds} />
        <ERSchemaBackgrounds schemaBounds={domainBounds} offsetY={30} />
        <ERRelationships
          relationships={topology.relationships}
          paths={paths}
          hiddenTables={hiddenTables}
          transitionDuration={transitionDuration}
          selectedColumn={selectedColumn}
        />

        <g className="er-tables">
          {topology.tables
            .filter(table => !hiddenTables.has(table.name))
            .slice()
            .sort((a, b) => (tableZIndexes[a.name] ?? 0) - (tableZIndexes[b.name] ?? 0))
            .map(table => {
              const pos = positions[table.name] as TablePosition | undefined;
              if (!pos) return null;

              return (
                <ERTableNode
                  key={table.name}
                  table={table}
                  x={pos.x}
                  y={pos.y}
                  onColumnSelect={handleColumnSelect}
                  highlightedColumns={highlightedColumns}
                  zoom={tableZooms[table.name] ?? 1}
                  highlightMode={
                    focusedTable === table.name ? "focused" :
                    previewTable === table.name ? "preview" :
                    hoveredTable === table.name ? "hover" : null
                  }
                  onDragStart={(clientX: number, clientY: number) => handleTableDragStart(table.name, clientX, clientY)}
                  onBringToFront={() => { bringTableToFront(table.name); setFocusedTable(table.name); }}
                  schemaIndex={schemaIndexMap.get(table.schema) ?? 0}
                  domainIndex={table.domain ? domainIndexMap.get(table.domain) ?? 0 : undefined}
                  expanded={expandedTables[table.name] ?? false}
                  onToggleExpanded={() => toggleTableExpanded(table.name)}
                />
              );
            })}
        </g>
      </svg>

      <div className="sr-only" aria-live="polite">
        Drag to pan, use controls to zoom
      </div>

      {/* {containerSize.width > 0 && (
        <ERMinimap
          positions={positions}
          hiddenTables={hiddenTables}
          transform={transform}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
          schemaIndexMap={schemaIndexMap}
          tables={topology.tables}
          onPan={panTo}
        />
      )} */}

      <ERCommandSurface
        tables={topology.tables}
        hiddenTables={hiddenTables}
        schemaIndexMap={schemaIndexMap}
        domainIndexMap={domainIndexMap}
        scale={transform.scale}
        onToggle={toggleTable}
        onToggleSchema={toggleSchema}
        onShowAll={showAllTables}
        onHideAll={handleHideAll}
        onSetScale={handleSetScale}
        onFitView={fitView}
        onReset={handleResetLayout}
        onFocusTable={focusTable}
        onPreviewTable={setPreviewTable}
      />
    </div>
  );
}
