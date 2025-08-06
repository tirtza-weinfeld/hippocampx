import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root } from 'mdast'

describe('Test emphasis at start of feature item', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)

  it('should handle feature items starting with emphasis', () => {
    const markdown = `- ~ Feature two
  - ~ *[8:]starts* at a *[8:]reshelving basket*`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Result with emphasis start:', JSON.stringify(result, null, 2))
    
    const list = result.children[0] as any
    const secondItem = list.children[1]
    
    // Should have nested list
    expect(secondItem.children.length).toBe(2)
    expect(secondItem.children[1].type).toBe('list')
    
    const nestedItem = secondItem.children[1].children[0]
    expect(nestedItem.type).toBe('mdxJsxFlowElement')
    expect(nestedItem.name).toBe('FeatureItem')
    
    // Check that the emphasis is preserved in the nested item
    const nestedParagraph = nestedItem.children[0]
    console.log('Nested paragraph children:', nestedParagraph.children)
    
    // Should start with emphasis node
    expect(nestedParagraph.children[0].type).toBe('emphasis')
  })

  it('should show what happens with raw parsing', () => {
    const rawProcessor = unified().use(remarkParse)
    const markdown = `- ~ *[8:]starts* at a basket`
    
    const rawResult = rawProcessor.runSync(rawProcessor.parse(markdown)) as Root
    console.log('Raw parse (emphasis start):', JSON.stringify(rawResult, null, 2))
    
    const listItem = (rawResult.children[0] as any).children[0]
    const paragraph = listItem.children[0]
    console.log('Paragraph children:', paragraph.children)
    
    // First child should be text with "~ ", second should be emphasis
    expect(paragraph.children[0].type).toBe('text')
    expect(paragraph.children[0].value).toBe('~ ')
    expect(paragraph.children[1].type).toBe('emphasis')
  })
})