"use client";

import { useState, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { computeSchemaLayout, generatePathsFromPositions, LAYOUT } from "@/lib/db-viewer/er-layout";
import { useERDiagramStore } from "@/lib/db-viewer/er-store";
import { computeSchemaIndexMap, computeDomainIndexMap, computeHighlightedColumns, computeSchemaBounds, computeDomainBounds, isTableElement } from "@/lib/db-viewer/er-utils";
import { CANVAS_ZOOM, TABLE_ZOOM, clampCanvasScale, clampTableZoom } from "@/lib/db-viewer/er-constants";
import type { SchemaTopology, ColumnSelection, TablePosition, CanvasDragState, TableDragState } from "@/lib/db-viewer/types";
import { useContainerResize, useInitPositions, useAutoFit, useZoomTargetReset, useWheelZoom, usePointerHover, usePinchZoom } from "./use-er-effects";

export function useERDiagram(topology: SchemaTopology) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<CanvasDragState | null>(null);
  const tableDragRef = useRef<TableDragState | null>(null);

  // Store state
  const {
    hiddenTables: hiddenTablesArray,
    transform,
    selectedColumn,
    tableZooms,
    focusedTable,
    tableZIndexes,
    positions: storedPositions,
    expandedTables,
    _hasHydrated,
  } = useERDiagramStore(useShallow(s => ({
    hiddenTables: s.hiddenTables,
    transform: s.transform,
    selectedColumn: s.selectedColumn,
    tableZooms: s.tableZooms,
    focusedTable: s.focusedTable,
    tableZIndexes: s.tableZIndexes,
    positions: s.positions,
    expandedTables: s.expandedTables,
    _hasHydrated: s._hasHydrated,
  })));

  const hiddenTables = new Set(hiddenTablesArray);

  // Store actions
  const {
    toggleTable, showAllTables, hideAllTables, toggleSchema, setTransform, setScale,
    panTo, setSelectedColumn, setTableZoom, setFocusedTable, bringTableToFront,
    setPositions, updatePosition, resetLayout: storeResetLayout, toggleTableExpanded,
  } = useERDiagramStore.getState();

  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingTable, setIsDraggingTable] = useState(false);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [previewTable, setPreviewTable] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Computed values
  const initialLayout = computeSchemaLayout(topology);
  // Merge: stored positions override initial, so drag updates persist while other tables keep initial positions
  const hasAllStoredPositions = topology.tables.every(t => t.name in storedPositions);
  const positions = { ...initialLayout.positions, ...storedPositions };
  const schemaIndexMap = computeSchemaIndexMap(topology.tables);
  const domainIndexMap = computeDomainIndexMap(topology.tables);
  const schemaBounds = computeSchemaBounds(topology.tables, hiddenTables, positions, schemaIndexMap, expandedTables);
  const domainBounds = computeDomainBounds(topology.tables, hiddenTables, positions, domainIndexMap, expandedTables);
  const paths = generatePathsFromPositions(topology.relationships, positions, topology.tables, expandedTables);
  const highlightedColumns = computeHighlightedColumns(selectedColumn, topology.relationships);

  // Table zoom handler for keyboard shortcuts
  function handleTableZoom(tableName: string, delta: number) {
    const current = tableZooms[tableName] ?? 1;
    setTableZoom(tableName, clampTableZoom(current * (delta > 0 ? TABLE_ZOOM.step : 1 / TABLE_ZOOM.step)));
  }

  function handleTableZoomSet(tableName: string, zoom: number) {
    setTableZoom(tableName, clampTableZoom(zoom));
  }

  function handleColumnSelect(selection: ColumnSelection | null) {
    if (selectedColumn?.table === selection?.table && selectedColumn?.column === selection?.column) {
      setSelectedColumn(null);
    } else {
      setSelectedColumn(selection);
    }
  }

  // Table drag
  function handleTableDragStart(tableName: string, clientX: number, clientY: number) {
    const pos = positions[tableName] as TablePosition | undefined;
    if (!pos) return;
    tableDragRef.current = { tableName, startX: clientX, startY: clientY, tableStartX: pos.x, tableStartY: pos.y };
    setIsDraggingTable(true);
    bringTableToFront(tableName);
  }

  function handleTableDragMove(clientX: number, clientY: number) {
    const drag = tableDragRef.current;
    if (!drag) return;
    const dx = (clientX - drag.startX) / transform.scale;
    const dy = (clientY - drag.startY) / transform.scale;
    updatePosition(drag.tableName, { ...positions[drag.tableName], x: drag.tableStartX + dx, y: drag.tableStartY + dy });
  }

  function handleTableDragEnd() {
    tableDragRef.current = null;
    setIsDraggingTable(false);
  }

  // Canvas pointer handlers - touch disabled to allow page scroll on mobile
  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0 || isTableElement(e.target as Element)) return;
    setFocusedTable(null);
    if (e.pointerType === "touch") return; // Allow page scroll on mobile
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (isDraggingTable && tableDragRef.current) { handleTableDragMove(e.clientX, e.clientY); return; }
    const drag = dragRef.current;
    if (!isDragging || !drag) return;
    setTransform({ ...transform, x: drag.tx + e.clientX - drag.x, y: drag.ty + e.clientY - drag.y });
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (isDraggingTable) { handleTableDragEnd(); return; }
    const drag = dragRef.current;
    const wasDragged = drag && (Math.abs(e.clientX - drag.x) > 5 || Math.abs(e.clientY - drag.y) > 5);
    setIsDragging(false);
    dragRef.current = null;
    if (!wasDragged && selectedColumn) setSelectedColumn(null);
  }

  function handlePointerCancel() { setIsDragging(false); dragRef.current = null; }
  function handleSetScale(scale: number) { setScale(clampCanvasScale(scale)); }
  function focusTable(tableName: string) { bringTableToFront(tableName); setFocusedTable(tableName); setPreviewTable(null); }
  function handleHideAll() { hideAllTables(topology.tables.map(t => t.name)); }

  function fitView() {
    const container = containerRef.current;
    if (!container) return;
    let minX = Infinity, maxX = 0, maxY = 0;
    for (const pos of Object.values(positions)) {
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x + pos.width);
      maxY = Math.max(maxY, pos.y + pos.height);
    }
    const CURVE_PADDING = 100;
    const viewBoxX = Math.max(0, minX - CURVE_PADDING);
    const contentWidth = maxX + LAYOUT.PADDING + CURVE_PADDING - viewBoxX;
    const viewBoxHeight = maxY + LAYOUT.PADDING;
    const rect = container.getBoundingClientRect();
    const margin = 140;
    const scale = Math.min((rect.width - margin) / contentWidth, (rect.height - margin) / viewBoxHeight, 0.9);
    setTransform({ x: (rect.width - contentWidth * scale) / 2 - viewBoxX * scale, y: Math.max(50, (rect.height - viewBoxHeight * scale) / 2), scale });
  }

  function handleResetLayout() {
    storeResetLayout();
    setPositions(computeSchemaLayout(topology).positions);
    setPreviewTable(null);
    setTimeout(fitView, 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) return;
    const isZoomKey = e.key === "=" || e.key === "+" || e.key === "-" || e.key === "_" || e.key === "0";
    if (!isZoomKey) return;
    e.preventDefault();
    const target = hoveredTable ?? "canvas";
    if (e.key === "=" || e.key === "+") {
      if (target === "canvas") setScale(transform.scale * CANVAS_ZOOM.step);
      else handleTableZoom(target, 1);
    } else if (e.key === "-" || e.key === "_") {
      if (target === "canvas") setScale(transform.scale / CANVAS_ZOOM.step);
      else handleTableZoom(target, -1);
    } else if (e.key === "0") {
      if (target === "canvas") setScale(1);
      else handleTableZoomSet(target, 1);
    } else if (e.key === "r" || e.key === "R") handleResetLayout();
    else if (e.key === "f" || e.key === "F") fitView();
  }

  // Effects
  useContainerResize(containerRef, setContainerSize);
  useInitPositions(_hasHydrated, hasAllStoredPositions, initialLayout.positions, setPositions);
  useAutoFit(_hasHydrated, hasAllStoredPositions, transform, fitView);
  const zoomTargetRef = useZoomTargetReset();
  useWheelZoom(containerRef, zoomTargetRef, setTransform, handleTableZoom);
  usePointerHover(containerRef, setHoveredTable);
  usePinchZoom(containerRef, setTransform);

  return {
    containerRef, transform, selectedColumn, tableZooms, focusedTable, tableZIndexes,
    positions, hiddenTables, schemaIndexMap, domainIndexMap, schemaBounds, domainBounds, paths, highlightedColumns,
    isDragging, isDraggingTable, hoveredTable, previewTable, containerSize, expandedTables,
    handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel,
    handleKeyDown, handleColumnSelect,
    handleTableDragStart, handleSetScale, fitView, handleResetLayout, focusTable,
    setPreviewTable, handleHideAll, toggleTable, toggleSchema, showAllTables,
    panTo, bringTableToFront, setFocusedTable, toggleTableExpanded,
  };
}
