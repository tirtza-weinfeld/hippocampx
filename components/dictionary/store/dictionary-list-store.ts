"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  WordWithPreview,
  InfiniteScrollCursor,
} from '@/lib/db/neon/queries/dictionary/index'

type DictionaryListState = {
  // Persisted state
  words: WordWithPreview[]
  cursor: InfiniteScrollCursor | null
  hasNextPage: boolean
  scrollY: number
  filterKey: string
  /** Tracks where user navigated from - null if direct entry */
  originPath: string | null
  /** Whether word definitions are expanded */
  isExpanded: boolean
}

type DictionaryListActions = {
  saveListState: (state: {
    words: WordWithPreview[]
    cursor: InfiniteScrollCursor | null
    hasNextPage: boolean
    scrollY: number
    filterKey: string
  }) => void
  clearListState: () => void
  setOriginPath: (path: string | null) => void
  toggleExpanded: () => void
  /**
   * Check if state should be restored and consume it.
   * Returns the state to restore or null if no restoration needed.
   * This is atomic - calling it clears the originPath to prevent double-restoration.
   */
  consumeRestorationState: (currentFilterKey: string) => {
    words: WordWithPreview[]
    cursor: InfiniteScrollCursor | null
    hasNextPage: boolean
    scrollY: number
  } | null
}

const INITIAL_STATE: DictionaryListState = {
  words: [],
  cursor: null,
  hasNextPage: false,
  scrollY: 0,
  filterKey: '',
  originPath: null,
  isExpanded: false,
}

/**
 * Dictionary list store - only used for scroll restoration on back navigation.
 *
 * IMPORTANT: Components should NOT subscribe to this store for rendering.
 * Use getState() directly in event handlers and initializers to avoid re-renders.
 */
const useDictionaryListStoreBase = create<DictionaryListState & DictionaryListActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      saveListState: (state) => set({
        words: state.words,
        cursor: state.cursor,
        hasNextPage: state.hasNextPage,
        scrollY: state.scrollY,
        filterKey: state.filterKey,
        originPath: '/dictionary',
      }),

      clearListState: () => set(INITIAL_STATE),

      setOriginPath: (path) => set({ originPath: path }),

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

      consumeRestorationState: (currentFilterKey) => {
        const state = get()
        const shouldRestore =
          state.originPath === '/dictionary' &&
          state.filterKey === currentFilterKey &&
          state.words.length > 0

        if (shouldRestore) {
          // Clear origin path to prevent double-restoration
          set({ originPath: null })
          return {
            words: state.words,
            cursor: state.cursor,
            hasNextPage: state.hasNextPage,
            scrollY: state.scrollY,
          }
        }
        return null
      },
    }),
    {
      name: 'dictionary-list-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        words: state.words,
        cursor: state.cursor,
        hasNextPage: state.hasNextPage,
        scrollY: state.scrollY,
        filterKey: state.filterKey,
        originPath: state.originPath,
      }),
    }
  )
)

/**
 * Get store actions without subscribing to state changes.
 * Use this in event handlers to avoid unnecessary re-renders.
 */
export function getDictionaryListActions() {
  const state = useDictionaryListStoreBase.getState()
  return {
    saveListState: state.saveListState,
    clearListState: state.clearListState,
    setOriginPath: state.setOriginPath,
    toggleExpanded: state.toggleExpanded,
    consumeRestorationState: state.consumeRestorationState,
  }
}

/**
 * Get current state snapshot without subscribing.
 * Use this in initializers and one-time reads.
 */
export function getDictionaryListState() {
  return useDictionaryListStoreBase.getState()
}

/**
 * Subscribe to isExpanded state for components that need reactivity.
 */
export function useIsExpanded(): boolean {
  return useDictionaryListStoreBase((state) => state.isExpanded) ?? false
}
