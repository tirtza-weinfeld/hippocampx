import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkListVariants from '@/plugins/remark-list-variants'
import type { Root } from 'mdast'
import { VFile } from 'vfile'

describe('remark-list-variants plugin', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkListVariants)
    
  // Helper to process markdown with proper file context
  const processMarkdown = (markdown: string) => {
    const tree = processor.parse(markdown)
    // Create a VFile with the markdown content so the plugin can access it
    const file = { value: markdown }
    return processor.runSync(tree, file as any)
  }

  describe('Feature list pattern detection', () => {
    it('should detect unordered feature pattern "- ~ Feature"', () => {
      const markdown = `- ~ Feature one
- ~ Feature two`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Unordered feature AST:', JSON.stringify(result, null, 2))
      
      // Should have list with FeatureItem elements
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      expect(list.ordered).toBe(false)
      
      // Check if first item was transformed to FeatureItem JSX
      const firstItem = list.children[0]
      expect(firstItem.type).toBe('mdxJsxFlowElement')
      expect(firstItem.name).toBe('FeatureItem')
    })

    it('should detect ordered feature pattern "1. ~ Feature"', () => {
      const markdown = `1. ~ Feature one
2. ~ Feature two`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Ordered feature AST:', JSON.stringify(result, null, 2))
      
      // Should have ordered list with FeatureItem elements
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      expect(list.ordered).toBe(true)
      
      // Check if first item was transformed to FeatureItem JSX
      const firstItem = list.children[0]
      expect(firstItem.type).toBe('mdxJsxFlowElement')
      expect(firstItem.name).toBe('FeatureItem')
    })

    it('should detect task pattern "- [ ] Task"', () => {
      const markdown = `- [ ] Unchecked task
- [x] Checked task`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Task list AST:', JSON.stringify(result, null, 2))
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      
      // Check first task item
      const firstItem = list.children[0]
      expect(firstItem.type).toBe('mdxJsxFlowElement')
      expect(firstItem.name).toBe('TaskItem')
      
      // Check checked attribute for unchecked task
      const checkedAttr = firstItem.attributes.find((attr: any) => attr.name === 'checked')
      expect(checkedAttr.value.value).toBe('false')
      
      // Check second task item is checked
      const secondItem = list.children[1]
      const secondCheckedAttr = secondItem.attributes.find((attr: any) => attr.name === 'checked')
      expect(secondCheckedAttr.value.value).toBe('true')
    })

    it('should preserve regular list items unchanged', () => {
      const markdown = `- Regular item
- Another regular item`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      
      // Should remain as regular listItem, not transformed
      const firstItem = list.children[0]
      expect(firstItem.type).toBe('listItem')
    })
  })

  describe('Real-world MDX content from page.mdx', () => {
    it('should handle nested feature items correctly', () => {
      const markdown = `- ~ Feature one
- ~ Feature two
  - ~ Feature two.one
- ~ Feature three`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      console.log('Nested feature AST:', JSON.stringify(result, null, 2))
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      expect(list.ordered).toBe(false)
      
      // Should have 3 top-level items
      expect(list.children.length).toBe(3)
      
      // All top-level items should be FeatureItem
      expect(list.children[0].type).toBe('mdxJsxFlowElement')
      expect(list.children[0].name).toBe('FeatureItem')
      
      expect(list.children[1].type).toBe('mdxJsxFlowElement')
      expect(list.children[1].name).toBe('FeatureItem')
      
      expect(list.children[2].type).toBe('mdxJsxFlowElement') 
      expect(list.children[2].name).toBe('FeatureItem')
      
      // The second item should have nested content including a list
      const secondItem = list.children[1]
      console.log('Second item children:', secondItem.children)
      
      // Should have: paragraph + nested list
      expect(secondItem.children.length).toBe(2)
      expect(secondItem.children[0].type).toBe('paragraph')
      expect(secondItem.children[1].type).toBe('list')
      
      // The nested list should also have its FeatureItem transformed
      const nestedList = secondItem.children[1]
      expect(nestedList.children.length).toBe(1)
      expect(nestedList.children[0].type).toBe('mdxJsxFlowElement')
      expect(nestedList.children[0].name).toBe('FeatureItem')
      
      console.log('Nested FeatureItem:', nestedList.children[0])
    })
  })

  describe('List restart detection by number sequence', () => {
    it('should detect when "1." appears after higher numbers in a single list and mark restart items', () => {
      const markdown = `1. First item
2. Second item
1. This should restart (1 after 2)
2. This continues the restart`

      // Check what the raw parser produces (before plugins)
      const rawProcessor = unified().use(remarkParse)
      const rawTree = rawProcessor.parse(markdown)
      const result = processMarkdown(markdown) as Root
      console.log('Result tree (after plugin):', JSON.stringify(result, null, 2))
      
      // Should have one list (markdown parser combines them)
      expect(result.children.length).toBe(1)
      
      const list = result.children[0] as any
      expect(list.type).toBe('list')
      
      // Third item (index 2) should be marked as restart since it's "1." after "2."
      const thirdItem = list.children[2]
      expect(thirdItem.data?.hProperties?.['data-restart-numbering']).toBe('true')
      expect(thirdItem.data?.hProperties?.['data-item-number']).toBe('1')
      
      const fourthItem = list.children[3]
      expect(fourthItem.data?.hProperties?.['data-item-number']).toBe('2')
    })

    it('should handle complex sequence: 1,2 then 1,2 then 5,6 then 1,2', () => {
      const markdown = `1. First sequence item 1
2. First sequence item 2

1. Second sequence item 1 (restart)
2. Second sequence item 2

5. Third sequence item 5 (continues)
6. Third sequence item 6

1. Fourth sequence item 1 (restart after 6)
2. Fourth sequence item 2`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      // Should have 4 lists
      expect(result.children.length).toBe(4)
      
      // Second list should be marked as restart (1 after 2)
      const secondList = result.children[1] as any
      const secondListFirstItem = secondList.children[0]
      expect(secondListFirstItem.data?.hProperties?.['data-restart-numbering']).toBe('true')
      
      // Third list should NOT be marked as restart (5 continues sequence)
      const thirdList = result.children[2] as any
      const thirdListFirstItem = thirdList.children[0]
      expect(thirdListFirstItem.data?.hProperties?.['data-restart-numbering']).toBeUndefined()
      
      // Fourth list should be marked as restart (1 after 6)
      const fourthList = result.children[3] as any
      const fourthListFirstItem = fourthList.children[0]
      expect(fourthListFirstItem.data?.hProperties?.['data-restart-numbering']).toBe('true')
    })
    
    it('should work with feature items that have number restarts', () => {
      const markdown = `1. ~ Feature one
2. ~ Feature two

1. ~ This feature should restart numbering
2. ~ This feature continues restart`

      const tree = processor.parse(markdown)
      const result = processor.runSync(tree) as Root
      
      const secondList = result.children[1] as any
      const firstFeatureItem = secondList.children[0]
      
      // Should be FeatureItem JSX with restart data
      expect(firstFeatureItem.type).toBe('mdxJsxFlowElement')
      expect(firstFeatureItem.name).toBe('FeatureItem')
      expect(firstFeatureItem.data?.hProperties?.['data-restart-numbering']).toBe('true')
      expect(firstFeatureItem.data?.hProperties?.['data-item-number']).toBe('1')
    })
  })
})