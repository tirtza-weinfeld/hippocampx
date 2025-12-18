/**
 * DB Viewer Types
 *
 * Types for the database table viewer functionality.
 * Separated from main app queries as per requirements.
 */

import type { AnyPgTable } from "drizzle-orm/pg-core";

export type DatabaseProvider = "neon";

export interface TableInfo {
  name: string;
  provider: DatabaseProvider;
  schema: AnyPgTable;
  rowCount?: number;
  description?: string;
}

export interface ForeignKeyRef {
  table: string;
  column: string;
}

export interface ColumnInfo {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKey?: ForeignKeyRef;
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

// ============================================================================
// Schema Diagram Types
// ============================================================================

export interface SchemaColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  foreignKey?: ForeignKeyRef;
}

export interface SchemaTable {
  name: string;
  schema: string;
  columns: SchemaColumn[];
}

export interface SchemaRelationship {
  id: string;
  from: { table: string; column: string };
  to: { table: string; column: string };
}

export interface SchemaTopology {
  tables: SchemaTable[];
  relationships: SchemaRelationship[];
}

export interface TablePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColumnSelection {
  table: string;
  column: string;
  type: "pk" | "fk";
}

export interface SchemaLayout {
  positions: Record<string, TablePosition>;
  paths: Record<string, string>;
  viewBox: { x: number; width: number; height: number };
}

// ============================================================================
// ER Diagram Interaction Types
// ============================================================================

export interface CanvasDragState {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

export interface TableDragState {
  tableName: string;
  startX: number;
  startY: number;
  tableStartX: number;
  tableStartY: number;
}

export interface SchemaBound {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

export interface HighlightedColumns {
  pk: { table: string; column: string } | null;
  fks: Array<{ table: string; column: string }>;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}
