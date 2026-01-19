/**
 * Dictionary Seed Data - Aligned with New Schema
 *
 * ARCHITECTURE (matches lib/db/neon/schemas/dictionary.ts):
 * - LexicalEntry: The headword (lemma + part_of_speech + language_code)
 * - WordForm: Inflected forms with grammatical features (JSON)
 * - Sense: A meaning/definition attached to a lexical entry
 * - Example: Usage example attached to a sense
 * - SenseRelation: Semantic relations between senses (synonym, antonym, etc.)
 * - Tags: Attached to senses (not entries)
 * - Sources/SourceParts: Hierarchical source citations (Musical -> Act -> Song)
 *
 * GRAMMATICAL FEATURES (stored as JSONB in word_forms):
 * - English: { tense?, number?, person?, participle?, degree? }
 * - German: { case, number, gender?, degree? }
 * - Italian: { gender, number }
 * - Arabic: { root, pattern, state }
 *
 * TAGS (attached to senses):
 * - Topic: medical, legal, technology, science, music, art, politics, psychology
 * - Usage: slang, archaic, poetic, colloquial
 * - Connotation: negative, positive
 * - Test prep: GRE, SAT, TOEFL
 *
 * SOURCE HIERARCHY:
 * - Source: { type, title, publication_year?, contributors[] }
 * - SourcePart: Recursive hierarchy (Musical -> Act 1 -> Defying Gravity)
 */

import type {
  partOfSpeechEnum,
  relationTypeEnum,
  sourceTypeEnum,
  creditRoleEnum,
  senseDifficultyEnum,
  notationTypeEnum,
  EnglishGrammarSchema,
  GermanGrammarSchema,
  ItalianGrammarSchema,
  ArabicGrammarSchema,
} from "../../schemas/dictionary";
import type { z } from "zod";
import { DEAR_OLD_SHIZ_DICTIONARY_DATA } from "./lyrics/wicked-part-1/dear-old-shiz";
import { EVERY_DAY_MORE_WICKED_DATA } from "./lyrics/wicked-part-2/every-day-more-wicked";
import { HADESTOWN_DOUBT_COMES_IN_DICTIONARY_DATA } from "./lyrics/hadestown/doubt-comes-in";
import { NO_ONE_MOURNS_THE_WICKED_DATA } from "./lyrics/wicked-part-1/no-one-mourns-the-wicked";
import { IT_FUNDAMENTAL_DATA_EXPANDED } from "./words/it/fundamentals";
import { WONDERFUL_DATA } from "./lyrics/wicked-part-2/wonderful";
import { ANATOMY_DATA } from "./words/en/anatomy";
import { PRACTICAL_VOCAB_DATA } from "./words/en/practical-vocab";
import { CALCULUS_DATA } from "./words/en/calculus";
import { VOCABULARY_DATA } from "./words/en/vocabulary";
import { AI_ML_DATA } from "./words/en/ai-ml";
import { VOCABULARY_DATA_ADDITIONS } from "./words/en/vocabulary_data_addition";

// =============================================================================
// ENUM TYPES (derived from schema)
// =============================================================================

type PartOfSpeech = (typeof partOfSpeechEnum.enumValues)[number];
type RelationType = (typeof relationTypeEnum.enumValues)[number];
type SourceType = (typeof sourceTypeEnum.enumValues)[number];
type CreditRole = (typeof creditRoleEnum.enumValues)[number];
type SenseDifficulty = (typeof senseDifficultyEnum.enumValues)[number];
type NotationType = (typeof notationTypeEnum.enumValues)[number];

// =============================================================================
// GRAMMATICAL FEATURES (polyglot support)
// =============================================================================

type EnglishGrammar = z.infer<typeof EnglishGrammarSchema>;
type GermanGrammar = z.infer<typeof GermanGrammarSchema>;
type ItalianGrammar = z.infer<typeof ItalianGrammarSchema>;
type ArabicGrammar = z.infer<typeof ArabicGrammarSchema>;

export type GrammaticalFeatures =
  | EnglishGrammar
  | GermanGrammar
  | ItalianGrammar
  | ArabicGrammar;

// =============================================================================
// SOURCE & CITATION SEEDS
// =============================================================================

/** Contributor (author, composer, lyricist, etc.) */
export type ContributorSeed = {
  name: string;
  role: CreditRole;
};

/** Source (book, musical, movie, etc.) */
export type SourceSeed = {
  type: SourceType;
  title: string;
  publication_year?: number;
  contributors?: ContributorSeed[];
};

/**
 * Source Part - Recursive hierarchy
 * Examples:
 * - Musical: { name: "Act 1", type: "act", children: [{ name: "Defying Gravity", type: "song" }] }
 * - Book: { name: "Chapter 7", type: "chapter" }
 */
export type SourcePartSeed = {
  name: string;
  type?: string; // "act", "song", "chapter", "scene", etc.
  order_index?: number;
  children?: SourcePartSeed[];
};

/** Full source reference for an example */
export type ExampleSourceSeed = {
  source: SourceSeed;
  /** Path through the hierarchy: ["Act 1", "Dear Old Shiz"] */
  part_path?: string[];
};

// =============================================================================
// LEXICAL ENTRY SEEDS
// =============================================================================

/** Example sentence attached to a sense */
export type ExampleSeed = {
  text: string;
  source?: ExampleSourceSeed;
};

/** Semantic relation to another sense */
export type SenseRelationSeed = {
  /** Target word (lemma) - resolved to sense_id during seeding */
  target_lemma: string;
  /** Target part of speech (to disambiguate homonyms) */
  target_pos?: PartOfSpeech;
  relation_type: RelationType;
  strength?: number; // 0-100, default 100
  explanation?: string;
};

/** Alternative representation (formula, pronunciation, etc.) */
export type NotationSeed = {
  type: NotationType;
  value: string;
};

/** A meaning/definition of a word */
export type SenseSeed = {
  definition: string;
  order_index?: number; // 0 = primary sense
  difficulty?: SenseDifficulty;
  usage_frequency?: number; // 0.0-1.0, this sense's share of word usage
  is_synthetic?: boolean;
  examples?: ExampleSeed[];
  tags?: string[];
  relations?: SenseRelationSeed[];
  notations?: NotationSeed[];
};

/** Inflected word form with grammatical features */
export type WordFormSeed = {
  form_text: string;
  grammatical_features: GrammaticalFeatures;
};

/**
 * Lexical Entry - The main dictionary entry
 * One entry per unique (lemma, part_of_speech, language_code) combination
 */
export type LexicalEntrySeed = {
  lemma: string;
  part_of_speech: PartOfSpeech;
  language_code: string;
  frequency_rank?: number; // Corpus rank (1 = most common word)
  forms?: WordFormSeed[];
  senses: SenseSeed[];
  metadata?: Record<string, unknown>;
};

// =============================================================================
// SEED DATA
// =============================================================================


export const dictionaryData: LexicalEntrySeed[] = [
  ...EVERY_DAY_MORE_WICKED_DATA,
  ...NO_ONE_MOURNS_THE_WICKED_DATA,
  ...IT_FUNDAMENTAL_DATA_EXPANDED,
  ...DEAR_OLD_SHIZ_DICTIONARY_DATA,
  ...HADESTOWN_DOUBT_COMES_IN_DICTIONARY_DATA,
  ...WONDERFUL_DATA,
  ...ANATOMY_DATA,
  ...PRACTICAL_VOCAB_DATA,
  ...CALCULUS_DATA,
  ...VOCABULARY_DATA,
  ...AI_ML_DATA,
  ...VOCABULARY_DATA_ADDITIONS
];