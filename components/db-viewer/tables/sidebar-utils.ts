import type { DatabaseProvider } from "@/lib/db-viewer/types";

export interface TableStat {
  name: string;
  provider: DatabaseProvider;
  rowCount: number;
  schema: string;
  domain?: string;
}

export function formatTableName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRowCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
}

export function groupTablesBySchema(tables: TableStat[]): Map<string, TableStat[]> {
  const grouped = new Map<string, TableStat[]>();
  for (const table of tables) {
    const existing = grouped.get(table.schema) ?? [];
    existing.push(table);
    grouped.set(table.schema, existing);
  }
  return grouped;
}

export function buildSchemaIndexMap(tables: TableStat[]): Map<string, number> {
  const schemas = [...new Set(tables.map((t) => t.schema))];
  return new Map(schemas.map((s, i) => [s, i]));
}

export function buildDomainIndexMap(tables: TableStat[]): Map<string, number> {
  const domains = [...new Set(tables.map((t) => t.domain).filter((d): d is string => !!d))];
  return new Map(domains.map((d, i) => [d, i]));
}
