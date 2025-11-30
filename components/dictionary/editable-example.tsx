"use client";

import { useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { updateExample, deleteExample } from "@/lib/actions/vocabulary";

interface EditableExampleProps {
  wordId: number;
  exampleId: number;
  exampleText: string;
  source: string | null;
  onDeleted: (exampleId: number) => void;
}

export function EditableExample({
  wordId,
  exampleId,
  exampleText: initialText,
  source: initialSource,
  onDeleted,
}: EditableExampleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [exampleText, setExampleText] = useState(initialText);
  const [source, setSource] = useState(initialSource || "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!exampleText.trim()) {
      return;
    }

    setIsSaving(true);
    const result = await updateExample(
      exampleId,
      wordId,
      exampleText.trim(),
      source.trim() || undefined
    );
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setExampleText(initialText);
    setSource(initialSource || "");
    setIsEditing(false);
  }

  async function handleDelete() {
    const result = await deleteExample(exampleId, wordId);
    if (result.success) {
      onDeleted(exampleId);
    }
  }

  if (isEditing) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-2 p-3 border-l-2 border-primary bg-muted/30 rounded"
      >
        <Textarea
          value={exampleText}
          onChange={(e) => setExampleText(e.target.value)}
          className="text-sm italic border-2"
          rows={2}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              handleSave();
            } else if (e.key === "Escape") {
              handleCancel();
            }
          }}
        />
        <input
          type="text"
          placeholder="Source (optional)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full px-3 py-2 text-xs border rounded-md"
        />
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-7"
          >
            <Check className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-7"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
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
      className="border-l-2 pl-4 py-2 border-muted flex justify-between items-start gap-2 group hover:border-primary transition-colors"
    >
      <div className="flex-1">
        <p className="text-sm italic">"{initialText}"</p>
        {initialSource && (
          <p className="text-xs text-muted-foreground mt-1">— {initialSource}</p>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
