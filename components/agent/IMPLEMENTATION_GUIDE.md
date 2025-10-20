# Agent Architecture - Implementation Guide

## Running the Generation Script

### 1. Generate Agent Structure

```bash
# From project root
pnpm tsx scripts/generate-agent-mdx.ts
```

This will:
- ✅ Read `lib/extracted-metadata/problems_metadata.json`
- ✅ Generate `lib/extracted-metadata/agent-metadata.json` (filter data)
- ✅ Create `components/problems/agent/{problem-id}/` folders
- ✅ Generate MDX section files per solution
- ✅ Generate problem `index.tsx` for each problem
- ✅ Generate `components/problems/agent/Agent.tsx` (main page)

### 2. Expected Output Structure

```
components/problems/agent/
├── Agent.tsx                          # Main page (generated)
├── 347-top-k-frequent-elements/
│   ├── index.tsx                      # Problem component (generated)
│   └── sections/
│       ├── definition.mdx             # Shared across all files
│       ├── codeSnippet-heap.mdx       # Per file
│       ├── codeSnippet-heap-nlargest.mdx
│       ├── intuition-heap.mdx         # Optional per file
│       └── timeComplexity-heap.mdx    # Optional per file
└── 215-kth-largest/
    └── ...
```

### 3. Generated Code Structure

#### Agent.tsx (Main Page - Server Component)
```tsx
import { AgentProblemsView } from '@/components/agent'
import agentMetadata from '@/lib/extracted-metadata/agent-metadata.json'

export default function Agent() {
  return (
    <AgentProblemsView metadata={agentMetadata}>
      <Problem347TopKFrequentElements />
      <Problem215KthLargest />
      {/* ... all problems */}
    </AgentProblemsView>
  )
}
```

#### Problem Index (Per Problem - Server Component)
```tsx
import { lazy } from 'react'
import { AgentCard, AgentHeader, FileTabs, SectionTabs, AgentSection } from '@/components/agent'
import { Activity } from 'react'

const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetHeap = lazy(() => import('./sections/codeSnippet-heap.mdx'))

export default function Problem347TopKFrequentElements() {
  return (
    <AgentCard
      id="347-top-k-frequent-elements"
      title="Top K Frequent Elements"
      difficulty="medium"
      topics={["array", "hash-table", "heap"]}
      solutionFiles={["heap.py", "bucket.py"]}
      defaultFile="heap.py"
    >
      {({ isExpanded, setExpanded, activeFile, setActiveFile, activeSection, setActiveSection, solutionFiles, title }) => (
        <>
          <AgentHeader
            title={title}
            isExpanded={isExpanded}
            onToggle={() => setExpanded(!isExpanded)}
          />

          <Activity mode={isExpanded ? 'visible' : 'hidden'}>
            <FileTabs
              files={solutionFiles}
              activeFile={activeFile}
              onFileChange={setActiveFile}
            />

            <SectionTabs
              sections={["definition", "codeSnippet", "intuition"]}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            <AgentSection section="definition" activeFile={activeFile} activeSection={activeSection}>
              <Definition />
            </AgentSection>

            <AgentSection section="codeSnippet" file="heap.py" activeFile={activeFile} activeSection={activeSection}>
              <CodeSnippetHeap />
            </AgentSection>
          </Activity>
        </>
      )}
    </AgentCard>
  )
}
```

## Component Architecture

### Zero Context Pattern
- ❌ **No Context API** - All state via props
- ✅ **Local state in AgentCard** - isExpanded, activeFile, activeSection
- ✅ **Render prop pattern** - Card passes state to children
- ✅ **Activity for performance** - Visibility without unmounting

### State Flow
```
AgentProblemsView (client)
  ├─ Manages: filters, sorting
  ├─ Calculates: visibleIds, orderMap
  └─ Wraps each child with Activity (visibility)
      ↓
AgentCard (client wrapper)
  ├─ Manages: isExpanded, activeFile, activeSection
  ├─ Passes state via render prop
  └─ Contains:
      ├─ AgentHeader (client) - collapse button
      ├─ FileTabs (client) - file selection
      ├─ SectionTabs (client) - section selection
      └─ AgentSection (server) - wraps lazy MDX
```

### Performance Optimizations
1. **Build-time metadata** - JSON imported statically, zero async
2. **Activity component** - Cards stay mounted when filtered, instant show/hide
3. **Lazy MDX** - Only load sections when viewed
4. **useMemo** - Filtering/sorting cached, minimal re-renders
5. **CSS order** - Sorting via CSS property, no DOM reordering

## Customization

### Adding New Section Types

1. **Update TypeScript types:**
```typescript
// In generate-agent-mdx.ts
type SectionType = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyVariables' | 'keyExpressions' | 'YOUR_NEW_SECTION'
```

2. **Add section detection:**
```typescript
// In generateProblemIndex function
if (solution.your_new_field) {
  availableSections.add('YOUR_NEW_SECTION')
}
```

3. **Add MDX generation:**
```typescript
// In generateProblemStructure function
if (solution.your_new_field) {
  const path = path.join(sectionsDir, `YOUR_NEW_SECTION-${fileBaseName}.mdx`)
  await fs.writeFile(path, solution.your_new_field, 'utf-8')
}
```

4. **Add to component generation:**
```typescript
// In generateProblemIndex function
if (solution.your_new_field) {
  const componentName = addLazyImport('YOUR_NEW_SECTION', fileName)
  sections.push(`        <AgentSection section="YOUR_NEW_SECTION" file="${fileName}" activeFile={activeFile} activeSection={activeSection}>
          <${componentName} />
        </AgentSection>`)
}
```

5. **Update section labels:**
```typescript
// In agent-section-tab.tsx
const SECTION_LABELS: Record<SectionType, string> = {
  // ... existing
  YOUR_NEW_SECTION: 'Your Label'
}
```

### Modifying Filter Behavior

Edit `agent-problems-view.tsx`:

```typescript
// Add new filter field
type FilterState = {
  search: string
  difficulty: "all" | "easy" | "medium" | "hard"
  topic: string
  YOUR_NEW_FILTER: string // Add here
  sort: "number" | "difficulty" | "alpha" | "date-created" | "date-updated"
  order: "asc" | "desc"
}

// Add filter logic
const filtered = metadata.filter(m => {
  // ... existing filters

  // Add your filter
  if (filters.YOUR_NEW_FILTER !== "all" && !m.yourField.includes(filters.YOUR_NEW_FILTER)) {
    return false
  }

  return true
})
```

Then update `agent-filter-header.tsx` to add UI controls.

## Troubleshooting

### Script fails with "Cannot find problems_metadata.json"
- Ensure `lib/extracted-metadata/problems_metadata.json` exists
- Run the extraction script first if needed

### Generated components have import errors
- Check that all component names match exports in `components/agent/index.ts`
- Verify Activity is imported from 'react' (React 19.2+)

### Filtering not working
- Verify `agent-metadata.json` was generated correctly
- Check that problem IDs match between metadata and generated components
- Ensure AgentProblemsView wraps children array correctly

### Sections not showing
- Verify MDX files exist in `sections/` folder
- Check that section type matches between component and AgentSection wrapper
- Ensure activeFile/activeSection props are passed correctly

## Testing

```bash
# 1. Generate structure
pnpm tsx scripts/generate-agent-mdx.ts

# 2. Start dev server
pnpm dev

# 3. Navigate to /problems/agent
# Test:
# - Cards collapse/expand
# - File tabs switch content
# - Section tabs switch content
# - Search filters instantly
# - Difficulty/topic dropdowns work
# - Sorting changes order
```

## Next Steps

1. ✅ Run generation script
2. ✅ Test in browser
3. ✅ Customize styling if needed
4. ✅ Add more section types if needed
5. ✅ Deploy
