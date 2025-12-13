/**
 * DB Viewer Types
 *
 * Types for the database table viewer functionality.
 * Separated from main app queries as per requirements.
 */

import type { AnyPgTable } from "drizzle-orm/pg-core";

export type DatabaseProvider = "neon" | "vercel";

export interface TableInfo {
  name: string;
  provider: DatabaseProvider;
  schema: AnyPgTable;
  rowCount?: number;
  description?: string;
}

export interface ColumnInfo {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
}

export interface TableMetadata {
  tableName: string;
  provider: DatabaseProvider;
  columns: ColumnInfo[];
  rowCount: number;
}

export interface QueryResult<T = Record<string, unknown>> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface SortConfig {
  column: string;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  column: string;
  operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "like" | "ilike";
  value: string;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortConfig;
  filters?: FilterConfig[];
  search?: string;
  searchColumns?: string[];
}

export interface TableViewerState {
  selectedTable: string | null;
  selectedProvider: DatabaseProvider | null;
  queryOptions: QueryOptions;
  isLoading: boolean;
  error: string | null;
}
