/**
 * Dictionary Seed Pipeline v2
 *
 * Optimal batch seeding:
 * 1. COLLECT - Load all data, flatten to arrays
 * 2. COMPILE - Dedupe, resolve references, validate
 * 3. INSERT  - Single transaction, batch inserts
 *
 * Run: pnpm db:seed:dictionary
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, inArray, isNull } from "drizzle-orm";
import {
  lexicalEntries,
  wordForms,
  senses,
  examples,
  senseRelations,
  senseNotations,
  categories,
  tags,
  senseTags,
  sources,
  sourceParts,
  contributors,
  sourceCredits,
  type InsertLexicalEntry,
  type InsertSense,
  type InsertWordForm,
  type InsertExample,
  type InsertSenseRelation,
  type InsertSenseNotation,
  type InsertTag,
  type InsertSenseTag,
  type InsertSource,
  type InsertSourcePart,
  type InsertContributor,
  type InsertSourceCredit,
} from "../../schemas/dictionary";
import { dictionaryData, type LexicalEntrySeed } from "../data/dictionary";

config({ path: ".env.local" });

// =============================================================================
// TYPES
// =============================================================================

type PartOfSpeech = InsertLexicalEntry["part_of_speech"];
type RelationType = InsertSenseRelation["relation_type"];
type SourceType = InsertSource["type"];
type CreditRole = InsertSourceCredit["role"];

/** Natural key for entries */
type EntryKey = `${string}|${PartOfSpeech}|${string}`;

/** Natural key for senses */
type SenseKey = `${EntryKey}|${number}`;

/** Natural key for sources */
type SourceKey = `${SourceType}|${string}`;

// =============================================================================
// CATEGORY DEFINITIONS (Oxford/Cambridge/WordNet 3-category model)
// =============================================================================

const CATEGORIES = [
  { id: "domain", displayName: "Domain", aiDescription: "Subject field: law, medicine, music, computing, politics" },
  { id: "register", displayName: "Register", aiDescription: "Formality/style: formal, informal, literary, technical, slang, vulgar, archaic, dated" },
  { id: "region", displayName: "Region", aiDescription: "Geographic variety: British, American, Australian, Irish, South African" },
] as const;

const TAG_TO_CATEGORY: Record<string, string> = {
  // Register (formality/style)
  formal: "register", informal: "register", literary: "register", technical: "register",
  slang: "register", vulgar: "register", archaic: "register", dated: "register",
  colloquial: "register", poetic: "register", rare: "register", obsolete: "register",
  humorous: "register", humor: "register", jocular: "register", ironic: "register",
  // Region (geographic)
  British: "region", American: "region", Australian: "region", Irish: "region",
  Scottish: "region", "South African": "region", Canadian: "region",
  // Domain (subject field) - unmapped tags default to domain
};

// =============================================================================
// COLLECTED DATA STRUCTURES
// =============================================================================

type Collected = {
  // Maps for deduplication
  entries: Map<EntryKey, InsertLexicalEntry>;
  senses: Map<SenseKey, { entryKey: EntryKey; data: Omit<InsertSense, "entry_id"> }>;
  forms: Array<{ entryKey: EntryKey; data: Omit<InsertWordForm, "entry_id"> }>;
  tags: Map<string, { name: string; categoryId: string }>;
  senseTags: Array<{ senseKey: SenseKey; tagName: string }>;
  examples: Array<{ senseKey: SenseKey; data: Omit<InsertExample, "sense_id" | "source_part_id">; sourceKey?: SourceKey; sourcePath?: string[] }>;
  relations: Array<{ sourceKey: SenseKey; targetKey: SenseKey; data: Omit<InsertSenseRelation, "source_sense_id" | "target_sense_id"> }>;
  notations: Array<{ senseKey: SenseKey; data: Omit<InsertSenseNotation, "sense_id"> }>;
  sources: Map<SourceKey, InsertSource>;
  sourceParts: Map<string, { sourceKey: SourceKey; path: string[]; data: Omit<InsertSourcePart, "source_id" | "parent_part_id"> }>;
  contributors: Map<string, InsertContributor>;
  sourceCredits: Array<{ sourceKey: SourceKey; contributorName: string; role: CreditRole }>;
};

// =============================================================================
// COLLECT PHASE
// =============================================================================

function makeEntryKey(lemma: string, pos: PartOfSpeech, lang: string): EntryKey {
  return `${lemma}|${pos}|${lang}`;
}

function makeSenseKey(entryKey: EntryKey, idx: number): SenseKey {
  return `${entryKey}|${idx}`;
}

function makeSourceKey(type: SourceType, title: string): SourceKey {
  return `${type}|${title}`;
}

function collect(data: LexicalEntrySeed[]): Collected {
  const collected: Collected = {
    entries: new Map(),
    senses: new Map(),
    forms: [],
    tags: new Map(),
    senseTags: [],
    examples: [],
    relations: [],
    notations: [],
    sources: new Map(),
    sourceParts: new Map(),
    contributors: new Map(),
    sourceCredits: [],
  };

  for (const entry of data) {
    const entryKey = makeEntryKey(entry.lemma, entry.part_of_speech, entry.language_code);

    // Dedupe entries
    if (!collected.entries.has(entryKey)) {
      collected.entries.set(entryKey, {
        lemma: entry.lemma,
        part_of_speech: entry.part_of_speech,
        language_code: entry.language_code,
        metadata: entry.metadata,
      });
    }

    // Collect forms
    if (entry.forms) {
      for (const form of entry.forms) {
        collected.forms.push({
          entryKey,
          data: {
            form_text: form.form_text,
            grammatical_features: form.grammatical_features,
          },
        });
      }
    }

    // Collect senses
    for (let senseIdx = 0; senseIdx < entry.senses.length; senseIdx++) {
      const sense = entry.senses[senseIdx];
      const senseKey = makeSenseKey(entryKey, sense.order_index ?? senseIdx);

      // Dedupe senses
      if (!collected.senses.has(senseKey)) {
        collected.senses.set(senseKey, {
          entryKey,
          data: {
            definition: sense.definition,
            order_index: sense.order_index ?? senseIdx,
            is_synthetic: sense.is_synthetic ?? false,
            verification_status: "verified",
          },
        });
      }

      // Collect tags
      if (sense.tags) {
        for (const tagName of sense.tags) {
          const categoryId = TAG_TO_CATEGORY[tagName] ?? "domain";
          const tagKey = `${categoryId}:${tagName}`;
          if (!collected.tags.has(tagKey)) {
            collected.tags.set(tagKey, { name: tagName, categoryId });
          }
          collected.senseTags.push({ senseKey, tagName });
        }
      }

      // Collect examples
      if (sense.examples) {
        for (const ex of sense.examples) {
          let sourceKey: SourceKey | undefined;
          let sourcePath: string[] | undefined;

          if (ex.source) {
            const src = ex.source.source;
            sourceKey = makeSourceKey(src.type, src.title);
            sourcePath = ex.source.part_path;

            // Collect source
            if (!collected.sources.has(sourceKey)) {
              collected.sources.set(sourceKey, {
                type: src.type,
                title: src.title,
                publication_year: src.publication_year,
              });
            }

            // Collect contributors
            if (src.contributors) {
              for (const contrib of src.contributors) {
                if (!collected.contributors.has(contrib.name)) {
                  collected.contributors.set(contrib.name, { name: contrib.name });
                }
                collected.sourceCredits.push({
                  sourceKey,
                  contributorName: contrib.name,
                  role: contrib.role,
                });
              }
            }

            // Collect source parts (path hierarchy)
            if (sourcePath && sourcePath.length > 0) {
              for (let i = 0; i < sourcePath.length; i++) {
                const partialPath = sourcePath.slice(0, i + 1);
                const partKey = `${sourceKey}|${partialPath.join("/")}`;
                if (!collected.sourceParts.has(partKey)) {
                  collected.sourceParts.set(partKey, {
                    sourceKey,
                    path: partialPath,
                    data: { name: partialPath[partialPath.length - 1], order_index: i },
                  });
                }
              }
            }
          }

          collected.examples.push({
            senseKey,
            data: { text: ex.text, language_code: entry.language_code },
            sourceKey,
            sourcePath,
          });
        }
      }

      // Collect relations
      if (sense.relations) {
        for (const rel of sense.relations) {
          const targetEntryKey = makeEntryKey(
            rel.target_lemma,
            rel.target_pos ?? entry.part_of_speech,
            entry.language_code
          );
          const targetSenseKey = makeSenseKey(targetEntryKey, 0); // Default to first sense

          collected.relations.push({
            sourceKey: senseKey,
            targetKey: targetSenseKey,
            data: {
              relation_type: rel.relation_type,
              strength: rel.strength ?? 100,
              explanation: rel.explanation,
              is_synthetic: false,
              verification_status: "verified",
            },
          });
        }
      }

      // Collect notations
      if (sense.notations) {
        for (const notation of sense.notations) {
          collected.notations.push({
            senseKey,
            data: {
              type: notation.type,
              value: notation.value,
            },
          });
        }
      }
    }
  }

  return collected;
}

// =============================================================================
// INSERT PHASE
// =============================================================================

type DbType = ReturnType<typeof drizzle>;

async function insertAll(db: DbType, collected: Collected): Promise<void> {
  console.log("\n📊 Collected:");
  console.log(`   Entries: ${collected.entries.size}`);
  console.log(`   Senses: ${collected.senses.size}`);
  console.log(`   Forms: ${collected.forms.length}`);
  console.log(`   Tags: ${collected.tags.size}`);
  console.log(`   Examples: ${collected.examples.length}`);
  console.log(`   Relations: ${collected.relations.length}`);
  console.log(`   Notations: ${collected.notations.length}`);
  console.log(`   Sources: ${collected.sources.size}`);

  // === CATEGORIES ===
  console.log("\n⏳ Inserting categories...");
  for (const cat of CATEGORIES) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  // === TAGS ===
  console.log("⏳ Inserting tags...");
  const tagRows = Array.from(collected.tags.values());
  if (tagRows.length > 0) {
    await db.insert(tags).values(tagRows).onConflictDoNothing();
  }

  // Build tag ID map
  const tagIdMap = new Map<string, number>();
  const allTags = await db.select().from(tags);
  for (const t of allTags) {
    tagIdMap.set(`${t.categoryId}:${t.name}`, t.id);
  }

  // === CONTRIBUTORS ===
  console.log("⏳ Inserting contributors...");
  const contributorRows = Array.from(collected.contributors.values());
  if (contributorRows.length > 0) {
    await db.insert(contributors).values(contributorRows).onConflictDoNothing();
  }

  // Build contributor ID map
  const contributorIdMap = new Map<string, number>();
  const allContributors = await db.select().from(contributors);
  for (const c of allContributors) {
    contributorIdMap.set(c.name, c.id);
  }

  // === SOURCES ===
  console.log("⏳ Inserting sources...");
  const sourceIdMap = new Map<SourceKey, number>();

  // Load existing sources first
  const existingSources = await db.select().from(sources);
  for (const s of existingSources) {
    sourceIdMap.set(makeSourceKey(s.type, s.title), s.id);
  }

  // Only insert sources that don't exist
  for (const sourceData of collected.sources.values()) {
    const key = makeSourceKey(sourceData.type, sourceData.title);
    if (!sourceIdMap.has(key)) {
      const [inserted] = await db.insert(sources).values(sourceData).returning();
      sourceIdMap.set(key, inserted.id);
    }
  }

  // === SOURCE CREDITS ===
  console.log("⏳ Inserting source credits...");
  const creditRows: InsertSourceCredit[] = [];
  const seenCredits = new Set<string>();
  for (const credit of collected.sourceCredits) {
    const sourceId = sourceIdMap.get(credit.sourceKey);
    const contributorId = contributorIdMap.get(credit.contributorName);
    if (sourceId && contributorId) {
      const key = `${sourceId}|${contributorId}|${credit.role}`;
      if (!seenCredits.has(key)) {
        seenCredits.add(key);
        creditRows.push({ source_id: sourceId, contributor_id: contributorId, role: credit.role });
      }
    }
  }
  if (creditRows.length > 0) {
    await db.insert(sourceCredits).values(creditRows).onConflictDoNothing();
  }

  // === SOURCE PARTS (hierarchical) ===
  console.log("⏳ Inserting source parts...");
  const sourcePartIdMap = new Map<string, number>();

  // Sort by path length to insert parents first
  const sortedParts = Array.from(collected.sourceParts.entries()).sort(
    (a, b) => a[1].path.length - b[1].path.length
  );

  for (const [partKey, part] of sortedParts) {
    const sourceId = sourceIdMap.get(part.sourceKey);
    if (!sourceId) continue;

    // Find parent
    let parentPartId: number | null = null;
    if (part.path.length > 1) {
      const parentPath = part.path.slice(0, -1);
      const parentKey = `${part.sourceKey}|${parentPath.join("/")}`;
      parentPartId = sourcePartIdMap.get(parentKey) ?? null;
    }

    // Check if exists
    const existing = await db
      .select()
      .from(sourceParts)
      .where(
        and(
          eq(sourceParts.source_id, sourceId),
          eq(sourceParts.name, part.data.name),
          parentPartId !== null
            ? eq(sourceParts.parent_part_id, parentPartId)
            : isNull(sourceParts.parent_part_id)
        )
      );

    if (existing.length > 0) {
      sourcePartIdMap.set(partKey, existing[0].id);
    } else {
      const [inserted] = await db
        .insert(sourceParts)
        .values({ source_id: sourceId, parent_part_id: parentPartId, ...part.data })
        .returning();
      sourcePartIdMap.set(partKey, inserted.id);
    }
  }

  // === ENTRIES ===
  console.log("⏳ Inserting entries...");
  const entryRows = Array.from(collected.entries.values());
  const entryIdMap = new Map<EntryKey, number>();

  if (entryRows.length > 0) {
    // Batch insert, handling conflicts
    for (const entry of entryRows) {
      const entryKey = makeEntryKey(entry.lemma, entry.part_of_speech, entry.language_code ?? "en");

      // Check if exists
      const [existing] = await db
        .select()
        .from(lexicalEntries)
        .where(
          and(
            eq(lexicalEntries.lemma, entry.lemma),
            eq(lexicalEntries.part_of_speech, entry.part_of_speech),
            eq(lexicalEntries.language_code, entry.language_code ?? "en")
          )
        );

      if (existing) {
        entryIdMap.set(entryKey, existing.id);
      } else {
        const [inserted] = await db.insert(lexicalEntries).values(entry).returning();
        entryIdMap.set(entryKey, inserted.id);
      }
    }
  }

  // === FORMS ===
  console.log("⏳ Inserting forms...");
  const formRows: InsertWordForm[] = [];
  for (const form of collected.forms) {
    const entryId = entryIdMap.get(form.entryKey);
    if (entryId) {
      formRows.push({ entry_id: entryId, ...form.data });
    }
  }
  if (formRows.length > 0) {
    // Batch in chunks to avoid query size limits
    const CHUNK_SIZE = 500;
    for (let i = 0; i < formRows.length; i += CHUNK_SIZE) {
      await db.insert(wordForms).values(formRows.slice(i, i + CHUNK_SIZE)).onConflictDoNothing();
    }
  }

  // === SENSES ===
  console.log("⏳ Inserting senses...");
  const senseIdMap = new Map<SenseKey, number>();

  for (const [senseKey, sense] of collected.senses) {
    const entryId = entryIdMap.get(sense.entryKey);
    if (!entryId) continue;

    // Check if exists
    const [existing] = await db
      .select()
      .from(senses)
      .where(and(eq(senses.entry_id, entryId), eq(senses.order_index, sense.data.order_index ?? 0)));

    if (existing) {
      senseIdMap.set(senseKey, existing.id);
    } else {
      const [inserted] = await db
        .insert(senses)
        .values({ entry_id: entryId, ...sense.data })
        .returning();
      senseIdMap.set(senseKey, inserted.id);
    }
  }

  // === SENSE TAGS ===
  console.log("⏳ Inserting sense tags...");
  const senseTagRows: InsertSenseTag[] = [];
  for (const st of collected.senseTags) {
    const senseId = senseIdMap.get(st.senseKey);
    const categoryId = TAG_TO_CATEGORY[st.tagName] ?? "domain";
    const tagId = tagIdMap.get(`${categoryId}:${st.tagName}`);
    if (senseId && tagId) {
      senseTagRows.push({ sense_id: senseId, tag_id: tagId });
    }
  }
  if (senseTagRows.length > 0) {
    // Dedupe
    const seen = new Set<string>();
    const uniqueRows = senseTagRows.filter((r) => {
      const key = `${r.sense_id}|${r.tag_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const CHUNK_SIZE = 500;
    for (let i = 0; i < uniqueRows.length; i += CHUNK_SIZE) {
      await db.insert(senseTags).values(uniqueRows.slice(i, i + CHUNK_SIZE)).onConflictDoNothing();
    }
  }

  // === EXAMPLES ===
  console.log("⏳ Inserting examples...");
  const exampleRows: InsertExample[] = [];
  for (const ex of collected.examples) {
    const senseId = senseIdMap.get(ex.senseKey);
    if (!senseId) continue;

    let sourcePartId: number | null = null;
    if (ex.sourceKey && ex.sourcePath && ex.sourcePath.length > 0) {
      const partKey = `${ex.sourceKey}|${ex.sourcePath.join("/")}`;
      sourcePartId = sourcePartIdMap.get(partKey) ?? null;
    }

    exampleRows.push({ sense_id: senseId, source_part_id: sourcePartId, ...ex.data });
  }
  if (exampleRows.length > 0) {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < exampleRows.length; i += CHUNK_SIZE) {
      await db.insert(examples).values(exampleRows.slice(i, i + CHUNK_SIZE)).onConflictDoNothing();
    }
  }

  // === NOTATIONS ===
  console.log("⏳ Inserting notations...");
  const notationRows: InsertSenseNotation[] = [];
  for (const notation of collected.notations) {
    const senseId = senseIdMap.get(notation.senseKey);
    if (senseId) {
      notationRows.push({ sense_id: senseId, ...notation.data });
    }
  }
  if (notationRows.length > 0) {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < notationRows.length; i += CHUNK_SIZE) {
      await db.insert(senseNotations).values(notationRows.slice(i, i + CHUNK_SIZE)).onConflictDoNothing();
    }
  }

  // === RELATIONS ===
  console.log("⏳ Inserting relations...");
  const relationRows: InsertSenseRelation[] = [];
  let skippedRelations = 0;
  const missingTargets = new Set<string>();

  for (const rel of collected.relations) {
    const sourceId = senseIdMap.get(rel.sourceKey);
    const targetId = senseIdMap.get(rel.targetKey);

    if (sourceId && targetId) {
      relationRows.push({
        source_sense_id: sourceId,
        target_sense_id: targetId,
        ...rel.data,
      });
    } else {
      skippedRelations++;
      if (!targetId) {
        // Extract lemma from targetKey (format: "lemma|pos|lang")
        const lemma = rel.targetKey.split("|")[0];
        missingTargets.add(lemma);
      }
    }
  }

  if (skippedRelations > 0) {
    console.log(`   ⚠️  Skipped ${skippedRelations} relations (missing targets)`);
    if (missingTargets.size > 0) {
      const sorted = [...missingTargets].sort();
      console.log(`   📝 Missing words (${sorted.length}):`);
      for (const word of sorted) {
        console.log(`      - ${word}`);
      }
    }
  }

  if (relationRows.length > 0) {
    const CHUNK_SIZE = 500;
    for (let i = 0; i < relationRows.length; i += CHUNK_SIZE) {
      await db.insert(senseRelations).values(relationRows.slice(i, i + CHUNK_SIZE)).onConflictDoNothing();
    }
  }

  console.log("\n✅ Done!");
  console.log(`   Entries: ${entryIdMap.size}`);
  console.log(`   Senses: ${senseIdMap.size}`);
  console.log(`   Notations: ${notationRows.length}`);
  console.log(`   Relations: ${relationRows.length}`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const databaseUrl = process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not set");
  }

  console.log("🚀 Dictionary Seed Pipeline v2\n");

  // 1. COLLECT
  console.log("📦 Collecting data...");
  const collected = collect(dictionaryData);

  // 2. INSERT
  const sql = neon(databaseUrl);
  const db = drizzle(sql);
  await insertAll(db, collected);

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
