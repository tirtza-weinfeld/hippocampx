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

Cleaned code = source with docstrings and end-of-line comments stripped. Full-line comments (`# ...`) are **kept** in the displayed code. End-of-line comments are stripped but their content is preserved as tooltips.

`solutions.code` stores cleaned code. All `lsp` positions are in cleaned-code coordinates. Same coordinate space — no conversion needed.

## New Schema

### `symbols`

Tooltip content. One row per tooltip-able thing.

| Field       | Type | Notes                                                        |
|-------------|------|--------------------------------------------------------------|
| qname       | text | PK. Current format preserved (see examples)                  |
| solution_id | uuid | FK → solutions.id, indexed                                  |
| kind        | text | `function` `method` `class` `variable` `parameter` `expression` `comment` |
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
| type        | text | `definition` or `reference`              |
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

**Phase 1 (this migration):** Only the agent card pipeline (`components/problems/agent-db/agent-problem-card.tsx`) gets DB-backed tooltips. The MDX pipeline stays unchanged — keeps using JSON files and existing transformers.

**Phase 2 (future):** Migrate MDX pipeline to DB. Remove JSON files.

## Implementation

### Full pipeline (agent card)

**1. Extraction** (Python, runs offline):
- Existing scripts generate symbol/position/comment data from source files
- `backend/scripts/problems/generate_symbol_tags.py` → `symbols` rows
- `backend/scripts/problems/generate_uses.py` → `lsp` reference rows (symbols)
- `backend/scripts/problems/generate_expressions.py` → `lsp` reference rows (expressions)
- `backend/scripts/problems/generate_comments_inline.py` → `lsp` reference rows (comments)
- `backend/scripts/problems/generate_lsp_index.py` → `lsp` definition rows

**2. Syncing to DB** (Python, runs offline):
- `backend/scripts/problems/sync_problems_to_db.py` — extend to write `symbols` and `lsp` rows per solution, using data from step 1
- Currently syncs problems + solutions. Needs to also: insert `symbols` rows (qname, solution_id, kind, summary) and `lsp` rows (qname, solution_id, type, positions)

**3. Fetching** (server component, build time):
- `lib/db/queries/problems/index.ts` — add new query functions:
  - `getSymbolsBySolutionId(solutionId)` → all `symbols` rows for a solution
  - `getLspReferencesBySolutionId(solutionId)` → all `lsp` reference rows for tooltip placement
  - `getLspDefinitionBySolutionId(solutionId, scopeName)` → scope range for a specific function/class
- `getSolutionsByProblemId()` already exists at `lib/db/queries/problems/index.ts:27` — stays, but returns slimmed solution (no args/variables/expressions/returns)

**4. Rendering** (server component):
- New CodeBlock component in `components/problems/agent-db/`:
  - Receives `solution_id` (and optional `scopeName`)
  - Calls query functions from step 3
  - Runs Shiki highlighting with decorations built from `lsp` references (push symbols, unshift expressions — same priority as current transformers)
  - Wraps result with tooltip popovers, resolving qnames from `symbols` rows
- `components/problems/agent-db/agent-problem-card.tsx`:
  - Replace current `<CodeBlock>` (line 131) with new DB-backed CodeBlock
  - Replace `solution.variables` / `solution.expressions` sections (lines 100-105, 152-170) with queries to `symbols` table by solution_id + kind

### Other files to change

**Drizzle schema** — add `symbols` and `lsp` tables, slim `problems` and `solutions`:
- `lib/db/schemas/problems.ts`

**Code cleaning** — keep full-line comments in cleaned code:
- `backend/scripts/problems/code_cleaner.py` — change `remove_inline_full_line_comments` default to `False`
- Re-sync all solutions to update `solutions.code`

**Unchanged** (Phase 1):
- `components/mdx/code/code-highlighter.ts` — keeps loading JSON
- `components/mdx/code/transformers/*` — unchanged
- `components/mdx/code/code-block.tsx` — unchanged
- `components/mdx/code/render-tooltip-content.tsx` — unchanged
- `lib/extracted-metadata/*.json` — kept as-is

### Migration order

1. Drizzle schema: add `symbols` and `lsp` tables, drop `number` from `problems`, drop `args`/`returns`/`variables`/`expressions` from `solutions`, run migration
2. Code cleaning: update `code_cleaner.py`, re-sync all solutions
3. Ingestion: extend `sync_problems_to_db.py` to populate `symbols` and `lsp` from existing generation scripts
4. Queries: add `getSymbolsBySolutionId`, `getLspReferencesBySolutionId`, `getLspDefinitionBySolutionId` to `lib/db/queries/problems/index.ts`
5. New DB-backed CodeBlock component with Shiki + tooltip rendering
6. Wire into `agent-problem-card.tsx`, replace variables/expressions sections with `symbols` queries
