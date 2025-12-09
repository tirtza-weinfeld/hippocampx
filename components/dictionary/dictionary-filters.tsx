"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:border-sky-300/50 hover:bg-sky-50/50 dark:hover:border-sky-700/50 dark:hover:bg-sky-950/30 transition-colors"
          >
            <Tag className="h-3.5 w-3.5" />
            Tags
            {localTags.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-xs bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
              >
                {localTags.length}
              </Badge>
            )}
            {isPending && localTags.length > 0 && (
              <span className="ml-1 h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 border-border/50 shadow-lg">
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:border-violet-300/50 hover:bg-violet-50/50 dark:hover:border-violet-700/50 dark:hover:bg-violet-950/30 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Sources
            {(localSources.length > 0 || localParts.length > 0) && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-xs bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
              >
                {localSources.length + localParts.length}
              </Badge>
            )}
            {isPending && (localSources.length > 0 || localParts.length > 0) && (
              <span className="ml-1 h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 max-h-96 overflow-y-auto border-border/50 shadow-lg"
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
          <div className="h-4 w-px bg-border/50 mx-1" />
          <div className="flex flex-wrap items-center gap-1.5">
            {localTags.map(name => (
              <Badge
                key={name}
                variant="secondary"
                className="gap-1 pr-1 bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleTagToggle(name)}
                  className="ml-0.5 rounded-full hover:bg-sky-200/50 dark:hover:bg-sky-800/50 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {localSources.map(title => (
              <Badge
                key={title}
                variant="secondary"
                className="gap-1 pr-1 bg-violet-50 text-violet-700 border-violet-200/50 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50"
              >
                {title}
                <button
                  type="button"
                  onClick={() => handleSourceToggle(title)}
                  className="ml-0.5 rounded-full hover:bg-violet-200/50 dark:hover:bg-violet-800/50 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {localParts.map(name => {
              const part = sourceParts.find(p => p.name === name);
              const parentSourceTitle = part?.sourceTitle ?? "";
              return (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1 pr-1 bg-violet-50 text-violet-700 border-violet-200/50 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => handleSourcePartToggle(name, parentSourceTitle)}
                    className="ml-0.5 rounded-full hover:bg-violet-200/50 dark:hover:bg-violet-800/50 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground gap-1 hover:bg-destructive/10 hover:text-destructive"
          >
            <Filter className="h-3.5 w-3.5" />
            Clear all
          </Button>
        </>
      )}
    </motion.div>
  );
}
