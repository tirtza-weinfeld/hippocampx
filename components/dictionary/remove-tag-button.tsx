"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeTagFromWord } from "@/lib/actions/vocabulary";

interface RemoveTagButtonProps {
  tagId: number;
  wordId: number;
}

export function RemoveTagButton({ tagId, wordId }: RemoveTagButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    setIsRemoving(true);
    const result = await removeTagFromWord(wordId, tagId);
    if (result?.error) {
      console.error(result.error);
    }
    setIsRemoving(false);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4 p-0 hover:bg-transparent"
      onClick={handleRemove}
      disabled={isRemoving}
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
