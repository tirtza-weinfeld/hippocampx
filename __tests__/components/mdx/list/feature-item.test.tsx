import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureItem } from '@/components/mdx/list/feature-list'
import { ListContext } from '@/components/mdx/list/list-context'
import React from 'react'

/**
 * Component Test: FeatureItem
 * 
 * Tests the FeatureItem component in isolation.
 * This component should render list items with special "feature" styling.
 * 
 * NOTE: This test will fail initially because FeatureItem doesn't exist yet.
 */

const ListContextProvider = ({ children }: { children: React.ReactNode }) => (
  <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
    {children}
  </ListContext.Provider>
)

describe('FeatureItem Component', () => {
  describe('Basic Rendering', () => {
    it('should render with children content', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>This is a feature item</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      expect(screen.getByText('This is a feature item')).toBeInTheDocument()
    })

    it('should render as a list item element', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Feature content</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toBeInTheDocument()
      expect(listItem.tagName).toBe('LI')
    })

    it('should have data-item-type="feature" attribute', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Feature content</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'feature')
    })
  })

  describe('Styling', () => {
    it('should have feature-specific CSS classes', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Styled feature</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      
      // Should have feature-specific styling classes
      expect(listItem).toHaveClass('feature-item')
      
      // Should have enhanced styling (gradients, shadows, etc.)
      expect(listItem).toHaveClass('bg-gradient-to-r')
      expect(listItem).toHaveClass('shadow-lg')
    })

    it('should have special visual indicator for features', () => {
      const { container } = render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Feature with indicator</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      // Should have some visual indicator (icon, emoji, special marker)
      const html = container.innerHTML
      
      // Could be a star icon, checkmark, or other feature indicator
      expect(html).toMatch(/⭐|✨|🌟|⚡|✓|icon|svg/i)
    })

    it('should differentiate from regular list items visually', () => {
      const { container: featureContainer } = render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Feature item</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const { container: regularContainer } = render(
        <ListContextProvider>
          <ul>
            <li>Regular item</li>
          </ul>
        </ListContextProvider>
      )
      
      const featureHTML = featureContainer.innerHTML
      const regularHTML = regularContainer.innerHTML
      
      // Feature item should have different styling than regular items
      expect(featureHTML).not.toBe(regularHTML)
      expect(featureHTML).toContain('data-item-type="feature"')
      expect(regularHTML).not.toContain('data-item-type="feature"')
    })
  })

  describe('Props and API', () => {
    it('should accept className prop for additional styling', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem className="custom-feature-class">
              Custom styled feature
            </FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveClass('custom-feature-class')
    })

    it('should forward other props to the li element', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem data-testid="feature-test" title="Feature tooltip">
              Feature with props
            </FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByTestId('feature-test')
      expect(listItem).toHaveAttribute('title', 'Feature tooltip')
    })

    it('should accept ReactNode children (not just strings)', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>
              <span>Complex</span> <strong>feature</strong> <em>content</em>
            </FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('feature')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
      
      // Should preserve HTML structure
      const strong = screen.getByText('feature')
      expect(strong.tagName).toBe('STRONG')
    })
  })

  describe('Accessibility', () => {
    it('should be properly accessible to screen readers', () => {
      render(
        <ListContextProvider>
          <ul role="list">
            <FeatureItem>Accessible feature item</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toBeInTheDocument()
      
      // Should not interfere with list semantics
      const list = screen.getByRole('list')
      expect(list).toContain(listItem)
    })

    it('should support aria-label for additional context', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem aria-label="Key feature: Enhanced performance">
              Enhanced performance
            </FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('aria-label', 'Key feature: Enhanced performance')
    })
  })

  describe('Interaction', () => {
    it('should support hover effects', () => {
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem>Hoverable feature</FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      
      // Should have hover-related classes
      expect(listItem.className).toMatch(/hover:|transition|duration/)
    })

    it('should support click interactions without interfering with content', () => {
      const handleClick = vi.fn()
      
      render(
        <ListContextProvider>
          <ul>
            <FeatureItem onClick={handleClick}>
              Clickable feature
            </FeatureItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      listItem.click()
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Context Integration', () => {
    it('should work within ordered lists', () => {
      render(
        <ListContext.Provider value={{ level: 0, type: 'ordered' as const, isDecimalList: false }}>
          <ol>
            <FeatureItem>Feature in ordered list</FeatureItem>
          </ol>
        </ListContext.Provider>
      )
      
      expect(screen.getByText('Feature in ordered list')).toBeInTheDocument()
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'feature')
    })

    it('should work within unordered lists', () => {
      render(
        <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
          <ul>
            <FeatureItem>Feature in unordered list</FeatureItem>
          </ul>
        </ListContext.Provider>
      )
      
      expect(screen.getByText('Feature in unordered list')).toBeInTheDocument()
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'feature')
    })

    it('should adapt styling based on list context', () => {
      const { container: orderedContainer } = render(
        <ListContext.Provider value={{ level: 0, type: 'ordered' as const, isDecimalList: false }}>
          <ol>
            <FeatureItem>Ordered feature</FeatureItem>
          </ol>
        </ListContext.Provider>
      )
      
      const { container: unorderedContainer } = render(
        <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
          <ul>
            <FeatureItem>Unordered feature</FeatureItem>
          </ul>
        </ListContext.Provider>
      )
      
      // Both should be feature items but may have different contexts
      expect(orderedContainer.innerHTML).toContain('data-item-type="feature"')
      expect(unorderedContainer.innerHTML).toContain('data-item-type="feature"')
    })
  })
})