import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))
const IntuitionSolution = lazy(() => import('./sections/intuition-solution.mdx'))
const KeyVariablesSolution = lazy(() => import('./sections/keyVariables-solution.mdx'))
const KeyExpressionsSolution = lazy(() => import('./sections/keyExpressions-solution.mdx'))

export default async function Problem207CourseSchedule() {
  return (
    <AgentCard
      id="207-course-schedule"
      title="Course Schedule"
      difficulty="medium"
      topics={["topological-sort","kahn's algorithm"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet","intuition","keyVariables","keyExpressions"]}}
      leetcodeUrl="https://leetcode.com/problems/course-schedule"
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

        <AgentSection section="keyVariables" file="solution.py">
          <KeyVariablesSolution />
        </AgentSection>

        <AgentSection section="keyExpressions" file="solution.py">
          <KeyExpressionsSolution />
        </AgentSection>
    </AgentCard>
  )
}
