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

// 2. Solutions table - from *.py files
export const solutions = pgTable("solutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  problem_id: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  file_name: text("file_name").notNull(),
  code: text("code").notNull(),
  intuition: text("intuition"),
  time_complexity: text("time_complexity"),
  args: jsonb("args").$type<Record<string, string>>(),
  variables: jsonb("variables").$type<Record<string, string>>(),
  expressions: jsonb("expressions").$type<Record<string, string>>(),
  returns: text("returns"),
  order_index: integer("order_index").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("solutions_problem_idx").on(table.problem_id),
  uniqueIndex("solutions_problem_file_unique").on(table.problem_id, table.file_name),
]);

// Type exports
export type Problem = InferSelectModel<typeof problems>;
export type InsertProblem = InferInsertModel<typeof problems>;

export type Solution = InferSelectModel<typeof solutions>;
export type InsertSolution = InferInsertModel<typeof solutions>;
