"use server";

import {
  fetchMoreWithCursor as fetchMoreWithCursorQuery,
  type FetchMoreWithCursorOptions,
  type InfiniteScrollResult,
  type EntryWithPreview,
} from "@/lib/db/queries/dictionary";

export async function fetchMoreWithCursor(
  options: FetchMoreWithCursorOptions
): Promise<InfiniteScrollResult<EntryWithPreview>> {
  return fetchMoreWithCursorQuery(options);
}
