"use client";

import { useState, Suspense } from "react";
import { ExpandButton } from "./expand-button";
import { WordPreviewDialog } from "./word-preview-dialog";
import { getWordAction } from "@/lib/actions/dictionary-actions";
import type { WordWithDefinitions } from "@/lib/db/dictionary-schema";

type ValidatedWord = {
  readonly word: string;
  readonly exists: boolean;
};

type RelatedWordsGroupProps = {
  readonly label: string;
  readonly validatedWords: readonly ValidatedWord[];
};

export function RelatedWordsGroup({ label, validatedWords }: RelatedWordsGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewWord, setPreviewWord] = useState<string | null>(null);
  const [previewPromise, setPreviewPromise] = useState<Promise<WordWithDefinitions | undefined> | null>(null);

  if (validatedWords.length === 0) return null;

  const visibleWords = isExpanded ? validatedWords : validatedWords.slice(0, 5);
  const hasMore = validatedWords.length > 5;

  function handleWordClick(word: string, exists: boolean) {
    if (!exists) return;
    setPreviewWord(word);
    setPreviewPromise(getWordAction(word));
  }

  function handleClose() {
    setPreviewWord(null);
    setPreviewPromise(null);
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-gray-600 dark:text-gray-400 font-medium">
          {label}:
        </span>
        {visibleWords.map(({ word, exists }, index) => (
          exists ? (
            <button
              key={index}
              onClick={() => handleWordClick(word, exists)}
              className="px-3 py-1.5 text-[13px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
            >
              {word}
            </button>
          ) : (
            <span
              key={index}
              className="px-3 py-1.5 text-[13px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-full cursor-not-allowed"
            >
              {word}
            </span>
          )
        ))}
        {hasMore && !isExpanded && (
          <ExpandButton onClick={() => setIsExpanded(true)} />
        )}
      </div>

      {previewWord && previewPromise && (
        <Suspense fallback={null}>
          <WordPreviewDialog
            word={previewWord}
            wordDataPromise={previewPromise}
            onClose={handleClose}
          />
        </Suspense>
      )}
    </>
  );
}