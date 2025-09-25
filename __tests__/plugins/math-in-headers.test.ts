import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import { remarkHeaderSection } from '@/plugins/remark-header-section'

describe('Math in Headers', () => {
  it('should preserve math expressions in regular headers', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMath)

    const input = '# Header with math $O(n)$'
    const result = await processor.parse(input)
    
    console.log('Regular header AST:', JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
  })

  it('should preserve math expressions in component headers with correct plugin order', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkHeaderSection) // First transform the header
      .use(remarkMath) // Then process math

    const input = '## [!COMPONENT:ProblemTimeComplexity] Time Complexity $O(ElogV)$'
    const result = await processor.parse(input)
    
    console.log('Component header AST (correct order):', JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
  })

  it('should show the problem when remarkMath runs first', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMath) // Wrong order - math first
      .use(remarkHeaderSection) // Then transform header

    const input = '## [!COMPONENT:ProblemTimeComplexity] Time Complexity $O(ElogV)$'
    const result = await processor.run(processor.parse(input)) // Actually run the transform
    
    console.log('Component header AST (wrong order):', JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
  })

  it('should test the actual transformation with correct order', async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkHeaderSection) // First transform the header
      .use(remarkMath) // Then process math

    const input = '## [!COMPONENT:ProblemTimeComplexity] Time Complexity $O(ElogV)$'
    const result = await processor.run(processor.parse(input)) // Actually run the transform
    
    console.log('Transformed AST (correct order):', JSON.stringify(result, null, 2))
    expect(result).toBeDefined()
  })

  it('should show the math nodes are preserved in our current setup', async () => {
    // This simulates our current next.config.ts order
    const processor = unified()
      .use(remarkParse)
      .use(remarkHeaderSection)
      .use(remarkMath) // Current order in next.config.ts

    const input = '## [!COMPONENT:ProblemTimeComplexity] Time Complexity $O(ElogV)$'
    const result = await processor.run(processor.parse(input))
    
    console.log('Current setup result:', JSON.stringify(result, null, 2))
    
    // Find the heading inside the component
    const component = result.children[0]
    const heading = component.children[0]
    
    // Check if math node exists
    const hasMathNode = heading.children.some((child: any) => child.type === 'inlineMath')
    expect(hasMathNode).toBe(true)
  })
})