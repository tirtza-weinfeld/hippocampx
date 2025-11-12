import { pgTable, index, text, timestamp, uuid, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Enum for tooltip content only
export const tooltipKindEnum = pgEnum('tooltip_kind', [
  'function',
  'method',
  'class',
  'parameter',
  'variable',
  'expression',
  // 'comment'
]);

// ============================================================================
// TABLE 1: code_files
// Registry of all Python files with tooltip data
// Replaces: file paths scattered across all JSON files
// ============================================================================
export const codeFiles = pgTable("code_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  file_path: text("file_path").notNull().unique(),  // "problems/265-paint-house-ii/top-down.py"
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("code_files_path_idx").on(table.file_path),
]);

// ============================================================================
// TABLE 2: symbol_positions
// WHERE symbols/expressions/comments appear in code (for FULL files only)
// Replaces: uses.json (1.9MB) + expressions.json (28K) + comments-inline.json (1.8K)
// No function filtering for now - just get all positions for a file
// ============================================================================
export const symbolPositions = pgTable("symbol_positions", {
  id: uuid("id").defaultRandom().primaryKey(),
  file_id: uuid("file_id")
    .notNull()
    .references(() => codeFiles.id, { onDelete: "cascade" }),
  qname: text("qname").notNull(),
  range_start_line: integer("range_start_line").notNull(),
  range_start_char: integer("range_start_char").notNull(),
  range_end_line: integer("range_end_line").notNull(),
  range_end_char: integer("range_end_char").notNull(),
  name_start_line: integer("name_start_line").notNull(),
  name_start_char: integer("name_start_char").notNull(),
  name_end_line: integer("name_end_line").notNull(),
  name_end_char: integer("name_end_char").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("symbol_positions_file_idx").on(table.file_id),
  index("symbol_positions_qname_idx").on(table.qname),
]);

// ============================================================================
// TABLE 3: tooltip_content
// Tooltip documentation shown on hover
// Replaces: symbol_tags.json (233K) + comments-inline-symbols.json (6.6K)
// ============================================================================
export const tooltipContent = pgTable("tooltip_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  qname: text("qname").notNull().unique(),
  kind: tooltipKindEnum("kind").notNull(),
  name: text("name").notNull(),
  label: text("label"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("tooltip_qname_idx").on(table.qname),
  index("tooltip_kind_idx").on(table.kind),
]);

// Type exports
export type CodeFile = InferSelectModel<typeof codeFiles>;
export type InsertCodeFile = InferInsertModel<typeof codeFiles>;

export type SymbolPosition = InferSelectModel<typeof symbolPositions>;
export type InsertSymbolPosition = InferInsertModel<typeof symbolPositions>;

export type TooltipContent = InferSelectModel<typeof tooltipContent>;
export type InsertTooltipContent = InferInsertModel<typeof tooltipContent>;
