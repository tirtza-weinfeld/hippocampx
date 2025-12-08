/**
 * Dictionary Schema - Neon Database
 */

import { pgTable, pgEnum, index, uniqueIndex, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ============================================================================
// Enums
// ============================================================================

export const partOfSpeechEnum = pgEnum("partofspeech", [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "determiner",
  "auxiliary",
  "phrase",
  "other",
]);

export const relationTypeEnum = pgEnum("relationtype", [
  "synonym",
  "antonym",
  "hypernym",
  "hyponym",
  "meronym",
  "holonym",
  "related",
]);

export const sourceTypeEnum = pgEnum("sourcetype", [
  "musical",
  "book",
  "movie",
  "podcast",
  "article",
  "other",
]);

// ============================================================================
// Tables
// ============================================================================

export const words = pgTable("words", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  word_text: varchar("word_text", { length: 255 }).notNull(),
  language_code: varchar("language_code", { length: 10 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_word_text_lower").on(table.word_text),
  index("ix_words_language_code").on(table.language_code),
  uniqueIndex("uq_word_language").on(table.word_text, table.language_code),
]);

export const definitions = pgTable("definitions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  word_id: integer("word_id").notNull().references(() => words.id, { onDelete: "cascade" }),
  definition_text: text("definition_text").notNull(),
  part_of_speech: partOfSpeechEnum("part_of_speech").notNull(),
  order: integer("order").notNull().default(0),
}, (table) => [
  index("ix_definitions_word_id").on(table.word_id),
  index("idx_definition_text").on(table.definition_text),
  uniqueIndex("uq_word_definition_order").on(table.word_id, table.order),
]);

export const sources = pgTable("sources", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: sourceTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
}, (table) => [
  index("ix_sources_type").on(table.type),
  index("ix_sources_title").on(table.title),
  uniqueIndex("uq_source_type_title").on(table.type, table.title),
]);

export const sourceParts = pgTable("source_parts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  source_id: integer("source_id").notNull().references(() => sources.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order"),
}, (table) => [
  index("ix_source_parts_source_id").on(table.source_id),
  index("ix_source_parts_name").on(table.name),
  uniqueIndex("uq_source_part").on(table.source_id, table.name),
]);

export const examples = pgTable("examples", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  definition_id: integer("definition_id").notNull().references(() => definitions.id, { onDelete: "cascade" }),
  example_text: text("example_text").notNull(),
  source_part_id: integer("source_part_id").references(() => sourceParts.id, { onDelete: "set null" }),
}, (table) => [
  index("ix_examples_definition_id").on(table.definition_id),
  index("idx_example_text").on(table.example_text),
  index("ix_examples_source_part_id").on(table.source_part_id),
]);

export const tags = pgTable("tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
}, (table) => [
  index("ix_tags_name").on(table.name),
]);

export const wordTags = pgTable("word_tags", {
  word_id: integer("word_id").notNull().references(() => words.id, { onDelete: "cascade" }),
  tag_id: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => [
  index("idx_word_tag").on(table.word_id, table.tag_id),
]);

export const wordRelations = pgTable("word_relations", {
  word_id_1: integer("word_id_1").notNull().references(() => words.id, { onDelete: "cascade" }),
  word_id_2: integer("word_id_2").notNull().references(() => words.id, { onDelete: "cascade" }),
  relation_type: relationTypeEnum("relation_type").notNull(),
}, (table) => [
  index("idx_word_relation").on(table.word_id_1, table.word_id_2, table.relation_type),
  index("ix_word_relations_relation_type").on(table.relation_type),
]);

export const wordForms = pgTable("word_forms", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  word_id: integer("word_id").notNull().references(() => words.id, { onDelete: "cascade" }),
  form_text: varchar("form_text", { length: 255 }).notNull(),
  form_type: varchar("form_type", { length: 50 }),
}, (table) => [
  index("ix_word_forms_word_id").on(table.word_id),
  index("idx_form_text").on(table.form_text),
  uniqueIndex("uq_word_form").on(table.word_id, table.form_text),
]);

// ============================================================================
// Type Exports
// ============================================================================

export type Word = InferSelectModel<typeof words>;
export type InsertWord = InferInsertModel<typeof words>;

export type Definition = InferSelectModel<typeof definitions>;
export type InsertDefinition = InferInsertModel<typeof definitions>;

export type Example = InferSelectModel<typeof examples>;
export type InsertExample = InferInsertModel<typeof examples>;

export type Tag = InferSelectModel<typeof tags>;
export type InsertTag = InferInsertModel<typeof tags>;

export type WordTag = InferSelectModel<typeof wordTags>;
export type InsertWordTag = InferInsertModel<typeof wordTags>;

export type WordRelation = InferSelectModel<typeof wordRelations>;
export type InsertWordRelation = InferInsertModel<typeof wordRelations>;

export type WordForm = InferSelectModel<typeof wordForms>;
export type InsertWordForm = InferInsertModel<typeof wordForms>;

export type Source = InferSelectModel<typeof sources>;
export type InsertSource = InferInsertModel<typeof sources>;

export type SourcePart = InferSelectModel<typeof sourceParts>;
export type InsertSourcePart = InferInsertModel<typeof sourceParts>;

// ============================================================================
// Composite Types
// ============================================================================

export type WordSerialized = Omit<Word, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type DefinitionSerialized = Omit<Definition, "part_of_speech"> & {
  part_of_speech: string | null;
  created_at?: string;
};

export type ExampleSerialized = Example & {
  created_at?: string;
  source_part_name?: string | null;
  source_title?: string | null;
  source_type?: string | null;
};

export type TagSerialized = Tag & {
  created_at?: string;
};

export type DefinitionWithExamples = DefinitionSerialized & {
  examples: ExampleSerialized[];
};

export type WordWithDefinitions = WordSerialized & {
  definitions: DefinitionSerialized[];
};

export type WordComplete = WordSerialized & {
  definitions: DefinitionWithExamples[];
  tags: TagSerialized[];
  relations: Array<{
    word_id_1: number;
    word_id_2: number;
    relation_type: string;
    related_word_text: string;
    related_word_id: number;
  }>;
};
