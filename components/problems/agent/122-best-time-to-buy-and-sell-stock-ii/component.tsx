import { lazy , Suspense} from 'react'
import { AgentCard, AgentSection } from '@/components/agent'

// Lazy imports for each section MDX
const Definition = lazy(() => import('./sections/definition.mdx'))
const CodeSnippetSolution = lazy(() => import('./sections/codeSnippet-solution.mdx'))

export default async function Problem122BestTimeToBuyAndSellStockIi() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <AgentCard
      id="122-best-time-to-buy-and-sell-stock-ii"
      title="Best Time to Buy and Sell Stock II"
      difficulty="medium"
      topics={["greedy"]}
      solutionFiles={["solution.py"]}
      defaultFile="solution.py"
      fileSectionMap={{"solution.py":["definition","codeSnippet"]}}
      leetcodeUrl="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii"
    >
        <AgentSection section="definition">
          <Definition />
        </AgentSection>

        <AgentSection section="codeSnippet" file="solution.py">
          <CodeSnippetSolution />
        </AgentSection>
    </AgentCard>
  </Suspense>
  )
}
