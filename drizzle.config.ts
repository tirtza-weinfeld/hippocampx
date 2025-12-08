import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

type DbTarget = "neon" | "vercel";

function getDbTarget(): DbTarget {
  const target = process.env.DRIZZLE_CLI_DB_TARGET ?? "neon";
  if (target !== "neon" && target !== "vercel") {
    throw new Error(`Unknown DRIZZLE_CLI_DB_TARGET: ${target}. Use "neon" or "vercel"`);
  }
  return target;
}

function getDatabaseUrl(target: DbTarget): string {
  if (target === "neon") {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) {
      throw new Error("NEON_DATABASE_URL is not set");
    }
    return url;
  }

  const url = process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("POSTGRES_URL is not set");
  }
  return url;
}

function getSchemaPath(target: DbTarget): string {
  return target === "neon"
    ? "./lib/db/neon/schema.ts"
    : "./lib/db/vercel/schema.ts";
}

const dbTarget = getDbTarget();

export default defineConfig({
  schema: getSchemaPath(dbTarget),
  out: `./drizzle/${dbTarget}`,
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(dbTarget),
  },
});
