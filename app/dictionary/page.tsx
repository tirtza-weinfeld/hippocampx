import { Suspense } from "react";
// import { searchWords } from "@/lib/db/dictionary-query";
// import { DictionarySearch } from "@/components/dictionary/dictionary-search";
// import { WordList } from "@/components/dictionary/word-list";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dictionary | HippocampX',
  description: 'Search and explore word definitions, synonyms, and usage examples.',
};

type DictionaryPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function DictionaryPage({ searchParams }: DictionaryPageProps) {
  const params = await searchParams;
  const query = params.q ?? '';

  // Pass promise instead of awaiting - enables streaming
  // const wordsPromise = searchWords({ query, limit: 100 });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Dictionary</h1>
        {/* <DictionarySearch initialQuery={query} /> */}
      </div>

      <Suspense fallback={<WordListSkeleton />}>
        {/* <WordListWrapper wordsPromise={wordsPromise} /> */}
      </Suspense>
    </>
  );
}

// function WordListWrapper({ wordsPromise }: { wordsPromise: ReturnType<typeof searchWords> }) {
//   return <WordList wordsPromise={wordsPromise} />;
// }

function WordListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}