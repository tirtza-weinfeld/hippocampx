import { notFound } from "next/navigation";
import { fetchNotationsByEntryId } from "@/lib/db/queries/dictionary/entry-complete";
import { NotationsDisplay } from "./notations-display";
import type { EntryBasic } from "./types";

interface NotationsAsyncProps {
  entryPromise: Promise<EntryBasic | null>;
}

export async function NotationsAsync({ entryPromise }: NotationsAsyncProps) {
  const entry = await entryPromise;
  if (!entry) {
    notFound();
  }
  const notations = await fetchNotationsByEntryId(entry.id);
  return <NotationsDisplay notations={notations} />;
}
