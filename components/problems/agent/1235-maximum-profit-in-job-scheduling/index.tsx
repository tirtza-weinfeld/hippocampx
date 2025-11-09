import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetTopDown = lazy(() => import('./sections/codeSnippet-top_down.mdx'))
const TimeComplexityTopDown = lazy(() => import('./sections/timeComplexity-top_down.mdx'))
const KeyVariablesTopDown = lazy(() => import('./sections/keyVariables-top_down.mdx'))
const KeyExpressionsTopDown = lazy(() => import('./sections/keyExpressions-top_down.mdx'))
const CodeSnippetBottomUp = lazy(() => import('./sections/codeSnippet-bottom_up.mdx'))
const CodeSnippetTopDownExplicit = lazy(() => import('./sections/codeSnippet-top_down_explicit.mdx'))

export default async function Problem1235MaximumProfitInJobScheduling() {
  return (
    <AgentCard
      id="1235-maximum-profit-in-job-scheduling"
      title="Maximum Profit in Job Scheduling"
      difficulty="hard"
      topics={["interval","binary-search","dp"]}
      solutionFiles={["top_down.py","bottom_up.py","top_down_explicit.py"]}
      defaultFile="top_down.py"
      fileSectionMap={{"top_down.py":["definition","codeSnippet","timeComplexity","keyVariables","keyExpressions"],"bottom_up.py":["definition","codeSnippet"],"top_down_explicit.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/maximum-profit-in-job-scheduling/"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top_down.py">
          <CodeSnippetTopDown />
        </AgentSection>

        <AgentSection section="timeComplexity" file="top_down.py">
          <TimeComplexityTopDown />
        </AgentSection>

        <AgentSection section="keyVariables" file="top_down.py">
          <KeyVariablesTopDown />
        </AgentSection>

        <AgentSection section="keyExpressions" file="top_down.py">
          <KeyExpressionsTopDown />
        </AgentSection>

        <AgentSection section="codeSnippet" file="bottom_up.py">
          <CodeSnippetBottomUp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="top_down_explicit.py">
          <CodeSnippetTopDownExplicit />
        </AgentSection>
    </AgentCard>
  )
}
