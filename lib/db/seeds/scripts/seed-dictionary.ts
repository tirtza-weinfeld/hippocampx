/**
 * Seed script for dictionary (new schema)
 * Run with: pnpm db:seed:dictionary
 * Options:
 *   --override  Replace existing entries (default: skip)
 *
 * New Schema Structure:
 * - LexicalEntry: lemma + part_of_speech + language_code (unique)
 * - WordForm: Inflected forms with grammatical features (JSONB)
 * - Sense: Definitions attached to entries
 * - Example: Usage examples attached to senses
 * - SenseRelation: Relations between senses (synonym, antonym, etc.)
 * - Tags: Attached to senses (via sense_tags)
 * - Sources/SourceParts: Hierarchical citations
 * - Contributors/SourceCredits: Author/composer credits
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import {
  lexicalEntries,
  wordForms,
  senses,
  examples,
  senseRelations,
  categories,
  tags,
  senseTags,
  sources,
  sourceParts,
  contributors,
  sourceCredits,
  partOfSpeechEnum,
} from "../../schemas/dictionary";

type PartOfSpeech = (typeof partOfSpeechEnum.enumValues)[number];
import {
  dictionaryData,
  type LexicalEntrySeed,
  type SenseSeed,
  type ExampleSourceSeed,
  type ContributorSeed,
} from "../data/dictionary";

config({ path: ".env.local" });

const shouldOverride = process.argv.includes("--override");

type DbType = ReturnType<typeof drizzle>;

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

async function getEntryId(
  db: DbType,
  lemma: string,
  partOfSpeech: PartOfSpeech,
  languageCode: string
): Promise<number | null> {
  const [existing] = await db
    .select()
    .from(lexicalEntries)
    .where(
      and(
        eq(lexicalEntries.lemma, lemma),
        eq(lexicalEntries.part_of_speech, partOfSpeech),
        eq(lexicalEntries.language_code, languageCode)
      )
    );

  return existing?.id ?? null;
}

async function getSenseId(
  db: DbType,
  lemma: string,
  partOfSpeech: PartOfSpeech,
  languageCode: string,
  senseIndex = 0
): Promise<number | null> {
  const entryId = await getEntryId(db, lemma, partOfSpeech, languageCode);
  if (!entryId) return null;

  const [existing] = await db
    .select()
    .from(senses)
    .where(and(eq(senses.entry_id, entryId), eq(senses.order_index, senseIndex)));

  return existing?.id ?? null;
}

// =============================================================================
// CATEGORY DEFINITIONS
// =============================================================================

/**
 * Predefined categories for tags.
 *
 * 3 orthogonal filter dimensions for learners:
 * - register: HOW the word is used (style/formality)
 * - region: WHERE the word is used (geographic)
 * - level: WHO should learn it (proficiency)
 *
 * Domain/topic handled via sense definitions + embeddings, not tags.
 */
const CATEGORY_DEFINITIONS: Array<{ id: string; displayName: string; aiDescription?: string }> = [
  { id: "register", displayName: "Register", aiDescription: "Usage style: formal, informal, slang, literary, technical, vulgar, archaic, dated" },
  { id: "region", displayName: "Region", aiDescription: "Geographic variety: British, American, Australian, Irish, Indian, South African, global" },
  { id: "level", displayName: "Level", aiDescription: "CEFR proficiency: A1, A2, B1, B2, C1, C2, academic, native" },
];

/**
 * Map tag names to their categories.
 * Format: "tagName" -> "categoryId"
 * Default: "register" (most common dimension for unlisted tags)
 */
const TAG_CATEGORY_MAP: Record<string, string> = {
  // Register (style/formality)
  formal: "register",
  informal: "register",
  slang: "register",
  literary: "register",
  technical: "register",
  vulgar: "register",
  archaic: "register",
  dated: "register",
  poetic: "register",
  colloquial: "register",
  // Region (geographic)
  British: "region",
  American: "region",
  Australian: "region",
  Irish: "region",
  Indian: "region",
  "South African": "region",
  global: "region",
  // Level (CEFR proficiency)
  A1: "level",
  A2: "level",
  B1: "level",
  B2: "level",
  C1: "level",
  C2: "level",
  academic: "level",
  native: "level",
  GRE: "level",
  SAT: "level",
  TOEFL: "level",
  IELTS: "level",
};

// =============================================================================
// GET OR CREATE HELPERS
// =============================================================================

/** Ensure all categories exist in the database */
async function seedCategories(db: DbType): Promise<void> {
  for (const cat of CATEGORY_DEFINITIONS) {
    const [existing] = await db.select().from(categories).where(eq(categories.id, cat.id));
    if (!existing) {
      await db.insert(categories).values({
        id: cat.id,
        displayName: cat.displayName,
        aiDescription: cat.aiDescription,
      });
      console.log(`  [category] Created: ${cat.displayName}`);
    }
  }
}

/** Get category ID for a tag name */
function getCategoryForTag(tagName: string): string {
  return TAG_CATEGORY_MAP[tagName] ?? "register";
}

async function getOrCreateTag(db: DbType, tagName: string): Promise<number> {
  const categoryId = getCategoryForTag(tagName);

  const [existing] = await db
    .select()
    .from(tags)
    .where(and(eq(tags.name, tagName), eq(tags.categoryId, categoryId)));

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(tags)
    .values({ name: tagName, categoryId })
    .returning();

  console.log(`    [tag] Created: ${tagName} (${categoryId})`);
  return inserted.id;
}

async function getOrCreateContributor(
  db: DbType,
  contributor: ContributorSeed
): Promise<number> {
  // Contributors can have duplicate names, but for seeding we'll match by name
  const [existing] = await db
    .select()
    .from(contributors)
    .where(eq(contributors.name, contributor.name));

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(contributors)
    .values({ name: contributor.name })
    .returning();

  console.log(`    [contributor] Created: ${contributor.name}`);
  return inserted.id;
}

async function getOrCreateSource(
  db: DbType,
  sourceData: ExampleSourceSeed["source"]
): Promise<number> {
  const [existing] = await db
    .select()
    .from(sources)
    .where(and(eq(sources.type, sourceData.type), eq(sources.title, sourceData.title)));

  if (existing) {
    return existing.id;
  }

  const [inserted] = await db
    .insert(sources)
    .values({
      type: sourceData.type,
      title: sourceData.title,
      publication_year: sourceData.publication_year,
    })
    .returning();

  console.log(`    [source] Created: ${sourceData.type} - ${sourceData.title}`);

  // Add credits if contributors provided
  if (sourceData.contributors) {
    for (const contrib of sourceData.contributors) {
      const contributorId = await getOrCreateContributor(db, contrib);
      await db
        .insert(sourceCredits)
        .values({
          source_id: inserted.id,
          contributor_id: contributorId,
          role: contrib.role,
        })
        .onConflictDoNothing();
    }
  }

  return inserted.id;
}

async function getOrCreateSourcePart(
  db: DbType,
  sourceId: number,
  partPath: string[],
  parentPartId: number | null = null
): Promise<number> {
  if (partPath.length === 0) {
    throw new Error("partPath cannot be empty");
  }

  const [currentPart, ...remainingPath] = partPath;

  // Find or create current part
  const whereCondition = parentPartId
    ? and(
        eq(sourceParts.source_id, sourceId),
        eq(sourceParts.parent_part_id, parentPartId),
        eq(sourceParts.name, currentPart)
      )
    : and(
        eq(sourceParts.source_id, sourceId),
        eq(sourceParts.name, currentPart)
      );

  const [existing] = await db.select().from(sourceParts).where(whereCondition);

  let partId: number;
  if (existing) {
    partId = existing.id;
  } else {
    const [inserted] = await db
      .insert(sourceParts)
      .values({
        source_id: sourceId,
        parent_part_id: parentPartId,
        name: currentPart,
      })
      .returning();
    partId = inserted.id;
    console.log(`    [source_part] Created: ${currentPart}`);
  }

  // Recurse for remaining path
  if (remainingPath.length > 0) {
    return getOrCreateSourcePart(db, sourceId, remainingPath, partId);
  }

  return partId;
}

async function resolveExampleSource(
  db: DbType,
  exampleSource: ExampleSourceSeed
): Promise<number | null> {
  const sourceId = await getOrCreateSource(db, exampleSource.source);

  if (exampleSource.part_path && exampleSource.part_path.length > 0) {
    return getOrCreateSourcePart(db, sourceId, exampleSource.part_path);
  }

  return null;
}

// =============================================================================
// CLEAR DATA (for override mode)
// =============================================================================

async function clearEntryData(db: DbType, entryId: number): Promise<void> {
  // Get all sense IDs for this entry
  const entrySenses = await db
    .select({ id: senses.id })
    .from(senses)
    .where(eq(senses.entry_id, entryId));

  const senseIds = entrySenses.map(s => s.id);

  // Clear sense-related data
  for (const senseId of senseIds) {
    await db.delete(examples).where(eq(examples.sense_id, senseId));
    await db.delete(senseTags).where(eq(senseTags.sense_id, senseId));
    await db.delete(senseRelations).where(eq(senseRelations.source_sense_id, senseId));
  }

  // Clear senses and forms
  await db.delete(senses).where(eq(senses.entry_id, entryId));
  await db.delete(wordForms).where(eq(wordForms.entry_id, entryId));
}

// =============================================================================
// SEED ENTRY
// =============================================================================

async function seedSense(
  db: DbType,
  entryId: number,
  senseData: SenseSeed,
  index: number
): Promise<number> {
  const [sense] = await db
    .insert(senses)
    .values({
      entry_id: entryId,
      definition: senseData.definition,
      order_index: senseData.order_index ?? index,
      is_synthetic: senseData.is_synthetic ?? false,
    })
    .returning();

  // Add examples
  if (senseData.examples) {
    for (const ex of senseData.examples) {
      let sourcePartId: number | null = null;
      if (ex.source) {
        sourcePartId = await resolveExampleSource(db, ex.source);
      }

      await db.insert(examples).values({
        sense_id: sense.id,
        text: ex.text,
        source_part_id: sourcePartId,
      });
    }
  }

  // Add tags
  if (senseData.tags) {
    for (const tagName of senseData.tags) {
      const tagId = await getOrCreateTag(db, tagName);
      await db
        .insert(senseTags)
        .values({ sense_id: sense.id, tag_id: tagId })
        .onConflictDoNothing();
    }
  }

  return sense.id;
}

async function seedEntry(db: DbType, entryData: LexicalEntrySeed): Promise<void> {
  // Check if entry exists
  const existingId = await getEntryId(
    db,
    entryData.lemma,
    entryData.part_of_speech,
    entryData.language_code
  );

  let entryId: number;

  if (existingId) {
    if (!shouldOverride) {
      console.log(`  - ${entryData.lemma} (${entryData.part_of_speech}) [skipped]`);
      return;
    }
    // Override mode: clear existing data
    console.log(`  ~ ${entryData.lemma} (${entryData.part_of_speech}) [updating]`);
    entryId = existingId;
    await clearEntryData(db, entryId);
    await db
      .update(lexicalEntries)
      .set({
        updated_at: new Date(),
        metadata: entryData.metadata,
      })
      .where(eq(lexicalEntries.id, entryId));
  } else {
    // Insert new entry
    console.log(`  + ${entryData.lemma} (${entryData.part_of_speech})`);
    const [entry] = await db
      .insert(lexicalEntries)
      .values({
        lemma: entryData.lemma,
        part_of_speech: entryData.part_of_speech,
        language_code: entryData.language_code,
        metadata: entryData.metadata,
      })
      .returning();
    entryId = entry.id;
  }

  // Insert word forms
  if (entryData.forms) {
    for (const form of entryData.forms) {
      await db.insert(wordForms).values({
        entry_id: entryId,
        form_text: form.form_text,
        grammatical_features: form.grammatical_features,
      });
    }
  }

  // Insert senses
  const senseIdMap = new Map<number, number>(); // order_index -> sense_id
  for (let i = 0; i < entryData.senses.length; i++) {
    const senseData = entryData.senses[i];
    const senseId = await seedSense(db, entryId, senseData, i);
    senseIdMap.set(senseData.order_index ?? i, senseId);
  }

  // Handle sense relations (second pass - all senses must exist first)
  for (const senseData of entryData.senses) {
    if (!senseData.relations) continue;

    const sourceSenseId = senseIdMap.get(senseData.order_index ?? 0);
    if (!sourceSenseId) continue;

    for (const rel of senseData.relations) {
      // Try to find target sense
      const targetSenseId = await getSenseId(
        db,
        rel.target_lemma,
        rel.target_pos ?? entryData.part_of_speech,
        entryData.language_code,
        0 // Default to first sense
      );

      if (targetSenseId) {
        await db
          .insert(senseRelations)
          .values({
            source_sense_id: sourceSenseId,
            target_sense_id: targetSenseId,
            relation_type: rel.relation_type,
            strength: rel.strength ?? 100,
            explanation: rel.explanation,
          })
          .onConflictDoNothing();
      } else {
        console.log(`    [relation] Skipped: ${rel.target_lemma} not found`);
      }
    }
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function seed(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding dictionary (new schema)...");
  console.log(`Mode: ${shouldOverride ? "OVERRIDE" : "SKIP"} existing entries\n`);

  // Seed categories first (required for tags)
  console.log("Seeding categories...");
  await seedCategories(db);

  console.log(`\nSeeding ${dictionaryData.length} entries...`);
  for (const entryData of dictionaryData) {
    await seedEntry(db, entryData);
  }

  console.log("\nDone!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding:", error);
  process.exit(1);
});
