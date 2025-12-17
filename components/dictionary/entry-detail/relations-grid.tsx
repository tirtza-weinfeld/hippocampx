"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Route } from "next";
import type { SenseRelationInfo } from "@/lib/db/queries/dictionary/types";

interface RelationsGridProps {
  relations: SenseRelationInfo[];
  languageCode: string;
}

/** Display labels for relation types - Google Dictionary style */
const RELATION_LABELS: Record<string, string> = {
  synonym: "Similar",
  antonym: "Opposite",
  related: "Related",
  derived: "Derived from",
  hypernym: "Broader term",
  hyponym: "More specific",
  meronym: "Part of",
  holonym: "Includes",
};

/** Get display label for relation type */
function getRelationLabel(type: string): string {
  return RELATION_LABELS[type.toLowerCase()] ?? type;
}

/** Group relations by their type */
function groupRelationsByType(
  relations: SenseRelationInfo[]
): Map<string, SenseRelationInfo[]> {
  const groups = new Map<string, SenseRelationInfo[]>();

  for (const relation of relations) {
    const type = relation.relationType.toLowerCase();
    const existing = groups.get(type) ?? [];
    groups.set(type, [...existing, relation]);
  }

  return groups;
}

export function RelationsGrid({ relations, languageCode }: RelationsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (relations.length === 0) return null;

  const groupedRelations = groupRelationsByType(relations);

  return (
    <section className="space-y-4">
      {Array.from(groupedRelations.entries()).map(([type, group]) => (
        <div key={type} className="space-y-2.5">
          {/* Section label - Google style */}
          <span className="text-sm font-medium text-dict-text-secondary">
            {getRelationLabel(type)}
          </span>

          {/* Horizontal pill flow - Google Dictionary style */}
          <div className="flex flex-wrap gap-2">
            {group.map((relation) => {
              const relatedUrl = `/dictionary/${languageCode}/${encodeURIComponent(
                relation.targetEntryLemma
              )}`;

              return (
                <Link
                  key={`${relation.id}-${relation.relationType}`}
                  href={relatedUrl as Route}
                >
                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                      bg-dict-surface-2 hover:bg-dict-surface-3
                      border border-dict-border hover:border-dict-border-hover
                      text-sm font-medium text-dict-text hover:text-dict-primary
                      transition-colors duration-150 cursor-pointer
                      shadow-xs hover:shadow-dict-sm"
                  >
                    {relation.targetEntryLemma}
                    {relation.explanation && (
                      <span className="text-xs text-dict-text-tertiary font-normal max-w-32 truncate">
                        ({relation.explanation})
                      </span>
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
