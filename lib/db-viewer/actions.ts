/**
 * DB Viewer Server Actions
 *
 * Server actions for the database table viewer.
 */

"use server";

import { redirect } from "next/navigation";
import {
  getTableMetadata,
  queryTableData,
  getRowById,
  getTableStats,
} from "./queries";
import type { QueryOptions, TableMetadata, QueryResult, SortConfig } from "./types";

/**
 * Build URL search params for db viewer navigation
 */
function buildDbUrl(params: {
  table?: string | null;
  page?: number;
  sort?: string | null;
  dir?: "asc" | "desc" | null;
}): string {
  const searchParams = new URLSearchParams();

  if (params.table) searchParams.set("table", params.table);
  if (params.page && params.page > 1) searchParams.set("page", String(params.page));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.dir) searchParams.set("dir", params.dir);

  const query = searchParams.toString();
  return `/db${query ? `?${query}` : ""}`;
}

/**
 * Navigate to a specific table
 */
export async function navigateToTable(tableName: string): Promise<never> {
  await Promise.resolve();
  redirect(buildDbUrl({ table: tableName }) as "/db");
}

/**
 * Navigate to a specific page within current table
 */
export async function navigateToPage(
  tableName: string,
  page: number,
  sort?: SortConfig | null
): Promise<never> {
  await Promise.resolve();
  redirect(buildDbUrl({
    table: tableName,
    page,
    sort: sort?.column,
    dir: sort?.direction,
  }) as "/db");
}

/**
 * Navigate with sort applied
 */
export async function navigateWithSort(
  tableName: string,
  column: string,
  direction: "asc" | "desc"
): Promise<never> {
  await Promise.resolve();
  redirect(buildDbUrl({
    table: tableName,
    page: 1,
    sort: column,
    dir: direction,
  }) as "/db");
}

/**
 * Navigate back to table list (clear selection)
 */
export async function navigateToTableList(): Promise<never> {
  await Promise.resolve();
  redirect("/db");
}

export async function fetchTableMetadata(
  tableName: string
): Promise<TableMetadata | null> {
  return getTableMetadata(tableName);
}

export async function fetchTableData(
  tableName: string,
  options?: QueryOptions
): Promise<QueryResult | null> {
  return queryTableData(tableName, options);
}

export async function fetchRowById(
  tableName: string,
  id: string | number
): Promise<Record<string, unknown> | null> {
  return getRowById(tableName, id);
}

export async function fetchTableStats(): Promise<
  { name: string; provider: "neon" | "vercel"; rowCount: number; description?: string }[]
> {
  return getTableStats();
}
