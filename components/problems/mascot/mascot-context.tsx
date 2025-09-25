"use client"

import { createContext, useReducer, useRef, useState } from "react"
import { MascotState, MascotAction, ActiveFeature } from "./mascot-types"



// Reducer function with localStorage sync
function mascotReducer(state: MascotState, action: MascotAction): MascotState {
  switch (action.type) {

    case 'SET_ACTIVE_FEATURE': {
      const newState = {
        ...state,
        mascot: { ...state.mascot, activeFeature: action.feature }
      }
      setStoredValue("problems-mascot-active-feature", action.feature)
      return newState
    }

    case 'SET_IS_OPEN': {
      const newState = {
        ...state,
        mascot: { ...state.mascot, isOpen: action.value }
      }
      // Note: isOpen is not persisted to localStorage (session state only)
      return newState
    }

    case 'TOGGLE_OPEN': {
      const newState = {
        ...state,
        mascot: { ...state.mascot, isOpen: !state.mascot.isOpen }
      }
      // Note: isOpen is not persisted to localStorage (session state only)
      return newState
    }

    case 'SET_SEARCH_QUERY': {
      const newState = {
        ...state,
        problems: { ...state.problems, searchQuery: action.query }
      }
      setStoredValue("problems-search-query", action.query)
      return newState
    }

    case 'SET_DIFFICULTY_FILTER': {
      const newState = {
        ...state,
        problems: { ...state.problems, difficultyFilter: action.filter }
      }
      setStoredValue("problems-difficulty-filter", action.filter)
      return newState
    }

    case 'SET_TOPIC_FILTER': {
      const newState = {
        ...state,
        problems: { ...state.problems, topicFilter: action.filter }
      }
      setStoredValue("problems-topic-filter", action.filter)
      return newState
    }


    case 'SET_EXPANDED_PROBLEMS': {
      const newState = {
        ...state,
        problems: { ...state.problems, expandedProblems: action.problems }
      }
      setStoredValue("problems-expanded", action.problems)
      return newState
    }

    case 'TOGGLE_PROBLEM_EXPANSION': {
      const currentExpanded = state.problems.expandedProblems
      const isCurrentlyExpanded = currentExpanded.includes(action.slug)
      const newExpanded = isCurrentlyExpanded
        ? currentExpanded.filter(s => s !== action.slug)
        : [...currentExpanded, action.slug]

      const newState = {
        ...state,
        problems: { ...state.problems, expandedProblems: newExpanded }
      }
      setStoredValue("problems-expanded", newExpanded)
      return newState
    }

    case 'TOGGLE_ALL_PROBLEMS': {
      const currentExpanded = state.problems.expandedProblems
      const newExpanded = currentExpanded.length === 0 ? action.allSlugs : []

      const newState = {
        ...state,
        problems: { ...state.problems, expandedProblems: newExpanded }
      }
      setStoredValue("problems-expanded", newExpanded)
      return newState
    }

    case 'RESET_FILTERS': {
      const newState = {
        ...state,
        problems: {
          ...state.problems,
          searchQuery: "",
          difficultyFilter: "all",
          topicFilter: "all"
        }
      }
      setStoredValue("problems-search-query", "")
      setStoredValue("problems-difficulty-filter", "all")
      setStoredValue("problems-topic-filter", "all")
      return newState
    }

    default:
      return state
  }
}


// Split contexts for granular updates - React 19 pattern
const MascotStateContext = createContext<{
  activeFeature: ActiveFeature
  isOpen: boolean
}>({ activeFeature: "main", isOpen: false })

const MascotActionsContext = createContext<{
  setActiveFeature: (feature: ActiveFeature) => void
  setIsOpen: (value: boolean) => void
  toggleOpen: () => void
}>({
  setActiveFeature: () => {},
  setIsOpen: () => {},
  toggleOpen: () => {},
})

const ProblemsStateContext = createContext<{
  searchQuery: string
  difficultyFilter: string
  topicFilter: string
  expandedProblems: string[]
  hasActiveFilters: boolean
  activeFilterCount: number
}>({
  searchQuery: "",
  difficultyFilter: "all",
  topicFilter: "all",
  expandedProblems: [],
  hasActiveFilters: false,
  activeFilterCount: 0,
})

const ProblemsActionsContext = createContext<{
  setSearchQuery: (query: string) => void
  setDifficultyFilter: (filter: string) => void
  setTopicFilter: (filter: string) => void
  setExpandedProblems: (problems: string[]) => void
  toggleProblemExpansion: (slug: string) => void
  toggleAllProblems: (allSlugs: string[]) => void
  resetFilters: () => void
}>({
  setSearchQuery: () => {},
  setDifficultyFilter: () => {},
  setTopicFilter: () => {},
  setExpandedProblems: () => {},
  toggleProblemExpansion: () => {},
  toggleAllProblems: () => {},
  resetFilters: () => {},
})

const ScrollActionsContext = createContext<{
  getScrollPosition: () => number
  setScrollPosition: (position: number) => void
}>({
  getScrollPosition: () => 0,
  setScrollPosition: () => {},
})

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail
  }
}

// Provider component using React 19 Context without Provider pattern
export function MascotProvider({ children }: { children: React.ReactNode }) {
  // Always use defaults for initial state (server = client)
  const getInitialState = (): MascotState => ({
    mascot: {
      activeFeature: "main",
      isOpen: false,
    },
    problems: {
      searchQuery: "",
      difficultyFilter: "all",
      topicFilter: "all",
      expandedProblems: [],
    }
  })

  const [state, dispatch] = useReducer(mascotReducer, getInitialState())
  const [hasHydrated, setHasHydrated] = useState(false)

  // Sync localStorage values after hydration (client-only)
  if (typeof window !== 'undefined' && !hasHydrated) {
    setHasHydrated(true)

    const storedActiveFeature = getStoredValue("problems-mascot-active-feature", "main")
    if (storedActiveFeature !== "main") {
      dispatch({ type: 'SET_ACTIVE_FEATURE', feature: storedActiveFeature })
    }

    const storedSearchQuery = getStoredValue("problems-search-query", "")
    if (storedSearchQuery) {
      dispatch({ type: 'SET_SEARCH_QUERY', query: storedSearchQuery })
    }

    const storedDifficultyFilter = getStoredValue("problems-difficulty-filter", "all")
    if (storedDifficultyFilter !== "all") {
      dispatch({ type: 'SET_DIFFICULTY_FILTER', filter: storedDifficultyFilter })
    }

    const storedTopicFilter = getStoredValue("problems-topic-filter", "all")
    if (storedTopicFilter !== "all") {
      dispatch({ type: 'SET_TOPIC_FILTER', filter: storedTopicFilter })
    }

    const storedExpandedProblems = getStoredValue("problems-expanded", [])
    if (storedExpandedProblems.length > 0) {
      dispatch({ type: 'SET_EXPANDED_PROBLEMS', problems: storedExpandedProblems })
    }
  }

  // Imperative scroll position management (no reactive state)
  const scrollPositionRef = useRef(getStoredValue("problems-scroll-position", 0))

  const scrollActions = {
    getScrollPosition: () => scrollPositionRef.current,
    setScrollPosition: (position: number) => {
      scrollPositionRef.current = position
      setStoredValue("problems-scroll-position", position)
    }
  }



  return (
    <MascotStateContext value={{
      activeFeature: state.mascot.activeFeature,
      isOpen: state.mascot.isOpen
    }}>
      <MascotActionsContext value={{
        setActiveFeature: (feature: ActiveFeature) => dispatch({ type: 'SET_ACTIVE_FEATURE', feature }),
        setIsOpen: (value: boolean) => dispatch({ type: 'SET_IS_OPEN', value }),
        toggleOpen: () => dispatch({ type: 'TOGGLE_OPEN' }),
      }}>
        <ProblemsStateContext value={{
          searchQuery: state.problems.searchQuery,
          difficultyFilter: state.problems.difficultyFilter,
          topicFilter: state.problems.topicFilter,
          expandedProblems: state.problems.expandedProblems,
          hasActiveFilters: Boolean(state.problems.searchQuery) || state.problems.difficultyFilter !== 'all' || state.problems.topicFilter !== 'all',
          activeFilterCount: [
            Boolean(state.problems.searchQuery),
            state.problems.difficultyFilter !== 'all',
            state.problems.topicFilter !== 'all'
          ].filter(Boolean).length,
        }}>
          <ProblemsActionsContext value={{
            setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', query }),
            setDifficultyFilter: (filter: string) => dispatch({ type: 'SET_DIFFICULTY_FILTER', filter }),
            setTopicFilter: (filter: string) => dispatch({ type: 'SET_TOPIC_FILTER', filter }),
            setExpandedProblems: (problems: string[]) => dispatch({ type: 'SET_EXPANDED_PROBLEMS', problems }),
            toggleProblemExpansion: (slug: string) => dispatch({ type: 'TOGGLE_PROBLEM_EXPANSION', slug }),
            toggleAllProblems: (allSlugs: string[]) => dispatch({ type: 'TOGGLE_ALL_PROBLEMS', allSlugs }),
            resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
          }}>
            <ScrollActionsContext value={scrollActions}>
              {children}
            </ScrollActionsContext>
          </ProblemsActionsContext>
        </ProblemsStateContext>
      </MascotActionsContext>
    </MascotStateContext>
  )
}

// Export contexts for use() hook
export {
  MascotStateContext,
  MascotActionsContext,
  ProblemsStateContext,
  ProblemsActionsContext,
  ScrollActionsContext
}