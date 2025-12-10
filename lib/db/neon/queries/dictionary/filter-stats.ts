/**
 * Filter Stats - Tag, source, and source part statistics
 *
 * Uses React cache() for request-level deduplication.
 * Adapted for new senseTags/sourceParts schema structure.
 */

import "server-only";

import { cache } from "react";
import { eq, asc, count } from "drizzle-orm";
import { neonDb } from "../../connection";
import {
  tags,
  senseTags,
  senses,
  sources,
  sourceParts,
  examples,
} from "../../schemas/dictionary";
import { slugify } from "@/lib/utils";
import type { TagStat, SourceStat, SourcePartStat } from "./types";

// ============================================================================
// TAG STATISTICS
// ============================================================================

/** Fetch tag stats with sense counts */
export const fetchTagStats = cache(async (): Promise<TagStat[]> => {
  const result = await neonDb
    .select({
      id: tags.id,
      name: tags.name,
      category: tags.category,
      senseCount: count(senseTags.sense_id),
    })
    .from(tags)
    .leftJoin(senseTags, eq(tags.id, senseTags.tag_id))
    .groupBy(tags.id, tags.name, tags.category)
    .orderBy(asc(tags.name));

  return result.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    senseCount: r.senseCount,
  }));
});

// ============================================================================
// SOURCE STATISTICS
// ============================================================================

/** Fetch sources with entry counts */
export const fetchSourcesWithEntryCount = cache(async (): Promise<SourceStat[]> => {
  // Count unique entries that have examples from each source
  // Path: sources → sourceParts → examples → senses → entries
  const rows = await neonDb
    .select({
      source_id: sources.id,
      entry_id: senses.entry_id,
    })
    .from(sources)
    .leftJoin(sourceParts, eq(sources.id, sourceParts.source_id))
    .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
    .leftJoin(senses, eq(examples.sense_id, senses.id));

  // Count unique entries per source
  const entryMap = new Map<number, Set<number>>();
  for (const r of rows) {
    if (!entryMap.has(r.source_id)) entryMap.set(r.source_id, new Set());
    if (r.entry_id) {
      const set = entryMap.get(r.source_id);
      if (set) set.add(r.entry_id);
    }
  }

  const allSources = await neonDb
    .select()
    .from(sources)
    .orderBy(asc(sources.title));

  return allSources.map(s => ({
    id: s.id,
    title: s.title,
    type: s.type,
    entryCount: entryMap.get(s.id)?.size ?? 0,
  }));
});

// ============================================================================
// SOURCE PART STATISTICS
// ============================================================================

/** Fetch source parts with entry counts */
export const fetchSourcePartsWithEntryCount = cache(async (): Promise<SourcePartStat[]> => {
  const rows = await neonDb
    .select({
      source_part_id: sourceParts.id,
      source_id: sourceParts.source_id,
      name: sourceParts.name,
      type: sourceParts.type,
      order_index: sourceParts.order_index,
      source_title: sources.title,
      source_type: sources.type,
      entry_id: senses.entry_id,
    })
    .from(sourceParts)
    .innerJoin(sources, eq(sourceParts.source_id, sources.id))
    .leftJoin(examples, eq(sourceParts.id, examples.source_part_id))
    .leftJoin(senses, eq(examples.sense_id, senses.id))
    .orderBy(asc(sources.title), asc(sourceParts.order_index), asc(sourceParts.name));

  const partMap = new Map<
    number,
    {
      sourcePart: {
        id: number;
        source_id: number;
        name: string;
        type: string | null;
        order_index: number | null;
        source_title: string;
        source_type: string;
      };
      entryIds: Set<number>;
    }
  >();

  for (const r of rows) {
    if (!partMap.has(r.source_part_id)) {
      partMap.set(r.source_part_id, {
        sourcePart: {
          id: r.source_part_id,
          source_id: r.source_id,
          name: r.name,
          type: r.type,
          order_index: r.order_index,
          source_title: r.source_title,
          source_type: r.source_type,
        },
        entryIds: new Set(),
      });
    }
    if (r.entry_id) {
      const entry = partMap.get(r.source_part_id);
      if (entry) entry.entryIds.add(r.entry_id);
    }
  }

  // Preserve order from query
  const result: SourcePartStat[] = [];
  const seen = new Set<number>();
  for (const r of rows) {
    if (!seen.has(r.source_part_id)) {
      seen.add(r.source_part_id);
      const entry = partMap.get(r.source_part_id);
      if (entry) {
        result.push({
          id: entry.sourcePart.id,
          name: entry.sourcePart.name,
          type: entry.sourcePart.type,
          sourceId: entry.sourcePart.source_id,
          sourceTitle: entry.sourcePart.source_title,
          sourceType: entry.sourcePart.source_type,
          entryCount: entry.entryIds.size,
        });
      }
    }
  }
  return result;
});

// ============================================================================
// SLUG RESOLUTION
// ============================================================================

export async function resolveTagSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchTagStats();
  return slugs
    .map(slug => stats.find(s => slugify(s.name) === slug)?.id)
    .filter((id): id is number => id !== undefined);
}

export async function resolveSourceSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchSourcesWithEntryCount();
  return slugs
    .map(slug => stats.find(s => slugify(s.title) === slug)?.id)
    .filter((id): id is number => id !== undefined);
}

export async function resolveSourcePartSlugs(slugs: string[]): Promise<number[]> {
  if (slugs.length === 0) return [];
  const stats = await fetchSourcePartsWithEntryCount();
  return slugs
    .map(slug => stats.find(s => slugify(s.name) === slug)?.id)
    .filter((id): id is number => id !== undefined);
}
