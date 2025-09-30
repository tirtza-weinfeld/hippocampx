'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

type DictionarySearchProps = {
  readonly initialQuery: string;
};

export function DictionarySearch({ initialQuery }: DictionarySearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticQuery, setOptimisticQuery] = useOptimistic(initialQuery);

  function handleChange(value: string) {
    setOptimisticQuery(value);

    startTransition(() => {
      if (value) {
        router.push(`/dictionary?q=${encodeURIComponent(value)}`);
      } else {
        router.push('/dictionary');
      }
    });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <input
        type="search"
        name="q"
        value={optimisticQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search for a word..."
        className="w-full px-4 py-3 pr-12 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900"
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </form>
  );
}