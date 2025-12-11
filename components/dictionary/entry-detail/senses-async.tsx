import { notFound } from "next/navigation";
import { fetchSensesByEntryId } from "@/lib/db/neon/queries/dictionary/entry-complete";
import { SensesList } from "./senses-list";
import type { EntryBasic } from "./types";

interface SensesAsyncProps {
  entryPromise: Promise<EntryBasic | null>;
}

export async function SensesAsync({ entryPromise }: SensesAsyncProps) {
  const entry = await entryPromise;
  if (!entry) {
    notFound();
  }
  const senses = await fetchSensesByEntryId(entry.id);
  return <SensesList senses={senses} />;
}
