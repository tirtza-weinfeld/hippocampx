# Symbols & Tooltip Schema

Move tooltip data from JSON files to the database. Enables tooltips in any context — code blocks, inline references, standalone lookups.

## Current State (JSON files)

```
lib/extracted-metadata/
  symbol_tags.json      (5k lines)  — tooltip content keyed by qname
  uses.json             (10k lines) — symbol positions keyed by filename
  expressions.json      (141 lines) — expression positions keyed by filename
  lsp_index.json        (9.5k lines) — symbol hierarchy, used only for scope filtering
```

Problems:
- All files loaded globally on every render
- LSP index is 9.5k lines just to call `getFunctionRange()`
- `uses.json` and `expressions.json` are structurally identical but stored separately
- `solutions` table has `args`, `returns`, `variables`, `expressions` — same data as symbol_tags, duplicated
- Tooltip content only accessible through code block transformers, not standalone

## New Schema

### `symbols`

Global symbol index. One row per symbol. Queryable from anywhere.

| Field        | Type   | Notes                                    |
|--------------|--------|------------------------------------------|
| qname        | text   | PK. Fully qualified name encodes file, scope, symbol |
| kind         | text   | `function` `method` `class` `variable` `parameter` `expression` |
| source_range | jsonb  | `{start: {line, char}, end: {line, char}}` in original file |
| content      | jsonb  | Kind-specific tooltip payload (see below) |

**content by kind:**
- function/method: `{label, summary, code, args, returns}`
- class: `{label, summary, code}`
- variable/parameter: `{summary}`
- expression: `{summary}`

**qname examples:**
```
problems.153-find-minimum-in-rotated-sorted-array.solution:find_minimum_in_rotated_sorted_array
problems.153-find-minimum-in-rotated-sorted-array.solution:find_minimum_in_rotated_sorted_array.low
problems.153-find-minimum-in-rotated-sorted-array.solution:find_minimum_in_rotated_sorted_array.l = mid + 1
core.bellman-ford.classic:bellman_ford_classic
```

Source file and symbol name are derivable from qname — no separate columns needed.

Hierarchy is encoded in qname prefixes:
```sql
-- All children of a function
WHERE qname LIKE '...solution:find_minimum.%'
```

### `solution_positions`

Pre-computed tooltip positions per solution. Scope-filtered and line-adjusted at ingestion time.

| Field       | Type   | Notes                              |
|-------------|--------|------------------------------------|
| solution_id | uuid   | PK, FK -> solutions.id             |
| positions   | jsonb  | Array of position entries           |

Each position entry:
```json
{ "nameRange": { "start": { "line": 3, "character": 8 }, "end": { "line": 3, "character": 11 } }, "qname": "...solution:func.low" }
```

Kind and content come from `symbols.qname` — not duplicated here.

### `solutions` (slimmed)

Remove fields that move to `symbols`:

| Remove         | Reason                                    |
|----------------|-------------------------------------------|
| args           | Now rows in `symbols` with kind=parameter |
| returns        | Now in function's `symbols.content`       |
| variables      | Now rows in `symbols` with kind=variable  |
| expressions    | Now rows in `symbols` with kind=expression|

Remaining columns: `id`, `problem_id`, `file_name`, `code`, `intuition`, `time_complexity`, `order_index`, `created_at`, `updated_at`

## Relationships

```
problems
  └── solutions              (problem_id FK, many-to-one)
        └── solution_positions   (solution_id FK, one-to-one)
                └── positions[].qname ──references──> symbols.qname

symbols                       (standalone, no FK)
```

`symbols` has no foreign key to any table. The link from `solution_positions` to `symbols` is implicit through qnames in the positions array.

## What Replaces What

| JSON file          | Becomes                                   |
|--------------------|-------------------------------------------|
| symbol_tags.json   | `symbols` table                           |
| uses.json          | merged into `solution_positions.positions` |
| expressions.json   | merged into `solution_positions.positions` |
| lsp_index.json     | consumed at ingestion only, not stored    |

## Access Patterns

**Code block with tooltips** (current transformer use case):
1. `getSolutionsByProblemId()` — get solutions
2. `solution_positions` — get pre-computed positions for that solution
3. Transformer places decorations using positions
4. Client resolves qnames from `symbols` for tooltip content

**Standalone symbol lookup** (new capability):
```sql
SELECT * FROM symbols WHERE qname = '...solution:binary_search'
```

**Inline reference** (`[qname]` in markdown):
```sql
SELECT content FROM symbols WHERE qname = '...:find_minimum.l = mid + 1'
```

**All symbols for a function:**
```sql
SELECT * FROM symbols WHERE qname LIKE '...:binary_search.%'
```

**All expressions across all problems:**
```sql
SELECT * FROM symbols WHERE kind = 'expression'
```
