import { notFound } from "next/navigation";
import { fetchSensesByEntryId } from "@/lib/db/neon/queries/dictionary/entry-complete";
import { SensesList } from "./senses-list";
import type { EntryBasic } from "./types";

interface SensesWithHeaderAsyncProps {
  entryPromise: Promise<EntryBasic | null>;
}

export async function SensesWithHeaderAsync({ entryPromise }: SensesWithHeaderAsyncProps) {
  const entry = await entryPromise;

  if (!entry) {
    notFound();
  }

  const senses = await fetchSensesByEntryId(entry.id);

  return (
    <>
      {/* Entry metadata that was waiting on fetch */}
      <div className="flex items-center gap-3 text-dict-text-secondary -mt-4">
        <span className="text-sm italic">{entry.partOfSpeech}</span>
        <span className="text-dict-text-tertiary">|</span>
        <span className="text-sm">{entry.languageCode.toUpperCase()}</span>
      </div>

      {/* Senses */}
      <SensesList senses={senses} />
    </>
  );
}
