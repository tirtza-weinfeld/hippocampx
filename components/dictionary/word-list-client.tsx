"use client";

import Link from "next/link";
import { Route } from "next";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import * as motion from "motion/react-client";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WordWithPreview {
  id: number;
  word_text: string;
  language_code: string;
  definition_text: string | null;
  example_text: string | null;
}

export function WordListClient({
  words,
  clientFilter,
  serverQuery,
}: {
  words: WordWithPreview[];
  clientFilter: string;
  serverQuery?: string;
}) {
  const searchParams = useSearchParams();
  const filteredWords = useMemo(
    function filterWords() {
      if (!clientFilter) {
        return words;
      }
      const lowerFilter = clientFilter.toLowerCase();
      return words.filter(function matchWord(word) {
        return word.word_text.toLowerCase().includes(lowerFilter);
      });
    },
    [words, clientFilter]
  );

  const displayQuery = clientFilter || serverQuery;

  if (filteredWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 mb-3">
          <Sparkles className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-foreground font-medium text-sm mb-1">
          {displayQuery
            ? `No words found for "${displayQuery}"`
            : "Your dictionary is empty"}
        </p>
        <p className="text-muted-foreground text-xs mb-4">
          {displayQuery
            ? "Try a different search"
            : "Add your first word to get started"}
        </p>
        {!displayQuery && (
          <Link href="/dictionary/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-3.5 w-3.5" />
              Add Word
            </Button>
          </Link>
        )}
      </div>
    );
  }

  function buildWordUrl(word: WordWithPreview): Route {
    const basePath = `/dictionary/${word.language_code}/${encodeURIComponent(word.word_text)}`;
    const params = new URLSearchParams();

    // Preserve filter and pagination params
    searchParams.getAll("tag").forEach(function addTag(tag) {
      params.append("tag", tag);
    });
    searchParams.getAll("source").forEach(function addSource(source) {
      params.append("source", source);
    });
    const page = searchParams.get("page");
    if (page && page !== "1") {
      params.set("page", page);
    }

    const queryString = params.toString();
    return (queryString ? `${basePath}?${queryString}` : basePath) as Route;
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredWords.map(function renderWord(word, index) {
        const wordUrl = buildWordUrl(word);
        return (
          <Link key={word.id} href={wordUrl}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.015 }}
              className="group"
            >
              <div className="rounded-md overflow-hidden bg-gray-50/80 dark:bg-gray-950/30 border border-border/50 hover:border-border/80 hover:shadow-sm transition-all duration-200">
                <div className="h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 group-hover:from-sky-400 group-hover:via-sky-300 group-hover:to-sky-400 dark:group-hover:from-sky-600 dark:group-hover:via-sky-500 dark:group-hover:to-sky-600 transition-all duration-300" />
                <div className="p-3 flex items-start gap-4">
                  <p className="text-sm font-medium text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 min-w-[100px] shrink-0">
                    {word.word_text}
                  </p>
                  <div className="flex-1 min-w-0">
                    {word.definition_text ? (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {word.definition_text}
                        {word.example_text && (
                          <span className="text-xs italic ml-2 text-muted-foreground/70">
                            &mdash; {word.example_text}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 italic">
                        No definition yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
