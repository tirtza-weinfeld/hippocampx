import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('Counter Test', () => {
  afterEach(() => {
    cleanup()
    const styles = document.querySelectorAll('style[id^="ordered-counter-display"]')
    styles.forEach(style => style.remove())
  })

  it('should show sequential numbers for regular items', async () => {
    const { container } = render(
      <OrderedList>
        <OrderedListItem>First item</OrderedListItem>
        <OrderedListItem>Second item</OrderedListItem>
      </OrderedList>
    )

    await new Promise(resolve => setTimeout(resolve, 50))

    const html = container.innerHTML
    console.log('Counter HTML:', html)
    
    // Check if CSS was injected
    const styleElement = document.getElementById('ordered-counter-display-1')
    console.log('Style element exists:', !!styleElement)
    
    if (styleElement) {
      console.log('CSS content:', styleElement.textContent)
    }
    
    expect(html).toContain('counter-content')
    expect(html).toContain('ordered-marker-1')
  })
})