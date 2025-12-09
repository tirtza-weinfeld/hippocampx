"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Tag, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as motion from "motion/react-client";
import { slugify } from "@/lib/utils";

interface TagOption {
  id: number;
  name: string;
  wordCount: number;
}

interface SourceOption {
  id: number;
  title: string;
  type: string;
  wordCount: number;
}

interface SourcePartOption {
  id: number;
  name: string;
  sourceId: number;
  sourceTitle: string;
  sourceType: string;
  wordCount: number;
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

  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    { tags: selectedTagNames, sources: selectedSourceTitles, parts: selectedSourcePartNames },
    filterReducer
  );

  const localTags = optimisticFilters.tags;
  const localSources = optimisticFilters.sources;
  const localParts = optimisticFilters.parts;

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
    router.push(queryString ? `/dictionary?${queryString}` : "/dictionary");
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="flex flex-wrap items-center gap-2"
    >
      {/* Tag Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`dict-filter-btn ${localTags.length > 0 ? "dict-filter-btn-active" : ""}`}
          >
            <Tag className="h-3.5 w-3.5" />
            Tags
            {localTags.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-dict-primary/20 text-dict-primary-vivid">
                {localTags.length}
              </span>
            )}
            {isPending && localTags.length > 0 && (
              <span className="ml-1 h-2 w-2 rounded-full bg-dict-primary animate-pulse" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 dict-dropdown">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Tag
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No tags available
            </div>
          ) : (
            tags.map(tag => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={localTags.includes(tag.name)}
                onCheckedChange={() => handleTagToggle(tag.name)}
                onSelect={e => e.preventDefault()}
              >
                <span className="flex-1">{tag.name}</span>
                <span className="text-xs text-muted-foreground ml-2">({tag.wordCount})</span>
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Source Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`dict-filter-btn ${(localSources.length > 0 || localParts.length > 0) ? "dict-filter-btn-active" : ""}`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Sources
            {(localSources.length > 0 || localParts.length > 0) && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-dict-accent/20 text-dict-accent">
                {localSources.length + localParts.length}
              </span>
            )}
            {isPending && (localSources.length > 0 || localParts.length > 0) && (
              <span className="ml-1 h-2 w-2 rounded-full bg-dict-accent animate-pulse" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 max-h-96 overflow-y-auto dict-dropdown"
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Source
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sources.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No sources available
            </div>
          ) : (
            sources.map((source, sourceIndex) => {
              const partsForSource = sourceParts.filter(part => part.sourceId === source.id);
              return (
                <div key={source.id}>
                  {sourceIndex > 0 && <DropdownMenuSeparator className="my-1" />}
                  <DropdownMenuCheckboxItem
                    checked={localSources.includes(source.title)}
                    onCheckedChange={() => handleSourceToggle(source.title)}
                    onSelect={e => e.preventDefault()}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{source.title}</span>
                      <span className="text-xs text-muted-foreground">{source.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">({source.wordCount})</span>
                  </DropdownMenuCheckboxItem>
                  {partsForSource.map(part => (
                    <DropdownMenuCheckboxItem
                      key={part.id}
                      checked={localParts.includes(part.name)}
                      onCheckedChange={() => handleSourcePartToggle(part.name, source.title)}
                      onSelect={e => e.preventDefault()}
                      className="pl-8"
                    >
                      <div className="flex flex-1 min-w-0">
                        <span className="truncate text-sm">{part.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2 shrink-0">
                        ({part.wordCount})
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <>
          <div className="h-4 w-px bg-dict-surface-3 mx-1" />
          <div className="flex flex-wrap items-center gap-1.5">
            {localTags.map(function renderTagChip(name) {
              return (
                <span key={name} className="dict-chip">
                  {name}
                  <button
                    type="button"
                    onClick={function removeTag() {
                      handleTagToggle(name);
                    }}
                    className="dict-chip-remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {localSources.map(function renderSourceChip(title) {
              return (
                <span key={title} className="dict-chip">
                  {title}
                  <button
                    type="button"
                    onClick={function removeSource() {
                      handleSourceToggle(title);
                    }}
                    className="dict-chip-remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {localParts.map(function renderPartChip(name) {
              const part = sourceParts.find(function findPart(p) {
                return p.name === name;
              });
              const parentSourceTitle = part?.sourceTitle ?? "";
              return (
                <span key={name} className="dict-chip">
                  {name}
                  <button
                    type="button"
                    onClick={function removePart() {
                      handleSourcePartToggle(name, parentSourceTitle);
                    }}
                    className="dict-chip-remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="dict-filter-btn text-dict-text-tertiary hover:text-red-500"
          >
            <Filter className="h-3.5 w-3.5" />
            Clear all
          </button>
        </>
      )}
    </motion.div>
  );
}
