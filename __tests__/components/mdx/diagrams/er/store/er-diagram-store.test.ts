import { describe, test, expect, beforeEach, vi } from "vitest"
import { act } from "@testing-library/react"
import { useERDiagramStore, DEFAULT_CANVAS_TRANSFORM } from "@/components/mdx/diagrams/er/store/er-diagram-store"
import { generateDiagramId } from "@/components/mdx/diagrams/er/store/generate-diagram-id"
import type { ERTopology, TablePositions, TableScales, CanvasTransform } from "@/components/mdx/diagrams/er/types"

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

function createMockTopology(tables: string[]): ERTopology {
  return {
    tables: tables.map(name => ({
      name,
      columns: [{ name: 'id', type: 'int', constraints: ['PK' as const] }],
    })),
    relationships: [],
    metrics: {},
    layers: [tables],
    clusters: [],
    domains: [],
  }
}

describe("useERDiagramStore", () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
    // Reset store to initial state
    useERDiagramStore.setState({ layouts: {} })
  })

  describe("setPositions", () => {
    test("saves table positions for a diagram", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = {
        Users: { x: 100, y: 200 },
        Orders: { x: 300, y: 400 },
      }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual({})
      expect(layout?.isFullscreen).toBe(false)
      expect(layout?.canvasTransform).toEqual(DEFAULT_CANVAS_TRANSFORM)
    })

    test("preserves scales, fullscreen, and canvasTransform when updating positions", () => {
      const diagramId = "test-diagram"
      const scales: TableScales = { Users: 1.5 }
      const positions: TablePositions = { Users: { x: 100, y: 200 } }
      const canvasTransform: CanvasTransform = { x: 50, y: 100, scale: 1.5 }

      act(() => {
        useERDiagramStore.getState().setScales(diagramId, scales)
        useERDiagramStore.getState().setFullscreen(diagramId, true)
        useERDiagramStore.getState().setCanvasTransform(diagramId, canvasTransform)
        useERDiagramStore.getState().setPositions(diagramId, positions)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual(scales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(canvasTransform)
    })
  })

  describe("setScales", () => {
    test("saves table scales for a diagram", () => {
      const diagramId = "test-diagram"
      const scales: TableScales = {
        Users: 1.5,
        Orders: 0.8,
      }

      act(() => {
        useERDiagramStore.getState().setScales(diagramId, scales)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.scales).toEqual(scales)
      expect(layout?.positions).toEqual({})
      expect(layout?.isFullscreen).toBe(false)
      expect(layout?.canvasTransform).toEqual(DEFAULT_CANVAS_TRANSFORM)
    })

    test("preserves positions, fullscreen, and canvasTransform when updating scales", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }
      const scales: TableScales = { Users: 1.5 }
      const canvasTransform: CanvasTransform = { x: 25, y: 50, scale: 2 }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
        useERDiagramStore.getState().setFullscreen(diagramId, true)
        useERDiagramStore.getState().setCanvasTransform(diagramId, canvasTransform)
        useERDiagramStore.getState().setScales(diagramId, scales)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual(scales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(canvasTransform)
    })
  })

  describe("setFullscreen", () => {
    test("saves fullscreen state for a diagram", () => {
      const diagramId = "test-diagram"

      act(() => {
        useERDiagramStore.getState().setFullscreen(diagramId, true)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.positions).toEqual({})
      expect(layout?.scales).toEqual({})
      expect(layout?.canvasTransform).toEqual(DEFAULT_CANVAS_TRANSFORM)
    })

    test("preserves positions, scales, and canvasTransform when updating fullscreen", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }
      const scales: TableScales = { Users: 1.5 }
      const canvasTransform: CanvasTransform = { x: 10, y: 20, scale: 0.8 }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
        useERDiagramStore.getState().setScales(diagramId, scales)
        useERDiagramStore.getState().setCanvasTransform(diagramId, canvasTransform)
        useERDiagramStore.getState().setFullscreen(diagramId, true)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual(scales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(canvasTransform)
    })

    test("toggles fullscreen state", () => {
      const diagramId = "test-diagram"

      act(() => {
        useERDiagramStore.getState().setFullscreen(diagramId, true)
      })
      expect(useERDiagramStore.getState().layouts[diagramId]?.isFullscreen).toBe(true)

      act(() => {
        useERDiagramStore.getState().setFullscreen(diagramId, false)
      })
      expect(useERDiagramStore.getState().layouts[diagramId]?.isFullscreen).toBe(false)
    })
  })

  describe("setCanvasTransform", () => {
    test("saves canvas transform for a diagram", () => {
      const diagramId = "test-diagram"
      const canvasTransform: CanvasTransform = { x: 100, y: 200, scale: 1.5 }

      act(() => {
        useERDiagramStore.getState().setCanvasTransform(diagramId, canvasTransform)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.canvasTransform).toEqual(canvasTransform)
      expect(layout?.positions).toEqual({})
      expect(layout?.scales).toEqual({})
      expect(layout?.isFullscreen).toBe(false)
    })

    test("preserves positions, scales, and fullscreen when updating canvasTransform", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }
      const scales: TableScales = { Users: 1.5 }
      const canvasTransform: CanvasTransform = { x: 50, y: 75, scale: 2.5 }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
        useERDiagramStore.getState().setScales(diagramId, scales)
        useERDiagramStore.getState().setFullscreen(diagramId, true)
        useERDiagramStore.getState().setCanvasTransform(diagramId, canvasTransform)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual(scales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(canvasTransform)
    })
  })

  describe("setLayout", () => {
    test("updates positions, scales, fullscreen, and canvasTransform at once", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }
      const scales: TableScales = { Users: 1.5 }
      const canvasTransform: CanvasTransform = { x: 30, y: 60, scale: 1.2 }

      act(() => {
        useERDiagramStore.getState().setLayout(diagramId, { positions, scales, isFullscreen: true, canvasTransform })
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(positions)
      expect(layout?.scales).toEqual(scales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(canvasTransform)
    })

    test("partially updates layout preserving other values", () => {
      const diagramId = "test-diagram"
      const initialPositions: TablePositions = { Users: { x: 100, y: 200 } }
      const newScales: TableScales = { Users: 1.5 }
      const initialCanvasTransform: CanvasTransform = { x: 15, y: 30, scale: 0.9 }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, initialPositions)
        useERDiagramStore.getState().setFullscreen(diagramId, true)
        useERDiagramStore.getState().setCanvasTransform(diagramId, initialCanvasTransform)
        useERDiagramStore.getState().setLayout(diagramId, { scales: newScales })
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout?.positions).toEqual(initialPositions)
      expect(layout?.scales).toEqual(newScales)
      expect(layout?.isFullscreen).toBe(true)
      expect(layout?.canvasTransform).toEqual(initialCanvasTransform)
    })
  })

  describe("resetLayout", () => {
    test("removes layout for a diagram", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
        useERDiagramStore.getState().resetLayout(diagramId)
      })

      const layout = useERDiagramStore.getState().layouts[diagramId]
      expect(layout).toBeUndefined()
    })

    test("does not affect other diagrams", () => {
      const diagramId1 = "diagram-1"
      const diagramId2 = "diagram-2"
      const positions1: TablePositions = { Users: { x: 100, y: 200 } }
      const positions2: TablePositions = { Orders: { x: 300, y: 400 } }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId1, positions1)
        useERDiagramStore.getState().setPositions(diagramId2, positions2)
        useERDiagramStore.getState().resetLayout(diagramId1)
      })

      expect(useERDiagramStore.getState().layouts[diagramId1]).toBeUndefined()
      expect(useERDiagramStore.getState().layouts[diagramId2]?.positions).toEqual(positions2)
    })
  })

  describe("getLayout", () => {
    test("returns layout for existing diagram", () => {
      const diagramId = "test-diagram"
      const positions: TablePositions = { Users: { x: 100, y: 200 } }

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId, positions)
      })

      const layout = useERDiagramStore.getState().getLayout(diagramId)
      expect(layout?.positions).toEqual(positions)
    })

    test("returns undefined for non-existent diagram", () => {
      const layout = useERDiagramStore.getState().getLayout("non-existent")
      expect(layout).toBeUndefined()
    })
  })

  describe("multiple diagrams", () => {
    test("handles multiple diagrams independently", () => {
      const diagramId1 = "diagram-1"
      const diagramId2 = "diagram-2"

      act(() => {
        useERDiagramStore.getState().setPositions(diagramId1, { Users: { x: 10, y: 20 } })
        useERDiagramStore.getState().setScales(diagramId1, { Users: 1.2 })
        useERDiagramStore.getState().setPositions(diagramId2, { Orders: { x: 30, y: 40 } })
        useERDiagramStore.getState().setScales(diagramId2, { Orders: 0.8 })
      })

      const layout1 = useERDiagramStore.getState().layouts[diagramId1]
      const layout2 = useERDiagramStore.getState().layouts[diagramId2]

      expect(layout1?.positions).toEqual({ Users: { x: 10, y: 20 } })
      expect(layout1?.scales).toEqual({ Users: 1.2 })
      expect(layout2?.positions).toEqual({ Orders: { x: 30, y: 40 } })
      expect(layout2?.scales).toEqual({ Orders: 0.8 })
    })
  })
})

describe("generateDiagramId", () => {
  test("generates consistent ID for same topology", () => {
    const topology = createMockTopology(["Users", "Orders"])
    const id1 = generateDiagramId(topology)
    const id2 = generateDiagramId(topology)
    expect(id1).toBe(id2)
  })

  test("generates different IDs for different topologies", () => {
    const topology1 = createMockTopology(["Users", "Orders"])
    const topology2 = createMockTopology(["Products", "Categories"])
    const id1 = generateDiagramId(topology1)
    const id2 = generateDiagramId(topology2)
    expect(id1).not.toBe(id2)
  })

  test("includes slugified title when provided", () => {
    const topology = createMockTopology(["Users"])
    const id = generateDiagramId(topology, "E-Commerce Schema")
    expect(id).toMatch(/^er-e-commerce-schema-/)
  })

  test("generates ID without title prefix when title is not provided", () => {
    const topology = createMockTopology(["Users"])
    const id = generateDiagramId(topology)
    expect(id).toMatch(/^er-[a-z0-9]+$/)
  })

  test("handles special characters in title", () => {
    const topology = createMockTopology(["Users"])
    const id = generateDiagramId(topology, "User's Database (v2.0)")
    expect(id).toMatch(/^er-user-s-database-v2-0-/)
  })

  test("truncates long titles", () => {
    const topology = createMockTopology(["Users"])
    const longTitle = "A".repeat(100)
    const id = generateDiagramId(topology, longTitle)
    // Title slug is limited to 32 chars
    expect(id.length).toBeLessThan(50)
  })
})
