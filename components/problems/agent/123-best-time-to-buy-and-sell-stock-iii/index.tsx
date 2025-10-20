import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetDp = lazy(() => import('./sections/codeSnippet-dp.mdx'))
const IntuitionDp = lazy(() => import('./sections/intuition-dp.mdx'))
const TimeComplexityDp = lazy(() => import('./sections/timeComplexity-dp.mdx'))
const KeyVariablesDp = lazy(() => import('./sections/keyVariables-dp.mdx'))
const KeyExpressionsDp = lazy(() => import('./sections/keyExpressions-dp.mdx'))
const CodeSnippetState = lazy(() => import('./sections/codeSnippet-state.mdx'))
const IntuitionState = lazy(() => import('./sections/intuition-state.mdx'))
const KeyExpressionsState = lazy(() => import('./sections/keyExpressions-state.mdx'))

export default async function Problem123BestTimeToBuyAndSellStockIii() {
  return (
    <AgentCard
      id="123-best-time-to-buy-and-sell-stock-iii"
      title="Best Time to Buy and Sell Stock III"
      difficulty="hard"
      topics={["dynamic-programming","array"]}
      solutionFiles={["dp.py","state.py"]}
      defaultFile="dp.py"
      fileSectionMap={{"dp.py":["definition","codeSnippet","intuition","timeComplexity","keyVariables","keyExpressions"],"state.py":["definition","codeSnippet","intuition","keyExpressions"]}}
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dp.py">
          <CodeSnippetDp />
        </AgentSection>

        <AgentSection section="intuition" file="dp.py">
          <IntuitionDp />
        </AgentSection>

        <AgentSection section="timeComplexity" file="dp.py">
          <TimeComplexityDp />
        </AgentSection>

        <AgentSection section="keyVariables" file="dp.py">
          <KeyVariablesDp />
        </AgentSection>

        <AgentSection section="keyExpressions" file="dp.py">
          <KeyExpressionsDp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="state.py">
          <CodeSnippetState />
        </AgentSection>

        <AgentSection section="intuition" file="state.py">
          <IntuitionState />
        </AgentSection>

        <AgentSection section="keyExpressions" file="state.py">
          <KeyExpressionsState />
        </AgentSection>
    </AgentCard>
  )
}
