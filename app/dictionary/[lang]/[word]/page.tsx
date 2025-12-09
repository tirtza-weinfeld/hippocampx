import { Suspense } from "react";
import { notFound } from "next/navigation";
import * as motion from "motion/react-client";
import { BookOpen } from "lucide-react";
import { BackButton } from "@/components/dictionary/back-button";
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
  // RelationsSkeleton,
} from "@/components/dictionary/word-detail";

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
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10">
      {/* Static navigation header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <BackButton fallbackHref="/dictionary" />
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{decodedWord}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Static content - renders immediately */}
          <WordHeader word={word} />
          <WordTags tags={tags} />
          {/* <DefinitionsSkeleton />
          <RelationsSkeleton /> */}

          {/* Streamed content - shows skeletons then loads */}
          <Suspense fallback={<DefinitionsSkeleton />}>
            <DefinitionsAsync wordId={word.id} />
          </Suspense>
          {/* <Suspense fallback={<RelationsSkeleton />}> */}
          <Suspense fallback={null}>
            <RelationsAsync wordId={word.id} languageCode={word.language_code} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
