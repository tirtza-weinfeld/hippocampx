/**
 * Vercel Database Connection
 */

import "server-only";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

export const vercelDb = drizzle(sql);
