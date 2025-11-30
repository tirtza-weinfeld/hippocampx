"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
  addTagToWord,
  removeTagFromWord,
  createTag,
  fetchAllTags,
} from "@/lib/actions/vocabulary";
import { useWordEditMode } from "./word-edit-mode-provider";

interface Tag {
  id: number;
  name: string;
  description: string | null;
}

interface WordTagsEditableProps {
  wordId: number;
  initialTags: Tag[];
}

export function WordTagsEditable({
  wordId,
  initialTags,
}: WordTagsEditableProps) {
  const { isEditMode } = useWordEditMode();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(
    function loadTagsWhenEditMode() {
      if (isEditMode && availableTags.length === 0) {
        loadAvailableTags();
      }
    },
    [isEditMode]
  );

  async function loadAvailableTags() {
    setIsLoadingTags(true);
    const result = await fetchAllTags();
    if (result.success && result.tags) {
      setAvailableTags(result.tags);
    }
    setIsLoadingTags(false);
  }

  async function handleRemoveTag(tagId: number) {
    const result = await removeTagFromWord(wordId, tagId);
    if (result.success) {
      setTags(tags.filter((tag) => tag.id !== tagId));
    }
  }

  async function handleAddExistingTag(tag: Tag) {
    const result = await addTagToWord(wordId, tag.id);
    if (result.success) {
      setTags([...tags, tag]);
      setIsAdding(false);
    }
  }

  async function handleCreateAndAddTag() {
    if (!newTagName.trim()) return;

    const createResult = await createTag(newTagName.trim());
    if (createResult.success && createResult.tagId) {
      const newTag: Tag = {
        id: createResult.tagId,
        name: newTagName.trim(),
        description: null,
      };

      const addResult = await addTagToWord(wordId, createResult.tagId);
      if (addResult.success) {
        setTags([...tags, newTag]);
        setNewTagName("");
        setIsAdding(false);
      }
    }
  }

  const unusedTags = availableTags.filter(
    (availTag) => !tags.some((tag) => tag.id === availTag.id)
  );

  const filteredTags = unusedTags.filter((tag) =>
    tag.name.toLowerCase().includes(newTagName.toLowerCase())
  );

  const exactMatch = unusedTags.find(
    (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <AnimatePresence mode="popLayout">
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                variant="outline"
                className={
                  isEditMode
                    ? "flex items-center gap-1 pr-1 hover:border-destructive transition-colors"
                    : ""
                }
              >
                {tag.name}
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditMode && !isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isEditMode && isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {isLoadingTags ? (
              <p className="text-sm text-muted-foreground">Loading tags...</p>
            ) : (
              <>
                {unusedTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Select existing tag:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {unusedTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleAddExistingTag(tag)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Type to search or create tag:
                  </p>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Tag name..."
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (exactMatch) {
                                handleAddExistingTag(exactMatch);
                                setNewTagName("");
                              } else {
                                handleCreateAndAddTag();
                              }
                            } else if (e.key === "Escape") {
                              setIsAdding(false);
                              setNewTagName("");
                            }
                          }}
                          autoFocus
                          className="h-9"
                        />
                        {newTagName && filteredTags.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto"
                          >
                            <div className="p-1">
                              {filteredTags.slice(0, 8).map((tag) => (
                                <div
                                  key={tag.id}
                                  className="px-3 py-2 hover:bg-accent rounded-sm cursor-pointer text-sm flex items-center justify-between"
                                  onClick={() => {
                                    handleAddExistingTag(tag);
                                    setNewTagName("");
                                  }}
                                >
                                  <span>{tag.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    existing
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (exactMatch) {
                            handleAddExistingTag(exactMatch);
                            setNewTagName("");
                          } else {
                            handleCreateAndAddTag();
                          }
                        }}
                        disabled={!newTagName.trim()}
                        className="h-9"
                      >
                        {exactMatch ? "Add" : "Create"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAdding(false);
                          setNewTagName("");
                        }}
                        className="h-9"
                      >
                        Cancel
                      </Button>
                    </div>
                    {newTagName && exactMatch && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Press Enter to add "{exactMatch.name}"
                      </p>
                    )}
                    {newTagName && !exactMatch && filteredTags.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Press Enter to create "{newTagName}"
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
