import { Suspense } from "react";
import { notFound } from "next/navigation";
import * as motion from "motion/react-client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  fetchWordBasic,
  fetchTagsByWordId,
} from "@/lib/db/neon/queries/dictionary/word-complete";
import {
  WordHeader,
  WordTags,
  DefinitionsAsync,
  RelationsAsync,
  DefinitionsSkeleton,
} from "@/components/dictionary/word-detail";
import { getOrCreateWordAudio } from "@/lib/actions/word-audio";

export default async function WordDetailPage(props: {
  params: Promise<{ lang: string; word: string }>;
}) {
  const params = await props.params;
  const { lang, word: wordText } = params;
  const decodedWord = decodeURIComponent(wordText);

  // Fetch base word first (required for notFound check and header)
  const word = await fetchWordBasic(decodedWord, lang);

  if (!word) {
    notFound();
  }

  // Fetch tags in parallel with render (needed for immediate display)
  const tags = await fetchTagsByWordId(word.id);

  return (
    <div className="min-h-screen from-transparent via-dict-surface-0 to-transparent bg-linear-to-r">
      
      {/* Minimal sticky nav - Google style */}
      <div className="from-transparent via-dict-glass to-transparent bg-linear-to-r sticky top-0 z-10 border-b border-dict-border ">
        <div className="@container mx-auto px-4 py-3 ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/dictionary"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-dict-hover transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-dict-text-secondary" />
            </Link>
            <div className="flex items-center gap-2 text-sm text-dict-text-secondary">
              {/* <BookOpen className="h-4 w-4" /> */}
              <span className="font-medium text-dict-text">{decodedWord}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content - clean Google-style layout */}
      <div className="@container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex flex-col gap-6">
          <WordHeader
            word={word}
            audioPromise={getOrCreateWordAudio(word.id, word.word_text, word.language_code)}
          />
          <WordTags tags={tags} />

          {/* Definitions with streaming */}
          <Suspense fallback={<DefinitionsSkeleton />}>
            <DefinitionsAsync wordId={word.id} />
          </Suspense>

          {/* Relations */}
          <Suspense fallback={null}>
            <RelationsAsync wordId={word.id} languageCode={word.language_code} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
