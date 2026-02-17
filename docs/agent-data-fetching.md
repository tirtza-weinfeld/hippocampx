# Agent Pipeline — Data Fetching

## Current Flow

```
Agent.tsx (server, cached)
  getProblems() ──────────── all ~90 problems (slug, title, difficulty, topics)
  │
  └── AgentProblemCard (per problem, Suspense boundary)
        getSolutionsByProblemId() ──── solutions (code, intuition, time_complexity)
        getSymbolsBySolutionId() × N ── symbols per solution
        │
        └── DbCodeBlock (per solution)
              getLspReferencesBySolutionId() ── tooltip positions
```

- All problems fetched at once — lightweight metadata for filtering
- Client-side filtering by difficulty/topics in Zustand store
- Each card fetches its own solutions + symbols via Suspense
- No URL state — filters reset on refresh

## Decisions

### 1. All problems vs. server filtering

~90 problems. Fetching all metadata is fine — server filtering adds latency for no gain at this scale. If we hit 500+ problems, server-side pagination with cursor makes sense.

**Decision:** Keep fetching all. Revisit at 500+.

### 2. Filters in URL

`?difficulty=hard&topics=dp,graph` — shareable, bookmark-able, back button works.

Options:
- `nuqs` — type-safe search params with Zustand-like API
- Raw `searchParams` in Next.js — no dependency, more boilerplate

Independent of client vs server filtering — URL state works with client-side filtering.

**Decision:** Add URL-based filter state. Use `searchParams` (no new deps).

### 3. Solutions fetch strategy

| Strategy | Round trips | Data transferred | Complexity |
|----------|------------|-----------------|------------|
| Per-card via Suspense (current) | N+1 | Only visible cards | Low |
| Lazy on expand only | 1 + on-demand | Minimal | Medium |
| Single join query | 1 | All solutions upfront | Low |

Current approach: N+1 pattern, but all queries are cached (`'use cache: remote'` + `cacheLife('hours')`). Solutions stream in via Suspense — shell renders instantly.

**Decision:** Keep per-card fetching. Caching eliminates the N+1 cost. Lazy-on-expand adds client complexity for no real UX gain since cards already stream.
