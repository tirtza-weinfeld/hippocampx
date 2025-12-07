/**
 * ============================================================================
 * TEMPORARY: Direct Neon Database Connection for Dictionary
 * ============================================================================
 *
 * This file provides a separate database connection to the Hippo dictionary
 * database on Neon (eu-central-1), separate from the Vercel Postgres database
 * used for problems.
 *
 * WHEN READY TO REVERT:
 * - Delete this file
 * - Delete lib/db/schema-dictionary.ts
 * - Delete lib/api/neon-vocabulary-client.ts
 * - Switch imports back to lib/api/railway-vocabulary-client.ts
 * - Remove NEON_DATABASE_URL from environment
 *
 * Environment Variable Required:
 * - NEON_DATABASE_URL: Neon connection string for the dictionary database
 * ============================================================================
 */

import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema-dictionary";

function getDictionaryDatabaseUrl(): string {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error(
      "NEON_DATABASE_URL environment variable is not set. " +
      "This is required for direct dictionary database access."
    );
  }
  return url;
}

const sql = neon(getDictionaryDatabaseUrl());

export const dictionaryDb = drizzle(sql, { schema });

export { schema };
