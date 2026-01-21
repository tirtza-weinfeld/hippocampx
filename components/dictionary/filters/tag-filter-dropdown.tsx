"use client";

import { motion, AnimatePresence } from "motion/react";
import { Tag, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { groupTagsByCategory } from "./utils";
import type { TagOption } from "./types";

interface TagFilterDropdownProps {
  tags: TagOption[];
  localTags: string[];
  isPending: boolean;
  tagSearch: string;
  setTagSearch: (value: string) => void;
  expandedCategories: Set<string>;
  toggleCategory: (categoryId: string) => void;
  handleTagToggle: (tagName: string) => void;
  reducedMotion: boolean | null;
}

export function TagFilterDropdown({
  tags,
  localTags,
  isPending,
  tagSearch,
  setTagSearch,
  expandedCategories,
  toggleCategory,
  handleTagToggle,
  reducedMotion,
}: TagFilterDropdownProps) {
  const searchLower = tagSearch.toLowerCase().trim();
  const filteredTags = searchLower ? tags.filter((t) => t.name.toLowerCase().includes(searchLower)) : tags;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: reducedMotion ? 1 : 1.02, y: reducedMotion ? 0 : -1 }}
          whileTap={{ scale: reducedMotion ? 1 : 0.98 }}
          className={`relative inline-flex items-center justify-center gap-1.5 @sm:gap-2 size-9 @sm:size-auto @sm:px-4 @sm:py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-dict-primary/50 ${
            localTags.length > 0
              ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
              : "bg-dict-surface-2 text-dict-text-secondary hover:bg-dict-hover hover:text-dict-text hover:shadow-dict-sm active:bg-dict-active"
          }`}
        >
          <Tag className="size-4 @sm:size-3.5" />
          <span className="hidden @sm:inline">Tags</span>
          {localTags.length > 0 && (
            <span className="absolute -top-1 -right-1 @sm:relative @sm:top-0 @sm:right-0 @sm:ml-1 min-w-5 px-1.5 py-0.5 text-xs rounded-full bg-dict-primary/20 text-dict-primary-vivid">
              {localTags.length}
            </span>
          )}
          {isPending && localTags.length > 0 && (
            <span className="ml-1 size-2 rounded-full bg-dict-primary animate-pulse" />
          )}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-72 max-h-[28rem] overflow-y-auto bg-dict-surface-1 border-dict-border rounded-2xl shadow-dict-lg p-3"
      >
        <div className="px-2 pb-3 mb-2 border-b border-dict-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded-lg bg-dict-tag-gradient">
              <Tag className="size-3.5 text-dict-primary-vivid" />
            </div>
            <div>
              <p className="text-sm font-semibold text-dict-text">Filter by Tag</p>
              <p className="text-xs text-dict-text-tertiary">
                {localTags.length > 0 ? `${localTags.length} selected` : `${tags.length} available`}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-dict-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-dict-surface-2 border border-dict-border rounded-lg placeholder:text-dict-text-tertiary text-dict-text focus:outline-none focus:ring-2 focus:ring-dict-primary/50 focus:border-dict-primary/50"
            />
          </div>
        </div>
        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-12 rounded-full bg-dict-surface-2 flex items-center justify-center mb-3">
              <Tag className="size-5 text-dict-text-tertiary" />
            </div>
            <p className="text-sm font-medium text-dict-text-secondary">No tags available</p>
            <p className="text-xs text-dict-text-tertiary mt-1">Tags will appear here once added</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-dict-text-secondary">No tags match &quot;{tagSearch}&quot;</p>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(groupTagsByCategory(filteredTags).entries()).map(
              ([categoryId, { displayName, tags: categoryTags }]) => {
                const selectedTagCount = categoryTags.filter((t) => localTags.includes(t.name)).length;
                const hasSelectedTags = selectedTagCount > 0;
                const isExpanded = expandedCategories.has(categoryId);

                return (
                  <DropdownMenuGroup key={categoryId}>
                    <button
                      type="button"
                      onClick={() => toggleCategory(categoryId)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
                        hasSelectedTags ? "bg-dict-surface-2" : "hover:bg-dict-hover"
                      }`}
                    >
                      <motion.span
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: reducedMotion ? 0 : 0.15 }}
                        className="text-dict-text-tertiary"
                      >
                        <ChevronDown className="size-4" />
                      </motion.span>
                      <span className="text-sm font-semibold flex-1 text-left text-dict-text">{displayName}</span>
                      <span
                        className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md transition-colors ${
                          hasSelectedTags
                            ? "bg-dict-primary/20 text-dict-primary-vivid"
                            : "bg-dict-surface-2 text-dict-text-tertiary"
                        }`}
                      >
                        {selectedTagCount > 0 ? `${selectedTagCount}/${categoryTags.length}` : categoryTags.length}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-0.5 pl-4 pt-1">
                            {[...categoryTags]
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((tag) => {
                                const isSelected = localTags.includes(tag.name);
                                return (
                                  <DropdownMenuItem
                                    key={tag.id}
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleTagToggle(tag.name);
                                    }}
                                    className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 outline-none ${
                                      isSelected
                                        ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
                                        : "hover:bg-dict-hover focus:bg-dict-hover"
                                    }`}
                                  >
                                    <span
                                      className={`size-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                                        isSelected
                                          ? "border-dict-primary bg-dict-primary"
                                          : "border-dict-surface-3 group-hover:border-dict-primary/50"
                                      }`}
                                    >
                                      {isSelected && (
                                        <motion.svg
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                          className="size-2.5 text-white"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth={3}
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                      )}
                                    </span>
                                    <span className="text-sm font-medium flex-1">{tag.name}</span>
                                    <span
                                      className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md transition-colors ${
                                        isSelected
                                          ? "bg-dict-primary/20 text-dict-primary-vivid"
                                          : "bg-dict-surface-2 text-dict-text-tertiary group-hover:bg-dict-surface-3"
                                      }`}
                                    >
                                      {tag.senseCount}
                                    </span>
                                  </DropdownMenuItem>
                                );
                              })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </DropdownMenuGroup>
                );
              }
            )}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
