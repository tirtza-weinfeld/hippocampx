"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { WordEditModeProvider, useWordEditMode } from "@/components/dictionary/word-edit-mode-provider";
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
  source: string | null;
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

export function WordDetailClient({ word: initialWord }: { word: WordComplete }) {
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

  const [pendingWordText, setPendingWordText] = useState(word.word_text);
  const [pendingLanguageCode, setPendingLanguageCode] = useState(word.language_code);
  const [pendingDefinitions, setPendingDefinitions] = useState(word.definitions);

  async function handleSave() {
    setIsSaving(true);

    try {
      if (pendingWordText !== word.word_text || pendingLanguageCode !== word.language_code) {
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
      pendingDefinitions.map((def) =>
        def.id === defId
          ? { ...def, definition_text: definitionText, part_of_speech: partOfSpeech }
          : def
      )
    );
  }

  function handleDefinitionDelete(defId: number) {
    setPendingDefinitions(pendingDefinitions.filter((def) => def.id !== defId));
    setWord({
      ...word,
      definitions: word.definitions.filter((def) => def.id !== defId),
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
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <WordHeaderEditable
            initialWordText={word.word_text}
            initialLanguageCode={word.language_code}
            onUpdate={handleWordUpdate}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm"
          >
            {word.created_at
              ? `Added ${new Date(word.created_at).toLocaleDateString()}`
              : "Recently added"}
          </motion.p>
        </div>

        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button
                onClick={() => { void handleSave() }}
                disabled={isSaving}
                className="gap-2"
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
            </>
          ) : (
            <>
              <Button
                onClick={() => setEditMode(true)}
                variant="default"
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Word
              </Button>
              <DeleteWordButton wordId={word.id} />
            </>
          )}
        </div>
      </div>

      {(word.tags.length > 0 || isEditMode) && (
        <>
          <Separator />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <WordTagsEditable wordId={word.id} initialTags={word.tags} />
          </motion.div>
        </>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Definitions</h2>
          {isEditMode && (
            <Button
              onClick={() => { void handleAddDefinition() }}
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
            <div className="space-y-6">
              {pendingDefinitions.map((def, index) => (
                <WordDefinitionEditable
                  key={def.id}
                  wordId={word.id}
                  definitionId={def.id}
                  definitionText={def.definition_text}
                  partOfSpeech={def.part_of_speech}
                  definitionIndex={index + 1}
                  examples={def.examples}
                  onUpdate={(text, pos) =>
                    handleDefinitionUpdate(def.id, text, pos)
                  }
                  onDelete={() => handleDefinitionDelete(def.id)}
                />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12"
          >
            {isEditMode ? (
              <Button
                onClick={() => { void handleAddDefinition() }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Definition
              </Button>
            ) : (
              <p>No definitions yet</p>
            )}
          </motion.div>
        )}
      </div>

      {word.relations && word.relations.length > 0 && (
        <>
          <Separator />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold">Related Words</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {word.relations.map((relation) => {
                const relatedUrl = `/dictionary/${word.language_code}/${encodeURIComponent(
                  relation.related_word_text
                )}`;
                return (
                  <Link
                    key={`${relation.word_id_2}-${relation.relation_type}`}
                    href={relatedUrl as Route }
                  >
                    <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{relation.related_word_text}</span>
                      <span className="text-xs text-muted-foreground">
                        {relation.relation_type}
                      </span>
                    </div>
                  </motion.div>
                </Link>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
