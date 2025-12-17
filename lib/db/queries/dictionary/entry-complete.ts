/**
 * Entry Complete - Full lexical entry with senses, tags, relations
 *
 * Optimized with JOINs for efficient data loading.
 * Uses cache() for request deduplication.
 */

import "server-only";

import { cacheLife } from "next/cache";
import { eq, and, asc, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { neonDb } from "../../connection";
import {
  lexicalEntries,
  wordForms,
  senses,
  examples,
  senseRelations,
  sourceParts,
  sources,
  entryAudio,
  type LexicalEntry,
} from "../../schemas/dictionary";
import type {
  EntryComplete,
  SenseWithDetails,
  SenseRelationInfo,
  WordFormInfo,
  AudioInfo,
} from "./types";

// ============================================================================
// BASIC ENTRY FETCH
// ============================================================================

interface EntryBasic {
  id: number;
  lemma: string;
  partOfSpeech: string;
  languageCode: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

function serializeEntry(entry: LexicalEntry): EntryBasic {
  return {
    id: entry.id,
    lemma: entry.lemma,
    partOfSpeech: entry.part_of_speech,
    languageCode: entry.language_code,
    metadata: entry.metadata as Record<string, unknown> | null,
    createdAt: entry.created_at?.toISOString() ?? new Date().toISOString(),
    updatedAt: entry.updated_at?.toISOString() ?? new Date().toISOString(),
  };
}

/** Fetch basic entry data (for header/immediate render) */
export async function fetchEntryBasic(
  lemma: string,
  languageCode: string = "en"
): Promise<EntryBasic | null> {
  'use cache'
  cacheLife('hours')

  const result = await neonDb
    .select()
    .from(lexicalEntries)
    .where(and(
      eq(lexicalEntries.lemma, lemma),
      eq(lexicalEntries.language_code, languageCode)
    ));

  const entry = result.at(0);
  return entry ? serializeEntry(entry) : null;
}

// ============================================================================
// SENSES WITH EXAMPLES
// ============================================================================

/** Fetch senses with examples for an entry */
export async function fetchSensesByEntryId(entryId: number): Promise<SenseWithDetails[]> {
  'use cache'
  cacheLife('hours')

  const rows = await neonDb
    .select({
      sense_id: senses.id,
      sense_definition: senses.definition,
      sense_order: senses.order_index,
      sense_is_synthetic: senses.is_synthetic,
      sense_verification: senses.verification_status,
      ex_id: examples.id,
      ex_text: examples.text,
      ex_citation: examples.cached_citation,
      ex_source_part_id: examples.source_part_id,
      sp_name: sourceParts.name,
      src_title: sources.title,
      src_type: sources.type,
    })
    .from(senses)
    .leftJoin(examples, eq(senses.id, examples.sense_id))
    .leftJoin(sourceParts, eq(examples.source_part_id, sourceParts.id))
    .leftJoin(sources, eq(sourceParts.source_id, sources.id))
    .where(eq(senses.entry_id, entryId))
    .orderBy(asc(senses.order_index));

  const senseMap = new Map<number, {
    sense: SenseWithDetails;
    exampleIds: Set<number>;
  }>();

  for (const row of rows) {
    if (!senseMap.has(row.sense_id)) {
      senseMap.set(row.sense_id, {
        sense: {
          id: row.sense_id,
          definition: row.sense_definition,
          orderIndex: row.sense_order ?? 0,
          isSynthetic: row.sense_is_synthetic ?? false,
          verificationStatus: row.sense_verification,
          examples: [],
        },
        exampleIds: new Set(),
      });
    }
    const senseEntry = senseMap.get(row.sense_id);
    if (row.ex_id && row.ex_text && senseEntry && !senseEntry.exampleIds.has(row.ex_id)) {
      senseEntry.exampleIds.add(row.ex_id);
      senseEntry.sense.examples.push({
        id: row.ex_id,
        text: row.ex_text,
        cachedCitation: row.ex_citation,
        sourcePartId: row.ex_source_part_id,
        sourcePartName: row.sp_name,
        sourceTitle: row.src_title,
        sourceType: row.src_type,
      });
    }
  }

  // Build result preserving order
  const result: SenseWithDetails[] = [];
  const seen = new Set<number>();
  for (const row of rows) {
    if (!seen.has(row.sense_id)) {
      seen.add(row.sense_id);
      const entry = senseMap.get(row.sense_id);
      if (entry) {
        result.push(entry.sense);
      }
    }
  }
  return result;
}

// ============================================================================
// WORD FORMS
// ============================================================================

/** Fetch word forms for an entry */
export async function fetchFormsByEntryId(entryId: number): Promise<WordFormInfo[]> {
  'use cache'
  cacheLife('hours')

  const result = await neonDb
    .select({
      id: wordForms.id,
      form_text: wordForms.form_text,
      grammatical_features: wordForms.grammatical_features,
    })
    .from(wordForms)
    .where(eq(wordForms.entry_id, entryId));

  return result.map(r => ({
    id: r.id,
    formText: r.form_text,
    grammaticalFeatures: r.grammatical_features as Record<string, unknown>,
  }));
}

// ============================================================================
// AUDIO
// ============================================================================

/** Fetch audio for an entry */
export async function fetchAudioByEntryId(entryId: number): Promise<AudioInfo[]> {
  'use cache'
  cacheLife('hours')

  const result = await neonDb
    .select()
    .from(entryAudio)
    .where(eq(entryAudio.entry_id, entryId));

  return result.map(r => ({
    id: r.id,
    audioUrl: r.audio_url,
    transcript: r.transcript,
    durationMs: r.duration_ms,
    accentCode: r.accent_code,
    contentType: r.content_type,
  }));
}

// ============================================================================
// SENSE RELATIONS
// ============================================================================

/** Fetch sense relations (outgoing from entry's senses) */
export async function fetchSenseRelationsByEntryId(entryId: number): Promise<SenseRelationInfo[]> {
  'use cache'
  cacheLife('hours')

  const targetSense = alias(senses, "target_sense");
  const targetEntry = alias(lexicalEntries, "target_entry");

  // First get all sense IDs for this entry
  const entrySenses = await neonDb
    .select({ id: senses.id })
    .from(senses)
    .where(eq(senses.entry_id, entryId));

  const senseIds = entrySenses.map(s => s.id);
  if (senseIds.length === 0) return [];

  const rows = await neonDb
    .select({
      id: senseRelations.id,
      relation_type: senseRelations.relation_type,
      strength: senseRelations.strength,
      explanation: senseRelations.explanation,
      target_sense_id: senseRelations.target_sense_id,
      target_definition: targetSense.definition,
      target_entry_id: targetEntry.id,
      target_entry_lemma: targetEntry.lemma,
    })
    .from(senseRelations)
    .innerJoin(targetSense, eq(senseRelations.target_sense_id, targetSense.id))
    .innerJoin(targetEntry, eq(targetSense.entry_id, targetEntry.id))
    .where(inArray(senseRelations.source_sense_id, senseIds));

  return rows.map(r => ({
    id: r.id,
    relationType: r.relation_type,
    strength: r.strength,
    explanation: r.explanation,
    targetSenseId: r.target_sense_id,
    targetDefinition: r.target_definition,
    targetEntryId: r.target_entry_id,
    targetEntryLemma: r.target_entry_lemma,
  }));
}

// ============================================================================
// COMPLETE ENTRY
// ============================================================================

/** Fetch complete entry with all relations */
export async function fetchEntryCompleteByLemma(
  lemma: string,
  languageCode: string = "en"
): Promise<EntryComplete | null> {
  'use cache'
  cacheLife('hours')

  const result = await neonDb
    .select()
    .from(lexicalEntries)
    .where(and(
      eq(lexicalEntries.lemma, lemma),
      eq(lexicalEntries.language_code, languageCode)
    ));

  const entry = result.at(0);
  if (!entry) return null;

  const [sensesData, formsData, audioData, relationsData] = await Promise.all([
    fetchSensesByEntryId(entry.id),
    fetchFormsByEntryId(entry.id),
    fetchAudioByEntryId(entry.id),
    fetchSenseRelationsByEntryId(entry.id),
  ]);

  return {
    ...serializeEntry(entry),
    senses: sensesData,
    forms: formsData,
    audio: audioData,
    relations: relationsData,
  };
}
