"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Tag, BookOpen, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { slugify } from "@/lib/utils";

/** Groups tags by their category */
function groupTagsByCategory(tags: TagOption[]): Map<string, { displayName: string; tags: TagOption[] }> {
  const grouped = new Map<string, { displayName: string; tags: TagOption[] }>();

  for (const tag of tags) {
    const existing = grouped.get(tag.categoryId);
    if (existing) {
      existing.tags.push(tag);
    } else {
      grouped.set(tag.categoryId, {
        displayName: tag.categoryDisplayName,
        tags: [tag],
      });
    }
  }

  return grouped;
}

interface TagOption {
  id: number;
  name: string;
  categoryId: string;
  categoryDisplayName: string;
  senseCount: number;
}

interface SourceOption {
  id: number;
  title: string;
  type: string;
  entryCount: number;
}

interface SourcePartOption {
  id: number;
  name: string;
  type: string | null;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  entryCount: number;
}

interface DictionaryFiltersProps {
  tags: TagOption[];
  sources: SourceOption[];
  sourceParts: SourcePartOption[];
  selectedTagNames: string[];
  selectedSourceTitles: string[];
  selectedSourcePartNames: string[];
}

interface FilterState {
  tags: string[];
  sources: string[];
  parts: string[];
}

type FilterAction =
  | { type: "SET_TAGS"; tags: string[] }
  | { type: "SET_SOURCES"; sources: string[] }
  | { type: "SET_PARTS"; parts: string[] }
  | { type: "SET_ALL"; tags: string[]; sources: string[]; parts: string[] };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_TAGS":
      return { ...state, tags: action.tags };
    case "SET_SOURCES":
      return { ...state, sources: action.sources };
    case "SET_PARTS":
      return { ...state, parts: action.parts };
    case "SET_ALL":
      return { tags: action.tags, sources: action.sources, parts: action.parts };
    default:
      return state;
  }
}

export function DictionaryFilters({
  tags,
  sources,
  sourceParts,
  selectedTagNames,
  selectedSourceTitles,
  selectedSourcePartNames,
}: DictionaryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const reducedMotion = useReducedMotion();

  // Track which categories are expanded (all expanded by default)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const allCategoryIds = new Set(tags.map(t => t.categoryId));
    return allCategoryIds;
  });

  // Search state for tag filter dropdown
  const [tagSearch, setTagSearch] = useState("");

  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    { tags: selectedTagNames, sources: selectedSourceTitles, parts: selectedSourcePartNames },
    filterReducer
  );

  const localTags = optimisticFilters.tags;
  const localSources = optimisticFilters.sources;
  const localParts = optimisticFilters.parts;

  function toggleCategory(categoryId: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  function commitToUrlDirect(newTags: string[], newSources: string[], newParts: string[]) {
    const params = new URLSearchParams();

    const q = searchParams.get("q");
    const lang = searchParams.get("lang");
    if (q) params.set("q", q);
    if (lang) params.set("lang", lang);

    newTags.forEach(name => params.append("tag", slugify(name)));
    newSources.forEach(title => params.append("source", slugify(title)));
    newParts.forEach(name => params.append("part", slugify(name)));

    const queryString = params.toString();
    router.replace(queryString ? `/dictionary?${queryString}` : "/dictionary", { scroll: false });
  }

  function handleTagToggle(tagName: string) {
    const newTags = localTags.includes(tagName)
      ? localTags.filter(name => name !== tagName)
      : [...localTags, tagName];
    startTransition(() => {
      setOptimisticFilters({ type: "SET_TAGS", tags: newTags });
      commitToUrlDirect(newTags, localSources, localParts);
    });
  }

  function handleSourceToggle(sourceTitle: string) {
    if (localSources.includes(sourceTitle)) {
      const newSources = localSources.filter(title => title !== sourceTitle);
      startTransition(() => {
        setOptimisticFilters({ type: "SET_SOURCES", sources: newSources });
        commitToUrlDirect(localTags, newSources, localParts);
      });
    } else {
      const partsOfThisSource = sourceParts.filter(part => part.sourceTitle === sourceTitle);
      const partNamesToRemove = new Set(partsOfThisSource.map(p => p.name));
      const newParts = localParts.filter(name => !partNamesToRemove.has(name));
      const newSources = [...localSources, sourceTitle];

      startTransition(() => {
        setOptimisticFilters({ type: "SET_ALL", tags: localTags, sources: newSources, parts: newParts });
        commitToUrlDirect(localTags, newSources, newParts);
      });
    }
  }

  function handleSourcePartToggle(partName: string, parentSourceTitle: string) {
    if (localParts.includes(partName)) {
      const newParts = localParts.filter(name => name !== partName);
      startTransition(() => {
        setOptimisticFilters({ type: "SET_PARTS", parts: newParts });
        commitToUrlDirect(localTags, localSources, newParts);
      });
    } else {
      const sourceWasSelected = localSources.includes(parentSourceTitle);
      const newParts = [...localParts, partName];
      const newSources = sourceWasSelected
        ? localSources.filter(title => title !== parentSourceTitle)
        : localSources;

      startTransition(() => {
        if (sourceWasSelected) {
          setOptimisticFilters({ type: "SET_ALL", tags: localTags, sources: newSources, parts: newParts });
        } else {
          setOptimisticFilters({ type: "SET_PARTS", parts: newParts });
        }
        commitToUrlDirect(localTags, newSources, newParts);
      });
    }
  }

  function clearAllFilters() {
    startTransition(() => {
      setOptimisticFilters({ type: "SET_ALL", tags: [], sources: [], parts: [] });
      commitToUrlDirect([], [], []);
    });
  }

  const hasActiveFilters = localTags.length > 0 || localSources.length > 0 || localParts.length > 0;

  const chipVariants = {
    initial: { opacity: 0, scale: 0.8, y: -4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -4 },
  };

  const chipTransition = {
    duration: reducedMotion ? 0 : 0.15,
    ease: "easeOut" as const,
  };

  return (
    <div className="flex items-center gap-2">
      {/* Tag Filter */}
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
                  {localTags.length > 0
                    ? `${localTags.length} selected`
                    : `${tags.length} available`}
                </p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-dict-text-tertiary pointer-events-none" />
              <input
                type="text"
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-dict-surface-2 border border-dict-border rounded-lg placeholder:text-dict-text-tertiary text-dict-text focus:outline-none focus:ring-2 focus:ring-dict-primary/50 focus:border-dict-primary/50"
              />
            </div>
          </div>
          {(() => {
            const searchLower = tagSearch.toLowerCase().trim();
            const filteredTags = searchLower
              ? tags.filter(t => t.name.toLowerCase().includes(searchLower))
              : tags;

            if (tags.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="size-12 rounded-full bg-dict-surface-2 flex items-center justify-center mb-3">
                    <Tag className="size-5 text-dict-text-tertiary" />
                  </div>
                  <p className="text-sm font-medium text-dict-text-secondary">No tags available</p>
                  <p className="text-xs text-dict-text-tertiary mt-1">Tags will appear here once added</p>
                </div>
              );
            }

            if (filteredTags.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-sm text-dict-text-secondary">No tags match "{tagSearch}"</p>
                </div>
              );
            }

            return (
              <div className="space-y-2">
                {Array.from(groupTagsByCategory(filteredTags).entries()).map(([categoryId, { displayName, tags: categoryTags }]) => {
                  const selectedTagCount = categoryTags.filter(t => localTags.includes(t.name)).length;
                  const hasSelectedTags = selectedTagCount > 0;
                  const isExpanded = expandedCategories.has(categoryId);

                return (
                <DropdownMenuGroup key={categoryId}>
                  {/* Collapsible Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryId)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
                      hasSelectedTags
                        ? "bg-dict-surface-2"
                        : "hover:bg-dict-hover"
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

                  {/* Collapsible Tag List */}
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
                          {[...categoryTags].sort((a, b) => a.name.localeCompare(b.name)).map(tag => {
                            const isSelected = localTags.includes(tag.name);
                            return (
                              <DropdownMenuItem
                                key={tag.id}
                                onSelect={e => {
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
                })}
              </div>
            );
          })()}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Source Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            type="button"
            whileHover={{ scale: reducedMotion ? 1 : 1.02, y: reducedMotion ? 0 : -1 }}
            whileTap={{ scale: reducedMotion ? 1 : 0.98 }}
            className={`relative inline-flex items-center justify-center gap-1.5 @sm:gap-2 size-9 @sm:size-auto @sm:px-4 @sm:py-2 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-dict-primary/50 ${
              (localSources.length > 0 || localParts.length > 0)
                ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
                : "bg-dict-surface-2 text-dict-text-secondary hover:bg-dict-hover hover:text-dict-text hover:shadow-dict-sm active:bg-dict-active"
            }`}
          >
            <BookOpen className="size-4 @sm:size-3.5" />
            <span className="hidden @sm:inline">Sources</span>
            {(localSources.length > 0 || localParts.length > 0) && (
              <span className="absolute -top-1 -right-1 @sm:relative @sm:top-0 @sm:right-0 @sm:ml-1 min-w-5 px-1.5 py-0.5 text-xs rounded-full bg-dict-accent/20 text-dict-accent">
                {localSources.length + localParts.length}
              </span>
            )}
            {isPending && (localSources.length > 0 || localParts.length > 0) && (
              <span className="ml-1 size-2 rounded-full bg-dict-accent animate-pulse" />
            )}
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 max-h-96 overflow-y-auto bg-dict-surface-1 border-dict-border rounded-2xl shadow-dict-lg p-2"
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Source
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sources.length === 0 ? (
            <div className="px-3 py-4 text-sm text-dict-text-tertiary text-center">
              No sources available
            </div>
          ) : (
            sources.map((source, sourceIndex) => {
              const partsForSource = sourceParts.filter(part => part.sourceId === source.id);
              return (
                <div key={source.id}>
                  {sourceIndex > 0 && <DropdownMenuSeparator className="my-2 bg-dict-border" />}
                  <DropdownMenuCheckboxItem
                    checked={localSources.includes(source.title)}
                    onCheckedChange={() => handleSourceToggle(source.title)}
                    onSelect={e => e.preventDefault()}
                    className="rounded-lg px-3 py-2.5 my-0.5 cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover"
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm">{source.title}</span>
                      <span className="text-xs text-dict-text-tertiary">{source.type}</span>
                    </div>
                    <span className="text-xs text-dict-text-tertiary ml-2">({source.entryCount})</span>
                  </DropdownMenuCheckboxItem>
                  {partsForSource.map(part => (
                    <DropdownMenuCheckboxItem
                      key={part.id}
                      checked={localParts.includes(part.name)}
                      onCheckedChange={() => handleSourcePartToggle(part.name, source.title)}
                      onSelect={e => e.preventDefault()}
                      className="rounded-lg px-3 py-2 pl-10 my-0.5 cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover"
                    >
                      <div className="flex flex-1 min-w-0">
                        <span className="truncate text-sm">{part.name}</span>
                      </div>
                      <span className="text-xs text-dict-text-tertiary ml-2 shrink-0">
                        ({part.entryCount})
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear all button - icon only on mobile, with text on @sm+ */}
      {hasActiveFilters && (
        <motion.button
          type="button"
          onClick={clearAllFilters}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={chipTransition}
          whileHover={{ scale: reducedMotion ? 1 : 1.02 }}
          whileTap={{ scale: reducedMotion ? 1 : 0.98 }}
          className="inline-flex items-center justify-center gap-2 size-9 @sm:size-auto @sm:px-3 @sm:py-1.5 rounded-full text-xs font-medium bg-dict-surface-2 text-dict-text-tertiary transition-colors duration-150 cursor-pointer hover:bg-dict-hover hover:text-red-500 outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          aria-label="Clear all filters"
        >
          <X className="size-4 @sm:size-3" />
          <span className="hidden @sm:inline">Clear</span>
        </motion.button>
      )}

      {/* Active Filters Display - hidden on mobile, shown on @sm+ */}
      {hasActiveFilters && (
        <div className="hidden @sm:contents">
          <div className="h-4 w-px bg-dict-surface-3 shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap">
            <AnimatePresence mode="popLayout">
              {localTags.map(name => (
                <motion.span
                  key={`tag-${name}`}
                  layout
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={chipTransition}
                  className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid"
                >
                  <span>{name}</span>
                  <motion.button
                    type="button"
                    onClick={() => handleTagToggle(name)}
                    whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
                    whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
                    className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
                  >
                    <X className="size-2.5" />
                  </motion.button>
                </motion.span>
              ))}
              {localSources.map(title => (
                <motion.span
                  key={`source-${title}`}
                  layout
                  variants={chipVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={chipTransition}
                  className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid"
                >
                  <span>{title}</span>
                  <motion.button
                    type="button"
                    onClick={() => handleSourceToggle(title)}
                    whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
                    whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
                    className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
                  >
                    <X className="size-2.5" />
                  </motion.button>
                </motion.span>
              ))}
              {localParts.map(name => {
                const part = sourceParts.find(p => p.name === name);
                const parentSourceTitle = part?.sourceTitle ?? "";
                return (
                  <motion.span
                    key={`part-${part?.id ?? name}`}
                    layout
                    variants={chipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={chipTransition}
                    className="inline-flex items-center gap-1 py-1 pl-2.5 pr-1.5 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid"
                  >
                    <span>{name}</span>
                    <motion.button
                      type="button"
                      onClick={() => handleSourcePartToggle(name, parentSourceTitle)}
                      whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
                      whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
                      className="flex items-center justify-center size-4 rounded-full bg-transparent text-dict-primary-muted transition-colors duration-150 hover:bg-dict-primary hover:text-dict-text-inverse focus-visible:ring-1 focus-visible:ring-dict-primary outline-none"
                    >
                      <X className="size-2.5" />
                    </motion.button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
