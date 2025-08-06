import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from '@/components/mdx/list/task-list'
import { ListContext } from '@/components/mdx/list/list-context'
import React from 'react'

/**
 * Component Test: TaskItem
 * 
 * Tests the TaskItem component in isolation.
 * This component should render list items with checkboxes for todo/task functionality.
 * 
 * NOTE: This test will fail initially because TaskItem doesn't exist yet.
 */

const ListContextProvider = ({ children }: { children: React.ReactNode }) => (
  <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
    {children}
  </ListContext.Provider>
)

describe('TaskItem Component', () => {
  describe('Basic Rendering', () => {
    it('should render with children content', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>This is a task item</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      expect(screen.getByText('This is a task item')).toBeInTheDocument()
    })

    it('should render as a list item element', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task content</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toBeInTheDocument()
      expect(listItem.tagName).toBe('LI')
    })

    it('should have data-item-type="task" attribute', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task content</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'task')
    })

    it('should render a checkbox input', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task with checkbox</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox.tagName).toBe('INPUT')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })
  })

  describe('Checked State', () => {
    it('should render unchecked when checked={false}', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Unchecked task</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: /unchecked task/i })
      expect(checkbox).not.toBeChecked()
    })

    it('should render checked when checked={true}', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={true}>Checked task</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: /checked task/i })
      expect(checkbox).toBeChecked()
    })

    it('should have different styling for checked vs unchecked', () => {
      const { container: uncheckedContainer } = render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Unchecked</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const { container: checkedContainer } = render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={true}>Checked</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const uncheckedHTML = uncheckedContainer.innerHTML
      const checkedHTML = checkedContainer.innerHTML
      
      // Checked items might have strikethrough, different colors, etc.
      expect(uncheckedHTML).not.toBe(checkedHTML)
    })

    it('should apply strikethrough styling to completed tasks', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={true}>Completed task</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      
      // Should have completed task styling
      expect(listItem.className).toMatch(/line-through|strikethrough|completed/)
    })
  })

  describe('Interaction', () => {
    it('should call onChange when checkbox is clicked', () => {
      const handleChange = vi.fn()
      
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false} onChange={handleChange}>
              Interactive task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should toggle from unchecked to checked', () => {
      const handleChange = vi.fn()
      
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false} onChange={handleChange}>
              Toggle task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      
      fireEvent.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should toggle from checked to unchecked', () => {
      const handleChange = vi.fn()
      
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={true} onChange={handleChange}>
              Toggle task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      
      fireEvent.click(checkbox)
      
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should support keyboard interaction', () => {
      const handleChange = vi.fn()
      
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false} onChange={handleChange}>
              Keyboard task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' })
      
      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Props and API', () => {
    it('should accept className prop for additional styling', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false} className="custom-task-class">
              Custom styled task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveClass('custom-task-class')
    })

    it('should forward other props to the li element', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem 
              checked={false} 
              data-testid="task-test" 
              title="Task tooltip"
            >
              Task with props
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByTestId('task-test')
      expect(listItem).toHaveAttribute('title', 'Task tooltip')
    })

    it('should accept ReactNode children (not just strings)', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>
              <span>Complex</span> <strong>task</strong> <em>content</em>
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('task')).toBeInTheDocument()
      expect(screen.getByText('content')).toBeInTheDocument()
      
      // Should preserve HTML structure
      const strong = screen.getByText('task')
      expect(strong.tagName).toBe('STRONG')
    })

    it('should support disabled state', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false} disabled={true}>
              Disabled task
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('should be properly accessible to screen readers', () => {
      render(
        <ListContextProvider>
          <ul role="list">
            <TaskItem checked={false}>Accessible task item</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      const checkbox = screen.getByRole('checkbox')
      
      expect(listItem).toBeInTheDocument()
      expect(checkbox).toBeInTheDocument()
      
      // Should not interfere with list semantics
      const list = screen.getByRole('list')
      expect(list).toContain(listItem)
    })

    it('should properly associate checkbox with label text', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task description text</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: /task description text/i })
      expect(checkbox).toBeInTheDocument()
    })

    it('should support aria-label for additional context', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem 
              checked={false} 
              aria-label="Mark task as complete: Review documentation"
            >
              Review documentation
            </TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('aria-label', 'Mark task as complete: Review documentation')
    })

    it('should indicate task state to screen readers', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={true}>Completed task</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      
      // Screen readers should understand this is a completed task
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Styling', () => {
    it('should have task-specific CSS classes', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Styled task</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const listItem = screen.getByRole('listitem')
      
      // Should have task-specific styling classes
      expect(listItem).toHaveClass('task-item')
    })

    it('should style checkbox appropriately', () => {
      render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task with styled checkbox</TaskItem>
          </ul>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox')
      
      // Checkbox should have custom styling
      expect(checkbox.className).not.toBe('')
      expect(checkbox.className).toMatch(/rounded|border|w-|h-/)
    })

    it('should differentiate from regular list items visually', () => {
      const { container: taskContainer } = render(
        <ListContextProvider>
          <ul>
            <TaskItem checked={false}>Task item</TaskItem>
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
      
      const taskHTML = taskContainer.innerHTML
      const regularHTML = regularContainer.innerHTML
      
      // Task item should have different styling than regular items
      expect(taskHTML).not.toBe(regularHTML)
      expect(taskHTML).toContain('data-item-type="task"')
      expect(taskHTML).toContain('type="checkbox"')
      expect(regularHTML).not.toContain('data-item-type="task"')
      expect(regularHTML).not.toContain('type="checkbox"')
    })
  })

  describe('Context Integration', () => {
    it('should work within ordered lists', () => {
      render(
        <ListContext.Provider value={{ level: 0, type: 'ordered' as const, isDecimalList: false }}>
          <ol>
            <TaskItem checked={false}>Task in ordered list</TaskItem>
          </ol>
        </ListContext.Provider>
      )
      
      expect(screen.getByText('Task in ordered list')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'task')
    })

    it('should work within unordered lists', () => {
      render(
        <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
          <ul>
            <TaskItem checked={false}>Task in unordered list</TaskItem>
          </ul>
        </ListContext.Provider>
      )
      
      expect(screen.getByText('Task in unordered list')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      
      const listItem = screen.getByRole('listitem')
      expect(listItem).toHaveAttribute('data-item-type', 'task')
    })
  })
})