import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('Level Debug', () => {
  it('should show correct level calculation', () => {
    const { container } = render(
      <OrderedList>
        <OrderedListItem>
          Level 0 item
          <OrderedList data-is-decimal-list="true">
            <OrderedListItem data-custom-number="1.1">
              Level 1 item - should have level-1 class and level-1 CSS
            </OrderedListItem>
          </OrderedList>
        </OrderedListItem>
      </OrderedList>
    )

    const html = container.innerHTML
    console.log('=== LEVEL DEBUG HTML ===')
    console.log(html)
    
    // Find nested item
    const nestedItem = container.querySelector('[data-custom-number="1.1"]')
    expect(nestedItem).toBeTruthy()
    
    if (nestedItem) {
      const className = nestedItem.className
      console.log('Nested item class:', className)
      
      // Should have level-1 class
      expect(className).toContain('ordered-list-item-level-1')
    }
    
    // Check if correct CSS is injected
    const styleElement = document.getElementById('ordered-list-style-2') // Level 2 because nested
    if (styleElement) {
      console.log('CSS for level 2:', styleElement.textContent)
    }
  })
})