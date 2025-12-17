"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMoreWithCursor } from "@/lib/actions/dictionary";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";
import type {
  EntryWithPreview,
  InfiniteScrollCursor,
  PageInfo,
} from "@/lib/db/queries/dictionary";

export function EntryListClient({
  initialEntries,
  initialPageInfo,
  serverQuery,
  initialLanguage,
  filterKey,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: {
  initialEntries: EntryWithPreview[];
  initialPageInfo: PageInfo;
  serverQuery?: string;
  initialLanguage: string;
  filterKey: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}) {
  const storeActions = getDictionaryListActions();

  // Consume restoration state atomically in initializer (runs once per mount)
  const [restoredState] = useState(() => {
    const restored = storeActions.consumeRestorationState(filterKey);
    if (restored && restored.scrollY > 0) {
      queueMicrotask(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, restored.scrollY);
        });
      });
    }
    return restored;
  });

  const [entries, setEntries] = useState(restoredState?.entries ?? initialEntries);
  const [cursor, setCursor] = useState<InfiniteScrollCursor | null>(
    restoredState?.cursor ?? initialPageInfo.endCursor
  );
  const [hasNextPage, setHasNextPage] = useState(
    restoredState?.hasNextPage ?? initialPageInfo.hasNextPage
  );
  const [isPending, startTransition] = useTransition();
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const isExpanded = useIsExpanded();

  // Reset state when filters change
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setEntries(initialEntries);
    setCursor(initialPageInfo.endCursor);
    setHasNextPage(initialPageInfo.hasNextPage);
    storeActions.clearListState();
  }

  function loadMore() {
    if (isPending || !hasNextPage) return;

    startTransition(async () => {
      const result = await fetchMoreWithCursor({
        cursor,
        query: serverQuery,
        languageCode: initialLanguage,
        tagSlugs,
        sourceSlugs,
        sourcePartSlugs,
      });

      setEntries((prev) => [...prev, ...result.data]);
      setCursor(result.pageInfo.endCursor);
      setHasNextPage(result.pageInfo.hasNextPage);
    });
  }

  // IntersectionObserver via ref callback with cleanup
  const observerRef = useRef<IntersectionObserver | null>(null);

  function sentinelRef(node: HTMLDivElement | null) {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (intersectionEntries) => {
        if (intersectionEntries[0].isIntersecting && hasNextPage && !isPending) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(node);
  }

  function buildEntryUrl(entry: EntryWithPreview): Route {
    const basePath = `/dictionary/${entry.languageCode}/${encodeURIComponent(entry.lemma)}`;
    const params = new URLSearchParams();

    tagSlugs.forEach((tag) => params.append("tag", tag));
    sourceSlugs.forEach((source) => params.append("source", source));

    const queryString = params.toString();
    return (queryString ? `${basePath}?${queryString}` : basePath) as Route;
  }

  function saveStateBeforeNavigation() {
    storeActions.saveListState({
      entries,
      cursor,
      hasNextPage,
      scrollY: window.scrollY,
      filterKey,
    });
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="flex items-center justify-center size-16 rounded-2xl bg-dict-empty-icon text-dict-primary mb-6">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-dict-text font-medium text-sm mb-1">
          {serverQuery
            ? `No entries found for "${serverQuery}"`
            : "Your dictionary is empty"}
        </p>
        <p className="text-dict-text-tertiary text-xs">
          {serverQuery
            ? "Try a different search"
            : "Add your first entry to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <Link
          key={entry.id}
          href={buildEntryUrl(entry)}
          onClick={saveStateBeforeNavigation}
        >
          <article className="group relative rounded-3xl bg-dict-surface-1 overflow-hidden transition-all duration-250 ease-out hover:bg-dict-surface-2 hover:-translate-y-0.5 hover:shadow-dict-card-hover">
            <div className="h-0.5 bg-dict-card-line transition-all duration-300 group-hover:bg-dict-card-line-active group-hover:shadow-dict-glow" />
            <div className="p-4 flex items-start gap-4">
              <div className="min-w-[100px] shrink-0">
                <span className="text-[0.9375rem] font-semibold text-dict-text transition-colors duration-200 group-hover:text-dict-primary">
                  {entry.lemma}
                </span>
                <span className="ml-2 text-xs text-dict-text-tertiary italic">
                  {entry.partOfSpeech}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <SenseDisplay
                  sense={
                    entry.definition
                      ? {
                          definition: entry.definition,
                          exampleText: entry.exampleText,
                        }
                      : null
                  }
                  isExpanded={isExpanded}
                />
              </div>
            </div>
          </article>
        </Link>
      ))}

      {hasNextPage && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}

function SenseDisplay({
  sense,
  isExpanded = false,
}: {
  sense: { definition: string; exampleText: string | null } | null;
  isExpanded?: boolean;
}) {
  if (sense) {
    return (
      <div
        className="overflow-hidden transition-[height] duration-200"
        style={{ height: isExpanded ? "auto" : "1.25rem" }}
      >
        <p className="text-sm text-dict-text-secondary leading-relaxed">
          {sense.definition}
          {sense.exampleText && (
            <span className="text-xs italic ml-2 text-dict-example">
              &mdash; {sense.exampleText}
            </span>
          )}
        </p>
      </div>
    );
  }
  return (
    <p className="text-xs text-dict-text-tertiary italic">No definition yet</p>
  );
}

export function SenseSkeleton() {
  return <Skeleton className="h-5 w-3/4 bg-dict-surface-2" />;
}
