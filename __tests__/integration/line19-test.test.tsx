import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('Line 19 Test - New List Reset', () => {
  afterEach(() => {
    cleanup()
    const styles = document.querySelectorAll('style[id^="ordered-counter-display"]')
    styles.forEach(style => style.remove())
  })

  it('should reset to 1 for new list (line 19 scenario)', async () => {
    const { container } = render(
      <div>
        {/* First list - should end at 4 */}
        <OrderedList>
          <OrderedListItem>Item one</OrderedListItem>
          <OrderedListItem>Item two</OrderedListItem>
          <OrderedListItem>Item three</OrderedListItem>
          <OrderedListItem>Item four</OrderedListItem>
        </OrderedList>
        
        {/* Second list - should start at 1 (this is line 19) */}
        <OrderedList>
          <OrderedListItem>Item one - this should start a new list</OrderedListItem>
          <OrderedListItem>Item two</OrderedListItem>
        </OrderedList>
      </div>
    )

    await new Promise(resolve => setTimeout(resolve, 50))

    const html = container.innerHTML
    console.log('=== LINE 19 TEST HTML ===')
    console.log(html)
    
    // Check that we have two different counter names
    const counterResets = html.match(/counter-reset: ([^;]+)/g)
    console.log('Counter resets found:', counterResets)
    
    // Should have two different unique counter names
    expect(counterResets).toBeTruthy()
    expect(counterResets?.length).toBe(2)
    
    // The counter names should be different (ensuring separate lists)
    if (counterResets && counterResets.length === 2) {
      const firstCounter = counterResets[0]
      const secondCounter = counterResets[1]
      expect(firstCounter).not.toBe(secondCounter)
      console.log('First list counter:', firstCounter)
      console.log('Second list counter:', secondCounter)
    }
  })
})