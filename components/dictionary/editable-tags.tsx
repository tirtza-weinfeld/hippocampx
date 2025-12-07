"use client";

import { useState, useTransition } from "react";
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

interface Tag {
  id: number;
  name: string;
  description: string | null;
}

interface EditableTagsProps {
  wordId: number;
  initialTags: Tag[];
}

export function EditableTags({ wordId, initialTags }: EditableTagsProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isPending, startTransition] = useTransition();

  function loadAvailableTags() {
    setIsLoadingTags(true);
    startTransition(async () => {
      const result = await fetchAllTags();
      if (result.success) {
        setAvailableTags(result.tags);
      }
      setIsLoadingTags(false);
    });
  }

  function handleRemoveTag(tagId: number) {
    startTransition(async () => {
      const result = await removeTagFromWord(wordId, tagId);
      if (result.success) {
        setTags(tags.filter((tag) => tag.id !== tagId));
      }
    });
  }

  function handleAddExistingTag(tag: Tag) {
    startTransition(async () => {
      const result = await addTagToWord(wordId, tag.id);
      if (result.success) {
        setTags([...tags, tag]);
        setIsAdding(false);
      }
    });
  }

  function handleCreateAndAddTag() {
    if (!newTagName.trim()) return;

    startTransition(async () => {
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
    });
  }

  function handleStartAdding() {
    setIsAdding(true);
    loadAvailableTags();
  }

  function handleCancel() {
    setIsAdding(false);
    setNewTagName("");
  }

  const unusedTags = availableTags.filter(
    (availTag) => !tags.some((tag) => tag.id === availTag.id)
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
                className="flex items-center gap-1 pr-1 group hover:border-destructive transition-colors"
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
                  onClick={() => handleRemoveTag(tag.id)}
                  disabled={isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartAdding}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
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
                    Or create new tag:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tag name..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateAndAddTag();
                        } else if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                      autoFocus
                      className="h-9"
                    />
                    <Button
                      size="sm"
                      onClick={handleCreateAndAddTag}
                      disabled={isPending || !newTagName.trim()}
                      className="h-9"
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-9"
                    >
                      Cancel
                    </Button>
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
