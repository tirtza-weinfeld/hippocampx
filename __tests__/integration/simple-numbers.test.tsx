import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'

describe('Simple Numbers Test', () => {
  it('should show correct numbers in spans', () => {
    const { container } = render(
      <div>
        <OrderedList>
          <OrderedListItem>Item 1</OrderedListItem>
          <OrderedListItem>Item 2</OrderedListItem>
          <OrderedListItem>Item 3</OrderedListItem>
          <OrderedListItem>Item 4</OrderedListItem>
        </OrderedList>
        
        <OrderedList>
          <OrderedListItem>New list item 1 - should be 1!</OrderedListItem>
          <OrderedListItem>New list item 2</OrderedListItem>
        </OrderedList>
      </div>
    )

    const html = container.innerHTML
    console.log('=== HTML OUTPUT ===')
    console.log(html)
    
    // Look for the actual number spans
    const numberSpans = container.querySelectorAll('span.text-white')
    console.log('=== NUMBER SPANS ===')
    numberSpans.forEach((span, index) => {
      console.log(`Span ${index + 1}: "${span.textContent}"`)
    })
    
    expect(numberSpans.length).toBe(6)
    
    // Check if the numbers are correct
    expect(numberSpans[0].textContent).toBe('1')
    expect(numberSpans[1].textContent).toBe('2') 
    expect(numberSpans[2].textContent).toBe('3')
    expect(numberSpans[3].textContent).toBe('4')
    expect(numberSpans[4].textContent).toBe('1') // This should be 1, not 5!
    expect(numberSpans[5].textContent).toBe('2')
  })
})