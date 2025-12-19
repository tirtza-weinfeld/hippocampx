/**
 * ER Diagram Utilities
 *
 * Pure functions for computing schema layouts, bounds, and column highlighting.
 */

import type {
  SchemaTopology,
  SchemaRelationship,
  TablePosition,
  ColumnSelection,
  SchemaBound,
  HighlightedColumns,
} from "./types";

/**
 * Build a map from schema name to a numeric index for consistent coloring.
 */
export function computeSchemaIndexMap(tables: SchemaTopology["tables"]): Map<string, number> {
  const schemas = [...new Set(tables.map(t => t.schema))].sort();
  return new Map(schemas.map((s, i) => [s, i]));
}

/**
 * Build a map from domain name to a numeric index for consistent coloring.
 * Domains come from DB comments (e.g., Lexicon, Semantic Graph, Provenance, Ontology).
 */
export function computeDomainIndexMap(tables: SchemaTopology["tables"]): Map<string, number> {
  const domains = [...new Set(tables.map(t => t.domain).filter((d): d is string => !!d))].sort();
  return new Map(domains.map((d, i) => [d, i]));
}

/**
 * Compute which columns should be highlighted based on a selected column.
 * Returns the primary key and all related foreign keys.
 */
export function computeHighlightedColumns(
  selectedColumn: ColumnSelection | null,
  relationships: SchemaRelationship[]
): HighlightedColumns {
  const result: HighlightedColumns = { pk: null, fks: [] };

  if (!selectedColumn) return result;

  if (selectedColumn.type === "pk") {
    result.pk = { table: selectedColumn.table, column: selectedColumn.column };
    for (const rel of relationships) {
      if (rel.to.table === selectedColumn.table && rel.to.column === selectedColumn.column) {
        result.fks.push({ table: rel.from.table, column: rel.from.column });
      }
    }
  } else {
    const targetRel = relationships.find(
      r => r.from.table === selectedColumn.table && r.from.column === selectedColumn.column
    );
    if (targetRel) {
      result.pk = { table: targetRel.to.table, column: targetRel.to.column };
      for (const rel of relationships) {
        if (rel.to.table === targetRel.to.table && rel.to.column === targetRel.to.column) {
          result.fks.push({ table: rel.from.table, column: rel.from.column });
        }
      }
    }
  }

  return result;
}

const SCHEMA_BOUNDS_PADDING = 20;

/**
 * Compute bounding boxes for each schema to draw background regions.
 */
export function computeSchemaBounds(
  tables: SchemaTopology["tables"],
  hiddenTables: Set<string>,
  positions: Record<string, TablePosition>,
  schemaIndexMap: Map<string, number>
): Record<string, SchemaBound> {
  const bounds = new Map<string, SchemaBound>();

  for (const table of tables) {
    if (hiddenTables.has(table.name)) continue;
    const pos = positions[table.name] as TablePosition | undefined;
    if (!pos) continue;

    const existing = bounds.get(table.schema);

    if (existing) {
      const newX = Math.min(existing.x, pos.x - SCHEMA_BOUNDS_PADDING);
      const newY = Math.min(existing.y, pos.y - SCHEMA_BOUNDS_PADDING);
      const right = Math.max(existing.x + existing.width, pos.x + pos.width + SCHEMA_BOUNDS_PADDING);
      const bottom = Math.max(existing.y + existing.height, pos.y + pos.height + SCHEMA_BOUNDS_PADDING);
      existing.x = newX;
      existing.y = newY;
      existing.width = right - newX;
      existing.height = bottom - newY;
    } else {
      bounds.set(table.schema, {
        x: pos.x - SCHEMA_BOUNDS_PADDING,
        y: pos.y - SCHEMA_BOUNDS_PADDING,
        width: pos.width + SCHEMA_BOUNDS_PADDING * 2,
        height: pos.height + SCHEMA_BOUNDS_PADDING * 2,
        index: schemaIndexMap.get(table.schema) ?? 0,
      });
    }
  }

  return Object.fromEntries(bounds);
}

/**
 * Compute bounding boxes for each domain to draw background regions.
 * Domains come from DB comments (e.g., Lexicon, Semantic Graph, Provenance, Ontology).
 */
export function computeDomainBounds(
  tables: SchemaTopology["tables"],
  hiddenTables: Set<string>,
  positions: Record<string, TablePosition>,
  domainIndexMap: Map<string, number>
): Record<string, SchemaBound> {
  const bounds = new Map<string, SchemaBound>();

  for (const table of tables) {
    if (hiddenTables.has(table.name)) continue;
    if (!table.domain) continue;
    const pos = positions[table.name] as TablePosition | undefined;
    if (!pos) continue;

    const existing = bounds.get(table.domain);

    if (existing) {
      const newX = Math.min(existing.x, pos.x - SCHEMA_BOUNDS_PADDING);
      const newY = Math.min(existing.y, pos.y - SCHEMA_BOUNDS_PADDING);
      const right = Math.max(existing.x + existing.width, pos.x + pos.width + SCHEMA_BOUNDS_PADDING);
      const bottom = Math.max(existing.y + existing.height, pos.y + pos.height + SCHEMA_BOUNDS_PADDING);
      existing.x = newX;
      existing.y = newY;
      existing.width = right - newX;
      existing.height = bottom - newY;
    } else {
      bounds.set(table.domain, {
        x: pos.x - SCHEMA_BOUNDS_PADDING,
        y: pos.y - SCHEMA_BOUNDS_PADDING,
        width: pos.width + SCHEMA_BOUNDS_PADDING * 2,
        height: pos.height + SCHEMA_BOUNDS_PADDING * 2,
        index: domainIndexMap.get(table.domain) ?? 0,
      });
    }
  }

  return Object.fromEntries(bounds);
}

/**
 * Find the table element at a given point using elementsFromPoint.
 */
export function findTableAtPoint(clientX: number, clientY: number): string | null {
  const elements = document.elementsFromPoint(clientX, clientY);
  for (const el of elements) {
    let current: Element | null = el;
    while (current) {
      const tableName = current.getAttribute("data-table-name");
      if (tableName) return tableName;
      current = current.parentElement;
    }
  }
  return null;
}

/**
 * Check if an element or its ancestors is a table node.
 */
export function isTableElement(target: Element): boolean {
  let current: Element | null = target;
  while (current) {
    if (current.getAttribute("data-table-name")) return true;
    current = current.parentElement;
  }
  return false;
}
