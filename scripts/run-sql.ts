#!/usr/bin/env tsx
/**
 * Run SQL files against the Neon database
 * Usage: pnpm db:run <sql-file>
 * Example: pnpm db:run drizzle/0005_add_schema_comments.sql
 */

import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

const { Client } = pg;

config({ path: ".env.local" });

async function main() {
  const sqlFile = process.argv[2];

  if (!sqlFile) {
    console.error("Usage: pnpm db:run <sql-file>");
    console.error("Example: pnpm db:run drizzle/0005_add_schema_comments.sql");
    process.exit(1);
  }

  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: NEON_DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  const filePath = resolve(process.cwd(), sqlFile);
  let sql: string;

  try {
    sql = readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error(`Error reading file: ${filePath}`);
    console.error(err);
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    console.log(`Connecting to database...`);
    await client.connect();

    console.log(`Running: ${sqlFile}\n`);
    const result = await client.query(sql);

    const results = Array.isArray(result) ? result : [result];

    // Count statements by command type
    const counts: Record<string, number> = {};
    for (const r of results) {
      const cmd = r.command ?? "UNKNOWN";
      counts[cmd] = (counts[cmd] ?? 0) + 1;
    }

    // Report what was executed
    for (const [cmd, count] of Object.entries(counts)) {
      const label = cmd === "COMMENT" ? "comments applied"
        : cmd === "INSERT" ? "rows inserted"
        : cmd === "UPDATE" ? "rows updated"
        : cmd === "DELETE" ? "rows deleted"
        : cmd === "CREATE" ? "objects created"
        : cmd === "ALTER" ? "objects altered"
        : cmd === "DROP" ? "objects dropped"
        : `${cmd} statements`;
      console.log(`  ${count} ${label}`);
    }

    console.log(`\n✓ Success`);
  } catch (err) {
    console.error("Database error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
