

import { pgTable, index, text, jsonb, timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const DifficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);




const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  // deleted_at: timestamp(),
}


export const algorithms = pgTable("algorithms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  bestCase: text("best_case").notNull(),
  averageCase: text("average_case").notNull(),
  worstCase: text("worst_case").notNull(),
});





export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().unique(),
  text: text("text").notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  hints: jsonb("hints").default([]).notNull(),
  explanation: text("explanation").notNull(),

  description: text("description"),
  difficulty: DifficultyEnum("difficulty"),
  metadata: jsonb("metadata").default({}),

  ...timestamps,
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
},

  (table) => [
    index("difficulty_idx").on(table.difficulty),
    index("category_idx").on(table.categoryId),
  ]);


export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  ...timestamps
});




export const terms = pgTable("terms", {
  id: uuid("id").primaryKey().defaultRandom(),
  term: text("term").notNull(),
  definition: jsonb("definition").notNull(),
  ...timestamps,
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

});

export type Term = Omit<InferSelectModel<typeof terms>, 'definition'> & { definition: string };

export type Category = InferSelectModel<typeof categories>;

export type Question = Omit<InferSelectModel<typeof questions>,
  'options' | 'hints'> & { options: string[], hints: string[] };



