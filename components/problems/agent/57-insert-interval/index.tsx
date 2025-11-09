import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetConcise = lazy(() => import('./sections/codeSnippet-concise.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem57InsertInterval() {
  return (
    <AgentCard
      id="57-insert-interval"
      title="Insert Interval"
      difficulty="medium"
      topics={["interval"]}
      solutionFiles={["concise.py","solution.py"]}
      defaultFile="concise.py"
      fileSectionMap={{"concise.py":["definition","codeSnippet"],"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/insert-interval"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="concise.py">
          <CodeSnippetConcise />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>
    </AgentCard>
  )
}
