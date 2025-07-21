import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UnorderedList, OrderedList, ListItem } from '@/components/mdx/list'

describe('List Components', () => {
  it('renders an unordered list with items', () => {
    render(
      <UnorderedList>
        <ListItem>First item</ListItem>
        <ListItem>Second item</ListItem>
        <ListItem>Third item</ListItem>
      </UnorderedList>
    )

    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.getByText('Third item')).toBeInTheDocument()
  })

  it('renders an ordered list with items', () => {
    render(
      <OrderedList>
        <ListItem>First step</ListItem>
        <ListItem>Second step</ListItem>
        <ListItem>Third step</ListItem>
      </OrderedList>
    )

    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getByText('Second step')).toBeInTheDocument()
    expect(screen.getByText('Third step')).toBeInTheDocument()
  })

  it('applies custom className to list components', () => {
    render(
      <UnorderedList className="custom-ul">
        <ListItem className="custom-li">Custom item</ListItem>
      </UnorderedList>
    )

    const list = screen.getByRole('list')
    expect(list).toHaveClass('custom-ul')
    
    const item = screen.getByText('Custom item')
    expect(item.closest('li')).toHaveClass('custom-li')
  })

  it('renders nested content in list items', () => {
    render(
      <UnorderedList>
        <ListItem>
          <strong>Bold text</strong> and <em>italic text</em>
        </ListItem>
        <ListItem>
          <code>inline code</code> and regular text
        </ListItem>
      </UnorderedList>
    )

    expect(screen.getByText('Bold text')).toBeInTheDocument()
    expect(screen.getByText('italic text')).toBeInTheDocument()
    expect(screen.getByText('inline code')).toBeInTheDocument()
    expect(screen.getByText(/regular text/)).toBeInTheDocument()
  })

  it('renders multiple lists on the same page', () => {
    render(
      <div>
        <UnorderedList>
          <ListItem>Unordered item 1</ListItem>
          <ListItem>Unordered item 2</ListItem>
        </UnorderedList>
        <OrderedList>
          <ListItem>Ordered item 1</ListItem>
          <ListItem>Ordered item 2</ListItem>
        </OrderedList>
      </div>
    )

    expect(screen.getByText('Unordered item 1')).toBeInTheDocument()
    expect(screen.getByText('Unordered item 2')).toBeInTheDocument()
    expect(screen.getByText('Ordered item 1')).toBeInTheDocument()
    expect(screen.getByText('Ordered item 2')).toBeInTheDocument()
  })
}) 