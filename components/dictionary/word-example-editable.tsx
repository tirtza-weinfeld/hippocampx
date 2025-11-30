"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { deleteExample } from "@/lib/actions/vocabulary";
import { useWordEditMode } from "./word-edit-mode-provider";

interface WordExampleEditableProps {
  wordId: number;
  exampleId: number;
  exampleText: string;
  source: string | null;
  onUpdate: (exampleId: number, exampleText: string, source: string) => void;
  onDelete: (exampleId: number) => void;
}

export function WordExampleEditable({
  wordId,
  exampleId,
  exampleText: initialText,
  source: initialSource,
  onUpdate,
  onDelete,
}: WordExampleEditableProps) {
  const { isEditMode } = useWordEditMode();
  const [exampleText, setExampleText] = useState(initialText);
  const [source, setSource] = useState(initialSource || "");

  function handleExampleChange(value: string) {
    setExampleText(value);
    onUpdate(exampleId, value, source);
  }

  function handleSourceChange(value: string) {
    setSource(value);
    onUpdate(exampleId, exampleText, value);
  }

  async function handleDelete() {
    const result = await deleteExample(exampleId, wordId);
    if (result.success) {
      onDelete(exampleId);
    }
  }

  if (isEditMode) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-2 p-3 border-l-2 border-primary bg-muted/30 rounded group"
      >
        <div className="flex items-start gap-2">
          <Textarea
            value={exampleText}
            onChange={(e) => handleExampleChange(e.target.value)}
            className="text-sm italic flex-1"
            rows={2}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <input
          type="text"
          placeholder="Source (optional)"
          value={source}
          onChange={(e) => handleSourceChange(e.target.value)}
          className="w-full px-3 py-2 text-xs border rounded-md"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="border-l-2 pl-4 py-2 border-muted"
    >
      <p className="text-sm italic">"{initialText}"</p>
      {initialSource && (
        <p className="text-xs text-muted-foreground mt-1">— {initialSource}</p>
      )}
    </motion.div>
  );
}
