"use client"

import { useEffect, useSyncExternalStore } from 'react'
import { useERDiagramStore } from './er-diagram-store'
import type { TablePositions, TableScales, CanvasTransform } from '../types'
import { DEFAULT_CANVAS_TRANSFORM, type TableZIndexes, type VerboseTables } from './er-diagram-store'

interface ERPersistenceResult {
  /** Persisted table positions (empty until hydrated) */
  positions: TablePositions
  /** Persisted table scales (empty until hydrated) */
  scales: TableScales
  /** Persisted fullscreen state (false until hydrated) */
  isFullscreen: boolean
  /** Persisted canvas transform (default until hydrated) */
  canvasTransform: CanvasTransform
  /** Persisted z-indexes for table stacking order */
  zIndexes: TableZIndexes
  /** Current z-index counter */
  zCounter: number
  /** Persisted list of tables with verbose mode enabled */
  verboseTables: VerboseTables
  /** Update persisted positions */
  setPositions: (positions: TablePositions) => void
  /** Update persisted scales */
  setScales: (scales: TableScales) => void
  /** Update persisted fullscreen state */
  setFullscreen: (isFullscreen: boolean) => void
  /** Update persisted canvas transform */
  setCanvasTransform: (canvasTransform: CanvasTransform) => void
  /** Update persisted z-indexes and counter */
  setZIndexes: (zIndexes: TableZIndexes, zCounter: number) => void
  /** Update persisted verbose tables list */
  setVerboseTables: (verboseTables: VerboseTables) => void
  /** Reset layout to defaults (clears persisted state) */
  resetLayout: () => void
  /** Whether hydration from localStorage is complete */
  isReady: boolean
}

// Subscribe to hydration state changes
function subscribeToHydration(callback: () => void) {
  return useERDiagramStore.persist.onFinishHydration(callback)
}

// Get current hydration state
function getHydrationSnapshot() {
  return useERDiagramStore.persist.hasHydrated()
}

// Server snapshot always returns false
function getServerSnapshot() {
  return false
}

/**
 * Hook to manage ER diagram layout persistence.
 *
 * Handles SSR-safe hydration and provides typed accessors for
 * persisted positions and scales.
 *
 * @param diagramId - Unique identifier for the diagram
 * @returns Persistence state and actions bound to this diagram
 */
export function useERPersistence(diagramId: string): ERPersistenceResult {
  // Use useSyncExternalStore for hydration state to avoid setState in effects
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerSnapshot
  )

  // Trigger hydration from localStorage on mount
  useEffect(() => {
    void useERDiagramStore.persist.rehydrate()
  }, [])

  // Get layout from store - Zustand selector with diagramId
  const layout = useERDiagramStore((state) => state.layouts[diagramId])

  // Get actions from store
  const storeSetPositions = useERDiagramStore((state) => state.setPositions)
  const storeSetScales = useERDiagramStore((state) => state.setScales)
  const storeSetFullscreen = useERDiagramStore((state) => state.setFullscreen)
  const storeSetCanvasTransform = useERDiagramStore((state) => state.setCanvasTransform)
  const storeSetZIndexes = useERDiagramStore((state) => state.setZIndexes)
  const storeSetVerboseTables = useERDiagramStore((state) => state.setVerboseTables)
  const storeResetLayout = useERDiagramStore((state) => state.resetLayout)

  // Bind actions to this diagram ID - compiler handles stabilization
  function setPositions(positions: TablePositions) {
    storeSetPositions(diagramId, positions)
  }

  function setScales(scales: TableScales) {
    storeSetScales(diagramId, scales)
  }

  function setFullscreen(isFullscreen: boolean) {
    storeSetFullscreen(diagramId, isFullscreen)
  }

  function setCanvasTransform(canvasTransform: CanvasTransform) {
    storeSetCanvasTransform(diagramId, canvasTransform)
  }

  function setZIndexes(zIndexes: TableZIndexes, zCounter: number) {
    storeSetZIndexes(diagramId, zIndexes, zCounter)
  }

  function setVerboseTables(verboseTables: VerboseTables) {
    storeSetVerboseTables(diagramId, verboseTables)
  }

  function resetLayout() {
    storeResetLayout(diagramId)
  }

  // Return empty values until hydrated to prevent SSR mismatch
  return {
    positions: isReady ? (layout?.positions ?? {}) : {},
    scales: isReady ? (layout?.scales ?? {}) : {},
    isFullscreen: isReady ? (layout?.isFullscreen ?? false) : false,
    canvasTransform: isReady ? (layout?.canvasTransform ?? DEFAULT_CANVAS_TRANSFORM) : DEFAULT_CANVAS_TRANSFORM,
    zIndexes: isReady ? (layout?.zIndexes ?? {}) : {},
    zCounter: isReady ? (layout?.zCounter ?? 1) : 1,
    verboseTables: isReady ? (layout?.verboseTables ?? []) : [],
    setPositions,
    setScales,
    setFullscreen,
    setCanvasTransform,
    setZIndexes,
    setVerboseTables,
    resetLayout,
    isReady,
  }
}
