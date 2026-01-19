# Dictionary Refactor Plan - Split View with Parallel Routes

## Goal
Transform dictionary from separate list/detail pages into a split view where:
- List is always visible in sidebar (@list parallel route)
- Main area shows welcome OR detail (children)
- URL controls both: path for detail, searchParams for list filters

## Target Structure
```
app/dictionary/
  layout.tsx              ← Split view { children, list }
  page.tsx                ← Welcome (children default when no word)
  loading.tsx             ← Loading for children
  error.tsx               ← Error boundary
  @list/
    page.tsx              ← List content (reads searchParams)
    default.tsx           ← Re-export same list (fallback for detail routes)
  [lang]/[word]/
    page.tsx              ← Detail page (children when word selected)
```

## URL Mapping
| URL | children (main) | list (sidebar) |
|-----|-----------------|----------------|
| `/dictionary` | Welcome | List (English) |
| `/dictionary?q=sup` | Welcome | Filtered list |
| `/dictionary/en/superfluous` | Detail | List |
| `/dictionary/en/superfluous?q=sup&tag=noun` | Detail | Filtered list |

## Key Requirements
1. **MarkdownRenderer** (server component) for both list entries and detail content
2. **Streaming** - Each EntryCard wrapped in Suspense, streams independently
3. **No waterfalls** - Parallel data fetching (fetchEntriesPage already does this)
4. **Preserve searchParams** - Entry links: `/dictionary/en/word?q=sup&tag=noun`
5. **List persists** - Parallel route doesn't remount on detail navigation

## Layout Implementation
```tsx
// app/dictionary/layout.tsx
export default function DictionaryLayout({
  children,
  list,
}: {
  children: ReactNode;
  list: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-80 shrink-0 border-r border-dict-border overflow-y-auto">
        {list}
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

## Files to Create
- `app/dictionary/@list/page.tsx` - List content from current page.tsx, stripped of full-page styling
- `app/dictionary/@list/default.tsx` - Re-export: `export { default } from "./page"`

## Files to Modify
- `app/dictionary/layout.tsx` - Split view with { children, list }
- `app/dictionary/page.tsx` - Becomes welcome page (simple content)
- `app/dictionary/[lang]/[word]/page.tsx` - Remove full-page wrappers, adapt for split
- `components/dictionary/entry-card.tsx` - Accept searchParams, preserve in links
- `components/dictionary/dictionary-header.tsx` - Adapt for sidebar width

## Entry Card Link Update
```tsx
// EntryCard needs searchParams passed from parent
interface EntryCardProps {
  entry: EntryWithPreview;
  searchParams?: string; // Serialized searchParams to preserve
}

// Link building:
const href = searchParams
  ? `/dictionary/${entry.languageCode}/${encodeURIComponent(entry.lemma)}?${searchParams}`
  : `/dictionary/${entry.languageCode}/${encodeURIComponent(entry.lemma)}`;
```

## Data Flow
- @list reads searchParams: q, tag, source, part, page
- @list calls fetchEntriesPage() - already parallel (Promise.all)
- Each EntryCard has Suspense for audio streaming
- Detail fetches entry, senses, relations in parallel

## Mobile Responsive (TBD)
Options:
- Stack (list above, detail below)
- Collapse sidebar (show toggle)
- Hide list when detail selected (back button to return)

## Current Audio Implementation
- EntryCard creates promise: `getOrCreateEntryAudio(entry.id, entry.lemma, entry.languageCode)`
- Wrapped in Suspense with EntryAudioButtonSkeleton
- Synthesizes via TTS on demand if not in DB
- This should continue to work in new structure
