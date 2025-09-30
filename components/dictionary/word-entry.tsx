import type { WordWithDefinitions } from "@/lib/db/dictionary-schema";
import { DefinitionEntry } from "./definition-entry";
import { PhrasesSection } from "./phrases-section";
import { WordFormsSection } from "./word-forms-section";
import { AudioButton } from "./audio-button";
import { validateWords } from "@/lib/db/dictionary-query";

function groupDefinitions(definitions: WordWithDefinitions["definitions"]): Record<string, typeof definitions> {
  return definitions.reduce((acc, def) => {
    if (!acc[def.partOfSpeech]) {
      acc[def.partOfSpeech] = [];
    }
    acc[def.partOfSpeech].push(def);
    return acc;
  }, {} as Record<string, typeof definitions>);
}

type WordEntryProps = {
  readonly wordData: WordWithDefinitions;
};

export async function WordEntry({ wordData }: WordEntryProps) {
  const groupedDefinitions = groupDefinitions(wordData.definitions);

  // Collect all related words from all definitions
  const allRelatedWords: string[] = [];
  for (const def of wordData.definitions) {
    allRelatedWords.push(
      ...def.synonyms.map(s => s.synonym),
      ...def.antonyms.map(a => a.antonym),
      ...def.relatedWords.filter(rw => rw.relationshipType === "similar").map(rw => rw.relatedWord)
    );
  }

  // Only validate if there are related words
  const existingWords = allRelatedWords.length > 0
    ? await validateWords(allRelatedWords)
    : new Set<string>();

  return (
    <article className="max-w-3xl">
      <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex items-center gap-3 mb-2">
          {wordData.audioUrl && (
            <AudioButton audioUrl={wordData.audioUrl} word={wordData.word} />
          )}
          <h1 className="text-[2.5rem] leading-tight font-normal text-gray-900 dark:text-white">
            {wordData.word}
          </h1>
        </div>
        {wordData.pronunciation && (
          <p className="text-base text-gray-600 dark:text-gray-400 font-normal ml-[52px]">
            {wordData.pronunciation}
          </p>
        )}
      </header>

      <div className="space-y-8">
        {Object.entries(groupedDefinitions).map(([partOfSpeech, defs]) => (
          <section key={partOfSpeech} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0">
            <div className="mb-4">
              <h2 className="text-base font-normal italic text-gray-600 dark:text-gray-400 mb-2">
                {partOfSpeech}
              </h2>
              {wordData.wordForms.length > 0 && (
                <WordFormsSection
                  wordForms={wordData.wordForms}
                  partOfSpeech={partOfSpeech}
                />
              )}
            </div>
            <ol className="space-y-6 list-decimal list-inside marker:text-gray-500 dark:marker:text-gray-500 marker:font-normal">
              {defs.map((definition) => (
                <DefinitionEntry
                  key={definition.id}
                  definition={definition}
                  existingWords={existingWords}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>

      {wordData.phrases.length > 0 && (
        <PhrasesSection phrases={wordData.phrases} />
      )}
    </article>
  );
}