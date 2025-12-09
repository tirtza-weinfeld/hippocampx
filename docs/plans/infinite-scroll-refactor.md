# Plan: Proper Infinite Scroll Architecture for Dictionary

## Current State Assessment

**What's good** (keep):
- `useTransition` for non-blocking updates
- `IntersectionObserver` for efficient scroll detection
- Proper cleanup to prevent memory leaks
- PPD pattern (Progressive Page Download) for initial load
- Server Actions for data fetching

**What's wrong** (fix):
- Types named "Pagination" but used for infinite scroll
- Offset-based approach will degrade at scale (10k+ words)
- No cursor support for consistent data when items change
- Hardcoded values scattered across files
- Dead code from pagination era

---

## Architecture Decision: Cursor-Based vs Offset-Based

**Current**: Offset-based (`page * pageSize`)
- ❌ Performance degrades at deep pages (page 100+ scans 5000+ rows)
- ❌ Duplicates/missing items if data changes during scroll
- ✅ Simple to implement

**New**: Cursor-based (composite key: sort value + id)
- ✅ Consistent O(1) performance regardless of depth
- ✅ No duplicates when data changes
- ✅ Industry standard for infinite scroll (Relay, Twitter, etc.)

---

## New Type Definitions

### `lib/db/neon/queries/dictionary/types.ts` (new file)

```typescript
/** Configuration for infinite scroll queries */
export const INFINITE_SCROLL_CONFIG = {
  defaultLimit: 50,
  searchLimit: 20,
} as const;

/** Cursor for infinite scroll - composite key for stable sorted pagination */
export interface InfiniteScrollCursor {
  /** ID of last item for tiebreaker */
  afterId: number | null;
  /** Value of sort field for last item (e.g., word_text for alphabetical) */
  afterSortValue: string | number | null;
  /** Sort configuration to validate cursor matches current sort */
  sortBy: "alphabetical" | "created" | "updated";
  sortOrder: "asc" | "desc";
}

/** Result shape for infinite scroll queries */
export interface InfiniteScrollResult<T> {
  data: T[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: InfiniteScrollCursor | null;
    totalCount: number;
  };
}

/** Options for fetching more items */
export interface FetchMoreOptions {
  cursor: InfiniteScrollCursor;
  limit?: number;
  query?: string;
  languageCode?: string;
  tagSlugs?: string[];
  sourceSlugs?: string[];
  sourcePartSlugs?: string[];
}
```

---

## Files to Modify

### 1. `lib/db/neon/queries/dictionary/types.ts` (CREATE)
- New file with types above
- Single source of truth for infinite scroll config

### 2. `lib/db/neon/queries/dictionary/word-queries.ts`

**Add cursor-based query:**
```typescript
export async function fetchWordsWithCursor(
  options: FetchMoreOptions
): Promise<InfiniteScrollResult<WordSerialized>> {
  const { cursor, limit = INFINITE_SCROLL_CONFIG.defaultLimit, ...filters } = options;
  const { sortBy, sortOrder } = cursor;

  // Get sort column based on sortBy
  const sortColumn = sortBy === "alphabetical" ? words.word_text
    : sortBy === "created" ? words.created_at
    : words.updated_at;

  // Composite cursor condition: (sortValue, id) > (lastSortValue, lastId)
  const cursorCondition = cursor.afterId && cursor.afterSortValue
    ? sortOrder === "asc"
      ? or(
          gt(sortColumn, cursor.afterSortValue),
          and(eq(sortColumn, cursor.afterSortValue), gt(words.id, cursor.afterId))
        )
      : or(
          lt(sortColumn, cursor.afterSortValue),
          and(eq(sortColumn, cursor.afterSortValue), lt(words.id, cursor.afterId))
        )
    : undefined;

  const results = await db
    .select({ id: words.id, word_text: words.word_text, language_code: words.language_code })
    .from(words)
    .where(and(cursorCondition, ...filterConditions))
    .orderBy(
      sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
      asc(words.id)  // Tiebreaker
    )
    .limit(limit + 1);

  const hasNextPage = results.length > limit;
  const data = hasNextPage ? results.slice(0, -1) : results;
  const lastItem = data.at(-1);

  return {
    data,
    pageInfo: {
      hasNextPage,
      endCursor: lastItem ? {
        afterId: lastItem.id,
        afterSortValue: lastItem[sortColumn],
        sortBy,
        sortOrder,
      } : null,
      totalCount: await countTotal(filters),
    },
  };
}
```

**Remove:**
- `PaginatedResponse` type
- `fetchWordsPaginated` function
- `searchWords` function (offset-based)

### 3. `lib/db/neon/queries/dictionary/index.ts`

**Replace:**
- `fetchWordsOnly` → `fetchWordsInitial`
- `fetchMoreWords` → `fetchMoreWithCursor`

**Remove:**
- `FetchWordsByFiltersOptions` (uses `page`, `pageSize`)
- `FetchMoreWordsResult` (has `page`, `total`)
- `fetchWordsByFilters` if unused
- All offset-based code

### 4. `components/dictionary/word-list-client.tsx`

**Replace page state with cursor:**
```typescript
// REMOVE
const [page, setPage] = useState(1);

// ADD
const [cursor, setCursor] = useState<InfiniteScrollCursor | null>(initialCursor);
const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
```

**Update loadMore:**
```typescript
const result = await fetchMoreWithCursor({
  cursor,
  limit: INFINITE_SCROLL_CONFIG.defaultLimit,
  ...filters,
});
setCursor(result.pageInfo.endCursor);
setHasNextPage(result.pageInfo.hasNextPage);
```

### 5. `components/dictionary/dictionary-search-wrapper.tsx`

- Update to use `InfiniteScrollResult` shape
- Pass `endCursor` and `hasNextPage` to `WordListClient`
- Display `totalCount` in results badge
- Remove `pagination` object

### 6. `app/dictionary/page.tsx`

- Remove dead `page` variable (line 29)
- Use `fetchWordsInitial` instead of `fetchWordsOnly`
- Import config from types file

---

## Code to Delete

| File | What to Remove |
|------|----------------|
| `word-queries.ts` | `PaginatedResponse`, `fetchWordsPaginated`, `searchWords`, `totalPages` calculations |
| `index.ts` | `FetchWordsByFiltersOptions`, `FetchMoreWordsResult`, `fetchWordsByFilters`, `fetchWordsOnly`, `fetchMoreWords` |
| `dictionary-search-wrapper.tsx` | `pagination` object with unused fields |
| `page.tsx` | `page` variable extraction |
| `word-list-client.tsx` | `page` state, `setPage` |

---

## Migration Strategy

**Complete refactor in one PR:**
1. Create new types file with proper infinite scroll types
2. Replace all offset-based queries with cursor-based
3. Remove `PaginatedResponse` type entirely
4. Remove all `page`, `pageSize`, `totalPages` references
5. Update all components to use new cursor-based approach
6. Delete dead code (no deprecation, just remove)

---

## Testing

1. `pnpm build` - no type errors
2. `pnpm test` - existing tests pass
3. Manual testing:
   - Initial load shows correct count
   - Scroll loads more items
   - No duplicates when scrolling
   - Filters reset scroll position correctly
   - Works with search query
   - Sorting works correctly

---

## Benefits

1. **Professional**: Industry-standard cursor pattern (Relay, GraphQL, Twitter)
2. **Efficient**: O(1) query time regardless of scroll depth
3. **Correct**: No duplicates/missing items when data changes
4. **Maintainable**: Single source of truth for config, clear type names
5. **Scalable**: Ready for 100k+ words without performance degradation
