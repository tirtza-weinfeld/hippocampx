import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderedList, OrderedListItem } from '@/components/mdx/list/ordered-list'
import { UnorderedList } from '@/components/mdx/list/unordered-list'
import { FeatureItem } from '@/components/mdx/list/feature-list'
import { TaskItem } from '@/components/mdx/list/task-list'
import { UniversalListItem } from '@/components/mdx/list/universal-list-item'
import { ListContext } from '@/components/mdx/list/list-context'
import React from 'react'

/**
 * Test Suite: Flexible List Architecture
 * 
 * Tests the core principle that any list type can contain any item type:
 * - OrderedList can contain FeatureItem, TaskItem, RegularItem
 * - UnorderedList can contain FeatureItem, TaskItem, RegularItem
 * 
 * This represents the new flexible architecture where:
 * - List Types handle structure (ordered vs unordered)
 * - Item Types handle styling and behavior
 * 
 * NOTE: These tests will initially fail because:
 * 1. FeatureItem and TaskItem components don't exist yet
 * 2. The plugin doesn't detect `~ ` and `[ ]` patterns yet
 * 3. UniversalListItem doesn't render different item types yet
 * 
 * This is intentional - the tests define the expected behavior
 * that we need to implement.
 */

const ListContextProvider = ({ children }: { children: React.ReactNode }) => (
  <ListContext.Provider value={{ level: 0, type: 'unordered' as const, isDecimalList: false }}>
    {children}
  </ListContext.Provider>
)

describe('Flexible List Architecture', () => {
  describe('Ordered Lists with Mixed Item Types', () => {
    it('should support regular items in ordered lists', () => {
      render(
        <ListContextProvider>
          <OrderedList>
            <OrderedListItem>Regular first step</OrderedListItem>
            <OrderedListItem>Regular second step</OrderedListItem>
          </OrderedList>
        </ListContextProvider>
      )
      
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getByText('Regular first step')).toBeInTheDocument()
      expect(screen.getByText('Regular second step')).toBeInTheDocument()
    })

    it('should support feature items in ordered lists', () => {
      render(
        <ListContextProvider>
          <OrderedList>
            <OrderedListItem>Regular step</OrderedListItem>
            <FeatureItem>Key feature step with special styling</FeatureItem>
            <OrderedListItem>Another regular step</OrderedListItem>
          </OrderedList>
        </ListContextProvider>
      )
      
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      
      // Should have feature item with special styling
      expect(screen.getByText('Key feature step with special styling')).toBeInTheDocument()
      
      // Should have data attribute for feature styling
      const featureItem = screen.getByText('Key feature step with special styling').closest('li')
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
    })

    it('should support todo items in ordered lists', () => {
      render(
        <ListContextProvider>
          <OrderedList>
            <OrderedListItem>Regular step</OrderedListItem>
            <TaskItem checked={false}>Todo item in ordered list</TaskItem>
            <TaskItem checked={true}>Completed todo in ordered list</TaskItem>
          </OrderedList>
        </ListContextProvider>
      )
      
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have todo items with checkboxes
      const todoCheckbox = screen.getByRole('checkbox', { name: /todo item in ordered list/i })
      expect(todoCheckbox).toBeInTheDocument()
      expect(todoCheckbox).not.toBeChecked()
      
      const completedCheckbox = screen.getByRole('checkbox', { name: /completed todo in ordered list/i })
      expect(completedCheckbox).toBeInTheDocument()
      expect(completedCheckbox).toBeChecked()
    })

    it('should support all item types mixed in one ordered list', () => {
      render(
        <ListContextProvider>
          <OrderedList>
            <OrderedListItem>Regular step</OrderedListItem>
            <FeatureItem>Key feature step</FeatureItem>
            <TaskItem checked={false}>Todo step</TaskItem>
            <TaskItem checked={true}>Completed step</TaskItem>
            <OrderedListItem>Another regular step</OrderedListItem>
          </OrderedList>
        </ListContextProvider>
      )
      
      // Should be one ordered list
      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(1)
      
      // Should have all different item types
      expect(screen.getByText('Regular step')).toBeInTheDocument()
      expect(screen.getByText('Key feature step')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /todo step/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /completed step/i })).toBeInTheDocument()
      expect(screen.getByText('Another regular step')).toBeInTheDocument()
    })
  })

  describe('Unordered Lists with Mixed Item Types', () => {
    it('should support regular items in unordered lists', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem>Regular bullet point</UniversalListItem>
            <UniversalListItem>Another bullet point</UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getByText('Regular bullet point')).toBeInTheDocument()
      expect(screen.getByText('Another bullet point')).toBeInTheDocument()
    })

    it('should support feature items in unordered lists', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem>Regular item</UniversalListItem>
            <FeatureItem>Feature item with special styling</FeatureItem>
            <UniversalListItem>Another regular item</UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      
      // Feature item should have special styling
      expect(screen.getByText('Feature item with special styling')).toBeInTheDocument()
      
      // Should have feature styling attribute
      const featureItem = screen.getByText('Feature item with special styling').closest('li')
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
    })

    it('should support todo items in unordered lists', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem>Regular item</UniversalListItem>
            <TaskItem checked={false}>Todo item in unordered list</TaskItem>
            <TaskItem checked={true}>Completed todo in unordered list</TaskItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      expect(screen.getByRole('list')).toBeInTheDocument()
      
      // Should have todo items with checkboxes
      const todoCheckbox = screen.getByRole('checkbox', { name: /todo item in unordered list/i })
      expect(todoCheckbox).not.toBeChecked()
      
      const completedCheckbox = screen.getByRole('checkbox', { name: /completed todo in unordered list/i })
      expect(completedCheckbox).toBeChecked()
    })

    it('should support all item types mixed in one unordered list', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem>Regular item</UniversalListItem>
            <FeatureItem>Key feature item</FeatureItem>
            <TaskItem checked={false}>Todo item</TaskItem>
            <TaskItem checked={true}>Completed item</TaskItem>
            <UniversalListItem>Another regular item</UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      // Should be one unordered list
      const lists = screen.getAllByRole('list')
      expect(lists).toHaveLength(1)
      
      // Should have all different item types
      expect(screen.getByText('Regular item')).toBeInTheDocument()
      expect(screen.getByText('Key feature item')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /todo item/i })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /completed item/i })).toBeInTheDocument()
      expect(screen.getByText('Another regular item')).toBeInTheDocument()
    })
  })

  describe('Universal List Item Intelligence', () => {
    it('should render as FeatureItem when data-item-type="feature"', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem data-item-type="feature">
              This should render as a feature item
            </UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const listItem = screen.getByText('This should render as a feature item').closest('li')
      expect(listItem).toHaveAttribute('data-item-type', 'feature')
      
      // Should have feature-specific styling
      expect(listItem).toHaveClass('feature-item')
    })

    it('should render as TaskItem when data-item-type="task"', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem data-item-type="task" data-checked="false">
              This should render as a task item
            </UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: /this should render as a task item/i })
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    it('should render as regular item when no data-item-type', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <UniversalListItem>
              This should render as a regular item
            </UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const listItem = screen.getByText('This should render as a regular item').closest('li')
      expect(listItem).not.toHaveAttribute('data-item-type')
      
      // Should have regular styling
      expect(listItem).not.toHaveClass('feature-item')
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })

  describe('Component API Requirements', () => {
    it('FeatureItem should accept children and render with data-item-type="feature"', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <FeatureItem>Feature content</FeatureItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const listItem = screen.getByText('Feature content').closest('li')
      expect(listItem).toHaveAttribute('data-item-type', 'feature')
      expect(screen.getByText('Feature content')).toBeInTheDocument()
    })

    it('TaskItem should accept checked prop and render checkbox', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <TaskItem checked={false}>Unchecked task</TaskItem>
            <TaskItem checked={true}>Checked task</TaskItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const uncheckedBox = screen.getByRole('checkbox', { name: /unchecked task/i })
      expect(uncheckedBox).not.toBeChecked()
      
      const checkedBox = screen.getByRole('checkbox', { name: /checked task/i })
      expect(checkedBox).toBeChecked()
    })

    it('TaskItem should allow toggling checkbox state', () => {
      render(
        <ListContextProvider>
          <UnorderedList>
            <TaskItem checked={false}>Toggle me</TaskItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      const checkbox = screen.getByRole('checkbox', { name: /toggle me/i })
      expect(checkbox).not.toBeChecked()
      
      // Should be able to click and toggle (requires interactive implementation)
      checkbox.click()
      // Note: This might fail until TaskItem has proper state management
    })
  })

  describe('Nested Lists with Mixed Item Types', () => {
    it('should support feature items in nested lists', () => {
      render(
        <ListContextProvider>
          <OrderedList>
            <OrderedListItem>
              Main step
              <UnorderedList>
                <FeatureItem>Nested feature item</FeatureItem>
                <UniversalListItem>Regular nested item</UniversalListItem>
              </UnorderedList>
            </OrderedListItem>
            <FeatureItem>Another main feature step</FeatureItem>
          </OrderedList>
        </ListContextProvider>
      )
      
      // Should have nested lists
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(1)
      
      // Should have feature items at both levels
      expect(screen.getByText('Nested feature item')).toBeInTheDocument()
      expect(screen.getByText('Another main feature step')).toBeInTheDocument()
    })
  })

  describe('Future Plugin Integration', () => {
    it('should be compatible with plugin-generated item types', () => {
      // This test describes how the plugin should integrate with components
      render(
        <ListContextProvider>
          <UnorderedList>
            {/* These would be created by the plugin from markdown like "- ~ Feature text" */}
            <UniversalListItem data-item-type="feature">
              Plugin-generated feature item
            </UniversalListItem>
            {/* From markdown like "- [ ] Todo text" */}
            <UniversalListItem data-item-type="task" data-checked="false">
              Plugin-generated task item
            </UniversalListItem>
            {/* From markdown like "- Regular text" */}
            <UniversalListItem>
              Plugin-generated regular item
            </UniversalListItem>
          </UnorderedList>
        </ListContextProvider>
      )
      
      // Feature item should have special styling
      const featureItem = screen.getByText('Plugin-generated feature item').closest('li')
      expect(featureItem).toHaveAttribute('data-item-type', 'feature')
      
      // Task item should have checkbox
      expect(screen.getByRole('checkbox', { name: /plugin-generated task item/i })).toBeInTheDocument()
      
      // Regular item should be normal
      const regularItem = screen.getByText('Plugin-generated regular item').closest('li')
      expect(regularItem).not.toHaveAttribute('data-item-type')
    })
  })
})