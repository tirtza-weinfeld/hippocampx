import { Suspense } from "react";
import { fetchWordsInitial } from "@/lib/db/neon/queries/dictionary/index";
import { Skeleton } from "@/components/ui/skeleton";
import { DictionaryHeader } from "@/components/dictionary/dictionary-header";
import { DictionaryContent } from "@/components/dictionary/dictionary-content";

export default async function DictionaryPage(props: {
  searchParams: Promise<{
    q?: string;
    lang?: string;
    tag?: string | string[];
    source?: string | string[];
    part?: string | string[];
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const language = searchParams.lang || "en";

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

  // Fetch initial words with cursor-based pagination
  const wordsPromise = fetchWordsInitial({
    query,
    languageCode: language,
    tagSlugs,
    sourceSlugs,
    sourcePartSlugs,
  });

  return (
    <div className="min-h-screen bg-dict-page">
      {/* Sticky Header - Always visible for search/filter access */}
      <DictionaryHeader
        initialQuery={query}
        initialLanguage={language}
        wordsPromise={wordsPromise}
      />

      {/* Scrollable Content Area */}
      <main className="container mx-auto px-4 pb-8">
        <Suspense fallback={<WordListSkeleton />}>
          <DictionaryContent
            wordsPromise={wordsPromise}
            serverQuery={query}
            initialLanguage={language}
            filterKey={`${query ?? ""}|${language}|${tagSlugs.join(",")}|${sourceSlugs.join(",")}|${sourcePartSlugs.join(",")}`}
            tagSlugs={tagSlugs}
            sourceSlugs={sourceSlugs}
            sourcePartSlugs={sourcePartSlugs}
          />
        </Suspense>
      </main>
    </div>
  );
}

function WordListSkeleton() {
  return (
    <div className="pt-6">
      {/* Results count skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Word list skeleton */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map(function renderSkeleton(_, i) {
          return (
            <div
              key={i}
              className="dict-card overflow-hidden"
            >
              <div className="h-px bg-linear-to-r from-transparent via-dict-border to-transparent" />
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
