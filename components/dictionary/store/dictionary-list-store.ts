"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/** Filter state stored per language */
type LanguageFilterState = {
  query: string
  tagSlugs: string[]
  sourceSlugs: string[]
  sourcePartSlugs: string[]
}

type DictionaryListState = {
  /** Whether definitions are expanded */
  isExpanded: boolean
  /** Per-language filter memory */
  languageFilters: Record<string, LanguageFilterState>
}

type DictionaryListActions = {
  toggleExpanded: () => void
  /** Save filter state for a specific language */
  saveLanguageFilters: (language: string, filters: LanguageFilterState) => void
  /** Get filter state for a specific language */
  getLanguageFilters: (language: string) => LanguageFilterState | null
}

const INITIAL_STATE: DictionaryListState = {
  isExpanded: false,
  languageFilters: {},
}

/**
 * Dictionary list store - simplified for URL-based pagination.
 * Browser handles scroll restoration automatically.
 */
const useDictionaryListStoreBase = create<DictionaryListState & DictionaryListActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

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
        isExpanded: state.isExpanded,
        languageFilters: state.languageFilters,
      }),
    }
  )
)

/**
 * Get store actions without subscribing to state changes.
 */
export function getDictionaryListActions() {
  const state = useDictionaryListStoreBase.getState()
  return {
    toggleExpanded: state.toggleExpanded,
    saveLanguageFilters: state.saveLanguageFilters,
    getLanguageFilters: state.getLanguageFilters,
  }
}

/**
 * Subscribe to isExpanded state for components that need reactivity.
 */
export function useIsExpanded(): boolean {
  return useDictionaryListStoreBase((state) => state.isExpanded)
}
