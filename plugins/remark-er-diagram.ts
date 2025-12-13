import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { Code, Parent } from 'mdast'
import { computeERLayout } from './er-layout-algorithm.js'

/**
 * Remark plugin that transforms `erDiagram` code blocks into ERDiagram components.
 *
 * Parses SQL-like ER diagram syntax, computes layout at BUILD TIME,
 * and creates interactive diagram components with pre-computed positions.
 *
 * @example
 * Input MDX:
 * ```erDiagram
 * users
 *   id    int     PK
 *   name  varchar
 *
 * posts
 *   id       int  PK
 *   user_id  int  FK(users.id)
 *   title    varchar
 * ```
 *
 * Output:
 * <ERDiagram layout={...preComputedLayout} />
 */

// ============================================================================
// TYPES
// ============================================================================

type Constraint = 'PK' | 'FK' | 'UK'

interface ForeignKey {
  table: string
  column: string
}

interface Column {
  name: string
  type: string
  constraints: Constraint[]
  foreignKey?: ForeignKey
  comment?: string
  example?: string
}

interface Table {
  name: string
  columns: Column[]
  domain?: string
}

interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
}

interface ERSchema {
  tables: Table[]
  relationships: Relationship[]
}

// ============================================================================
// TOPOLOGY TYPES (what plugin outputs)
// ============================================================================

interface TableMetrics {
  columnCount: number
  incomingFKs: number   // How many tables reference this one
  outgoingFKs: number   // How many tables this one references
  isPrimaryHub: boolean // High connectivity = layout priority
}

interface Cluster {
  id: string
  tables: string[]      // Table names in this cluster
  root: string          // Most referenced table in cluster
}

interface TablePosition {
  row: number
  col: number
}

interface Domain {
  name: string
  tables: string[]
  // Internal layout computed by plugin
  tablePositions: Record<string, TablePosition>
  columns: number // how many columns in this domain's layout
}

interface DomainConnection {
  from: string  // domain name
  to: string    // domain name
  count: number // number of FK connections
}

interface DomainGridPosition {
  row: number
  col: number
}

interface ERTopology {
  tables: Table[]
  relationships: Relationship[]
  metrics: Record<string, TableMetrics>
  layers: string[][]    // Topologically sorted: [[roots], [level1], [level2], ...]
  clusters: Cluster[]   // Groups of interconnected tables
  domains: Domain[]     // Named groupings from --- DOMAIN --- syntax
  domainConnections: DomainConnection[] // Cross-domain FK connections
  domainOrder: string[] // Optimal domain order for layout (hub domains first)
  domainGrid: Record<string, DomainGridPosition> // Grid positions for domain layout
}

// ============================================================================
// PARSER
// ============================================================================

const FK_REGEX = /FK\((\w+)\.(\w+)\)/
const DOMAIN_REGEX = /^---\s*(.+?)\s*---$/

function parseConstraints(constraintString: string): {
  constraints: Constraint[]
  foreignKey?: ForeignKey
} {
  const constraints: Constraint[] = []
  let foreignKey: ForeignKey | undefined

  const parts = constraintString.trim().split(/\s+/)

  for (const part of parts) {
    if (part === 'PK') {
      constraints.push('PK')
    } else if (part === 'UK') {
      constraints.push('UK')
    } else if (part.startsWith('FK(')) {
      constraints.push('FK')
      const match = FK_REGEX.exec(part)
      if (match !== null) {
        foreignKey = { table: match[1], column: match[2] }
      }
    }
  }

  return { constraints, foreignKey }
}

function parseColumnMetadata(metadataString: string): { comment?: string; example?: string } {
  const trimmed = metadataString.trim()
  if (trimmed === '') return {}

  // Split at | to separate description from example
  const pipeIndex = trimmed.indexOf('|')

  if (pipeIndex === -1) {
    // No pipe - entire string is the comment
    return { comment: trimmed }
  }

  const comment = trimmed.slice(0, pipeIndex).trim()
  const example = trimmed.slice(pipeIndex + 1).trim()

  return {
    comment: comment !== '' ? comment : undefined,
    example: example !== '' ? example : undefined,
  }
}

function parseColumn(line: string): Column | null {
  // Column format: name type [constraints...] [// description | example]
  // Must be indented (starts with whitespace)
  if (!(/^\s+/).test(line)) return null

  let trimmed = line.trim()
  if (trimmed === '') return null

  // Extract metadata (comment and example) if present
  let comment: string | undefined
  let example: string | undefined

  const commentIndex = trimmed.indexOf('//')
  if (commentIndex !== -1) {
    const metadataString = trimmed.slice(commentIndex + 2)
    const metadata = parseColumnMetadata(metadataString)
    comment = metadata.comment
    example = metadata.example
    trimmed = trimmed.slice(0, commentIndex).trim()
  }

  // Split by whitespace, first is name, second is type, rest are constraints
  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) return null

  const [name, type, ...rest] = parts
  const constraintString = rest.join(' ')

  const { constraints, foreignKey } = parseConstraints(constraintString)

  return { name, type, constraints, foreignKey, comment, example }
}

function parseTableBlock(block: string): Table | null {
  const lines = block.split('\n').filter(line => line.trim() !== '')
  if (lines.length === 0) return null

  // First non-indented line is the table name
  const tableNameLine = lines.find(line => !(/^\s/).test(line))
  if (tableNameLine === undefined) return null

  const tableName = tableNameLine.trim()
  const columns: Column[] = []

  for (const line of lines) {
    const column = parseColumn(line)
    if (column !== null) {
      columns.push(column)
    }
  }

  if (columns.length === 0) return null

  return { name: tableName, columns }
}

function extractRelationships(tables: Table[]): Relationship[] {
  const relationships: Relationship[] = []

  for (const table of tables) {
    for (const column of table.columns) {
      if (column.foreignKey !== undefined) {
        relationships.push({
          from: { table: table.name, column: column.name },
          to: { table: column.foreignKey.table, column: column.foreignKey.column },
        })
      }
    }
  }

  return relationships
}

interface ERSchema {
  tables: Table[]
  relationships: Relationship[]
  domains: Domain[]
}

function parseERDiagram(content: string): ERSchema {
  const lines = content.split('\n')
  const tables: Table[] = []
  const domains: Domain[] = []

  let currentDomain: string | undefined
  let currentBlock: string[] = []

  function flushBlock() {
    if (currentBlock.length === 0) return
    const blockContent = currentBlock.join('\n')
    const table = parseTableBlock(blockContent)
    if (table !== null) {
      table.domain = currentDomain
      tables.push(table)

      // Add table to current domain
      if (currentDomain !== undefined) {
        const domain = domains.find(d => d.name === currentDomain)
        if (domain !== undefined) {
          domain.tables.push(table.name)
        }
      }
    }
    currentBlock = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Check for domain header
    const domainMatch = DOMAIN_REGEX.exec(trimmed)
    if (domainMatch !== null) {
      flushBlock()
      currentDomain = domainMatch[1]
      domains.push({ name: currentDomain, tables: [], tablePositions: {}, columns: 1 })
      continue
    }

    // Check for blank line (table separator)
    if (trimmed === '') {
      flushBlock()
      continue
    }

    currentBlock.push(line)
  }

  // Flush any remaining block
  flushBlock()

  const relationships = extractRelationships(tables)

  return { tables, relationships, domains }
}

// Layout algorithm moved to er-layout-algorithm.ts

// ============================================================================
// GRAPH ANALYSIS (build-time computation)
// ============================================================================

function computeTableMetrics(
  tables: Table[],
  relationships: Relationship[]
): Record<string, TableMetrics> {
  const metrics: Record<string, TableMetrics> = {}

  // Initialize metrics for all tables
  for (const table of tables) {
    metrics[table.name] = {
      columnCount: table.columns.length,
      incomingFKs: 0,
      outgoingFKs: 0,
      isPrimaryHub: false,
    }
  }

  // Count FK relationships
  for (const rel of relationships) {
    metrics[rel.from.table].outgoingFKs++
    metrics[rel.to.table].incomingFKs++
  }

  // Mark primary hubs (tables with high incoming references)
  const avgIncoming =
    Object.values(metrics).reduce((sum, m) => sum + m.incomingFKs, 0) / tables.length

  for (const metric of Object.values(metrics)) {
    metric.isPrimaryHub = metric.incomingFKs > avgIncoming * 1.5
  }

  return metrics
}

function computeLayers(
  tables: Table[],
  relationships: Relationship[]
): string[][] {
  const tableNames = new Set(tables.map(t => t.name))
  const inDegree: Record<string, number> = {}
  const adjacency: Record<string, string[]> = {}

  // Initialize
  for (const name of tableNames) {
    inDegree[name] = 0
    adjacency[name] = []
  }

  // Build graph (FK target → FK source direction for topological sort)
  // Tables with no incoming FKs are "roots" (referenced by others)
  for (const rel of relationships) {
    if (tableNames.has(rel.from.table) && tableNames.has(rel.to.table)) {
      adjacency[rel.to.table].push(rel.from.table)
      inDegree[rel.from.table]++
    }
  }

  const layers: string[][] = []
  const remaining = new Set(tableNames)

  // Kahn's algorithm for topological layers
  while (remaining.size > 0) {
    const layer: string[] = []

    for (const name of remaining) {
      if (inDegree[name] === 0) {
        layer.push(name)
      }
    }

    // Handle cycles: if no zero in-degree nodes, pick remaining
    if (layer.length === 0) {
      layer.push(...remaining)
      remaining.clear()
    } else {
      for (const name of layer) {
        remaining.delete(name)
        for (const dependent of adjacency[name]) {
          inDegree[dependent]--
        }
      }
    }

    layers.push(layer)
  }

  return layers
}

function computeClusters(
  tables: Table[],
  relationships: Relationship[]
): Cluster[] {
  const tableNames = tables.map(t => t.name)
  const adjacency: Record<string, Set<string>> = {}

  // Build undirected adjacency (for clustering)
  for (const name of tableNames) {
    adjacency[name] = new Set()
  }

  for (const rel of relationships) {
    adjacency[rel.from.table].add(rel.to.table)
    adjacency[rel.to.table].add(rel.from.table)
  }

  // Union-Find for connected components
  const parent: Record<string, string> = {}

  function find(x: string): string {
    if (parent[x] !== x) {
      parent[x] = find(parent[x])
    }
    return parent[x]
  }

  function union(a: string, b: string): void {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA !== rootB) {
      parent[rootA] = rootB
    }
  }

  // Initialize each table as its own parent
  for (const name of tableNames) {
    parent[name] = name
  }

  // Union connected tables
  for (const rel of relationships) {
    union(rel.from.table, rel.to.table)
  }

  // Group by root
  const clusterMap = new Map<string, string[]>()
  for (const name of tableNames) {
    const root = find(name)
    const existing = clusterMap.get(root)
    if (existing === undefined) {
      clusterMap.set(root, [name])
    } else {
      existing.push(name)
    }
  }

  // Find the most-referenced table in each cluster as root
  const incomingCount: Record<string, number> = {}
  for (const name of tableNames) {
    incomingCount[name] = 0
  }
  for (const rel of relationships) {
    incomingCount[rel.to.table]++
  }

  return [...clusterMap.values()].map((clusterTables, index) => {
    const root = clusterTables.reduce((best, name) =>
      incomingCount[name] > incomingCount[best] ? name : best
    )
    return {
      id: `cluster-${index}`,
      tables: clusterTables,
      root,
    }
  })
}

// Domain grid positioning moved to er-layout-algorithm.ts

function buildTopology(schema: ERSchema): ERTopology {
  // Use the layout algorithm to compute positions
  const { domainGrid, domainOrder } = computeERLayout(schema.domains, schema.relationships)

  // Compute domain connections for the topology output
  const connections = computeDomainConnectionsList(schema.domains, schema.relationships)

  return {
    tables: schema.tables,
    relationships: schema.relationships,
    metrics: computeTableMetrics(schema.tables, schema.relationships),
    layers: computeLayers(schema.tables, schema.relationships),
    clusters: computeClusters(schema.tables, schema.relationships),
    domains: schema.domains,
    domainConnections: connections,
    domainOrder,
    domainGrid,
  }
}

function computeDomainConnectionsList(
  domains: Domain[],
  relationships: Relationship[]
): DomainConnection[] {
  const tableToDomain = new Map<string, string>()
  for (const domain of domains) {
    for (const table of domain.tables) {
      tableToDomain.set(table, domain.name)
    }
  }

  const connectionMap = new Map<string, number>()
  for (const rel of relationships) {
    const fromDomain = tableToDomain.get(rel.from.table)
    const toDomain = tableToDomain.get(rel.to.table)

    if (fromDomain !== undefined && toDomain !== undefined && fromDomain !== toDomain) {
      const key = `${fromDomain}->${toDomain}`
      connectionMap.set(key, (connectionMap.get(key) ?? 0) + 1)
    }
  }

  const connections: DomainConnection[] = []
  for (const [key, count] of connectionMap) {
    const [from, to] = key.split('->')
    connections.push({ from, to, count })
  }

  return connections
}

// ============================================================================
// PLUGIN
// ============================================================================

const remarkERDiagram: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'code', (node: Code, index: number | undefined, parent: Parent | undefined) => {
      if (index === undefined || parent === undefined) return
      if (node.lang !== 'erDiagram') return

      // Parse and analyze at build time
      const schema = parseERDiagram(node.value)
      const topology = buildTopology(schema)

      // Create MDX JSX element with pre-computed topology
      const erDiagramNode = {
        type: 'mdxJsxFlowElement',
        name: 'ERDiagram',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'topology',
            value: {
              type: 'mdxJsxAttributeValueExpression',
              value: JSON.stringify(topology),
              data: {
                estree: {
                  type: 'Program',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Literal',
                        value: topology,
                        raw: JSON.stringify(topology),
                      },
                    },
                  ],
                  sourceType: 'module',
                },
              },
            },
          },
        ],
        children: [],
      }

      // Replace the code block
      ;(parent.children as Node[])[index] = erDiagramNode as Node
    })
  }
}

export default remarkERDiagram
export {
  parseERDiagram,
  buildTopology,
  type ERSchema,
  type ERTopology,
  type Table,
  type Column,
  type Relationship,
  type TableMetrics,
  type Cluster,
  type Domain,
  type DomainConnection,
  type DomainGridPosition,
  type TablePosition,
  type Constraint,
  type ForeignKey,
}
