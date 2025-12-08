/**
 * Seed script for dictionary words
 * Run with: pnpm db:seed:dictionary
 * Options:
 *   --override  Replace existing entries (default: skip)
 *
 * Handles FK resolution automatically:
 * - Creates tags if they don't exist
 * - Creates sources/source_parts if they don't exist
 * - Creates related words if they don't exist (as stubs)
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import {
  words,
  definitions,
  examples,
  tags,
  wordTags,
  wordRelations,
  wordForms,
  sources,
  sourceParts,
} from "../../schemas/dictionary";
import { dictionaryData, type DictionaryWordSeed, type SourceSeed } from "../data/dictionary";

config({ path: ".env.local" });

const shouldOverride = process.argv.includes("--override");

type DbType = ReturnType<typeof drizzle>;

async function getOrCreateWord(
  db: DbType,
  wordText: string,
  languageCode: string
): Promise<number> {
  const [existing] = await db
    .select()
    .from(words)
    .where(and(eq(words.word_text, wordText), eq(words.language_code, languageCode)));

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(words)
    .values({ word_text: wordText, language_code: languageCode })
    .returning();

  console.log(`    [stub] Created stub word: ${wordText}`);
  return inserted.id;
}

async function getOrCreateTag(db: DbType, tagName: string): Promise<number> {
  const [existing] = await db.select().from(tags).where(eq(tags.name, tagName));

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(tags)
    .values({ name: tagName })
    .returning();

  console.log(`    [tag] Created tag: ${tagName}`);
  return inserted.id;
}

async function getOrCreateSourcePart(db: DbType, source: SourceSeed): Promise<number> {
  // First, get or create the source
  const [existingSource] = await db
    .select()
    .from(sources)
    .where(and(eq(sources.type, source.type), eq(sources.title, source.title)));

  let sourceId: number;
  if (existingSource) {
    sourceId = existingSource.id;
  } else {
    const [inserted] = await db
      .insert(sources)
      .values({ type: source.type, title: source.title })
      .returning();
    sourceId = inserted.id;
    console.log(`    [source] Created source: ${source.type} - ${source.title}`);
  }

  // Then, get or create the source part
  const [existingPart] = await db
    .select()
    .from(sourceParts)
    .where(and(eq(sourceParts.source_id, sourceId), eq(sourceParts.name, source.part)));

  if (existingPart) {
    return existingPart.id;
  }

  const [insertedPart] = await db
    .insert(sourceParts)
    .values({
      source_id: sourceId,
      name: source.part,
      order: source.part_order,
    })
    .returning();

  console.log(`    [source_part] Created part: ${source.part}`);
  return insertedPart.id;
}

async function clearWordData(db: DbType, wordId: number): Promise<void> {
  // Clear related data for override mode
  await db.delete(definitions).where(eq(definitions.word_id, wordId));
  await db.delete(wordTags).where(eq(wordTags.word_id, wordId));
  await db.delete(wordForms).where(eq(wordForms.word_id, wordId));
  await db.delete(wordRelations).where(eq(wordRelations.word_id_1, wordId));
}

async function seedWord(db: DbType, wordData: DictionaryWordSeed): Promise<void> {
  // Check if word exists
  const [existing] = await db
    .select()
    .from(words)
    .where(
      and(
        eq(words.word_text, wordData.word_text),
        eq(words.language_code, wordData.language_code)
      )
    );

  let wordId: number;

  if (existing) {
    if (!shouldOverride) {
      console.log(`  - ${wordData.word_text} (skipped, already exists)`);
      return;
    }
    // Override mode: clear existing data and update
    console.log(`  ~ ${wordData.word_text} (updating)`);
    wordId = existing.id;
    await clearWordData(db, wordId);
    await db
      .update(words)
      .set({ updated_at: new Date() })
      .where(eq(words.id, wordId));
  } else {
    // Insert new word
    console.log(`  + ${wordData.word_text}`);
    const [word] = await db
      .insert(words)
      .values({
        word_text: wordData.word_text,
        language_code: wordData.language_code,
      })
      .returning();
    wordId = word.id;
  }

  // Insert definitions and their examples
  for (const def of wordData.definitions) {
    const [definition] = await db
      .insert(definitions)
      .values({
        word_id: wordId,
        definition_text: def.definition_text,
        part_of_speech: def.part_of_speech,
        order: def.order ?? 0,
      })
      .returning();

    if (def.examples) {
      for (const ex of def.examples) {
        let sourcePartId: number | null = null;
        if (ex.source) {
          sourcePartId = await getOrCreateSourcePart(db, ex.source);
        }

        await db.insert(examples).values({
          definition_id: definition.id,
          example_text: ex.example_text,
          source_part_id: sourcePartId,
        });
      }
    }
  }

  // Handle tags
  if (wordData.tags) {
    for (const tagName of wordData.tags) {
      const tagId = await getOrCreateTag(db, tagName);
      await db
        .insert(wordTags)
        .values({ word_id: wordId, tag_id: tagId })
        .onConflictDoNothing();
    }
  }

  // Handle word forms
  if (wordData.forms) {
    for (const form of wordData.forms) {
      await db.insert(wordForms).values({
        word_id: wordId,
        form_text: form.form_text,
        form_type: form.form_type,
      });
    }
  }

  // Handle relations (create related words as stubs if needed)
  if (wordData.relations) {
    for (const rel of wordData.relations) {
      const relatedWordId = await getOrCreateWord(
        db,
        rel.related_word,
        wordData.language_code
      );
      await db
        .insert(wordRelations)
        .values({
          word_id_1: wordId,
          word_id_2: relatedWordId,
          relation_type: rel.relation_type,
        })
        .onConflictDoNothing();
    }
  }
}

async function seed(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding dictionary words...");
  console.log(`Mode: ${shouldOverride ? "OVERRIDE" : "SKIP"} existing entries`);
  console.log(`Found ${dictionaryData.length} words to seed\n`);

  for (const wordData of dictionaryData) {
    await seedWord(db, wordData);
  }

  console.log("\nDone!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding:", error);
  process.exit(1);
});
