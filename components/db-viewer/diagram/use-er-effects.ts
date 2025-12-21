"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useERDiagramStore } from "@/lib/db-viewer/er-store";
import { findTableAtPoint } from "@/lib/db-viewer/er-utils";
import { CANVAS_ZOOM, clampCanvasScale } from "@/lib/db-viewer/er-constants";
import type { TablePosition, Transform } from "@/lib/db-viewer/types";

interface ContainerSize {
  width: number;
  height: number;
}

export function useContainerResize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setContainerSize: (size: ContainerSize) => void
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, setContainerSize]);
}

export function useInitPositions(
  hasHydrated: boolean,
  hasStoredPositions: boolean,
  initialPositions: Record<string, TablePosition>,
  setPositions: (positions: Record<string, TablePosition>) => void
) {
  useEffect(() => {
    if (hasHydrated && !hasStoredPositions) setPositions(initialPositions);
  }, [hasHydrated, hasStoredPositions, initialPositions, setPositions]);
}

export function useAutoFit(
  hasHydrated: boolean,
  hasPositions: boolean,
  transform: Transform,
  fitView: () => void
) {
  useEffect(() => {
    if (!hasHydrated || !hasPositions) return;
    if (transform.x === 0 && transform.y === 0 && transform.scale === 1) {
      const timer = setTimeout(fitView, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, hasPositions]);
}

export function useZoomTargetReset() {
  const zoomTargetRef = useRef<string | null>(null);

  useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Control" || e.key === "Meta") zoomTargetRef.current = null;
    }
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  return zoomTargetRef;
}

export function useWheelZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  zoomTargetRef: React.RefObject<string | null>,
  setTransform: (t: Transform) => void,
  onTableZoom: (tableName: string, delta: number) => void
) {
  const handleZoom = useEffectEvent((tableName: string, delta: number) => {
    onTableZoom(tableName, delta);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleWheel(e: WheelEvent) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -1 : 1;
      if (zoomTargetRef.current === null) {
        zoomTargetRef.current = findTableAtPoint(e.clientX, e.clientY) ?? "canvas";
      }
      if (zoomTargetRef.current === "canvas") {
        const t = useERDiagramStore.getState().transform;
        setTransform({ ...t, scale: clampCanvasScale(t.scale * (delta > 0 ? CANVAS_ZOOM.step : 1 / CANVAS_ZOOM.step)) });
      } else {
        handleZoom(zoomTargetRef.current, delta);
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [containerRef, zoomTargetRef, setTransform]);
}

export function usePointerHover(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setHoveredTable: (name: string | null) => void
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleMove(e: PointerEvent) {
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      let found: string | null = null;
      for (const el of elements) {
        let cur: Element | null = el;
        while (cur && cur !== container) {
          const name = cur.getAttribute("data-table-name");
          if (name) { found = name; break; }
          cur = cur.parentElement;
        }
        if (found) break;
      }
      setHoveredTable(found);
    }

    function handleLeave() { setHoveredTable(null); }

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);
    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, [containerRef, setHoveredTable]);
}

/**
 * Canvas pinch-to-zoom disabled on mobile to prevent accidental zoom during pan.
 * Zoom is available via command surface controls.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function usePinchZoom(_containerRef: React.RefObject<HTMLDivElement | null>, _setTransform: (t: Transform) => void) {
  // No-op: pinch zoom disabled on mobile for better UX
}
