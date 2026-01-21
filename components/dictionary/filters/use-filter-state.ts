"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/lib/utils";
import type { FilterState, FilterAction, SourcePartOption, TagOption } from "./types";

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

interface UseFilterStateProps {
  selectedTagNames: string[];
  selectedSourceTitles: string[];
  selectedSourcePartNames: string[];
  sourceParts: SourcePartOption[];
  tags: TagOption[];
}

export function useFilterState({
  selectedTagNames,
  selectedSourceTitles,
  selectedSourcePartNames,
  sourceParts,
  tags,
}: UseFilterStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const allCategoryIds = new Set(tags.map((t) => t.categoryId));
    return allCategoryIds;
  });

  const [tagSearch, setTagSearch] = useState("");

  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    { tags: selectedTagNames, sources: selectedSourceTitles, parts: selectedSourcePartNames },
    filterReducer
  );

  const localTags = optimisticFilters.tags;
  const localSources = optimisticFilters.sources;
  const localParts = optimisticFilters.parts;

  function toggleCategory(categoryId: string) {
    setExpandedCategories((prev) => {
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

    newTags.forEach((name) => params.append("tag", slugify(name)));
    newSources.forEach((title) => params.append("source", slugify(title)));
    newParts.forEach((name) => params.append("part", slugify(name)));

    const queryString = params.toString();
    router.replace(queryString ? `/dictionary?${queryString}` : "/dictionary", { scroll: false });
  }

  function handleTagToggle(tagName: string) {
    const newTags = localTags.includes(tagName)
      ? localTags.filter((name) => name !== tagName)
      : [...localTags, tagName];
    startTransition(() => {
      setOptimisticFilters({ type: "SET_TAGS", tags: newTags });
      commitToUrlDirect(newTags, localSources, localParts);
    });
  }

  function handleSourceToggle(sourceTitle: string) {
    if (localSources.includes(sourceTitle)) {
      const newSources = localSources.filter((title) => title !== sourceTitle);
      startTransition(() => {
        setOptimisticFilters({ type: "SET_SOURCES", sources: newSources });
        commitToUrlDirect(localTags, newSources, localParts);
      });
    } else {
      const partsOfThisSource = sourceParts.filter((part) => part.sourceTitle === sourceTitle);
      const partNamesToRemove = new Set(partsOfThisSource.map((p) => p.name));
      const newParts = localParts.filter((name) => !partNamesToRemove.has(name));
      const newSources = [...localSources, sourceTitle];

      startTransition(() => {
        setOptimisticFilters({ type: "SET_ALL", tags: localTags, sources: newSources, parts: newParts });
        commitToUrlDirect(localTags, newSources, newParts);
      });
    }
  }

  function handleSourcePartToggle(partName: string, parentSourceTitle: string) {
    if (localParts.includes(partName)) {
      const newParts = localParts.filter((name) => name !== partName);
      startTransition(() => {
        setOptimisticFilters({ type: "SET_PARTS", parts: newParts });
        commitToUrlDirect(localTags, localSources, newParts);
      });
    } else {
      const sourceWasSelected = localSources.includes(parentSourceTitle);
      const newParts = [...localParts, partName];
      const newSources = sourceWasSelected
        ? localSources.filter((title) => title !== parentSourceTitle)
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

  return {
    isPending,
    localTags,
    localSources,
    localParts,
    expandedCategories,
    tagSearch,
    setTagSearch,
    toggleCategory,
    handleTagToggle,
    handleSourceToggle,
    handleSourcePartToggle,
    clearAllFilters,
    hasActiveFilters,
  };
}
