import { describe, test, expect, beforeEach, vi } from "vitest"
import { act } from "@testing-library/react"
import { useDictionaryListStore } from "@/components/dictionary/store/dictionary-list-store"
import type { WordWithPreview, InfiniteScrollCursor } from "@/lib/db/neon/queries/dictionary/index"

type RestorationState = {
  words: WordWithPreview[]
  cursor: InfiniteScrollCursor | null
  hasNextPage: boolean
  scrollY: number
} | null

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage })

function createMockWord(id: number, text: string): WordWithPreview {
  return {
    id,
    word_text: text,
    language_code: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    definition_text: `Definition for ${text}`,
    example_text: null,
  }
}

function createMockCursor(): InfiniteScrollCursor {
  return {
    afterId: 50,
    afterSortValue: "2025-01-01T00:00:00Z",
    sortBy: "created_at",
    sortOrder: "desc",
  }
}

describe("useDictionaryListStore", () => {
  beforeEach(() => {
    mockSessionStorage.clear()
    vi.clearAllMocks()
    // Reset store to initial state
    useDictionaryListStore.setState({
      words: [],
      cursor: null,
      hasNextPage: false,
      scrollY: 0,
      filterKey: '',
      originPath: null,
    })
  })

  describe("saveListState", () => {
    test("saves words, cursor, and scroll position", () => {
      const words = [createMockWord(1, "apple"), createMockWord(2, "banana")]
      const cursor = createMockCursor()

      act(() => {
        useDictionaryListStore.getState().saveListState({
          words,
          cursor,
          hasNextPage: true,
          scrollY: 500,
          filterKey: "lang=en",
        })
      })

      const state = useDictionaryListStore.getState()
      expect(state.words).toEqual(words)
      expect(state.cursor).toEqual(cursor)
      expect(state.hasNextPage).toBe(true)
      expect(state.scrollY).toBe(500)
      expect(state.filterKey).toBe("lang=en")
      expect(state.originPath).toBe("/dictionary")
    })

    test("sets originPath to /dictionary", () => {
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words: [createMockWord(1, "test")],
          cursor: null,
          hasNextPage: false,
          scrollY: 0,
          filterKey: "",
        })
      })

      expect(useDictionaryListStore.getState().originPath).toBe("/dictionary")
    })
  })

  describe("clearListState", () => {
    test("resets all state to initial values", () => {
      // First save some state
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words: [createMockWord(1, "test")],
          cursor: createMockCursor(),
          hasNextPage: true,
          scrollY: 1000,
          filterKey: "q=test",
        })
      })

      // Then clear it
      act(() => {
        useDictionaryListStore.getState().clearListState()
      })

      const state = useDictionaryListStore.getState()
      expect(state.words).toEqual([])
      expect(state.cursor).toBeNull()
      expect(state.hasNextPage).toBe(false)
      expect(state.scrollY).toBe(0)
      expect(state.filterKey).toBe('')
      expect(state.originPath).toBeNull()
    })
  })

  describe("setOriginPath", () => {
    test("sets origin path", () => {
      act(() => {
        useDictionaryListStore.getState().setOriginPath("/dictionary")
      })

      expect(useDictionaryListStore.getState().originPath).toBe("/dictionary")
    })

    test("clears origin path when set to null", () => {
      act(() => {
        useDictionaryListStore.getState().setOriginPath("/dictionary")
        useDictionaryListStore.getState().setOriginPath(null)
      })

      expect(useDictionaryListStore.getState().originPath).toBeNull()
    })
  })

  describe("consumeRestorationState", () => {
    test("returns stored state when conditions are met", () => {
      const words = [createMockWord(1, "apple"), createMockWord(2, "banana")]
      const cursor = createMockCursor()

      act(() => {
        useDictionaryListStore.getState().saveListState({
          words,
          cursor,
          hasNextPage: true,
          scrollY: 750,
          filterKey: "lang=en&q=fruit",
        })
      })

      let result: RestorationState
      act(() => {
        result = useDictionaryListStore.getState().consumeRestorationState("lang=en&q=fruit")
      })

      expect(result).not.toBeNull()
      expect(result?.words).toEqual(words)
      expect(result?.cursor).toEqual(cursor)
      expect(result?.hasNextPage).toBe(true)
      expect(result?.scrollY).toBe(750)
    })

    test("clears originPath after consumption to prevent double-restoration", () => {
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words: [createMockWord(1, "test")],
          cursor: null,
          hasNextPage: false,
          scrollY: 100,
          filterKey: "",
        })
      })

      act(() => {
        useDictionaryListStore.getState().consumeRestorationState("")
      })

      expect(useDictionaryListStore.getState().originPath).toBeNull()
    })

    test("returns null when originPath is not /dictionary", () => {
      act(() => {
        useDictionaryListStore.setState({
          words: [createMockWord(1, "test")],
          cursor: null,
          hasNextPage: false,
          scrollY: 100,
          filterKey: "",
          originPath: "/other-page",
        })
      })

      let result: RestorationState
      act(() => {
        result = useDictionaryListStore.getState().consumeRestorationState("")
      })

      expect(result).toBeNull()
    })

    test("returns null when filterKey does not match", () => {
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words: [createMockWord(1, "test")],
          cursor: null,
          hasNextPage: false,
          scrollY: 100,
          filterKey: "lang=en",
        })
      })

      let result: RestorationState
      act(() => {
        result = useDictionaryListStore.getState().consumeRestorationState("lang=es")
      })

      expect(result).toBeNull()
    })

    test("returns null when words array is empty", () => {
      act(() => {
        useDictionaryListStore.setState({
          words: [],
          cursor: null,
          hasNextPage: false,
          scrollY: 100,
          filterKey: "",
          originPath: "/dictionary",
        })
      })

      let result: RestorationState
      act(() => {
        result = useDictionaryListStore.getState().consumeRestorationState("")
      })

      expect(result).toBeNull()
    })

    test("returns null on second call (atomic consumption)", () => {
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words: [createMockWord(1, "test")],
          cursor: null,
          hasNextPage: false,
          scrollY: 100,
          filterKey: "",
        })
      })

      let firstResult: RestorationState
      let secondResult: RestorationState

      act(() => {
        firstResult = useDictionaryListStore.getState().consumeRestorationState("")
        secondResult = useDictionaryListStore.getState().consumeRestorationState("")
      })

      expect(firstResult).not.toBeNull()
      expect(secondResult).toBeNull()
    })
  })

  describe("direct entry scenario", () => {
    test("returns null when user navigates directly to dictionary (no saved state)", () => {
      // User navigates directly to /dictionary - no prior state saved
      let result: RestorationState
      act(() => {
        result = useDictionaryListStore.getState().consumeRestorationState("")
      })

      expect(result).toBeNull()
    })
  })

  describe("back navigation scenario", () => {
    test("full flow: save state, navigate away, return and restore", () => {
      const words = [
        createMockWord(1, "algorithm"),
        createMockWord(2, "binary"),
        createMockWord(3, "cache"),
      ]
      const cursor = createMockCursor()
      const filterKey = "lang=en&tag=programming"

      // Step 1: User scrolls and loads more words, then clicks on a word
      act(() => {
        useDictionaryListStore.getState().saveListState({
          words,
          cursor,
          hasNextPage: true,
          scrollY: 1200,
          filterKey,
        })
      })

      // Step 2: User is on word detail page, then navigates back
      let restoredState: RestorationState
      act(() => {
        restoredState = useDictionaryListStore.getState().consumeRestorationState(filterKey)
      })

      // Step 3: Verify restoration
      expect(restoredState).not.toBeNull()
      expect(restoredState?.words).toHaveLength(3)
      expect(restoredState?.words[0].word_text).toBe("algorithm")
      expect(restoredState?.scrollY).toBe(1200)
      expect(restoredState?.hasNextPage).toBe(true)

      // Step 4: Verify double-restoration is prevented
      let secondAttempt: RestorationState
      act(() => {
        secondAttempt = useDictionaryListStore.getState().consumeRestorationState(filterKey)
      })
      expect(secondAttempt).toBeNull()
    })
  })
})
