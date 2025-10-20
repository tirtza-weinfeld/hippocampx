import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const TimeComplexitySolution = lazy(() => import('./sections/timeComplexity-solution.mdx'))
const KeyVariablesSolution = lazy(() => import('./sections/keyVariables-solution.mdx'))

export default async function Problem875KokoEatingBananas() {
  return (
    <AgentCard
      id="875-koko-eating-bananas"
      title="Koko Eating Bananas"
      difficulty="medium"
      topics={["binary-search","binary-search-answer-space"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables"]}}
    >
        <AgentSection section="definition">
          <Definition />
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

        <AgentSection section="keyVariables" file="solution.py">
          <KeyVariablesSolution />
        </AgentSection>
    </AgentCard>
  )
}
