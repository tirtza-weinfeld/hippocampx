/**
 * Drizzle ORM relations for dictionary schema
 */

import { relations } from "drizzle-orm";

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
} from "./tables";

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

export const categoriesRelations = relations(categories, ({ many }) => ({
  tags: many(tags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  category: one(categories, {
    fields: [tags.categoryId],
    references: [categories.id],
  }),
  senses: many(senseTags),
}));

export const senseTagsRelations = relations(senseTags, ({ one }) => ({
  sense: one(senses, { fields: [senseTags.sense_id], references: [senses.id] }),
  tag: one(tags, { fields: [senseTags.tag_id], references: [tags.id] }),
}));

export const entryAudioRelations = relations(entryAudio, ({ one }) => ({
  entry: one(lexicalEntries, { fields: [entryAudio.entry_id], references: [lexicalEntries.id] }),
}));
