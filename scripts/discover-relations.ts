#!/usr/bin/env tsx
/**
 * Discover sense relations using vector similarity + LLM classification
 *
 * Pipeline:
 * 1. Vector ANN: Find candidate similar senses
 * 2. LLM: Classify relation type (synonym, antonym, hypernym, etc.)
 * 3. Store: Insert into sense_relations with is_synthetic=true
 *
 * Usage: pnpm db:discover:relations
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, or, sql, ne, isNull } from "drizzle-orm";
import OpenAI from "openai";
import {
  senses,
  lexicalEntries,
  senseRelations,
  type InsertSenseRelation,
} from "../lib/db/schemas/dictionary";
import { sensesVecOpenai } from "../lib/db/schemas/dictionary/vectors";

config({ path: ".env.local" });

const CANDIDATES_PER_SENSE = 5; // Top K similar senses to evaluate
const SIMILARITY_THRESHOLD = 0.7; // Minimum cosine similarity
const MODEL = "gpt-4o-mini"; // Fast and cheap for classification

type RelationType = InsertSenseRelation["relation_type"];

interface SenseWithEmbedding {
  senseId: number;
  entryId: number;
  lemma: string;
  partOfSpeech: string;
  definition: string;
}

interface CandidatePair {
  source: SenseWithEmbedding;
  target: SenseWithEmbedding;
  similarity: number;
}

interface ClassificationResult {
  relationType: RelationType | "none";
  explanation: string;
  confidence: number;
}

const RELATION_TYPES: RelationType[] = [
  "synonym",
  "antonym",
  "hypernym",
  "hyponym",
  "meronym",
  "holonym",
];

async function classifyRelation(
  openai: OpenAI,
  source: SenseWithEmbedding,
  target: SenseWithEmbedding
): Promise<ClassificationResult> {
  const prompt = `You are a lexicographer classifying semantic relations between word senses.

SOURCE: ${source.lemma} (${source.partOfSpeech}): ${source.definition}
TARGET: ${target.lemma} (${target.partOfSpeech}): ${target.definition}

What is the semantic relation from SOURCE to TARGET?

Options:
- synonym: Same or nearly identical meaning
- antonym: Opposite meaning
- hypernym: TARGET is a broader category (dog → animal)
- hyponym: TARGET is a more specific type (animal → dog)
- meronym: TARGET is a part of SOURCE (car → wheel)
- holonym: TARGET contains SOURCE as a part (wheel → car)
- none: No meaningful relation (or relation doesn't fit above categories)

Respond with JSON only:
{"relation": "<type>", "explanation": "<brief reason>", "confidence": <0.0-1.0>}`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { relationType: "none", explanation: "No response", confidence: 0 };
    }

    const parsed = JSON.parse(content);
    return {
      relationType: parsed.relation as RelationType | "none",
      explanation: parsed.explanation || "",
      confidence: parsed.confidence || 0,
    };
  } catch (err) {
    console.error("    Classification error:", err);
    return { relationType: "none", explanation: "Error", confidence: 0 };
  }
}

async function main() {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!databaseUrl) {
    console.error("Error: NEON_DATABASE_URL not set");
    process.exit(1);
  }
  if (!openaiKey) {
    console.error("Error: OPENAI_API_KEY not set");
    process.exit(1);
  }

  const client = neon(databaseUrl);
  const db = drizzle(client);
  const openai = new OpenAI({ apiKey: openaiKey });

  console.log("🔍 Finding unscanned senses...\n");

  // Get senses that haven't been scanned for relations yet
  const sensesWithEmbeddings = await db
    .select({
      senseId: senses.id,
      entryId: lexicalEntries.id,
      lemma: lexicalEntries.lemma,
      partOfSpeech: lexicalEntries.part_of_speech,
      definition: senses.definition,
    })
    .from(senses)
    .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
    .innerJoin(sensesVecOpenai, eq(senses.id, sensesVecOpenai.senseId))
    .where(isNull(sensesVecOpenai.relationScanAt));

  console.log(`📝 Found ${sensesWithEmbeddings.length} unscanned senses\n`);

  // Get existing relations to avoid duplicates
  const existingRelations = await db
    .select({
      sourceId: senseRelations.source_sense_id,
      targetId: senseRelations.target_sense_id,
    })
    .from(senseRelations);

  const existingPairs = new Set(
    existingRelations.map((r) => `${r.sourceId}-${r.targetId}`)
  );

  console.log(`📊 ${existingPairs.size} existing relations\n`);

  let discovered = 0;
  let skipped = 0;

  for (const source of sensesWithEmbeddings) {
    console.log(`\n🔎 ${source.lemma}: ${source.definition.slice(0, 50)}...`);

    // Find similar senses via vector search
    const candidates = await db.execute<{
      sense_id: number;
      entry_id: number;
      lemma: string;
      part_of_speech: string;
      definition: string;
      similarity: number;
    }>(sql`
      SELECT
        s.id as sense_id,
        e.id as entry_id,
        e.lemma,
        e.part_of_speech,
        s.definition,
        1 - (v.embedding <=> (SELECT embedding FROM senses_vec_openai WHERE sense_id = ${source.senseId})) as similarity
      FROM senses_vec_openai v
      JOIN senses s ON s.id = v.sense_id
      JOIN lexical_entries e ON e.id = s.entry_id
      WHERE v.sense_id != ${source.senseId}
        AND e.id != ${source.entryId}
      ORDER BY v.embedding <=> (SELECT embedding FROM senses_vec_openai WHERE sense_id = ${source.senseId})
      LIMIT ${CANDIDATES_PER_SENSE}
    `);

    for (const candidate of candidates.rows) {
      // Skip if below threshold
      if (candidate.similarity < SIMILARITY_THRESHOLD) {
        continue;
      }

      // Skip if relation already exists (either direction)
      const pairKey = `${source.senseId}-${candidate.sense_id}`;
      const reversePairKey = `${candidate.sense_id}-${source.senseId}`;
      if (existingPairs.has(pairKey) || existingPairs.has(reversePairKey)) {
        skipped++;
        continue;
      }

      console.log(`  → ${candidate.lemma} (${(candidate.similarity * 100).toFixed(1)}%)`);

      // Classify relation
      const target: SenseWithEmbedding = {
        senseId: candidate.sense_id,
        entryId: candidate.entry_id,
        lemma: candidate.lemma,
        partOfSpeech: candidate.part_of_speech,
        definition: candidate.definition,
      };

      const result = await classifyRelation(openai, source, target);

      // Validate relation type is in our allowed list
      const validTypes = new Set(RELATION_TYPES);
      if (
        result.relationType === "none" ||
        result.confidence < 0.6 ||
        !validTypes.has(result.relationType as RelationType)
      ) {
        console.log(`    ✗ ${result.relationType} (confidence: ${result.confidence})`);
        continue;
      }

      console.log(`    ✓ ${result.relationType}: ${result.explanation}`);

      // Insert relation
      await db
        .insert(senseRelations)
        .values({
          source_sense_id: source.senseId,
          target_sense_id: candidate.sense_id,
          relation_type: result.relationType,
          strength: Math.round(result.confidence * 100),
          explanation: result.explanation,
          is_synthetic: true,
          verification_status: "unverified",
        })
        .onConflictDoNothing();

      existingPairs.add(pairKey);
      discovered++;

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    }

    // Mark this sense as scanned
    await db
      .update(sensesVecOpenai)
      .set({ relationScanAt: new Date() })
      .where(eq(sensesVecOpenai.senseId, source.senseId));
  }

  console.log(`\n✅ Done!`);
  console.log(`   Discovered: ${discovered} new relations`);
  console.log(`   Skipped: ${skipped} (already exist)`);
}

main().catch(console.error);
