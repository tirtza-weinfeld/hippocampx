"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { computeSchemaLayout } from "@/lib/db-viewer/er-layout";
import type { SchemaTopology } from "@/lib/db-viewer/types";
import { ERTableNode } from "./er-table-node";
import { ERControls } from "./er-controls";
import { ERVisibilityPanel } from "./er-visibility-panel";

interface ERDiagramProps {
  topology: SchemaTopology;
  onTableSelect?: (tableName: string) => void;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface GestureState {
  dragStart: { x: number; y: number; tx: number; ty: number } | null;
  pinchDistance: number | null;
  pinchCenter: { x: number; y: number } | null;
}

const SCALE_LIMITS = { min: 0.25, max: 2 } as const;
const ZOOM_STEP = 1.2;

function clampScale(scale: number): number {
  return Math.min(Math.max(scale, SCALE_LIMITS.min), SCALE_LIMITS.max);
}

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.6 },
  dimmed: { pathLength: 1, opacity: 0.15 },
} as const;

export function ERDiagram({ topology, onTableSelect }: ERDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<GestureState>({
    dragStart: null,
    pinchDistance: null,
    pinchCenter: null,
  });

  const [hiddenTables, setHiddenTables] = useState<Set<string>>(new Set());
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const layout = useMemo(
    () => computeSchemaLayout(topology, hiddenTables),
    [topology, hiddenTables]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    gestureRef.current.dragStart = {
      x: e.clientX,
      y: e.clientY,
      tx: transform.x,
      ty: transform.y,
    };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { dragStart } = gestureRef.current;
    if (!isDragging || !dragStart) return;

    setTransform(prev => ({
      ...prev,
      x: dragStart.tx + e.clientX - dragStart.x,
      y: dragStart.ty + e.clientY - dragStart.y,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    gestureRef.current.dragStart = null;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      gestureRef.current.dragStart = {
        x: touch.clientX,
        y: touch.clientY,
        tx: transform.x,
        ty: transform.y,
      };
    } else if (e.touches.length === 2) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      gestureRef.current.pinchDistance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      gestureRef.current.pinchCenter = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }
  }, [transform.x, transform.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const { dragStart, pinchDistance } = gestureRef.current;

    if (e.touches.length === 1 && isDragging && dragStart) {
      const touch = e.touches[0];
      setTransform(prev => ({
        ...prev,
        x: dragStart.tx + touch.clientX - dragStart.x,
        y: dragStart.ty + touch.clientY - dragStart.y,
      }));
    } else if (e.touches.length === 2 && pinchDistance !== null) {
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scaleDelta = distance / pinchDistance;

      setTransform(prev => ({
        ...prev,
        scale: clampScale(prev.scale * scaleDelta),
      }));

      gestureRef.current.pinchDistance = distance;
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    gestureRef.current = {
      dragStart: null,
      pinchDistance: null,
      pinchCenter: null,
    };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
    setTransform(prev => ({
      ...prev,
      scale: clampScale(prev.scale * delta),
    }));
  }, []);

  // Prevent default touch behavior for smooth pinch zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function preventDefault(e: TouchEvent) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }

    container.addEventListener("touchmove", preventDefault, { passive: false });
    return () => container.removeEventListener("touchmove", preventDefault);
  }, []);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: clampScale(prev.scale * ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: clampScale(prev.scale / ZOOM_STEP),
    }));
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const fitView = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const margin = 140;
    const contentWidth = layout.viewBox.width - layout.viewBox.x;
    const scaleX = (rect.width - margin) / contentWidth;
    const scaleY = (rect.height - margin) / layout.viewBox.height;
    const scale = Math.min(scaleX, scaleY, 0.9);

    setTransform({
      x: (rect.width - contentWidth * scale) / 2 - layout.viewBox.x * scale,
      y: Math.max(50, (rect.height - layout.viewBox.height * scale) / 2),
      scale,
    });
  }, [layout.viewBox]);

  // Auto-fit on initial mount
  useEffect(() => {
    const timer = setTimeout(fitView, 100);
    return () => clearTimeout(timer);
  }, [fitView]);

  const toggleTable = useCallback((name: string) => {
    setHiddenTables(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const showAll = useCallback(() => setHiddenTables(new Set()), []);

  const hideAll = useCallback(
    () => setHiddenTables(new Set(topology.tables.map(t => t.name))),
    [topology.tables]
  );

  const transitionDuration = prefersReducedMotion ? 0 : 0.5;

  return (
    <div
      ref={containerRef}
      className="relative size-full er-canvas overflow-hidden touch-none select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      role="application"
      aria-label="Entity Relationship Diagram - drag to pan, scroll to zoom"
    >
      <svg
        className="size-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="er-arrowhead"
            markerWidth={8}
            markerHeight={8}
            refX={8}
            refY={4}
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="8 0, 8 8, 0 4"
              className="fill-er-line"
            />
          </marker>
          <filter id="er-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Relationship Lines */}
        <g className="er-relationships">
          <AnimatePresence>
            {topology.relationships.map(rel => {
              const path = layout.paths[rel.id];
              if (!path) return null;

              const isHidden =
                hiddenTables.has(rel.from.table) ||
                hiddenTables.has(rel.to.table);

              return (
                <motion.path
                  key={rel.id}
                  d={path}
                  variants={lineVariants}
                  initial="hidden"
                  animate={isHidden ? "dimmed" : "visible"}
                  exit="hidden"
                  transition={{
                    duration: transitionDuration,
                    ease: "easeOut",
                  }}
                  className="stroke-er-line"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  markerEnd="url(#er-arrowhead)"
                />
              );
            })}
          </AnimatePresence>
        </g>

        {/* Table Nodes */}
        <g className="er-tables">
          {topology.tables
            .filter(table => table.name in layout.positions)
            .map(table => {
              const pos = layout.positions[table.name];

              return (
                <ERTableNode
                  key={table.name}
                  table={table}
                  x={pos.x}
                  y={pos.y}
                  isHidden={hiddenTables.has(table.name)}
                  onToggleVisibility={() => toggleTable(table.name)}
                  onSelect={onTableSelect ? () => onTableSelect(table.name) : undefined}
                  reducedMotion={prefersReducedMotion ?? false}
                />
              );
            })}
        </g>
      </svg>

      {/* Keyboard instructions overlay - visible on focus */}
      <div className="sr-only" aria-live="polite">
        Use arrow keys to pan, plus/minus to zoom
      </div>

      <ERVisibilityPanel
        tables={topology.tables}
        hiddenTables={hiddenTables}
        onToggle={toggleTable}
        onShowAll={showAll}
        onHideAll={hideAll}
      />

      <ERControls
        scale={transform.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        onFitView={fitView}
      />
    </div>
  );
}
