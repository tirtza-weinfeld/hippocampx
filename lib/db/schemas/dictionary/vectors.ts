import { pgTable, varchar, timestamp, index, integer } from "drizzle-orm/pg-core"
import { categories, lexicalEntries, senses, examples } from "./tables"
import { createHalfvec } from "./types"

/**
 * Vector table factories - one table per embedding model
 *
 * Staleness detection: compare source.updated_at > vector.updated_at
 * Vector tables have NO $onUpdate - updatedAt set manually when embedding
 */

/**
 * @example
 * export const categoriesVecBrainA = createCategoryVectorTable("categories_vec_brain_a", 1536)
 */
export function createCategoryVectorTable(name: string, dimensions: number) {
  return pgTable(
    name,
    {
      categoryId: varchar("category_id", { length: 50 })
        .primaryKey()
        .references(() => categories.id, { onDelete: "cascade" }),
      embedding: createHalfvec(dimensions)("embedding").notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index(`idx_${name}_vec`).using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    ]
  )
}

/**
 * @example
 * export const lexicalEntriesVecBrainA = createLexicalEntryVectorTable("lexical_entries_vec_brain_a", 1536)
 */
export function createLexicalEntryVectorTable(name: string, dimensions: number) {
  return pgTable(
    name,
    {
      entryId: integer("entry_id")
        .primaryKey()
        .references(() => lexicalEntries.id, { onDelete: "cascade" }),
      embedding: createHalfvec(dimensions)("embedding").notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index(`idx_${name}_vec`).using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    ]
  )
}

/**
 * @example
 * export const sensesVecBrainA = createSenseVectorTable("senses_vec_brain_a", 1536)
 */
export function createSenseVectorTable(name: string, dimensions: number) {
  return pgTable(
    name,
    {
      senseId: integer("sense_id")
        .primaryKey()
        .references(() => senses.id, { onDelete: "cascade" }),
      embedding: createHalfvec(dimensions)("embedding").notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
      relationScanAt: timestamp("relation_scan_at", { withTimezone: true }),
    },
    (table) => [
      index(`idx_${name}_vec`).using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    ]
  )
}

/**
 * @example
 * export const examplesVecBrainA = createExampleVectorTable("examples_vec_brain_a", 1536)
 */
export function createExampleVectorTable(name: string, dimensions: number) {
  return pgTable(
    name,
    {
      exampleId: integer("example_id")
        .primaryKey()
        .references(() => examples.id, { onDelete: "cascade" }),
      embedding: createHalfvec(dimensions)("embedding").notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    },
    (table) => [
      index(`idx_${name}_vec`).using("hnsw", table.embedding.op("halfvec_cosine_ops")),
    ]
  )
}

// ============================================================================
// CONCRETE TABLES - OpenAI text-embedding-3-small (1536 dims)
// ============================================================================

export const sensesVecOpenai = createSenseVectorTable("senses_vec_openai", 1536)
