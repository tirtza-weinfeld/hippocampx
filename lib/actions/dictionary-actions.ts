'use server';

// import { searchWords, getWord, validateWords } from '@/lib/db/dictionary-query';

export async function searchWordsAction(query: string) {
  // const results = await searchWords({ query, limit: 100 });
  // return results;

  return Promise.resolve([]);
}

export async function getWordAction(word: string) {
  // return await getWord(word);
  return Promise.resolve(null);
}

export async function validateWordsAction(wordList: string[]) {
  // return await validateWords(wordList);
  return Promise.resolve([]);
  // return await validateWords(wordList);
}