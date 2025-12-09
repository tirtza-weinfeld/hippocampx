/**
 * Filter Stats - Tag, source, and source part statistics
 */

import "server-only";

import { unstable_cache } from "next/cache";
import { eq, asc, count } from "drizzle-orm";
import { neonDb } from "../../connection";
import { tags, wordTags, sources, sourceParts, examples, definitions } from "../../schema";
import { slugify } from "@/lib/utils";

export const fetchTagStats = unstable_cache(
  async function fetchTagStats() {
    const result = await neonDb
      .select({
        id: tags.id,
        name: tags.name,
        description: tags.description,
        wordCount: count(wordTags.word_id),
      })
      .from(tags)
      .leftJoin(wordTags, eq(tags.id, wordTags.tag_id))
      .groupBy(tags.id, tags.name, tags.description)
      .orderBy(asc(tags.name));

    return result.map(r => ({
      tag: { id: r.id, name: r.name, description: r.description },
      wordCount: r.wordCount,
    }));
  },
  ["dictionary-tag-stats"],
  { revalidate: 300, tags: ["dictionary-tags"] }
);

export const fetchSourcesWithWordCount = unstable_cache(
  async function fetchSourcesWithWordCount() {
    const rows = await neonDb
      .select({ source_id: sources.id, word_id: definitions.word_id })
      .from(sources)
      .leftJoin(sourceParts, eq(sources.id, sourceParts.source_id))
      .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
      .leftJoin(definitions, eq(examples.definition_id, definitions.id));

    const wordMap = new Map<number, Set<number>>();
    for (const r of rows) {
      if (!wordMap.has(r.source_id)) wordMap.set(r.source_id, new Set());
      if (r.word_id) {
        const set = wordMap.get(r.source_id);
        if (set) set.add(r.word_id);
      }
    }

    const allSources = await neonDb.select().from(sources).orderBy(asc(sources.title));
    return allSources.map(s => ({
      source: s,
      wordCount: wordMap.get(s.id)?.size ?? 0,
    }));
  },
  ["dictionary-sources-word-count"],
  { revalidate: 300, tags: ["dictionary-sources"] }
);

export const fetchSourcePartsWithWordCount = unstable_cache(
  async function fetchSourcePartsWithWordCount() {
    const rows = await neonDb
      .select({
        source_part_id: sourceParts.id,
        source_id: sourceParts.source_id,
        name: sourceParts.name,
        order: sourceParts.order,
        source_title: sources.title,
        source_type: sources.type,
        word_id: definitions.word_id,
      })
      .from(sourceParts)
      .innerJoin(sources, eq(sourceParts.source_id, sources.id))
      .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
      .leftJoin(definitions, eq(examples.definition_id, definitions.id))
      .orderBy(asc(sources.title), asc(sourceParts.order), asc(sourceParts.name));

    const partMap = new Map<
      number,
      {
        sourcePart: {
          id: number;
          source_id: number;
          name: string;
          order: number | null;
          source_title: string;
          source_type: string;
        };
        wordIds: Set<number>;
      }
    >();

    for (const r of rows) {
      if (!partMap.has(r.source_part_id)) {
        partMap.set(r.source_part_id, {
          sourcePart: {
            id: r.source_part_id,
            source_id: r.source_id,
            name: r.name,
            order: r.order,
            source_title: r.source_title,
            source_type: r.source_type,
          },
          wordIds: new Set(),
        });
      }
      if (r.word_id) {
        const entry = partMap.get(r.source_part_id);
        if (entry) entry.wordIds.add(r.word_id);
      }
    }

    const result: Array<{
      sourcePart: {
        id: number;
        source_id: number;
        name: string;
        order: number | null;
        source_title: string;
        source_type: string;
      };
      wordCount: number;
    }> = [];

    const seen = new Set<number>();
    for (const r of rows) {
      if (!seen.has(r.source_part_id)) {
        seen.add(r.source_part_id);
        const entry = partMap.get(r.source_part_id);
        if (entry) {
          result.push({ sourcePart: entry.sourcePart, wordCount: entry.wordIds.size });
        }
      }
    }
    return result;
  },
  ["dictionary-source-parts-word-count"],
  { revalidate: 300, tags: ["dictionary-source-parts"] }
);

export async function resolveTagSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchTagStats();
  return slugs
    .map(slug => stats.find(s => slugify(s.tag.name) === slug)?.tag.id)
    .filter((id): id is number => id !== undefined);
}

export async function resolveSourceSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchSourcesWithWordCount();
  return slugs
    .map(slug => stats.find(s => slugify(s.source.title) === slug)?.source.id)
    .filter((id): id is number => id !== undefined);
}

export async function resolveSourcePartSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchSourcePartsWithWordCount();
  return slugs
    .map(slug => stats.find(s => slugify(s.sourcePart.name) === slug)?.sourcePart.id)
    .filter((id): id is number => id !== undefined);
}
