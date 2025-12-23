/**
 * DICTIONARY SCHEMA - NEURO-SYMBOLIC 2025+
 *
 * Architecture:
 * 1. AI-Curated Graph: Vectors discover, LLM classifies, SQL stores authority.
 * 2. Hybrid Search: Dense (halfvec HNSW) + Sparse (tsvector/trigram).
 * 3. Verification Pipeline: is_synthetic → verification_status → canonical.
 * 4. Edge-Native: Audio stored as URLs (S3/R2), not BLOBs.
 * 5. Data Safety: Half-Precision (FP16) vectors + Zod-validated JSONB.
 *
 * Stack: Neon (Postgres 17) + Drizzle ORM + pgvector 0.8+ + pg_trgm
 */

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import {
  lexicalEntries,
  wordForms,
  senses,
  senseRelations,
  contributors,
  sources,
  sourceCredits,
  sourceParts,
  examples,
  entryAudio,
  categories,
  tags,
  senseTags,
  senseNotations,
} from "./tables";

// Re-export everything
export * from "./types"
export * from "./enums"
export * from "./tables"
export * from "./relations"
export * from "./validators"
export * from "./vectors"

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LexicalEntry = InferSelectModel<typeof lexicalEntries>;
export type InsertLexicalEntry = InferInsertModel<typeof lexicalEntries>;

export type WordForm = InferSelectModel<typeof wordForms>;
export type InsertWordForm = InferInsertModel<typeof wordForms>;

export type Sense = InferSelectModel<typeof senses>;
export type InsertSense = InferInsertModel<typeof senses>;

export type SenseRelation = InferSelectModel<typeof senseRelations>;
export type InsertSenseRelation = InferInsertModel<typeof senseRelations>;

export type Category = InferSelectModel<typeof categories>;
export type InsertCategory = InferInsertModel<typeof categories>;

export type Tag = InferSelectModel<typeof tags>;
export type InsertTag = InferInsertModel<typeof tags>;

export type SenseTag = InferSelectModel<typeof senseTags>;
export type InsertSenseTag = InferInsertModel<typeof senseTags>;

export type SenseNotation = InferSelectModel<typeof senseNotations>;
export type InsertSenseNotation = InferInsertModel<typeof senseNotations>;

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
// COMPOSITE TYPES (API Responses)
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
