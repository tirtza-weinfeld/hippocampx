/**
 * Dictionary Seed Data
 *
 * STRUCTURE:
 * Each word is a separate entry. Forms (prouder, proudest) are their own
 * word entries with base_word pointing to the base form.
 *
 * BASE WORD:
 * - word_text + language_code (required)
 * - form_type: "base" (default)
 * - definitions[] - meaning, part of speech, examples
 * - tags[] - categorize the word (optional)
 * - relations[] - synonyms/antonyms (optional)
 *
 * FORM WORD:
 * - word_text + language_code (required)
 * - form_type: plural, comparative, superlative, past, etc.
 * - base_word: text of the base word (resolved to base_word_id during seeding)
 * - definitions[] - usually empty for forms
 *
 * FORM TYPES:
 * - base: main dictionary entry (proud)
 * - plural: noun plural (cats)
 * - third_person: verb 3rd person singular (runs)
 * - comparative: adjective -er (prouder)
 * - superlative: adjective -est (proudest)
 * - past: verb past tense (ran)
 * - past_participle: verb past participle (run)
 * - present_participle: verb -ing (running)
 * - derived: different part of speech (proudly, pride)
 *
 * TAGS (what the word is about):
 * - Topic: medical, legal, technology, science, music, art, politics, psychology
 * - Usage: slang, archaic, poetic, colloquial
 * - Connotation: negative, positive
 * - Test prep: GRE, SAT, TOEFL
 *
 * SOURCE (where the example came from):
 * - type: musical, book, movie, podcast, article
 * - title: "Wicked", "Pride and Prejudice"
 * - part: "Thank Goodness", "Chapter 7"
 * - part_order: track/chapter number (optional)
 */

import type { partOfSpeechEnum, relationTypeEnum, sourceTypeEnum, formTypeEnum } from "../../schemas/dictionary";
import { DEAR_OLD_SHIZ_DICTIONARY_DATA } from "./lyrics/wicked-part-1/dear-old-shiz";
// import { EVERY_DAY_MORE_WICKED_DICTIONARY_DATA } from "./lyrics/wicked-part-2/every-day-more-wicked";
// import { HEDESTOWN_DOUBT_COMES_IN_DICTIONARY_DATA } from "./lyrics/hadestown/doubt-comes-in";
// import { NO_ONE_MOURNS_THE_WICKED_DICTIONARY_DATA } from "./lyrics/wicked-part-1/no-one-mourns-the-wicked";

type PartOfSpeech = (typeof partOfSpeechEnum.enumValues)[number];
type RelationType = (typeof relationTypeEnum.enumValues)[number];
type SourceType = (typeof sourceTypeEnum.enumValues)[number];
type FormType = (typeof formTypeEnum.enumValues)[number];

export type SourceSeed = {
  type: SourceType;
  title: string;
  part: string;
  part_order?: number;
};

export type ExampleSeed = {
  example_text: string;
  source?: SourceSeed;
};

export type DefinitionSeed = {
  definition_text: string;
  part_of_speech: PartOfSpeech;
  order?: number;
  examples?: ExampleSeed[];
};

export type RelationSeed = {
  related_word: string;
  relation_type: RelationType;
};

export type DictionaryWordSeed = {
  word_text: string;
  language_code: string;
  form_type?: FormType;        // defaults to "base"
  base_word?: string;          // for forms: text of the base word
  definitions: DefinitionSeed[];
  tags?: string[];
  relations?: RelationSeed[];
};

// =============================================================================
// SEED DATA
// =============================================================================








export const dictionaryData = [
  // ...EVERY_DAY_MORE_WICKED_DICTIONARY_DATA,
  // ...HEDESTOWN_DOUBT_COMES_IN_DICTIONARY_DATA,
  // ...NO_ONE_MOURNS_THE_WICKED_DICTIONARY_DATA,
  ...DEAR_OLD_SHIZ_DICTIONARY_DATA,
];