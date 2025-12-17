/**
 * DB Viewer Queries
 *
 * Server-side queries for the database table viewer.
 * These are separated from main app queries as per requirements.
 */

import "server-only";

import { cacheLife } from "next/cache";
import { sql, count, asc, desc, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db/connection";
import * as schema from "@/lib/db/schema";
import type {
  DatabaseProvider,
  TableInfo,
  TableMetadata,
  ColumnInfo,
  QueryResult,
  QueryOptions,
} from "./types";

// Table registry - maps table names to their schemas
const TABLE_REGISTRY: Partial<Record<string, TableInfo>> = {
  // Dictionary tables
  lexical_entries: {
    name: "lexical_entries",
    provider: "neon",
    schema: schema.lexicalEntries,
    description: "Main dictionary entries with lemma and part of speech",
  },
  word_forms: {
    name: "word_forms",
    provider: "neon",
    schema: schema.wordForms,
    description: "Inflected forms of lexical entries",
  },
  senses: {
    name: "senses",
    provider: "neon",
    schema: schema.senses,
    description: "Word meanings and definitions",
  },
  sense_relations: {
    name: "sense_relations",
    provider: "neon",
    schema: schema.senseRelations,
    description: "Relationships between senses (synonyms, antonyms, etc.)",
  },
  examples: {
    name: "examples",
    provider: "neon",
    schema: schema.examples,
    description: "Usage examples for senses",
  },
  contributors: {
    name: "contributors",
    provider: "neon",
    schema: schema.contributors,
    description: "Authors, composers, and other contributors",
  },
  sources: {
    name: "sources",
    provider: "neon",
    schema: schema.sources,
    description: "Books, movies, and other source materials",
  },
  source_credits: {
    name: "source_credits",
    provider: "neon",
    schema: schema.sourceCredits,
    description: "Credits linking contributors to sources",
  },
  source_parts: {
    name: "source_parts",
    provider: "neon",
    schema: schema.sourceParts,
    description: "Hierarchical parts of sources (acts, songs, chapters)",
  },
  entry_audio: {
    name: "entry_audio",
    provider: "neon",
    schema: schema.entryAudio,
    description: "Audio pronunciations for entries",
  },
  categories: {
    name: "categories",
    provider: "neon",
    schema: schema.categories,
    description: "Tag categories for organizing senses",
  },
  tags: {
    name: "tags",
    provider: "neon",
    schema: schema.tags,
    description: "Tags for classifying senses",
  },
  sense_tags: {
    name: "sense_tags",
    provider: "neon",
    schema: schema.senseTags,
    description: "Links between senses and tags",
  },
  // Problems tables
  problems: {
    name: "problems",
    provider: "neon",
    schema: schema.problems,
    description: "Algorithm problems for practice",
  },
  solutions: {
    name: "solutions",
    provider: "neon",
    schema: schema.solutions,
    description: "Solutions to algorithm problems",
  },
};

/**
 * Get list of all available tables grouped by provider
 */
export function getAvailableTables(): TableInfo[] {
  return Object.values(TABLE_REGISTRY).filter((t): t is TableInfo => t !== undefined);
}

/**
 * Get tables filtered by provider
 */
export function getTablesByProvider(provider: DatabaseProvider): TableInfo[] {
  return Object.values(TABLE_REGISTRY).filter((t): t is TableInfo => t?.provider === provider);
}

/**
 * Extract column information from a Drizzle schema table
 */
function extractColumnInfo(
  tableSchema: TableInfo["schema"]
): ColumnInfo[] {
  const columns: ColumnInfo[] = [];

  // Access the underlying column definitions
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
      // Prefer getSQLType() for actual PostgreSQL type, fallback to columnType parsing
      let sqlType = "unknown";
      if (typeof column.getSQLType === "function") {
        sqlType = column.getSQLType();
      } else if (column.columnType) {
        // Parse Drizzle's columnType (e.g., "PgInteger" -> "integer", "PgVarchar" -> "varchar")
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

  const tableInfo = TABLE_REGISTRY[tableName];
  if (!tableInfo) return null;

  const columns = extractColumnInfo(tableInfo.schema);

  // Get row count
  const result = await db
    .select({ count: count() })
    .from(tableInfo.schema);

  return {
    tableName,
    provider: tableInfo.provider,
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
  const tableInfo = TABLE_REGISTRY[tableName];
  if (!tableInfo) return null;

  const {
    page = 1,
    pageSize = 25,
    sort,
    search,
    searchColumns = [],
  } = options;

  const offset = (page - 1) * pageSize;

  // Build the query
  let query = db.select().from(tableInfo.schema);

  // Apply search if provided
  if (search && searchColumns.length > 0) {
    const searchConditions = searchColumns.map((col) => {
      const column = (tableInfo.schema as unknown as Record<string, unknown>)[col];
      if (column) {
        return ilike(column as Parameters<typeof ilike>[0], `%${search}%`);
      }
      return null;
    }).filter(Boolean);

    if (searchConditions.length > 0) {
      query = query.where(or(...searchConditions as Parameters<typeof or>)) as typeof query;
    }
  }

  // Apply sorting
  if (sort) {
    const column = (tableInfo.schema as unknown as Record<string, unknown>)[sort.column];
    if (column) {
      const orderFn = sort.direction === "desc" ? desc : asc;
      query = query.orderBy(orderFn(column as Parameters<typeof asc>[0])) as typeof query;
    }
  }

  // Run count and data queries in parallel
  const [countResult, data] = await Promise.all([
    db.select({ count: count() }).from(tableInfo.schema),
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
  const tableInfo = TABLE_REGISTRY[tableName];
  if (!tableInfo) return null;

  // Find the primary key column (usually 'id')
  const schema = tableInfo.schema as unknown as Record<string, unknown>;
  const idColumn = schema.id;

  if (!idColumn) return null;

  const result = await db
    .select()
    .from(tableInfo.schema)
    .where(sql`${idColumn} = ${id}`)
    .limit(1);

  return (result[0] as Record<string, unknown> | undefined) ?? null;
}

/**
 * Get table statistics for dashboard
 */
export async function getTableStats(): Promise<
  { name: string; provider: DatabaseProvider; rowCount: number; description?: string }[]
> {
  'use cache'
  cacheLife('hours')

  const tableEntries = Object.values(TABLE_REGISTRY).filter((t): t is TableInfo => t !== undefined);

  const results = await Promise.all(
    tableEntries.map(async (tableInfo) => {
      try {
        const result = await db
          .select({ count: count() })
          .from(tableInfo.schema);

        return {
          name: tableInfo.name,
          provider: tableInfo.provider,
          rowCount: result[0]?.count ?? 0,
          description: tableInfo.description,
        };
      } catch {
        return {
          name: tableInfo.name,
          provider: tableInfo.provider,
          rowCount: 0,
          description: tableInfo.description,
        };
      }
    })
  );

  return results;
}
