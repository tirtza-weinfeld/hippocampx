import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';

config({ path: '.env.local' });
import { sql } from '@vercel/postgres';
import {
  words,
  definitions,
  synonyms,
  antonyms,
  phrases,
  relatedWords,
  wordForms
} from './dictionary-schema';
import { dictionaryData } from './dictionary-data';

const db = drizzle(sql);

// Configuration: Set to true to overwrite existing words, false to skip them
const OVERWRITE_MODE = process.env.OVERWRITE_EXISTING === 'true';

async function seedDictionary() {
  try {
    console.log('🌱 Starting dictionary seed...');
    console.log(`   Mode: ${OVERWRITE_MODE ? 'OVERWRITE' : 'SKIP'} existing words`);

    for (const wordData of dictionaryData.words) {
      // Check if word already exists
      const existingWord = await db
        .select()
        .from(words)
        .where(eq(words.word, wordData.word))
        .limit(1);

      if (existingWord.length > 0) {
        if (OVERWRITE_MODE) {
          console.log(`  🔄 Overwriting existing word: ${wordData.word}`);
          // Delete existing word (cascade will delete all related data)
          await db.delete(words).where(eq(words.id, existingWord[0].id));
        } else {
          console.log(`  ⏭️  Skipping existing word: ${wordData.word}`);
          continue;
        }
      } else {
        console.log(`  Seeding word: ${wordData.word}`);
      }

      // Insert word
      const [insertedWord] = await db
        .insert(words)
        .values({
          word: wordData.word,
          pronunciation: wordData.pronunciation,
          audioUrl: wordData.audioUrl,
          usage: wordData.usage,
        })
        .returning();

      // Insert definitions with related data
      for (const defData of wordData.definitions) {
        const [insertedDef] = await db
          .insert(definitions)
          .values({
            wordId: insertedWord.id,
            partOfSpeech: defData.partOfSpeech,
            definition: defData.definition,
            example: defData.example,
            orderIndex: defData.orderIndex,
          })
          .returning();

        // Insert synonyms
        if (defData.synonyms.length > 0) {
          await db.insert(synonyms).values(
            defData.synonyms.map((synonym) => ({
              definitionId: insertedDef.id,
              synonym,
            }))
          );
        }

        // Insert antonyms
        if (defData.antonyms.length > 0) {
          await db.insert(antonyms).values(
            defData.antonyms.map((antonym) => ({
              definitionId: insertedDef.id,
              antonym,
            }))
          );
        }

        // Insert related words
        if (defData.relatedWords.length > 0) {
          await db.insert(relatedWords).values(
            defData.relatedWords.map((related) => ({
              definitionId: insertedDef.id,
              relatedWord: related.relatedWord,
              relationshipType: related.relationshipType,
            }))
          );
        }
      }

      // Insert phrases
      if (wordData.phrases.length > 0) {
        await db.insert(phrases).values(
          wordData.phrases.map((phrase) => ({
            wordId: insertedWord.id,
            phrase: phrase.phrase,
            definition: phrase.definition,
            example: phrase.example,
          }))
        );
      }

      // Insert word forms
      if (wordData.wordForms.length > 0) {
        await db.insert(wordForms).values(
          wordData.wordForms.map((form) => ({
            wordId: insertedWord.id,
            formType: form.formType,
            form: form.form,
          }))
        );
      }
    }

    console.log('✅ Dictionary seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding dictionary:', error);
    process.exit(1);
  }
}

seedDictionary();