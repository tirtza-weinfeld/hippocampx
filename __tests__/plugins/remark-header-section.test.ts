import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { remarkHeaderSection } from '../../plugins/remark-header-section'
import { describe, it, expect } from 'vitest'

describe('remarkHeaderSection', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkHeaderSection)

  it('should transform headers with component directive', () => {
    const input = `## [!COMPONENT:ProblemTimeComplexity] Linear Time complexity is o(n)

which means linear in the size of the input ...

## Regular Header

This should not be transformed.`

    const result = processor.parse(input)
    processor.runSync(result)

    // Find the section wrapper
    const sectionWrapper = result.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'ProblemTimeComplexity'
    ) as any

    expect(sectionWrapper).toBeDefined()
    expect(sectionWrapper.name).toBe('ProblemTimeComplexity')

    // Check that it contains the header component
    const headerComponent = sectionWrapper.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'ProblemTimeComplexityHeader'
    )
    expect(headerComponent).toBeDefined()
    expect(headerComponent.name).toBe('ProblemTimeComplexityHeader')

    // Check that the heading text was cleaned
    const headingInHeader = headerComponent.children.find((child: any) => child.type === 'heading')
    expect(headingInHeader.children[0].value).toBe('Linear Time complexity is o(n)')
  })

  it('should not transform regular headers', () => {
    const input = `## Regular Header

This should not be transformed.`

    const result = processor.parse(input)
    processor.runSync(result)

    // Should not contain any MDX JSX elements
    const jsxElements = result.children.filter((child: any) => 
      child.type === 'mdxJsxFlowElement'
    )

    expect(jsxElements).toHaveLength(0)
  })

  it('should handle multiple component headers', () => {
    const input = `## [!COMPONENT:ProblemDefinition] What is the problem?

Define the problem clearly.

## [!COMPONENT:ProblemSolution] How to solve it?

Here's the solution approach.`

    const result = processor.parse(input)
    processor.runSync(result)

    const jsxElements = result.children.filter((child: any) => 
      child.type === 'mdxJsxFlowElement'
    )

    expect(jsxElements).toHaveLength(2)
    expect(jsxElements[0].name).toBe('ProblemDefinition')
    expect(jsxElements[1].name).toBe('ProblemSolution')
  })

  it('should append Header to component names', () => {
    const input = `## [!COMPONENT:ProblemDefinition] Test Header

Content here.`

    const result = processor.parse(input)
    processor.runSync(result)

    const jsxElement = result.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement'
    ) as any

    expect(jsxElement.name).toBe('ProblemDefinitionHeader')
    expect(jsxElement.attributes).toEqual([])
  })
})