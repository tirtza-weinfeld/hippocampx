import { pgTable, varchar, integer, text, timestamp, serial, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const collectionType = pgEnum("collection_type", ['musical', 'album', 'soundtrack', 'movie', 'tv_show', 'single', 'other'])
export const partofspeech = pgEnum("partofspeech", ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'auxiliary', 'phrase', 'other'])
export const relationtype = pgEnum("relationtype", ['synonym', 'antonym', 'hypernym', 'hyponym', 'meronym', 'holonym', 'related'])


export const alembicVersion = pgTable("alembic_version", {
	versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const songs = pgTable("songs", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "songs_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: varchar({ length: 255 }).notNull(),
	lyrics: text().notNull(),
	collectionId: integer("collection_id").notNull(),
	trackNumber: integer("track_number").notNull(),
	composer: varchar({ length: 255 }),
	lyricist: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const tags = pgTable("tags", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
});

export const words = pgTable("words", {
	id: serial().primaryKey().notNull(),
	wordText: varchar("word_text", { length: 255 }).notNull(),
	languageCode: varchar("language_code", { length: 10 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_word_text_lower").using("btree", table.wordText.asc().nullsLast().op("text_ops")),
	index("ix_words_language_code").using("btree", table.languageCode.asc().nullsLast().op("text_ops")),
]);

export const wordTags = pgTable("word_tags", {
	wordId: integer("word_id").notNull(),
	tagId: integer("tag_id").notNull(),
}, (table) => [
	index("idx_word_tag").using("btree", table.wordId.asc().nullsLast().op("int4_ops"), table.tagId.asc().nullsLast().op("int4_ops")),
]);

export const wordRelations = pgTable("word_relations", {
	wordId1: integer("word_id_1").notNull(),
	wordId2: integer("word_id_2").notNull(),
	relationType: varchar("relation_type", { length: 50 }).notNull(),
}, (table) => [
	index("idx_word_relation").using("btree", table.wordId1.asc().nullsLast().op("int4_ops"), table.wordId2.asc().nullsLast().op("int4_ops"), table.relationType.asc().nullsLast().op("int4_ops")),
	index("ix_word_relations_relation_type").using("btree", table.relationType.asc().nullsLast().op("text_ops")),
]);

export const wordForms = pgTable("word_forms", {
	id: serial().primaryKey().notNull(),
	wordId: integer("word_id").notNull(),
	formText: varchar("form_text", { length: 255 }).notNull(),
	formType: varchar("form_type", { length: 50 }),
}, (table) => [
	index("idx_form_text").using("btree", table.formText.asc().nullsLast().op("text_ops")),
	index("ix_word_forms_word_id").using("btree", table.wordId.asc().nullsLast().op("int4_ops")),
]);

export const definitions = pgTable("definitions", {
	id: serial().primaryKey().notNull(),
	wordId: integer("word_id").notNull(),
	definitionText: text("definition_text").notNull(),
	partOfSpeech: varchar("part_of_speech", { length: 50 }).notNull(),
	order: integer().notNull(),
}, (table) => [
	index("idx_definition_text").using("btree", table.definitionText.asc().nullsLast().op("text_ops")),
	index("ix_definitions_word_id").using("btree", table.wordId.asc().nullsLast().op("int4_ops")),
]);

export const examples = pgTable("examples", {
	id: serial().primaryKey().notNull(),
	definitionId: integer("definition_id").notNull(),
	exampleText: text("example_text").notNull(),
	source: varchar({ length: 255 }),
}, (table) => [
	index("idx_example_text").using("btree", table.exampleText.asc().nullsLast().op("text_ops")),
	index("ix_examples_definition_id").using("btree", table.definitionId.asc().nullsLast().op("int4_ops")),
]);

export const collections = pgTable("collections", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "collections_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	title: varchar({ length: 255 }).notNull(),
	type: collectionType().notNull(),
	year: integer(),
	imageUrl: varchar("image_url", { length: 500 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
