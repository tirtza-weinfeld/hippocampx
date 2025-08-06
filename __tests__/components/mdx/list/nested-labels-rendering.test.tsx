import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrderedList } from '@/components/mdx/list/ordered-list'
import { ListItem } from '@/components/mdx/list/list-item'
import * as React from 'react'

describe('Nested List Labels Rendering', () => {
  it('should pass customNumber prop from data attributes to ListItem', () => {
    const { container } = render(
      <OrderedList>
        <ListItem>Main item</ListItem>
        <OrderedList data-is-decimal-list="true">
          <ListItem data-custom-number="1.1">Nested item 1.1</ListItem>
          <ListItem data-custom-number="1.2">Nested item 1.2</ListItem>
        </OrderedList>
      </OrderedList>
    )
    
    // Check that the numbers are displayed in the rendered output
    const numberElements = container.querySelectorAll('span')
    const numbers = Array.from(numberElements).map(el => el.textContent).filter(Boolean)
    
    console.log('Rendered numbers:', numbers)
    
    // Should contain the decimal numbers
    expect(numbers).toContain('1.1')
    expect(numbers).toContain('1.2')
  })

  it('should now pass customNumber prop correctly', () => {
    // Mock ListItem to show what props it receives
    const MockListItem = (props: any) => {
      console.log('ListItem props:', props)
      return <li>{props.children} (Number: {props.customNumber || props.itemNumber || 'none'})</li>
    }
    
    const { container } = render(
      <OrderedList>
        <MockListItem data-custom-number="1.1">Item with data-custom-number</MockListItem>
      </OrderedList>
    )
    
    // This test verifies that data-custom-number is now passed as customNumber prop
    expect(container.textContent).toContain('(Number: 1.1)')
  })
})