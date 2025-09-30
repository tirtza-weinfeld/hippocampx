import { pgTable, index, text,  timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";

export const PartOfSpeechEnum = pgEnum('part_of_speech', [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection',
  'determiner'
]);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
};

export const words = pgTable("words", {
  id: uuid("id").defaultRandom().primaryKey(),
  word: text("word").notNull().unique(),
  pronunciation: text("pronunciation"),
  audioUrl: text("audio_url"),
  usage: integer("usage"), // Popularity score (0-100, higher = more common)
  ...timestamps,
}, (table) => [
  index("word_idx").on(table.word),
  index("word_usage_idx").on(table.usage),
]);

export const definitions = pgTable("definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  partOfSpeech: PartOfSpeechEnum("part_of_speech").notNull(),
  definition: text("definition").notNull(),
  example: text("example"),
  orderIndex: text("order_index").notNull(), // e.g., "1", "2", etc.
  ...timestamps,
}, (table) => [
  index("definitions_word_id_idx").on(table.wordId),
  index("definitions_part_of_speech_idx").on(table.partOfSpeech),
]);

export const synonyms = pgTable("synonyms", {
  id: uuid("id").defaultRandom().primaryKey(),
  definitionId: uuid("definition_id")
    .notNull()
    .references(() => definitions.id, { onDelete: "cascade" }),
  synonym: text("synonym").notNull(),
  ...timestamps,
}, (table) => [
  index("synonyms_definition_id_idx").on(table.definitionId),
]);

export const antonyms = pgTable("antonyms", {
  id: uuid("id").defaultRandom().primaryKey(),
  definitionId: uuid("definition_id")
    .notNull()
    .references(() => definitions.id, { onDelete: "cascade" }),
  antonym: text("antonym").notNull(),
  ...timestamps,
}, (table) => [
  index("antonyms_definition_id_idx").on(table.definitionId),
]);

export const phrases = pgTable("phrases", {
  id: uuid("id").defaultRandom().primaryKey(),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  phrase: text("phrase").notNull(),
  definition: text("definition").notNull(),
  example: text("example"),
  ...timestamps,
}, (table) => [
  index("phrases_word_id_idx").on(table.wordId),
]);

export const relatedWords = pgTable("related_words", {
  id: uuid("id").defaultRandom().primaryKey(),
  definitionId: uuid("definition_id")
    .notNull()
    .references(() => definitions.id, { onDelete: "cascade" }),
  relatedWord: text("related_word").notNull(),
  relationshipType: text("relationship_type"), // e.g., "similar", "opposite", "related"
  ...timestamps,
}, (table) => [
  index("related_words_definition_id_idx").on(table.definitionId),
]);

export const wordForms = pgTable("word_forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  formType: text("form_type").notNull(), // e.g., "plural", "past_tense", "gerund", "participle"
  form: text("form").notNull(),
  ...timestamps,
}, (table) => [
  index("word_forms_word_id_idx").on(table.wordId),
]);

// Type exports
export type Word = InferSelectModel<typeof words>;
export type Definition = InferSelectModel<typeof definitions>;
export type Synonym = InferSelectModel<typeof synonyms>;
export type Antonym = InferSelectModel<typeof antonyms>;
export type Phrase = InferSelectModel<typeof phrases>;
export type RelatedWord = InferSelectModel<typeof relatedWords>;
export type WordForm = InferSelectModel<typeof wordForms>;

// Compound types for fetching with relations
export type WordWithDefinitions = Word & {
  definitions: (Definition & {
    synonyms: Synonym[];
    antonyms: Antonym[];
    relatedWords: RelatedWord[];
  })[];
  phrases: Phrase[];
  wordForms: WordForm[];
};