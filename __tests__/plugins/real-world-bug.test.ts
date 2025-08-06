import { describe, it, expect } from 'vitest'
import remarkListVariants from '@/plugins/remark-list-variants'

describe('Real world bug reproduction', () => {
  it('reproduces the HTML concatenation bug', () => {
    // This test reproduces the exact issue you showed in the HTML output
    // The bug is that content gets concatenated: "Item 1\n-- Item 2\n-- Item 3"
    
    // Create a more realistic MDX AST structure that might come from actual parsing
    const tree = {
      type: 'root',
      children: [
        // This simulates what the MDX parser might actually create
        {
          type: 'paragraph',
          children: [
            { 
              type: 'text', 
              value: '-- Item 1\n-- Item 2\n-- Item 3' // All in one text node - the bug!
            }
          ]
        }
      ]
    }

    const transformer = remarkListVariants()
    // @ts-ignore - simplified test call
    transformer(tree)

    console.log('Real world AST result:', JSON.stringify(tree, null, 2))

    // This should show the bug - the plugin doesn't handle multi-line text nodes correctly
    const compactList = tree.children.find((node: any) => 
      node.type === 'mdxJsxFlowElement' && node.name === 'CompactList'
    )
    
    if (compactList) {
      // If the plugin processed it, check if it correctly split the content
      console.log('CompactList children:', compactList.children)
      
      // This will reveal whether the plugin handles concatenated text correctly
      const firstItem = compactList.children[0]
      console.log('First item text:', firstItem?.children[0]?.value)
      
      // The bug: all content is in one item instead of split
      expect(compactList.children).toHaveLength(3) // This should fail
    } else {
      console.log('Plugin did not transform the content - this is the actual bug!')
      // The real bug might be that the plugin doesn't match this AST structure
    }
  })

  it('shows what the plugin expects vs what it gets', () => {
    // What our current tests create (works)
    const testAST = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'text', value: '-- Item 1' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '-- Item 2' }] },
        { type: 'paragraph', children: [{ type: 'text', value: '-- Item 3' }] }
      ]
    }

    // What real MDX might create (broken)
    const realWorldAST = {
      type: 'root', 
      children: [
        {
          type: 'paragraph',
          children: [{ 
            type: 'text', 
            value: '-- Item 1\n-- Item 2\n-- Item 3' 
          }]
        }
      ]
    }

    const transformer = remarkListVariants()
    
    // Test both - create deep copies
    const testASTCopy = JSON.parse(JSON.stringify(testAST))
    const realWorldASTCopy = JSON.parse(JSON.stringify(realWorldAST))
    
    // @ts-ignore
    transformer(testASTCopy)
    // @ts-ignore  
    transformer(realWorldASTCopy)

    console.log('Test AST result:', JSON.stringify(testASTCopy, null, 2))
    console.log('Real world AST result:', JSON.stringify(realWorldASTCopy, null, 2))
  })
})