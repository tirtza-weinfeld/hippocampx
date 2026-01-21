"use client";

import { useReducedMotion } from "motion/react";
import { useFilterState } from "./use-filter-state";
import { TagFilterDropdown } from "./tag-filter-dropdown";
import { SourceFilterDropdown } from "./source-filter-dropdown";
import { ClearFiltersButton } from "./clear-filters-button";
import { ActiveFiltersRow } from "./active-filters-row";
import type { DictionaryFiltersProps } from "./types";

export function DictionaryFilters({
  tags,
  sources,
  sourceParts,
  selectedTagNames,
  selectedSourceTitles,
  selectedSourcePartNames,
}: DictionaryFiltersProps) {
  const reducedMotion = useReducedMotion();
  const {
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
  } = useFilterState({
    selectedTagNames,
    selectedSourceTitles,
    selectedSourcePartNames,
    sourceParts,
    tags,
  });

  return (
    <>
      {/* Filter triggers - inline with parent flex */}
      <TagFilterDropdown
        tags={tags}
        localTags={localTags}
        isPending={isPending}
        tagSearch={tagSearch}
        setTagSearch={setTagSearch}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        handleTagToggle={handleTagToggle}
        reducedMotion={reducedMotion}
      />

      <SourceFilterDropdown
        sources={sources}
        sourceParts={sourceParts}
        localSources={localSources}
        localParts={localParts}
        isPending={isPending}
        handleSourceToggle={handleSourceToggle}
        handleSourcePartToggle={handleSourcePartToggle}
        reducedMotion={reducedMotion}
      />

      {hasActiveFilters && <ClearFiltersButton onClear={clearAllFilters} reducedMotion={reducedMotion} />}

      {/* Active filter chips - breaks to own row via order-last basis-full */}
      {hasActiveFilters && (
        <div className="order-last basis-full">
          <ActiveFiltersRow
            localTags={localTags}
            localSources={localSources}
            localParts={localParts}
            sourceParts={sourceParts}
            handleTagToggle={handleTagToggle}
            handleSourceToggle={handleSourceToggle}
            handleSourcePartToggle={handleSourcePartToggle}
            reducedMotion={reducedMotion}
          />
        </div>
      )}
    </>
  );
}
