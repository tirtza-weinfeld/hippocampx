"use client";

import { useState, useTransition } from "react";
import { Trash2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "motion/react";
import { deleteExample } from "@/lib/actions/vocabulary";
import { useWordEditMode } from "./word-edit-mode-provider";

interface WordExampleEditableProps {
  wordId: number;
  exampleId: number;
  exampleText: string;
  sourcePartName?: string | null;
  sourceTitle?: string | null;
  onUpdate: (exampleId: number, exampleText: string) => void;
  onDelete: (exampleId: number) => void;
}

export function WordExampleEditable({
  wordId,
  exampleId,
  exampleText: initialText,
  sourcePartName,
  sourceTitle,
  onUpdate,
  onDelete,
}: WordExampleEditableProps) {
  const { isEditMode } = useWordEditMode();
  const [exampleText, setExampleText] = useState(initialText);
  const [isPending, startTransition] = useTransition();

  function handleExampleChange(value: string) {
    setExampleText(value);
    onUpdate(exampleId, value);
  }

  function handleDelete() {
    startTransition(async function performDelete() {
      const result = await deleteExample(exampleId, wordId);
      if (result.success) {
        onDelete(exampleId);
      }
    });
  }

  const hasSource = sourcePartName || sourceTitle;

  if (isEditMode) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-2 p-3 border-l-2 border-sky-500/50 bg-sky-50/30 dark:bg-sky-950/20 rounded-lg group"
      >
        <div className="flex items-start gap-2">
          <Textarea
            value={exampleText}
            onChange={function handleChange(e) {
              handleExampleChange(e.target.value);
            }}
            className="text-sm italic flex-1 bg-background/80"
            rows={2}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {hasSource && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Music className="h-3 w-3" />
            <span>{sourcePartName}</span>
            {sourceTitle && (
              <>
                <span className="text-muted-foreground/50">from</span>
                <span className="font-medium">{sourceTitle}</span>
              </>
            )}
          </div>
        )}
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
      className="border-l-2 pl-4 py-2 border-sky-200 dark:border-sky-800"
    >
      <p className="text-sm italic text-muted-foreground">
        &ldquo;{initialText}&rdquo;
      </p>
      {hasSource && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1.5">
          <Music className="h-3 w-3" />
          <span className="font-medium">{sourcePartName}</span>
          {sourceTitle && (
            <>
              <span className="text-muted-foreground/50">from</span>
              <span>{sourceTitle}</span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
