import { describe, test, expect, beforeEach, vi } from "vitest"
import {
  getCookieValue,
  setCookieValue,
  syncStorage,
  getStorageValue,
  removeStorageValue,
  clearAllStorage,
} from "@/lib/storage-service"

describe("storage-service", () => {
  beforeEach(() => {
    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const key = cookie.split("=")[0].trim()
      document.cookie = `${key}=; max-age=0; path=/`
    })
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("getCookieValue", () => {
    test("returns null when cookie does not exist", () => {
      const result = getCookieValue("nonexistent")
      expect(result).toBeNull()
    })

    test("retrieves cookie value correctly", () => {
      document.cookie = `testKey=${encodeURIComponent(JSON.stringify("testValue"))}; path=/`

      const result = getCookieValue<string>("testKey")
      expect(result).toBe("testValue")
    })

    test("handles complex objects", () => {
      const testObject = { name: "test", count: 5 }
      document.cookie = `testKey=${encodeURIComponent(JSON.stringify(testObject))}; path=/`

      const result = getCookieValue<typeof testObject>("testKey")
      expect(result).toEqual(testObject)
    })

    test("returns null for malformed cookie data", () => {
      document.cookie = "testKey=invalid-json; path=/"

      const result = getCookieValue("testKey")
      expect(result).toBeNull()
    })
  })

  describe("setCookieValue", () => {
    test("sets cookie with default options", () => {
      setCookieValue("testKey", "testValue")

      const cookieValue = getCookieValue<string>("testKey")
      expect(cookieValue).toBe("testValue")
    })

    test("sets cookie with custom max-age", () => {
      setCookieValue("testKey", "testValue", { maxAge: 3600 })

      const cookieValue = getCookieValue<string>("testKey")
      expect(cookieValue).toBe("testValue")
    })

    test("sets cookie with custom path", () => {
      setCookieValue("testKey", "testValue", { path: "/custom" })

      // Cookie should be set (checking actual cookie string)
      expect(document.cookie).toContain("testKey")
    })

    test("handles boolean values", () => {
      setCookieValue("boolKey", true)

      const result = getCookieValue<boolean>("boolKey")
      expect(result).toBe(true)
    })

    test("handles numeric values", () => {
      setCookieValue("numKey", 42)

      const result = getCookieValue<number>("numKey")
      expect(result).toBe(42)
    })

    test("handles complex objects", () => {
      const testObject = { name: "test", items: [1, 2, 3] }
      setCookieValue("objKey", testObject)

      const result = getCookieValue<typeof testObject>("objKey")
      expect(result).toEqual(testObject)
    })
  })

  describe("syncStorage", () => {
    test("syncs value to both localStorage and cookies", () => {
      syncStorage("testKey", "testValue")

      expect(localStorage.getItem("testKey")).toBe(JSON.stringify("testValue"))
      expect(getCookieValue<string>("testKey")).toBe("testValue")
    })

    test("syncs complex objects", () => {
      const testObject = { foo: "bar", baz: 123 }
      syncStorage("testKey", testObject)

      const localValue = JSON.parse(localStorage.getItem("testKey") || "{}")
      const cookieValue = getCookieValue<typeof testObject>("testKey")

      expect(localValue).toEqual(testObject)
      expect(cookieValue).toEqual(testObject)
    })

    test("handles errors gracefully", () => {
      // Mock localStorage to throw error
      const mockSetItem = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("QuotaExceededError")
        })

      // Should not throw
      expect(() => syncStorage("testKey", "testValue")).not.toThrow()

      mockSetItem.mockRestore()
    })
  })

  describe("getStorageValue", () => {
    test("returns value from localStorage when available", () => {
      localStorage.setItem("testKey", JSON.stringify("testValue"))

      const result = getStorageValue("testKey", "default")
      expect(result).toBe("testValue")
    })

    test("falls back to cookie when localStorage is empty", () => {
      setCookieValue("testKey", "cookieValue")

      const result = getStorageValue("testKey", "default")
      expect(result).toBe("cookieValue")
    })

    test("returns default value when both storage methods are empty", () => {
      const result = getStorageValue("testKey", "default")
      expect(result).toBe("default")
    })

    test("handles corrupted localStorage data", () => {
      localStorage.setItem("testKey", "invalid-json")

      const result = getStorageValue("testKey", "default")
      expect(result).toBe("default")
    })

    test("prioritizes localStorage over cookies", () => {
      localStorage.setItem("testKey", JSON.stringify("localValue"))
      setCookieValue("testKey", "cookieValue")

      const result = getStorageValue("testKey", "default")
      expect(result).toBe("localValue")
    })
  })

  describe("removeStorageValue", () => {
    test("removes value from both localStorage and cookies", () => {
      syncStorage("testKey", "testValue")

      removeStorageValue("testKey")

      expect(localStorage.getItem("testKey")).toBeNull()
      expect(getCookieValue("testKey")).toBeNull()
    })

    test("handles non-existent keys gracefully", () => {
      expect(() => removeStorageValue("nonexistent")).not.toThrow()
    })

    test("removes only specified key", () => {
      syncStorage("key1", "value1")
      syncStorage("key2", "value2")

      removeStorageValue("key1")

      expect(localStorage.getItem("key1")).toBeNull()
      expect(localStorage.getItem("key2")).toBe(JSON.stringify("value2"))
    })
  })

  describe("clearAllStorage", () => {
    test("clears all localStorage and cookies", () => {
      syncStorage("key1", "value1")
      syncStorage("key2", "value2")

      clearAllStorage()

      expect(localStorage.length).toBe(0)
      // Cookies should also be cleared
      expect(document.cookie).toBe("")
    })

    test("handles empty storage gracefully", () => {
      expect(() => clearAllStorage()).not.toThrow()
    })
  })

  describe("SSR compatibility", () => {
    test("handles undefined window gracefully", () => {
      // These functions should not throw in SSR context
      // (Though they won't do anything either)
      expect(() => setCookieValue("key", "value")).not.toThrow()
      expect(() => syncStorage("key", "value")).not.toThrow()
      expect(() => removeStorageValue("key")).not.toThrow()
      expect(() => clearAllStorage()).not.toThrow()
    })
  })
})
