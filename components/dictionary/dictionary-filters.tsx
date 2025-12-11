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

  return (
    <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-150 delay-150">
      {/* Tag Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out cursor-pointer ${
              localTags.length > 0
                ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
                : "bg-dict-surface-2 text-dict-text-secondary hover:bg-dict-hover hover:text-dict-text hover:-translate-y-px hover:shadow-dict-sm active:translate-y-0 active:bg-dict-active"
            }`}
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
        <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto bg-dict-surface-1 border-dict-border rounded-2xl shadow-dict-lg p-2">
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Tag
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.length === 0 ? (
            <div className="px-3 py-4 text-sm text-dict-text-tertiary text-center">
              No tags available
            </div>
          ) : (
            Array.from(groupTagsByCategory(tags).entries()).map(([categoryId, { displayName, tags: categoryTags }], categoryIndex) => (
              <DropdownMenuGroup key={categoryId}>
                {categoryIndex > 0 && <DropdownMenuSeparator className="my-2 bg-dict-border" />}
                <DropdownMenuLabel className="text-xs font-semibold text-dict-text-secondary px-3 py-1.5">
                  {displayName}
                </DropdownMenuLabel>
                {categoryTags.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={localTags.includes(tag.name)}
                    onCheckedChange={() => handleTagToggle(tag.name)}
                    onSelect={e => e.preventDefault()}
                    className="rounded-lg px-3 py-2.5 my-0.5 cursor-pointer transition-all duration-150 focus:bg-dict-tag-gradient focus:text-dict-primary-vivid data-[state=checked]:bg-dict-tag-gradient data-[state=checked]:text-dict-primary-vivid hover:bg-dict-hover"
                  >
                    <span className="flex-1 text-sm">{tag.name}</span>
                    <span className="text-xs text-dict-text-tertiary ml-2">({tag.senseCount})</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Source Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-out cursor-pointer ${
              (localSources.length > 0 || localParts.length > 0)
                ? "bg-dict-tag-gradient text-dict-primary-vivid shadow-dict-sm"
                : "bg-dict-surface-2 text-dict-text-secondary hover:bg-dict-hover hover:text-dict-text hover:-translate-y-px hover:shadow-dict-sm active:translate-y-0 active:bg-dict-active"
            }`}
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

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <>
          <div className="h-4 w-px bg-dict-surface-3 mx-1" />
          <div className="flex flex-wrap items-center gap-1.5">
            {localTags.map(name => (
              <span key={name} className="inline-flex items-center gap-1.5 py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid transition-all duration-150 ease-out">
                {name}
                <button
                  type="button"
                  onClick={() => handleTagToggle(name)}
                  className="flex items-center justify-center size-4.5 rounded-full bg-transparent text-dict-primary-muted transition-all duration-150 hover:bg-dict-primary hover:text-dict-text-inverse"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {localSources.map(title => (
              <span key={title} className="inline-flex items-center gap-1.5 py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid transition-all duration-150 ease-out">
                {title}
                <button
                  type="button"
                  onClick={() => handleSourceToggle(title)}
                  className="flex items-center justify-center size-4.5 rounded-full bg-transparent text-dict-primary-muted transition-all duration-150 hover:bg-dict-primary hover:text-dict-text-inverse"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {localParts.map(name => {
              const part = sourceParts.find(p => p.name === name);
              const parentSourceTitle = part?.sourceTitle ?? "";
              return (
                <span key={name} className="inline-flex items-center gap-1.5 py-1 pl-3 pr-2 rounded-full text-xs font-medium bg-dict-tag-gradient text-dict-primary-vivid transition-all duration-150 ease-out">
                  {name}
                  <button
                    type="button"
                    onClick={() => handleSourcePartToggle(name, parentSourceTitle)}
                    className="flex items-center justify-center size-4.5 rounded-full bg-transparent text-dict-primary-muted transition-all duration-150 hover:bg-dict-primary hover:text-dict-text-inverse"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-dict-surface-2 text-dict-text-tertiary transition-all duration-200 ease-out cursor-pointer hover:bg-dict-hover hover:text-red-500 hover:-translate-y-px hover:shadow-dict-sm active:translate-y-0"
          >
            <Filter className="h-3.5 w-3.5" />
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
