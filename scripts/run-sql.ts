#!/usr/bin/env tsx
/**
 * Run SQL against the Neon database
 * Usage:
 *   pnpm db:run <sql-file>           - Run SQL from file
 *   pnpm db:run -e "SELECT 1"        - Run inline SQL
 * Examples:
 *   pnpm db:run drizzle/0005_add_schema_comments.sql
 *   pnpm db:run -e "TRUNCATE sources CASCADE;"
 */

import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

const { Client } = pg;

config({ path: ".env.local" });

async function main() {
  const arg1 = process.argv[2];
  const arg2 = process.argv[3];

  let sql: string;

  if (arg1 === "-e" && arg2) {
    // Inline SQL mode
    sql = arg2;
  } else if (arg1 && arg1 !== "-e") {
    // File mode
    const filePath = resolve(process.cwd(), arg1);
    try {
      sql = readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error(`Error reading file: ${filePath}`);
      console.error(err);
      process.exit(1);
    }
  } else {
    console.error("Usage:");
    console.error("  pnpm db:run <sql-file>        - Run SQL from file");
    console.error('  pnpm db:run -e "SELECT 1"     - Run inline SQL');
    process.exit(1);
  }

  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: NEON_DATABASE_URL not set in .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    console.log(`Connecting to database...`);
    await client.connect();

    const label = arg1 === "-e" ? "inline SQL" : arg1;
    console.log(`Running: ${label}\n`);
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
