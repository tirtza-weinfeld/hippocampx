import { renderHook, act } from "@testing-library/react"
import { describe, test, expect, beforeEach, vi } from "vitest"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { z } from "zod"

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("initialization", () => {
    test("returns default value when localStorage is empty", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      expect(result.current[0]).toBe("default")
    })

    test("handles plain string values from old storage format", () => {
      // Simulate old format where strings were stored without JSON.stringify
      localStorage.setItem("test-key", "custom")

      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      expect(result.current[0]).toBe("custom")
    })

    test("handles JSON stringified values", () => {
      localStorage.setItem("test-key", JSON.stringify("custom"))

      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      expect(result.current[0]).toBe("custom")
    })

    test("handles complex objects", () => {
      const testObject = { name: "test", count: 5 }
      localStorage.setItem("test-key", JSON.stringify(testObject))

      const schema = z.object({
        name: z.string(),
        count: z.number(),
      })

      const { result } = renderHook(() =>
        useLocalStorage("test-key", schema, { name: "", count: 0 })
      )

      expect(result.current[0]).toEqual(testObject)
    })

    test("returns default value for corrupted data", () => {
      localStorage.setItem("test-key", "{invalid json")

      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      expect(result.current[0]).toBe("default")
      expect(localStorage.getItem("test-key")).toBeNull()
    })

    test("validates data with schema and rejects invalid data", () => {
      localStorage.setItem("test-key", JSON.stringify(123))

      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      expect(result.current[0]).toBe("default")
      expect(localStorage.getItem("test-key")).toBeNull()
    })
  })

  describe("setValue", () => {
    test("saves value to localStorage", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.string(), "default")
      )

      act(() => {
        result.current[1]("new-value")
      })

      expect(localStorage.getItem("test-key")).toBe(
        JSON.stringify("new-value")
      )
    })

    test("validates value before saving", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.number(), 0)
      )

      act(() => {
        // @ts-expect-error - testing runtime validation
        result.current[1]("invalid")
      })

      // Should not save invalid data
      expect(localStorage.getItem("test-key")).toBeNull()
    })

    test("handles function updater", () => {
      const { result } = renderHook(() =>
        useLocalStorage("test-key", z.number(), 5)
      )

      act(() => {
        result.current[1]((prev) => prev + 10)
      })

      expect(result.current[0]).toBe(15)
    })
  })

  describe("migration from old format", () => {
    test("handles font values from old storage (plain strings)", () => {
      // Old format stored fonts as plain strings
      localStorage.setItem("font", "inter")

      const FontSchema = z.enum([
        "inter",
        "roboto",
        "open-sans",
        "montserrat",
      ])

      const { result } = renderHook(() =>
        useLocalStorage("font", FontSchema, "inter")
      )

      expect(result.current[0]).toBe("inter")
    })

    test("handles sort order from old storage (plain strings)", () => {
      localStorage.setItem("favoritesSortOrder", "custom")

      const SortOrderSchema = z.enum(["date", "alphabetical", "custom"])

      const { result } = renderHook(() =>
        useLocalStorage("favoritesSortOrder", SortOrderSchema, "date")
      )

      expect(result.current[0]).toBe("custom")
    })

    test("handles boolean from old storage (string 'true'/'false')", () => {
      localStorage.setItem("showFavoritesOnly", "true")

      const { result } = renderHook(() =>
        useLocalStorage("showFavoritesOnly", z.boolean(), false)
      )

      expect(result.current[0]).toBe(true)
    })
  })
})
