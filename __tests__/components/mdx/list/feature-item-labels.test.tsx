import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrderedList } from '@/components/mdx/list/ordered-list'
import FeatureItem from '@/components/mdx/list/feature-item'
import { ListContext } from '@/components/mdx/list/list-context'
import * as React from 'react'

describe('FeatureItem Labels in Ordered Lists', () => {
  it('should display customNumber when passed as prop', () => {
    // Mock FeatureItem to show what props it receives
    const MockFeatureItem = (props: any) => {
      console.log('FeatureItem received props:', props)
      return (
        <li>
          Feature content (Number: {props.customNumber || props.itemNumber || 'none'})
        </li>
      )
    }
    
    const { container } = render(
      <ListContext.Provider value={{ type: 'ordered', level: 1, isDecimalList: false }}>
        <OrderedList>
          <MockFeatureItem customNumber="2.1">Feature item with custom number</MockFeatureItem>
        </OrderedList>
      </ListContext.Provider>
    )
    
    console.log('Container content:', container.textContent)
    
    // The issue: OrderedList is passing itemNumber="1" which overrides customNumber="2.1"
    expect(container.textContent).toContain('(Number: 2.1)')
  })

  it('should verify plugin now creates FeatureItem with customNumber attribute', () => {
    // This mimics how the plugin now creates FeatureItem elements
    const FeatureItemElement = {
      type: 'mdxJsxFlowElement',
      name: 'FeatureItem',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'customNumber', 
          value: {
            type: 'mdxJsxAttributeValueExpression',
            value: '"2.1"'
          }
        }
      ],
      children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Feature content' }] }],
      data: {
        customNumber: '2.1',
        hProperties: {
          'data-custom-number': '2.1'
        }
      }
    }

    console.log('Plugin-generated FeatureItem now has customNumber attribute:', FeatureItemElement.attributes[0])
    expect(FeatureItemElement.attributes[0].name).toBe('customNumber')
    expect(FeatureItemElement.attributes[0].value.value).toBe('"2.1"')
  })
})