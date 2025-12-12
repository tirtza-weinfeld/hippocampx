import type {
  ERTopology,
  DiagramLayout,
  TableLayout,
  RelationshipPath,
  DomainLayout,
  Domain,
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
const TABLE_GAP = 30
const PADDING = 40
const DOMAIN_PADDING = 20

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
// DOMAIN-CENTRIC LAYOUT
// ============================================================================

function computeDomainCentricLayout(topology: ERTopology): TableLayout[] {
  const tableMap = new Map(topology.tables.map(t => [t.name, t]))
  const layouts: TableLayout[] = []

  // Calculate domain dimensions using plugin's pre-computed positions
  interface DomainBlock {
    domain: Domain
    width: number
    height: number
    tableLayouts: Map<string, { x: number; y: number; height: number }>
  }

  const domainBlocks = new Map<string, DomainBlock>()

  for (const domain of topology.domains) {
    if (domain.tables.length === 0) continue

    // Calculate positions based on plugin's row/col assignments (2D grid)
    const tableLayouts = new Map<string, { x: number; y: number; height: number }>()
    const columns = domain.columns ?? 1

    // First pass: calculate max height per row
    const rowHeights = new Map<number, number>()
    for (const tableName of domain.tables) {
      const table = tableMap.get(tableName)
      if (!table) continue

      const pos = domain.tablePositions?.[tableName] ?? { row: 0, col: 0 }
      const dimensions = calculateTableDimensions(table)
      rowHeights.set(pos.row, Math.max(rowHeights.get(pos.row) ?? 0, dimensions.height))
    }

    // Calculate cumulative Y positions per row
    const rowY = new Map<number, number>()
    let cumY = 0
    const maxRow = Math.max(...rowHeights.keys(), 0)
    for (let r = 0; r <= maxRow; r++) {
      rowY.set(r, cumY)
      cumY += (rowHeights.get(r) ?? 0) + TABLE_GAP
    }

    // Second pass: position tables
    for (const tableName of domain.tables) {
      const table = tableMap.get(tableName)
      if (!table) continue

      const pos = domain.tablePositions?.[tableName] ?? { row: 0, col: 0 }
      const dimensions = calculateTableDimensions(table)
      const x = pos.col * (TABLE_WIDTH + TABLE_GAP)
      const y = rowY.get(pos.row) ?? 0

      tableLayouts.set(tableName, { x, y, height: dimensions.height })
    }

    const totalHeight = cumY > 0 ? cumY - TABLE_GAP : 0
    const blockWidth = columns * TABLE_WIDTH + (columns - 1) * TABLE_GAP

    domainBlocks.set(domain.name, {
      domain,
      width: blockWidth + DOMAIN_PADDING * 2,
      height: totalHeight + DOMAIN_PADDING * 2,
      tableLayouts,
    })
  }

  // Use plugin's computed domain grid positions
  const domainGrid = topology.domainGrid ?? {}
  const DOMAIN_GAP = 60

  // Calculate row heights and column widths based on actual domain sizes
  const rowHeights = new Map<number, number>()
  const colWidths = new Map<number, number>()

  for (const [domainName, block] of domainBlocks) {
    const gridPos = domainGrid[domainName] ?? { row: 0, col: 0 }
    rowHeights.set(gridPos.row, Math.max(rowHeights.get(gridPos.row) ?? 0, block.height))
    colWidths.set(gridPos.col, Math.max(colWidths.get(gridPos.col) ?? 0, block.width))
  }

  // Calculate cumulative positions
  const rowY = new Map<number, number>()
  const colX = new Map<number, number>()

  let cumY = PADDING
  for (let r = 0; r <= Math.max(...rowHeights.keys(), 0); r++) {
    rowY.set(r, cumY)
    cumY += (rowHeights.get(r) ?? 0) + DOMAIN_GAP
  }

  let cumX = PADDING
  for (let c = 0; c <= Math.max(...colWidths.keys(), 0); c++) {
    colX.set(c, cumX)
    cumX += (colWidths.get(c) ?? 0) + DOMAIN_GAP
  }

  // Position domains using grid
  for (const [domainName, block] of domainBlocks) {
    const gridPos = domainGrid[domainName] ?? { row: 0, col: 0 }
    const domainX = colX.get(gridPos.col) ?? PADDING
    const domainY = rowY.get(gridPos.row) ?? PADDING

    for (const tableName of block.domain.tables) {
      const table = tableMap.get(tableName)
      const localPos = block.tableLayouts.get(tableName)
      if (!table || !localPos) continue

      layouts.push({
        table,
        position: {
          x: domainX + DOMAIN_PADDING + localPos.x,
          y: domainY + DOMAIN_PADDING + localPos.y,
        },
        dimensions: calculateTableDimensions(table),
      })
    }
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

  const tableHeight = HEADER_HEIGHT + layout.table.columns.length * ROW_HEIGHT
  const centerX = layout.position.x + layout.dimensions.width / 2
  const centerY = layout.position.y + tableHeight / 2

  const scaledWidth = layout.dimensions.width * scale
  const relativeY = HEADER_HEIGHT + rowOffset * ROW_HEIGHT + ROW_HEIGHT / 2 - tableHeight / 2
  const scaledRelativeY = relativeY * scale

  const FK_MARKER_OFFSET = 16
  const PK_MARKER_OFFSET = 14
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
  const separation = Math.min(curveOffset, 15)
  const fromDir = fromSide === 'right' ? 1 : -1
  const toDir = toSide === 'left' ? -1 : 1

  if (fromSide === toSide) {
    const curveOut = Math.min(40, Math.abs(dy) * 0.15) + separation
    return `M ${from.x} ${from.y} C ${from.x + fromDir * curveOut} ${from.y}, ${to.x + fromDir * curveOut} ${to.y}, ${to.x} ${to.y}`
  }

  const controlDist = Math.min(Math.abs(dx) * 0.35, 50) + separation
  return `M ${from.x} ${from.y} C ${from.x + fromDir * controlDist} ${from.y + separation * 0.2}, ${to.x + toDir * controlDist} ${to.y - separation * 0.2}, ${to.x} ${to.y}`
}

function calculateRelationshipPaths(
  tableLayouts: TableLayout[],
  relationships: ERTopology['relationships'],
  scales: TableScales = {}
): RelationshipPath[] {
  const layoutMap = new Map(tableLayouts.map(tl => [tl.table.name, tl]))
  const connectionCounts = new Map<string, number>()

  function getAndIncrementCount(table: string, side: 'left' | 'right'): number {
    const key = `${table}-${side}`
    const count = connectionCounts.get(key) ?? 0
    connectionCounts.set(key, count + 1)
    return count
  }

  const paths: RelationshipPath[] = []

  // Generate independent path for each relationship (no trunk routing)
  for (const rel of relationships) {
    const fromLayout = layoutMap.get(rel.from.table)
    const toLayout = layoutMap.get(rel.to.table)

    if (!fromLayout || !toLayout) {
      paths.push({ relationship: rel, path: '', fkSide: 'right' as const })
      continue
    }

    const fromScale = scales[rel.from.table] ?? 1
    const toScale = scales[rel.to.table] ?? 1

    const fromLeft = fromLayout.position.x
    const fromRight = fromLayout.position.x + fromLayout.dimensions.width
    const toLeft = toLayout.position.x
    const toRight = toLayout.position.x + toLayout.dimensions.width

    let fromSide: 'left' | 'right'
    let toSide: 'left' | 'right'

    if (fromRight < toLeft) {
      fromSide = 'right'
      toSide = 'left'
    } else if (fromLeft > toRight) {
      fromSide = 'left'
      toSide = 'right'
    } else {
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

    const fromIndex = getAndIncrementCount(rel.from.table, fromSide)
    const toIndex = getAndIncrementCount(rel.to.table, toSide)
    const fromPoint = getConnectionPoint(fromLayout, rel.from.column, fromSide, fromScale, false)
    const toPoint = getConnectionPoint(toLayout, rel.to.column, toSide, toScale, true)

    // Each connection gets its own independent curved path
    // Offset curves slightly to avoid overlap when multiple lines use same edge
    const curveOffset = (fromIndex + toIndex) * 5

    paths.push({
      relationship: rel,
      path: generateBezierPath(fromPoint, toPoint, fromSide, toSide, curveOffset),
      fkSide: fromSide,
    })
  }

  return paths
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
// DOMAIN BOUNDS (visual grouping overlay)
// ============================================================================

function computeDomainLayouts(
  topology: ERTopology,
  tableLayouts: TableLayout[]
): DomainLayout[] {
  const layoutMap = new Map(tableLayouts.map(tl => [tl.table.name, tl]))

  return topology.domains.map((domain: Domain, index: number) => {
    const domainTableLayouts = domain.tables
      .map((name: string) => layoutMap.get(name))
      .filter((tl): tl is TableLayout => tl !== undefined)

    if (domainTableLayouts.length === 0) {
      return {
        domain,
        bounds: { x: 0, y: 0, width: 0, height: 0 },
        colorIndex: index,
      }
    }

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const tl of domainTableLayouts) {
      minX = Math.min(minX, tl.position.x)
      minY = Math.min(minY, tl.position.y)
      maxX = Math.max(maxX, tl.position.x + tl.dimensions.width)
      maxY = Math.max(maxY, tl.position.y + tl.dimensions.height)
    }

    return {
      domain,
      bounds: {
        x: minX - DOMAIN_PADDING,
        y: minY - DOMAIN_PADDING,
        width: maxX - minX + DOMAIN_PADDING * 2,
        height: maxY - minY + DOMAIN_PADDING * 2,
      },
      colorIndex: index,
    }
  })
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
  const baseLayouts = computeDomainCentricLayout(topology)

  function getLayout(options: LayoutOptions = {}): DiagramLayout {
    const { positions = {}, scales = {} } = options

    // Apply table-level overrides
    const adjustedLayouts = applyPositionOverrides(baseLayouts, positions)

    const relationshipPaths = calculateRelationshipPaths(adjustedLayouts, topology.relationships, scales)
    const domainLayouts = computeDomainLayouts(topology, adjustedLayouts)
    const viewBox = calculateViewBox(adjustedLayouts)

    return { tables: adjustedLayouts, relationships: relationshipPaths, domains: domainLayouts, viewBox }
  }

  return {
    tables: baseLayouts,
    getLayout,
  }
}

export { HEADER_HEIGHT, ROW_HEIGHT, TABLE_WIDTH }
