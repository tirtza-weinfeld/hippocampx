"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExample } from "@/lib/actions/vocabulary";

interface DeleteExampleButtonProps {
  exampleId: number;
  wordId: number;
}

export function DeleteExampleButton({
  exampleId,
  wordId,
}: DeleteExampleButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteExample(exampleId, wordId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
