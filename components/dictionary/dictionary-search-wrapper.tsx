"use client";

import { useState, ReactNode } from "react";
import { SearchBar } from "./search-bar";
import { WordListClient } from "./word-list-client";

interface Word {
  id: number;
  word_text: string;
  language_code: string;
}

export function DictionarySearchWrapper({
  words,
  initialQuery,
  initialLanguage,
  serverQuery,
  headerContent,
}: {
  words: Word[];
  initialQuery?: string;
  initialLanguage: string;
  serverQuery?: string;
  headerContent: ReactNode;
}) {
  const [clientFilter, setClientFilter] = useState("");

  return (
    <>
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          {headerContent}
          <div className="mt-6">
            <SearchBar
              initialQuery={initialQuery}
              initialLanguage={initialLanguage}
              onClientFilterChange={setClientFilter}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <WordListClient
          words={words}
          clientFilter={clientFilter}
          serverQuery={serverQuery}
        />
      </div>
    </>
  );
}
