"use client";

import { useState } from "react";
import { createDefinition } from "@/lib/actions/vocabulary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddDefinitionForm({ wordId }: { wordId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [partOfSpeech, setPartOfSpeech] = useState("noun");

  async function handleSubmit(formData: FormData) {
    formData.set("word_id", wordId.toString());
    formData.set("part_of_speech", partOfSpeech);
    formData.set("order", "0");

    const result = await createDefinition(formData);

    if (result.success) {
      setIsOpen(false);
      setPartOfSpeech("noun");
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={function handleOpenClick() { setIsOpen(true); }} variant="outline" className="w-full">
        Add Definition
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Definition</CardTitle>
        <CardDescription>
          Provide a definition and part of speech
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-part-of-speech">Part of Speech *</Label>
            <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
              <SelectTrigger id="new-part-of-speech">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noun">Noun</SelectItem>
                <SelectItem value="verb">Verb</SelectItem>
                <SelectItem value="adjective">Adjective</SelectItem>
                <SelectItem value="adverb">Adverb</SelectItem>
                <SelectItem value="pronoun">Pronoun</SelectItem>
                <SelectItem value="preposition">Preposition</SelectItem>
                <SelectItem value="conjunction">Conjunction</SelectItem>
                <SelectItem value="interjection">Interjection</SelectItem>
                <SelectItem value="determiner">Determiner</SelectItem>
                <SelectItem value="auxiliary">Auxiliary</SelectItem>
                <SelectItem value="phrase">Phrase</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-definition">Definition *</Label>
            <Textarea
              id="new-definition"
              name="definition_text"
              placeholder="Enter the definition..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={function handleCancelClick() { setIsOpen(false); }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Definition</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
