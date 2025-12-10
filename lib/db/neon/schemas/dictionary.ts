/**
 * DICTIONARY SCHEMA - INDUSTRY 2026 "BLEEDING EDGE" (FINAL)
 *
 * Architecture:
 * 1. GraphRAG-Ready: Recursive hierarchy for Source Parts (Musical -> Act -> Song).
 * 2. Hybrid Search: Vectors (Semantic) + tsvector/Trigram (Exact/Fuzzy) co-located.
 * 3. Edge-Native: Audio stored as URLs (S3/R2), not BLOBs.
 * 4. AI-Safe: Half-Precision (FP16) vectors for max performance/recall balance.
 * 5. Data Safety: Full Zod Integration for complex Polyglot JSONB.
 *
 * Prerequisites:
 *   CREATE EXTENSION IF NOT EXISTS vector;
 *   CREATE EXTENSION IF NOT EXISTS pg_trgm;
 *
 * Stack: Neon (Postgres 17) + Drizzle ORM + pgvector 0.7+ + pg_trgm
 */

import {
  pgTable,
  pgEnum,
  index,
  uniqueIndex,
  text,
  timestamp,
  integer,
  varchar,
  customType,
  boolean,
  jsonb,
  real,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations, sql, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { z } from "zod";

// ============================================================================
// 1. CUSTOM TYPES
// ============================================================================

/**
 * HALF-PRECISION VECTOR (FP16)
 * Cuts RAM/Storage by 50% vs FP32. Requires pgvector 0.7.0+
 */
const halfvec = customType<{ data: number[]; driverData: string }>({
  dataType: () => "halfvec(1536)",
  toDriver: (value) => `[${value.join(",")}]`,
  fromDriver: (value) => {
    if (typeof value === "string") {
      const trimmed = value.replace(/^\[|\]$/g, "");
      return trimmed.split(",").map(Number);
    }
    return value as number[];
  },
});

// NOTE: tsvector columns should be created via raw SQL migration:
// ALTER TABLE examples ADD COLUMN search_vector tsvector
//   GENERATED ALWAYS AS (
//     to_tsvector(
//       CASE language_code
//         WHEN 'en' THEN 'english'::regconfig
//         WHEN 'de' THEN 'german'::regconfig
//         WHEN 'it' THEN 'italian'::regconfig
//         WHEN 'ar' THEN 'arabic'::regconfig
//         ELSE 'simple'::regconfig
//       END,
//       text
//     )
//   ) STORED;
// CREATE INDEX idx_example_search ON examples USING gin(search_vector);

// ============================================================================
// 2. ENUMS
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
  "article",
  "particle",
  "numeral",
  "symbol",
]);

export const relationTypeEnum = pgEnum("relationtype", [
  "translation",
  "synonym",
  "antonym",
  "hypernym",
  "hyponym",
  "meronym",
  "holonym",
  "nuance",
]);

export const sourceTypeEnum = pgEnum("sourcetype", [
  "book",
  "movie",
  "article",
  "academic_paper",
  "conversation",
  "synthetic_ai",
  "musical",
  "podcast",
]);

export const creditRoleEnum = pgEnum("creditrole", [
  "author",
  "artist",
  "composer",
  "lyricist",
  "playwright",
  "director",
  "host",
]);

// ============================================================================
// 3. CORE TABLES (Lexical Hierarchy)
// ============================================================================

export const lexicalEntries = pgTable(
  "lexical_entries",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    lemma: varchar("lemma", { length: 255 }).notNull(),
    part_of_speech: partOfSpeechEnum("part_of_speech").notNull(),
    language_code: varchar("language_code", { length: 5 }).notNull().default("en"),

    embedding: halfvec("embedding"),
    metadata: jsonb("metadata"),

    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_lemma_lang_pos").on(table.lemma, table.language_code, table.part_of_speech),
    index("idx_entry_embedding").using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    index("idx_entry_lemma_trgm").using("gin", sql.raw(`"lemma" gin_trgm_ops`)),
  ]
);

export const wordForms = pgTable(
  "word_forms",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    entry_id: integer("entry_id")
      .notNull()
      .references(() => lexicalEntries.id, { onDelete: "cascade" }),

    form_text: varchar("form_text", { length: 255 }).notNull(),
    grammatical_features: jsonb("grammatical_features").notNull(),
  },
  (table) => [
    index("idx_form_entry").on(table.entry_id),
    index("idx_form_text").on(table.form_text),
    index("idx_form_text_trgm").using("gin", sql.raw(`"form_text" gin_trgm_ops`)),
    index("idx_grammar").using("gin", table.grammatical_features),
  ]
);

export const senses = pgTable(
  "senses",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    entry_id: integer("entry_id")
      .notNull()
      .references(() => lexicalEntries.id, { onDelete: "cascade" }),

    definition: text("definition").notNull(),
    order_index: integer("order_index").default(0), // Display order (0 = primary sense)
    embedding: halfvec("embedding"),

    is_synthetic: boolean("is_synthetic").default(false),
    verification_status: varchar("verification_status", { length: 50 }).default("unverified"),
  },
  (table) => [
    index("idx_sense_entry").on(table.entry_id),
    index("idx_sense_embedding").using("hnsw", table.embedding.op("halfvec_cosine_ops")),
  ]
);

// ============================================================================
// 4. KNOWLEDGE GRAPH (Relations)
// ============================================================================

export const senseRelations = pgTable(
  "sense_relations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    source_sense_id: integer("source_sense_id")
      .notNull()
      .references(() => senses.id, { onDelete: "cascade" }),
    target_sense_id: integer("target_sense_id")
      .notNull()
      .references(() => senses.id, { onDelete: "cascade" }),

    relation_type: relationTypeEnum("relation_type").notNull(),
    strength: integer("strength").default(100),
    explanation: text("explanation"),
  },
  (table) => [
    index("idx_relation_source").on(table.source_sense_id),
    index("idx_relation_target").on(table.target_sense_id),
    uniqueIndex("uq_sense_relation").on(
      table.source_sense_id,
      table.target_sense_id,
      table.relation_type
    ),
  ]
);

// ============================================================================
// 5. SOURCES & CITATIONS (GraphRAG Ready)
// ============================================================================

/**
 * Contributors (authors, composers, etc.)
 * NOTE: No unique constraint on name - multiple people can share names.
 * Use metadata jsonb for disambiguation (wikidata ID, birth year, etc.)
 * Handle deduplication in seeding/application logic.
 */
export const contributors = pgTable(
  "contributors",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).default("person"),
    metadata: jsonb("metadata"), // { wikidata: "Q123", imdb: "nm456", born: 1948 }
  },
  () => [index("idx_contributor_name_trgm").using("gin", sql.raw(`"name" gin_trgm_ops`))]
);

export const sources = pgTable(
  "sources",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    type: sourceTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    publication_year: integer("publication_year"),
    reliability_score: real("reliability_score").default(0.5),
    metadata: jsonb("metadata"),
  },
  () => [index("idx_source_title_trgm").using("gin", sql.raw(`"title" gin_trgm_ops`))]
);

export const sourceCredits = pgTable(
  "source_credits",
  {
    source_id: integer("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    contributor_id: integer("contributor_id")
      .notNull()
      .references(() => contributors.id, { onDelete: "cascade" }),
    role: creditRoleEnum("role").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.source_id, table.contributor_id, table.role] }),
    index("idx_credits_lookup").on(table.contributor_id, table.role),
  ]
);

/**
 * RECURSIVE HIERARCHY
 * Allows: Wicked (Source) -> Act 1 (Part) -> Defying Gravity (Part)
 */
export const sourceParts = pgTable(
  "source_parts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    source_id: integer("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),

    parent_part_id: integer("parent_part_id"),

    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }),
    order_index: integer("order_index"),
  },
  (table) => [
    index("idx_source_parts_source").on(table.source_id),
    index("idx_source_parts_parent").on(table.parent_part_id),
    uniqueIndex("uq_source_part").on(table.source_id, table.parent_part_id, table.name),
    foreignKey({
      columns: [table.parent_part_id],
      foreignColumns: [table.id],
      name: "fk_source_parts_parent",
    }).onDelete("cascade"),
  ]
);

export const examples = pgTable(
  "examples",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    sense_id: integer("sense_id")
      .notNull()
      .references(() => senses.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    language_code: varchar("language_code", { length: 5 }).default("en"), // For multilingual tsvector
    source_part_id: integer("source_part_id").references(() => sourceParts.id, {
      onDelete: "set null",
    }),

    embedding: halfvec("embedding"),
    // NOTE: cached_citation can become stale if source/contributor changes.
    // Sources rarely change; rebuild cache manually if needed.
    cached_citation: varchar("cached_citation", { length: 255 }),
  },
  (table) => [
    index("idx_example_sense").on(table.sense_id),
    index("idx_example_source_part").on(table.source_part_id),
    index("idx_example_embedding").using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    index("idx_example_text_trgm").using("gin", sql.raw(`"text" gin_trgm_ops`)),
  ]
);

// ============================================================================
// 6. AUDIO & TAGS
// ============================================================================

export const entryAudio = pgTable(
  "entry_audio",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    entry_id: integer("entry_id")
      .notNull()
      .references(() => lexicalEntries.id, { onDelete: "cascade" }),

    audio_url: varchar("audio_url", { length: 512 }).notNull(),
    transcript: text("transcript"),
    duration_ms: integer("duration_ms"),
    accent_code: varchar("accent_code", { length: 10 }).default("en-US"),
    content_type: varchar("content_type", { length: 50 }).default("audio/mpeg"),
  },
  (table) => [index("idx_audio_entry").on(table.entry_id)]
);

export const tags = pgTable("tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }),
});

export const senseTags = pgTable(
  "sense_tags",
  {
    sense_id: integer("sense_id")
      .notNull()
      .references(() => senses.id, { onDelete: "cascade" }),
    tag_id: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    explanation: text("explanation"), // Why this tag? e.g., "Formal register - used in academic writing"
  },
  (table) => [primaryKey({ columns: [table.sense_id, table.tag_id] })]
);

// ============================================================================
// 7. DRIZZLE RELATIONS
// ============================================================================

export const lexicalEntriesRelations = relations(lexicalEntries, ({ many }) => ({
  forms: many(wordForms),
  senses: many(senses),
  audio: many(entryAudio),
}));

export const wordFormsRelations = relations(wordForms, ({ one }) => ({
  entry: one(lexicalEntries, { fields: [wordForms.entry_id], references: [lexicalEntries.id] }),
}));

export const sensesRelations = relations(senses, ({ one, many }) => ({
  entry: one(lexicalEntries, { fields: [senses.entry_id], references: [lexicalEntries.id] }),
  examples: many(examples),
  tags: many(senseTags),
  outgoingRelations: many(senseRelations, { relationName: "sourceRelation" }),
  incomingRelations: many(senseRelations, { relationName: "targetRelation" }),
}));

export const senseRelationsRelations = relations(senseRelations, ({ one }) => ({
  source: one(senses, {
    fields: [senseRelations.source_sense_id],
    references: [senses.id],
    relationName: "sourceRelation",
  }),
  target: one(senses, {
    fields: [senseRelations.target_sense_id],
    references: [senses.id],
    relationName: "targetRelation",
  }),
}));

export const contributorsRelations = relations(contributors, ({ many }) => ({
  credits: many(sourceCredits),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  credits: many(sourceCredits),
  parts: many(sourceParts),
}));

export const sourceCreditsRelations = relations(sourceCredits, ({ one }) => ({
  source: one(sources, { fields: [sourceCredits.source_id], references: [sources.id] }),
  contributor: one(contributors, {
    fields: [sourceCredits.contributor_id],
    references: [contributors.id],
  }),
}));

export const sourcePartsRelations = relations(sourceParts, ({ one, many }) => ({
  source: one(sources, { fields: [sourceParts.source_id], references: [sources.id] }),
  parent: one(sourceParts, {
    fields: [sourceParts.parent_part_id],
    references: [sourceParts.id],
    relationName: "part_hierarchy",
  }),
  children: many(sourceParts, { relationName: "part_hierarchy" }),
}));

export const examplesRelations = relations(examples, ({ one }) => ({
  sense: one(senses, { fields: [examples.sense_id], references: [senses.id] }),
  sourcePart: one(sourceParts, { fields: [examples.source_part_id], references: [sourceParts.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  senses: many(senseTags),
}));

export const senseTagsRelations = relations(senseTags, ({ one }) => ({
  sense: one(senses, { fields: [senseTags.sense_id], references: [senses.id] }),
  tag: one(tags, { fields: [senseTags.tag_id], references: [tags.id] }),
}));

export const entryAudioRelations = relations(entryAudio, ({ one }) => ({
  entry: one(lexicalEntries, { fields: [entryAudio.entry_id], references: [lexicalEntries.id] }),
}));

// ============================================================================
// 8. ZOD VALIDATORS
// ============================================================================

export const EnglishGrammarSchema = z.object({
  tense: z.enum(["past", "present", "future"]).optional(),
  number: z.enum(["singular", "plural"]).optional(),
  person: z.enum(["1st", "2nd", "3rd"]).optional(),
  participle: z.enum(["present", "past"]).optional(),
  degree: z.enum(["positive", "comparative", "superlative"]).optional(),
});

export const GermanGrammarSchema = z.object({
  case: z.enum(["nominative", "accusative", "dative", "genitive"]),
  number: z.enum(["singular", "plural"]),
  gender: z.enum(["masculine", "feminine", "neuter"]).optional(),
  degree: z.enum(["positive", "comparative", "superlative"]).optional(),
});

export const ItalianGrammarSchema = z.object({
  gender: z.enum(["masculine", "feminine"]),
  number: z.enum(["singular", "plural"]),
});

export const ArabicGrammarSchema = z.object({
  root: z.string().regex(/^[a-z]-[a-z]-[a-z]$/),
  pattern: z.string(),
  state: z.enum(["definite", "indefinite", "construct"]),
});

export const PolyglotGrammarSchema = z.union([
  EnglishGrammarSchema,
  GermanGrammarSchema,
  ItalianGrammarSchema,
  ArabicGrammarSchema,
]);

// ============================================================================
// 9. TYPE EXPORTS
// ============================================================================

export type LexicalEntry = InferSelectModel<typeof lexicalEntries>;
export type InsertLexicalEntry = InferInsertModel<typeof lexicalEntries>;

export type WordForm = InferSelectModel<typeof wordForms>;
export type InsertWordForm = InferInsertModel<typeof wordForms>;

export type Sense = InferSelectModel<typeof senses>;
export type InsertSense = InferInsertModel<typeof senses>;

export type SenseRelation = InferSelectModel<typeof senseRelations>;
export type InsertSenseRelation = InferInsertModel<typeof senseRelations>;

export type Tag = InferSelectModel<typeof tags>;
export type InsertTag = InferInsertModel<typeof tags>;

export type SenseTag = InferSelectModel<typeof senseTags>;
export type InsertSenseTag = InferInsertModel<typeof senseTags>;

export type Contributor = InferSelectModel<typeof contributors>;
export type InsertContributor = InferInsertModel<typeof contributors>;

export type Source = InferSelectModel<typeof sources>;
export type InsertSource = InferInsertModel<typeof sources>;

export type SourceCredit = InferSelectModel<typeof sourceCredits>;
export type InsertSourceCredit = InferInsertModel<typeof sourceCredits>;

export type SourcePart = InferSelectModel<typeof sourceParts>;
export type InsertSourcePart = InferInsertModel<typeof sourceParts>;

export type Example = InferSelectModel<typeof examples>;
export type InsertExample = InferInsertModel<typeof examples>;

export type EntryAudio = InferSelectModel<typeof entryAudio>;
export type InsertEntryAudio = InferInsertModel<typeof entryAudio>;

// ============================================================================
// 10. COMPOSITE TYPES (API Responses)
// ============================================================================

export type SourceWithMeta = Source & {
  credits: (SourceCredit & { contributor: Contributor })[];
  parts: SourcePart[];
};

export type SenseWithDetails = Sense & {
  examples: (Example & { sourcePart?: SourcePart & { source?: Source } })[];
  tags: (SenseTag & { tag: Tag })[];
  outgoingRelations: (SenseRelation & { target: Sense })[];
};

export type LexicalEntryComplete = LexicalEntry & {
  forms: WordForm[];
  senses: SenseWithDetails[];
  audio: EntryAudio[];
};
