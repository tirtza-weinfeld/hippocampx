import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetConcise = lazy(() => import('./sections/codeSnippet-concise.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))

export default async function Problem435NonOverlappingIntervals() {
  return (
    <AgentCard
      id="435-non-overlapping-intervals"
      title="Non-overlapping Intervals"
      difficulty="medium"
      topics={["interval","greedy"]}
      solutionFiles={["concise.py","solution.py"]}
      defaultFile="concise.py"
      fileSectionMap={{"concise.py":["definition","codeSnippet"],"solution.py":["definition","codeSnippet","intuition","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/non-overlapping-intervals/"
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

        <AgentSection section="intuition" file="solution.py">
          <IntuitionSolution />
        </AgentSection>

        <AgentSection section="timeComplexity" file="solution.py">
          <TimeComplexitySolution />
        </AgentSection>
    </AgentCard>
  )
}
