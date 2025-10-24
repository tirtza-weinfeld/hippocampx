import { lazy } from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetDp = lazy(() => import('./sections/codeSnippet-dp.mdx'))
const CodeSnippetStates = lazy(() => import('./sections/codeSnippet-states.mdx'))

export default async function Problem188BestTimeToBuyAndSellStockIv() {
  return (
    <AgentCard
      id="188-best-time-to-buy-and-sell-stock-iv"
      title="Best Time to Buy and Sell Stock IV"
      difficulty="hard"
      topics={["dynamic-programming"]}
      solutionFiles={["dp.py","states.py"]}
      defaultFile="dp.py"
      fileSectionMap={{"dp.py":["definition","codeSnippet"],"states.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="dp.py">
          <CodeSnippetDp />
        </AgentSection>

        <AgentSection section="codeSnippet" file="states.py">
          <CodeSnippetStates />
        </AgentSection>
    </AgentCard>
  )
}
