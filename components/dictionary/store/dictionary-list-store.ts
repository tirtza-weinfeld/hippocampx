"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  EntryWithPreview,
  InfiniteScrollCursor,
} from '@/lib/db/neon/queries/dictionary/index'

/** Filter state stored per language */
type LanguageFilterState = {
  query: string
  tagSlugs: string[]
  sourceSlugs: string[]
  sourcePartSlugs: string[]
}

type DictionaryListState = {
  // Persisted state
  entries: EntryWithPreview[]
  cursor: InfiniteScrollCursor | null
  hasNextPage: boolean
  scrollY: number
  filterKey: string
  /** Tracks where user navigated from - null if direct entry */
  originPath: string | null
  /** Whether definitions are expanded */
  isExpanded: boolean
  /** Per-language filter memory */
  languageFilters: Record<string, LanguageFilterState>
}

type DictionaryListActions = {
  saveListState: (state: {
    entries: EntryWithPreview[]
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
    entries: EntryWithPreview[]
    cursor: InfiniteScrollCursor | null
    hasNextPage: boolean
    scrollY: number
  } | null
  /** Save filter state for a specific language */
  saveLanguageFilters: (language: string, filters: LanguageFilterState) => void
  /** Get filter state for a specific language */
  getLanguageFilters: (language: string) => LanguageFilterState | null
}

const INITIAL_STATE: DictionaryListState = {
  entries: [],
  cursor: null,
  hasNextPage: false,
  scrollY: 0,
  filterKey: '',
  originPath: null,
  isExpanded: false,
  languageFilters: {},
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
        entries: state.entries,
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
          state.entries.length > 0

        if (shouldRestore) {
          // Clear origin path to prevent double-restoration
          set({ originPath: null })
          return {
            entries: state.entries,
            cursor: state.cursor,
            hasNextPage: state.hasNextPage,
            scrollY: state.scrollY,
          }
        }
        return null
      },

      saveLanguageFilters: (language, filters) => set((state) => ({
        languageFilters: {
          ...state.languageFilters,
          [language]: filters,
        },
      })),

      getLanguageFilters: (language) => {
        const state = get()
        return state.languageFilters[language] ?? null
      },
    }),
    {
      name: 'dictionary-list-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        entries: state.entries,
        cursor: state.cursor,
        hasNextPage: state.hasNextPage,
        scrollY: state.scrollY,
        filterKey: state.filterKey,
        originPath: state.originPath,
        languageFilters: state.languageFilters,
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
    saveLanguageFilters: state.saveLanguageFilters,
    getLanguageFilters: state.getLanguageFilters,
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
  return useDictionaryListStoreBase((state) => state.isExpanded)
}
