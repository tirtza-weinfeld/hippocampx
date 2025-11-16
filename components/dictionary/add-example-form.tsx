"use client";

import { useState } from "react";
import { createExample } from "@/lib/actions/vocabulary";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddExampleForm({
  definitionId,
  wordId,
}: {
  definitionId: number;
  wordId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    formData.set("definition_id", definitionId.toString());
    formData.set("word_id", wordId.toString());

    const result = await createExample(formData);

    if (result.success) {
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={function handleOpenClick() { setIsOpen(true); }}
        variant="outline"
        size="sm"
      >
        Add Example
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 border rounded-lg p-4">
      <div className="space-y-2">
        <Label htmlFor={`example-${definitionId}`}>Example Sentence *</Label>
        <Textarea
          id={`example-${definitionId}`}
          name="example_text"
          placeholder="Enter an example sentence..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`source-${definitionId}`}>Source (Optional)</Label>
        <Input
          id={`source-${definitionId}`}
          name="source"
          placeholder="e.g., Shakespeare, Hamlet"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={function handleCancelClick() { setIsOpen(false); }}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Add Example
        </Button>
      </div>
    </form>
  );
}
