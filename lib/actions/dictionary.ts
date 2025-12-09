"use server";

import {
  fetchMoreWords as fetchMoreWordsQuery,
  type FetchMoreWordsOptions,
  type FetchMoreWordsResult,
} from "@/lib/db/neon/queries/dictionary/index";

export async function fetchMoreWords(
  options: FetchMoreWordsOptions
): Promise<FetchMoreWordsResult> {
  return fetchMoreWordsQuery(options);
}
