/**
 * ER Diagram Layout Algorithm
 *
 * Computes table positions and relationship paths for SVG rendering.
 * Uses dependency-aware grid layout with topological sorting.
 */

import type {
  SchemaTopology,
  SchemaLayout,
  TablePosition,
  SchemaTable,
  SchemaRelationship,
} from "./types";

// ============================================================================
// Layout Constants
// ============================================================================

export const LAYOUT = {
  TABLE_WIDTH: 200,
  COLUMN_HEIGHT: 24,
  HEADER_HEIGHT: 38,
  GAP_X: 120,
  GAP_Y: 50,
  COLUMNS: 4,
  PADDING: 80,
  EXPANDED_WIDTH: 280,
} as const;

/**
 * Calculate table width accounting for expansion state
 */
function calculateTableWidth(table: SchemaTable, expanded: boolean): number {
  if (!expanded) return LAYOUT.TABLE_WIDTH;

  const hasDescriptions = table.description || table.columns.some(col => col.description || col.example);
  if (!hasDescriptions) return LAYOUT.TABLE_WIDTH;

  return LAYOUT.TABLE_WIDTH + LAYOUT.EXPANDED_WIDTH;
}

// ============================================================================
// Topological Sort
// ============================================================================

/**
 * Sort tables by FK dependencies using Kahn's algorithm.
 * Referenced tables appear before tables that reference them.
 */
function topologicalSort(
  tables: SchemaTable[],
  relationships: SchemaRelationship[]
): string[] {
  const tableNames = new Set(tables.map(t => t.name));
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>();

  for (const name of tableNames) {
    inDegree.set(name, 0);
    graph.set(name, []);
  }

  for (const rel of relationships) {
    if (tableNames.has(rel.from.table) && tableNames.has(rel.to.table)) {
      graph.get(rel.to.table)?.push(rel.from.table);
      inDegree.set(rel.from.table, (inDegree.get(rel.from.table) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [name, degree] of inDegree) {
    if (degree === 0) {
      queue.push(name);
    }
  }

  const result: string[] = [];
  let current: string | undefined;
  while ((current = queue.shift()) !== undefined) {
    result.push(current);

    for (const neighbor of graph.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Handle cycles by adding remaining tables
  for (const name of tableNames) {
    if (!result.includes(name)) {
      result.push(name);
    }
  }

  return result;
}

// ============================================================================
// Position Calculation
// ============================================================================

/**
 * Calculate table height based on column count
 */
function calculateTableHeight(table: SchemaTable): number {
  return LAYOUT.HEADER_HEIGHT + table.columns.length * LAYOUT.COLUMN_HEIGHT + 8;
}

/**
 * Build adjacency list for tables within a schema based on relationships.
 */
function buildAdjacencyGraph(
  tableNames: Set<string>,
  relationships: SchemaRelationship[]
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const name of tableNames) {
    graph.set(name, new Set());
  }

  for (const rel of relationships) {
    if (tableNames.has(rel.from.table) && tableNames.has(rel.to.table)) {
      graph.get(rel.from.table)?.add(rel.to.table);
      graph.get(rel.to.table)?.add(rel.from.table);
    }
  }

  return graph;
}

/**
 * Find connected components using Union-Find.
 */
function findConnectedComponents(
  tableNames: string[],
  adjacency: Map<string, Set<string>>
): string[][] {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();

  // Initialize
  for (const name of tableNames) {
    parent.set(name, name);
    rank.set(name, 0);
  }

  function find(x: string): string {
    const parentX = parent.get(x);
    if (parentX !== undefined && parentX !== x) {
      parent.set(x, find(parentX));
    }
    return parent.get(x) ?? x;
  }

  function union(x: string, y: string) {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX === rootY) return;

    const rankX = rank.get(rootX) ?? 0;
    const rankY = rank.get(rootY) ?? 0;

    if (rankX < rankY) {
      parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      parent.set(rootY, rootX);
    } else {
      parent.set(rootY, rootX);
      rank.set(rootX, rankX + 1);
    }
  }

  // Union connected tables
  for (const [table, neighbors] of adjacency) {
    for (const neighbor of neighbors) {
      union(table, neighbor);
    }
  }

  // Group by root
  const components = new Map<string, string[]>();
  for (const name of tableNames) {
    const root = find(name);
    const group = components.get(root) ?? [];
    group.push(name);
    components.set(root, group);
  }

  return Array.from(components.values());
}

/**
 * Order tables within a component using BFS from most-connected node.
 * This ensures related tables are placed sequentially.
 */
function orderByBFS(
  component: string[],
  adjacency: Map<string, Set<string>>
): string[] {
  if (component.length <= 1) return component;

  // Find most-connected node as start
  let startNode = component[0];
  let maxConnections = 0;

  for (const name of component) {
    const connections = adjacency.get(name)?.size ?? 0;
    if (connections > maxConnections) {
      maxConnections = connections;
      startNode = name;
    }
  }

  // BFS traversal
  const visited = new Set<string>();
  const result: string[] = [];
  const queue: string[] = [startNode];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    result.push(current);

    // Add neighbors sorted by connection count (most connected first)
    const neighbors = Array.from(adjacency.get(current) ?? [])
      .filter(n => !visited.has(n) && component.includes(n))
      .sort((a, b) => (adjacency.get(b)?.size ?? 0) - (adjacency.get(a)?.size ?? 0));

    queue.push(...neighbors);
  }

  // Add any unvisited nodes (disconnected within component)
  for (const name of component) {
    if (!visited.has(name)) {
      result.push(name);
    }
  }

  return result;
}

interface SchemaBlock {
  schema: string;
  tables: Array<{ table: SchemaTable; localX: number; localY: number; height: number }>;
  width: number;
  height: number;
}

/**
 * Calculate schema block layout using graph-based placement.
 * Connected tables are placed adjacent to each other.
 */
function calculateSchemaBlock(
  schemaTables: SchemaTable[],
  relationships: SchemaRelationship[]
): Omit<SchemaBlock, "schema"> {
  if (schemaTables.length === 0) {
    return { tables: [], width: 0, height: 0 };
  }

  const tableNames = new Set(schemaTables.map(t => t.name));
  const tableMap = new Map(schemaTables.map(t => [t.name, t]));

  // Build adjacency graph
  const adjacency = buildAdjacencyGraph(tableNames, relationships);

  // Find connected components
  const components = findConnectedComponents(Array.from(tableNames), adjacency);

  // Sort components by size (largest first)
  components.sort((a, b) => b.length - a.length);

  // Order tables within each component using BFS
  const orderedTables: SchemaTable[] = [];
  for (const component of components) {
    const ordered = orderByBFS(component, adjacency);
    for (const name of ordered) {
      const table = tableMap.get(name);
      if (table) orderedTables.push(table);
    }
  }

  // Determine optimal column count based on table count
  const tableCount = orderedTables.length;
  const cols = tableCount <= 2 ? tableCount : Math.min(3, Math.ceil(Math.sqrt(tableCount)));

  // Place tables in columns, keeping related tables in same/adjacent columns
  const tablePositions: Array<{ table: SchemaTable; localX: number; localY: number; height: number }> = [];
  const colHeights: number[] = Array.from({ length: cols }, () => 0);

  for (let i = 0; i < orderedTables.length; i++) {
    const table = orderedTables[i];
    const height = calculateTableHeight(table);

    // For first few tables, fill columns left-to-right
    // After that, use shortest column to balance heights
    let targetCol: number;
    if (i < cols) {
      targetCol = i;
    } else {
      // Find shortest column
      targetCol = 0;
      for (let c = 1; c < cols; c++) {
        if (colHeights[c] < colHeights[targetCol]) targetCol = c;
      }
    }

    const localX = targetCol * (LAYOUT.TABLE_WIDTH + LAYOUT.GAP_X);
    const localY = colHeights[targetCol];

    tablePositions.push({ table, localX, localY, height });
    colHeights[targetCol] += height + LAYOUT.GAP_Y;
  }

  // Calculate block dimensions
  const blockWidth = cols * LAYOUT.TABLE_WIDTH + (cols - 1) * LAYOUT.GAP_X;
  const blockHeight = Math.max(...colHeights) - LAYOUT.GAP_Y;

  return { tables: tablePositions, width: blockWidth, height: Math.max(0, blockHeight) };
}

/**
 * Sort schema blocks by table count and relationship density.
 * Larger/more connected schemas first.
 */
function sortSchemaBlocks(blocks: SchemaBlock[]): SchemaBlock[] {
  return [...blocks].sort((a, b) => {
    // More tables first
    if (b.tables.length !== a.tables.length) {
      return b.tables.length - a.tables.length;
    }
    // Then by area
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    if (areaB !== areaA) return areaB - areaA;
    // Then alphabetically
    return a.schema.localeCompare(b.schema);
  });
}

/**
 * Place schema blocks using skyline bin-packing for compact layout.
 * Minimizes total area while keeping schemas grouped.
 */
function placeSchemaBlocks(
  blocks: SchemaBlock[]
): Map<string, { offsetX: number; offsetY: number }> {
  const SCHEMA_GAP = 30;
  const sortedBlocks = sortSchemaBlocks(blocks);
  const placements = new Map<string, { offsetX: number; offsetY: number }>();

  if (sortedBlocks.length === 0) return placements;

  // Skyline algorithm: track the "skyline" of placed blocks
  // skyline[x] = height at position x
  const maxWidth = Math.max(...sortedBlocks.map(b => b.width)) * 3 + SCHEMA_GAP * 2;
  const skyline: number[] = Array.from({ length: Math.ceil(maxWidth) + 1 }, () => 0);

  for (const block of sortedBlocks) {
    const blockWidth = block.width + SCHEMA_GAP;
    let bestX = 0;
    let bestY = Infinity;

    // Find position with minimum Y where block fits
    for (let x = 0; x <= maxWidth - blockWidth; x++) {
      // Find max height in this x range
      let maxY = 0;
      for (let i = x; i < x + blockWidth && i < skyline.length; i++) {
        maxY = Math.max(maxY, skyline[i]);
      }

      if (maxY < bestY) {
        bestY = maxY;
        bestX = x;
      }
    }

    // Place block at bestX, bestY
    placements.set(block.schema, {
      offsetX: LAYOUT.PADDING + bestX,
      offsetY: LAYOUT.PADDING + bestY,
    });

    // Update skyline
    const newHeight = bestY + block.height + SCHEMA_GAP;
    for (let i = bestX; i < bestX + blockWidth && i < skyline.length; i++) {
      skyline[i] = newHeight;
    }
  }

  return placements;
}

/**
 * Calculate positions for all tables, grouped by schema.
 * Uses graph-based layout within schemas and compact bin-packing between schemas.
 */
function calculatePositions(
  tables: SchemaTable[],
  sortedNames: string[],
  relationships: SchemaRelationship[]
): Record<string, TablePosition> {
  const positions: Record<string, TablePosition> = {};
  const tableMap = new Map(tables.map(t => [t.name, t]));

  // Group tables by schema
  const schemaGroups = new Map<string, SchemaTable[]>();
  for (const name of sortedNames) {
    const table = tableMap.get(name);
    if (!table) continue;
    const group = schemaGroups.get(table.schema) ?? [];
    group.push(table);
    schemaGroups.set(table.schema, group);
  }

  // Calculate block for each schema
  const schemaBlocks: SchemaBlock[] = [];
  for (const [schema, schemaTables] of schemaGroups) {
    const block = calculateSchemaBlock(schemaTables, relationships);
    schemaBlocks.push({ schema, ...block });
  }

  // Place schema blocks using bin-packing
  const placements = placeSchemaBlocks(schemaBlocks);

  // Apply placements to table positions
  for (const block of schemaBlocks) {
    const placement = placements.get(block.schema);
    if (!placement) continue;

    for (const { table, localX, localY, height } of block.tables) {
      positions[table.name] = {
        x: placement.offsetX + localX,
        y: placement.offsetY + localY,
        width: LAYOUT.TABLE_WIDTH,
        height,
      };
    }
  }

  return positions;
}

// ============================================================================
// Path Generation
// ============================================================================

// Marker stub length - matches marker size (8 units × strokeWidth of 2)
// Used for both arrow (start) and circle (end) markers
export const MARKER_STUB = 16;

/**
 * Generate SVG path for a relationship line using smooth bezier curves.
 * Chooses the shortest path by comparing all four side combinations.
 * Includes straight stubs at both ends for markers (arrow at start, circle at end).
 */
function generatePath(
  from: TablePosition,
  to: TablePosition,
  fromColumn: string,
  toColumn: string,
  fromTable: SchemaTable,
  toTable: SchemaTable,
  fromWidth: number,
  toWidth: number
): string {
  const fromColIndex = fromTable.columns.findIndex(c => c.name === fromColumn);
  const toColIndex = toTable.columns.findIndex(c => c.name === toColumn);

  const fromY = from.y + LAYOUT.HEADER_HEIGHT + (fromColIndex + 0.5) * LAYOUT.COLUMN_HEIGHT;
  const toY = to.y + LAYOUT.HEADER_HEIGHT + (toColIndex + 0.5) * LAYOUT.COLUMN_HEIGHT;

  // Calculate all four possible connection points
  const fromLeft = from.x;
  const fromRight = from.x + fromWidth;
  const toLeft = to.x;
  const toRight = to.x + toWidth;

  // Calculate distances for each combination (using squared distance to avoid sqrt)
  const dy2 = (toY - fromY) ** 2;
  const options = [
    { startX: fromLeft, endX: toLeft, dist: (toLeft - fromLeft) ** 2 + dy2 },      // left-to-left
    { startX: fromLeft, endX: toRight, dist: (toRight - fromLeft) ** 2 + dy2 },    // left-to-right
    { startX: fromRight, endX: toLeft, dist: (toLeft - fromRight) ** 2 + dy2 },    // right-to-left
    { startX: fromRight, endX: toRight, dist: (toRight - fromRight) ** 2 + dy2 },  // right-to-right
  ];

  // Find shortest path
  const best = options.reduce((a, b) => (a.dist < b.dist ? a : b));
  const { startX, endX } = best;

  // Determine curve direction based on which sides we're connecting
  const fromSide = startX === fromLeft ? "left" : "right";
  const toSide = endX === toLeft ? "left" : "right";

  // Start stub direction (horizontal, away from table) - for arrow marker
  const startStubDir = fromSide === "left" ? -1 : 1;
  const startStubX = startX + MARKER_STUB * startStubDir;

  // End stub direction (horizontal, away from table) - for circle marker
  const endStubDir = toSide === "left" ? -1 : 1;
  const endStubX = endX + MARKER_STUB * endStubDir;

  // Control point offset direction: curves should bow outward from the tables
  const dx = Math.abs(endStubX - startStubX);
  const baseOffset = Math.min(dx * 0.4, 60);

  let curveStartOffset: number;
  let curveEndOffset: number;

  if (fromSide === "left" && toSide === "left") {
    // Both left: curve bows left (negative X)
    curveStartOffset = -baseOffset;
    curveEndOffset = -baseOffset;
  } else if (fromSide === "right" && toSide === "right") {
    // Both right: curve bows right (positive X)
    curveStartOffset = baseOffset;
    curveEndOffset = baseOffset;
  } else if (fromSide === "right" && toSide === "left") {
    // Right to left: S-curve
    curveStartOffset = baseOffset;
    curveEndOffset = -baseOffset;
  } else {
    // Left to right: reverse S-curve
    curveStartOffset = -baseOffset;
    curveEndOffset = baseOffset;
  }

  // Path: start stub (arrow) + bezier curve + end stub (circle)
  // M = move to start, L = line to stub, C = bezier curve, L = line to end
  return `M ${startX} ${fromY} L ${startStubX} ${fromY} C ${startStubX + curveStartOffset} ${fromY}, ${endStubX + curveEndOffset} ${toY}, ${endStubX} ${toY} L ${endX} ${toY}`;
}

/**
 * Generate paths for all visible relationships
 */
function generatePaths(
  relationships: SchemaRelationship[],
  positions: Record<string, TablePosition>,
  tables: SchemaTable[],
  expandedTables: Record<string, boolean> = {}
): Record<string, string> {
  const paths: Record<string, string> = {};
  const tableMap = new Map(tables.map(t => [t.name, t]));

  for (const rel of relationships) {
    const fromTable = tableMap.get(rel.from.table);
    const toTable = tableMap.get(rel.to.table);

    // Skip if either table is missing from the map
    if (!fromTable || !toTable) continue;

    const fromPos = positions[rel.from.table] as TablePosition | undefined;
    const toPos = positions[rel.to.table] as TablePosition | undefined;

    // Skip if position is missing (table may be hidden)
    if (!fromPos || !toPos) continue;

    // Calculate effective widths accounting for expansion
    const fromWidth = calculateTableWidth(fromTable, expandedTables[fromTable.name] ?? false);
    const toWidth = calculateTableWidth(toTable, expandedTables[toTable.name] ?? false);

    paths[rel.id] = generatePath(
      fromPos,
      toPos,
      rel.from.column,
      rel.to.column,
      fromTable,
      toTable,
      fromWidth,
      toWidth
    );
  }

  return paths;
}

// ============================================================================
// Main Layout Function
// ============================================================================

/**
 * Compute complete layout for schema diagram.
 * Layout is stable regardless of visibility state.
 */
export function computeSchemaLayout(topology: SchemaTopology): SchemaLayout {
  const { tables, relationships } = topology;

  const sortedNames = topologicalSort(tables, relationships);
  const positions = calculatePositions(tables, sortedNames, relationships);
  const paths = generatePaths(relationships, positions, tables);

  let minX = Infinity;
  let maxX = 0;
  let maxY = 0;

  for (const pos of Object.values(positions)) {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x + pos.width);
    maxY = Math.max(maxY, pos.y + pos.height);
  }

  // Extra padding for bezier curve overshoot on both sides
  const CURVE_PADDING = 100;

  return {
    positions,
    paths,
    viewBox: {
      // Account for curves extending left of first column
      x: Math.max(0, minX - CURVE_PADDING),
      width: maxX + LAYOUT.PADDING + CURVE_PADDING,
      height: maxY + LAYOUT.PADDING,
    },
  };
}

/**
 * Get column Y position within a table for relationship anchoring
 */
export function getColumnY(table: SchemaTable, columnName: string): number {
  const colIndex = table.columns.findIndex(c => c.name === columnName);
  return LAYOUT.HEADER_HEIGHT + (colIndex + 0.5) * LAYOUT.COLUMN_HEIGHT;
}

/**
 * Generate paths for relationships given current positions.
 * Used for dynamic path updates when tables are dragged or expanded.
 */
export function generatePathsFromPositions(
  relationships: SchemaRelationship[],
  positions: Record<string, TablePosition>,
  tables: SchemaTable[],
  expandedTables: Record<string, boolean> = {}
): Record<string, string> {
  return generatePaths(relationships, positions, tables, expandedTables);
}
