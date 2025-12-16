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
} as const;

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
 * Calculate positions for all visible tables in a grid layout
 */
function calculatePositions(
  tables: SchemaTable[],
  sortedNames: string[],
  hiddenTables: Set<string>
): Record<string, TablePosition> {
  const positions: Record<string, TablePosition> = {};
  const tableMap = new Map(tables.map(t => [t.name, t]));
  const visibleNames = sortedNames.filter(name => !hiddenTables.has(name));

  const rowHeights: number[] = [];
  let currentRow = 0;
  let currentCol = 0;

  for (const name of visibleNames) {
    const table = tableMap.get(name);
    if (!table) continue;

    const height = calculateTableHeight(table);

    if (currentCol >= LAYOUT.COLUMNS) {
      currentCol = 0;
      currentRow++;
    }

    let y = LAYOUT.PADDING;
    for (let r = 0; r < currentRow; r++) {
      y += (rowHeights[r] ?? 0) + LAYOUT.GAP_Y;
    }

    const currentRowHeight = rowHeights[currentRow] ?? 0;
    rowHeights[currentRow] = Math.max(currentRowHeight, height);

    positions[name] = {
      x: LAYOUT.PADDING + currentCol * (LAYOUT.TABLE_WIDTH + LAYOUT.GAP_X),
      y,
      width: LAYOUT.TABLE_WIDTH,
      height,
    };

    currentCol++;
  }

  return positions;
}

// ============================================================================
// Path Generation
// ============================================================================

/**
 * Generate SVG path for a relationship line using smooth bezier curves
 */
function generatePath(
  from: TablePosition,
  to: TablePosition,
  fromColumn: string,
  toColumn: string,
  fromTable: SchemaTable,
  toTable: SchemaTable
): string {
  const fromColIndex = fromTable.columns.findIndex(c => c.name === fromColumn);
  const toColIndex = toTable.columns.findIndex(c => c.name === toColumn);

  const fromY = from.y + LAYOUT.HEADER_HEIGHT + (fromColIndex + 0.5) * LAYOUT.COLUMN_HEIGHT;
  const toY = to.y + LAYOUT.HEADER_HEIGHT + (toColIndex + 0.5) * LAYOUT.COLUMN_HEIGHT;

  const fromCenterX = from.x + from.width / 2;
  const toCenterX = to.x + to.width / 2;

  let startX: number;
  let endX: number;
  let curveDir: number;

  if (fromCenterX < toCenterX) {
    startX = from.x + from.width;
    endX = to.x;
    curveDir = 1;
  } else {
    startX = from.x;
    endX = to.x + to.width;
    curveDir = -1;
  }

  const dx = Math.abs(endX - startX);
  const controlOffset = Math.min(dx * 0.4, 60) * curveDir;

  // Bezier curve for smooth connections
  return `M ${startX} ${fromY} C ${startX + controlOffset} ${fromY}, ${endX - controlOffset} ${toY}, ${endX} ${toY}`;
}

/**
 * Generate paths for all visible relationships
 */
function generatePaths(
  relationships: SchemaRelationship[],
  positions: Record<string, TablePosition>,
  tables: SchemaTable[]
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

    paths[rel.id] = generatePath(
      fromPos,
      toPos,
      rel.from.column,
      rel.to.column,
      fromTable,
      toTable
    );
  }

  return paths;
}

// ============================================================================
// Main Layout Function
// ============================================================================

/**
 * Compute complete layout for schema diagram
 */
export function computeSchemaLayout(
  topology: SchemaTopology,
  hiddenTables: Set<string> = new Set()
): SchemaLayout {
  const { tables, relationships } = topology;

  const sortedNames = topologicalSort(tables, relationships);
  const positions = calculatePositions(tables, sortedNames, hiddenTables);
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
