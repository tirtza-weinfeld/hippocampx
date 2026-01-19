import { Suspense } from "react";
import Link from "next/link";
import type { Route } from "next";
import { MarkdownRenderer } from "@/components/mdx/parse/markdown-renderer";
import { getOrCreateEntryAudio } from "@/lib/actions/word-audio";
import type { EntryWithPreview } from "@/lib/db/queries/dictionary";
import { EntryAudioButton, EntryAudioButtonSkeleton } from "./entry-audio-button";

interface EntryCardProps {
  entry: EntryWithPreview;
  tagSlugs?: string[];
  sourceSlugs?: string[];
}

/**
 * Server component for a single dictionary entry.
 * Wrapped in Suspense in EntryList - streams independently.
 */
export function EntryCard({ entry, tagSlugs = [], sourceSlugs = [] }: EntryCardProps) {
  const basePath = `/dictionary/${entry.languageCode}/${encodeURIComponent(entry.lemma)}`;
  const params = new URLSearchParams();
  tagSlugs.forEach((tag) => params.append("tag", tag));
  sourceSlugs.forEach((source) => params.append("source", source));
  const queryString = params.toString();
  const href = (queryString ? `${basePath}?${queryString}` : basePath) as Route;

  // Create promise for audio - streams independently via Suspense
  // Uses getOrCreateEntryAudio which synthesizes on demand if not in DB
  const audioPromise = getOrCreateEntryAudio(entry.id, entry.lemma, entry.languageCode);

  return (
    <Link href={href}>
      <article className="group relative rounded-3xl bg-dict-surface-1 overflow-hidden transition-all duration-250 ease-out hover:bg-dict-surface-2 hover:-translate-y-0.5 hover:shadow-dict-card-hover">
        <div className="h-0.5 bg-dict-card-line transition-all duration-300 group-hover:bg-dict-card-line-active group-hover:shadow-dict-glow" />
        <div className="p-4 flex items-start gap-4">
          {/* Audio button - streams independently */}
          <Suspense fallback={<EntryAudioButtonSkeleton />}>
            <EntryAudioButton audioPromise={audioPromise} />
          </Suspense>

          <div className="min-w-[100px] shrink-0">
            <span className="text-[0.9375rem] font-semibold text-dict-text transition-colors duration-200 group-hover:text-dict-primary">
              {entry.lemma}
            </span>
            <span className="ml-2 text-xs text-dict-text-tertiary italic">
              {entry.partOfSpeech}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            {entry.definition ? (
              <div className="dict-definition-content overflow-hidden transition-[height] duration-200">
                <p className="text-sm text-dict-text-secondary leading-relaxed">
                  <MarkdownRenderer>{entry.definition}</MarkdownRenderer>
                  {entry.exampleText && (
                    <span className="text-xs italic ml-2 text-dict-example">
                      &mdash; <MarkdownRenderer>{entry.exampleText}</MarkdownRenderer>
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-xs text-dict-text-tertiary italic">No definition yet</p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * Skeleton for a single entry card - shown while streaming.
 */
export function EntryCardSkeleton() {
  return (
    <div className="group relative rounded-3xl bg-dict-surface-1 overflow-hidden">
      <div className="h-0.5 bg-dict-card-line" />
      <div className="p-4 flex items-start gap-4">
        <EntryAudioButtonSkeleton />
        <div className="min-w-[100px] shrink-0">
          <div className="h-5 w-20 rounded bg-dict-surface-2 animate-pulse" />
          <div className="h-3 w-12 mt-1 rounded bg-dict-surface-2/60 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="h-4 w-3/4 rounded bg-dict-surface-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
