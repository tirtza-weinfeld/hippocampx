import { fetchDefinitionsByWordId } from "@/lib/db/neon/queries/dictionary/word-complete";
import { DefinitionsList } from "./definitions-list";

interface DefinitionsAsyncProps {
  wordId: number;
}

export async function DefinitionsAsync({ wordId }: DefinitionsAsyncProps) {
  const definitions = await fetchDefinitionsByWordId(wordId);
  return <DefinitionsList definitions={definitions} />;
}
