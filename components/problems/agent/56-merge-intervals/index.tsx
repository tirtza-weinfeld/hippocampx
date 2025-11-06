import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const CodeSnippetSameIdea = lazy(() => import('./sections/codeSnippet-same_idea.mdx'))

export default async function Problem56MergeIntervals() {
  return (
    <AgentCard
      id="56-merge-intervals"
      title="Merge Intervals"
      difficulty="medium"
      topics={["interval"]}
      solutionFiles={["solution.py","same_idea.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"],"same_idea.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/merge-intervals/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>

        <AgentSection section="codeSnippet" file="same_idea.py">
          <CodeSnippetSameIdea />
        </AgentSection>
    </AgentCard>
  )
}
