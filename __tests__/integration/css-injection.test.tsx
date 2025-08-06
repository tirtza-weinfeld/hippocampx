import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('CSS Injection Test', () => {
  afterEach(() => {
    cleanup()
    // Clean up any injected styles
    const styles = document.querySelectorAll('style[id^="ordered-list-style"]')
    styles.forEach(style => style.remove())
  })

  it('should inject CSS with decimal number content when customNumber is provided', async () => {
    render(
      <OrderedList data-is-decimal-list="true">
        <OrderedListItem data-custom-number="1.1">
          Item one.one
        </OrderedListItem>
      </OrderedList>
    )

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if style was injected
    const styleElement = document.getElementById('ordered-list-style-1')
    expect(styleElement).toBeTruthy()
    
    if (styleElement) {
      const cssContent = styleElement.textContent || ''
      console.log('Injected CSS:', cssContent)
      
      // Should contain the decimal number in quotes
      expect(cssContent).toContain('"1.1"')
      expect(cssContent).toContain('content: "1.1"')
      expect(cssContent).not.toContain('counter(')
    }
  })

  it('should inject CSS with counter for regular items', async () => {
    render(
      <OrderedList>
        <OrderedListItem>
          Regular item
        </OrderedListItem>
      </OrderedList>
    )

    // Wait for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check if style was injected
    const styleElement = document.getElementById('ordered-list-style-1')
    expect(styleElement).toBeTruthy()
    
    if (styleElement) {
      const cssContent = styleElement.textContent || ''
      console.log('Regular CSS:', cssContent)
      
      // Should contain counter function
      expect(cssContent).toContain('counter(ordered-counter-0, decimal)')
      expect(cssContent).not.toContain('"1.1"')
    }
  })
})