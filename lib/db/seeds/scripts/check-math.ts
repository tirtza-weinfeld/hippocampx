/**
 * Quick script to check if examples have correct backslashes or pipes
 * Run with: pnpm tsx lib/db/seeds/scripts/check-math.ts
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ilike } from "drizzle-orm";
import { examples, senses } from "../../schemas/dictionary";

config({ path: ".env.local" });

async function checkMath(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool });

  console.log("=== EXAMPLES WITH 'cos' ===");
  const cosExamples = await db
    .select({ text: examples.text })
    .from(examples)
    .where(ilike(examples.text, "%cos%"))
    .limit(5);

  for (const ex of cosExamples) {
    console.log("Raw:", JSON.stringify(ex.text));
    console.log("Display:", ex.text);
    console.log("---");
  }

  console.log("\n=== SENSES WITH 'cos' ===");
  const cosSenses = await db
    .select({ definition: senses.definition })
    .from(senses)
    .where(ilike(senses.definition, "%cos%"))
    .limit(5);

  for (const s of cosSenses) {
    console.log("Raw:", JSON.stringify(s.definition));
    console.log("Display:", s.definition);
    console.log("---");
  }

  await pool.end();
  process.exit(0);
}

checkMath().catch((error: unknown) => {
  console.error("Error:", error);
  process.exit(1);
});
