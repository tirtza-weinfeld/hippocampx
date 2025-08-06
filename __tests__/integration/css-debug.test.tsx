import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('CSS Debug Test', () => {
  afterEach(() => {
    cleanup()
    const styles = document.querySelectorAll('style[id^="counter-style"]')
    styles.forEach(style => style.remove())
  })

  it('should show the exact CSS being injected', async () => {
    render(
      <div>
        <OrderedList>
          <OrderedListItem>First list item 1</OrderedListItem>
          <OrderedListItem>First list item 2</OrderedListItem>
        </OrderedList>
        
        <OrderedList>
          <OrderedListItem>Second list item 1 - should show "1"</OrderedListItem>
        </OrderedList>
      </div>
    )

    await new Promise(resolve => setTimeout(resolve, 100))

    // Check what CSS was injected with the new naming
    const allStyles = document.querySelectorAll('style[id^="counter-style"]')
    console.log('=== ALL INJECTED STYLES (NEW) ===')
    allStyles.forEach((style, index) => {
      console.log(`Style ${index + 1} (ID: ${style.id}):`)
      console.log(style.textContent)
      console.log('---')
    })
    
    // Also check old ones in case they still exist
    const oldStyles = document.querySelectorAll('style[id^="ordered-counter-display"]')
    console.log('=== OLD STYLE FORMAT ===')
    oldStyles.forEach((style, index) => {
      console.log(`Old Style ${index + 1} (ID: ${style.id}):`)
      console.log(style.textContent)
      console.log('---')
    })
    
    console.log('Total new styles:', allStyles.length)
    console.log('Total old styles:', oldStyles.length)
    
    expect(allStyles.length).toBeGreaterThan(0)
  })
})