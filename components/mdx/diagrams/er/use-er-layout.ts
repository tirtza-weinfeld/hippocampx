import type {
  ERTopology,
  DiagramLayout,
  TableLayout,
  RelationshipPath,
  Table,
  Point,
  Dimensions,
  TablePositions,
  TableScales,
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
  side: 'left' | 'right',
  scale: number = 1,
  isTarget: boolean = false
): Point {
  const columnIndex = layout.table.columns.findIndex(c => c.name === columnName)
  const rowOffset = columnIndex >= 0 ? columnIndex : 0

  // Calculate table center
  const tableHeight = HEADER_HEIGHT + layout.table.columns.length * ROW_HEIGHT
  const centerX = layout.position.x + layout.dimensions.width / 2
  const centerY = layout.position.y + tableHeight / 2

  // Calculate scaled width
  const scaledWidth = layout.dimensions.width * scale

  // Calculate connection point relative to center, then apply scale
  const relativeY = HEADER_HEIGHT + rowOffset * ROW_HEIGHT + ROW_HEIGHT / 2 - tableHeight / 2
  const scaledRelativeY = relativeY * scale

  // Offset from table edge for markers - must be large enough that markers
  // are fully visible in the gap between tables (not hidden behind table)
  const FK_MARKER_OFFSET = 16  // Triangle extends ~8px back, so 16px keeps it visible
  const PK_MARKER_OFFSET = 14  // Circle radius ~5px
  const offset = isTarget ? PK_MARKER_OFFSET : FK_MARKER_OFFSET

  const x = side === 'left'
    ? centerX - scaledWidth / 2 - offset
    : centerX + scaledWidth / 2 + offset
  const y = centerY + scaledRelativeY

  return { x, y }
}

function generateBezierPath(
  from: Point,
  to: Point,
  fromSide: 'left' | 'right',
  toSide: 'left' | 'right',
  curveOffset: number = 0
): string {
  const dx = to.x - from.x
  const dy = to.y - from.y

  // Small offset to separate overlapping paths
  const separation = Math.min(curveOffset, 15)

  // Determine control point direction based on which side we're exiting/entering
  const fromDir = fromSide === 'right' ? 1 : -1
  const toDir = toSide === 'left' ? -1 : 1

  // Same-side connections (vertically stacked tables)
  if (fromSide === toSide) {
    // Tight curve that stays close to the tables
    const curveOut = Math.min(40, Math.abs(dy) * 0.15) + separation
    // Both control points go same direction since same side
    return `M ${from.x} ${from.y} C ${from.x + fromDir * curveOut} ${from.y}, ${to.x + fromDir * curveOut} ${to.y}, ${to.x} ${to.y}`
  }

  // Opposite-side connections (horizontally separated tables)
  const controlDist = Math.min(Math.abs(dx) * 0.35, 50) + separation
  return `M ${from.x} ${from.y} C ${from.x + fromDir * controlDist} ${from.y + separation * 0.2}, ${to.x + toDir * controlDist} ${to.y - separation * 0.2}, ${to.x} ${to.y}`
}

function calculateRelationshipPaths(
  tableLayouts: TableLayout[],
  relationships: ERTopology['relationships'],
  scales: TableScales = {}
): RelationshipPath[] {
  const layoutMap = new Map(tableLayouts.map(tl => [tl.table.name, tl]))

  // Track connections per table-side to offset overlapping paths
  const connectionCounts = new Map<string, number>()

  function getConnectionKey(table: string, side: 'left' | 'right'): string {
    return `${table}-${side}`
  }

  function getAndIncrementCount(table: string, side: 'left' | 'right'): number {
    const key = getConnectionKey(table, side)
    const count = connectionCounts.get(key) ?? 0
    connectionCounts.set(key, count + 1)
    return count
  }

  return relationships.map(rel => {
    const fromLayout = layoutMap.get(rel.from.table)
    const toLayout = layoutMap.get(rel.to.table)

    if (!fromLayout || !toLayout) {
      return { relationship: rel, path: '', fkSide: 'right' as const }
    }

    const fromScale = scales[rel.from.table] ?? 1
    const toScale = scales[rel.to.table] ?? 1

    // Calculate table edges (not centers) to determine optimal connection sides
    const fromLeft = fromLayout.position.x
    const fromRight = fromLayout.position.x + fromLayout.dimensions.width
    const toLeft = toLayout.position.x
    const toRight = toLayout.position.x + toLayout.dimensions.width

    // Determine sides based on which connection creates shortest/cleanest path
    // If tables don't overlap horizontally, connect facing sides
    // If they do overlap, pick sides that minimize crossing
    let fromSide: 'left' | 'right'
    let toSide: 'left' | 'right'

    if (fromRight < toLeft) {
      // From table is entirely to the left of To table
      fromSide = 'right'
      toSide = 'left'
    } else if (fromLeft > toRight) {
      // From table is entirely to the right of To table
      fromSide = 'left'
      toSide = 'right'
    } else {
      // Tables overlap horizontally - use outer edges to avoid crossing
      const fromCenterX = (fromLeft + fromRight) / 2
      const toCenterX = (toLeft + toRight) / 2
      if (fromCenterX <= toCenterX) {
        fromSide = 'right'
        toSide = 'right'
      } else {
        fromSide = 'left'
        toSide = 'left'
      }
    }

    // Get connection index for curve offset
    const fromIndex = getAndIncrementCount(rel.from.table, fromSide)
    const toIndex = getAndIncrementCount(rel.to.table, toSide)

    const fromPoint = getConnectionPoint(fromLayout, rel.from.column, fromSide, fromScale, false)
    const toPoint = getConnectionPoint(toLayout, rel.to.column, toSide, toScale, true)

    // Small curve offset to separate overlapping paths
    const curveOffset = (fromIndex + toIndex) * 5

    return {
      relationship: rel,
      path: generateBezierPath(fromPoint, toPoint, fromSide, toSide, curveOffset),
      fkSide: fromSide,
    }
  })
}

// ============================================================================
// VIEWBOX CALCULATION
// ============================================================================

function calculateViewBox(tableLayouts: TableLayout[]): Dimensions {
  let maxX = 0
  let maxY = 0

  for (const layout of tableLayouts) {
    maxX = Math.max(maxX, layout.position.x + layout.dimensions.width)
    maxY = Math.max(maxY, layout.position.y + layout.dimensions.height)
  }

  return { width: maxX + PADDING, height: maxY + PADDING }
}

// ============================================================================
// LAYOUT WITH POSITION OVERRIDES
// ============================================================================

function applyPositionOverrides(
  baseLayouts: TableLayout[],
  positions: TablePositions
): TableLayout[] {
  return baseLayouts.map(layout => {
    const override = positions[layout.table.name]
    if (override) {
      return { ...layout, position: override }
    }
    return layout
  })
}

// ============================================================================
// HOOK
// ============================================================================

interface LayoutOptions {
  positions?: TablePositions
  scales?: TableScales
}

interface UseERLayoutResult {
  tables: TableLayout[]
  getLayout: (options?: LayoutOptions) => DiagramLayout
}

export function useERLayout(topology: ERTopology): UseERLayoutResult {
  // React Compiler handles memoization
  const baseLayouts = computeLayerLayout(topology)

  function getLayout(options: LayoutOptions = {}): DiagramLayout {
    const { positions = {}, scales = {} } = options
    const adjustedLayouts = applyPositionOverrides(baseLayouts, positions)
    const relationshipPaths = calculateRelationshipPaths(adjustedLayouts, topology.relationships, scales)
    const viewBox = calculateViewBox(adjustedLayouts)

    return { tables: adjustedLayouts, relationships: relationshipPaths, viewBox }
  }

  return {
    tables: baseLayouts,
    getLayout,
  }
}

export { HEADER_HEIGHT, ROW_HEIGHT, TABLE_WIDTH }
