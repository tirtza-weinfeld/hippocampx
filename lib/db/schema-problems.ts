import { pgTable, index, uniqueIndex, text, timestamp, uuid, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Enums
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

// 1. Problems table - all problem info
export const problems = pgTable("problems", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  number: integer("number"),
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

// 2. Solutions table - just code
export const solutions = pgTable("solutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  problem_id: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  file_name: text("file_name").notNull(),
  code: text("code").notNull(),
  order_index: integer("order_index").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("solutions_problem_idx").on(table.problem_id),
  uniqueIndex("solutions_problem_file_unique").on(table.problem_id, table.file_name),
]);

// 3. Symbols table - ALL tooltip/docstring metadata (unified)
export const symbols = pgTable("symbols", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Reference (nullable for core algorithms)
  solution_id: uuid("solution_id")
    .references(() => solutions.id, { onDelete: "cascade" }),

  // Identifier
  qname: text("qname").notNull().unique(), // "1235:bottom_up.py:maximum_profit_in_job_scheduling.dp"

  // Type and name
  kind: text("kind").notNull(), // 'function' | 'variable' | 'expression' | 'arg' | 'method' | 'class' | 'solution'
  name: text("name").notNull(), // "dp" or "nums" or "if k <= 1" or function name

  // Content
  content: text("content"), // The main tooltip text/description
  metadata: jsonb("metadata"), // Extra data: { intuition, time_complexity, code, label, etc. }

  // Hierarchy (self-reference)
  parent_id: uuid("parent_id"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("symbols_qname_idx").on(table.qname),
  index("symbols_solution_idx").on(table.solution_id),
  index("symbols_parent_idx").on(table.parent_id),
  index("symbols_kind_idx").on(table.kind),
]);

// Type exports
export type Problem = InferSelectModel<typeof problems>;
export type InsertProblem = InferInsertModel<typeof problems>;

export type Solution = InferSelectModel<typeof solutions>;
export type InsertSolution = InferInsertModel<typeof solutions>;

export type Symbol = InferSelectModel<typeof symbols>;
export type InsertSymbol = InferInsertModel<typeof symbols>;
