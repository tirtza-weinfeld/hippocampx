"use client";

import { useEffect, useEffectEvent, useRef, useCallback } from "react";
import { useERDiagramStore } from "@/lib/db-viewer/er-store";
import { findTableAtPoint } from "@/lib/db-viewer/er-utils";
import { CANVAS_ZOOM, clampCanvasScale } from "@/lib/db-viewer/er-constants";
import type { TablePosition, Transform } from "@/lib/db-viewer/types";

interface PinchState {
  initialDistance: number;
  initialScale: number;
  centerX: number;
  centerY: number;
}

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
  transform: Transform,
  fitView: () => void
) {
  useEffect(() => {
    if (!hasHydrated) return;
    if (transform.x === 0 && transform.y === 0 && transform.scale === 1) {
      const timer = setTimeout(fitView, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);
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

export function usePinchZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
  setTransform: (t: Transform) => void
) {
  const pinchRef = useRef<PinchState | null>(null);
  const activeTouchesRef = useRef<Map<number, PointerEvent>>(new Map());

  const handlePinchZoom = useCallback((newScale: number, centerX: number, centerY: number) => {
    const t = useERDiagramStore.getState().transform;
    const clampedScale = clampCanvasScale(newScale);
    // Zoom toward pinch center
    const scaleRatio = clampedScale / t.scale;
    const newX = centerX - (centerX - t.x) * scaleRatio;
    const newY = centerY - (centerY - t.y) * scaleRatio;
    setTransform({ x: newX, y: newY, scale: clampedScale });
  }, [setTransform]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function isTableElement(target: Element): boolean {
      let cur: Element | null = target;
      while (cur && cur !== container) {
        if (cur.hasAttribute("data-table-name")) return true;
        cur = cur.parentElement;
      }
      return false;
    }

    function handlePointerDown(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      // Skip if targeting a table (tables handle their own pinch)
      if (isTableElement(e.target as Element)) return;

      activeTouchesRef.current.set(e.pointerId, e);

      if (activeTouchesRef.current.size === 2) {
        const touches = Array.from(activeTouchesRef.current.values());
        const dx = touches[1].clientX - touches[0].clientX;
        const dy = touches[1].clientY - touches[0].clientY;
        const distance = Math.hypot(dx, dy);
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        const t = useERDiagramStore.getState().transform;
        pinchRef.current = { initialDistance: distance, initialScale: t.scale, centerX, centerY };
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      if (!activeTouchesRef.current.has(e.pointerId)) return;

      activeTouchesRef.current.set(e.pointerId, e);

      if (pinchRef.current && activeTouchesRef.current.size === 2) {
        const touches = Array.from(activeTouchesRef.current.values());
        const dx = touches[1].clientX - touches[0].clientX;
        const dy = touches[1].clientY - touches[0].clientY;
        const distance = Math.hypot(dx, dy);
        const scale = distance / pinchRef.current.initialDistance;
        const newScale = pinchRef.current.initialScale * scale;
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        handlePinchZoom(newScale, centerX, centerY);
      }
    }

    function handlePointerUp(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      activeTouchesRef.current.delete(e.pointerId);
      if (activeTouchesRef.current.size < 2) {
        pinchRef.current = null;
      }
    }

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [containerRef, handlePinchZoom]);
}
