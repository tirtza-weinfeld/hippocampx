import { Suspense } from "react";
import { notFound } from "next/navigation";
import * as motion from "motion/react-client";
import {
  fetchEntryBasic,
  fetchSensesByEntryId,
} from "@/lib/db/neon/queries/dictionary/entry-complete";
import {
  BackNavButton,
  EntryHeader,
  RelationsAsync,
  SensesAsync,
  SensesSkeleton,
  SenseTags,
} from "@/components/dictionary/entry-detail";
import { getOrCreateEntryAudio } from "@/lib/actions/word-audio";

export default async function EntryDetailPage(props: {
  params: Promise<{ lang: string; word: string }>;
}) {
  const params = await props.params;
  const { lang, word: lemmaText } = params;
  const decodedLemma = decodeURIComponent(lemmaText);

  // Fetch base entry first (required for notFound check and header)
  const entry = await fetchEntryBasic(decodedLemma, lang);

  if (!entry) {
    notFound();
  }

  // Fetch senses to get tags (needed for immediate display)
  const senses = await fetchSensesByEntryId(entry.id);

  // Collect unique tags from all senses
  const allTags = senses.flatMap(s => s.tags);
  const uniqueTags = allTags.filter((tag, index, self) =>
    self.findIndex(t => t.id === tag.id) === index
  );

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
            <BackNavButton />
            <div className="flex items-center gap-2 text-sm text-dict-text-secondary">
              <span className="font-medium text-dict-text">{decodedLemma}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content - clean Google-style layout */}
      <div className="@container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex flex-col gap-6">
          <EntryHeader
            entry={entry}
            audioPromise={getOrCreateEntryAudio(entry.id, entry.lemma, entry.languageCode)}
          />
          <SenseTags tags={uniqueTags} />

          {/* Senses with streaming */}
          <Suspense fallback={<SensesSkeleton />}>
            <SensesAsync entryId={entry.id} />
          </Suspense>

          {/* Relations */}
          <Suspense fallback={null}>
            <RelationsAsync entryId={entry.id} languageCode={entry.languageCode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
