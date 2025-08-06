import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrderedList } from '@/components/mdx/list/ordered-list'
import { UniversalListItem } from '@/components/mdx/list/universal-list-item'

describe('MDX Flow Test', () => {
  it('should show correct numbers through UniversalListItem (like MDX does)', () => {
    const { container } = render(
      <div>
        <OrderedList>
          <UniversalListItem>Item 1</UniversalListItem>
          <UniversalListItem>Item 2</UniversalListItem>
          <UniversalListItem>Item 3</UniversalListItem>
          <UniversalListItem>Item 4</UniversalListItem>
        </OrderedList>
        
        <OrderedList>
          <UniversalListItem>New list item 1 - should be 1!</UniversalListItem>
          <UniversalListItem>New list item 2</UniversalListItem>
        </OrderedList>
      </div>
    )

    const html = container.innerHTML
    console.log('=== MDX FLOW HTML ===')
    console.log(html)
    
    // Look for the actual number spans
    const numberSpans = container.querySelectorAll('span.text-white')
    console.log('=== MDX NUMBER SPANS ===')
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