import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkListVariants from '@/plugins/remark-list-variants'
import { describe, it, expect } from 'vitest'
import type { Root } from 'mdast'

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkListVariants)

describe('remark-list-variants colon header items', () => {
  it('should remove colon from list item text and set headerItem to true', () => {
    const input = `
- Introduction:
- Basic concepts
- Advanced topics:
- Summary
`

    const tree = processor.parse(input) as Root
    processor.runSync(tree)

    // Find the transformed JSX elements
    const unorderedList = tree.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'UnorderedList'
    ) as any

    expect(unorderedList).toBeDefined()
    
    const listItems = unorderedList.children.filter((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'ListItem'
    )

    expect(listItems).toHaveLength(4)

    // First item: "Introduction:" should become "Introduction" with headerItem=true
    const firstItem = listItems[0]
    expect(firstItem.attributes.find((attr: any) => attr.name === 'headerItem')?.value.data.estree.body[0].expression.value).toBe(true)
    
    // Check that text content has colon removed
    const firstItemText = firstItem.children[0].children[0].value
    expect(firstItemText).toBe('Introduction')

    // Second item: "Basic concepts" should not have headerItem
    const secondItem = listItems[1]
    expect(secondItem.attributes.find((attr: any) => attr.name === 'headerItem')).toBeUndefined()

    // Third item: "Advanced topics:" should become "Advanced topics" with headerItem=true
    const thirdItem = listItems[2]
    expect(thirdItem.attributes.find((attr: any) => attr.name === 'headerItem')?.value.data.estree.body[0].expression.value).toBe(true)
    
    // Check that text content has colon removed
    const thirdItemText = thirdItem.children[0].children[0].value
    expect(thirdItemText).toBe('Advanced topics')

    // Fourth item: "Summary" should not have headerItem
    const fourthItem = listItems[3]
    expect(fourthItem.attributes.find((attr: any) => attr.name === 'headerItem')).toBeUndefined()
  })

  it('should handle ordered lists with colons', () => {
    const input = `
1. Getting Started:
2. Implementation details
3. Configuration:
4. Testing
`

    const tree = processor.parse(input) as Root
    processor.runSync(tree)

    // Find the transformed JSX elements
    const orderedList = tree.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'OrderedList'
    ) as any

    expect(orderedList).toBeDefined()
    
    const listItems = orderedList.children.filter((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'ListItem'
    )

    expect(listItems).toHaveLength(4)

    // First item: "Getting Started:" should become "Getting Started" with headerItem=true
    const firstItem = listItems[0]
    expect(firstItem.attributes.find((attr: any) => attr.name === 'headerItem')?.value.data.estree.body[0].expression.value).toBe(true)
    
    // Check that text content has colon removed
    const firstItemText = firstItem.children[0].children[0].value
    expect(firstItemText).toBe('Getting Started')

    // Second item: "Implementation details" should not have headerItem
    const secondItem = listItems[1]
    expect(secondItem.attributes.find((attr: any) => attr.name === 'headerItem')).toBeUndefined()
  })

  it('should not remove colons that are in the middle of text', () => {
    const input = `
- Time format: 12:30 PM
- URL: https://example.com
- Title with colon:
`

    const tree = processor.parse(input) as Root
    processor.runSync(tree)

    const unorderedList = tree.children.find((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'UnorderedList'
    ) as any
    
    const listItems = unorderedList.children.filter((child: any) => 
      child.type === 'mdxJsxFlowElement' && child.name === 'ListItem'
    )

    // First two items should not have headerItem (colon not at end)
    const firstItem = listItems[0]
    expect(firstItem.attributes.find((attr: any) => attr.name === 'headerItem')).toBeUndefined()
    const firstItemText = firstItem.children[0].children[0].value
    expect(firstItemText).toBe('Time format: 12:30 PM')

    const secondItem = listItems[1]
    expect(secondItem.attributes.find((attr: any) => attr.name === 'headerItem')).toBeUndefined()
    const secondItemText = secondItem.children[0].children[0].value
    expect(secondItemText).toBe('URL: https://example.com')

    // Third item should have headerItem (colon at end)
    const thirdItem = listItems[2]
    expect(thirdItem.attributes.find((attr: any) => attr.name === 'headerItem')?.value.data.estree.body[0].expression.value).toBe(true)
    const thirdItemText = thirdItem.children[0].children[0].value
    expect(thirdItemText).toBe('Title with colon')
  })
})