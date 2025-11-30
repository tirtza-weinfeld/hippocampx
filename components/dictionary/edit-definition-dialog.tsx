"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateDefinition } from "@/lib/actions/vocabulary";

interface EditDefinitionDialogProps {
  definitionId: number;
  wordId: number;
  initialDefinitionText: string;
  initialPartOfSpeech: string | null;
}

export function EditDefinitionDialog({
  definitionId,
  wordId,
  initialDefinitionText,
  initialPartOfSpeech,
}: EditDefinitionDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleClick() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const text = prompt("Edit definition:", initialDefinitionText);
    if (text && text !== initialDefinitionText) {
      await updateDefinition(definitionId, wordId, text, initialPartOfSpeech || "noun");
    }
    setIsEditing(false);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
    >
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
