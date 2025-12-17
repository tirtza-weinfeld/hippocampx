/**
 * Seed data for collections (musicals, movies, albums)
 */

import type { InsertCollection } from "../../schema";

export const collectionsData: Omit<InsertCollection, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Wicked",
    type: "musical",
    year: 2003,
    image_url: null,
  },
  {
    title: "Wicked Part 1",
    type: "movie",
    year: 2024,
    image_url: null,
  },
  {
    title: "Wicked Part 2",
    type: "movie",
    year: 2025,
    image_url: null,
  },
  {
    title: "Hadestown",
    type: "musical",
    year: 2019,
    image_url: null,
  },
];
