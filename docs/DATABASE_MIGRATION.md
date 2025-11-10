# Database Migration for Agent System

## Overview

Complete migration from JSON/MDX-based problem storage to PostgreSQL database with smart symbol resolution.

---

## ✅ What We've Accomplished

### 1. Database Schema (3 Tables)

#### **problems**
All problem metadata in one place.

```typescript
{
  id: uuid (primary key)
  slug: string (unique)           // "1235-maximum-profit-in-job-scheduling"
  number: integer                 // 1235
  title: string                   // "Maximum Profit in Job Scheduling"
  definition: text                // Problem description
  leetcode_url: string
  difficulty: enum                // 'easy' | 'medium' | 'hard'
  topics: string[]
  created_at: timestamp
  updated_at: timestamp
}
```

#### **solutions**
Just code for each solution file.

```typescript
{
  id: uuid (primary key)
  problem_id: uuid (→ problems.id, cascade delete)
  file_name: string               // "top_down.py"
  code: text                      // Full source code
  order_index: integer            // Display order
  created_at: timestamp
  updated_at: timestamp
}
```

**Unique constraint**: `(problem_id, file_name)` - one file per problem

#### **symbols**
ALL tooltip/docstring metadata (unified table replacing old args/variables/expressions tables).

```typescript
{
  id: uuid (primary key)
  solution_id: uuid (→ solutions.id, cascade delete, nullable)
  qname: string (unique)          // "1235:top_down.py:maximum_profit_in_job_scheduling.dp"
  kind: string                    // 'function' | 'variable' | 'expression' | 'parameter'
  name: string                    // "dp" or "memo" or "bisect_left(...)"
  content: text                   // Main tooltip description
  metadata: jsonb                 // Extra data: {intuition, time_complexity, label, etc.}
  parent_id: uuid (→ symbols.id, cascade delete, nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**: `qname`, `solution_id`, `parent_id`, `kind`

---

### 2. qname Format Design

**Format**: `problem:file:function.symbol`

**Separators**:
- `:` for file-path levels (problem → file → function)
- `.` for scope nesting (function → nested function → variable)

**Examples**:
```
1235:top_down.py:maximum_profit_in_job_scheduling
1235:top_down.py:maximum_profit_in_job_scheduling.memo
1235:top_down.py:maximum_profit_in_job_scheduling.dp
1235:top_down.py:maximum_profit_in_job_scheduling.dp.i
1235:top_down.py:maximum_profit_in_job_scheduling.dp(i + 1)
```

**Why this format?**
- `:` for levels enables queries like `WHERE qname LIKE '1235:top_down.py:%'`
- `.` for nesting shows "belongs to" relationship
- Matches common conventions (Python: `module.Class.method`)

---

### 3. Data Sync Script

**File**: `backend/scripts/problems/sync_problems_to_db.py`

**What it does**:
1. Reads from `backend/algorithms/problems/*/`
2. Extracts problem metadata from `__init__.py`
3. Extracts solution code from `.py` files
4. Parses docstrings for args, variables, expressions
5. Generates qnames and inserts into database

**Current status**:
- ✅ 95 problems synced
- ✅ 124 solutions synced
- ✅ 263 symbols synced

**Run**: `pnpm problems:sync-db`

---

### 4. Smart Query System

**File**: `lib/db/queries/symbol-resolver.ts`

**Features**:
- Context-based disambiguation
- Partial query support
- Hierarchical pattern matching

**Query Examples**:

| Query | Context | Result |
|-------|---------|--------|
| `"dp"` | `{ problemNumber: "1235" }` | All `dp` symbols in problem 1235 |
| `"1235:dp"` | None | All `dp` symbols in problem 1235 |
| `"1235:top_down.py:dp"` | None | All `dp` in specific file |
| `"maximum_profit_in_job_scheduling.dp"` | `{ problemNumber: "1235", solutionFile: "top_down.py" }` | Exact match |
| `"1235:top_down.py:maximum_profit_in_job_scheduling.dp"` | None | Fully qualified (exact match) |

---

### 5. Server Queries

**File**: `lib/db/queries/agent-problems.ts`

**Functions**:

```typescript
// Get all problems
getProblems(): Promise<Problem[]>

// Get single problem by slug
getProblemBySlug(slug: string): Promise<Problem | null>

// Get solutions for a problem
getSolutionsByProblem(problemId: string): Promise<Solution[]>

// Get specific solution
getSolution(problemSlug: string, fileName: string): Promise<Solution | null>

// Get all symbols for a solution
getSymbolsBySolution(solutionId: string): Promise<Symbol[]>

// Smart symbol resolution (THE KEY FUNCTION)
resolveSymbol(
  query: string,
  context?: SymbolQueryContext
): Promise<Symbol[]>

// Get symbol by exact qname
getSymbolByQname(qname: string): Promise<Symbol | null>

// Get all symbols for a problem
getSymbolsByProblemSlug(problemSlug: string): Promise<Symbol[]>

// Fuzzy search
searchSymbols(searchTerm: string, limit?: number): Promise<Symbol[]>
```

---

## 🚧 What Still Needs To Be Done

### 1. API Routes (Next.js Route Handlers)

**Files to create**:

#### `app/api/problems/route.ts`
```typescript
// GET /api/problems - List all problems
export async function GET() {
  const problems = await getProblems();
  return Response.json(problems);
}
```

#### `app/api/problems/[slug]/route.ts`
```typescript
// GET /api/problems/1235-maximum-profit-in-job-scheduling
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const problem = await getProblemBySlug(params.slug);
  return Response.json(problem);
}
```

#### `app/api/solutions/route.ts`
```typescript
// GET /api/solutions?problem=1235-max-profit&file=top_down.py
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const problemSlug = searchParams.get('problem');
  const fileName = searchParams.get('file');

  if (problemSlug && fileName) {
    const solution = await getSolution(problemSlug, fileName);
    return Response.json(solution);
  }
  // ... handle other cases
}
```

#### `app/api/symbols/route.ts` (THE MOST IMPORTANT ONE)
```typescript
// GET /api/symbols?q=dp&problem=1235&file=top_down.py&function=maximum_profit_in_job_scheduling
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const context = {
    problemNumber: searchParams.get('problem'),
    solutionFile: searchParams.get('file'),
    functionName: searchParams.get('function'),
  };

  const symbols = await resolveSymbol(query, context);
  return Response.json(symbols);
}
```

**Why API routes?**
- Enable client-side fetching with React `use()` hook
- Support on-demand loading (tooltips load lazily)
- Can be called from anywhere (notes, problem pages, etc.)

---

### 2. Update Tooltip Transformer

**File**: `components/mdx/code/transformers/meta-tooltip.ts`

**Current behavior**:
- Reads from `lib/extracted-metadata/symbol_tags.json`
- Generates tooltip data at build time

**New behavior**:
- Query database via API route
- Load tooltip data on-demand
- Cache results client-side

**Example transformation**:

```typescript
// OLD: Read from JSON at build time
const tooltipData = require('@/lib/extracted-metadata/symbol_tags.json');

// NEW: Fetch from API at runtime
async function getTooltipData(symbolName: string, context: Context) {
  const response = await fetch(
    `/api/symbols?q=${symbolName}&problem=${context.problemNumber}&file=${context.file}`
  );
  return response.json();
}
```

**Challenge**: Transformer runs at build time, but we need runtime data.

**Solution**:
1. Extract symbol references at build time (mark which symbols exist in code)
2. Create client component that fetches tooltip data on hover/click
3. Use React 19 `use()` hook + Suspense for streaming

---

### 3. Create AgentProblemCard Server Component

**File**: `components/problems/AgentProblemCard.tsx` (new file)

**Purpose**: Replace MDX-based problem rendering with database queries

**Structure**:
```typescript
async function AgentProblemCard({ slug }: { slug: string }) {
  // Server-side data fetching
  const problem = await getProblemBySlug(slug);
  const solutions = await getSolutionsByProblem(problem.id);

  return (
    <div>
      <ProblemHeader problem={problem} />
      {solutions.map(solution => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          // Symbols loaded on-demand via client component
        />
      ))}
    </div>
  );
}
```

**Key features**:
- Stream code first (fast initial render)
- Load tooltips lazily (on hover/expand)
- Use React 19 Suspense boundaries

---

### 4. Update Agent.tsx

**File**: `app/problems/[slug]/agent/page.tsx` (or similar)

**Current**: Imports MDX files
**New**: Fetches from database

```typescript
// OLD
import ProblemMDX from '@/problems/1235-maximum-profit-in-job-scheduling.mdx';

// NEW
async function AgentPage({ params }: { params: { slug: string } }) {
  return <AgentProblemCard slug={params.slug} />;
}
```

---

### 5. Testing Plan

**Test scenarios**:

1. **Basic rendering**
   - Load problem page
   - Verify code displays
   - Check solution tabs work

2. **Tooltip functionality**
   - Hover over symbol
   - Verify tooltip fetches from API
   - Check tooltip content matches database

3. **Symbol queries**
   - Query `"dp"` with different contexts
   - Verify disambiguation works
   - Test fully qualified queries

4. **Performance**
   - Measure initial page load
   - Check tooltip fetch latency
   - Verify caching works

5. **Cross-referencing**
   - Reference symbol from notes page
   - Example: `1235:top_down.py:maximum_profit_in_job_scheduling.dp`
   - Verify tooltip works outside problem page

---

## 🎯 Next Immediate Steps

1. **Create API routes** (`/api/problems`, `/api/solutions`, `/api/symbols`)
2. **Build client-side tooltip component** (fetches from API on hover)
3. **Update code transformer** (mark symbols, defer tooltip loading)
4. **Create AgentProblemCard** (server component for rendering)
5. **Test with one problem** (1235-maximum-profit-in-job-scheduling)
6. **Iterate and expand**

---

## 📊 Current Database State

```
Problems:  95
Solutions: 124
Symbols:   263
```

**Sample data** (Problem 1235):
```
Title: Maximum Profit in Job Scheduling
Solutions: 3 (bottom_up.py, top_down.py, top_down_explicit.py)
Symbols: 5 (functions, variables, expressions)
```

**Sample symbols**:
- `1235:top_down.py:maximum_profit_in_job_scheduling` (function)
- `1235:top_down.py:maximum_profit_in_job_scheduling.memo` (variable)
- `1235:top_down.py:maximum_profit_in_job_scheduling.dp` (nested function)
- `1235:top_down.py:maximum_profit_in_job_scheduling.dp(i + 1)` (expression)

---

## 🔧 Technical Decisions Made

1. **Use `:` and `.` separators** (not just `:`) for better hierarchy
2. **Self-reference in symbols table** (parent_id for nested symbols)
3. **Nullable solution_id** (future: core algorithms without problems)
4. **JSONB metadata column** (flexible schema for extra data)
5. **Unique constraint on (problem_id, file_name)** (one file per problem)
6. **Context-based query resolution** (smart disambiguation)
7. **Lazy tooltip loading** (performance + scalability)

---

## 📝 Files Modified/Created

### Created:
- `lib/db/schema-problems.ts` (schema definition)
- `lib/db/queries/symbol-resolver.ts` (query parser)
- `lib/db/queries/agent-problems.ts` (database queries)
- `backend/scripts/problems/sync_problems_to_db.py` (data sync)
- `lib/db/check-schema.ts` (verification)
- `lib/db/check-data.ts` (verification)
- `lib/db/reset-db.ts` (utility)
- `drizzle/0004_clean_schema.sql` (migration)

### Modified:
- `package.json` (updated drizzle-orm to 0.44.7, drizzle-kit to 0.31.6)

### To Create:
- `app/api/problems/route.ts`
- `app/api/problems/[slug]/route.ts`
- `app/api/solutions/route.ts`
- `app/api/symbols/route.ts`
- `components/problems/AgentProblemCard.tsx`
- `components/mdx/code/TooltipSymbol.tsx` (client component)

### To Modify:
- `components/mdx/code/transformers/meta-tooltip.ts`
- `app/problems/[slug]/agent/page.tsx` (or wherever Agent.tsx lives)

---

## 🚀 Commands

```bash
# Sync problems to database
pnpm problems:sync-db

# Check database schema
pnpm tsx lib/db/check-schema.ts

# Check synced data
pnpm tsx lib/db/check-data.ts

# Reset database (drop all tables)
pnpm tsx lib/db/reset-db.ts

# Push schema changes
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

---

## 💡 Future Enhancements

1. **Full-text search** (PostgreSQL `tsvector` for symbol search)
2. **Symbol relationships** (use `parent_id` to build tree)
3. **Versioning** (track symbol changes over time)
4. **Analytics** (track which symbols are queried most)
5. **Caching layer** (Redis for hot symbols)
6. **GraphQL API** (more flexible than REST)
7. **Real-time updates** (WebSocket for live sync)
8. **Export/Import** (backup symbol data)

---

## 📖 Architecture Summary

**Old Flow**:
```
Python scripts → JSON files → MDX generation → Build time → Static pages
```

**New Flow**:
```
Python scripts → PostgreSQL → API routes → Runtime queries → Dynamic rendering
```

**Benefits**:
- ✅ Single source of truth (database)
- ✅ On-demand loading (faster initial render)
- ✅ Smart queries (context-based resolution)
- ✅ Scalable (can add millions of symbols)
- ✅ Flexible (easy to add new fields/features)
- ✅ Cross-referencing (query symbols from anywhere)

---

**Last updated**: 2025-11-09
**Status**: Database migration complete, API routes pending
