import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetBottomUpPrefix = lazy(() => import('./sections/codeSnippet-bottom-up-prefix.mdx'))
const IntuitionBottomUpPrefix = lazy(() => import('./sections/intuition-bottom-up-prefix.mdx'))
const TimeComplexityBottomUpPrefix = lazy(() => import('./sections/timeComplexity-bottom-up-prefix.mdx'))
const KeyVariablesBottomUpPrefix = lazy(() => import('./sections/keyVariables-bottom-up-prefix.mdx'))
const KeyExpressionsBottomUpPrefix = lazy(() => import('./sections/keyExpressions-bottom-up-prefix.mdx'))
const CodeSnippetTopDownSuffix = lazy(() => import('./sections/codeSnippet-top-down-suffix.mdx'))
const IntuitionTopDownSuffix = lazy(() => import('./sections/intuition-top-down-suffix.mdx'))
const TimeComplexityTopDownSuffix = lazy(() => import('./sections/timeComplexity-top-down-suffix.mdx'))
const KeyExpressionsTopDownSuffix = lazy(() => import('./sections/keyExpressions-top-down-suffix.mdx'))
const CodeSnippetBottomUpSuffix = lazy(() => import('./sections/codeSnippet-bottom-up-suffix.mdx'))
const KeyExpressionsBottomUpSuffix = lazy(() => import('./sections/keyExpressions-bottom-up-suffix.mdx'))

export default async function Problem198HouseRobber() {
  return (
    <AgentCard
      id="198-house-robber"
      title="House Robber"
      difficulty="medium"
      topics={["dynamic_programming","dynamic_programming-1D"]}
      solutionFiles={["bottom-up-prefix.py","top-down-suffix.py","bottom-up-suffix.py"]}
      defaultFile="bottom-up-prefix.py"
      fileSectionMap={{"bottom-up-prefix.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables","keyExpressions"],"top-down-suffix.py":["definition","codeSnippet","intuition","timeComplexity","keyExpressions"],"bottom-up-suffix.py":["definition","codeSnippet","keyExpressions"]}}
      leetcodeUrl="https://leetcode.com/problems/house-robber"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up-prefix.py">
          <CodeSnippetBottomUpPrefix />
        </AgentSection>

        <AgentSection section="intuition" file="bottom-up-prefix.py">
          <IntuitionBottomUpPrefix />
        </AgentSection>

        <AgentSection section="timeComplexity" file="bottom-up-prefix.py">
          <TimeComplexityBottomUpPrefix />
        </AgentSection>

        <AgentSection section="keyVariables" file="bottom-up-prefix.py">
          <KeyVariablesBottomUpPrefix />
        </AgentSection>

        <AgentSection section="keyExpressions" file="bottom-up-prefix.py">
          <KeyExpressionsBottomUpPrefix />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top-down-suffix.py">
          <CodeSnippetTopDownSuffix />
        </AgentSection>

        <AgentSection section="intuition" file="top-down-suffix.py">
          <IntuitionTopDownSuffix />
        </AgentSection>

        <AgentSection section="timeComplexity" file="top-down-suffix.py">
          <TimeComplexityTopDownSuffix />
        </AgentSection>

        <AgentSection section="keyExpressions" file="top-down-suffix.py">
          <KeyExpressionsTopDownSuffix />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom-up-suffix.py">
          <CodeSnippetBottomUpSuffix />
        </AgentSection>

        <AgentSection section="keyExpressions" file="bottom-up-suffix.py">
          <KeyExpressionsBottomUpSuffix />
        </AgentSection>
    </AgentCard>
  )
}
