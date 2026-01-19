import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { EntryCard, EntryCardSkeleton } from "./entry-card";
import type { EntryWithPreview } from "@/lib/db/queries/dictionary";

interface EntryListProps {
  entries: EntryWithPreview[];
  tagSlugs?: string[];
  sourceSlugs?: string[];
  query?: string;
}

/**
 * Server component that renders entries.
 * Each entry wrapped in Suspense - streams independently.
 */
export function EntryList({ entries, tagSlugs = [], sourceSlugs = [], query }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-dict-empty-icon text-dict-primary mb-6">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-dict-text font-medium text-sm mb-1">
          {query
            ? `No entries found for "${query}"`
            : "Your dictionary is empty"}
        </p>
        <p className="text-dict-text-tertiary text-xs">
          {query
            ? "Try a different search"
            : "Add your first entry to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <Suspense key={entry.id} fallback={<EntryCardSkeleton />}>
          <EntryCard
            entry={entry}
            tagSlugs={tagSlugs}
            sourceSlugs={sourceSlugs}
          />
        </Suspense>
      ))}
    </div>
  );
}
