import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ListItem from '@/components/mdx/list/list-item'

describe('ListItem headerItem prop', () => {
  it('should apply header styling when headerItem is true', () => {
    render(
      <ListItem level={1} headerItem={true}>
        Introduction
      </ListItem>
    )

    const listItem = screen.getByRole('listitem')
    const textContainer = listItem.querySelector('div:last-child')
    
    expect(textContainer).toHaveClass('font-semibold')
    expect(textContainer).toHaveClass('text-em-gradient')
  })

  it('should not apply header styling when headerItem is false', () => {
    render(
      <ListItem level={1} headerItem={false}>
        Regular content
      </ListItem>
    )

    const listItem = screen.getByRole('listitem')
    const textContainer = listItem.querySelector('div:last-child')
    
    expect(textContainer).not.toHaveClass('font-semibold')
    expect(textContainer).not.toHaveClass('text-em-gradient')
  })

  it('should not apply header styling when headerItem is undefined', () => {
    render(
      <ListItem level={1}>
        Regular content
      </ListItem>
    )

    const listItem = screen.getByRole('listitem')
    const textContainer = listItem.querySelector('div:last-child')
    
    expect(textContainer).not.toHaveClass('font-semibold')
    expect(textContainer).not.toHaveClass('text-em-gradient')
  })

  it('should work with numbered items', () => {
    render(
      <ListItem level={1} displayNumber="1" headerItem={true}>
        First Header Item
      </ListItem>
    )

    const listItem = screen.getByRole('listitem')
    const textContainer = listItem.querySelector('div:last-child')
    
    expect(textContainer).toHaveClass('font-semibold')
    expect(textContainer).toHaveClass('text-em-gradient')
    
    // Should still show the number
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})