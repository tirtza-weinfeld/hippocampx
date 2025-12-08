/**
 * External Tables - managed by other tools (e.g., Alembic/Python)
 *
 * These tables exist in the database but are not managed by Drizzle.
 * Including them here prevents Drizzle from trying to delete them.
 */

import { pgTable, varchar } from "drizzle-orm/pg-core";

// Alembic migration version tracking table (managed by Python/SQLAlchemy)
export const alembicVersion = pgTable("alembic_version", {
  version_num: varchar("version_num", { length: 32 }).primaryKey(),
});
