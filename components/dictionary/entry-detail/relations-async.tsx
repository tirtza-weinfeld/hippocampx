import { fetchSenseRelationsByEntryId } from "@/lib/db/neon/queries/dictionary/entry-complete";
import { RelationsGrid } from "./relations-grid";

interface RelationsAsyncProps {
  entryId: number;
  languageCode: string;
}

export async function RelationsAsync({ entryId, languageCode }: RelationsAsyncProps) {
  const relations = await fetchSenseRelationsByEntryId(entryId);
  return <RelationsGrid relations={relations} languageCode={languageCode} />;
}
