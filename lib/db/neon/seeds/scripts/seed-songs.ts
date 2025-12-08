/**
 * Seed script for songs
 * Run with: pnpm db:seed:songs
 * Options:
 *   --override  Replace existing entries (default: skip)
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { collections, songs } from "../../schema";
import { songsData } from "../data/songs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: ".env.local" });

const shouldOverride = process.argv.includes("--override");

function loadLyrics(lyricsPath: string): string {
  const fullPath = join(__dirname, "../data/lyrics", lyricsPath);
  const content = readFileSync(fullPath, "utf-8");
  return content.trim();
}

async function seed(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding songs...");
  console.log(`Mode: ${shouldOverride ? "OVERRIDE" : "SKIP"} existing entries\n`);

  for (const [collectionTitle, songsList] of Object.entries(songsData)) {
    // Look up collection by title
    const [collection] = await db
      .select()
      .from(collections)
      .where(eq(collections.title, collectionTitle));

    if (!collection) {
      console.error(`Collection not found: ${collectionTitle}`);
      continue;
    }

    console.log(`${collectionTitle} (id: ${collection.id}):`);

    for (const song of songsList) {
      // Check if song exists
      const [existing] = await db
        .select()
        .from(songs)
        .where(
          and(
            eq(songs.collection_id, collection.id),
            eq(songs.title, song.title)
          )
        );

      const lyrics = loadLyrics(song.lyrics);

      if (existing) {
        if (shouldOverride) {
          const [updated] = await db
            .update(songs)
            .set({
              lyrics,
              track_number: song.track_number,
              composer: song.composer,
              lyricist: song.lyricist,
            })
            .where(eq(songs.id, existing.id))
            .returning();
          console.log(`  ~ ${updated.track_number}. ${updated.title} (updated)`);
        } else {
          console.log(`  - ${existing.track_number}. ${existing.title} (skipped)`);
        }
        continue;
      }

      const [inserted] = await db
        .insert(songs)
        .values({
          title: song.title,
          lyrics,
          collection_id: collection.id,
          track_number: song.track_number,
          composer: song.composer,
          lyricist: song.lyricist,
        })
        .returning();

      console.log(`  + ${inserted.track_number}. ${inserted.title}`);
    }
  }

  console.log("\nDone!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding:", error);
  process.exit(1);
});
