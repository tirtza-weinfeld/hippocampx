/**
 * Zod validators for polyglot grammatical features
 */

import { z } from "zod";

export const EnglishGrammarSchema = z.object({
  tense: z.enum(["past", "present", "future"]).optional(),
  number: z.enum(["singular", "plural"]).optional(),
  person: z.enum(["1st", "2nd", "3rd"]).optional(),
  participle: z.enum(["present", "past"]).optional(),
  degree: z.enum(["positive", "comparative", "superlative"]).optional(),
});

export const GermanGrammarSchema = z.object({
  case: z.enum(["nominative", "accusative", "dative", "genitive"]),
  number: z.enum(["singular", "plural"]),
  gender: z.enum(["masculine", "feminine", "neuter"]).optional(),
  degree: z.enum(["positive", "comparative", "superlative"]).optional(),
});

export const ItalianGrammarSchema = z.object({
  gender: z.enum(["masculine", "feminine"]),
  number: z.enum(["singular", "plural"]),
});

export const ArabicGrammarSchema = z.object({
  root: z.string().regex(/^[a-z]-[a-z]-[a-z]$/),
  pattern: z.string(),
  state: z.enum(["definite", "indefinite", "construct"]),
});

export const PolyglotGrammarSchema = z.xor([
  EnglishGrammarSchema,
  GermanGrammarSchema,
  ItalianGrammarSchema,
  ArabicGrammarSchema,
]);
