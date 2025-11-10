// import 'server-only';

// import { cache } from 'react';
// import { eq, like, sql } from 'drizzle-orm';
// import { db } from './query';
// import {
//   words,
//   definitions,
//   synonyms,
//   antonyms,
//   phrases,
//   relatedWords,
//   wordForms,
//   type WordWithDefinitions
// } from './dictionary-schema';

// // Fast: Just word metadata (pronunciation, audio)
// export const getWordBasic = cache(async (word: string) => {
//   const [wordData] = await db.select().from(words).where(eq(words.word, word.toLowerCase()));
//   return wordData;
// });

// // Medium: Definitions with word forms
// export const getWordDefinitions = cache(async (wordId: string) => {
//   const [definitionsData, wordFormsData] = await Promise.all([
//     db.select().from(definitions)
//       .where(eq(definitions.wordId, wordId))
//       .orderBy(definitions.partOfSpeech, definitions.orderIndex),
//     db.select().from(wordForms).where(eq(wordForms.wordId, wordId)),
//   ]);

//   return { definitions: definitionsData, wordForms: wordFormsData };
// });

// // Slow: Related words with validation
// export const getWordRelated = cache(async (wordId: string) => {
//   const [phrasesData, synonymsData, antonymsData, relatedWordsData] = await Promise.all([
//     db.select().from(phrases).where(eq(phrases.wordId, wordId)),
//     db.select().from(synonyms)
//       .innerJoin(definitions, eq(synonyms.definitionId, definitions.id))
//       .where(eq(definitions.wordId, wordId)),
//     db.select().from(antonyms)
//       .innerJoin(definitions, eq(antonyms.definitionId, definitions.id))
//       .where(eq(definitions.wordId, wordId)),
//     db.select().from(relatedWords)
//       .innerJoin(definitions, eq(relatedWords.definitionId, definitions.id))
//       .where(eq(definitions.wordId, wordId)),
//   ]);

//   // Group by definition ID
//   const synonymsByDef = new Map<string, typeof synonymsData>();
//   const antonymsByDef = new Map<string, typeof antonymsData>();
//   const relatedByDef = new Map<string, typeof relatedWordsData>();

//   for (const item of synonymsData) {
//     const defId = item.synonyms.definitionId;
//     if (!synonymsByDef.has(defId)) synonymsByDef.set(defId, []);
//     synonymsByDef.get(defId)!.push(item);
//   }

//   for (const item of antonymsData) {
//     const defId = item.antonyms.definitionId;
//     if (!antonymsByDef.has(defId)) antonymsByDef.set(defId, []);
//     antonymsByDef.get(defId)!.push(item);
//   }

//   for (const item of relatedWordsData) {
//     const defId = item.related_words.definitionId;
//     if (!relatedByDef.has(defId)) relatedByDef.set(defId, []);
//     relatedByDef.get(defId)!.push(item);
//   }

//   // Collect all words for validation
//   const allRelatedWords = [
//     ...synonymsData.map(s => s.synonyms.synonym),
//     ...antonymsData.map(a => a.antonyms.antonym),
//     ...relatedWordsData.map(r => r.related_words.relatedWord),
//   ];

//   const existingWords = allRelatedWords.length > 0 ? await validateWords(allRelatedWords) : new Set<string>();

//   return {
//     phrases: phrasesData,
//     synonymsByDef,
//     antonymsByDef,
//     relatedByDef,
//     existingWords,
//   };
// });

// // Legacy: Full word fetch (for backward compatibility)
// export const getWord = cache(async (word: string): Promise<WordWithDefinitions | undefined> => {
//   const wordData = await getWordBasic(word);

//   if (!wordData) {
//     return undefined;
//   }

//   const [{ definitions, wordForms }, { phrases, synonymsByDef, antonymsByDef, relatedByDef }] = await Promise.all([
//     getWordDefinitions(wordData.id),
//     getWordRelated(wordData.id),
//   ]);

//   const definitionsWithRelations = definitions.map((def) => ({
//     ...def,
//     synonyms: (synonymsByDef.get(def.id) ?? []).map(item => item.synonyms),
//     antonyms: (antonymsByDef.get(def.id) ?? []).map(item => item.antonyms),
//     relatedWords: (relatedByDef.get(def.id) ?? []).map(item => item.related_words),
//   }));

//   return {
//     ...wordData,
//     definitions: definitionsWithRelations,
//     phrases,
//     wordForms,
//   };
// });

// export const getAllWords = cache(async () => {
//   return await db.select().from(words).orderBy(words.word);
// });

// type SearchWordsParams = {
//   query?: string;
//   limit?: number;
//   offset?: number;
// };

// export const searchWords = cache(async (params: SearchWordsParams = {}) => {
//   const { query = '', limit = 50, offset = 0 } = params;

//   if (query) {
//     const searchPattern = `%${query.toLowerCase()}%`;
//     return await db
//       .select()
//       .from(words)
//       .where(like(words.word, searchPattern))
//       .orderBy(words.word)
//       .limit(limit)
//       .offset(offset);
//   }

//   return await db
//     .select()
//     .from(words)
//     .orderBy(words.word)
//     .limit(limit)
//     .offset(offset);
// });

// export const getWordsCount = cache(async (query?: string) => {
//   if (query) {
//     const searchPattern = `%${query.toLowerCase()}%`;
//     const result = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(words)
//       .where(like(words.word, searchPattern));
//     return Number(result[0]?.count ?? 0);
//   }

//   const result = await db
//     .select({ count: sql<number>`count(*)` })
//     .from(words);
//   return Number(result[0]?.count ?? 0);
// });

// export const wordExists = cache(async (word: string): Promise<boolean> => {
//   const result = await db.select({ word: words.word }).from(words).where(eq(words.word, word.toLowerCase())).limit(1);
//   return result.length > 0;
// });

// export const validateWords = cache(async (wordList: string[]): Promise<Set<string>> => {
//   if (wordList.length === 0) return new Set();

//   const uniqueWords = [...new Set(wordList.map(w => w.toLowerCase()))];

//   // Use IN instead of ANY for better performance
//   const results = await db
//     .select({ word: words.word })
//     .from(words)
//     .where(sql`${words.word} IN (${sql.join(uniqueWords.map(w => sql`${w}`), sql`, `)})`);

//   return new Set(results.map(r => r.word));
// });