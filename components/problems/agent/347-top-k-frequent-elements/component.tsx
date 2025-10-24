import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetHeap = lazy(() => import('./sections/codeSnippet-heap.mdx'))
const TimeComplexityHeap = lazy(() => import('./sections/timeComplexity-heap.mdx'))
const CodeSnippetSortFrequencyBucketing = lazy(() => import('./sections/codeSnippet-sort-frequency-bucketing.mdx'))
const TimeComplexitySortFrequencyBucketing = lazy(() => import('./sections/timeComplexity-sort-frequency-bucketing.mdx'))
const CodeSnippetHeapNlargets = lazy(() => import('./sections/codeSnippet-heap-nlargets.mdx'))
const TimeComplexityHeapNlargets = lazy(() => import('./sections/timeComplexity-heap-nlargets.mdx'))
const KeyExpressionsHeapNlargets = lazy(() => import('./sections/keyExpressions-heap-nlargets.mdx'))

export default async function Problem347TopKFrequentElements() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="347-top-k-frequent-elements"
      title="Top K Frequent Elements"
      difficulty="medium"
      topics={["heap","min-heap"]}
      solutionFiles={["heap.py","sort-frequency-bucketing.py","heap-nlargets.py"]}
      defaultFile="heap.py"
      fileSectionMap={{"heap.py":["definition","codeSnippet","timeComplexity"],"sort-frequency-bucketing.py":["definition","codeSnippet","timeComplexity"],"heap-nlargets.py":["definition","codeSnippet","timeComplexity","keyExpressions"]}}
      leetcodeUrl="https://leetcode.com/problems/top-k-frequent-elements"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="heap.py">
          <CodeSnippetHeap />
        </AgentSection>

        <AgentSection section="timeComplexity" file="heap.py">
          <TimeComplexityHeap />
        </AgentSection>

        <AgentSection section="codeSnippet" file="sort-frequency-bucketing.py">
          <CodeSnippetSortFrequencyBucketing />
        </AgentSection>

        <AgentSection section="timeComplexity" file="sort-frequency-bucketing.py">
          <TimeComplexitySortFrequencyBucketing />
        </AgentSection>

        <AgentSection section="codeSnippet" file="heap-nlargets.py">
          <CodeSnippetHeapNlargets />
        </AgentSection>

        <AgentSection section="timeComplexity" file="heap-nlargets.py">
          <TimeComplexityHeapNlargets />
        </AgentSection>

        <AgentSection section="keyExpressions" file="heap-nlargets.py">
          <KeyExpressionsHeapNlargets />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
