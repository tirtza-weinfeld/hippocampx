"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDefinition } from "@/lib/actions/vocabulary";

interface DeleteDefinitionButtonProps {
  definitionId: number;
  wordId: number;
}

export function DeleteDefinitionButton({
  definitionId,
  wordId,
}: DeleteDefinitionButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteDefinition(definitionId, wordId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
