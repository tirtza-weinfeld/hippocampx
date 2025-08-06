import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { compile } from '@mdx-js/mdx'
import remarkListVariants from '@/plugins/remark-list-variants'
import { mdxComponents } from '@/mdx-components'
import React from 'react'

/**
 * Integration Test: Plugin + Components
 * 
 * Tests how the remark plugin works together with React components
 * to transform markdown into the correct rendered output.
 * 
 * This tests the full pipeline:
 * Markdown → Plugin Processing → AST Transformation → React Components → Rendered HTML
 * 
 * NOTE: These tests will fail initially because:
 * 1. The plugin doesn't detect `- ~` and `- [ ]` patterns yet
 * 2. The components don't exist yet
 * 3. The integration between plugin and components isn't implemented
 */

const compileMarkdown = async (markdown: string) => {
  try {
    const compiledMDX = await compile(markdown, {
      remarkPlugins: [remarkListVariants],
      development: false,
    })
    
    // Create a component from the compiled MDX
    const MDXComponent = Function('React', ...Object.keys(mdxComponents), `return ${compiledMDX}`)(
      React,
      ...Object.values(mdxComponents)
    )
    
    return MDXComponent
  } catch (error) {
    console.error('MDX compilation error:', error)
    throw error
  }
}

describe('Flexible List Integration', () => {
  describe('Feature List Integration (- ~)', () => {
    it('should transform "- ~ text" into FeatureItem components', async () => {
      const markdown = `
- Regular item
- ~ Feature item with special styling
- Another regular item
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should render as unordered list
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have regular items
      expect(screen.getByText('Regular item')).toBeInTheDocument()
      expect(screen.getByText('Another regular item')).toBeInTheDocument()
      
      // Should have feature item WITHOUT the ~ prefix
      expect(screen.getByText('Feature item with special styling')).toBeInTheDocument()
      expect(screen.queryByText('~ Feature item with special styling')).not.toBeInTheDocument()
      
      // Feature item should have special attributes
      const featureItem = screen.getByText('Feature item with special styling').closest('li')
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
    })

    it('should handle multiple feature items in one list', async () => {
      const markdown = `
- ~ First feature
- Regular item
- ~ Second feature
- ~ Third feature
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // All feature items should be detected
      expect(screen.getByText('First feature')).toBeInTheDocument()
      expect(screen.getByText('Second feature')).toBeInTheDocument()
      expect(screen.getByText('Third feature')).toBeInTheDocument()
      
      // All should have feature attributes
      const firstFeature = screen.getByText('First feature').closest('li')
      const secondFeature = screen.getByText('Second feature').closest('li')
      const thirdFeature = screen.getByText('Third feature').closest('li')
      
      expect(firstFeature).toHaveAttribute('data-item-type', 'feature')
      expect(secondFeature).toHaveAttribute('data-item-type', 'feature')
      expect(thirdFeature).toHaveAttribute('data-item-type', 'feature')
    })

    it('should work with ordered lists too', async () => {
      const markdown = `
1. Regular step
2. ~ Key feature step
3. Another regular step
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should render as ordered list
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('OL')
      
      // Should have feature item in ordered context
      expect(screen.getByText('Key feature step')).toBeInTheDocument()
      
      const featureItem = screen.getByText('Key feature step').closest('li')
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
    })
  })

  describe('Task List Integration (- [ ])', () => {
    it('should transform "- [ ] text" into TaskItem components', async () => {
      const markdown = `
- Regular item
- [ ] Todo item
- [x] Completed item
- Another regular item
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should render as unordered list
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have regular items
      expect(screen.getByText('Regular item')).toBeInTheDocument()
      expect(screen.getByText('Another regular item')).toBeInTheDocument()
      
      // Should have task items WITHOUT the [ ] prefix
      expect(screen.getByText('Todo item')).toBeInTheDocument()
      expect(screen.getByText('Completed item')).toBeInTheDocument()
      expect(screen.queryByText('[ ] Todo item')).not.toBeInTheDocument()
      expect(screen.queryByText('[x] Completed item')).not.toBeInTheDocument()
      
      // Should have checkboxes
      const todoCheckbox = screen.getByRole('checkbox', { name: /todo item/i })
      const completedCheckbox = screen.getByRole('checkbox', { name: /completed item/i })
      
      expect(todoCheckbox).not.toBeChecked()
      expect(completedCheckbox).toBeChecked()
      
      // Task items should have special attributes
      const todoItem = screen.getByText('Todo item').closest('li')
      const completedItem = screen.getByText('Completed item').closest('li')
      
      expect(todoItem).toHaveAttribute('data-item-type', 'task')
      expect(completedItem).toHaveAttribute('data-item-type', 'task')
    })

    it('should handle various checkbox syntaxes', async () => {
      const markdown = `
- [ ] Unchecked task
- [x] Checked with x
- [X] Checked with capital X
- [-] Checked with dash (some systems use this)
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should have checkboxes for all variants
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(4)
      
      // First should be unchecked, others checked
      expect(checkboxes[0]).not.toBeChecked() // [ ]
      expect(checkboxes[1]).toBeChecked()     // [x]
      expect(checkboxes[2]).toBeChecked()     // [X]
      expect(checkboxes[3]).toBeChecked()     // [-] (if supported)
    })

    it('should work with ordered task lists', async () => {
      const markdown = `
1. Regular step
2. [ ] Task step
3. [x] Completed task step
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should render as ordered list
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('OL')
      
      // Should have task items in ordered context
      const todoCheckbox = screen.getByRole('checkbox', { name: /task step/i })
      const completedCheckbox = screen.getByRole('checkbox', { name: /completed task step/i })
      
      expect(todoCheckbox).not.toBeChecked()
      expect(completedCheckbox).toBeChecked()
    })
  })

  describe('Mixed Item Types Integration', () => {
    it('should handle all item types in one list', async () => {
      const markdown = `
- Regular item
- ~ Feature item
- [ ] Todo item
- [x] Completed item
- Another regular item
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should be one list with mixed item types
      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(1)
      
      // Should have all item types
      expect(screen.getByText('Regular item')).toBeInTheDocument()
      expect(screen.getByText('Feature item')).toBeInTheDocument()
      expect(screen.getByText('Todo item')).toBeInTheDocument()
      expect(screen.getByText('Completed item')).toBeInTheDocument()
      
      // Should have correct attributes
      const featureItem = screen.getByText('Feature item').closest('li')
      const todoItem = screen.getByText('Todo item').closest('li')
      const completedItem = screen.getByText('Completed item').closest('li')
      
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
      expect(todoItem).toHaveAttribute('data-item-type', 'task')
      expect(completedItem).toHaveAttribute('data-item-type', 'task')
      
      // Should have checkboxes for task items
      expect(screen.getByRole('checkbox', { name: /todo item/i })).not.toBeChecked()
      expect(screen.getByRole('checkbox', { name: /completed item/i })).toBeChecked()
    })

    it('should handle complex nested mixed lists', async () => {
      const markdown = `
1. Main step
   - ~ Nested feature
   - [ ] Nested todo
   - Regular nested item
2. ~ Main feature step
3. [ ] Main todo step
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should have nested lists
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(1)
      
      // Should have all item types at different levels
      expect(screen.getByText('Main step')).toBeInTheDocument()
      expect(screen.getByText('Nested feature')).toBeInTheDocument()
      expect(screen.getByText('Nested todo')).toBeInTheDocument()
      expect(screen.getByText('Regular nested item')).toBeInTheDocument()
      expect(screen.getByText('Main feature step')).toBeInTheDocument()
      expect(screen.getByText('Main todo step')).toBeInTheDocument()
      
      // Should have correct item types
      const nestedFeature = screen.getByText('Nested feature').closest('li')
      const mainFeature = screen.getByText('Main feature step').closest('li')
      
      expect(nestedFeature).toHaveAttribute('data-item-type', 'feature')
      expect(mainFeature).toHaveAttribute('data-item-type', 'feature')
      
      // Should have checkboxes
      expect(screen.getByRole('checkbox', { name: /nested todo/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /main todo step/i })).toBeInTheDocument()
    })
  })

  describe('Blockquote Integration', () => {
    it('should handle feature lists inside blockquotes', async () => {
      const markdown = `
> Regular blockquote content
> 
> - Regular item in blockquote
> - ~ Feature item in blockquote
> - [ ] Todo item in blockquote
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should have blockquote
      const blockquote = screen.getByRole('blockquote')
      expect(blockquote).toBeInTheDocument()
      
      // Should have list inside blockquote
      expect(screen.getByText('Regular item in blockquote')).toBeInTheDocument()
      expect(screen.getByText('Feature item in blockquote')).toBeInTheDocument()
      expect(screen.getByText('Todo item in blockquote')).toBeInTheDocument()
      
      // Should have correct item types
      const featureItem = screen.getByText('Feature item in blockquote').closest('li')
      const todoItem = screen.getByText('Todo item in blockquote').closest('li')
      
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
      expect(todoItem).toHaveAttribute('data-item-type', 'task')
      
      // Should have checkbox
      expect(screen.getByRole('checkbox', { name: /todo item in blockquote/i })).toBeInTheDocument()
    })
  })

  describe('Complex Content Integration', () => {
    it('should handle items with inline formatting', async () => {
      const markdown = `
- ~ **Bold feature** with *emphasis* and \`code\`
- [ ] **Bold todo** with [link](https://example.com)
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should preserve inline formatting
      expect(screen.getByText('Bold feature')).toBeInTheDocument()
      expect(screen.getByText('Bold todo')).toBeInTheDocument()
      expect(screen.getByText('emphasis')).toBeInTheDocument()
      expect(screen.getByText('code')).toBeInTheDocument()
      expect(screen.getByText('link')).toBeInTheDocument()
      
      // Should still have correct item types
      const featureItem = screen.getByText('Bold feature').closest('li')
      const todoItem = screen.getByText('Bold todo').closest('li')
      
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
      expect(todoItem).toHaveAttribute('data-item-type', 'task')
    })

    it('should handle multi-line item content', async () => {
      const markdown = `
- ~ Feature item
  with multiple lines
  of content
- [ ] Todo item
  that spans multiple
  lines as well
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should handle multi-line content
      expect(screen.getByText(/Feature item.*with multiple lines.*of content/s)).toBeInTheDocument()
      expect(screen.getByText(/Todo item.*that spans multiple.*lines as well/s)).toBeInTheDocument()
      
      // Should still have correct item types
      const items = screen.getAllByRole('listitem')
      expect(items[0]).toHaveAttribute('data-item-type', 'feature')
      expect(items[1]).toHaveAttribute('data-item-type', 'task')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed syntax gracefully', async () => {
      const markdown = `
- ~Missing space after tilde
- [ Missing closing bracket
- [x Extra stuff] after bracket
- ~ 
- [ ]
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should not crash and should render as regular items if malformed
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have some rendered content (exact behavior depends on implementation)
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBeGreaterThan(0)
    })

    it('should handle empty lists gracefully', async () => {
      const markdown = `
- 
- ~ 
- [ ] 
`
      
      const MDXComponent = await compileMarkdown(markdown)
      
      render(<MDXComponent />)
      
      // Should render without crashing
      expect(screen.getByRole('list')).toBeInTheDocument()
      const listItems = screen.getAllByRole('listitem')
      expect(listItems.length).toBe(3)
    })
  })
})