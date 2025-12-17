/**
 * Songs/Lyrics Schema - Neon Database
 */

import { pgTable, pgEnum, index, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ============================================================================
// Enums
// ============================================================================

export const collectionTypeEnum = pgEnum("collection_type", [
  "musical",
  "album",
  "soundtrack",
  "movie",
  "tv_show",
  "single",
  "other",
]);

// ============================================================================
// Tables
// ============================================================================

export const collections = pgTable("collections", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  type: collectionTypeEnum("type").notNull(),
  year: integer("year"),
  image_url: varchar("image_url", { length: 500 }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_collections_title").on(table.title),
  index("idx_collections_type").on(table.type),
]);

export const songs = pgTable("songs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  lyrics: text("lyrics").notNull(),
  collection_id: integer("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
  track_number: integer("track_number").notNull(),
  composer: varchar("composer", { length: 255 }),
  lyricist: varchar("lyricist", { length: 255 }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_songs_title").on(table.title),
  index("idx_songs_collection_id").on(table.collection_id),
]);

// ============================================================================
// Type Exports
// ============================================================================

export type Collection = InferSelectModel<typeof collections>;
export type InsertCollection = InferInsertModel<typeof collections>;

export type Song = InferSelectModel<typeof songs>;
export type InsertSong = InferInsertModel<typeof songs>;

export type CollectionSerialized = Omit<Collection, "created_at" | "updated_at" | "type"> & {
  type: string;
  created_at?: string;
  updated_at?: string;
};

export type SongSerialized = Omit<Song, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type SongWithCollection = SongSerialized & {
  collection: CollectionSerialized;
};
