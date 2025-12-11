import { Suspense } from "react";
import * as motion from "motion/react-client";
import { fetchEntriesInitial } from "@/lib/db/neon/queries/dictionary/index";
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

  // Fetch initial entries with cursor-based pagination
  const entriesPromise = fetchEntriesInitial({
    query,
    languageCode: language,
    tagSlugs,
    sourceSlugs,
    sourcePartSlugs,
  });

  return (
    <div className="min-h-screen relative">
      {/* Ambient background - subtle mesh gradient */}
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

      {/* Sticky Header - Always visible for search/filter access */}
      <DictionaryHeader
        initialQuery={query}
        initialLanguage={language}
        entriesPromise={entriesPromise}
      />

      {/* Scrollable Content Area */}
      <main className="container mx-auto px-4 pb-12">
        <Suspense fallback={<EntryListSkeleton />}>
          <DictionaryContent
            entriesPromise={entriesPromise}
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

function EntryListSkeleton() {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-6">
      {/* Results count skeleton - pill shape */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="h-8 w-28 rounded-full bg-dict-skeleton" />
      </motion.div>

      {/* Entry list skeleton with staggered animation */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        className="flex flex-col gap-3"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="group relative rounded-xl overflow-hidden bg-dict-glass backdrop-blur-sm border border-dict-border/40"
          >
            {/* Top decorative gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-dict-border/60 to-transparent" />

            {/* Card content */}
            <div className="p-4 sm:p-5 flex items-start gap-4">
              {/* Word skeleton - slightly taller with gradient */}
              <div className="shrink-0 flex flex-col gap-1.5">
                <div
                  className="h-5 rounded-md bg-dict-skeleton"
                  style={{ width: `${80 + (i % 3) * 20}px` }}
                />
                <div className="h-3 w-16 rounded bg-dict-surface-2/60" />
              </div>

              {/* Definition skeleton - varied widths */}
              <div className="flex-1 space-y-2 pt-0.5">
                <div
                  className="h-4 rounded bg-dict-skeleton"
                  style={{ width: `${70 + (i % 4) * 8}%` }}
                />
                <div
                  className="h-4 rounded bg-dict-surface-3/50"
                  style={{ width: `${40 + (i % 3) * 15}%` }}
                />
              </div>

              {/* Optional tag placeholders */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <div className="h-6 w-14 rounded-full bg-dict-surface-2/40" />
              </div>
            </div>

            {/* Subtle bottom border */}
            <div className="absolute inset-x-4 bottom-0 h-px bg-linear-to-r from-transparent via-dict-border/30 to-transparent" />

            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[dict-shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom fade hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6 flex justify-center"
      >
        <div className="h-1 w-24 rounded-full bg-dict-surface-3/50" />
      </motion.div>
    </div>
  );
}
