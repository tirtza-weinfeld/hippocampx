import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import type { Root } from 'mdast'
import remarkListVariants from '@/plugins/remark-list-variants'
import { VFile } from 'vfile'
import { describe, it, expect } from 'vitest'

// Test helper to process MDX content with VFile
const processMarkdown = async (content: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkListVariants)
  
  const file = new VFile({ value: content })
  const tree = processor.parse(file) as Root
  return processor.run(tree, file) as Promise<Root>
}

// Helper to find JSX elements in AST
const findJSXElements = (tree: Root, name?: string): any[] => {
  const elements: any[] = []
  
  const visit = (node: any) => {
    if (node.type === 'mdxJsxFlowElement' && (!name || node.name === name)) {
      elements.push(node)
    }
    if (node.children) {
      node.children.forEach(visit)
    }
  }
  
  visit(tree)
  return elements
}

// Helper to get attribute value from JSX element
const getAttributeValue = (element: any, attrName: string): any => {
  const attr = element.attributes?.find((a: any) => a.name === attrName)
  if (attr?.value?.type === 'mdxJsxAttributeValueExpression') {
    return attr.value.data?.estree?.body?.[0]?.expression?.value
  }
  return attr?.value
}

describe('remark-list-variants plugin', () => {
  describe('ordered lists', () => {
    it('should transform ordered list to OrderedList JSX with ListItem components', async () => {
      const content = `1. First item
2. Second item
3. Third item`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      listItems.forEach((item: any, index: number) => {
        expect(item.name).toBe('ListItem')
        expect(getAttributeValue(item, 'level')).toBe(1)
        expect(getAttributeValue(item, 'displayNumber')).toBe((index + 1).toString())
      })
    })

    it('should handle restart numbering correctly', async () => {
      const content = `1. First item
2. Second item
1. Restart at one
2. Continue from restart`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(4)
      
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('2')
      expect(getAttributeValue(listItems[2], 'displayNumber')).toBe('1') // Restart
      expect(getAttributeValue(listItems[3], 'displayNumber')).toBe('2') // Continue from restart
    })

    it('should handle decimal numbering for nested levels', async () => {
      const content = `1. First item
1.1. Sub item
1.2. Another sub item
2. Second item`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      // Markdown parser only recognizes 2 actual list items: "1." and "2."  
      // The "1.1." and "1.2." are treated as paragraph content within the first item
      expect(listItems).toHaveLength(2)
      
      expect(getAttributeValue(listItems[0], 'level')).toBe(1)
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')
      
      expect(getAttributeValue(listItems[1], 'level')).toBe(1)
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('2')
    })

    it('should handle explicit start numbers', async () => {
      const content = `5. Start at five
6. Continue normally
7. Keep going`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('5')
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('6')
      expect(getAttributeValue(listItems[2], 'displayNumber')).toBe('7')
    })

    it('should clean number prefixes from text content', async () => {
      const content = `1. First item with text
2. Second item with more text`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(2)
      
      // Check that the text content has been cleaned of number prefixes
      const firstItemText = listItems[0].children[0]?.children[0]?.value
      const secondItemText = listItems[1].children[0]?.children[0]?.value
      
      expect(firstItemText).toBe('First item with text')
      expect(secondItemText).toBe('Second item with more text')
    })
  })

  describe('unordered lists', () => {
    it('should calculate correct levels for unordered list items', async () => {
      const content = `- Item one
- Item two
- Item three`
      
      const tree = await processMarkdown(content)
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      
      expect(unorderedLists).toHaveLength(1)
      const listItems = unorderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      // All items should be level 1
      expect(getAttributeValue(listItems[0], 'level')).toBe(1)
      expect(getAttributeValue(listItems[1], 'level')).toBe(1) 
      expect(getAttributeValue(listItems[2], 'level')).toBe(1)
    })

    it('should calculate correct levels for nested unordered list items', async () => {
      // This test will fail because plugin hardcodes level=1 for all unordered items
      const content = `- Level 1 item
  - Level 2 item  
    - Level 3 item
- Another level 1 item`
      
      const tree = await processMarkdown(content)
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      
      // Find all list items across all nested lists
      const allListItems: any[] = []
      const collectItems = (lists: any[]) => {
        lists.forEach(list => {
          list.children.forEach((item: any) => {
            allListItems.push(item)
          })
        })
      }
      collectItems(unorderedLists)
      
      // Plugin should calculate levels based on nesting depth - THIS WILL FAIL
      expect(getAttributeValue(allListItems[0], 'level')).toBe(1) // "Level 1 item"
      expect(getAttributeValue(allListItems[1], 'level')).toBe(2) // "Level 2 item" - FAILS
      expect(getAttributeValue(allListItems[2], 'level')).toBe(3) // "Level 3 item" - FAILS
      expect(getAttributeValue(allListItems[3], 'level')).toBe(1) // "Another level 1 item"
    })

    it('should calculate correct levels for ordered list items', async () => {
      const content = `1. Item one
2. Item two  
3. Item three`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      // All items should be level 1
      expect(getAttributeValue(listItems[0], 'level')).toBe(1)
      expect(getAttributeValue(listItems[1], 'level')).toBe(1)
      expect(getAttributeValue(listItems[2], 'level')).toBe(1)
    })

    it('should calculate correct levels for nested ordered list items', async () => {
      const content = `1. Level 1 item
1.1. Level 2 item
1.2. Another level 2 item
2. Another level 1 item`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      const listItems = orderedLists[0].children
      
      // Plugin should calculate levels based on decimal numbering
      expect(getAttributeValue(listItems[0], 'level')).toBe(1) // "1. Level 1 item"
      expect(getAttributeValue(listItems[1], 'level')).toBe(2) // "1.1. Level 2 item"
    })

    it('should calculate correct displayNumber for ordered list items', async () => {
      const content = `1. Item one
2. Item two
3. Item three`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      // Should have correct display numbers
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('2')
      expect(getAttributeValue(listItems[2], 'displayNumber')).toBe('3')
    })

    it('should calculate correct displayNumber for nested ordered list items', async () => {
      const content = `1. Level 1 item
1.1. Level 2 item
1.2. Another level 2 item
2. Another level 1 item`
      
      const tree = await processMarkdown(content)
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      expect(orderedLists).toHaveLength(1)
      const listItems = orderedLists[0].children
      
      // Should preserve decimal numbering in display numbers
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')    // "1."
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('1.1')  // "1.1."
    })

    it('should transform unordered list to UnorderedList JSX with ListItem components', async () => {
      const content = `- First item
- Second item
- Third item`
      
      const tree = await processMarkdown(content)
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      
      expect(unorderedLists).toHaveLength(1)
      
      const listItems = unorderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      listItems.forEach((item: any) => {
        expect(item.name).toBe('ListItem')
        expect(getAttributeValue(item, 'level')).toBe(1)
        // Unordered lists should not have displayNumber
        expect(item.attributes.find((a: any) => a.name === 'displayNumber')).toBeUndefined()
      })
    })

    it('should use special item components based on data-item-type', async () => {
      const content = `- Regular item
- Problem intuition item
- Feature item`
      
      // Mock items with data attributes
      const mockContent = {
        type: 'root',
        children: [{
          type: 'list',
          ordered: false,
          children: [
            {
              type: 'listItem',
              position: {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 14, offset: 13 }
              },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Regular item' }] }]
            },
            {
              type: 'listItem',
              position: {
                start: { line: 2, column: 1, offset: 14 },
                end: { line: 2, column: 26, offset: 39 }
              },
              data: { hProperties: { 'data-item-type': 'problem-intuition' } },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Problem intuition item' }] }]
            },
            {
              type: 'listItem',
              position: {
                start: { line: 3, column: 1, offset: 40 },
                end: { line: 3, column: 15, offset: 54 }
              }, 
              data: { hProperties: { 'data-item-type': 'feature' } },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Feature item' }] }]
            }
          ]
        }]
      }
      
      const processor = unified().use(remarkListVariants)
      const file = new VFile({ value: content })
      const tree = await processor.run(mockContent as any, file) as Root
      
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      expect(unorderedLists).toHaveLength(1)
      
      const listItems = unorderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      expect(listItems[0].name).toBe('ListItem')
      expect(listItems[1].name).toBe('ProblemIntuitionItem')
      expect(listItems[2].name).toBe('FeatureItem')
    })
  })

  describe('special item components for ordered lists', () => {
    it('should use special components for ordered lists with data attributes', async () => {
      const content = `1. Regular step
2. Problem intuition step  
3. Feature step`
      
      // Mock ordered list with data attributes
      const mockContent = {
        type: 'root',
        children: [{
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              position: { 
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 17, offset: 16 }
              },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: '1. Regular step' }] }]
            },
            {
              type: 'listItem',
              position: { 
                start: { line: 2, column: 1, offset: 17 },
                end: { line: 2, column: 27, offset: 43 }
              },
              data: { hProperties: { 'data-item-type': 'problem-intuition' } },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: '2. Problem intuition step' }] }]
            },
            {
              type: 'listItem',
              position: { 
                start: { line: 3, column: 1, offset: 44 },
                end: { line: 3, column: 15, offset: 58 }
              },
              data: { hProperties: { 'data-item-type': 'feature' } },
              children: [{ type: 'paragraph', children: [{ type: 'text', value: '3. Feature step' }] }]
            }
          ]
        }]
      }
      
      const processor = unified().use(remarkListVariants)
      const file = new VFile({ value: content })
      const tree = await processor.run(mockContent as any, file) as Root
      
      const orderedLists = findJSXElements(tree, 'OrderedList')
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(3)
      
      expect(listItems[0].name).toBe('ListItem')
      expect(listItems[1].name).toBe('ProblemIntuitionItem')
      expect(listItems[2].name).toBe('FeatureItem')
      
      // All should have displayNumber for ordered lists
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('2')
      expect(getAttributeValue(listItems[2], 'displayNumber')).toBe('3')
    })
  })

  describe('debug output verification', () => {
    it('should output correct JSX structure for simple unordered list', async () => {
      const content = `- First item
- Second item`
      
      const tree = await processMarkdown(content)
      
      // Debug: Log the actual structure
      console.log('=== UNORDERED LIST PLUGIN OUTPUT ===')
      console.log(JSON.stringify(tree, null, 2))
      
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      expect(unorderedLists).toHaveLength(1)
      
      const listItems = unorderedLists[0].children
      expect(listItems).toHaveLength(2)
      
      // Verify first item - should have level but NO displayNumber
      expect(listItems[0].name).toBe('ListItem')
      expect(getAttributeValue(listItems[0], 'level')).toBe(1)
      expect(listItems[0].attributes.find((a: any) => a.name === 'displayNumber')).toBeUndefined()
      
      // Verify second item
      expect(listItems[1].name).toBe('ListItem') 
      expect(getAttributeValue(listItems[1], 'level')).toBe(1)
      expect(listItems[1].attributes.find((a: any) => a.name === 'displayNumber')).toBeUndefined()
    })

    it('should output correct JSX structure for simple ordered list', async () => {
      const content = `1. First item
2. Second item`
      
      const tree = await processMarkdown(content)
      
      // Debug: Log the actual structure
      console.log('=== PLUGIN OUTPUT ===')
      console.log(JSON.stringify(tree, null, 2))
      
      const orderedLists = findJSXElements(tree, 'OrderedList')
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(2)
      
      // Verify first item
      expect(listItems[0].name).toBe('ListItem')
      expect(getAttributeValue(listItems[0], 'level')).toBe(1)
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1')
      
      // Verify second item
      expect(listItems[1].name).toBe('ListItem') 
      expect(getAttributeValue(listItems[1], 'level')).toBe(1)
      expect(getAttributeValue(listItems[1], 'displayNumber')).toBe('2')
    })
  })

  describe('edge cases', () => {
    it('should handle empty lists', async () => {
      const content = ``
      
      const tree = await processMarkdown(content)
      const lists = findJSXElements(tree)
      
      expect(lists).toHaveLength(0)
    })

    it('should handle lists without position information', async () => {
      const mockContent = {
        type: 'root',
        children: [{
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              // No position property - this is the test case
              children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Item without position' }] }]
            }
          ]
        }]
      }
      
      const processor = unified().use(remarkListVariants)
      const file = new VFile({ value: '1. Item without position' })
      const tree = await processor.run(mockContent as any, file) as Root
      
      const orderedLists = findJSXElements(tree, 'OrderedList')
      expect(orderedLists).toHaveLength(1)
      
      const listItems = orderedLists[0].children
      expect(listItems).toHaveLength(1)
      expect(getAttributeValue(listItems[0], 'displayNumber')).toBe('1') // Should fallback to sequential
    })

    it('should handle malformed number patterns gracefully', async () => {
      const content = `not a number. But still a list item
another. Item without proper numbering`
      
      const tree = await processMarkdown(content)
      const unorderedLists = findJSXElements(tree, 'UnorderedList')
      const orderedLists = findJSXElements(tree, 'OrderedList')
      
      // Markdown parser doesn't recognize this as a list at all - it's just paragraphs
      // So no list elements should be created
      expect(unorderedLists).toHaveLength(0)
      expect(orderedLists).toHaveLength(0)
    })
  })
})