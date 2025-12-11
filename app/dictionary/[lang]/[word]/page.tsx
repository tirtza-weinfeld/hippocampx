import { Suspense } from "react";
import * as motion from "motion/react-client";
import {
  BackNavButton,
  EntryHeaderClient,
  SensesWithHeaderAsync,
  SensesWithHeaderSkeleton,
  RelationsAsync,
} from "@/components/dictionary/entry-detail";
import { getOrCreateEntryAudio } from "@/lib/actions/word-audio";
import { fetchEntryBasic } from "@/lib/db/neon/queries/dictionary/entry-complete";

export default async function EntryDetailPage(props: {
  params: Promise<{ lang: string; word: string }>;
}) {
  const params = await props.params;
  const { lang, word: lemmaText } = params;
  const decodedLemma = decodeURIComponent(lemmaText);

  // Start entry fetch immediately - need entry.id for audio
  const entryPromise = fetchEntryBasic(decodedLemma, lang);

  // Start audio fetch - chains off entry but doesn't block render
  const audioPromise = entryPromise.then(entry =>
    entry ? getOrCreateEntryAudio(entry.id, entry.lemma, entry.languageCode) : null
  );

  // Page renders INSTANTLY with word from URL
  return (
    <div className="min-h-screen from-transparent via-dict-surface-0 to-transparent bg-linear-to-r">

      {/* Sticky nav - seamless header that clears sidebar toggle */}
      <div className="sticky top-0 z-10">
        <div className="@container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 pl-14 md:pl-0"
          >
            <BackNavButton />
            <span className="text-dict-text-tertiary">/</span>
            <span className="text-sm text-dict-text-secondary font-medium">
              {decodedLemma}
            </span>
          </motion.div>
        </div>
        {/* Fade out gradient at bottom */}
        {/* <div className="h-4 bg-gradient-to-b from-dict-surface-0/80 to-transparent -mt-2" /> */}
      </div>

      {/* Main content */}
      <div className="@container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex flex-col gap-6">
          {/* Header renders INSTANTLY - word from URL, audio loading in background */}
          <EntryHeaderClient lemma={decodedLemma} audioPromise={audioPromise} />

          {/* Senses + tags + entry metadata - streams in */}
          <Suspense fallback={<SensesWithHeaderSkeleton />}>
            <SensesWithHeaderAsync entryPromise={entryPromise} />
          </Suspense>

          {/* Relations - streams independently */}
          <Suspense fallback={null}>
            <RelationsAsync entryPromise={entryPromise} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
