// import { AgentWrapperDialog } from '@/components/agent/agent-wrapper-dialog'
import { MarkdownRenderer } from '@/components/mdx/parse/markdown-renderer';

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

  
  const mathtext = String.raw`

# Math Color Tests

## Resizable Table Of Contents

## Basic Colors (gradient text)

 ("apple" = red gradient )
here is $\color{red}{\text{apple}}$

 ("banana" = yellow gradient )
here is $\color{yellow}{\text{banana}}$

 ("cucumber" = green gradient )
here is $\textcolor{green}{\text{cucumber}}$

 ("dolphin" = blue gradient )
here is $\color{blue}{\text{dolphin}}$

 ("elephant" = pink gradient )
here is $\color{pink}{\text{elephant}}$

 ("falcon" = indigo gradient )
here is $\color{indigo}{\text{falcon}}$

## Partial Color

 ("x +" = gray gradient, "y" = red gradient, "= 10" = gray gradient )
partial $x + \color{red}{y} = 10$

 $x + \textcolor{red}{y} = 10$     # textcolor takes an argument
  
 $x + {\color{red}y} = 10$         # wrap BOTH color switch AND content in


## Strong (bold)

 ("tasty" = sky-teal gradient, "cherry" = red gradient )
**tasty $\textcolor{red}{\text{cherry}}$**

 ("grape" = red gradient, background tint from [red!] )
**[red!]juicy $\text{grape}$**

 ("fresh lemon" = red gradient, "kiwi" = green gradient, background tint )
**[red!]fresh $\textcolor{green}{\text{kiwi}}$ $\text{lemon}$**

## Em (italic)

 ("sweet" = sky-teal gradient, "mango" = red gradient )
*sweet $\textcolor{red}{\text{mango}}$*

 ("nectarine" = sky-teal gradient, background tint from [red!] )
*[red!]ripe $\text{nectarine}$*

 ("delicious papaya" = sky-teal gradient, "nectarine" = green gradient, background tint )
*[red!]delicious $\textcolor{green}{\text{nectarine}}$ $\text{papaya}$*

*[red!]delicious *[green!]nectarine* papaya*

## Block Math

 ("nabla f" = indigo gradient, centered )
$$
\color{green}{\boldsymbol{\nabla f}}
$$


 `
  return (
    <div>
      {/* <MarkdownRenderer>{text}</MarkdownRenderer> */}
      {/* <MathRenderer latex={ "\\color{yellow}{\\text{banana}}" }  /> */}


      {/* <MarkdownRenderer>{mathtext}</MarkdownRenderer> */}

      {/* <M /> */}
<C />
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