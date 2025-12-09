/**
 * Word Complete - Full word detail with definitions, tags, relations
 * Optimized with single-query JOINs for tags and relations
 * Uses cache() for request deduplication
 */

import "server-only";

import { cache } from "react";
// import { cacheTag } from "next/cache";
import { eq, and, or, asc } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { neonDb } from "../../connection";
import {
  words,
  definitions,
  examples,
  tags,
  wordTags,
  wordRelations,
  sourceParts,
  sources,
  type Word,
  type WordSerialized,
  type DefinitionSerialized,
  type TagSerialized,
  type DefinitionWithExamples,
  type WordComplete,
} from "../../schema";

function serializeWord(word: Word): WordSerialized {
  return {
    ...word,
    created_at: word.created_at.toISOString(),
    updated_at: word.updated_at.toISOString(),
  };
}

/**
 * Fetch basic word data without relations (for header/immediate render)
 */
export const fetchWordBasic = cache(async function fetchWordBasic(
  wordText: string,
  languageCode: string = "en"
): Promise<WordSerialized | null> {
  // "use cache";
  // cacheTag("dictionary-words", `word-${languageCode}-${wordText}`);

  const result = await neonDb
    .select()
    .from(words)
    .where(and(eq(words.word_text, wordText), eq(words.language_code, languageCode)));

  const word = result.at(0);
  return word ? serializeWord(word) : null;
});

/**
 * Fetch definitions with examples for a word
 */
export const fetchDefinitionsByWordId = cache(async function fetchDefinitionsByWordId(wordId: number): Promise<DefinitionWithExamples[]> {
  // "use cache";
  // cacheTag("dictionary-definitions", `definitions-${wordId}`);

  const rows = await neonDb
    .select({
      def_id: definitions.id,
      def_word_id: definitions.word_id,
      def_text: definitions.definition_text,
      def_pos: definitions.part_of_speech,
      def_order: definitions.order,
      ex_id: examples.id,
      ex_definition_id: examples.definition_id,
      ex_text: examples.example_text,
      ex_source_part_id: examples.source_part_id,
      sp_name: sourceParts.name,
      src_title: sources.title,
      src_type: sources.type,
    })
    .from(definitions)
    .leftJoin(examples, eq(definitions.id, examples.definition_id))
    .leftJoin(sourceParts, eq(examples.source_part_id, sourceParts.id))
    .leftJoin(sources, eq(sourceParts.source_id, sources.id))
    .where(eq(definitions.word_id, wordId))
    .orderBy(asc(definitions.order));

  const defMap = new Map<
    number,
    { definition: DefinitionSerialized; examples: DefinitionWithExamples["examples"] }
  >();

  for (const row of rows) {
    if (!defMap.has(row.def_id)) {
      defMap.set(row.def_id, {
        definition: {
          id: row.def_id,
          word_id: row.def_word_id,
          definition_text: row.def_text,
          part_of_speech: row.def_pos,
          order: row.def_order,
        },
        examples: [],
      });
    }
    if (row.ex_id && row.ex_text && row.ex_definition_id) {
      const entry = defMap.get(row.def_id);
      if (entry) {
        entry.examples.push({
          id: row.ex_id,
          definition_id: row.ex_definition_id,
          example_text: row.ex_text,
          source_part_id: row.ex_source_part_id,
          source_part_name: row.sp_name,
          source_title: row.src_title,
          source_type: row.src_type,
        });
      }
    }
  }

  const result: DefinitionWithExamples[] = [];
  const seen = new Set<number>();
  for (const row of rows) {
    if (!seen.has(row.def_id)) {
      seen.add(row.def_id);
      const entry = defMap.get(row.def_id);
      if (entry) {
        result.push({ ...entry.definition, examples: entry.examples });
      }
    }
  }
  return result;
});

/**
 * Fetch tags for a word using single JOIN query (optimized from 2 queries)
 */
export const fetchTagsByWordId = cache(async function fetchTagsByWordId(wordId: number): Promise<TagSerialized[]> {
  // "use cache";
  // cacheTag("dictionary-tags", `tags-${wordId}`);

  return neonDb
    .select({
      id: tags.id,
      name: tags.name,
      description: tags.description,
    })
    .from(wordTags)
    .innerJoin(tags, eq(wordTags.tag_id, tags.id))
    .where(eq(wordTags.word_id, wordId))
    .orderBy(asc(tags.name));
});

/**
 * Fetch word relations using single JOIN query (optimized from 2 queries)
 */
export const fetchWordRelations = cache(async function fetchWordRelations(wordId: number) {
  // "use cache";
  // cacheTag("dictionary-relations", `relations-${wordId}`);

  const relatedWord = alias(words, "related_word");

  const rows = await neonDb
    .select({
      word_id_1: wordRelations.word_id_1,
      word_id_2: wordRelations.word_id_2,
      relation_type: wordRelations.relation_type,
      related_word_text: relatedWord.word_text,
      related_word_id: relatedWord.id,
    })
    .from(wordRelations)
    .innerJoin(
      relatedWord,
      or(
        and(
          eq(wordRelations.word_id_1, wordId),
          eq(relatedWord.id, wordRelations.word_id_2)
        ),
        and(
          eq(wordRelations.word_id_2, wordId),
          eq(relatedWord.id, wordRelations.word_id_1)
        )
      )
    )
    .where(or(eq(wordRelations.word_id_1, wordId), eq(wordRelations.word_id_2, wordId)));

  return rows;
});

/**
 * Fetch complete word with all relations (definitions, tags, relations)
 */
export const fetchWordCompleteByText = cache(async function fetchWordCompleteByText(
  wordText: string,
  languageCode: string = "en"
): Promise<WordComplete | null> {
  // "use cache";
  // cacheTag("dictionary-complete", `complete-${languageCode}-${wordText}`);

  const result = await neonDb
    .select()
    .from(words)
    .where(and(eq(words.word_text, wordText), eq(words.language_code, languageCode)));

  const word = result.at(0);
  if (!word) return null;

  const [defs, wordTagsList, relations] = await Promise.all([
    fetchDefinitionsByWordId(word.id),
    fetchTagsByWordId(word.id),
    fetchWordRelations(word.id),
  ]);

  return { ...serializeWord(word), definitions: defs, tags: wordTagsList, relations };
});
