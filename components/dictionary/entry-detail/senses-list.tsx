"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Music } from "lucide-react";
import type { SenseWithDetails } from "@/lib/db/queries/dictionary/types";

interface SensesListProps {
  senses: SenseWithDetails[];
}

export function SensesList({ senses }: SensesListProps) {
  const shouldReduceMotion = useReducedMotion();

  if (senses.length === 0) {
    return (
      <p className="text-dict-text-tertiary text-sm py-4">
        No definitions available.
      </p>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-8">
        {/* All senses belong to the same entry, so no grouping by POS needed here */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
          }}
          className="space-y-4"
        >
          {/* Definitions list - numbered */}
          <ol className="space-y-5 list-none">
            {senses.map((sense, index) => (
              <motion.li
                key={sense.id}
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
                    {sense.definition}
                  </p>

                  {/* Examples - indented with subtle styling */}
                  {sense.examples.length > 0 && (
                    <div className="space-y-2 pl-4 border-l-2 border-dict-border">
                      {sense.examples.map((example) => {
                        const hasSource =
                          example.sourcePartName || example.sourceTitle;
                        return (
                          <div key={example.id} className="space-y-1">
                            <p className="text-sm text-dict-text-secondary">
                              &ldquo;{example.text}&rdquo;
                            </p>
                            {hasSource && (
                              <div className="flex items-center gap-1.5 text-xs text-dict-text-tertiary">
                                <Music className="h-3 w-3 text-dict-accent" />
                                <span>{example.sourcePartName}</span>
                                {example.sourceTitle && (
                                  <>
                                    <span className="opacity-60">-</span>
                                    <span className="text-dict-accent">
                                      {example.sourceTitle}
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
            ))}
          </ol>
        </motion.section>
      </div>
    </AnimatePresence>
  );
}
