/**
 * Schema Topology Builder
 *
 * Dynamically extracts tables and foreign key relationships from Drizzle schemas
 * to build a complete topology for ER diagram rendering.
 *
 * Supports enriching topology with pg_catalog comments (description | domain/example).
 */

import "server-only";

import { cache } from "react";
import { getTableColumns, getTableName, is, sql } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
import { db } from "@/lib/db/connection";
import type { AnyPgTable, PgColumn } from "drizzle-orm/pg-core";
import type {
  SchemaTopology,
  SchemaTable,
  SchemaColumn,
  SchemaRelationship,
  ForeignKeyRef,
} from "./types";

import * as schemas from "@/lib/db/schemas";

// ============================================================================
// Table Detection
// ============================================================================

function isPgTable(value: unknown): value is AnyPgTable {
  return is(value, PgTable);
}

function extractTablesFromModule(
  module: Record<string, unknown>,
  schemaName: string
): Array<{ name: string; schema: string; tableSchema: AnyPgTable }> {
  const tables: Array<{
    name: string;
    schema: string;
    tableSchema: AnyPgTable;
  }> = [];

  for (const [, value] of Object.entries(module)) {
    if (isPgTable(value)) {
      tables.push({
        name: getTableName(value),
        schema: schemaName,
        tableSchema: value,
      });
    }
  }

  return tables;
}

// ============================================================================
// Column & FK Extraction
// ============================================================================

function getSqlType(column: PgColumn): string {
  const col = column as { getSQLType?: () => string; columnType?: string; dataType?: string };
  if (typeof col.getSQLType === "function") {
    return col.getSQLType();
  }
  if (col.columnType) {
    return col.columnType.replace(/^Pg/, "").toLowerCase();
  }
  return col.dataType ?? "unknown";
}

/**
 * Extract FK map from table config
 * Returns a map of columnName -> { table, column }
 */
function extractForeignKeyMap(tableSchema: AnyPgTable): Map<string, ForeignKeyRef> {
  const fkMap = new Map<string, ForeignKeyRef>();

  try {
    const config = getTableConfig(tableSchema);

    for (const fk of config.foreignKeys) {
      const columns = fk.reference().columns;
      const foreignColumns = fk.reference().foreignColumns;

      if (columns.length > 0 && foreignColumns.length > 0) {
        const localColName = columns[0].name;
        const foreignTable = getTableName(foreignColumns[0].table);
        const foreignColName = foreignColumns[0].name;

        fkMap.set(localColName, {
          table: foreignTable,
          column: foreignColName,
        });
      }
    }
  } catch {
    // Table might not have foreign keys
  }

  return fkMap;
}

function extractSchemaColumns(tableSchema: AnyPgTable): SchemaColumn[] {
  const columns = getTableColumns(tableSchema);
  const fkMap = extractForeignKeyMap(tableSchema);
  const result: SchemaColumn[] = [];

  for (const key of Object.keys(columns)) {
    const column = columns[key] as PgColumn;

    result.push({
      name: column.name,
      type: getSqlType(column),
      isPrimaryKey: column.primary,
      foreignKey: fkMap.get(column.name),
    });
  }

  return result;
}

// ============================================================================
// Topology Builder
// ============================================================================

export const buildSchemaTopology = cache(function buildSchemaTopology(): SchemaTopology {
  const tables: SchemaTable[] = [];
  const relationships: SchemaRelationship[] = [];

  for (const [schemaName, module] of Object.entries(schemas)) {
    const schemaTables = extractTablesFromModule(
      module as Record<string, unknown>,
      schemaName
    );

    for (const entry of schemaTables) {
      const columns = extractSchemaColumns(entry.tableSchema);

      tables.push({
        name: entry.name,
        schema: entry.schema,
        columns,
      });

      for (const col of columns) {
        if (col.foreignKey) {
          relationships.push({
            id: `${entry.name}.${col.name}->${col.foreignKey.table}.${col.foreignKey.column}`,
            from: { table: entry.name, column: col.name },
            to: { table: col.foreignKey.table, column: col.foreignKey.column },
          });
        }
      }
    }
  }

  return { tables, relationships };
});

export function getSchemaTableNames(): string[] {
  return buildSchemaTopology().tables.map(t => t.name);
}

export function getTablesBySchema(): Record<string, string[]> {
  const topology = buildSchemaTopology();
  const result: Record<string, string[]> = {};

  for (const table of topology.tables) {
    (result[table.schema] ??= []).push(table.name);
  }

  return result;
}

// ============================================================================
// Table Registry (for queries)
// ============================================================================

export interface TableRegistryEntry {
  name: string;
  schema: string;
  tableSchema: AnyPgTable;
}

/**
 * Build a dynamic registry of all tables with their Drizzle schemas.
 * Used by queries.ts to query any table without manual registration.
 */
export const getTableRegistry = cache(function getTableRegistry(): Map<string, TableRegistryEntry> {
  const registry = new Map<string, TableRegistryEntry>();

  for (const [schemaName, module] of Object.entries(schemas)) {
    const tables = extractTablesFromModule(
      module as Record<string, unknown>,
      schemaName
    );

    for (const entry of tables) {
      registry.set(entry.name, {
        name: entry.name,
        schema: entry.schema,
        tableSchema: entry.tableSchema,
      });
    }
  }

  return registry;
});

// ============================================================================
// Comment Introspection (pg_catalog)
// ============================================================================

/**
 * Parse a comment string with format "Description | Domain" or "Description | Example"
 */
function parseComment(comment: string | null): { description?: string; extra?: string } {
  if (!comment) return {};

  const parts = comment.split(" | ");
  return {
    description: parts[0]?.trim() || undefined,
    extra: parts[1]?.trim() || undefined,
  };
}

/**
 * Fetch all table comments from pg_catalog
 */
async function fetchTableComments(): Promise<Map<string, { description?: string; domain?: string }>> {
  const result = await db.execute<{ table_name: string; comment: string | null }>(sql`
    SELECT
      c.relname AS table_name,
      obj_description(c.oid, 'pg_class') AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r'
      AND n.nspname = 'public'
      AND obj_description(c.oid, 'pg_class') IS NOT NULL
  `);

  const comments = new Map<string, { description?: string; domain?: string }>();

  for (const row of result.rows) {
    const parsed = parseComment(row.comment);
    comments.set(row.table_name, {
      description: parsed.description,
      domain: parsed.extra,
    });
  }

  return comments;
}

/**
 * Fetch all column comments from pg_catalog
 */
async function fetchColumnComments(): Promise<Map<string, { description?: string; example?: string }>> {
  const result = await db.execute<{ table_name: string; column_name: string; comment: string | null }>(sql`
    SELECT
      c.relname AS table_name,
      a.attname AS column_name,
      col_description(c.oid, a.attnum) AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_attribute a ON a.attrelid = c.oid
    WHERE c.relkind = 'r'
      AND n.nspname = 'public'
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND col_description(c.oid, a.attnum) IS NOT NULL
  `);

  const comments = new Map<string, { description?: string; example?: string }>();

  for (const row of result.rows) {
    const key = `${row.table_name}.${row.column_name}`;
    const parsed = parseComment(row.comment);
    comments.set(key, {
      description: parsed.description,
      example: parsed.extra,
    });
  }

  return comments;
}

/**
 * Build schema topology enriched with comments from pg_catalog.
 * This queries the database for COMMENT ON metadata.
 */
export async function buildSchemaTopologyWithComments(): Promise<SchemaTopology> {
  const baseTopology = buildSchemaTopology();

  const [tableComments, columnComments] = await Promise.all([
    fetchTableComments(),
    fetchColumnComments(),
  ]);

  const enrichedTables: SchemaTable[] = baseTopology.tables.map(table => {
    const tableComment = tableComments.get(table.name);

    const enrichedColumns: SchemaColumn[] = table.columns.map(column => {
      const colComment = columnComments.get(`${table.name}.${column.name}`);
      return {
        ...column,
        description: colComment?.description,
        example: colComment?.example,
      };
    });

    return {
      ...table,
      description: tableComment?.description,
      domain: tableComment?.domain,
      columns: enrichedColumns,
    };
  });

  return {
    tables: enrichedTables,
    relationships: baseTopology.relationships,
  };
}
