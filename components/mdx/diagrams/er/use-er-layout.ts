import { useMemo } from 'react'
import type {
  ERTopology,
  DiagramLayout,
  TableLayout,
  RelationshipPath,
  Table,
  Point,
  Dimensions,
} from './types'

// ============================================================================
// CONSTANTS
// ============================================================================

const TABLE_WIDTH = 280
const ROW_HEIGHT = 32
const HEADER_HEIGHT = 44
const LAYER_GAP_X = 120
const TABLE_GAP_Y = 40
const PADDING = 60

// ============================================================================
// DIMENSION CALCULATION
// ============================================================================

function calculateTableDimensions(table: Table): Dimensions {
  return {
    width: TABLE_WIDTH,
    height: HEADER_HEIGHT + table.columns.length * ROW_HEIGHT,
  }
}

// ============================================================================
// LAYER-BASED LAYOUT (uses pre-computed topology from plugin)
// ============================================================================

function computeLayerLayout(topology: ERTopology): TableLayout[] {
  const tableMap = new Map(topology.tables.map(t => [t.name, t]))
  const layouts: TableLayout[] = []

  let currentX = PADDING

  for (const layer of topology.layers) {
    // Calculate dimensions for all tables in this layer
    const layerTables = layer
      .map(name => tableMap.get(name))
      .filter((t): t is Table => t !== undefined)

    // Sort by metrics: primary hubs first, then by incoming FKs
    layerTables.sort((a, b) => {
      const metricsA = topology.metrics[a.name]
      const metricsB = topology.metrics[b.name]
      if (metricsA.isPrimaryHub !== metricsB.isPrimaryHub) {
        return metricsA.isPrimaryHub ? -1 : 1
      }
      return metricsB.incomingFKs - metricsA.incomingFKs
    })

    // Calculate dimensions for positioning
    const layerDimensions = layerTables.map(t => calculateTableDimensions(t))

    // Position tables vertically centered
    let currentY = PADDING

    for (let i = 0; i < layerTables.length; i++) {
      const table = layerTables[i]
      const dimensions = layerDimensions[i]

      layouts.push({
        table,
        position: { x: currentX, y: currentY },
        dimensions,
      })

      currentY += dimensions.height + TABLE_GAP_Y
    }

    // Move to next column
    currentX += TABLE_WIDTH + LAYER_GAP_X
  }

  return layouts
}

// ============================================================================
// RELATIONSHIP PATHS
// ============================================================================

function getConnectionPoint(
  layout: TableLayout,
  columnName: string,
  side: 'left' | 'right'
): Point {
  const columnIndex = layout.table.columns.findIndex(c => c.name === columnName)
  const rowOffset = columnIndex >= 0 ? columnIndex : 0

  const x = side === 'left' ? layout.position.x : layout.position.x + layout.dimensions.width
  const y = layout.position.y + HEADER_HEIGHT + rowOffset * ROW_HEIGHT + ROW_HEIGHT / 2

  return { x, y }
}

function generateBezierPath(from: Point, to: Point): string {
  const dx = to.x - from.x
  const dy = to.y - from.y

  // Use different curve strategies based on direction
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant: horizontal bezier
    const controlOffset = Math.min(Math.abs(dx) * 0.4, 80)
    return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`
  } else {
    // Vertical dominant: S-curve
    const midY = (from.y + to.y) / 2
    return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
  }
}

function calculateRelationshipPaths(
  tableLayouts: TableLayout[],
  relationships: ERTopology['relationships']
): RelationshipPath[] {
  const layoutMap = new Map(tableLayouts.map(tl => [tl.table.name, tl]))

  return relationships.map(rel => {
    const fromLayout = layoutMap.get(rel.from.table)
    const toLayout = layoutMap.get(rel.to.table)

    if (!fromLayout || !toLayout) {
      return { relationship: rel, path: '' }
    }

    const fromCenterX = fromLayout.position.x + fromLayout.dimensions.width / 2
    const toCenterX = toLayout.position.x + toLayout.dimensions.width / 2

    const fromSide: 'left' | 'right' = fromCenterX < toCenterX ? 'right' : 'left'
    const toSide: 'left' | 'right' = fromCenterX < toCenterX ? 'left' : 'right'

    const fromPoint = getConnectionPoint(fromLayout, rel.from.column, fromSide)
    const toPoint = getConnectionPoint(toLayout, rel.to.column, toSide)

    return {
      relationship: rel,
      path: generateBezierPath(fromPoint, toPoint),
    }
  })
}

// ============================================================================
// HOOK
// ============================================================================

export function useERLayout(topology: ERTopology): DiagramLayout {
  return useMemo(() => {
    const tableLayouts = computeLayerLayout(topology)
    const relationshipPaths = calculateRelationshipPaths(tableLayouts, topology.relationships)

    // Calculate viewBox
    let maxX = 0
    let maxY = 0

    for (const layout of tableLayouts) {
      maxX = Math.max(maxX, layout.position.x + layout.dimensions.width)
      maxY = Math.max(maxY, layout.position.y + layout.dimensions.height)
    }

    return {
      tables: tableLayouts,
      relationships: relationshipPaths,
      viewBox: { width: maxX + PADDING, height: maxY + PADDING },
    }
  }, [topology])
}

export { HEADER_HEIGHT, ROW_HEIGHT, TABLE_WIDTH }
