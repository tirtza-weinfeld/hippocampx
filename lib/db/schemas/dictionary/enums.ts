/**
 * PostgreSQL enums for dictionary schema
 */

import { pgEnum } from "drizzle-orm/pg-core";

export const partOfSpeechEnum = pgEnum("partofspeech", [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "determiner",
  "article",
  "particle",
  "numeral",
  "symbol",
]);

export const relationTypeEnum = pgEnum("relationtype", [
  "translation",
  "synonym",
  "antonym",
  "hypernym",
  "hyponym",
  "meronym",
  "holonym",
  "nuance",
]);

export const sourceTypeEnum = pgEnum("sourcetype", [
  "book",
  "movie",
  "article",
  "academic_paper",
  "conversation",
  "synthetic_ai",
  "musical",
  "podcast",
]);

export const creditRoleEnum = pgEnum("creditrole", [
  "author",
  "artist",
  "composer",
  "lyricist",
  "playwright",
  "director",
  "host",
]);

export const verificationStatusEnum = pgEnum("verificationstatus", [
  "unverified", // Raw import / AI generated
  "flagged", // User reported issue
  "pending_review", // Human currently editing
  "verified", // Signed off by human
  "canonical", // Authoritative source (Oxford, Merriam-Webster, etc.)
]);
