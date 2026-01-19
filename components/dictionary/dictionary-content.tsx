import { EntryList } from "./entry-list";
import { ExpandableEntryList } from "./expandable-entry-list";
import type { PageFetchResult } from "@/lib/db/queries/dictionary";

interface DictionaryContentProps {
  entriesPromise: Promise<PageFetchResult>;
  serverQuery?: string;
  tagSlugs: string[];
  sourceSlugs: string[];
}

export async function DictionaryContent({
  entriesPromise,
  serverQuery,
  tagSlugs,
  sourceSlugs,
}: DictionaryContentProps) {
  const result = await entriesPromise;

  return (
    <div className="pt-4">
      <ExpandableEntryList>
        <EntryList
          entries={result.entries}
          tagSlugs={tagSlugs}
          sourceSlugs={sourceSlugs}
          query={serverQuery}
        />
      </ExpandableEntryList>
    </div>
  );
}
