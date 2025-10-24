import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem211DesignAddAndSearchWordsDataStructure() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="211-design-add-and-search-words-data-structure"
      title="Design Add and Search Words Data Structure"
      difficulty="medium"
      topics={["trie"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/design-add-and-search-words-data-structure"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
