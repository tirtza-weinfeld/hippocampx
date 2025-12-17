"use client";

import { use } from "react";
import { EntryListClient } from "./entry-list-client";
import type { InitialFetchResult } from "@/lib/db/queries/dictionary";

interface DictionaryContentProps {
  entriesPromise: Promise<InitialFetchResult>;
  serverQuery?: string;
  initialLanguage: string;
  filterKey: string;
  tagSlugs: string[];
  sourceSlugs: string[];
  sourcePartSlugs: string[];
}

export function DictionaryContent({
  entriesPromise,
  serverQuery,
  initialLanguage,
  filterKey,
  tagSlugs,
  sourceSlugs,
  sourcePartSlugs,
}: DictionaryContentProps) {
  const result = use(entriesPromise);

  return (
    <div className="pt-4">
      <EntryListClient
        initialEntries={result.entries.data}
        initialPageInfo={result.entries.pageInfo}
        serverQuery={serverQuery}
        initialLanguage={initialLanguage}
        filterKey={filterKey}
        tagSlugs={tagSlugs}
        sourceSlugs={sourceSlugs}
        sourcePartSlugs={sourcePartSlugs}
      />
    </div>
  );
}
