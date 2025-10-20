"use client"

import { createContext, useReducer, use, useDeferredValue, useMemo } from "react"
import cardsMetadataJson from "@/lib/extracted-metadata/cards-metadata.json"

/**
 * INSTANT FILTERING WITH BUILD-TIME METADATA
 *
 * Architecture:
 * - Metadata generated at build time (cards-metadata.json)
 * - Static import for instant availability
 * - No DOM scanning, no useEffect delays
 * - Fast filtering on indexed fields only (id, title)
 * - React Compiler optimizes everything
 *
 * Benefits:
 * - Cards render instantly
 * - Filters work immediately (no wait for metadata)
 * - No runtime metadata extraction
 * - Predictable performance
 */

interface CardMetadata {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  topics: string[]
  createdAt: string
  updatedAt: string
}

type FilterState = {
  search: string
  difficulty: "all" | "easy" | "medium" | "hard"
  topic: string
  sort: "number" | "difficulty" | "alpha" | "date-created" | "date-updated"
  order: "asc" | "desc"
}

type FilterAction =
  | { type: "SEARCH"; value: string }
  | { type: "DIFFICULTY"; value: FilterState["difficulty"] }
  | { type: "TOPIC"; value: string }
  | { type: "SORT"; value: FilterState["sort"] }
  | { type: "ORDER"; value: FilterState["order"] }
  | { type: "RESET" }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SEARCH":
      return { ...state, search: action.value }
    case "DIFFICULTY":
      return { ...state, difficulty: action.value }
    case "TOPIC":
      return { ...state, topic: action.value }
    case "SORT":
      return { ...state, sort: action.value }
    case "ORDER":
      return { ...state, order: action.value }
    case "RESET":
      return { ...state, search: "", difficulty: "all", topic: "all" }
    default:
      return state
  }
}

const FilterStateContext = createContext<FilterState>({
  search: "",
  difficulty: "all",
  topic: "all",
  sort: "number",
  order: "asc",
})

const FilterActionsContext = createContext<{
  setSearch: (value: string) => void
  setDifficulty: (value: FilterState["difficulty"]) => void
  setTopic: (value: string) => void
  setSort: (value: FilterState["sort"]) => void
  setOrder: (value: FilterState["order"]) => void
  reset: () => void
}>({
  setSearch: () => {},
  setDifficulty: () => {},
  setTopic: () => {},
  setSort: () => {},
  setOrder: () => {},
  reset: () => {},
})

const FilterMetadataContext = createContext<{
  allTopics: string[]
  totalCards: number
  stats: { easy: number; medium: number; hard: number }
  cardsMetadata: CardMetadata[]
}>({
  allTopics: [],
  totalCards: 0,
  stats: { easy: 0, medium: 0, hard: 0 },
  cardsMetadata: [],
})

/**
 * Compute metadata from imported JSON (runs once, synchronously).
 */
function computeMetadata(cards: CardMetadata[]) {
  const topicsSet = new Set<string>()
  let easy = 0
  let medium = 0
  let hard = 0

  cards.forEach((card) => {
    card.topics.forEach((topic) => topicsSet.add(topic))

    if (card.difficulty === "easy") easy++
    else if (card.difficulty === "medium") medium++
    else if (card.difficulty === "hard") hard++
  })

  return {
    allTopics: Array.from(topicsSet).sort(),
    totalCards: cards.length,
    stats: { easy, medium, hard },
    cardsMetadata: cards,
  }
}

// Compute metadata once at module load time
const staticMetadata = computeMetadata(cardsMetadataJson as CardMetadata[])

/**
 * Provider component.
 */
export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filterState, dispatch] = useReducer(filterReducer, {
    search: "",
    difficulty: "all",
    topic: "all",
    sort: "number",
    order: "asc",
  })

  return (
    <FilterMetadataContext value={staticMetadata}>
      <FilterStateContext value={filterState}>
        <FilterActionsContext value={{
          setSearch: (value) => dispatch({ type: "SEARCH", value }),
          setDifficulty: (value) => dispatch({ type: "DIFFICULTY", value }),
          setTopic: (value) => dispatch({ type: "TOPIC", value }),
          setSort: (value) => dispatch({ type: "SORT", value }),
          setOrder: (value) => dispatch({ type: "ORDER", value }),
          reset: () => dispatch({ type: "RESET" }),
        }}>
          {children}
        </FilterActionsContext>
      </FilterStateContext>
    </FilterMetadataContext>
  )
}

export function useFilterState() {
  return use(FilterStateContext)
}

export function useFilterActions() {
  return use(FilterActionsContext)
}

export function useFilterMetadata() {
  return use(FilterMetadataContext)
}

/**
 * Hook to determine if a card should be visible based on current filters.
 * Fast filtering using only indexed fields: id and title.
 */
export function useCardVisibility(id: string, difficulty: string, topics: string, title: string): "visible" | "hidden" {
  const filters = use(FilterStateContext)
  const deferredSearch = useDeferredValue(filters.search)

  return useMemo(() => {
    // Difficulty filter
    if (filters.difficulty !== "all" && difficulty !== filters.difficulty) {
      return "hidden"
    }

    // Topic filter
    if (filters.topic !== "all") {
      const cardTopics = topics.split(",").map((t) => t.trim())
      if (!cardTopics.includes(filters.topic)) {
        return "hidden"
      }
    }

    // Search filter (deferred for smooth typing)
    // FAST: Only search id and title (not topics, not code)
    if (deferredSearch) {
      const searchLower = deferredSearch.toLowerCase()
      const matchesId = id.toLowerCase().includes(searchLower)
      const matchesTitle = title.toLowerCase().includes(searchLower)

      if (!matchesId && !matchesTitle) {
        return "hidden"
      }
    }

    return "visible"
  }, [id, difficulty, topics, title, filters.difficulty, filters.topic, deferredSearch])
}

/**
 * Hook to get filtered and sorted cards with stats.
 * Returns filtered card IDs, sort order map, and their stats.
 */
export function useFilteredCards(): {
  filteredIds: string[]
  sortOrderMap: Record<string, number>
  stats: {
    total: number
    totalFiltered: number
    easy: number
    medium: number
    hard: number
  }
} {
  const filters = use(FilterStateContext)
  const metadata = use(FilterMetadataContext)
  const deferredSearch = useDeferredValue(filters.search)

  return useMemo(() => {
    // Filter cards
    const filtered = [...metadata.cardsMetadata].filter((card) => {
      // Difficulty filter
      if (filters.difficulty !== "all" && card.difficulty !== filters.difficulty) {
        return false
      }

      // Topic filter
      if (filters.topic !== "all" && !card.topics.includes(filters.topic)) {
        return false
      }

      // Search filter (id + title only)
      if (deferredSearch) {
        const searchLower = deferredSearch.toLowerCase()
        const matchesId = card.id.toLowerCase().includes(searchLower)
        const matchesTitle = card.title.toLowerCase().includes(searchLower)

        if (!matchesId && !matchesTitle) {
          return false
        }
      }

      return true
    })

    // Sort filtered cards
    filtered.sort((a, b) => {
      let comparison = 0

      if (filters.sort === "number") {
        const numA = parseInt(a.id.match(/^(\d+)-/)?.[1] || "0", 10)
        const numB = parseInt(b.id.match(/^(\d+)-/)?.[1] || "0", 10)
        comparison = numA - numB
      } else if (filters.sort === "difficulty") {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      } else if (filters.sort === "alpha") {
        comparison = a.title.localeCompare(b.title)
      } else if (filters.sort === "date-created") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        comparison = dateB - dateA
      } else if (filters.sort === "date-updated") {
        const dateA = new Date(a.updatedAt).getTime()
        const dateB = new Date(b.updatedAt).getTime()
        comparison = dateB - dateA
      }

      return filters.order === "asc" ? comparison : -comparison
    })

    // Calculate stats for filtered results
    const stats = {
      total: metadata.totalCards,
      totalFiltered: filtered.length,
      easy: filtered.filter((c) => c.difficulty === "easy").length,
      medium: filtered.filter((c) => c.difficulty === "medium").length,
      hard: filtered.filter((c) => c.difficulty === "hard").length,
    }

    // Create sort order map for CSS order property
    const sortOrderMap: Record<string, number> = {}
    filtered.forEach((card, index) => {
      sortOrderMap[card.id] = index
    })

    return {
      filteredIds: filtered.map((card) => card.id),
      sortOrderMap,
      stats,
    }
  }, [filters.difficulty, filters.topic, filters.sort, filters.order, deferredSearch, metadata.cardsMetadata, metadata.totalCards])
}

/**
 * Hook to get the CSS order value for a specific card.
 */
export function useCardOrder(id: string): number {
  const { sortOrderMap } = useFilteredCards()
  return sortOrderMap[id] ?? 9999
}
