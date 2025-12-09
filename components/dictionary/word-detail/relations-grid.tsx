"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Link2 } from "lucide-react";
import type { Route } from "next";

interface WordRelation {
  word_id_1: number;
  word_id_2: number;
  relation_type: string;
  related_word_text: string;
  related_word_id: number;
}

interface RelationsGridProps {
  relations: WordRelation[];
  languageCode: string;
}

export function RelationsGrid({ relations, languageCode }: RelationsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (relations.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-50 to-orange-100/80 dark:from-amber-950/60 dark:to-orange-900/40 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
          <Link2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Related Words</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {relations.map(function renderRelation(relation) {
          const relatedUrl = `/dictionary/${languageCode}/${encodeURIComponent(
            relation.related_word_text
          )}`;
          return (
            <Link
              key={`${relation.word_id_2}-${relation.relation_type}`}
              href={relatedUrl as Route}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-sky-300/50 hover:bg-card hover:shadow-md dark:hover:border-sky-700/50"
              >
                <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex justify-between items-center">
                  <span className="font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {relation.related_word_text}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted/60 text-muted-foreground">
                    {relation.relation_type}
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
