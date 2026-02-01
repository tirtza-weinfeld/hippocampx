"use client"

import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'

// Debounced storage to prevent blocking UI on every keystroke
function createDebouncedStorage(storage: StateStorage, delay: number = 300): StateStorage {
  let timeoutId: NodeJS.Timeout | null = null
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

export type FilterState = {
  search: string
  difficulty: "all" | "easy" | "medium" | "hard"
  topic: string
  sort: "number" | "difficulty" | "alpha" | "date-created" | "date-updated"
  order: "asc" | "desc"
}

export type Position = { x: number; y: number }
export type Size = { width: number; height: number }

type AgentDialogState = {
  // State
  filters: FilterState
  expandedIds: string[]
  scrollPosition: number
  position: Position
  size: Size
  isMaximized: boolean
  easyDismiss: boolean

  // Actions
  setFilters: (filters: FilterState) => void
  setExpandedIds: (ids: string[]) => void
  toggleExpanded: (id: string) => void
  expandAll: (ids: string[]) => void
  collapseAll: () => void
  setScrollPosition: (position: number) => void
  setPosition: (position: Position) => void
  setSize: (size: Size) => void
  setSizeAndPosition: (size: Size, position: Position) => void
  setIsMaximized: (isMaximized: boolean) => void
  toggleMaximized: () => void
  setEasyDismiss: (easyDismiss: boolean) => void
  toggleEasyDismiss: () => void
  isExpanded: (id: string) => boolean
  getInitialPosition: () => Position
  getInitialSize: () => Size
}

function getInitialPosition(): Position {
  if (typeof window === 'undefined') return { x: 0, y: 80 }

  const isMobile = window.innerWidth < 768
  if (isMobile) {
    return { x: 16, y: 80 }
  }
  return { x: window.innerWidth - 650, y: 80 }
}

function getInitialSize(): Size {
  if (typeof window === 'undefined') return { width: 600, height: 700 }

  const isMobile = window.innerWidth < 768
  if (isMobile) {
    return {
      width: Math.min(window.innerWidth - 32, 600),
      height: Math.min(window.innerHeight - 160, 700)
    }
  }
  return { width: 600, height: 700 }
}

export const useAgentDialogStore = create<AgentDialogState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: {
        search: "",
        difficulty: "all",
        topic: "all",
        sort: "date-updated",
        order: "asc",
      },
      expandedIds: [],
      scrollPosition: 0,
      position: getInitialPosition(),
      size: getInitialSize(),
      isMaximized: false,
      easyDismiss: false,

      // Actions
      setFilters: (filters) => set({ filters }),

      setExpandedIds: (ids) => set({ expandedIds: ids }),

      toggleExpanded: (id) => set((state) => {
        const current = state.expandedIds
        if (current.includes(id)) {
          return { expandedIds: current.filter(i => i !== id) }
        } else {
          return { expandedIds: [...current, id] }
        }
      }),

      expandAll: (ids) => set({ expandedIds: ids }),

      collapseAll: () => set({ expandedIds: [] }),

      setScrollPosition: (position) => set({ scrollPosition: position }),

      setPosition: (position) => set({ position }),

      setSize: (size) => set({ size }),

      setSizeAndPosition: (size, position) => set({ size, position }),

      setIsMaximized: (isMaximized) => set({ isMaximized }),

      toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),

      setEasyDismiss: (easyDismiss) => set({ easyDismiss }),

      toggleEasyDismiss: () => set((state) => ({ easyDismiss: !state.easyDismiss })),

      isExpanded: (id) => get().expandedIds.includes(id),

      getInitialPosition,

      getInitialSize,
    }),
    {
      name: 'agent-dialog-storage',
      storage: createJSONStorage(() => createDebouncedStorage(sessionStorage, 300)),
      // Persist filters, scroll, position, size, maximized state, and easyDismiss
      // NOT expandedIds (performance)
      partialize: (state) => ({
        filters: state.filters,
        scrollPosition: state.scrollPosition,
        position: state.position,
        size: state.size,
        isMaximized: state.isMaximized,
        easyDismiss: state.easyDismiss,
      }),
      // Skip persistence on server
      skipHydration: true,
    }
  )
)
