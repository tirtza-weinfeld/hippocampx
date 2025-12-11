import { notFound } from "next/navigation";
import { EntryHeader } from "./entry-header";
import type { EntryBasic, AudioResult } from "./types";

interface EntryHeaderAsyncProps {
  entryPromise: Promise<EntryBasic | null>;
  audioPromise: Promise<AudioResult | null>;
}

export async function EntryHeaderAsync({ entryPromise, audioPromise }: EntryHeaderAsyncProps) {
  const [entry, audioResult] = await Promise.all([entryPromise, audioPromise]);

  if (!entry) {
    notFound();
  }

  return <EntryHeader entry={entry} audioResult={audioResult} />;
}
