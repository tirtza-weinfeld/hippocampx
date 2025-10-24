import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBottomUp = lazy(() => import('./sections/codeSnippet-bottom-up.mdx'))
const IntuitionBottomUp = lazy(() => import('./sections/intuition-bottom-up.mdx'))
const TimeComplexityBottomUp = lazy(() => import('./sections/timeComplexity-bottom-up.mdx'))
const KeyVariablesBottomUp = lazy(() => import('./sections/keyVariables-bottom-up.mdx'))
const KeyExpressionsBottomUp = lazy(() => import('./sections/keyExpressions-bottom-up.mdx'))
const CodeSnippetTopDown = lazy(() => import('./sections/codeSnippet-top-down.mdx'))
const TimeComplexityTopDown = lazy(() => import('./sections/timeComplexity-top-down.mdx'))

export default async function Problem64MinimumPathSum() {
  return (
    <AgentCard
      id="64-minimum-path-sum"
      title="Minimum Path Sum"
      difficulty="medium"
      topics={["dynamic-programming"]}
      solutionFiles={["bottom-up.py","top-down.py"]}
      defaultFile="bottom-up.py"
      fileSectionMap={{"bottom-up.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables","keyExpressions"],"top-down.py":["definition","codeSnippet","timeComplexity"]}}
      leetcodeUrl="https://leetcode.com/problems/minimum-path-sum"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up.py">
          <CodeSnippetBottomUp />
        </AgentSection>

        <AgentSection section="intuition" file="bottom-up.py">
          <IntuitionBottomUp />
        </AgentSection>

        <AgentSection section="timeComplexity" file="bottom-up.py">
          <TimeComplexityBottomUp />
        </AgentSection>

        <AgentSection section="keyVariables" file="bottom-up.py">
          <KeyVariablesBottomUp />
        </AgentSection>

        <AgentSection section="keyExpressions" file="bottom-up.py">
          <KeyExpressionsBottomUp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top-down.py">
          <CodeSnippetTopDown />
        </AgentSection>

        <AgentSection section="timeComplexity" file="top-down.py">
          <TimeComplexityTopDown />
        </AgentSection>
    </AgentCard>
  )
}
