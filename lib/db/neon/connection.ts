/**
 * Neon Database Connection
 */

import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

function getNeonDatabaseUrl(): string {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error(
      "NEON_DATABASE_URL environment variable is not set."
    );
  }
  return url;
}

// Lazy initialization to avoid build-time errors
let _neonDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getNeonDb() {
  if (!_neonDb) {
    const sql = neon(getNeonDatabaseUrl());
    _neonDb = drizzle(sql, { schema });
  }
  return _neonDb;
}

export const neonDb = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return getNeonDb()[prop as keyof typeof _neonDb];
  },
});

export { schema };
