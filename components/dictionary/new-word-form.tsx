"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createWord, createDefinition, createExample, createTag, addTagToWord, fetchAllTags } from "@/lib/actions/vocabulary";
import { X, Plus, Tag as TagIcon } from "lucide-react";

type Tag = {
  id: number;
  name: string;
  description: string | null;
};

type ExampleField = {
  id: string;
  text: string;
  source: string;
};

type DefinitionField = {
  id: string;
  partOfSpeech: string;
  text: string;
  examples: ExampleField[];
};

export function NewWordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [definitions, setDefinitions] = useState<DefinitionField[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [newTagName, setNewTagName] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(function loadTags() {
    async function loadTagsFromServer() {
      try {
        const result = await fetchAllTags();
        if (result.success && result.tags) {
          setAvailableTags(result.tags);
        }
      } catch (error) {
        console.error("Failed to load tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    }
    loadTagsFromServer();
  }, []);

  function handleAddDefinition() {
    setDefinitions([
      ...definitions,
      {
        id: crypto.randomUUID(),
        partOfSpeech: "noun",
        text: "",
        examples: [],
      },
    ]);
  }

  function handleRemoveDefinition(defId: string) {
    setDefinitions(definitions.filter((def) => def.id !== defId));
  }

  function handleDefinitionChange(
    defId: string,
    field: "partOfSpeech" | "text",
    value: string
  ) {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId ? { ...def, [field]: value } : def
      )
    );
  }

  function handleAddExample(defId: string) {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId
          ? {
              ...def,
              examples: [
                ...def.examples,
                { id: crypto.randomUUID(), text: "", source: "" },
              ],
            }
          : def
      )
    );
  }

  function handleRemoveExample(defId: string, exampleId: string) {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId
          ? {
              ...def,
              examples: def.examples.filter((ex) => ex.id !== exampleId),
            }
          : def
      )
    );
  }

  function handleExampleChange(
    defId: string,
    exampleId: string,
    field: "text" | "source",
    value: string
  ) {
    setDefinitions(
      definitions.map((def) =>
        def.id === defId
          ? {
              ...def,
              examples: def.examples.map((ex) =>
                ex.id === exampleId ? { ...ex, [field]: value } : ex
              ),
            }
          : def
      )
    );
  }

  function handleToggleTag(tagId: number) {
    const newSelected = new Set(selectedTagIds);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTagIds(newSelected);
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;

    try {
      const result = await createTag(newTagName.trim());
      if (result.success && result.tagId) {
        const newTag: Tag = {
          id: result.tagId,
          name: newTagName.trim(),
          description: null,
        };
        setAvailableTags([...availableTags, newTag]);
        setSelectedTagIds(new Set([...selectedTagIds, result.tagId]));
        setNewTagName("");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const wordText = formData.get("word_text") as string;
    const languageCode = (formData.get("language_code") as string) || "en";

    try {
      // Create word
      const wordResult = await createWord(formData);

      if (wordResult.error || !wordResult.wordId) {
        console.error(wordResult.error);
        setIsSubmitting(false);
        return;
      }

      const wordId = wordResult.wordId;

      // Create definitions with their examples
      const definitionsWithText = definitions.filter(
        (def) => def.text.trim().length > 0
      );

      for (let i = 0; i < definitionsWithText.length; i++) {
        const definition = definitionsWithText[i];

        const defFormData = new FormData();
        defFormData.set("word_id", wordId.toString());
        defFormData.set("definition_text", definition.text);
        defFormData.set("part_of_speech", definition.partOfSpeech);
        defFormData.set("order", i.toString());

        const defResult = await createDefinition(defFormData);

        if (defResult.error || !defResult.definitionId) {
          console.error(defResult.error);
          continue;
        }

        // Create examples for this definition
        const definitionId = defResult.definitionId;
        const examplesWithText = definition.examples.filter(
          (ex) => ex.text.trim().length > 0
        );

        for (const example of examplesWithText) {
          const exampleFormData = new FormData();
          exampleFormData.set("definition_id", definitionId.toString());
          exampleFormData.set("word_id", wordId.toString());
          exampleFormData.set("example_text", example.text);
          if (example.source.trim()) {
            exampleFormData.set("source", example.source);
          }

          await createExample(exampleFormData);
        }
      }

      // Add selected tags to the word
      for (const tagId of selectedTagIds) {
        await addTagToWord(wordId, tagId);
      }

      router.push(`/dictionary/${languageCode}/${encodeURIComponent(wordText)}`);
    } catch (error) {
      console.error("Failed to create word:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="word_text">Word *</Label>
        <Input
          id="word_text"
          name="word_text"
          placeholder="e.g., ephemeral"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language_code">Language</Label>
        <Select name="language_code" defaultValue="en">
          <SelectTrigger id="language_code">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">
            Definitions (Optional)
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDefinition}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Definition
          </Button>
        </div>

        {definitions.length > 0 && (
          <div className="space-y-4">
            {definitions.map((definition, defIndex) => (
              <div
                key={definition.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Definition {defIndex + 1}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDefinition(definition.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`part_of_speech_${definition.id}`}>
                      Part of Speech
                    </Label>
                    <Select
                      value={definition.partOfSpeech}
                      onValueChange={(value) =>
                        handleDefinitionChange(definition.id, "partOfSpeech", value)
                      }
                    >
                      <SelectTrigger id={`part_of_speech_${definition.id}`}>
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
                    <Label htmlFor={`definition_text_${definition.id}`}>
                      Definition *
                    </Label>
                    <Textarea
                      id={`definition_text_${definition.id}`}
                      placeholder="Enter the definition..."
                      value={definition.text}
                      onChange={(e) =>
                        handleDefinitionChange(definition.id, "text", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Examples</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddExample(definition.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Example
                      </Button>
                    </div>

                    {definition.examples.length > 0 && (
                      <div className="space-y-3">
                        {definition.examples.map((example, exIndex) => (
                          <div
                            key={example.id}
                            className="space-y-2 p-3 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <Label className="text-xs text-muted-foreground">
                                Example {exIndex + 1}
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveExample(definition.id, example.id)
                                }
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <Textarea
                              placeholder="Enter example sentence..."
                              value={example.text}
                              onChange={(e) =>
                                handleExampleChange(
                                  definition.id,
                                  example.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />

                            <Input
                              placeholder="Source (optional)"
                              value={example.source}
                              onChange={(e) =>
                                handleExampleChange(
                                  definition.id,
                                  example.id,
                                  "source",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Tags (Optional)</Label>
          <TagIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        {isLoadingTags ? (
          <p className="text-sm text-muted-foreground">Loading tags...</p>
        ) : (
          <div className="space-y-3">
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.has(tag.id);
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleToggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Create new tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Link href="/dictionary">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Word"}
        </Button>
      </div>
    </form>
  );
}
