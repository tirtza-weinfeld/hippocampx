import { use } from 'react';
import type { Word } from '@/lib/db/dictionary-schema';
import { WordListItem } from './word-list-item';

type WordListProps = {
  readonly wordsPromise: Promise<readonly Word[]>;
};

export function WordList({ wordsPromise }: WordListProps) {
  const words = use(wordsPromise);

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">No words found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {words.map((word) => (
        <WordListItem key={word.id} word={word} />
      ))}
    </div>
  );
}