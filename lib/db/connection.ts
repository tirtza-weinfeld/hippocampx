/**
 * Database Connection (Neon via TCP)
 *
 * Uses node-postgres with connection pooling - optimal for Vercel Fluid.
 * Pool persists across requests, eliminating connection overhead.
 */

import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error(
      "NEON_DATABASE_URL environment variable is not set."
    );
  }
  return url;
}

// Lazy initialization - pool persists across requests in Vercel Fluid
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!_db) {
    _pool = new Pool({ connectionString: getDatabaseUrl() });
    _db = drizzle({ client: _pool, schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return getDb()[prop as keyof typeof _db];
  },
});

// Backward compatibility alias
export const neonDb = db;

export { schema };
