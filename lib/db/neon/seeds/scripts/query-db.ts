/**
 * Query script to inspect dictionary data
 * Run with: pnpm tsx lib/db/neon/seeds/scripts/query-db.ts
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  words,
  definitions,
  examples,
  tags,
  wordTags,
  wordRelations,
  wordForms,
} from "../../schemas/dictionary";

config({ path: ".env.local" });

async function query(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("=== WORDS ===");
  const allWords = await db.select().from(words).limit(10);
  console.log(JSON.stringify(allWords, null, 2));

  console.log("\n=== DEFINITIONS ===");
  const allDefs = await db.select().from(definitions).limit(10);
  console.log(JSON.stringify(allDefs, null, 2));

  console.log("\n=== EXAMPLES ===");
  const allExamples = await db.select().from(examples).limit(10);
  console.log(JSON.stringify(allExamples, null, 2));

  console.log("\n=== TAGS ===");
  const allTags = await db.select().from(tags).limit(10);
  console.log(JSON.stringify(allTags, null, 2));

  console.log("\n=== WORD_TAGS ===");
  const allWordTags = await db.select().from(wordTags).limit(10);
  console.log(JSON.stringify(allWordTags, null, 2));

  console.log("\n=== WORD_RELATIONS ===");
  const allRelations = await db.select().from(wordRelations).limit(10);
  console.log(JSON.stringify(allRelations, null, 2));

  console.log("\n=== WORD_FORMS ===");
  const allForms = await db.select().from(wordForms).limit(10);
  console.log(JSON.stringify(allForms, null, 2));

  process.exit(0);
}

query().catch((error) => {
  console.error("Error querying:", error);
  process.exit(1);
});
