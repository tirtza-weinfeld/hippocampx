"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, Tag, BookOpen, Music } from "lucide-react";
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
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

  function updateFilters(
    newTagNames: string[],
    newSourceTitles: string[],
    newSourcePartNames: string[]
  ) {
    const params = new URLSearchParams();

    const q = searchParams.get("q");
    const lang = searchParams.get("lang");
    if (q) params.set("q", q);
    if (lang) params.set("lang", lang);

    newTagNames.forEach(function addTag(name) {
      params.append("tag", slugify(name));
    });

    newSourceTitles.forEach(function addSource(title) {
      params.append("source", slugify(title));
    });

    newSourcePartNames.forEach(function addPart(name) {
      params.append("part", slugify(name));
    });

    const queryString = params.toString();
    router.push(queryString ? `/dictionary?${queryString}` : "/dictionary");
  }

  function handleTagToggle(tagName: string) {
    const newTagNames = selectedTagNames.includes(tagName)
      ? selectedTagNames.filter(function keepTag(name) {
          return name !== tagName;
        })
      : [...selectedTagNames, tagName];
    updateFilters(newTagNames, selectedSourceTitles, selectedSourcePartNames);
  }

  function handleSourceToggle(sourceTitle: string) {
    const newSourceTitles = selectedSourceTitles.includes(sourceTitle)
      ? selectedSourceTitles.filter(function keepSource(title) {
          return title !== sourceTitle;
        })
      : [...selectedSourceTitles, sourceTitle];
    updateFilters(selectedTagNames, newSourceTitles, selectedSourcePartNames);
  }

  function handleSourcePartToggle(partName: string) {
    const newSourcePartNames = selectedSourcePartNames.includes(partName)
      ? selectedSourcePartNames.filter(function keepPart(name) {
          return name !== partName;
        })
      : [...selectedSourcePartNames, partName];
    updateFilters(selectedTagNames, selectedSourceTitles, newSourcePartNames);
  }

  function clearAllFilters() {
    updateFilters([], [], []);
  }

  const hasActiveFilters =
    selectedTagNames.length > 0 ||
    selectedSourceTitles.length > 0 ||
    selectedSourcePartNames.length > 0;

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
            {selectedTagNames.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-xs bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
              >
                {selectedTagNames.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 border-border/50 shadow-lg"
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Tag
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No tags available
            </div>
          ) : (
            tags.map(function renderTag(tag) {
              return (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={selectedTagNames.includes(tag.name)}
                  onCheckedChange={function onToggle() {
                    handleTagToggle(tag.name);
                  }}
                >
                  <span className="flex-1">{tag.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({tag.wordCount})
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })
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
            {selectedSourceTitles.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-xs bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
              >
                {selectedSourceTitles.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-64 border-border/50 shadow-lg"
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
            sources.map(function renderSource(source) {
              return (
                <DropdownMenuCheckboxItem
                  key={source.id}
                  checked={selectedSourceTitles.includes(source.title)}
                  onCheckedChange={function onToggle() {
                    handleSourceToggle(source.title);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <span>{source.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {source.type}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({source.wordCount})
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Source Part Filter (Songs/Chapters/Acts) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:border-amber-300/50 hover:bg-amber-50/50 dark:hover:border-amber-700/50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <Music className="h-3.5 w-3.5" />
            Parts
            {selectedSourcePartNames.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              >
                {selectedSourcePartNames.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 max-h-80 overflow-y-auto border-border/50 shadow-lg"
        >
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            Filter by Part
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sourceParts.length === 0 ? (
            <div className="px-2 py-3 text-sm text-muted-foreground text-center">
              No parts available
            </div>
          ) : (
            sourceParts.map(function renderSourcePart(part) {
              return (
                <DropdownMenuCheckboxItem
                  key={part.id}
                  checked={selectedSourcePartNames.includes(part.name)}
                  onCheckedChange={function onToggle() {
                    handleSourcePartToggle(part.name);
                  }}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate">{part.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {part.sourceTitle}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0">
                    ({part.wordCount})
                  </span>
                </DropdownMenuCheckboxItem>
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
            {selectedTagNames.map(function renderSelectedTag(name) {
              return (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1 pr-1 bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50"
                >
                  {name}
                  <button
                    type="button"
                    onClick={function onRemove() {
                      handleTagToggle(name);
                    }}
                    className="ml-0.5 rounded-full hover:bg-sky-200/50 dark:hover:bg-sky-800/50 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {selectedSourceTitles.map(function renderSelectedSource(title) {
              return (
                <Badge
                  key={title}
                  variant="secondary"
                  className="gap-1 pr-1 bg-violet-50 text-violet-700 border-violet-200/50 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50"
                >
                  {title}
                  <button
                    type="button"
                    onClick={function onRemove() {
                      handleSourceToggle(title);
                    }}
                    className="ml-0.5 rounded-full hover:bg-violet-200/50 dark:hover:bg-violet-800/50 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {selectedSourcePartNames.map(function renderSelectedPart(name) {
              return (
                <Badge
                  key={name}
                  variant="secondary"
                  className="gap-1 pr-1 bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50"
                >
                  {name}
                  <button
                    type="button"
                    onClick={function onRemove() {
                      handleSourcePartToggle(name);
                    }}
                    className="ml-0.5 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 p-0.5 transition-colors"
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
