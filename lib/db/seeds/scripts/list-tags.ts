/**
 * Script to list all tags by category
 * Run with: pnpm tsx lib/db/seeds/scripts/list-tags.ts
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { tags, categories } from "../../schemas/dictionary";
import { eq } from "drizzle-orm";

config({ path: ".env.local" });

async function listAllTags(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const allCategories = await db.select().from(categories);

  for (const cat of allCategories) {
    const catTags = await db
      .select({ name: tags.name })
      .from(tags)
      .where(eq(tags.categoryId, cat.id))
      .orderBy(tags.name);

    console.log(`\n=== ${cat.displayName.toUpperCase()} (${catTags.length}) ===`);
    console.log(catTags.map((t) => t.name).join(", "));
  }

  process.exit(0);
}

listAllTags().catch((error: unknown) => {
  console.error("Error:", error);
  process.exit(1);
});
