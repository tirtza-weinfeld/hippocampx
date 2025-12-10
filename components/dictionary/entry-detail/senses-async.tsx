import { fetchSensesByEntryId } from "@/lib/db/neon/queries/dictionary/entry-complete";
import { SensesList } from "./senses-list";

interface SensesAsyncProps {
  entryId: number;
}

export async function SensesAsync({ entryId }: SensesAsyncProps) {
  const senses = await fetchSensesByEntryId(entryId);
  return <SensesList senses={senses} />;
}
