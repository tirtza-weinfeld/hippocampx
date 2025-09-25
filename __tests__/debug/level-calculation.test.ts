import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import type { Root } from 'mdast'

describe('Level Calculation', () => {
  const processor = unified().use(remarkParse)

  it('should calculate correct levels for nested items', () => {
    const markdown = `- Level 1
    - Level 2
        - Level 3
- Back to level 1`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    console.log('Level calculation test AST:', JSON.stringify(result, null, 2))
    
    // Let's trace the structure manually
    const rootList = result.children[0] as any
    console.log('Root list has', rootList.children.length, 'items')
    
    // First item: Level 1
    const firstItem = rootList.children[0]
    console.log('First item type:', firstItem.type)
    console.log('First item has nested list:', firstItem.children.some((child: any) => child.type === 'list'))
    
    // Second item: Level 1  
    const secondItem = rootList.children[1]
    console.log('Second item type:', secondItem.type)
    console.log('Second item has nested list:', secondItem.children.some((child: any) => child.type === 'list'))
    
    // Check nested structure
    if (firstItem.children.some((child: any) => child.type === 'list')) {
      const nestedList = firstItem.children.find((child: any) => child.type === 'list')
      console.log('Nested list has', nestedList.children.length, 'items')
      
      const nestedItem = nestedList.children[0]
      console.log('Nested item type:', nestedItem.type)
      console.log('Nested item has nested list:', nestedItem.children.some((child: any) => child.type === 'list'))
    }
  })

  it('should debug why level calculation stops at 2', () => {
    const markdown = `- Level 1
    - Level 2
        - Level 3
            - Level 4
- Back to level 1`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    // Let's manually trace the nesting levels
    const rootList = result.children[0] as any
    
    // Simulate the level calculation logic
    function debugLevelCalculation(listItem: any, parent: any, depth: number = 0): number {
      console.log(`${'  '.repeat(depth)}Item at depth ${depth}:`, listItem.type)
      
      let level = 1
      let current = parent
      
      console.log(`${'  '.repeat(depth)}Starting level calculation for item at depth ${depth}`)
      
      // Traverse up the parent chain to count nesting depth
      while (current) {
        console.log(`${'  '.repeat(depth)}  Current parent type:`, current.type)
        if (current.type === 'listItem') {
          level++
          console.log(`${'  '.repeat(depth)}  Found listItem, level now:`, level)
        }
        current = current.parent
      }
      
      console.log(`${'  '.repeat(depth)}Final level for depth ${depth}:`, level)
      return level
    }
    
    // Test the first item (should be level 1)
    const firstItem = rootList.children[0]
    const level1 = debugLevelCalculation(firstItem, rootList, 0)
    console.log('Level 1 item calculated level:', level1)
    
    // Test the nested item (should be level 2)
    if (firstItem.children.some((child: any) => child.type === 'list')) {
      const nestedList = firstItem.children.find((child: any) => child.type === 'list')
      const nestedItem = nestedList.children[0]
      const level2 = debugLevelCalculation(nestedItem, nestedList, 1)
      console.log('Level 2 item calculated level:', level2)
      
      // Test the deeply nested item (should be level 3)
      if (nestedItem.children.some((child: any) => child.type === 'list')) {
        const deepList = nestedItem.children.find((child: any) => child.type === 'list')
        const deepItem = deepList.children[0]
        const level3 = debugLevelCalculation(deepItem, deepList, 2)
        console.log('Level 3 item calculated level:', level3)
        
        // Test level 4
        if (deepItem.children.some((child: any) => child.type === 'list')) {
          const deeperList = deepItem.children.find((child: any) => child.type === 'list')
          const deeperItem = deeperList.children[0]
          const level4 = debugLevelCalculation(deeperItem, deeperList, 3)
          console.log('Level 4 item calculated level:', level4)
        }
      }
    }
  })

  it('should test the updated level calculation logic', () => {
    const markdown = `- Level 1
    - Level 2
        - Level 3
            - Level 4
- Back to level 1`

    const tree = processor.parse(markdown)
    const result = processor.runSync(tree) as Root
    
    // Updated level calculation logic with debug logging
    function calculateItemLevel(listItem: any, parent: any): number {
      // Start at level 1
      let level = 1
      
      console.log('=== Level calculation debug ===')
      console.log('Starting with parent type:', parent.type)
      
      // Count how many list nodes we need to traverse to get to this item
      // Each nested list increases the level by 1
      let current = parent
      
      // Traverse up the parent chain and count list nodes
      while (current) {
        console.log('Current type:', current.type, 'Parent type:', current.parent?.type)
        
        // If this list is nested inside a listItem, we're one level deeper
        if (current.parent && current.parent.type === 'listItem') {
          level++
          console.log('Found nested list, level now:', level)
        }
        current = current.parent
      }
      
      console.log('Final level:', level)
      console.log('=== End debug ===')
      return level
    }
    
    const rootList = result.children[0] as any
    
    // Test level 1
    const firstItem = rootList.children[0]
    const level1 = calculateItemLevel(firstItem, rootList)
    console.log('Level 1 item calculated level:', level1)
    expect(level1).toBe(1)
    
    // Test level 2
    if (firstItem.children.some((child: any) => child.type === 'list')) {
      const nestedList = firstItem.children.find((child: any) => child.type === 'list')
      const nestedItem = nestedList.children[0]
      const level2 = calculateItemLevel(nestedItem, nestedList)
      console.log('Level 2 item calculated level:', level2)
      expect(level2).toBe(2)
      
      // Test level 3
      if (nestedItem.children.some((child: any) => child.type === 'list')) {
        const deepList = nestedItem.children.find((child: any) => child.type === 'list')
        const deepItem = deepList.children[0]
        const level3 = calculateItemLevel(deepItem, deepList)
        console.log('Level 3 item calculated level:', level3)
        expect(level3).toBe(3)
        
        // Test level 4
        if (deepItem.children.some((child: any) => child.type === 'list')) {
          const deeperList = deepItem.children.find((child: any) => child.type === 'list')
          const deeperItem = deeperList.children[0]
          const level4 = calculateItemLevel(deeperItem, deeperList)
          console.log('Level 4 item calculated level:', level4)
          expect(level4).toBe(4)
        }
      }
    }
  })
})
