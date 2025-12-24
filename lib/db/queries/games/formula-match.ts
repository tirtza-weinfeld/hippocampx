/**
 * Formula Match Game Queries
 *
 * Fetches formula notations with their associated lemmas for the matching game.
 */

import "server-only";

import { db } from "@/lib/db/connection";
import { eq, and, sql } from "drizzle-orm";
import {
  senseNotations,
  senses,
  lexicalEntries,
} from "@/lib/db/schemas/dictionary";

export type FormulaLemmaPair = {
  id: number;
  formula: string;
  lemma: string;
  definition: string;
};

/**
 * Fetch all formula notations with their lemmas
 */
export async function fetchFormulaLemmaPairs(
  languageCode = "en"
): Promise<FormulaLemmaPair[]> {
  const results = await db
    .select({
      id: senseNotations.id,
      formula: senseNotations.value,
      lemma: lexicalEntries.lemma,
      definition: senses.definition,
    })
    .from(senseNotations)
    .innerJoin(senses, eq(senseNotations.sense_id, senses.id))
    .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
    .where(
      and(
        eq(senseNotations.type, "formula"),
        eq(lexicalEntries.language_code, languageCode)
      )
    )
    .orderBy(sql`random()`);

  return results.filter(
    (r) => r.formula && r.lemma && r.definition
  ) as FormulaLemmaPair[];
}

/**
 * Fetch a random subset of formula-lemma pairs for a game round
 */
export async function fetchGameRound(
  count = 4,
  languageCode = "en"
): Promise<FormulaLemmaPair[]> {
  const results = await db
    .select({
      id: senseNotations.id,
      formula: senseNotations.value,
      lemma: lexicalEntries.lemma,
      definition: senses.definition,
    })
    .from(senseNotations)
    .innerJoin(senses, eq(senseNotations.sense_id, senses.id))
    .innerJoin(lexicalEntries, eq(senses.entry_id, lexicalEntries.id))
    .where(
      and(
        eq(senseNotations.type, "formula"),
        eq(lexicalEntries.language_code, languageCode)
      )
    )
    .orderBy(sql`random()`)
    .limit(count);

  return results.filter(
    (r) => r.formula && r.lemma && r.definition
  ) as FormulaLemmaPair[];
}
