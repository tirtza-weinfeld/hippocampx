import { Suspense } from "react";
import { fetchEntriesPage } from "@/lib/db/queries/dictionary";
import { DictionaryHeader } from "@/components/dictionary/dictionary-header";
import { DictionaryHeaderStats } from "@/components/dictionary/dictionary-header-stats";
import { DictionaryContent } from "@/components/dictionary/dictionary-content";
import { EntryListSkeleton } from "@/components/dictionary/entry-list-skeleton";

export default async function DictionaryPage(props: {
  searchParams: Promise<{
    q?: string;
    lang?: string;
    tag?: string | string[];
    source?: string | string[];
    part?: string | string[];
    page?: string;
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

  // Create promise but don't await - allows header shell to render instantly
  const entriesPromise = fetchEntriesPage({
    page,
    query,
    languageCode: language,
    tagSlugs,
    sourceSlugs,
    sourcePartSlugs,
  });

  return (
    <div className="min-h-screen relative">
      {/* Ambient background */}
      <div
        className="fixed inset-0 -z-10 bg-dict-page-gradient pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-dict-primary-wash blur-3xl opacity-60" />
        <div className="absolute top-1/3 -left-32 size-80 rounded-full bg-dict-accent-soft blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-1/4 size-64 rounded-full bg-dict-primary-wash blur-3xl opacity-30" />
      </div>

      {/* Header shell renders instantly, stats stream in */}
      <DictionaryHeader
        initialQuery={query}
        initialLanguage={language}
      >
        <DictionaryHeaderStats
          entriesPromise={entriesPromise}
          query={query}
          language={language}
          tagSlugs={tagSlugs}
          sourceSlugs={sourceSlugs}
          sourcePartSlugs={sourcePartSlugs}
        />
      </DictionaryHeader>

      {/* Content streams in */}
      <main className="container mx-auto px-4 pb-12">
        <Suspense fallback={<EntryListSkeleton />}>
          <DictionaryContent
            entriesPromise={entriesPromise}
            serverQuery={query}
            tagSlugs={tagSlugs}
            sourceSlugs={sourceSlugs}
          />
        </Suspense>
      </main>
    </div>
  );
}
