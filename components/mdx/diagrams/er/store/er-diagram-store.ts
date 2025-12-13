"use client"

import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { TablePositions, TableScales, CanvasTransform } from '../types'

// ============================================================================
// DEBOUNCED STORAGE
// ============================================================================

/**
 * Debounced storage to prevent blocking UI on every drag/zoom.
 * Pattern from agent-dialog-store.ts
 */
function createDebouncedStorage(storage: Storage, delay: number = 300): StateStorage {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const pendingWrites = new Map<string, string>()

  return {
    getItem: (name) => {
      // If there's a pending write for this key, return it immediately
      const pending = pendingWrites.get(name)
      if (pending !== undefined) {
        return pending
      }
      return storage.getItem(name)
    },
    setItem: (name, value) => {
      // Store in memory immediately so reads are consistent
      pendingWrites.set(name, value)

      // Debounce the actual storage write
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        storage.setItem(name, value)
        pendingWrites.delete(name)
      }, delay)
    },
    removeItem: (name) => {
      pendingWrites.delete(name)
      if (timeoutId) clearTimeout(timeoutId)
      storage.removeItem(name)
    },
  }
}

// ============================================================================
// TYPES
// ============================================================================

/** Default canvas transform (no zoom/pan) */
export const DEFAULT_CANVAS_TRANSFORM: CanvasTransform = { x: 0, y: 0, scale: 1 }

export type TableZIndexes = Record<string, number>
export type VerboseTables = string[]

export interface DiagramLayoutState {
  positions: TablePositions
  scales: TableScales
  isFullscreen: boolean
  canvasTransform: CanvasTransform
  zIndexes: TableZIndexes
  zCounter: number
  verboseTables: VerboseTables
}

interface ERDiagramStoreState {
  // State: diagram layouts keyed by diagram ID
  layouts: Partial<Record<string, DiagramLayoutState>>

  // Actions
  setPositions: (diagramId: string, positions: TablePositions) => void
  setScales: (diagramId: string, scales: TableScales) => void
  setFullscreen: (diagramId: string, isFullscreen: boolean) => void
  setCanvasTransform: (diagramId: string, canvasTransform: CanvasTransform) => void
  setZIndexes: (diagramId: string, zIndexes: TableZIndexes, zCounter: number) => void
  setVerboseTables: (diagramId: string, verboseTables: VerboseTables) => void
  setLayout: (diagramId: string, layout: Partial<DiagramLayoutState>) => void
  resetLayout: (diagramId: string) => void
  getLayout: (diagramId: string) => DiagramLayoutState | undefined
}

// ============================================================================
// STORE
// ============================================================================

const DEFAULT_LAYOUT: DiagramLayoutState = {
  positions: {},
  scales: {},
  isFullscreen: false,
  canvasTransform: DEFAULT_CANVAS_TRANSFORM,
  zIndexes: {},
  zCounter: 1,
  verboseTables: [],
}

export const useERDiagramStore = create<ERDiagramStoreState>()(
  persist(
    (set, get) => ({
      layouts: {},

      setPositions: (diagramId, positions) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, positions },
            },
          }
        }),

      setScales: (diagramId, scales) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, scales },
            },
          }
        }),

      setFullscreen: (diagramId, isFullscreen) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, isFullscreen },
            },
          }
        }),

      setCanvasTransform: (diagramId, canvasTransform) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, canvasTransform },
            },
          }
        }),

      setZIndexes: (diagramId, zIndexes, zCounter) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, zIndexes, zCounter },
            },
          }
        }),

      setVerboseTables: (diagramId, verboseTables) =>
        set((state) => {
          const existing = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: { ...existing, verboseTables },
            },
          }
        }),

      setLayout: (diagramId, layout) =>
        set((state) => {
          const current = state.layouts[diagramId] ?? DEFAULT_LAYOUT
          return {
            layouts: {
              ...state.layouts,
              [diagramId]: {
                positions: layout.positions ?? current.positions,
                scales: layout.scales ?? current.scales,
                isFullscreen: layout.isFullscreen ?? current.isFullscreen,
                canvasTransform: layout.canvasTransform ?? current.canvasTransform,
                zIndexes: layout.zIndexes ?? current.zIndexes,
                zCounter: layout.zCounter ?? current.zCounter,
                verboseTables: layout.verboseTables ?? current.verboseTables,
              },
            },
          }
        }),

      resetLayout: (diagramId) =>
        set((state) => {
          const { [diagramId]: _removed, ...rest } = state.layouts
          void _removed // Explicitly mark as intentionally unused
          return { layouts: rest }
        }),

      getLayout: (diagramId) => get().layouts[diagramId],
    }),
    {
      name: 'hippocampx-er-layouts',
      storage: createJSONStorage(() => {
        // Guard against SSR - return no-op storage
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
            length: 0,
            clear: () => undefined,
            key: () => null,
          }
        }
        return createDebouncedStorage(localStorage, 300) as unknown as Storage
      }),
      // Only persist the layouts, not the actions
      partialize: (state) => ({ layouts: state.layouts }),
      // Skip automatic hydration - we'll trigger it manually after mount
      skipHydration: true,
    }
  )
)
