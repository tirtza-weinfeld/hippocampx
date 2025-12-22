#!/usr/bin/env tsx
/**
 * Generate embeddings for sense definitions using OpenAI
 *
 * Usage: pnpm db:embed:senses
 *
 * Prerequisites:
 *   - OPENAI_API_KEY in .env.local
 *   - Run migration: pnpm db:run drizzle/0008_create_senses_vector_table.sql
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, isNull, or, lt } from "drizzle-orm";
import { sql } from "drizzle-orm";
import OpenAI from "openai";
import { senses, lexicalEntries } from "../lib/db/schemas/dictionary";
import { sensesVecOpenai } from "../lib/db/schemas/dictionary/vectors";

config({ path: ".env.local" });

const BATCH_SIZE = 100; // OpenAI allows up to 2048 inputs per request
const MODEL = "text-embedding-3-small";

interface SenseWithEntry {
  senseId: number;
  definition: string;
  lemma: string;
  partOfSpeech: string;
  senseUpdatedAt: Date | null;
  embeddingUpdatedAt: Date | null;
}

async function main() {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!databaseUrl) {
    console.error("Error: NEON_DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  if (!openaiKey) {
    console.error("Error: OPENAI_API_KEY not set in .env.local");
    process.exit(1);
  }

  const client = neon(databaseUrl);
  const db = drizzle(client);
  const openai = new OpenAI({ apiKey: openaiKey });

  console.log("🔍 Finding senses needing embeddings...\n");

  // Find senses that need embedding:
  // 1. No embedding exists, OR
  // 2. Sense was updated after embedding was created (stale)
  const sensesToEmbed = await db
    .select({
      senseId: senses.id,
      definition: senses.definition,
      lemma: lexicalEntries.lemma,
      partOfSpeech: lexicalEntries.part_of_speech,
      senseUpdatedAt: senses.updated_at,
      embeddingUpdatedAt: sensesVecOpenai.updatedAt,
    })
    .from(senses)
    .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
    .leftJoin(sensesVecOpenai, eq(senses.id, sensesVecOpenai.senseId))
    .where(
      or(
        isNull(sensesVecOpenai.senseId),
        lt(sensesVecOpenai.updatedAt, senses.updated_at)
      )
    );

  if (sensesToEmbed.length === 0) {
    console.log("✅ All senses already have up-to-date embeddings!");
    return;
  }

  console.log(`📝 Found ${sensesToEmbed.length} senses to embed\n`);

  // Process in batches
  let processed = 0;
  let errors = 0;

  for (let i = 0; i < sensesToEmbed.length; i += BATCH_SIZE) {
    const batch = sensesToEmbed.slice(i, i + BATCH_SIZE);

    // Build input texts: "lemma (pos): definition"
    const texts = batch.map(
      (s) => `${s.lemma} (${s.partOfSpeech}): ${s.definition}`
    );

    try {
      // Generate embeddings
      const response = await openai.embeddings.create({
        model: MODEL,
        input: texts,
      });

      // Insert/update embeddings
      for (let j = 0; j < batch.length; j++) {
        const sense = batch[j];
        const embedding = response.data[j].embedding;

        await db
          .insert(sensesVecOpenai)
          .values({
            senseId: sense.senseId,
            embedding,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: sensesVecOpenai.senseId,
            set: {
              embedding: sql`excluded.embedding`,
              updatedAt: new Date(),
            },
          });

        processed++;
      }

      console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} embeddings`);
    } catch (err) {
      console.error(`  ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err);
      errors += batch.length;
    }

    // Rate limiting - OpenAI has generous limits but be safe
    if (i + BATCH_SIZE < sensesToEmbed.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log(`\n✅ Done!`);
  console.log(`   Processed: ${processed}`);
  if (errors > 0) {
    console.log(`   Errors: ${errors}`);
  }

  // Show token usage estimate
  const totalChars = sensesToEmbed.reduce(
    (sum, s) => sum + s.definition.length + s.lemma.length + 10,
    0
  );
  const estimatedTokens = Math.ceil(totalChars / 4);
  console.log(`   Estimated tokens: ~${estimatedTokens}`);
}

main().catch(console.error);
