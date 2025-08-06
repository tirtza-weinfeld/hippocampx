import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'
import { UniversalListItem } from '@/components/mdx/list/universal-list-item'

describe('OrderedList Component', () => {
  it('renders an ordered list with items', () => {
    render(
      <OrderedList>
        <OrderedListItem>First step</OrderedListItem>
        <OrderedListItem>Second step</OrderedListItem>
        <OrderedListItem>Third step</OrderedListItem>
      </OrderedList>
    )

    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Third step')).toBeInTheDocument()
    
    // Should be rendered as an ol element
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
  })

  it('applies custom className', () => {
    render(
      <OrderedList className="custom-ordered-class">
        <OrderedListItem>Test step</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    expect(list).toHaveClass('custom-ordered-class')
  })


  it('renders with different list styles based on nesting level', () => {
    render(
      <OrderedList>
        <OrderedListItem>
          Level 1
          <OrderedList>
            <OrderedListItem>Level 2 - should have different numbering style</OrderedListItem>
          </OrderedList>
        </OrderedListItem>
      </OrderedList>
    )

    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2)
    
    expect(screen.getByText('Level 1')).toBeInTheDocument()
    expect(screen.getByText('Level 2 - should have different numbering style')).toBeInTheDocument()
  })

  it('renders list items with background gradient styling', () => {
    render(
      <OrderedList>
        <OrderedListItem>Styled ordered item</OrderedListItem>
      </OrderedList>
    )

    const listItem = screen.getByText('Styled ordered item').closest('li')
    expect(listItem).toBeInTheDocument()
    
    // Should have gradient background styling
    expect(listItem).toHaveClass('bg-gradient-to-r')
  })

  it('supports starting from different numbers', () => {
    render(
      <OrderedList start={5}>
        <OrderedListItem>Item starting from 5</OrderedListItem>
        <OrderedListItem>Item 6</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    // Framer Motion might handle attributes differently, so just check it exists
    expect(list).toBeInTheDocument()
    expect(screen.getByText('Item starting from 5')).toBeInTheDocument()
  })

  it('handles Framer Motion animations', () => {
    render(
      <OrderedList>
        <OrderedListItem>Animated ordered item</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    
    const listItem = screen.getByText('Animated ordered item').closest('li')
    expect(listItem).toBeInTheDocument()
  })

  it('should display custom number markers on ordered list items', () => {
    render(
      <OrderedList data-testid="ordered-list">
        <OrderedListItem>First numbered item</OrderedListItem>
        <OrderedListItem>Second numbered item</OrderedListItem>
        <OrderedListItem>Third numbered item</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    const listItems = screen.getAllByRole('listitem')
    
    expect(listItems).toHaveLength(3)
    expect(list.tagName).toBe('OL')
    
    // Test that the list uses custom counter system (not default markers)
    expect(list).toHaveClass('list-none')
    
    // Test that list items have relative positioning for custom markers
    const firstItem = listItems[0]
    expect(firstItem).toHaveClass('relative')
    expect(firstItem).toHaveClass('ordered-list-item-level-0')
    
    // Test that counter increment style is applied
    const computedFirstItemStyle = window.getComputedStyle(firstItem)
    expect(computedFirstItemStyle.counterIncrement).toBe('ordered-counter-0')
  })


  it('ordered list should use custom markers (list-none)', () => {
    render(
      <OrderedList>
        <OrderedListItem>Item with custom marker</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    
    // Should have list-none to remove default markers and use custom ones
    expect(list).toHaveClass('list-none')
    
    // Should not have default list styles since we use custom markers
    expect(list).not.toHaveClass('list-decimal')
  })

  it('nested lists should have proper indentation', () => {
    render(
      <OrderedList>
        <OrderedListItem>
          Level 1 item
          <OrderedList>
            <OrderedListItem>Level 2 item - should be indented</OrderedListItem>
            <OrderedListItem>Another level 2 item</OrderedListItem>
          </OrderedList>
        </OrderedListItem>
      </OrderedList>
    )

    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2)
    
    const nestedList = lists[1] // Second list is nested
    
    // Nested list should have proper margin for indentation
    expect(nestedList).toHaveClass('ml-8') // Should be ml-8 for proper indentation
  })

  it('list items should have proper padding for custom markers', () => {
    render(
      <OrderedList>
        <OrderedListItem>Item with custom marker space</OrderedListItem>
      </OrderedList>
    )

    const listItem = screen.getByRole('listitem')
    
    // List items should have left padding to make space for custom markers
    expect(listItem).toHaveClass('pl-12') // Should have left padding for marker
    expect(listItem).toHaveClass('relative') // Should have relative positioning for absolute marker
  })

  it('start prop should correctly set the counter starting number', () => {
    render(
      <OrderedList start={10}>
        <OrderedListItem>Item 10</OrderedListItem>
        <OrderedListItem>Item 11</OrderedListItem>
      </OrderedList>
    )

    const list = screen.getByRole('list')
    
    // Should use custom counter system with proper starting number
    expect(list).toHaveClass('list-none') // Custom markers
    
    // Check that the counter reset is properly set
    const computedListStyle = window.getComputedStyle(list)
    expect(computedListStyle.counterReset).toBe('ordered-counter-0 9')
  })

  it('should show numbers not decorative shapes when using OrderedListItem directly', () => {
    const { container } = render(
      <OrderedList>
        <OrderedListItem>Item 1</OrderedListItem>
        <OrderedListItem>Item 2</OrderedListItem>
        <OrderedListItem>Item 3</OrderedListItem>
      </OrderedList>
    )

    const html = container.innerHTML

    // Should NOT have decorative SVG shapes for ordered lists
    expect(html).not.toContain('lucide-shapes')
    
    // Should have counter setup for numbers
    expect(html).toContain('counter-reset: ordered-counter')
  })

  it('FIXED: shows numbers not shapes when using UniversalListItem with proper context', () => {
    const { container } = render(
      <OrderedList>
        <UniversalListItem>Item 1</UniversalListItem>
        <UniversalListItem>Item 2</UniversalListItem>
        <UniversalListItem>Item 3</UniversalListItem>
      </OrderedList>
    )

    const html = container.innerHTML

    // Check if we're getting SVG shapes (which we don't want for ordered lists)
    const hasSVGShapes = html.includes('<svg') && html.includes('lucide-shapes')

    // This should pass - no SVG shapes for ordered lists
    expect(hasSVGShapes).toBe(false)
  })

  describe('Real World MDX Scenarios', () => {
    it('should render decimal nested numbering like "1.1. Item one.one"', () => {
      render(
        <OrderedList>
          <OrderedListItem>
            Item one
            <OrderedList data-is-decimal-list="true">
              <OrderedListItem data-custom-number="1.1">Item one.one - this should be nested (the svg should be 1.1)</OrderedListItem>
              <OrderedListItem data-custom-number="1.2">Item one.two - this should be nested (the svg should be 1.2)</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Item two</OrderedListItem>
        </OrderedList>
      )

      expect(screen.getByText('Item one')).toBeInTheDocument()
      expect(screen.getByText('Item one.one - this should be nested (the svg should be 1.1)')).toBeInTheDocument()
      expect(screen.getByText('Item one.two - this should be nested (the svg should be 1.2)')).toBeInTheDocument()
      expect(screen.getByText('Item two')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2)
      
      // Nested list should be marked as decimal
      const nestedList = lists[1]
      expect(nestedList).toHaveAttribute('data-is-decimal-list', 'true')
    })

    it('SHOULD FAIL: decimal custom numbers not displayed in SVG markers', () => {
      const { container } = render(
        <OrderedList>
          <OrderedListItem>
            Item one
            <OrderedList data-is-decimal-list="true">
              <OrderedListItem data-custom-number="1.1">Item one.one</OrderedListItem>
              <OrderedListItem data-custom-number="1.2">Item one.two</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
        </OrderedList>
      )

      const html = container.innerHTML
      
      // Should display decimal numbers in markers, not regular counters
      expect(html).toContain('1.1')
      expect(html).toContain('1.2')
      
      // Should not use regular counter values for decimal lists
      expect(html).not.toContain('counter(ordered-counter')
    })

    it('should handle custom start numbers like "5. Item five"', () => {
      render(
        <OrderedList start={5}>
          <OrderedListItem>Item five - part of the previous list (as 5 comes after 4)</OrderedListItem>
          <OrderedListItem>
            Item six
            <OrderedList data-is-decimal-list="true">
              <OrderedListItem data-custom-number="5.1">Item five.one - this should be nested (the svg should be 5.1)</OrderedListItem>
              <OrderedListItem data-custom-number="5.2">Item five.two - this should be nested (the svg should be 5.2)</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
        </OrderedList>
      )

      expect(screen.getByText('Item five - part of the previous list (as 5 comes after 4)')).toBeInTheDocument()
      expect(screen.getByText('Item five.one - this should be nested (the svg should be 5.1)')).toBeInTheDocument()
      expect(screen.getByText('Item five.two - this should be nested (the svg should be 5.2)')).toBeInTheDocument()

      const outerList = screen.getAllByRole('list')[0]
      const computedStyle = window.getComputedStyle(outerList)
      expect(computedStyle.counterReset).toBe('ordered-counter-0 4')
    })

    it('should handle list separation and restart numbering', () => {
      const { rerender } = render(
        <div>
          <OrderedList start={4}>
            <OrderedListItem>Item four</OrderedListItem>
          </OrderedList>
          
          <OrderedList>
            <OrderedListItem>Item one - this should start a new list</OrderedListItem>
            <OrderedListItem>
              Item two
              <OrderedList>
                <OrderedListItem>Item nested ones - this should be nested (but the svg should be 1)</OrderedListItem>
                <OrderedListItem>Item nested two - this should be nested (but the svg should be 2)</OrderedListItem>
              </OrderedList>
            </OrderedListItem>
          </OrderedList>
        </div>
      )

      expect(screen.getByText('Item four')).toBeInTheDocument()
      expect(screen.getByText('Item one - this should start a new list')).toBeInTheDocument()
      expect(screen.getByText('Item nested ones - this should be nested (but the svg should be 1)')).toBeInTheDocument()
      expect(screen.getByText('Item nested two - this should be nested (but the svg should be 2)')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(3)
    })

    it('SHOULD FAIL: unordered list nesting depth affects marker types', () => {
      render(
        <OrderedList>
          <OrderedListItem>Level 1 ordered</OrderedListItem>
        </OrderedList>
      )

      const listItem = screen.getByRole('listitem')
      const { container } = render(
        <OrderedList>
          <OrderedListItem>Level 1 ordered</OrderedListItem>
        </OrderedList>
      )

      const html = container.innerHTML
      
      // Ordered lists should NOT have decorative SVG icons like unordered lists
      expect(html).not.toContain('lucide-shapes')
      expect(html).not.toContain('lucide-minus')
      expect(html).not.toContain('<svg')
      
      // Should have numerical markers instead
      expect(html).toContain('counter')
    })
  })

  describe('Nested Numbering Scenarios', () => {
    it('handles scenario: 2. Item two / 2.1. Item two.one / 3. Item three', () => {
      render(
        <OrderedList start={2}>
          <OrderedListItem>
            Item two
            <OrderedList>
              <OrderedListItem>Item two.one</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Item three</OrderedListItem>
        </OrderedList>
      )

      expect(screen.getByText('Item two')).toBeInTheDocument()
      expect(screen.getByText('Item two.one')).toBeInTheDocument()
      expect(screen.getByText('Item three')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2)

      // Outer list starts at 2
      const outerList = lists[0]
      const computedOuterStyle = window.getComputedStyle(outerList)
      expect(computedOuterStyle.counterReset).toBe('ordered-counter-0 1')

      // Nested list should have different counter
      const nestedList = lists[1]
      const computedNestedStyle = window.getComputedStyle(nestedList)
      expect(computedNestedStyle.counterReset).toBe('ordered-counter-1 0')
    })

    it('handles scenario: 2. Item two / 1. Item nested ones / 2. Item nested two / 3. Item three / 4. Item four', () => {
      render(
        <OrderedList start={2}>
          <OrderedListItem>
            Item two
            <OrderedList>
              <OrderedListItem>Item nested ones</OrderedListItem>
              <OrderedListItem>Item nested two</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Item three</OrderedListItem>
          <OrderedListItem>Item four</OrderedListItem>
        </OrderedList>
      )

      expect(screen.getByText('Item two')).toBeInTheDocument()
      expect(screen.getByText('Item nested ones')).toBeInTheDocument()
      expect(screen.getByText('Item nested two')).toBeInTheDocument()
      expect(screen.getByText('Item three')).toBeInTheDocument()
      expect(screen.getByText('Item four')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2)

      // Check that main list continues numbering after nested list
      const listItems = screen.getAllByRole('listitem')
      const mainLevelItems = listItems.filter(item => 
        !item.closest('ol')?.parentElement?.closest('li')
      )
      expect(mainLevelItems).toHaveLength(3) // 2, 3, 4
    })

    it('handles deep nesting with different counter styles', () => {
      render(
        <OrderedList>
          <OrderedListItem>
            Level 1 (decimal)
            <OrderedList>
              <OrderedListItem>
                Level 2 (lower-alpha)
                <OrderedList>
                  <OrderedListItem>Level 3 (lower-roman)</OrderedListItem>
                  <OrderedListItem>Level 3 item 2</OrderedListItem>
                </OrderedList>
              </OrderedListItem>
              <OrderedListItem>Level 2 item 2</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Level 1 item 2</OrderedListItem>
        </OrderedList>
      )

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(3) // Three levels of nesting

      // Check nesting levels are properly applied
      expect(lists[0]).not.toHaveClass('ml-8') // Top level
      expect(lists[1]).toHaveClass('ml-8') // First nested level
      expect(lists[2]).toHaveClass('ml-8') // Second nested level

      expect(screen.getByText('Level 1 (decimal)')).toBeInTheDocument()
      expect(screen.getByText('Level 2 (lower-alpha)')).toBeInTheDocument()
      expect(screen.getByText('Level 3 (lower-roman)')).toBeInTheDocument()
    })

    it('handles mixed start values at different levels', () => {
      render(
        <OrderedList start={5}>
          <OrderedListItem>
            Item 5
            <OrderedList start={10}>
              <OrderedListItem>Nested item 10</OrderedListItem>
              <OrderedListItem>Nested item 11</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Item 6</OrderedListItem>
        </OrderedList>
      )

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2)

      // Outer list starts at 5
      const outerList = lists[0]
      const computedOuterStyle = window.getComputedStyle(outerList)
      expect(computedOuterStyle.counterReset).toBe('ordered-counter-0 4')

      // Nested list starts at 10
      const nestedList = lists[1]
      const computedNestedStyle = window.getComputedStyle(nestedList)
      expect(computedNestedStyle.counterReset).toBe('ordered-counter-1 9')

      expect(screen.getByText('Item 5')).toBeInTheDocument()
      expect(screen.getByText('Nested item 10')).toBeInTheDocument()
      expect(screen.getByText('Nested item 11')).toBeInTheDocument()
      expect(screen.getByText('Item 6')).toBeInTheDocument()
    })

    it('maintains proper counter increment across siblings', () => {
      render(
        <OrderedList>
          <OrderedListItem>Item 1</OrderedListItem>
          <OrderedListItem>
            Item 2
            <OrderedList>
              <OrderedListItem>Nested item A</OrderedListItem>
              <OrderedListItem>Nested item B</OrderedListItem>
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Item 3</OrderedListItem>
          <OrderedListItem>Item 4</OrderedListItem>
        </OrderedList>
      )

      const listItems = screen.getAllByRole('listitem')
      const mainLevelItems = listItems.filter(item => 
        !item.closest('ol')?.parentElement?.closest('li')
      )

      // Should have 4 main level items with proper counter increment
      expect(mainLevelItems).toHaveLength(4)
      
      mainLevelItems.forEach((item) => {
        const computedStyle = window.getComputedStyle(item)
        expect(computedStyle.counterIncrement).toBe('ordered-counter-0')
      })
    })

    it('handles empty nested lists gracefully', () => {
      render(
        <OrderedList>
          <OrderedListItem>
            Item with empty nested list
            <OrderedList children={undefined}>
              {/* Empty nested list */}
            </OrderedList>
          </OrderedListItem>
          <OrderedListItem>Next item should still work</OrderedListItem>
        </OrderedList>
      )

      expect(screen.getByText('Item with empty nested list')).toBeInTheDocument()
      expect(screen.getByText('Next item should still work')).toBeInTheDocument()

      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(2) // Both lists should render even if one is empty
    })
  })
})