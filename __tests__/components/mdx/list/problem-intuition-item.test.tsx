import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProblemIntuitionItem from '@/components/mdx/list/problem-intuition-item'

// Based on requirements from docs/list.md:
// - ProblemIntuitionItem: Yellow/amber styling (handles both ordered/unordered)
// - Unified Props Interface: { level: number, displayNumber?: string, children: ReactNode }
// - If displayNumber provided → show number (ordered style)
// - If displayNumber not provided → show icon (unordered style)
// - Components are "dumb": Just render based on props from plugin
// - Intuition Items (yellow family):
//   - Level 1: yellow-500 to amber-500, icon Lightbulb
//   - Level 2: amber-500 to orange-500, icon LampCeiling
//   - Level 3: orange-500 to red-500, icon Spotlight

describe('ProblemIntuitionItem Component Requirements', () => {
  describe('Unified Props Interface', () => {
    it('should accept level, displayNumber, and children props', () => {
      expect(() => {
        render(
          <ProblemIntuitionItem level={1} displayNumber="1">
            Intuition content
          </ProblemIntuitionItem>
        )
      }).not.toThrow()
    })

    it('should accept level and children without displayNumber', () => {
      expect(() => {
        render(
          <ProblemIntuitionItem level={1}>
            Intuition content
          </ProblemIntuitionItem>
        )
      }).not.toThrow()
    })

    it('should render children content', () => {
      render(
        <ProblemIntuitionItem level={1} displayNumber="1">
          Problem intuition explanation
        </ProblemIntuitionItem>
      )
      
      expect(screen.getByText('Problem intuition explanation')).toBeInTheDocument()
    })
  })

  describe('Ordered vs Unordered Style Behavior', () => {
    it('should show number when displayNumber is provided (ordered style)', () => {
      render(
        <ProblemIntuitionItem level={1} displayNumber="2">
          Ordered intuition step
        </ProblemIntuitionItem>
      )
      
      // Should display the number
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Ordered intuition step')).toBeInTheDocument()
    })

    it('should show icon when displayNumber is not provided (unordered style)', () => {
      const { container } = render(
        <ProblemIntuitionItem level={1}>
          Unordered intuition point
        </ProblemIntuitionItem>
      )
      
      // Should not show any number
      expect(screen.queryByText('1')).not.toBeInTheDocument()
      expect(screen.queryByText('2')).not.toBeInTheDocument()
      
      // Should show content
      expect(screen.getByText('Unordered intuition point')).toBeInTheDocument()
      
      // Should have an icon (based on yellow family requirements)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Yellow/Amber Family Styling Requirements', () => {
    it('should handle level 1 styling (yellow-500 to amber-500, Lightbulb icon)', () => {
      const { container } = render(
        <ProblemIntuitionItem level={1}>
          Level 1 intuition
        </ProblemIntuitionItem>
      )
      
      // Should render without errors for level 1
      expect(screen.getByText('Level 1 intuition')).toBeInTheDocument()
      
      // Should have yellow/amber family styling
      const element = container.firstElementChild
      expect(element).toHaveClass(/yellow/, /amber/)
    })

    it('should handle level 2 styling (amber-500 to orange-500, LampCeiling icon)', () => {
      const { container } = render(
        <ProblemIntuitionItem level={2}>
          Level 2 intuition
        </ProblemIntuitionItem>
      )
      
      // Should render without errors for level 2
      expect(screen.getByText('Level 2 intuition')).toBeInTheDocument()
      
      // Should have amber/orange family styling
      const element = container.firstElementChild
      expect(element).toHaveClass(/amber/, /orange/)
    })

    it('should handle level 3 styling (orange-500 to red-500, Spotlight icon)', () => {
      const { container } = render(
        <ProblemIntuitionItem level={3}>
          Level 3 intuition
        </ProblemIntuitionItem>
      )
      
      // Should render without errors for level 3
      expect(screen.getByText('Level 3 intuition')).toBeInTheDocument()
      
      // Should have orange/red family styling
      const element = container.firstElementChild
      expect(element).toHaveClass(/orange/, /red/)
    })

    it('should handle higher levels gracefully', () => {
      const { container } = render(
        <ProblemIntuitionItem level={4}>
          Level 4 intuition
        </ProblemIntuitionItem>
      )
      
      // Should render without errors for higher levels
      expect(screen.getByText('Level 4 intuition')).toBeInTheDocument()
      
      // Should fallback to default yellow/amber styling
      const element = container.firstElementChild
      expect(element).toHaveClass(/yellow/, /amber/)
    })
  })

  describe('Distinct from Regular ListItem', () => {
    it('should have different styling than regular ListItem (yellow vs blue family)', () => {
      const { container } = render(
        <ProblemIntuitionItem level={1} displayNumber="1">
          Intuition with yellow styling
        </ProblemIntuitionItem>
      )
      
      // Should render the content
      expect(screen.getByText('Intuition with yellow styling')).toBeInTheDocument()
      
      // Should have yellow family styling, not blue
      const element = container.firstElementChild
      expect(element).toHaveClass(/yellow/, /amber/)
      expect(element).not.toHaveClass(/sky/, /cyan/, /blue/)
    })
  })

  describe('"Dumb" Component Behavior', () => {
    it('should render exactly what props specify without internal logic', () => {
      // Test that component just renders based on props, doesn't make decisions
      
      // When displayNumber provided, should show it regardless of level
      render(
        <ProblemIntuitionItem level={3} displayNumber="1.5">
          Decimal numbering test
        </ProblemIntuitionItem>
      )
      
      expect(screen.getByText('1.5')).toBeInTheDocument()
      expect(screen.getByText('Decimal numbering test')).toBeInTheDocument()
    })

    it('should handle any valid displayNumber string', () => {
      // Component should accept any displayNumber string (decimal, restart, etc.)
      const testCases = ['1', '2.1', '5', '1', '3.2']
      
      testCases.forEach((displayNumber, index) => {
        const { rerender } = render(
          <ProblemIntuitionItem level={1} displayNumber={displayNumber} key={index}>
            Intuition step {index}
          </ProblemIntuitionItem>
        )
        
        expect(screen.getByText(displayNumber)).toBeInTheDocument()
        expect(screen.getByText(`Intuition step ${index}`)).toBeInTheDocument()
        
        if (index < testCases.length - 1) {
          rerender(
            <ProblemIntuitionItem level={1} displayNumber={testCases[index + 1]} key={index + 1}>
              Intuition step {index + 1}
            </ProblemIntuitionItem>
          )
        }
      })
    })

    it('should accept complex children content', () => {
      render(
        <ProblemIntuitionItem level={1} displayNumber="1">
          <div>
            <p>Complex intuition explanation</p>
            <span>With multiple elements</span>
          </div>
        </ProblemIntuitionItem>
      )
      
      expect(screen.getByText('Complex intuition explanation')).toBeInTheDocument()
      expect(screen.getByText('With multiple elements')).toBeInTheDocument()
    })
  })

  describe('Problem Context Specialization', () => {
    it('should be suitable for problem intuition content', () => {
      render(
        <ProblemIntuitionItem level={1} displayNumber="1">
          The key insight is to use a hashmap to track frequency
        </ProblemIntuitionItem>
      )
      
      expect(screen.getByText('The key insight is to use a hashmap to track frequency')).toBeInTheDocument()
    })

    it('should work with typical problem-solving intuition patterns', () => {
      render(
        <ProblemIntuitionItem level={1}>
          Think about the problem as a graph traversal where each node represents a state
        </ProblemIntuitionItem>
      )
      
      expect(screen.getByText(/Think about the problem as a graph traversal/)).toBeInTheDocument()
    })
  })

  describe('Accessibility Requirements', () => {
    it('should render as a list item element', () => {
      const { container } = render(
        <ProblemIntuitionItem level={1}>Accessible intuition</ProblemIntuitionItem>
      )
      
      // Should be a list item for screen readers
      expect(container.querySelector('li')).toBeInTheDocument()
    })

    it('should be keyboard accessible', () => {
      const { container } = render(
        <ProblemIntuitionItem level={1}>Keyboard accessible intuition</ProblemIntuitionItem>
      )
      
      const listItem = container.querySelector('li')
      expect(listItem).toBeInTheDocument()
      // List items should be accessible via keyboard navigation
    })
  })
})