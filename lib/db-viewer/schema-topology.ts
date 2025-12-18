/**
 * Schema Topology Builder
 *
 * Dynamically extracts tables and foreign key relationships from Drizzle schemas
 * to build a complete topology for ER diagram rendering.
 */

import "server-only";

import { cache } from "react";
import { getTableColumns, getTableName, is } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
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
