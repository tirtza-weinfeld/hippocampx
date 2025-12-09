"use server";

import {
  fetchMoreWithCursor as fetchMoreWithCursorQuery,
  type FetchMoreWithCursorOptions,
  type InfiniteScrollResult,
  type WordWithPreview,
} from "@/lib/db/neon/queries/dictionary/index";

export async function fetchMoreWithCursor(
  options: FetchMoreWithCursorOptions
): Promise<InfiniteScrollResult<WordWithPreview>> {
  return fetchMoreWithCursorQuery(options);
}
