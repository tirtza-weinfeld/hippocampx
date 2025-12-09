"use client";

import { useState, useTransition, useRef, Suspense } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMoreWords } from "@/lib/actions/dictionary";
import { WordDefinitionsLoader } from "./word-definitions-loader";
import type { WordSerialized } from "@/lib/db/neon/queries/dictionary/index";

interface DefinitionPreview {
  definition_text: string;
  example_text: string | null;
}

export function WordListClient({
  initialWords,
  definitionsPromise,
  serverQuery,
  initialLanguage,
  hasMore: initialHasMore,
  pageSize,
  filterKey,
}: {
  initialWords: WordSerialized[];
  definitionsPromise: Promise<Map<number, DefinitionPreview>>;
  serverQuery?: string;
  initialLanguage: string;
  hasMore: boolean;
  pageSize: number;
  filterKey: string;
}) {
  const searchParams = useSearchParams();
  const [words, setWords] = useState(initialWords);
  const [loadedDefinitions, setLoadedDefinitions] = useState<Map<number, DefinitionPreview>>(
    new Map()
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset state when filters change - React 18+ pattern
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setWords(initialWords);
    setLoadedDefinitions(new Map());
    setPage(1);
    setHasMore(initialHasMore);
  }

  function loadMore() {
    if (isPending || !hasMore) return;

    const nextPage = page + 1;
    const tagSlugs = searchParams.getAll("tag");
    const sourceSlugs = searchParams.getAll("source");
    const sourcePartSlugs = searchParams.getAll("part");

    startTransition(async () => {
      const result = await fetchMoreWords({
        query: serverQuery,
        languageCode: initialLanguage,
        page: nextPage,
        pageSize,
        tagSlugs,
        sourceSlugs,
        sourcePartSlugs,
      });

      // Convert WordWithPreview to WordSerialized format for consistency
      const newWords: WordSerialized[] = result.words.map(w => ({
        id: w.id,
        word_text: w.word_text,
        language_code: w.language_code,
        created_at: "",
        updated_at: "",
      }));

      // Store loaded definitions from infinite scroll
      const newDefs = new Map(loadedDefinitions);
      for (const w of result.words) {
        if (w.definition_text) {
          newDefs.set(w.id, {
            definition_text: w.definition_text,
            example_text: w.example_text,
          });
        }
      }

      setWords(prev => [...prev, ...newWords]);
      setLoadedDefinitions(newDefs);
      setPage(nextPage);
      setHasMore(result.hasMore);
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
      entries => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(node);
  }

  function buildWordUrl(word: WordSerialized): Route {
    const basePath = `/dictionary/${word.language_code}/${encodeURIComponent(word.word_text)}`;
    const params = new URLSearchParams();

    searchParams.getAll("tag").forEach(tag => params.append("tag", tag));
    searchParams.getAll("source").forEach(source => params.append("source", source));

    const queryString = params.toString();
    return (queryString ? `${basePath}?${queryString}` : basePath) as Route;
  }

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 mb-3">
          <Sparkles className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-foreground font-medium text-sm mb-1">
          {serverQuery
            ? `No words found for "${serverQuery}"`
            : "Your dictionary is empty"}
        </p>
        <p className="text-muted-foreground text-xs mb-4">
          {serverQuery
            ? "Try a different search"
            : "Add your first word to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Expand All toggle */}
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Expand All
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {words.map(function renderWord(word, index) {
          // Check if this is from initial load (use promise) or from infinite scroll (use loaded)
          const isInitialWord = index < initialWords.length;
          const loadedDef = loadedDefinitions.get(word.id);

          return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={buildWordUrl(word)}>
                <div className="group">
                  <div className="rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 border border-border/50 hover:border-border/80 hover:shadow-sm transition-all duration-200">
                    <div className="h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 group-hover:from-sky-400 group-hover:via-sky-300 group-hover:to-sky-400 dark:group-hover:from-sky-600 dark:group-hover:via-sky-500 dark:group-hover:to-sky-600 transition-all duration-300" />
                    <div className="p-3 flex items-start gap-4">
                      <p className="text-sm font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 min-w-[100px] shrink-0">
                        {word.word_text}
                      </p>
                      <div className="flex-1 min-w-0">
                        {isInitialWord ? (
                          <Suspense fallback={<DefinitionSkeleton />}>
                            <WordDefinitionsLoader
                              definitionsPromise={definitionsPromise}
                              wordId={word.id}
                            >
                              {function renderDefinition(definition) {
                                return <DefinitionDisplay definition={definition} isExpanded={isExpanded} />;
                              }}
                            </WordDefinitionsLoader>
                          </Suspense>
                        ) : (
                          <DefinitionDisplay definition={loadedDef ?? null} isExpanded={isExpanded} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Sentinel for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DefinitionSkeleton() {
  return <Skeleton className="h-5 w-3/4" />;
}

function DefinitionDisplay({
  definition,
  isExpanded = false,
}: {
  definition: DefinitionPreview | null;
  isExpanded?: boolean;
}) {
  if (definition) {
    return (
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "1.25rem" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="text-sm text-muted-foreground">
          {definition.definition_text}
          {definition.example_text && (
            <span className="text-xs italic ml-2 text-muted-foreground/70">
              &mdash; {definition.example_text}
            </span>
          )}
        </p>
      </motion.div>
    );
  }
  return (
    <p className="text-xs text-muted-foreground/50 italic">
      No definition yet
    </p>
  );
}
