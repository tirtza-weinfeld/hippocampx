# Symbols & Tooltip Schema

Move tooltip data from JSON files to the database. Enables tooltips in any context — code blocks, inline references, standalone lookups.

## Current State (JSON files)

```
lib/extracted-metadata/
  symbol_tags.json           — tooltip content keyed by qname
  uses.json                  — symbol positions keyed by filename
  expressions.json           — expression positions keyed by filename
  comments-inline.json       — end-of-line comment line numbers keyed by filename
  comments-inline-symbols.json — comment text keyed by qname
  lsp_index.json             — symbol hierarchy for scope filtering
```

Problems:
- All files loaded globally on every render
- LSP index is 9.5k lines just to call `getFunctionRange()`
- `uses.json` and `expressions.json` are structurally identical but stored separately
- `solutions` table has `args`, `returns`, `variables`, `expressions` — same data as symbol_tags, duplicated
- Tooltip content only accessible through code block transformers, not standalone

## Code Cleaning

Cleaned code = source with docstrings and end-of-line comments stripped.
<!-- Full-line comments (`# ...`) are **kept** in the displayed code.  -->
End-of-line comments are stripped but their content is preserved as tooltips.

`solutions.code` stores cleaned code. All `lsp` positions are in cleaned-code coordinates. Same coordinate space — no conversion needed.

## Schema

### `symbols`

Tooltip content. One row per tooltip-able thing.

| Field       | Type | Notes                                                        |
|-------------|------|--------------------------------------------------------------|
| qname       | text | PK. Current format preserved (see examples)                  |
| solution_id | uuid | FK → solutions.id, indexed                                  |
| kind        | enum | `function` `method` `class` `variable` `parameter` `expression` `comment` `attribute` `class_attribute` |
| summary     | text | Tooltip text                                                 |

Relationships (which params belong to a function) are encoded in qname hierarchy. To show a function's args in its tooltip, query direct children:
```ts
db.select().from(symbols).where(
  and(
    eq(symbols.solutionId, solutionId),
    like(symbols.qname, 'core.bellman-ford.classic:bellman_ford_classic.%'),
    notLike(symbols.qname, 'core.bellman-ford.classic:bellman_ford_classic.%.%'),
    eq(symbols.kind, 'parameter')
  )
)
```

**qname format:** Current format preserved. `.` for path segments, `:` separates file path from top-level symbol, `.` for nested scopes.

**qname examples:**
```
core.bellman-ford.classic:bellman_ford_classic
core.bellman-ford.classic:bellman_ford_classic.edges
core.bellman-ford.classic:bellman_ford_classic.if not updated
core.bellman-ford.classic:bellman_ford_classic.range(V - 1)
blackboard:Solution.findWords
problems.153-find-minimum-in-rotated-sorted-array.solution:find_minimum_in_rotated_sorted_array
problems.153-find-minimum-in-rotated-sorted-array.solution:find_minimum_in_rotated_sorted_array.low
problems.265-paint-house-ii.top-down:comment-line:12
```

### `lsp`

All positional data — both where symbols are defined and where they're referenced in code.

| Field       | Type | Notes                                    |
|-------------|------|------------------------------------------|
| id          | uuid | PK                                       |
| solution_id | uuid | FK → solutions.id, indexed               |
| qname       | text | FK → symbols.qname                      |
| type        | enum | `definition` or `reference`              |
| start_line  | int  |                                          |
| start_char  | int  |                                          |
| end_line    | int  |                                          |
| end_char    | int  |                                          |

All positions are in cleaned-code file coordinates.

**`definition`**: The range of a function/method/class body in the file. Only kinds with scope (`function`, `method`, `class`) have definition rows. Used for scope filtering at build time.

**`reference`**: Where a symbol appears in the code. One row per occurrence. All kinds can have references. Used for tooltip placement.

A symbol can have zero or more references (a variable used 3 times = 3 reference rows). A function/method/class has exactly one definition row.

### `problems` (slimmed)

| Remove | Reason                          |
|--------|---------------------------------|
| number | Already encoded in slug         |

Remaining columns: `id`, `slug`, `title`, `definition`, `leetcode_url`, `difficulty`, `topics`, `created_at`, `updated_at`

### `solutions` (slimmed)

Remove fields that move to `symbols`:

| Remove      | Reason                                    |
|-------------|-------------------------------------------|
| args        | Now rows in `symbols` with kind=parameter |
| returns     | Part of function signature, not separate data |
| variables   | Now rows in `symbols` with kind=variable  |
| expressions | Now rows in `symbols` with kind=expression|

Remaining columns: `id`, `problem_id`, `file_name`, `code` (cleaned), `intuition`, `time_complexity`, `order_index`, `created_at`, `updated_at`

## Relationships

```
problems
  └── solutions                (problem_id FK, many-to-one)
        ├── symbols            (solution_id FK, many-to-one)
        └── lsp                (solution_id FK, many-to-one)
              └── symbols      (qname FK)
```

## What Replaces What

| JSON file                  | Becomes                              |
|----------------------------|--------------------------------------|
| symbol_tags.json           | `symbols` table (summary from each entry's relevant field) |
| comments-inline-symbols.json | `symbols` rows with kind=`comment` (value → summary) |
| uses.json                  | `lsp` rows with type=`reference`     |
| expressions.json           | `lsp` rows with type=`reference`     |
| comments-inline.json       | `lsp` rows with type=`reference`     |
| lsp_index.json             | `lsp` rows with type=`definition`    |

## Access Patterns

**Code block with scoped tooltips** (given `solutionId` and `scopeName`):
1. Get `code` from solution
2. Query definition range:
   ```ts
   db.select().from(lsp).where(
     and(
       eq(lsp.solutionId, solutionId),
       like(lsp.qname, `%:${scopeName}`),
       eq(lsp.type, 'definition')
     )
   )
   ```
   → get scope range (e.g. lines 10-25)
3. Slice `code` lines 10-25 → displayed code
4. Query all references for the solution:
   ```ts
   db.select().from(lsp).where(
     and(
       eq(lsp.solutionId, solutionId),
       eq(lsp.type, 'reference')
     )
   )
   ```
5. Filter references to those within lines 10-25, subtract 10 from each line → tooltip positions relative to displayed code
6. Resolve qnames from `symbols` → tooltip content

**Code block whole file** (given `solutionId`):
1. Get `code` from solution
2. Query all references:
   ```ts
   db.select().from(lsp).where(
     and(
       eq(lsp.solutionId, solutionId),
       eq(lsp.type, 'reference')
     )
   )
   ```
   → tooltip positions (already file-relative)
3. Resolve qnames from `symbols` → tooltip content

**All symbols for a solution:**
```ts
db.select().from(symbols).where(eq(symbols.solutionId, solutionId))
```

**Standalone symbol lookup:**
```ts
db.select().from(symbols).where(eq(symbols.qname, 'core.bellman-ford.classic:bellman_ford_classic'))
```

**All expressions across all problems:**
```ts
db.select().from(symbols).where(eq(symbols.kind, 'expression'))
```

## Scope

**Phase 1 (done):** Agent card pipeline gets DB-backed tooltips. MDX pipeline unchanged.

**Phase 2 (future):** Migrate MDX pipeline to DB. Remove JSON files.

## Implementation (Phase 1)

### Pipeline

**1. Extraction** (Python, runs offline):
- Existing scripts generate symbol/position/comment data from source files
- `backend/scripts/problems/generate_symbol_tags.py` → `symbols` rows
- `backend/scripts/problems/generate_uses.py` → `lsp` reference rows (symbols)
- `backend/scripts/problems/generate_expressions.py` → `lsp` reference rows (expressions)
- `backend/scripts/problems/generate_comments_inline.py` → `lsp` reference rows (comments)
- `backend/scripts/problems/generate_lsp_index.py` → `lsp` definition rows

**2. Syncing to DB** (Python, runs offline):
- `backend/scripts/problems/sync_problems_to_db/` — package that reads extracted JSON metadata and writes to DB
  - `__main__.py` — CLI entry point, loads all JSON files, iterates problems
  - `db.py` — database connection (Neon via psycopg2, venv at `backend/.venv`)
  - `extract.py` — parses Python source files for problem/solution metadata
  - `upsert.py` — DB upsert functions for problems, solutions, symbols, lsp
  - `sync.py` — orchestrator per problem: upsert problem → upsert solutions → sync symbols → sync lsp (filtered to valid qnames)

**3. Fetching** (server component, runtime):
- `lib/db/queries/problems/index.ts`:
  - `getProblems()` → all problems (lightweight, for filtering)
  - `getSolutionsByProblemId(problemId)` → slimmed solutions
  - `getSymbolsBySolutionId(solutionId)` → all symbols for a solution
  - `getLspReferencesBySolutionId(solutionId)` → lsp reference rows for tooltip placement
  - `getLspDefinitionByScope(solutionId, scopeQname)` → scope range for a function/class
- All queries cached with `'use cache: remote'` + `cacheLife('hours')`

**4. Rendering** (server component):
- `components/problems/agent-db/agent-problem-card.tsx`:
  - Fetches solutions + symbols per solution (parallel)
  - Passes symbols down to DbCodeBlock and uses them for variables/expressions sections
- `components/problems/agent-db/db-code-block.tsx`:
  - Receives `solutionId`, `code`, `symbols` as props
  - Fetches only `lspRefs` from DB
  - Builds Shiki decorations from lsp references (filtered to symbols that exist)
  - Runs Shiki → HAST → JSX → tooltipifyJSX with `DbTooltipContent`
- `components/problems/agent-db/db-tooltip-content.tsx`:
  - Renders tooltip popover content from `Symbol` row (kind badge + name + summary)

### Data flow

```
Agent.tsx
  getProblems() ──────────────────────────────── all problems (metadata only)
  │
  └── AgentProblemCard (per problem)
        getSolutionsByProblemId() ──────────────── solutions for this problem
        getSymbolsBySolutionId() × N ──────────── symbols per solution (parallel)
        │
        ├── section map (which tabs to show)
        ├── variables list (symbols where kind=variable)
        ├── expressions list (symbols where kind=expression)
        │
        └── DbCodeBlock (per solution)
              getLspReferencesBySolutionId() ───── lsp positions (1 query)
              symbols passed as prop ──────────── no duplicate fetch
              Shiki + decorations → tooltips
```

### Files changed

| File | Change |
|------|--------|
| `lib/db/schemas/problems.ts` | Added `symbols` + `lsp` tables with enums, dropped `number` from problems, dropped `args`/`returns`/`variables`/`expressions` from solutions |
| `lib/db/queries/problems/index.ts` | Added `getSymbolsBySolutionId`, `getLspReferencesBySolutionId`, `getLspDefinitionByScope` |
<!-- | `backend/scripts/problems/code_cleaner.py` | `remove_inline_full_line_comments` default → `False` | -->
| `backend/scripts/problems/sync_problems_to_db/` | New package replacing old `sync_problems_to_db.py` |
| `components/problems/agent-db/db-code-block.tsx` | New — Shiki + DB-backed tooltip decorations |
| `components/problems/agent-db/db-tooltip-content.tsx` | New — tooltip popover content from Symbol rows |
| `components/problems/agent-db/agent-problem-card.tsx` | Rewired to use DbCodeBlock, symbols table for variables/expressions |
| `package.json` | Updated `problems:sync-db` and `problems:single` scripts |

### Unchanged (Phase 1)

- `components/mdx/code/code-highlighter.ts` — keeps loading JSON
- `components/mdx/code/transformers/*` — unchanged
- `components/mdx/code/code-block.tsx` — unchanged
- `components/mdx/code/render-tooltip-content.tsx` — unchanged
- `lib/extracted-metadata/*.json` — kept as-is
