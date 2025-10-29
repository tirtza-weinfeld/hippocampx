# Database Migration for HippocampX Tooltip System

## Overview
Migrate from JSON-based static metadata to PostgreSQL database with Drizzle ORM, enabling dynamic rendering, better performance, and future AI capabilities.

---

## Critical Issues Identified

### 1. Performance Catastrophe
- **1.5MB JSON** bundled into every page with code blocks
- All tooltip content rendered upfront (thousands of hidden Popover components)
- Sequential async waterfall blocks rendering
- No lazy loading possible with current architecture

### 2. Maintenance Nightmare
- **5,454 lines of brittle Python** scripts
- Duplicate AST parsing logic across 6 different scripts
- Manual import resolution that frequently breaks
- No incremental updates - must regenerate everything

### 3. Architecture Dead-End
- Can't use Server Actions (JSX serialization issues)
- Can't render dynamic code snippets (requires pre-generated metadata)
- Can't support user contributions
- Blocks future AI learning features

### 4. Agent Pipeline Complexity
- 21 component files with scattered state
- Client-side filtering renders all problems (just hides them)
- No database queries = prop drilling everywhere
- Messy server/client boundaries

---

## Phase 1: Database Setup & Schema (Week 1)

### 1.1 Install Dependencies
```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

### 1.2 Create Database Schema
**File**: `lib/db/schema.ts`

Tables to create:
- `symbols` - Function/class/variable definitions with documentation
- `symbol_uses` - Where symbols are used (for tooltips)
- `expressions` - Complex expressions with explanations
- `problems` - Problem metadata (title, difficulty, topics)
- `solutions` - Solution code and explanations
- `comments_inline` - Inline comment annotations
- `tooltip_interactions` - Track user interactions (future AI)

#### Schema Example:
```typescript
// lib/db/schema.ts
export const symbols = pgTable('symbols', {
  id: text('id').primaryKey(),
  qname: text('qname').unique().notNull(),
  name: text('name').notNull(),
  kind: text('kind').notNull(), // 'function', 'class', 'variable', 'parameter'
  filePath: text('file_path').notNull(),
  definition: text('definition'),
  summary: text('summary'),
  intuition: text('intuition'),
  timeComplexity: text('time_complexity'),
  spaceComplexity: text('space_complexity'),
  code: text('code'),
  label: text('label'), // LSP-style signature
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const symbolUses = pgTable('symbol_uses', {
  id: serial('id').primaryKey(),
  symbolId: text('symbol_id').references(() => symbols.id),
  qname: text('qname').notNull(),
  filePath: text('file_path').notNull(),
  startLine: integer('start_line').notNull(),
  startCharacter: integer('start_character').notNull(),
  endLine: integer('end_line').notNull(),
  endCharacter: integer('end_character').notNull(),
});

export const expressions = pgTable('expressions', {
  id: serial('id').primaryKey(),
  qname: text('qname').notNull(),
  expressionText: text('expression_text').notNull(),
  summary: text('summary').notNull(),
  filePath: text('file_path').notNull(),
  startLine: integer('start_line').notNull(),
  startCharacter: integer('start_character').notNull(),
  endLine: integer('end_line').notNull(),
  endCharacter: integer('end_character').notNull(),
});

export const problems = pgTable('problems', {
  id: text('id').primaryKey(), // e.g., '37-sudoku-solver'
  number: integer('number'),
  title: text('title').notNull(),
  definition: text('definition'),
  leetcodeUrl: text('leetcode_url'),
  difficulty: text('difficulty'), // 'easy', 'medium', 'hard'
  topics: text('topics').array(), // Array of topic strings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const solutions = pgTable('solutions', {
  id: serial('id').primaryKey(),
  problemId: text('problem_id').references(() => problems.id),
  fileName: text('file_name').notNull(),
  code: text('code').notNull(),
  intuition: text('intuition'),
  timeComplexity: text('time_complexity'),
  spaceComplexity: text('space_complexity'),
  sortOrder: integer('sort_order').default(0),
});
```

### 1.3 Setup Database Connection
**File**: `lib/db/client.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

**File**: `.env.local`
```
DATABASE_URL=postgresql://user:password@localhost:5432/hippocampx
```

### 1.4 Run Initial Migration
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

---

## Phase 2: Data Migration (Week 1-2)

### 2.1 Create Migration Script
**File**: `scripts/migrate-json-to-db.ts`

```typescript
import { db } from '@/lib/db/client';
import { symbols, symbolUses, expressions, problems, solutions } from '@/lib/db/schema';
import symbolTagsJson from '@/lib/extracted-metadata/symbol_tags.json';
import usesJson from '@/lib/extracted-metadata/uses.json';
import expressionsJson from '@/lib/extracted-metadata/expressions.json';
import problemsJson from '@/lib/extracted-metadata/problems_metadata.json';

async function migrateSymbolTags() {
  console.log('Migrating symbol_tags.json...');

  const symbolsData = Object.entries(symbolTagsJson).map(([qname, data]) => ({
    id: generateId(qname),
    qname,
    name: data.name,
    kind: data.kind,
    filePath: data.file_path || '',
    definition: data.definition,
    summary: data.summary,
    intuition: data.intuition,
    timeComplexity: data.time_complexity,
    spaceComplexity: data.space_complexity,
    code: data.code,
    label: data.label,
  }));

  // Batch insert in chunks of 100
  for (let i = 0; i < symbolsData.length; i += 100) {
    const chunk = symbolsData.slice(i, i + 100);
    await db.insert(symbols).values(chunk);
  }

  console.log(`Migrated ${symbolsData.length} symbols`);
}

async function migrateUses() {
  console.log('Migrating uses.json...');

  const usesData = Object.entries(usesJson).flatMap(([filePath, fileUses]) =>
    fileUses.map(use => ({
      symbolId: generateId(use.qname),
      qname: use.qname,
      filePath,
      startLine: use.nameRange.start.line,
      startCharacter: use.nameRange.start.character,
      endLine: use.nameRange.end.line,
      endCharacter: use.nameRange.end.character,
    }))
  );

  // Batch insert
  for (let i = 0; i < usesData.length; i += 500) {
    const chunk = usesData.slice(i, i + 500);
    await db.insert(symbolUses).values(chunk);
  }

  console.log(`Migrated ${usesData.length} symbol uses`);
}

async function migrateExpressions() {
  console.log('Migrating expressions.json...');

  const expressionsData = Object.entries(expressionsJson).flatMap(([filePath, fileExpressions]) =>
    fileExpressions.map(expr => ({
      qname: expr.qname,
      expressionText: expr.qname.split('.').pop() || '',
      summary: '', // Will be populated from symbol_tags
      filePath,
      startLine: expr.nameRange.start.line,
      startCharacter: expr.nameRange.start.character,
      endLine: expr.nameRange.end.line,
      endCharacter: expr.nameRange.end.character,
    }))
  );

  for (let i = 0; i < expressionsData.length; i += 500) {
    const chunk = expressionsData.slice(i, i + 500);
    await db.insert(expressions).values(chunk);
  }

  console.log(`Migrated ${expressionsData.length} expressions`);
}

async function migrateProblems() {
  console.log('Migrating problems_metadata.json...');

  const problemsData = Object.entries(problemsJson.problems).map(([id, problem]) => ({
    id,
    number: parseInt(id.split('-')[0]) || null,
    title: problem.title || '',
    definition: problem.definition,
    leetcodeUrl: problem.leetcode,
    difficulty: problem.difficulty,
    topics: problem.topics || [],
  }));

  await db.insert(problems).values(problemsData);

  // Migrate solutions
  for (const [problemId, problem] of Object.entries(problemsJson.problems)) {
    const solutionsData = Object.entries(problem.solutions).map(([fileName, solution], index) => ({
      problemId,
      fileName,
      code: solution.code,
      intuition: solution.intuition,
      timeComplexity: solution.time_complexity,
      spaceComplexity: solution.space_complexity,
      sortOrder: index,
    }));

    if (solutionsData.length > 0) {
      await db.insert(solutions).values(solutionsData);
    }
  }

  console.log(`Migrated ${problemsData.length} problems`);
}

function generateId(qname: string): string {
  return qname.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
}

async function main() {
  await migrateSymbolTags();
  await migrateUses();
  await migrateExpressions();
  await migrateProblems();
  console.log('Migration complete!');
}

main();
```

### 2.2 Validate Migration
```bash
pnpm tsx scripts/migrate-json-to-db.ts

# Verify
psql $DATABASE_URL -c "SELECT COUNT(*) FROM symbols;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM symbol_uses;"
```

---

## Phase 3: API Layer (Week 2)

### 3.1 Create Tooltip API Routes

**File**: `app/api/tooltips/[symbolId]/route.ts`
```typescript
import { db } from '@/lib/db/client';
import { symbols } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { symbolId: string } }
) {
  const symbol = await db.query.symbols.findFirst({
    where: eq(symbols.id, params.symbolId)
  });

  if (!symbol) {
    return Response.json({ error: 'Symbol not found' }, { status: 404 });
  }

  return Response.json(symbol);
}
```

**File**: `app/api/tooltips/batch/route.ts`
```typescript
import { db } from '@/lib/db/client';
import { symbols } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';

export async function POST(request: Request) {
  const { symbolIds } = await request.json();

  const results = await db.query.symbols.findMany({
    where: inArray(symbols.id, symbolIds)
  });

  return Response.json(results);
}
```

### 3.2 Create Server Actions
**File**: `lib/actions/tooltips.ts`
```typescript
'use server'

import { db } from '@/lib/db/client';
import { symbols, symbolUses } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { cache } from 'react';

export const getTooltipByQname = cache(async (qname: string) => {
  return await db.query.symbols.findFirst({
    where: eq(symbols.qname, qname)
  });
});

export const getTooltipsByFile = cache(async (filePath: string) => {
  const uses = await db.query.symbolUses.findMany({
    where: eq(symbolUses.filePath, filePath),
    with: {
      symbol: true
    }
  });

  return uses;
});

export const prefetchTooltips = cache(async (qnames: string[]) => {
  return await db.query.symbols.findMany({
    where: inArray(symbols.qname, qnames)
  });
});
```

---

## Phase 4: Tooltip Rendering Refactor (Week 2-3)

### 4.1 Update Code Highlighter
**File**: `components/mdx/code/code-highlighter.ts`

```typescript
'use server'
import { cache } from 'react'
import { codeToHast } from 'shiki'
import { transformerCodeTooltipSource } from './transformers/meta-tooltip';
import { getTooltipsByFile } from '@/lib/actions/tooltips';

// REMOVE these imports - save 1.5MB
// import usesData from '@/lib/extracted-metadata/uses.json';
// import expressionsData from '@/lib/extracted-metadata/expressions.json';
// import symbolTags from '@/lib/extracted-metadata/symbol_tags.json';

const highlightCode = cache(async function highlightCode(
  code: string,
  lang: string,
  meta?: string
) {
  // Extract source file from meta
  const sourceMatch = meta?.match(/source=([^\s]+)/);
  const sourceFile = sourceMatch?.[1]?.split(':')[0];

  // Query only needed symbols from database
  let symbolData = {};
  if (sourceFile) {
    const fileSymbols = await getTooltipsByFile(sourceFile);
    symbolData = {
      [sourceFile]: fileSymbols
    };
  }

  const hast = await codeToHast(code, {
    lang,
    meta: { __raw: meta },
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    transformers: [
      transformerCodeTooltipSource(symbolData), // Use DB data instead of JSON
      // ... other transformers
    ],
  });

  return hastToJSX(hast);
});

export default highlightCode;
```

### 4.2 Update Code Block Component
**File**: `components/mdx/code/code-block.tsx`

```typescript
import { getTooltipsByFile } from '@/lib/actions/tooltips';
import highlightCode from './code-highlighter';
import { CodeBlockClient } from './code-block-client';

export default async function CodeBlock({ className, meta, children: code }: CodeBlockProps) {
  // Extract source from meta
  const sourceMatch = meta?.match(/source=([^\s]+)/);
  const sourceFile = sourceMatch?.[1]?.split(':')[0];

  // Query only symbols for this file
  const symbolIds = sourceFile ? await getSymbolIdsForFile(sourceFile) : [];

  const highlightedCode = await highlightCode(
    code as string,
    className.replace('language-', ''),
    meta as string
  );

  return (
    <CodeBlockClient
      code={code as string}
      highlightedCode={highlightedCode}
      symbolIds={symbolIds} // Pass IDs instead of full data
    />
  );
}

async function getSymbolIdsForFile(sourceFile: string) {
  const symbols = await getTooltipsByFile(sourceFile);
  return symbols.map(s => s.id);
}
```

### 4.3 Create Client Tooltip Component
**File**: `components/mdx/code/tooltip-client.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function TooltipSymbol({
  symbolId,
  children
}: {
  symbolId: string;
  children: React.ReactNode;
}) {
  const [tooltipData, setTooltipData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch on hover
  const handleHover = async () => {
    if (!tooltipData) {
      const response = await fetch(`/api/tooltips/${symbolId}`);
      const data = await response.json();
      setTooltipData(data);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={handleHover}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent>
        {tooltipData ? (
          <TooltipContent data={tooltipData} />
        ) : (
          <div>Loading...</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

---

## Phase 5: TypeScript Metadata Extraction (Week 3-4)

### 5.1 Create TypeScript Extractor
**File**: `scripts/extract/extract-metadata.ts`

```typescript
import { Project } from 'ts-morph';
import { db } from '@/lib/db/client';
import { symbols, symbolUses } from '@/lib/db/schema';
import { globby } from 'globby';

async function extractFile(filePath: string) {
  console.log(`Extracting ${filePath}...`);

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // Extract symbols
  const functions = sourceFile.getFunctions();
  const symbolsData = functions.map(fn => ({
    id: generateId(fn.getName()!),
    qname: buildQualifiedName(fn),
    name: fn.getName()!,
    kind: 'function',
    filePath,
    definition: fn.getText(),
    summary: extractDocstring(fn),
    code: fn.getBody()?.getText() || '',
  }));

  // Extract uses
  const usesData = extractUsesFromFile(sourceFile, filePath);

  // Batch insert
  await db.transaction(async (tx) => {
    if (symbolsData.length > 0) {
      await tx.insert(symbols).values(symbolsData).onConflictDoUpdate({
        target: symbols.qname,
        set: {
          summary: sql`EXCLUDED.summary`,
          code: sql`EXCLUDED.code`,
          updatedAt: new Date(),
        }
      });
    }

    if (usesData.length > 0) {
      // Delete old uses for this file
      await tx.delete(symbolUses).where(eq(symbolUses.filePath, filePath));
      await tx.insert(symbolUses).values(usesData);
    }
  });

  console.log(`Extracted ${symbolsData.length} symbols, ${usesData.length} uses`);
}

async function extractAll() {
  const files = await globby('backend/algorithms/**/*.py');

  // Process in parallel (10 at a time)
  const chunks = chunk(files, 10);
  for (const fileChunk of chunks) {
    await Promise.all(fileChunk.map(extractFile));
  }
}

extractAll();
```

### 5.2 Setup File Watcher
**File**: `scripts/extract/watch-and-extract.ts`

```typescript
import chokidar from 'chokidar';
import { extractFile } from './extract-metadata';

const watcher = chokidar.watch('backend/algorithms/**/*.py', {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', path => extractFile(path))
  .on('change', path => extractFile(path))
  .on('unlink', async path => {
    // Delete from database
    await db.delete(symbols).where(eq(symbols.filePath, path));
  });

console.log('Watching for changes...');
```

### 5.3 Update package.json Scripts
```json
{
  "scripts": {
    "db:migrate": "drizzle-kit generate && drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "problems:migrate": "tsx scripts/migrate-json-to-db.ts",
    "problems:extract": "tsx scripts/extract/extract-metadata.ts",
    "problems:watch": "tsx scripts/extract/watch-and-extract.ts",
    "problems:generate-mdx": "tsx scripts/generate-problem-mdx.ts"
  }
}
```

---

## Phase 6: Agent System Simplification (Week 4)

### 6.1 Consolidate Agent Components
Reduce 21 files to:

**File**: `components/agent/agent-layout.tsx`
```typescript
import { db } from '@/lib/db/client';
import { problems } from '@/lib/db/schema';
import { eq, like, and } from 'drizzle-orm';

export default async function AgentLayout({
  searchParams
}: {
  searchParams: { difficulty?: string; topic?: string; search?: string }
}) {
  // Server-side filtering
  const filters = [];
  if (searchParams.difficulty) {
    filters.push(eq(problems.difficulty, searchParams.difficulty));
  }
  if (searchParams.topic) {
    filters.push(sql`${problems.topics} @> ARRAY[${searchParams.topic}]`);
  }
  if (searchParams.search) {
    filters.push(like(problems.title, `%${searchParams.search}%`));
  }

  const filteredProblems = await db.query.problems.findMany({
    where: filters.length > 0 ? and(...filters) : undefined,
    with: {
      solutions: true
    },
    limit: 50
  });

  return (
    <div>
      <AgentFilters />
      <div>
        {filteredProblems.map(problem => (
          <AgentProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
}
```

**File**: `components/agent/agent-filters.tsx`
```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation';

export function AgentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <select onChange={(e) => updateFilter('difficulty', e.target.value)}>
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      {/* More filters */}
    </div>
  );
}
```

### 6.2 Remove Client-Side Filtering
Delete:
- Complex useMemo filtering logic
- Client-side sorting
- Hidden problem rendering

---

## Phase 7: MDX Generation Updates (Week 4)

### 7.1 Update MDX Generator
**File**: `scripts/generate-problem-mdx.ts`

```typescript
import { db } from '@/lib/db/client';
import { problems, solutions } from '@/lib/db/schema';

async function generateMDX() {
  // Query database instead of JSON
  const allProblems = await db.query.problems.findMany({
    with: {
      solutions: true
    }
  });

  for (const problem of allProblems) {
    const mdxContent = generateMDXContent(problem);
    await fs.writeFile(
      `components/problems/tutorials/${problem.id}.mdx`,
      mdxContent
    );
  }
}
```

---

## Phase 8: Testing & Optimization (Week 5)

### 8.1 Performance Testing
```bash
# Measure bundle size
pnpm build --analyze

# Test tooltip load times
# Before: 1.5MB JSON load + parse
# After: ~2KB API call per tooltip

# Profile database queries
pnpm db:studio
```

### 8.2 Add Database Indexes
```sql
CREATE INDEX idx_symbol_uses_file ON symbol_uses(file_path);
CREATE INDEX idx_symbol_uses_symbol ON symbol_uses(symbol_id);
CREATE INDEX idx_symbols_qname ON symbols(qname);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_topics ON problems USING GIN(topics);
```

---

## Phase 9: Cleanup (Week 5)

### 9.1 Remove Old System
Delete:
- `backend/scripts/problems/*.py` (5,454 lines)
- `lib/extracted-metadata/*.json` (1.5MB)
- Old transformer logic that used JSON

### 9.2 Update Documentation
Update README with new workflow:
```markdown
## Development Workflow

1. Edit Python files in `backend/algorithms/`
2. Run `pnpm problems:extract` to sync to database
3. Run `pnpm problems:generate-mdx` to update MDX files
4. Changes are live immediately (no rebuild needed)

## Adding New Problems

1. Create problem folder in `backend/algorithms/problems/`
2. Add `__init__.py` with docstring
3. Add solution files
4. Run `pnpm problems:extract`
5. MDX generated automatically
```

---

## Expected Outcomes

### Performance Improvements
- **Bundle size**: 1.5MB to 15KB (99% reduction)
- **Initial page load**: 80% faster
- **Tooltip render**: Lazy loaded (0ms until hover)
- **Build time**: 70% faster (parallel extraction)
- **First contentful paint**: Improved by 2-3 seconds

### Developer Experience
- **Incremental updates**: Edit Python -> auto-sync to DB
- **No rebuild needed**: Changes live immediately
- **Better debugging**: Query database directly with SQL
- **Type safety**: Full Drizzle ORM TypeScript types
- **Simpler codebase**: 5,454 lines Python -> ~500 lines TypeScript

### Future Capabilities Unlocked
-  User contributions (community tooltips)
-  AI learning from tooltip interactions
-  A/B testing explanations
-  Personalized content based on user level
-  Real-time analytics on helpful tooltips
-  Dynamic code rendering from any source
-  Progressive enhancement (works without JS)
-  Server Actions for interactive features

---

## Risks & Mitigations

### Risk: Database adds latency
**Impact**: Medium
**Mitigation**:
- React `cache()` for server-side memoization
- Prefetch visible tooltips via Intersection Observer
- Add Redis caching layer if needed
- Database on same region as Next.js deployment

### Risk: Migration bugs
**Impact**: High
**Mitigation**:
- Validate against JSON baseline
- Extensive testing with 100+ problems
- Keep JSON files until migration fully validated
- Gradual rollout (feature flag)

### Risk: Complexity increase
**Impact**: Low
**Mitigation**:
- Actually reduces complexity (removes 5k lines Python)
- Drizzle ORM handles query complexity
- Better separation of concerns
- Standard patterns (REST API + Server Actions)

### Risk: Database hosting costs
**Impact**: Low
**Mitigation**:
- Start with free tier (Neon, Supabase, Vercel Postgres)
- Current data size: ~50MB (well within free tier)
- Can scale to paid tier later if needed

---

## Timeline Summary

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Database setup | Schema, migration script, initial data import |
| 2 | API layer | Tooltip routes, Server Actions, query optimization |
| 3 | Rendering refactor | Remove JSON imports, lazy tooltip loading |
| 4 | TypeScript extraction | Replace Python scripts, file watcher |
| 5 | Testing & cleanup | Performance testing, remove old code |

**Total**: 5 weeks to complete

---

## Hours Breakdown

### Total Estimated Hours: 120-160 hours

| Phase | Week | Task | Hours |
|-------|------|------|-------|
| **Phase 1** | Week 1 | Database setup & schema | 16-20h |
| **Phase 2** | Week 1-2 | Data migration script & validation | 16-24h |
| **Phase 3** | Week 2 | API layer (routes + Server Actions) | 12-16h |
| **Phase 4** | Week 2-3 | Tooltip rendering refactor | 24-32h |
| **Phase 5** | Week 3-4 | TypeScript metadata extraction | 32-40h |
| **Phase 6** | Week 4 | Agent system simplification | 12-16h |
| **Phase 7** | Week 4 | MDX generation updates | 8-12h |
| **Phase 8** | Week 5 | Testing & optimization | 16-24h |
| **Phase 9** | Week 5 | Cleanup & documentation | 8-12h |

### Breakdown by Activity Type

- **Backend/Database work**: 40-50 hours
  - Schema design, migrations, queries, indexes

- **Frontend refactoring**: 40-50 hours
  - Code highlighter, tooltip components, lazy loading

- **Extraction pipeline**: 30-40 hours
  - TypeScript extractor, file watcher, replacing Python scripts

- **Testing & validation**: 20-30 hours
  - Performance testing, migration validation, bug fixes

- **Documentation & cleanup**: 10-15 hours

### Calendar Time Based on Availability

- **Full-time (40h/week)**: 3-4 weeks
- **Part-time (20h/week)**: 6-8 weeks
- **Nights/weekends (10h/week)**: 12-16 weeks

### Critical Path (Minimum Viable)

If you want core performance benefits ASAP:
- **Phases 1-4 only**: 70-90 hours
- **Timeline**: 2-3 weeks full-time
- **Benefits**: 99% bundle reduction, lazy tooltips, Server Actions
- **Note**: Can keep Python scripts temporarily, replace in Phase 5 later migration

---

## Success Metrics

### Before Migration
- Bundle size: 1.5MB metadata
- Page load: ~3-4 seconds
- Build time: ~30 seconds
- Tooltip render: All upfront (DOM bloat)
- Metadata updates: Requires rebuild + redeploy
- Python scripts: 5,454 lines

### After Migration
- Bundle size: ~15KB (symbol IDs only)
- Page load: ~0.5-1 second
- Build time: ~10 seconds
- Tooltip render: Lazy loaded on hover
- Metadata updates: Real-time (no rebuild)
- TypeScript extractor: ~500 lines

### Percentage Improvements
- Bundle size: **-99%**
- Page load: **-80%**
- Build time: **-70%**
- Code complexity: **-90%**
- Developer iteration: **10x faster**

---

## Next Steps

1. **Review this plan** with team
2. **Setup local database** (PostgreSQL via Docker)
3. **Create database schema** (Phase 1)
4. **Run migration script** (Phase 2)
5. **Start Phase 3** once data validated

---

## Questions?

- **Q: Can we keep JSON for backward compatibility?**
  A: Yes, keep JSON files until migration fully validated (feature flag)

- **Q: What if a problem has no metadata in DB?**
  A: Graceful fallback - render code without tooltips

- **Q: How to handle local development without DB?**
  A: Docker Compose for local Postgres, or use Drizzle's SQLite adapter

- **Q: What about SEO with lazy-loaded tooltips?**
  A: Tooltips are progressive enhancement - base content still server-rendered

---

## References

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React cache()](https://react.dev/reference/react/cache)
- [Shiki Transformers](https://shiki.matsu.io/guide/transformers)
