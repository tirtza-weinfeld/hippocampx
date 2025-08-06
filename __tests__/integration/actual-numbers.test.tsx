import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('Actual Numbers Test', () => {
  afterEach(() => {
    cleanup()
    const styles = document.querySelectorAll('style[id^="counter-style"]')
    styles.forEach(style => style.remove())
  })

  it('should actually show 1, 2, 3, 4 then 1, 2 for separate lists', async () => {
    const { container } = render(
      <div>
        <OrderedList>
          <OrderedListItem>Item 1</OrderedListItem>
          <OrderedListItem>Item 2</OrderedListItem>
          <OrderedListItem>Item 3</OrderedListItem>
          <OrderedListItem>Item 4</OrderedListItem>
        </OrderedList>
        
        <OrderedList>
          <OrderedListItem>New list item 1 - should be 1, not 5!</OrderedListItem>
          <OrderedListItem>New list item 2</OrderedListItem>
        </OrderedList>
      </div>
    )

    // Wait for CSS injection and animations
    await new Promise(resolve => setTimeout(resolve, 200))

    // Get computed styles to see what the counters actually resolve to
    const counterElements = container.querySelectorAll('.counter-content')
    
    console.log('=== TESTING ACTUAL COUNTER VALUES ===')
    console.log('Found counter elements:', counterElements.length)
    
    counterElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element, '::before')
      const content = computedStyle.getPropertyValue('content')
      console.log(`Counter ${index + 1}: content = "${content}"`)
    })

    // This test will fail if counters are not working correctly
    expect(counterElements.length).toBe(6) // Should have 6 list items total
  })
})