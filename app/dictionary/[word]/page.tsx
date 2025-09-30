import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getWordBasic, getWordDefinitions, getWordRelated } from '@/lib/db/dictionary-query';
import { WordHeader, WordHeaderSkeleton } from '@/components/dictionary/word-header';
import { WordDefinitions, WordDefinitionsSkeleton } from '@/components/dictionary/word-definitions';
import { WordRelated, WordRelatedSkeleton } from '@/components/dictionary/word-related';
import Link from 'next/link';
import type { Metadata } from 'next';

type WordDetailPageProps = {
  params: Promise<{
    word: string;
  }>;
};

export async function generateMetadata({ params }: WordDetailPageProps): Promise<Metadata> {
  const { word } = await params;
  const wordData = await getWordBasic(decodeURIComponent(word));

  if (!wordData) {
    return {
      title: 'Word Not Found',
    };
  }

  const { definitions } = await getWordDefinitions(wordData.id);
  const firstDefinition = definitions[0]?.definition || '';

  return {
    title: `${wordData.word} | Dictionary`,
    description: firstDefinition.slice(0, 160),
  };
}

export default async function WordDetailPage({ params }: WordDetailPageProps) {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);

  // Start all fetches immediately (don't await)
  const wordBasicPromise = getWordBasic(decodedWord);

  // Check if word exists before fetching more
  const wordBasic = await wordBasicPromise;
  if (!wordBasic) {
    notFound();
  }

  // Now start the slower fetches in parallel
  const definitionsPromise = getWordDefinitions(wordBasic.id);
  const relatedPromise = getWordRelated(wordBasic.id);

  // Get definition IDs for related words (need to await this)
  const { definitions } = await definitionsPromise;
  const definitionIds = definitions.map(d => d.id);

  return (
    <article className="max-w-3xl">
      <Link
        href="/dictionary"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dictionary
      </Link>

      {/* Header streams in first (fast) */}
      <Suspense fallback={<WordHeaderSkeleton />}>
        <WordHeader wordPromise={Promise.resolve(wordBasic)} />
      </Suspense>

      {/* Definitions stream in next (medium) */}
      <Suspense fallback={<WordDefinitionsSkeleton />}>
        <WordDefinitions definitionsPromise={Promise.resolve({ definitions, wordForms: [] })} />
      </Suspense>

      {/* Related words stream in last (slow) */}
      <Suspense fallback={<WordRelatedSkeleton />}>
        <WordRelated relatedPromise={relatedPromise} definitionIds={definitionIds} />
      </Suspense>
    </article>
  );
}