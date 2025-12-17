import { notFound } from "next/navigation";
import { fetchSenseRelationsByEntryId } from "@/lib/db/queries/dictionary/entry-complete";
import { RelationsGrid } from "./relations-grid";
import type { EntryBasic } from "./types";

interface RelationsAsyncProps {
  entryPromise: Promise<EntryBasic | null>;
}

export async function RelationsAsync({ entryPromise }: RelationsAsyncProps) {
  const entry = await entryPromise;
  if (!entry) {
    notFound();
  }
  const relations = await fetchSenseRelationsByEntryId(entry.id);
  return <RelationsGrid relations={relations} languageCode={entry.languageCode} />;
}
