import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UnorderedList, ListItem } from '@/components/mdx/list'

describe('UnorderedList Component', () => {
  describe('Real World MDX Scenarios', () => {
    it('should render basic unordered list from page.mdx', () => {
      render(
        <UnorderedList>
          <ListItem>Item one</ListItem>
          <ListItem>Item two</ListItem>
          <ListItem>Item three</ListItem>
          <ListItem>Item four</ListItem>
        </UnorderedList>
      )

      expect(screen.getByText('Item one')).toBeInTheDocument()
      expect(screen.getByText('Item two')).toBeInTheDocument()
      expect(screen.getByText('Item three')).toBeInTheDocument()
      expect(screen.getByText('Item four')).toBeInTheDocument()

      const list = screen.getByRole('list')
      expect(list.tagName).toBe('UL')
    })

    it('should render nested unordered list like "Item two.one"', () => {
      render(
        <UnorderedList>
          <ListItem>Item one</ListItem>
          <ListItem>
            Item two
            <UnorderedList>
              <ListItem>Item two.one</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>Item three</ListItem>
          <ListItem>Item four</ListItem>
        </UnorderedList>
      )

      expect(screen.getByText('Item one')).toBeInTheDocument()
      expect(screen.getByText('Item two')).toBeInTheDocument()
      expect(screen.getByText('Item two.one')).toBeInTheDocument()
      expect(screen.getByText('Item three')).toBeInTheDocument()
      expect(screen.getByText('Item four')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2)
      
      // Nested list should have proper indentation
      const nestedList = lists[1]
      expect(nestedList).toHaveClass('ml-4')
    })

    it('SHOULD FAIL: unordered lists should not show numbers', () => {
      const { container } = render(
        <UnorderedList>
          <ListItem>First item</ListItem>
          <ListItem>Second item</ListItem>
          <ListItem>Third item</ListItem>
        </UnorderedList>
      )

      const html = container.innerHTML
      
      // Should not have counter-related CSS for unordered lists
      expect(html).not.toContain('counter-reset')
      expect(html).not.toContain('counter-increment')
      expect(html).not.toContain('counter(ordered-counter')
      
      // Should have decorative SVG icons instead
      expect(html).toContain('<svg')
      expect(html).toContain('lucide-')
    })

    it('should use different icons for different nesting levels', () => {
      const { container } = render(
        <UnorderedList>
          <ListItem>
            Level 1 (should be Shapes icon)
            <UnorderedList>
              <ListItem>
                Level 2 (should be Minus icon)
                <UnorderedList>
                  <ListItem>Level 3 (should be ArrowRight icon)</ListItem>
                </UnorderedList>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      )

      const html = container.innerHTML
      
      // Should have different gradient classes for different levels
      expect(html).toContain('from-sky-500 to-cyan-500') // Level 1
      expect(html).toContain('from-teal-500 to-emerald-500') // Level 2  
      expect(html).toContain('from-blue-500 to-indigo-500') // Level 3
    })

    it('SHOULD FAIL: shows numbers instead of decorative icons', () => {
      const { container } = render(
        <UnorderedList>
          <ListItem>Should have decorative icon, not number</ListItem>
        </UnorderedList>
      )

      const html = container.innerHTML
      
      // This would fail if unordered lists incorrectly showed counter CSS
      expect(html).not.toContain('counter-reset')
      expect(html).not.toContain('counter-increment')
      expect(html).not.toContain('counter(')
      
      // Should have proper SVG icons
      expect(html).toContain('<svg')
      expect(html).toContain('lucide-shapes')
    })
  })

  it('renders an unordered list with items', () => {
    render(
      <UnorderedList>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </UnorderedList>
    )

    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.getByText('Third item')).toBeInTheDocument()
    
    // Should be rendered as a ul element
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
  })

  it('applies custom className', () => {
    render(
      <UnorderedList className="custom-class">
        <ListItem>Test item</ListItem>
      </UnorderedList>
    )

    const list = screen.getByRole('list')
    expect(list).toHaveClass('custom-class')
  })

  it('renders with Framer Motion animations', () => {
    render(
      <UnorderedList>
        <ListItem>Animated item</ListItem>
      </UnorderedList>
    )

    const list = screen.getByRole('list')
    // Should have motion attributes (this will be present when Framer Motion is working)
    expect(list).toBeInTheDocument()
  })

  it('supports nested lists with proper context', () => {
    render(
      <UnorderedList>
        <ListItem>
          Parent item
          <UnorderedList>
            <ListItem>Nested item 1</ListItem>
            <ListItem>Nested item 2</ListItem>
          </UnorderedList>
        </ListItem>
      </UnorderedList>
    )

    expect(screen.getByText('Parent item')).toBeInTheDocument()
    expect(screen.getByText('Nested item 1')).toBeInTheDocument()
    expect(screen.getByText('Nested item 2')).toBeInTheDocument()
    
    // Should have nested ul elements
    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2) // Parent and nested list
  })

  it('renders list items with proper styling and icons', () => {
    render(
      <UnorderedList>
        <ListItem>Item with icon</ListItem>
      </UnorderedList>
    )

    const listItem = screen.getByText('Item with icon').closest('li')
    expect(listItem).toBeInTheDocument()
    
    // Should have proper styling classes
    expect(listItem).toHaveClass('flex')
  })

  it('handles header items (items ending with colon)', () => {
    render(
      <UnorderedList>
        <ListItem>Header Item:</ListItem>
        <ListItem>Regular item</ListItem>
      </UnorderedList>
    )

    expect(screen.getByText('Header Item:')).toBeInTheDocument()
    expect(screen.getByText('Regular item')).toBeInTheDocument()
  })
})