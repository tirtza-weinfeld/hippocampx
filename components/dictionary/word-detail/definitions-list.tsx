"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { BookText, Sparkles, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DefinitionWithExamples } from "@/lib/db/neon/schema";

interface DefinitionsListProps {
  definitions: DefinitionWithExamples[];
}

export function DefinitionsList({ definitions }: DefinitionsListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-50 to-purple-100/80 dark:from-violet-950/60 dark:to-purple-900/40 ring-1 ring-violet-200/50 dark:ring-violet-700/30">
          <BookText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Definitions</h2>
      </div>

      {definitions.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {definitions.map(function renderDefinition(def, index) {
              return (
                <motion.div
                  key={def.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <Badge variant="secondary">
                          {def.part_of_speech || "noun"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-normal">
                        {def.definition_text}
                      </CardTitle>
                    </CardHeader>

                    {def.examples.length > 0 && (
                      <CardContent className="space-y-3">
                        <h4 className="text-sm font-semibold">Examples:</h4>
                        {def.examples.map(function renderExample(example) {
                          const hasSource =
                            example.source_part_name || example.source_title;
                          return (
                            <motion.div
                              key={example.id}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                              className="border-l-2 pl-4 py-2 border-sky-200 dark:border-sky-800"
                            >
                              <p className="text-sm italic text-muted-foreground">
                                &ldquo;{example.example_text}&rdquo;
                              </p>
                              {hasSource && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1.5">
                                  <Music className="h-3 w-3" />
                                  <span className="font-medium">
                                    {example.source_part_name}
                                  </span>
                                  {example.source_title && (
                                    <>
                                      <span className="text-muted-foreground/50">
                                        from
                                      </span>
                                      <span>{example.source_title}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border/60 bg-muted/20"
        >
          <div className="rounded-xl bg-muted/40 p-4 mb-4">
            <Sparkles className="h-6 w-6 text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground text-sm">No definitions yet</p>
        </motion.div>
      )}
    </section>
  );
}
