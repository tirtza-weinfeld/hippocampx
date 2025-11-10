# Inline Comments Architecture

## Current System

**Files**:
- `comments-inline.json` - Maps file paths to line numbers with comments
- `comments-inline-symbols.json` - Maps qname-like identifiers to comment text

**Format**:
```json
// comments-inline.json
{
  "problems/1235-maximum-profit-in-job-scheduling/top_down.py": [10],
  "problems/1235-maximum-profit-in-job-scheduling/bottom_up.py": [6, 8, 12, 13, 15, 19]
}

// comments-inline-symbols.json
{
  "problems/1235-maximum-profit-in-job-scheduling/top_down.py:comment-line:10": "max profit starting from job i",
  "problems/1235-maximum-profit-in-job-scheduling/bottom_up.py:comment-line:6": "Sort jobs by end time..."
}
```

**Script**: `backend/scripts/problems/generate_comments_inline.py`
- Extracts inline comments (`# ...`) from Python files
- Stores line numbers and comment text
- Used for tooltip rendering on specific code lines

---

## Problem

Inline comments are **position-based** (line numbers), not **symbol-based** like other tooltips.

**Example**:
```python
jobs = sorted(zip(startTime, endTime, profit))  # Sort jobs by end time
```

This comment is on **line 6** and explains the **line itself**, not a specific symbol.

---

## Solution Options

### Option 1: Store as Special Symbols (Recommended)

**Add inline comments to the `symbols` table** with a special kind.

**Schema** (no changes needed!):
```typescript
{
  kind: "inline-comment"  // New kind
  qname: "1235:top_down.py:line:10"
  name: "line:10"
  content: "max profit starting from job i"
  metadata: { line_number: 10 }
  solution_id: uuid
}
```

**Benefits**:
- ✅ Unified storage (all tooltips in one table)
- ✅ Same query system works
- ✅ Easy to fetch with other symbols
- ✅ Can use existing API routes

**Querying**:
```typescript
// Get all inline comments for a solution
const comments = await db
  .select()
  .from(symbols)
  .where(
    and(
      eq(symbols.solution_id, solutionId),
      eq(symbols.kind, 'inline-comment')
    )
  );

// Get comment for specific line
const comment = await getSymbolByQname('1235:top_down.py:line:10');
```

**Python sync update**:
```python
def sync_inline_comments(conn, solution_id: str, slug: str, file_name: str):
    """Sync inline comments as symbols"""
    # Extract comments from file
    comments = extract_file_comments(file_path)

    symbols_to_insert = []
    for line_num, comment_text in comments.items():
        qname = f"{problem_number}:{file_name}:line:{line_num}"

        symbols_to_insert.append((
            solution_id,
            qname,
            'inline-comment',  # kind
            f'line:{line_num}',  # name
            comment_text,  # content
            json.dumps({'line_number': line_num}),  # metadata
            None  # parent_id
        ))

    # Insert into symbols table
    execute_values(cursor, INSERT_SQL, symbols_to_insert)
```

---

### Option 2: Separate Table

**Create a new `inline_comments` table**.

**Schema**:
```typescript
{
  id: uuid
  solution_id: uuid (→ solutions.id)
  line_number: integer
  comment: text
  created_at: timestamp
  updated_at: timestamp
}
```

**Benefits**:
- ✅ Cleaner separation of concerns
- ✅ Easier to query by line number

**Drawbacks**:
- ❌ Separate API route needed
- ❌ Different query pattern
- ❌ More tables to manage

---

### Option 3: Store in Solution Metadata

**Add comments JSONB column to `solutions` table**.

**Schema change**:
```typescript
{
  // ... existing columns
  inline_comments: jsonb  // { "10": "max profit starting from job i", ... }
}
```

**Benefits**:
- ✅ Simple - all solution data together
- ✅ Fast retrieval (single query)

**Drawbacks**:
- ❌ Less flexible for complex queries
- ❌ Harder to search across comments
- ❌ Not normalized

---

## Recommended Approach: Option 1 (Symbols with Special Kind)

### Why?

1. **Unified API** - Same `/api/symbols` endpoint works
2. **Consistent queries** - Same query functions
3. **Flexible** - Can add relationships, search, etc.
4. **Future-proof** - Easy to add more metadata

### Implementation Plan

#### 1. Update Python Sync Script

Add inline comment extraction to `sync_problems_to_db.py`:

```python
def sync_symbols_for_solution(conn, solution_id: str, slug: str, file_name: str, solution_data: dict):
    """Sync all symbols including inline comments"""

    # ... existing symbol sync ...

    # Add inline comments
    problem_dir = problems_dir / slug
    file_path = problem_dir / file_name

    if file_path.exists():
        comments = extract_file_comments(file_path)

        for line_num, comment_text in comments.items():
            qname = f"{problem_number}:{file_name}:line:{line_num}"

            symbols_to_insert.append((
                solution_id,
                qname,
                'inline-comment',
                f'line:{line_num}',
                comment_text,
                json.dumps({'line_number': line_num}),
                None
            ))
```

#### 2. Update Symbol Kinds Type

```typescript
// lib/db/schema-problems.ts
export type SymbolKind =
  | 'function'
  | 'variable'
  | 'expression'
  | 'parameter'
  | 'inline-comment';  // NEW
```

#### 3. Query Inline Comments

```typescript
// lib/db/queries/agent-problems.ts

/**
 * Get all inline comments for a solution
 */
export async function getInlineComments(solutionId: string): Promise<Symbol[]> {
  return db
    .select()
    .from(symbols)
    .where(
      and(
        eq(symbols.solution_id, solutionId),
        eq(symbols.kind, 'inline-comment')
      )
    )
    .orderBy(symbols.metadata); // Sort by line number
}

/**
 * Get inline comment for specific line
 */
export async function getInlineCommentAtLine(
  problemSlug: string,
  fileName: string,
  lineNumber: number
): Promise<Symbol | null> {
  const problemNumber = extractProblemNumber(problemSlug);
  const qname = `${problemNumber}:${fileName}:line:${lineNumber}`;

  return getSymbolByQname(qname);
}
```

#### 4. API Route Usage

Same `/api/symbols` endpoint works!

```typescript
// Client-side fetch
const response = await fetch(
  `/api/symbols?q=line:10&problem=1235&file=top_down.py`
);

// Or direct query
const response = await fetch(
  `/api/symbols?q=1235:top_down.py:line:10`
);
```

#### 5. Code Transformer Integration

```typescript
// components/mdx/code/transformers/meta-tooltip.ts

// When rendering code line by line
function renderCodeLine(line: string, lineNumber: number, context: Context) {
  // Mark line as having inline comment
  return {
    ...line,
    hasInlineComment: true,
    commentQuery: `${context.problem}:${context.file}:line:${lineNumber}`
  };
}

// Client component fetches on hover
<CodeLine
  onHover={() => fetch(`/api/symbols?q=${commentQuery}`)}
/>
```

---

## Data Migration

### Step 1: Re-sync with Inline Comments

Run updated sync script:

```bash
pnpm problems:sync-db
```

### Step 2: Verify Data

```typescript
// Check inline comments count
const result = await db.execute(sql`
  SELECT COUNT(*) FROM symbols WHERE kind = 'inline-comment'
`);

console.log(`Inline comments: ${result.rows[0].count}`);
```

### Expected Result

Based on current `comments-inline-symbols.json`:
- ~50+ inline comments across all solutions

---

## Rendering Strategy

### Server Component (Fast Initial Render)

```typescript
async function SolutionCode({ solutionId }: { solutionId: string }) {
  // Server-side: Fetch code
  const solution = await getSolutionById(solutionId);

  // DON'T fetch inline comments server-side (too slow)
  return (
    <CodeBlock
      code={solution.code}
      solutionId={solutionId}
    />
  );
}
```

### Client Component (Lazy Load Comments)

```typescript
'use client';

function CodeBlock({ code, solutionId }: Props) {
  const [comments, setComments] = useState<Map<number, string>>(new Map());

  // Fetch inline comments on mount
  useEffect(() => {
    fetch(`/api/symbols?solutionId=${solutionId}&kind=inline-comment`)
      .then(res => res.json())
      .then(symbols => {
        const commentMap = new Map();
        symbols.forEach(sym => {
          const lineNum = sym.metadata.line_number;
          commentMap.set(lineNum, sym.content);
        });
        setComments(commentMap);
      });
  }, [solutionId]);

  return (
    <pre>
      {code.split('\n').map((line, i) => (
        <CodeLine
          key={i}
          line={line}
          lineNumber={i}
          comment={comments.get(i)}
        />
      ))}
    </pre>
  );
}
```

### Alternative: Batch Fetch All Tooltips

```typescript
// Fetch ALL symbols (including inline comments) in one request
const response = await fetch(`/api/symbols?solutionId=${solutionId}`);
const allSymbols = await response.json();

// Separate by kind
const inlineComments = allSymbols.filter(s => s.kind === 'inline-comment');
const variables = allSymbols.filter(s => s.kind === 'variable');
const expressions = allSymbols.filter(s => s.kind === 'expression');
```

---

## qname Format Examples

```
# Inline comments
1235:top_down.py:line:10
1235:bottom_up.py:line:6

# Regular symbols (for comparison)
1235:top_down.py:maximum_profit_in_job_scheduling.dp
1235:top_down.py:maximum_profit_in_job_scheduling.memo
```

**Pattern**: `{problem}:{file}:line:{number}` for inline comments

---

## Benefits Over Current System

### Current (JSON files):
```
❌ Two separate JSON files
❌ Build-time only
❌ No smart queries
❌ Can't search across comments
```

### New (Database):
```
✅ Single source of truth
✅ Runtime queries
✅ Same API as other symbols
✅ Full-text search possible
✅ Can relate comments to code structure
```

---

## Future Enhancements

1. **Link comments to symbols**
   ```sql
   UPDATE symbols
   SET parent_id = (SELECT id FROM symbols WHERE qname = 'func_qname')
   WHERE kind = 'inline-comment' AND ...
   ```

2. **Search within comments**
   ```sql
   SELECT * FROM symbols
   WHERE kind = 'inline-comment'
   AND content ILIKE '%kadane%'
   ```

3. **Multi-line comments**
   Store range instead of single line:
   ```json
   metadata: {
     line_start: 10,
     line_end: 12
   }
   ```

4. **Comment categories**
   ```json
   metadata: {
     line_number: 10,
     category: 'optimization' | 'edge-case' | 'complexity'
   }
   ```

---

## Summary

**Recommendation**: Store inline comments as symbols with `kind='inline-comment'`

**qname format**: `{problem}:{file}:line:{lineNumber}`

**No schema changes needed** - existing `symbols` table works perfectly!

**Action items**:
1. Update Python sync script to extract inline comments
2. Add to `symbols` table with kind `'inline-comment'`
3. Re-run sync: `pnpm problems:sync-db`
4. Use existing API routes (no changes needed)
5. Update code transformer to mark lines with comments
6. Create client component to fetch and display tooltips

---

**Next**: Update `DATABASE_MIGRATION.md` to include inline comments strategy.
