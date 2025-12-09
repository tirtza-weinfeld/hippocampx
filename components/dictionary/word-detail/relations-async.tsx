import { fetchWordRelations } from "@/lib/db/neon/queries/dictionary/word-complete";
import { RelationsGrid } from "./relations-grid";

interface RelationsAsyncProps {
  wordId: number;
  languageCode: string;
}

export async function RelationsAsync({ wordId, languageCode }: RelationsAsyncProps) {
  const relations = await fetchWordRelations(wordId);
  return <RelationsGrid relations={relations} languageCode={languageCode} />;
}
