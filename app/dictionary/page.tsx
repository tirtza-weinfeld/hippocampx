import { Suspense } from "react";
import {
  fetchWordsOnly,
  fetchFirstDefinitionForWords,
} from "@/lib/db/neon/queries/dictionary/index";
import { Skeleton } from "@/components/ui/skeleton";
import { DictionarySearchWrapper } from "@/components/dictionary/dictionary-search-wrapper";
import * as motion from "motion/react-client";
import { BookOpen } from "lucide-react";

interface DefinitionPreview {
  definition_text: string;
  example_text: string | null;
}

export default async function DictionaryPage(props: {
  searchParams: Promise<{
    q?: string;
    lang?: string;
    page?: string;
    tag?: string | string[];
    source?: string | string[];
    part?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const language = searchParams.lang || "en";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const tagSlugs = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : [];

  const sourceSlugs = searchParams.source
    ? Array.isArray(searchParams.source)
      ? searchParams.source
      : [searchParams.source]
    : [];

  const sourcePartSlugs = searchParams.part
    ? Array.isArray(searchParams.part)
      ? searchParams.part
      : [searchParams.part]
    : [];

  // Fetch words without definitions - PPD pattern
  const wordsPromise = fetchWordsOnly({
    query,
    languageCode: language,
    page,
    pageSize: 50,
    tagSlugs,
    sourceSlugs,
    sourcePartSlugs,
  });

  // Create definitions promise that depends on words
  const definitionsPromise = wordsPromise.then(
    function fetchDefinitionsFromWords(result): Promise<Map<number, DefinitionPreview>> {
      const wordIds = result.words.data.map(w => w.id);
      return fetchFirstDefinitionForWords(wordIds);
    }
  );

  const headerContent = (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500/20 blur-lg rounded-xl" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-sky-50 to-blue-100/80 dark:from-sky-950/60 dark:to-blue-900/40 ring-1 ring-sky-200/50 dark:ring-sky-700/30 shadow-sm">
          <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight bg-linear-to-r from-sky-600 via-blue-600 to-sky-500 dark:from-sky-400 dark:via-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
          Dictionary
        </h1>
        <p className="text-muted-foreground text-sm">
          Browse and search your vocabulary collection
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/10">
      <Suspense fallback={<WordListSkeleton />}>
        <DictionarySearchWrapper
          wordsPromise={wordsPromise}
          definitionsPromise={definitionsPromise}
          initialQuery={query}
          initialLanguage={language}
          serverQuery={query}
          headerContent={headerContent}
        />
      </Suspense>
    </div>
  );
}

function WordListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map(function renderSkeleton(_, i) {
          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-card/50 border border-border/40 backdrop-blur-xs"
            >
              <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
              <div className="p-4 flex items-start gap-4">
                <Skeleton className="h-5 w-28 shrink-0" />
                <Skeleton className="h-5 flex-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
