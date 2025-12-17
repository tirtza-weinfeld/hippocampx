/**
 * Seed script for collections
 * Run with: pnpm db:seed:collections
 * Options:
 *   --override  Replace existing entries (default: skip)
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { collections } from "../../schema";
import { collectionsData } from "../data/collections";

config({ path: ".env.local" });

const shouldOverride = process.argv.includes("--override");

async function seed(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding collections...");
  console.log(`Mode: ${shouldOverride ? "OVERRIDE" : "SKIP"} existing entries\n`);

  for (const collection of collectionsData) {
    // Check if exists
    const [existing] = await db
      .select()
      .from(collections)
      .where(eq(collections.title, collection.title));

    if (existing) {
      if (shouldOverride) {
        const [updated] = await db
          .update(collections)
          .set(collection)
          .where(eq(collections.id, existing.id))
          .returning();
        console.log(`  ~ ${updated.title} (updated)`);
      } else {
        console.log(`  - ${existing.title} (skipped, already exists)`);
      }
      continue;
    }

    const [inserted] = await db
      .insert(collections)
      .values(collection)
      .returning();

    console.log(`  + ${inserted.title} (${inserted.type}, ${inserted.year}) - id: ${inserted.id}`);
  }

  console.log("\nDone!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding:", error);
  process.exit(1);
});
