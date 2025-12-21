/**
 * DB Viewer Queries
 *
 * Server-side queries for the database table viewer.
 * Uses dynamic table discovery from schema-topology.
 */

import "server-only";

import { cacheLife } from "next/cache";
import { sql, count, asc, desc, ilike, or } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { db } from "@/lib/db/connection";
import { getTableRegistry, buildSchemaTopologyWithComments } from "./schema-topology";
import type {
  DatabaseProvider,
  TableMetadata,
  ColumnInfo,
  QueryResult,
  QueryOptions,
} from "./types";

/**
 * Extract column information from a Drizzle schema table
 */
function extractColumnInfo(tableSchema: AnyPgTable): ColumnInfo[] {
  const columns: ColumnInfo[] = [];

  const tableConfig = tableSchema as unknown as {
    [key: string]: {
      name?: string;
      dataType?: string;
      notNull?: boolean;
      primaryKey?: boolean;
      columnType?: string;
      getSQLType?: () => string;
      default?: unknown;
    };
  };

  for (const key of Object.keys(tableConfig)) {
    const column = tableConfig[key] as typeof tableConfig[string] | undefined;
    if (column && typeof column === "object" && "name" in column) {
      let sqlType = "unknown";
      if (typeof column.getSQLType === "function") {
        sqlType = column.getSQLType();
      } else if (column.columnType) {
        sqlType = column.columnType
          .replace(/^Pg/, "")
          .replace(/([A-Z])/g, (_, p1: string, offset: number) => (offset > 0 ? "_" + p1 : p1))
          .toLowerCase();
      } else if (column.dataType) {
        sqlType = column.dataType;
      }

      columns.push({
        name: column.name ?? key,
        dataType: sqlType,
        isNullable: !column.notNull,
        isPrimaryKey: column.primaryKey ?? false,
        isForeignKey: false,
        defaultValue: column.default != null ? JSON.stringify(column.default) : undefined,
      });
    }
  }

  return columns;
}

/**
 * Get metadata for a specific table
 */
export async function getTableMetadata(
  tableName: string
): Promise<TableMetadata | null> {
  'use cache'
  cacheLife('hours')

  const registry = getTableRegistry();
  const entry = registry.get(tableName);
  if (!entry) return null;

  const columns = extractColumnInfo(entry.tableSchema);

  const result = await db
    .select({ count: count() })
    .from(entry.tableSchema);

  return {
    tableName,
    provider: "neon" as DatabaseProvider,
    columns,
    rowCount: result[0]?.count ?? 0,
  };
}

/**
 * Query table data with pagination, sorting, and filtering
 */
export async function queryTableData(
  tableName: string,
  options: QueryOptions = {}
): Promise<QueryResult | null> {
  const registry = getTableRegistry();
  const entry = registry.get(tableName);
  if (!entry) return null;

  const {
    page = 1,
    pageSize = 25,
    sort,
    search,
    searchColumns = [],
  } = options;

  const offset = (page - 1) * pageSize;

  let query = db.select().from(entry.tableSchema);

  if (search && searchColumns.length > 0) {
    const searchConditions = searchColumns.map((col) => {
      const column = (entry.tableSchema as unknown as Record<string, unknown>)[col];
      if (column) {
        return ilike(column as Parameters<typeof ilike>[0], `%${search}%`);
      }
      return null;
    }).filter(Boolean);

    if (searchConditions.length > 0) {
      query = query.where(or(...searchConditions as Parameters<typeof or>)) as typeof query;
    }
  }

  if (sort) {
    const column = (entry.tableSchema as unknown as Record<string, unknown>)[sort.column];
    if (column) {
      const orderFn = sort.direction === "desc" ? desc : asc;
      query = query.orderBy(orderFn(column as Parameters<typeof asc>[0])) as typeof query;
    }
  }

  const [countResult, data] = await Promise.all([
    db.select({ count: count() }).from(entry.tableSchema),
    query.limit(pageSize).offset(offset),
  ]);

  const totalCount = countResult[0]?.count ?? 0;

  return {
    data: data as Record<string, unknown>[],
    totalCount,
    pageSize,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Get a single row by primary key
 */
export async function getRowById(
  tableName: string,
  id: string | number
): Promise<Record<string, unknown> | null> {
  const registry = getTableRegistry();
  const entry = registry.get(tableName);
  if (!entry) return null;

  const schema = entry.tableSchema as unknown as Record<string, unknown>;
  const idColumn = schema.id;

  if (!idColumn) return null;

  const result = await db
    .select()
    .from(entry.tableSchema)
    .where(sql`${idColumn} = ${id}`)
    .limit(1);

  return (result[0] as Record<string, unknown> | undefined) ?? null;
}

/**
 * Get table statistics for dashboard
 */
export async function getTableStats(): Promise<
  { name: string; provider: DatabaseProvider; rowCount: number; schema: string; domain?: string }[]
> {
  'use cache'
  cacheLife('hours')

  const registry = getTableRegistry();
  const topology = await buildSchemaTopologyWithComments();

  // Build domain map from topology
  const domainMap = new Map(topology.tables.map(t => [t.name, t.domain]));

  const results = await Promise.all(
    Array.from(registry.values()).map(async (entry) => {
      try {
        const result = await db
          .select({ count: count() })
          .from(entry.tableSchema);

        return {
          name: entry.name,
          provider: "neon" as DatabaseProvider,
          rowCount: result[0]?.count ?? 0,
          schema: entry.schema,
          domain: domainMap.get(entry.name),
        };
      } catch {
        return {
          name: entry.name,
          provider: "neon" as DatabaseProvider,
          rowCount: 0,
          schema: entry.schema,
          domain: domainMap.get(entry.name),
        };
      }
    })
  );

  return results;
}
