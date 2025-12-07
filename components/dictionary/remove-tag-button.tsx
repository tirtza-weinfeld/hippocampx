"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeTagFromWord } from "@/lib/actions/vocabulary";

interface RemoveTagButtonProps {
  tagId: number;
  wordId: number;
}

export function RemoveTagButton({ tagId, wordId }: RemoveTagButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      const result = await removeTagFromWord(wordId, tagId);
      if (result.error) {
        console.error(result.error);
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4 p-0 hover:bg-transparent"
      onClick={handleRemove}
      disabled={isPending}
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
