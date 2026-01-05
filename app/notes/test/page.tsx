// import { AgentWrapperDialog } from '@/components/agent/agent-wrapper-dialog'
// import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';

// import { ProblemsMascot } from "@/components/problems/mascot/problems-mascot";
// import { MascotProviders } from "@/components/problems/mascot/mascot-providers";
// import { lazy, Suspense } from 'react'
// const AgentWrapperDialog = lazy(() => import('@/components/agent/agent-wrapper-dialog'))
// import AgentWrapper from '@/components/problems/agent/wrapper'
// import { SlowComponent } from '@/components/problems/agent/wrapper'
// const SlowComponent = lazy(() => import('@/components/problems/agent/wrapper'))
// const AgentWrapper = lazy(() => import('@/components/problems/agent/wrapper'))
// import N from './n.mdx'
// import { MathRenderer } from '@/components/mdx/parse/renderers/math-renderer'
import M from './m.mdx'
import C from './c.mdx'
// import CodeBlock from '@/components/mdx/code/code-block'
export default function TestPage() {
  //   const code = `
  //   def second_largest(nums: list[int]) -> int:
  //     """
  //     Given a list of unique positive integers, return the second largest integer
  //     """
  //     first = second = -1
  //     for num in nums:
  //         if num > first:
  //             second, first = first, num
  //         elif num > second:
  //             second = num
  //     return second
  // `

  // const text = 'Given banana piles `piles` and hour limit `h`, find the minimum eating speed\n' +" *hi* "+
  //     ' **$k$** such that $\\sum_{i=1}^{|piles|} \\lceil \\frac{p_i}{k} \\rceil \\leq h$ where each hour Koko eats up to `k` bananas from one pile (any leftover hour is wasted)'

  
  
  return (
    <div>
      {/* <MarkdownRenderer>{text}</MarkdownRenderer> */}
      {/* <MathRenderer latex={ "\\color{yellow}{\\text{banana}}" }  /> */}


      {/* <MarkdownRenderer>{mathtext}</MarkdownRenderer> */}

      {/* <M /> */}
<C />
<M/>
      {/* <CodeBlock className="language-python" >
        {code}
      </CodeBlock> */}
      {/* <AgentWrapperDialog>
        <AgentWrapper />
        </AgentWrapperDialog> */}

      {/* <MascotProviders>
        <ProblemsMascot />
      </MascotProviders> */}
    </div>
  )
}