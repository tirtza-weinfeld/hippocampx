/**
 * ER Diagram Layout Algorithm
 *
 * Computes optimal table positions within domains and domain positions in the grid.
 * Goals:
 * - Minimize relationship line lengths
 * - Hub tables (most referenced) centered with dependents around them
 * - Cross-domain connections kept short
 * - Tables with external FKs positioned at domain edges facing connected domains
 */

interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
}

interface TablePosition {
  row: number
  col: number
}

interface Domain {
  name: string
  tables: string[]
  tablePositions: Record<string, TablePosition>
  columns: number
}

interface DomainGridPosition {
  row: number
  col: number
}

interface LayoutResult {
  domainGrid: Map<string, DomainGridPosition>
  domainOrder: string[]
}

// Direction relative to a reference point
type Direction = 'left' | 'right' | 'above' | 'below'

interface TableConnectionInfo {
  table: string
  internalConnections: string[]      // Tables in same domain this connects to
  externalConnections: Array<{       // Connections to other domains
    table: string
    domain: string
    direction: Direction             // Direction of target domain relative to this domain
  }>
}

// ============================================================================
// CONNECTION ANALYSIS
// ============================================================================

function buildConnectionMaps(relationships: Relationship[]): {
  incomingFKs: Map<string, string[]>
  outgoingFKs: Map<string, string[]>
} {
  const incomingFKs = new Map<string, string[]>()
  const outgoingFKs = new Map<string, string[]>()

  for (const rel of relationships) {
    const existing = incomingFKs.get(rel.to.table) ?? []
    incomingFKs.set(rel.to.table, [...existing, rel.from.table])

    const outgoing = outgoingFKs.get(rel.from.table) ?? []
    outgoingFKs.set(rel.from.table, [...outgoing, rel.to.table])
  }

  return { incomingFKs, outgoingFKs }
}

// ============================================================================
// INTERNAL DOMAIN LAYOUT
// ============================================================================

/**
 * Compute direction from one domain to another based on grid positions.
 */
function getDirectionBetweenDomains(
  fromPos: DomainGridPosition,
  toPos: DomainGridPosition
): Direction {
  const rowDiff = toPos.row - fromPos.row
  const colDiff = toPos.col - fromPos.col

  // Prioritize the dominant direction
  if (Math.abs(rowDiff) > Math.abs(colDiff)) {
    return rowDiff > 0 ? 'below' : 'above'
  }
  return colDiff > 0 ? 'right' : 'left'
}

/**
 * Analyze external connections for tables in a domain.
 * Tracks both OUTGOING (FK points out) and INCOMING (FK points in) connections.
 * Tables with external connections should be at domain edges for shorter lines.
 */
function analyzeExternalConnections(
  domain: Domain,
  relationships: Relationship[],
  tableToDomain: Map<string, string>,
  domainGrid: Map<string, DomainGridPosition>
): Map<string, TableConnectionInfo> {
  const tableSet = new Set(domain.tables)
  const result = new Map<string, TableConnectionInfo>()
  const domainPos = domainGrid.get(domain.name) ?? { row: 0, col: 0 }

  // Initialize all tables
  for (const table of domain.tables) {
    result.set(table, {
      table,
      internalConnections: [],
      externalConnections: [],
    })
  }

  // Analyze all relationships
  for (const rel of relationships) {
    const fromInDomain = tableSet.has(rel.from.table)
    const toInDomain = tableSet.has(rel.to.table)

    if (fromInDomain) {
      const info = result.get(rel.from.table)
      if (!info) continue
      if (toInDomain) {
        // Internal connection
        info.internalConnections.push(rel.to.table)
      } else {
        // OUTGOING: this table has FK pointing to another domain
        const targetDomain = tableToDomain.get(rel.to.table)
        if (targetDomain !== undefined) {
          const targetPos = domainGrid.get(targetDomain) ?? { row: 0, col: 0 }
          info.externalConnections.push({
            table: rel.to.table,
            domain: targetDomain,
            direction: getDirectionBetweenDomains(domainPos, targetPos),
          })
        }
      }
    }

    if (toInDomain && !fromInDomain) {
      // INCOMING: this table receives FK from another domain
      const info = result.get(rel.to.table)
      if (!info) continue
      const sourceDomain = tableToDomain.get(rel.from.table)
      if (sourceDomain !== undefined) {
        const sourcePos = domainGrid.get(sourceDomain) ?? { row: 0, col: 0 }
        info.externalConnections.push({
          table: rel.from.table,
          domain: sourceDomain,
          direction: getDirectionBetweenDomains(domainPos, sourcePos),
        })
      }
    }
  }

  return result
}

/**
 * Get all directions from external connections (not just dominant).
 * Returns set of directions this table connects to.
 */
function getExternalDirections(
  connections: TableConnectionInfo['externalConnections']
): Set<Direction> {
  const directions = new Set<Direction>()
  for (const conn of connections) {
    directions.add(conn.direction)
  }
  return directions
}

/**
 * Sort tables by their connectivity distance from hub.
 * Tables directly connected to hub come first.
 */
function sortByHubDistance(
  tables: string[],
  hubTable: string,
  incomingFKs: Map<string, string[]>,
  outgoingFKs: Map<string, string[]>
): string[] {
  // Direct connections to hub (either direction)
  const hubIncoming = incomingFKs.get(hubTable) ?? []
  const hubOutgoing = outgoingFKs.get(hubTable) ?? []
  const directlyConnected = new Set([...hubIncoming, ...hubOutgoing])

  // Sort: directly connected first, then others
  return [...tables].sort((a, b) => {
    const aDirectly = directlyConnected.has(a) ? 0 : 1
    const bDirectly = directlyConnected.has(b) ? 0 : 1
    return aDirectly - bDirectly
  })
}

/**
 * Compute table positions within each domain.
 *
 * OPTIMAL LAYOUT STRATEGY:
 * 1. Analyze where external connections point (which edges need interface tables)
 * 2. Position hub OPPOSITE to external connection edges (minimizes crossing)
 * 3. Place interface tables at edges facing their connected domains
 * 4. Fill internal tables around hub, sorted by connectivity
 *
 * Example: If external connections go RIGHT and BOTTOM,
 * hub goes TOP-LEFT, interfaces at right/bottom edges.
 */
function computeInternalDomainLayouts(
  domains: Domain[],
  relationships: Relationship[],
  domainGrid: Map<string, DomainGridPosition>
): void {
  const { incomingFKs, outgoingFKs } = buildConnectionMaps(relationships)

  // Build table -> domain lookup
  const tableToDomain = new Map<string, string>()
  for (const domain of domains) {
    for (const table of domain.tables) {
      tableToDomain.set(table, domain.name)
    }
  }

  for (const domain of domains) {
    if (domain.tables.length === 0) continue

    const tableSet = new Set(domain.tables)

    // Find hub table within domain (most internal incoming FKs)
    let hubTable: string | null = null
    let maxIncoming = 0

    for (const table of domain.tables) {
      const internalIncoming = (incomingFKs.get(table) ?? []).filter(t => tableSet.has(t)).length
      if (internalIncoming > maxIncoming) {
        maxIncoming = internalIncoming
        hubTable = table
      }
    }

    if (hubTable === null) {
      hubTable = domain.tables[0]
    }

    // Analyze external connections for ALL tables (including hub)
    const connectionInfo = analyzeExternalConnections(
      domain,
      relationships,
      tableToDomain,
      domainGrid
    )

    // Collect ALL external directions across all tables in this domain
    const allExternalDirections = new Set<Direction>()
    const interfaceTables = new Map<string, Set<Direction>>() // table -> directions

    for (const table of domain.tables) {
      const info = connectionInfo.get(table)
      if (!info) continue
      const directions = getExternalDirections(info.externalConnections)

      if (directions.size > 0) {
        interfaceTables.set(table, directions)
        for (const dir of directions) {
          allExternalDirections.add(dir)
        }
      }
    }

    // Determine optimal hub position based on WHERE external connections go
    // Hub should be OPPOSITE to external edges to minimize line crossings
    const hasRight = allExternalDirections.has('right')
    const hasLeft = allExternalDirections.has('left')
    const hasAbove = allExternalDirections.has('above')
    const hasBelow = allExternalDirections.has('below')

    // Calculate grid size
    const totalTables = domain.tables.length
    const gridCols = Math.max(2, Math.ceil(Math.sqrt(totalTables * 1.5)))
    const gridRows = Math.max(2, Math.ceil(totalTables / gridCols))

    // Determine hub row: if external below, hub at top; if above, hub at bottom; else center
    let hubRow: number
    if (hasBelow && !hasAbove) {
      hubRow = 0 // Top
    } else if (hasAbove && !hasBelow) {
      hubRow = gridRows - 1 // Bottom
    } else {
      hubRow = Math.floor(gridRows / 2) // Center
    }

    // Determine hub col: if external right, hub at left; if left, hub at right; else center
    let hubCol: number
    if (hasRight && !hasLeft) {
      hubCol = 0 // Left
    } else if (hasLeft && !hasRight) {
      hubCol = gridCols - 1 // Right
    } else {
      hubCol = Math.floor(gridCols / 2) // Center
    }

    const positions: Record<string, TablePosition> = {}

    // Check if hub itself is an interface table
    const hubDirections = interfaceTables.get(hubTable)
    if (hubDirections !== undefined && hubDirections.size > 0) {
      // Hub has external connections - position at edge but still central on that edge
      if (hubDirections.has('right')) {
        hubCol = gridCols - 1
      } else if (hubDirections.has('left')) {
        hubCol = 0
      }
      if (hubDirections.has('below')) {
        hubRow = gridRows - 1
      } else if (hubDirections.has('above')) {
        hubRow = 0
      }
    }

    positions[hubTable] = { row: hubRow, col: hubCol }

    // Categorize non-hub tables
    const leftEdge: string[] = []
    const rightEdge: string[] = []
    const topEdge: string[] = []
    const bottomEdge: string[] = []
    const internalOnlyTables: string[] = []

    for (const table of domain.tables) {
      if (table === hubTable) continue

      const directions = interfaceTables.get(table)
      if (directions === undefined || directions.size === 0) {
        internalOnlyTables.push(table)
      } else {
        // Assign to edge based on primary direction
        // Priority: horizontal (left/right) over vertical for better visual flow
        if (directions.has('left')) {
          leftEdge.push(table)
        } else if (directions.has('right')) {
          rightEdge.push(table)
        } else if (directions.has('above')) {
          topEdge.push(table)
        } else if (directions.has('below')) {
          bottomEdge.push(table)
        }
      }
    }

    const occupiedPositions = new Set<string>()
    occupiedPositions.add(`${hubRow},${hubCol}`)

    // Helper to find best position on an edge
    const placeOnEdge = (tables: string[], edge: 'left' | 'right' | 'top' | 'bottom') => {
      for (const table of tables) {
        let bestPos: { row: number; col: number } | null = null
        let bestDist = Infinity

        // Generate candidate positions on this edge
        const candidates: Array<{ row: number; col: number }> = []
        if (edge === 'left') {
          for (let r = 0; r < gridRows; r++) candidates.push({ row: r, col: 0 })
        } else if (edge === 'right') {
          for (let r = 0; r < gridRows; r++) candidates.push({ row: r, col: gridCols - 1 })
        } else if (edge === 'top') {
          for (let c = 0; c < gridCols; c++) candidates.push({ row: 0, col: c })
        } else {
          for (let c = 0; c < gridCols; c++) candidates.push({ row: gridRows - 1, col: c })
        }

        // Find unoccupied position closest to hub
        for (const pos of candidates) {
          const key = `${pos.row},${pos.col}`
          if (!occupiedPositions.has(key)) {
            const dist = Math.abs(pos.row - hubRow) + Math.abs(pos.col - hubCol)
            if (dist < bestDist) {
              bestDist = dist
              bestPos = pos
            }
          }
        }

        if (bestPos !== null) {
          positions[table] = bestPos
          occupiedPositions.add(`${bestPos.row},${bestPos.col}`)
        }
      }
    }

    // Place interface tables at their respective edges
    placeOnEdge(leftEdge, 'left')
    placeOnEdge(rightEdge, 'right')
    placeOnEdge(topEdge, 'top')
    placeOnEdge(bottomEdge, 'bottom')

    // Sort internal tables by connectivity to hub
    const sortedInternals = sortByHubDistance(internalOnlyTables, hubTable, incomingFKs, outgoingFKs)

    // Place internal tables in positions closest to hub
    const availablePositions: Array<{ row: number; col: number; dist: number }> = []
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const key = `${r},${c}`
        if (!occupiedPositions.has(key)) {
          const dist = Math.abs(r - hubRow) + Math.abs(c - hubCol)
          availablePositions.push({ row: r, col: c, dist })
        }
      }
    }
    availablePositions.sort((a, b) => a.dist - b.dist)

    sortedInternals.forEach((table, idx) => {
      if (idx < availablePositions.length) {
        const pos = availablePositions[idx]
        positions[table] = { row: pos.row, col: pos.col }
        occupiedPositions.add(`${pos.row},${pos.col}`)
      }
    })

    // Normalize positions (shift to start at 0,0)
    const usedRows = Object.values(positions).map(p => p.row)
    const usedCols = Object.values(positions).map(p => p.col)
    const minRow = Math.min(...usedRows)
    const minCol = Math.min(...usedCols)

    for (const pos of Object.values(positions)) {
      pos.row -= minRow
      pos.col -= minCol
    }

    // Calculate domain dimensions
    const maxCol = Math.max(...Object.values(positions).map(p => p.col), 0)
    domain.columns = maxCol + 1
    domain.tablePositions = positions
  }
}

// ============================================================================
// DOMAIN GRID POSITIONING
// ============================================================================

/**
 * Compute optimal domain positions in a 2D grid.
 * Strategy: Hub domain (most cross-domain connections) at top-left,
 * connected domains placed adjacent to minimize line lengths.
 */
function computeDomainGrid(
  domains: Domain[],
  relationships: Relationship[]
): LayoutResult {
  // Build table -> domain lookup
  const tableToDomain = new Map<string, string>()
  for (const domain of domains) {
    for (const table of domain.tables) {
      tableToDomain.set(table, domain.name)
    }
  }

  // Count cross-domain connections
  const domainIncoming = new Map<string, number>()
  const domainConnectsTo = new Map<string, Set<string>>()

  for (const domain of domains) {
    domainIncoming.set(domain.name, 0)
    domainConnectsTo.set(domain.name, new Set())
  }

  for (const rel of relationships) {
    const fromDomain = tableToDomain.get(rel.from.table)
    const toDomain = tableToDomain.get(rel.to.table)

    if (fromDomain !== undefined && toDomain !== undefined && fromDomain !== toDomain) {
      domainIncoming.set(toDomain, (domainIncoming.get(toDomain) ?? 0) + 1)
      domainConnectsTo.get(fromDomain)?.add(toDomain)
      domainConnectsTo.get(toDomain)?.add(fromDomain)
    }
  }

  // Find the hub domain (most incoming connections)
  const domainNames = domains.map(d => d.name)
  let hubDomain = domainNames[0]
  let maxIncoming = 0
  for (const [name, count] of domainIncoming) {
    if (count > maxIncoming) {
      maxIncoming = count
      hubDomain = name
    }
  }

  // Build optimal grid: hub at (0,0), connected domains adjacent
  const grid = new Map<string, DomainGridPosition>()
  const placed = new Set<string>()

  // Place hub at top-left
  grid.set(hubDomain, { row: 0, col: 0 })
  placed.add(hubDomain)

  // Get domains connected to hub, sorted by connection count
  const connectedToHub = [...(domainConnectsTo.get(hubDomain) ?? [])]
    .filter(d => !placed.has(d))

  // Place first connected domain at (0,1) - right of hub
  if (connectedToHub.length > 0) {
    grid.set(connectedToHub[0], { row: 0, col: 1 })
    placed.add(connectedToHub[0])
  }

  // Place second connected domain at (1,0) - below hub
  if (connectedToHub.length > 1) {
    grid.set(connectedToHub[1], { row: 1, col: 0 })
    placed.add(connectedToHub[1])
  }

  // Place remaining domains
  const remaining = domainNames.filter(d => !placed.has(d))
  for (const domain of remaining) {
    const connectedDomains = [...(domainConnectsTo.get(domain) ?? [])]
      .filter(d => placed.has(d))

    if (connectedDomains.length > 0) {
      // Find average position of connected domains
      let avgRow = 0
      let avgCol = 0
      for (const cd of connectedDomains) {
        const pos = grid.get(cd)
        if (!pos) continue
        avgRow += pos.row
        avgCol += pos.col
      }
      avgRow /= connectedDomains.length
      avgCol /= connectedDomains.length

      // Place in nearest available spot
      const targetRow = Math.round(avgRow)
      const targetCol = Math.round(avgCol)

      const candidates = [
        { row: targetRow, col: targetCol + 1 },
        { row: targetRow + 1, col: targetCol },
        { row: targetRow + 1, col: targetCol + 1 },
        { row: targetRow, col: targetCol },
      ]

      for (const pos of candidates) {
        const occupied = [...grid.values()].some(p => p.row === pos.row && p.col === pos.col)
        if (!occupied && pos.row >= 0 && pos.col >= 0) {
          grid.set(domain, pos)
          placed.add(domain)
          break
        }
      }
    }

    // Fallback: place in next available grid position
    if (!placed.has(domain)) {
      const maxRow = Math.max(...[...grid.values()].map(p => p.row), 0)
      grid.set(domain, { row: maxRow + 1, col: 0 })
      placed.add(domain)
    }
  }

  // Build order from grid (row-major order)
  const order = [...grid.entries()]
    .sort((a, b) => a[1].row * 10 + a[1].col - (b[1].row * 10 + b[1].col))
    .map(([name]) => name)

  return { domainGrid: grid, domainOrder: order }
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

export function computeERLayout(
  domains: Domain[],
  relationships: Relationship[]
): {
  domainGrid: Record<string, DomainGridPosition>
  domainOrder: string[]
} {
  // Compute domain grid positions first (needed for direction analysis)
  const { domainGrid, domainOrder } = computeDomainGrid(domains, relationships)

  // Compute internal table positions within each domain
  // Pass domainGrid so we can position tables at edges facing connected domains
  computeInternalDomainLayouts(domains, relationships, domainGrid)

  // Convert grid Map to Record
  const gridRecord: Record<string, DomainGridPosition> = {}
  for (const [name, pos] of domainGrid) {
    gridRecord[name] = pos
  }

  return { domainGrid: gridRecord, domainOrder }
}

export type { Domain, Relationship, TablePosition, DomainGridPosition }
