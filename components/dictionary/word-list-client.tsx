"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMoreWithCursor } from "@/lib/actions/dictionary";
import { getDictionaryListActions, useIsExpanded } from "./store/dictionary-list-store";
import type {
  WordWithPreview,
  InfiniteScrollCursor,
  PageInfo,
} from "@/lib/db/neon/queries/dictionary/index";

export function WordListClient({
  initialWords,
  initialPageInfo,
  serverQuery,
  initialLanguage,
  filterKey,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: {
  initialWords: WordWithPreview[];
  initialPageInfo: PageInfo;
  serverQuery?: string;
  initialLanguage: string;
  filterKey: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}) {
  // Get actions once - React Compiler handles stability
  const storeActions = getDictionaryListActions();

  // Consume restoration state atomically in initializer (runs once per mount)
  const [restoredState] = useState(function initRestoredState() {
    const restored = storeActions.consumeRestorationState(filterKey);
    if (restored && restored.scrollY > 0) {
      queueMicrotask(function restoreScroll() {
        requestAnimationFrame(function scrollToPosition() {
          window.scrollTo(0, restored.scrollY);
        });
      });
    }
    return restored;
  });

  const [words, setWords] = useState(restoredState?.words ?? initialWords);
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
    setWords(initialWords);
    setCursor(initialPageInfo.endCursor);
    setHasNextPage(initialPageInfo.hasNextPage);
    storeActions.clearListState();
  }

  function loadMore() {
    if (isPending || !hasNextPage) return;

    startTransition(async function fetchMore() {
      const result = await fetchMoreWithCursor({
        cursor,
        query: serverQuery,
        languageCode: initialLanguage,
        tagSlugs,
        sourceSlugs,
        sourcePartSlugs,
      });

      setWords((prev) => [...prev, ...result.data]);
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
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isPending) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(node);
  }

  function buildWordUrl(word: WordWithPreview): Route {
    const basePath = `/dictionary/${word.language_code}/${encodeURIComponent(word.word_text)}`;
    const params = new URLSearchParams();

    tagSlugs.forEach((tag) => params.append("tag", tag));
    sourceSlugs.forEach((source) => params.append("source", source));

    const queryString = params.toString();
    return (queryString ? `${basePath}?${queryString}` : basePath) as Route;
  }

  function saveStateBeforeNavigation() {
    storeActions.saveListState({
      words,
      cursor,
      hasNextPage,
      scrollY: window.scrollY,
      filterKey,
    });
  }

  if (words.length === 0) {
    return (
      <div className="dict-empty-state">
        <div className="dict-empty-icon">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="text-dict-text font-medium text-sm mb-1">
          {serverQuery
            ? `No words found for "${serverQuery}"`
            : "Your dictionary is empty"}
        </p>
        <p className="text-dict-text-tertiary text-xs">
          {serverQuery
            ? "Try a different search"
            : "Add your first word to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {words.map((word) => (
        <Link
          key={word.id}
          href={buildWordUrl(word)}
          onClick={saveStateBeforeNavigation}
        >
          <article className="group dict-word-card">
            <div className="dict-word-card-line group-hover:dict-word-card-line-hover" />
            <div className="p-4 flex items-start gap-4">
              <span className="dict-word-text group-hover:dict-word-text-hover min-w-[100px] shrink-0">
                {word.word_text}
              </span>
              <div className="flex-1 min-w-0">
                <DefinitionDisplay
                  definition={
                    word.definition_text
                      ? {
                          definition_text: word.definition_text,
                          example_text: word.example_text,
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

function DefinitionDisplay({
  definition,
  isExpanded = false,
}: {
  definition: { definition_text: string; example_text: string | null } | null;
  isExpanded?: boolean;
}) {
  if (definition) {
    return (
      <div
        className="overflow-hidden transition-[height] duration-200"
        style={{ height: isExpanded ? "auto" : "1.25rem" }}
      >
        <p className="text-sm text-dict-text-secondary leading-relaxed">
          {definition.definition_text}
          {definition.example_text && (
            <span className="text-xs italic ml-2 text-dict-example">
              &mdash; {definition.example_text}
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

export function DefinitionSkeleton() {
  return <Skeleton className="h-5 w-3/4 bg-dict-surface-2" />;
}
