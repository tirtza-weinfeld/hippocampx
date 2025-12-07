"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import {
  updateDefinition,
  deleteDefinition,
  createExample,
} from "@/lib/actions/vocabulary";
import { EditableExample } from "./editable-example";

interface Example {
  id: number;
  definition_id: number;
  example_text: string;
  source: string | null;
  created_at?: string;
}

interface EditableDefinitionProps {
  wordId: number;
  definitionId: number;
  definitionText: string;
  partOfSpeech: string | null;
  definitionIndex: number;
  examples: Example[];
}

const PARTS_OF_SPEECH = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "preposition",
  "conjunction",
  "interjection",
  "determiner",
  "auxiliary",
  "phrase",
  "other",
];

export function EditableDefinition({
  wordId,
  definitionId,
  definitionText: initialText,
  partOfSpeech: initialPOS,
  definitionIndex,
  examples: initialExamples,
}: EditableDefinitionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [definitionText, setDefinitionText] = useState(initialText);
  const [partOfSpeech, setPartOfSpeech] = useState(initialPOS || "noun");
  const [isPending, startTransition] = useTransition();
  const [examples, setExamples] = useState<Example[]>(initialExamples);
  const [isAddingExample, setIsAddingExample] = useState(false);

  function handleSave() {
    if (!definitionText.trim()) {
      return;
    }

    startTransition(async () => {
      const result = await updateDefinition(
        definitionId,
        wordId,
        definitionText.trim(),
        partOfSpeech
      );

      if (result.success) {
        setIsEditing(false);
      }
    });
  }

  function handleCancel() {
    setDefinitionText(initialText);
    setPartOfSpeech(initialPOS || "noun");
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this definition?")) {
      return;
    }

    startTransition(async () => {
      await deleteDefinition(definitionId, wordId);
    });
  }

  function handleAddExample(exampleText: string, source: string) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("definition_id", definitionId.toString());
      formData.set("word_id", wordId.toString());
      formData.set("example_text", exampleText);
      if (source.trim()) {
        formData.set("source", source);
      }

      const result = await createExample(formData);
      if (result.success && result.exampleId) {
        const newExample: Example = {
          id: result.exampleId,
          definition_id: definitionId,
          example_text: exampleText,
          source: source || null,
        };
        setExamples([...examples, newExample]);
        setIsAddingExample(false);
      }
    });
  }

  function handleExampleDeleted(exampleId: number) {
    setExamples(examples.filter((ex) => ex.id !== exampleId));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {definitionIndex}.
                </span>
                {isEditing ? (
                  <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTS_OF_SPEECH.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary">{partOfSpeech}</Badge>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={definitionText}
                  onChange={(e) => setDefinitionText(e.target.value)}
                  className="text-lg border-2"
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      e.preventDefault();
                      handleSave();
                    } else if (e.key === "Escape") {
                      handleCancel();
                    }
                  }}
                />
              ) : (
                <CardTitle className="text-lg font-normal">
                  {initialText}
                </CardTitle>
              )}
            </div>
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSave}
                    disabled={isPending}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {(examples.length > 0 || isAddingExample) && (
          <CardContent className="space-y-3">
            <h4 className="text-sm font-semibold">Examples:</h4>
            <AnimatePresence mode="popLayout">
              {examples.map((example) => (
                <EditableExample
                  key={example.id}
                  wordId={wordId}
                  exampleId={example.id}
                  exampleText={example.example_text}
                  source={example.source}
                  onDeleted={handleExampleDeleted}
                />
              ))}
            </AnimatePresence>

            {isAddingExample ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AddExampleForm
                  onAdd={handleAddExample}
                  onCancel={() => setIsAddingExample(false)}
                />
              </motion.div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingExample(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Example
              </Button>
            )}
          </CardContent>
        )}

        {examples.length === 0 && !isAddingExample && (
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingExample(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Example
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function AddExampleForm({
  onAdd,
  onCancel,
}: {
  onAdd: (text: string, source: string) => void;
  onCancel: () => void;
}) {
  const [exampleText, setExampleText] = useState("");
  const [source, setSource] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!exampleText.trim()) return;

    startTransition(() => {
      onAdd(exampleText, source);
    });
  }

  return (
    <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
      <Textarea
        placeholder="Enter example sentence..."
        value={exampleText}
        onChange={(e) => setExampleText(e.target.value)}
        rows={2}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            e.preventDefault();
            handleSubmit();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
      <input
        type="text"
        placeholder="Source (optional)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-md"
      />
      <div className="flex gap-2 justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending || !exampleText.trim()}
        >
          Add
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
