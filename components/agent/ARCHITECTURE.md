# Agent Architecture - Requirements & Design

## What We're Building

An interactive problem exploration interface where each LeetCode problem is displayed as a card. Each problem contains:

1. **Header**: Problem title
2. **Files Button Group**: Select between different solution implementations
3. **Sections Button Group**: Navigate between content types (definition, code snippet, intuition, etc.)
4. **Content Display**: Shows the selected section for the selected file

All cards are always visible and expanded.

---

## Problem Structure

### Each Problem Has:

- **Multiple solution files**: Different implementations (e.g., `heap.py`, `heap-nlargest.py`, `sort-frequency-bucketing.py`)
- **Multiple sections**: Different content types that explain the solution

### Section Types:

1. **definition** - Problem statement and requirements (exists for ALL files)
2. **codeSnippet** - The actual solution code (file-specific)
3. **intuition** - Explanation of the approach (file-specific)
4. **timeComplexity** - Big O analysis (file-specific)
5. **keyExpressions** - Important patterns/concepts (file-specific)

---

## Content Organization Rules

### Universal Content:
- **definition**: Every problem has ONE definition section that applies to ALL files
  - When viewing ANY file, the same definition is shown
  - This is the problem statement from LeetCode

### File-Specific Content:
- **codeSnippet**: Each file has its own code
  - `codeSnippet-heap.mdx` for `heap.py`
  - `codeSnippet-heap-nlargest.mdx` for `heap-nlargest.py`

- **intuition**: Each file MAY have its own explanation
  - `intuition-heap.mdx` for `heap.py`
  - `intuition-heap-nlargest.mdx` for `heap-nlargest.py`
  - Some files might not have intuition section

- **timeComplexity**: Each file MAY have its own complexity analysis
  - `timeComplexity-heap.mdx` for `heap.py`
  - Some files might share complexity analysis

- **keyExpressions**: Each file MAY have its own key patterns
  - Some files might not have this section

---

## UI Behavior

### Initial State:
- Page shows a list of problem cards
- All cards are visible with full content
- Each card shows:
  - Header with problem title
  - Files button group
  - Sections button group
  - Content area displaying first section of first file by default

### File Selection:
- User clicks a file button (e.g., `heap-nlargest.py`)
- Content updates to show the current section for that file
- If the section doesn't exist for this file, show "Not available" or hide

### Section Selection:
- User clicks a section button (e.g., `intuition`)
- Content updates to show that section for the current file
- If section doesn't exist for current file, show "Not available" or hide

### Example Flow:
1. User views "Top K Frequent Elements" card
2. Sees: Files: [`heap.py`, `heap-nlargest.py`, `sort-frequency-bucketing.py`]
3. Sees: Sections: [`definition`, `codeSnippet`, `intuition`, `timeComplexity`]
4. Default view: `heap.py` + `definition` section
5. User clicks `codeSnippet` → Shows code from `heap.py`
6. User clicks `heap-nlargest.py` → Shows code from `heap-nlargest.py`
7. User clicks `intuition` → Shows intuition for `heap-nlargest.py` (if exists)

---

## Content Availability Matrix

For a problem with 3 files, content might look like:

```
Section          | heap.py | heap-nlargest.py | sort-frequency-bucketing.py
-----------------|---------|------------------|----------------------------
definition       | ✓       | ✓                | ✓                (shared across all)
codeSnippet      | ✓       | ✓                | ✓                (each file has code)
intuition        | ✓       | ✓                | ✗                (third file might not have it)
timeComplexity   | ✓       | ✗                | ✗                (only first file has it)
keyExpressions   | ✓       | ✗                | ✗                (only first file has it)
```

### Key Points:
- **definition is ALWAYS available** for every file (it's the same content)
- **codeSnippet is ALWAYS available** for every file (every file has code)
- **Other sections are OPTIONAL** and may not exist for all files
- A section might exist for one file but not another
- Empty states need to be handled gracefully

---

## File Storage Structure

```
components/problems/agent/
├── 347-top-k-frequent-elements/
│   ├── sections/
│   │   ├── definition.mdx                      # Shared across all files
│   │   ├── codeSnippet-heap.mdx               # For heap.py
│   │   ├── codeSnippet-heap-nlargest.mdx      # For heap-nlargest.py
│   │   ├── codeSnippet-sort-frequency-bucketing.mdx
│   │   ├── intuition-heap.mdx                 # Only for heap.py
│   │   ├── intuition-heap-nlargest.mdx        # Only for heap-nlargest.py
│   │   ├── timeComplexity-heap.mdx            # Only for heap.py
│   │   └── keyExpressions-heap.mdx            # Only for heap.py
│   └── index.tsx
│
├── 215-kth-largest/
│   ├── sections/
│   │   ├── definition.mdx
│   │   ├── codeSnippet-heap.mdx
│   │   └── timeComplexity-heap.mdx
│   └── index.tsx
│
└── page.tsx
```

**Naming convention:** `{sectionType}-{filename-without-extension}.mdx`

---

## Data Requirements & Usage

### Problem Metadata:
```ts
{
  id: 347,
  title: "Top K Frequent Elements",
  difficulty: "medium",
  files: ["heap.py", "heap-nlargest.py", "sort-frequency-bucketing.py"],
  sections: ["definition", "codeSnippet", "intuition", "timeComplexity", "keyExpressions"]
}
```

**Used by:**
- Generation script to create problem components
- Problem component (embedded/hardcoded, not fetched)
- Card wrapper to initialize default file/section state
- Files/Sections button groups to render buttons

### Section Availability Map:
```ts
{
  "heap.py": ["definition", "codeSnippet", "intuition", "timeComplexity", "keyExpressions"],
  "heap-nlargest.py": ["definition", "codeSnippet", "intuition"],
  "sort-frequency-bucketing.py": ["definition", "codeSnippet"]
}
```

**Used by:**
- Generation script to create lazy imports
- Problem component to conditionally render Section wrappers
- Section components to determine if content exists

**Where it lives:** Embedded directly in generated problem component (no JSON file needed)

---

## State Management

### State Location: Client Wrapper Component

```tsx
"use client"

function ProblemCard({
  files,
  sections,
  sectionMap,
  children
}: {
  files: string[]
  sections: string[]
  sectionMap: Record<string, string[]>
  children: ReactNode
}) {
  const [activeFile, setActiveFile] = useState(files[0])
  const [activeSection, setActiveSection] = useState('definition')

  return (
    <div>
      {/* Pass state down to children via props/context-less pattern */}
      {children}
    </div>
  )
}
```

### State Flow (No Context):

**Option 1: Props injection via cloneElement**
- Card clones children and injects `activeFile`, `activeSection`
- Section components receive these as props to determine visibility

**Option 2: Explicit props**
- Card passes state to specific child components
- Clearer but more verbose

**Option 3: URL params (optional enhancement)**
- State synced to URL: `/problems/agent?file=heap.py&section=codeSnippet`
- Enables deep linking and back/forward navigation

---

## Loading Strategy: Instant Header + Streaming Content

### Phase 1: Instant (0ms)
```tsx
// Problem347 component (SERVER) renders immediately
<ProblemCard files={[...]} sections={[...]}>
  <Header347 />  {/* Hardcoded title/difficulty - instant */}
</ProblemCard>
```

**What users see:** Card header with problem title

### Phase 2: Fast (< 50ms)
```tsx
<ProblemCard>
  <Header347 />
  <Files347 />      {/* Hardcoded file list - fast */}
  <Sections347 />   {/* Hardcoded section list - fast */}
</ProblemCard>
```

**What users see:** Header + button groups appear

### Phase 3: Streaming (50-200ms per section)
```tsx
<ProblemCard>
  <Header347 />
  <Files347 />
  <Sections347 />

  {/* Each Suspense boundary streams independently */}
  <Suspense fallback={<Skeleton />}>
    <SectionWrapper section="definition" file="heap.py">
      <DefinitionMdx />  {/* Lazy loaded */}
    </SectionWrapper>
  </Suspense>

  <Suspense fallback={<Skeleton />}>
    <SectionWrapper section="codeSnippet" file="heap.py">
      <CodeSnippetHeapMdx />  {/* Lazy loaded */}
    </SectionWrapper>
  </Suspense>
</ProblemCard>
```

**What users see:** Content streams in section by section

### Key Benefits:
- **Headers appear instantly** (synchronous, hardcoded)
- **Button groups appear fast** (synchronous, hardcoded arrays)
- **Content streams progressively** (async MDX imports)
- **No blocking waterfalls** (each Suspense boundary independent)
- **Perceived performance** (users see structure immediately, content fills in)

---

## User Experience Goals

1. **Fast Initial Load**: Show all cards with minimal loading states
2. **Lazy Loading**: Load MDX content on-demand via Suspense
3. **Smooth Transitions**: No jarring content shifts when switching files/sections
4. **Clear Availability**: Users should know which sections are available for current file
5. **Graceful Degradation**: Handle missing sections elegantly
6. **State Preservation**: Keep file/section selection as user navigates

---

## Expected User Patterns

### Pattern 1: Explore one solution deeply
1. Navigate to a problem card
2. Keep `heap.py` selected
3. Click through sections: `definition` → `codeSnippet` → `intuition` → `timeComplexity`

### Pattern 2: Compare solutions
1. Navigate to a problem card
2. Select `codeSnippet` section
3. Click through files: `heap.py` → `heap-nlargest.py` → `sort-frequency-bucketing.py`
4. Compare code implementations

### Pattern 3: Quick reference
1. Navigate to a problem card
2. Go straight to `definition` to read problem statement
3. Switch to `codeSnippet` to see the implementation

---

## Technical Constraints

1. **No Context API**: Use props/children composition pattern
2. **Server Components Default**: Only add "use client" when necessary
3. **Lazy Loading**: MDX sections load on-demand via Suspense
4. **Type Safety**: Full TypeScript coverage
5. **React 19**: Use latest patterns (no forwardRef, etc.)
6. **Declarative Only**: Function declarations, no imperative code

---

## Success Criteria

- [ ] Each problem displays as a card with header
- [ ] Files button group shows all available solution files
- [ ] Sections button group shows all available section types
- [ ] Clicking file button updates content to that file
- [ ] Clicking section button updates content to that section
- [ ] Definition section is available for all files
- [ ] Missing sections are handled gracefully (hidden or "not available")
- [ ] MDX content loads lazily via Suspense boundaries
- [ ] Fast initial page load
- [ ] State persists as user navigates between files and sections
