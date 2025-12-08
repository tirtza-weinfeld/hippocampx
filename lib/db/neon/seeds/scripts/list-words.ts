/**
 * List all words in the database
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { words } from "../../schemas/dictionary";

config({ path: ".env.local" });

async function listWords(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const allWords = await db.select({ id: words.id, word_text: words.word_text }).from(words);

  console.log(`Total words: ${allWords.length}\n`);
  allWords.forEach(w => console.log(`${w.id}: ${w.word_text}`));

  process.exit(0);
}

listWords().catch(console.error);
