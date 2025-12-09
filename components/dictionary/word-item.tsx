"use client";

import { Suspense } from "react";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { WordDefinitionsLoader } from "./word-definitions-loader";

interface DefinitionPreview {
  definition_text: string;
  example_text: string | null;
}

interface WordData {
  id: number;
  word_text: string;
  language_code: string;
}

interface WordItemProps {
  word: WordData;
  href: Route;
  definitionsPromise: Promise<Map<number, DefinitionPreview>>;
}

export function WordItem({ word, href, definitionsPromise }: WordItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={href}>
        <div className="group">
          <div className="rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 border border-border/50 hover:border-border/80 hover:shadow-sm transition-all duration-200">
            <div className="h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 group-hover:from-sky-400 group-hover:via-sky-300 group-hover:to-sky-400 dark:group-hover:from-sky-600 dark:group-hover:via-sky-500 dark:group-hover:to-sky-600 transition-all duration-300" />
            <div className="p-3 flex items-start gap-4">
              <p className="text-sm font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 min-w-[100px] shrink-0">
                {word.word_text}
              </p>
              <div className="flex-1 min-w-0">
                <Suspense fallback={<DefinitionSkeleton />}>
                  <WordDefinitionsLoader
                    definitionsPromise={definitionsPromise}
                    wordId={word.id}
                  >
                    {function renderDefinition(definition) {
                      if (definition) {
                        return (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {definition.definition_text}
                            {definition.example_text && (
                              <span className="text-xs italic ml-2 text-muted-foreground/70">
                                &mdash; {definition.example_text}
                              </span>
                            )}
                          </p>
                        );
                      }
                      return (
                        <p className="text-xs text-muted-foreground/50 italic">
                          No definition yet
                        </p>
                      );
                    }}
                  </WordDefinitionsLoader>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function DefinitionSkeleton() {
  return <Skeleton className="h-5 w-3/4" />;
}
