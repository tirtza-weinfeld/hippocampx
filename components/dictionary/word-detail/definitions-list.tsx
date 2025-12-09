"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Music } from "lucide-react";
import type { DefinitionWithExamples } from "@/lib/db/neon/schema";

interface DefinitionsListProps {
  definitions: DefinitionWithExamples[];
}

export function DefinitionsList({ definitions }: DefinitionsListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (definitions.length === 0) {
    return (
      <p className="text-dict-text-tertiary text-sm py-4">
        No definitions available.
      </p>
    );
  }

  // Group definitions by part of speech - Google style
  const grouped = definitions.reduce<Record<string, DefinitionWithExamples[]>>(
    function groupByPos(acc, def) {
      const pos = def.part_of_speech ?? "noun";
      const existing = acc[pos] ?? [];
      return { ...acc, [pos]: [...existing, def] };
    },
    {}
  );

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-8">
        {Object.entries(grouped).map(function renderPosGroup([pos, defs], groupIndex) {
          return (
            <motion.section
              key={pos}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : groupIndex * 0.1,
              }}
              className="space-y-4"
            >
              {/* Part of speech header - italic like Google */}
              <h2 className="text-dict-text-secondary italic text-base border-b border-dict-border pb-2">
                {pos}
              </h2>

              {/* Definitions list - numbered */}
              <ol className="space-y-5 list-none">
                {defs.map(function renderDefinition(def, index) {
                  return (
                    <motion.li
                      key={def.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        delay: shouldReduceMotion ? 0 : index * 0.05,
                      }}
                      className="flex gap-4"
                    >
                      {/* Number */}
                      <span className="text-dict-text-tertiary text-sm font-medium mt-0.5 select-none">
                        {index + 1}.
                      </span>

                      <div className="flex-1 space-y-3">
                        {/* Definition text */}
                        <p className="text-dict-text leading-relaxed">
                          {def.definition_text}
                        </p>

                        {/* Examples - indented with subtle styling */}
                        {def.examples.length > 0 && (
                          <div className="space-y-2 pl-4 border-l-2 border-dict-border">
                            {def.examples.map(function renderExample(example) {
                              const hasSource =
                                example.source_part_name || example.source_title;
                              return (
                                <div key={example.id} className="space-y-1">
                                  <p className="text-sm text-dict-text-secondary">
                                    &ldquo;{example.example_text}&rdquo;
                                  </p>
                                  {hasSource && (
                                    <div className="flex items-center gap-1.5 text-xs text-dict-text-tertiary">
                                      <Music className="h-3 w-3 text-dict-accent" />
                                      <span>{example.source_part_name}</span>
                                      {example.source_title && (
                                        <>
                                          <span className="opacity-60">-</span>
                                          <span className="text-dict-accent">
                                            {example.source_title}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.section>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
