/**
 * Problems Schema
 */

import { pgTable, index, uniqueIndex, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const symbolKindEnum = pgEnum('symbol_kind', [
  'function', 'method', 'class', 'variable', 'parameter', 'expression', 'comment', 'attribute', 'class_attribute'
]);
export const lspTypeEnum = pgEnum('lsp_type', ['definition', 'reference']);

// Problems table
export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  definition: text("definition"),
  leetcode_url: text("leetcode_url"),
  difficulty: difficultyEnum("difficulty").notNull(),
  topics: text("topics").array(),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
}, (table) => [
  index("problems_slug_idx").on(table.slug),
  index("problems_difficulty_idx").on(table.difficulty),
  index("problems_topics_idx").on(table.topics),
]);

// Solutions table
export const solutions = pgTable("solutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  problem_id: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  file_name: text("file_name").notNull(),
  code: text("code").notNull(),
  intuition: text("intuition"),
  time_complexity: text("time_complexity"),
  order_index: integer("order_index").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("solutions_problem_idx").on(table.problem_id),
  uniqueIndex("solutions_problem_file_unique").on(table.problem_id, table.file_name),
]);

// Symbols table — tooltip content, one row per tooltip-able thing
export const symbols = pgTable("symbols", {
  qname: text("qname").primaryKey(),
  solution_id: uuid("solution_id")
    .notNull()
    .references(() => solutions.id, { onDelete: "cascade" }),
  kind: symbolKindEnum("kind").notNull(),
  summary: text("summary"),
}, (table) => [
  index("symbols_solution_idx").on(table.solution_id),
]);

// LSP table — positional data for definitions and references
export const lsp = pgTable("lsp", {
  id: uuid("id").defaultRandom().primaryKey(),
  solution_id: uuid("solution_id")
    .notNull()
    .references(() => solutions.id, { onDelete: "cascade" }),
  qname: text("qname")
    .notNull()
    .references(() => symbols.qname, { onDelete: "cascade" }),
  type: lspTypeEnum("type").notNull(),
  start_line: integer("start_line").notNull(),
  start_char: integer("start_char").notNull(),
  end_line: integer("end_line").notNull(),
  end_char: integer("end_char").notNull(),
}, (table) => [
  index("lsp_solution_idx").on(table.solution_id),
  index("lsp_qname_idx").on(table.qname),
]);

// Type exports
export type Problem = InferSelectModel<typeof problems>;
export type InsertProblem = InferInsertModel<typeof problems>;

export type Solution = InferSelectModel<typeof solutions>;
export type InsertSolution = InferInsertModel<typeof solutions>;

export type Symbol = InferSelectModel<typeof symbols>;
export type InsertSymbol = InferInsertModel<typeof symbols>;

export type Lsp = InferSelectModel<typeof lsp>;
export type InsertLsp = InferInsertModel<typeof lsp>;
