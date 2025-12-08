"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Check,
  X,
  Plus,
  Calendar,
  Link2,
  BookText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  WordEditModeProvider,
  useWordEditMode,
} from "@/components/dictionary/word-edit-mode-provider";
import { WordHeaderEditable } from "@/components/dictionary/word-header-editable";
import { WordTagsEditable } from "@/components/dictionary/word-tags-editable";
import { WordDefinitionEditable } from "@/components/dictionary/word-definition-editable";
import { DeleteWordButton } from "@/components/dictionary/delete-word-button";
import {
  updateWord,
  updateDefinition,
  createDefinition,
} from "@/lib/actions/vocabulary";
import { Route } from "next";

interface Tag {
  id: number;
  name: string;
  description: string | null;
}

interface Example {
  id: number;
  definition_id: number;
  example_text: string;
  source_part_id: number | null;
  created_at?: string;
}

interface Definition {
  id: number;
  word_id: number;
  definition_text: string;
  part_of_speech: string | null;
  order: number;
  created_at?: string;
  examples: Example[];
}

interface WordComplete {
  id: number;
  word_text: string;
  language_code: string;
  created_at?: string;
  definitions: Definition[];
  tags: Tag[];
  relations: Array<{
    word_id_1: number;
    word_id_2: number;
    relation_type: string;
    related_word_text: string;
    related_word_id: number;
  }>;
}

export function WordDetailClient({
  word: initialWord,
}: {
  word: WordComplete;
}) {
  return (
    <WordEditModeProvider>
      <WordDetailContent word={initialWord} />
    </WordEditModeProvider>
  );
}

function WordDetailContent({ word: initialWord }: { word: WordComplete }) {
  const { isEditMode, setEditMode } = useWordEditMode();
  const [word, setWord] = useState(initialWord);
  const [isSaving, setIsSaving] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const [pendingWordText, setPendingWordText] = useState(word.word_text);
  const [pendingLanguageCode, setPendingLanguageCode] = useState(
    word.language_code
  );
  const [pendingDefinitions, setPendingDefinitions] = useState(
    word.definitions
  );

  async function handleSave() {
    setIsSaving(true);

    try {
      if (
        pendingWordText !== word.word_text ||
        pendingLanguageCode !== word.language_code
      ) {
        await updateWord(word.id, pendingWordText, pendingLanguageCode);
      }

      for (const def of pendingDefinitions) {
        const originalDef = word.definitions.find((d) => d.id === def.id);
        if (
          originalDef &&
          (def.definition_text !== originalDef.definition_text ||
            def.part_of_speech !== originalDef.part_of_speech)
        ) {
          await updateDefinition(
            def.id,
            word.id,
            def.definition_text,
            def.part_of_speech || "noun"
          );
        }
      }

      setWord({
        ...word,
        word_text: pendingWordText,
        language_code: pendingLanguageCode,
        definitions: pendingDefinitions,
      });

      setEditMode(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setPendingWordText(word.word_text);
    setPendingLanguageCode(word.language_code);
    setPendingDefinitions(word.definitions);
    setEditMode(false);
  }

  function handleWordUpdate(wordText: string, languageCode: string) {
    setPendingWordText(wordText);
    setPendingLanguageCode(languageCode);
  }

  function handleDefinitionUpdate(
    defId: number,
    definitionText: string,
    partOfSpeech: string
  ) {
    setPendingDefinitions(
      pendingDefinitions.map(function updateDef(def) {
        if (def.id === defId) {
          return {
            ...def,
            definition_text: definitionText,
            part_of_speech: partOfSpeech,
          };
        }
        return def;
      })
    );
  }

  function handleDefinitionDelete(defId: number) {
    setPendingDefinitions(
      pendingDefinitions.filter(function keepDef(def) {
        return def.id !== defId;
      })
    );
    setWord({
      ...word,
      definitions: word.definitions.filter(function keepDef(def) {
        return def.id !== defId;
      }),
    });
  }

  async function handleAddDefinition() {
    const formData = new FormData();
    formData.set("word_id", word.id.toString());
    formData.set("definition_text", "New definition");
    formData.set("part_of_speech", "noun");
    formData.set("order", pendingDefinitions.length.toString());

    const result = await createDefinition(formData);

    if (result.success && result.definitionId) {
      const newDef: Definition = {
        id: result.definitionId,
        word_id: word.id,
        definition_text: "New definition",
        part_of_speech: "noun",
        order: pendingDefinitions.length,
        examples: [],
      };

      setPendingDefinitions([...pendingDefinitions, newDef]);
      setWord({
        ...word,
        definitions: [...word.definitions, newDef],
      });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-card via-card to-muted/30 border border-border/50 shadow-sm"
      >
        <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-sky-500/30 to-transparent" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="space-y-4 flex-1">
              <WordHeaderEditable
                initialWordText={word.word_text}
                initialLanguageCode={word.language_code}
                onUpdate={handleWordUpdate}
              />
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {word.created_at
                      ? `Added ${new Date(word.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Recently added"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <AnimatePresence mode="wait">
                {isEditMode ? (
                  <motion.div
                    key="edit-actions"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-2"
                  >
                    <Button
                      onClick={function onSave() {
                        void handleSave();
                      }}
                      disabled={isSaving}
                      className="gap-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-md shadow-emerald-500/20"
                    >
                      <Check className="h-4 w-4" />
                      {isSaving ? "Saving..." : "Save All"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-actions"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-2"
                  >
                    <Button
                      onClick={function onEdit() {
                        setEditMode(true);
                      }}
                      variant="default"
                      className="gap-2 bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md shadow-sky-500/20"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <DeleteWordButton wordId={word.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tags Section */}
      {(word.tags.length > 0 || isEditMode) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: 0.1 }}
        >
          <WordTagsEditable wordId={word.id} initialTags={word.tags} />
        </motion.div>
      )}

      {/* Definitions Section */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: 0.15 }}
        className="space-y-5"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-50 to-purple-100/80 dark:from-violet-950/60 dark:to-purple-900/40 ring-1 ring-violet-200/50 dark:ring-violet-700/30">
              <BookText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Definitions</h2>
          </div>
          {isEditMode && (
            <Button
              onClick={function onAddDef() {
                void handleAddDefinition();
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Definition
            </Button>
          )}
        </div>

        {pendingDefinitions.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {pendingDefinitions.map(function renderDefinition(def, index) {
                return (
                  <WordDefinitionEditable
                    key={def.id}
                    wordId={word.id}
                    definitionId={def.id}
                    definitionText={def.definition_text}
                    partOfSpeech={def.part_of_speech}
                    definitionIndex={index + 1}
                    examples={def.examples}
                    onUpdate={function onUpdate(text, pos) {
                      handleDefinitionUpdate(def.id, text, pos);
                    }}
                    onDelete={function onDelete() {
                      handleDefinitionDelete(def.id);
                    }}
                  />
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
            <p className="text-muted-foreground text-sm mb-4">
              No definitions yet
            </p>
            {isEditMode && (
              <Button
                onClick={function onAddFirstDef() {
                  void handleAddDefinition();
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Definition
              </Button>
            )}
          </motion.div>
        )}
      </motion.section>

      {/* Related Words Section */}
      {word.relations.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: 0.2 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-50 to-orange-100/80 dark:from-amber-950/60 dark:to-orange-900/40 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
              <Link2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Related Words
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {word.relations.map(function renderRelation(relation) {
              const relatedUrl = `/dictionary/${word.language_code}/${encodeURIComponent(
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
        </motion.section>
      )}
    </div>
  );
}
