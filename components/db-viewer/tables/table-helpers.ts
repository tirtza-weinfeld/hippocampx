/**
 * Data Table Helper Functions and Constants
 */

export const DATA_TYPE_COLORS: Record<string, string> = {
  integer: "text-db-type-number",
  real: "text-db-type-number",
  number: "text-db-type-number",
  boolean: "text-amber-500 dark:text-amber-400",
  timestamp: "text-db-text-muted",
  date: "text-db-text-muted",
};

export const DATA_TYPE_BADGES: Record<string, { bg: string; text: string }> = {
  integer: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  smallint: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  bigint: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  real: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  "double precision": { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  numeric: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  serial: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  number: { bg: "bg-db-type-number-bg", text: "text-db-type-number" },
  boolean: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  timestamp: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  "timestamp with time zone": { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  "timestamp without time zone": { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  date: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  time: { bg: "bg-db-surface-raised", text: "text-db-text-muted" },
  string: { bg: "bg-db-neon/10", text: "text-db-neon" },
  text: { bg: "bg-db-neon/10", text: "text-db-neon" },
  varchar: { bg: "bg-db-neon/10", text: "text-db-neon" },
  char: { bg: "bg-db-neon/10", text: "text-db-neon" },
  uuid: { bg: "bg-db-neon/10", text: "text-db-neon" },
  json: { bg: "bg-purple-500/10", text: "text-purple-500 dark:text-purple-400" },
  jsonb: { bg: "bg-purple-500/10", text: "text-purple-500 dark:text-purple-400" },
  array: { bg: "bg-orange-500/10", text: "text-orange-500 dark:text-orange-400" },
  custom: { bg: "bg-purple-500/10", text: "text-purple-500 dark:text-purple-400" },
};

export function getTypeBadge(dataType: string): { bg: string; text: string } {
  const normalized = dataType.toLowerCase();
  const exactMatch = DATA_TYPE_BADGES[normalized] as { bg: string; text: string } | undefined;
  if (exactMatch) return exactMatch;

  const baseType = normalized.split("(")[0].trim();
  const baseMatch = DATA_TYPE_BADGES[baseType] as { bg: string; text: string } | undefined;
  if (baseMatch) return baseMatch;

  if (normalized.includes("[]") || normalized.includes("array")) {
    return DATA_TYPE_BADGES.array;
  }
  return DATA_TYPE_BADGES.string;
}

export function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return json.length > 100 ? json.slice(0, 100) + "..." : json;
  }

  const str = typeof value === "string" ? value : String(value as string | number | boolean);
  return str.length > 100 ? str.slice(0, 100) + "..." : str;
}

export function getFullCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value as string | number | boolean);
}

export function isTruncated(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return json.length > 100;
  }
  if (typeof value === "string") {
    return value.length > 100;
  }
  return false;
}
