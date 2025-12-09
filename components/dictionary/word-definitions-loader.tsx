"use client";

import { use } from "react";

interface DefinitionPreview {
  definition_text: string;
  example_text: string | null;
}

interface WordDefinitionsLoaderProps {
  definitionsPromise: Promise<Map<number, DefinitionPreview>>;
  wordId: number;
  children: (definition: DefinitionPreview | null) => React.ReactNode;
}

export function WordDefinitionsLoader({
  definitionsPromise,
  wordId,
  children,
}: WordDefinitionsLoaderProps) {
  const definitions = use(definitionsPromise);
  const definition = definitions.get(wordId) ?? null;
  return <>{children(definition)}</>;
}
