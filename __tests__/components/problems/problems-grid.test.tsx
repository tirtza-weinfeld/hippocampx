import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ProblemMetadata, ProblemFilter, ProblemSort } from '@/lib/types/problem-metadata'

import { ProblemsGrid } from '@/components/problems/problems-grid'

const mockProblems: ProblemMetadata[] = [
  {
    id: 'backtrack-solveNQueens',
    title: 'N-Queens',
    description: 'Place n queens on an n x n board such that no two queens threaten each other.',
    leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
    leetcodeNumber: 51,
    difficulty: 'hard',
    topics: ['Backtrack', 'Game'],
    timeComplexity: 'O(N!)',
    functionName: 'solveNQueens',
    sourceFile: 'backend/algorithms/backtrack.py',
    className: 'Backtrack'
  },
  {
    id: 'bfs-levelOrder',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return its nodes\' values organized by level.',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    leetcodeNumber: 102,
    difficulty: 'medium',
    topics: ['BFS'],
    timeComplexity: 'O(N)',
    functionName: 'levelOrder',
    sourceFile: 'backend/algorithms/bfs.py'
  },
  {
    id: 'dp-minimumTotal',
    title: 'Triangle',
    description: 'Given a triangle, find the minimum path sum from top to bottom.',
    leetcodeUrl: 'https://leetcode.com/problems/triangle/',
    leetcodeNumber: 120,
    difficulty: 'medium',
    topics: ['DP'],
    timeComplexity: 'O(N)',
    functionName: 'minimumTotal',
    sourceFile: 'backend/algorithms/dp.py',
    className: 'DP'
  }
]

describe('ProblemsGrid', () => {
  it('should render all problems in a grid layout', () => {
    render(<ProblemsGrid problems={mockProblems} />)

    expect(screen.getByText('N-Queens')).toBeInTheDocument()
    expect(screen.getByText('Binary Tree Level Order Traversal')).toBeInTheDocument()
    expect(screen.getByText('Triangle')).toBeInTheDocument()
  })

  it('should display total problem count', () => {
    render(<ProblemsGrid problems={mockProblems} />)

    expect(screen.getByText('3 problems')).toBeInTheDocument()
  })

  it('should filter problems by difficulty', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    // Open difficulty filter
    const difficultyFilter = screen.getByRole('combobox', { name: /difficulty/i })
    await user.click(difficultyFilter)

    // Select hard difficulty
    await user.click(screen.getByRole('option', { name: 'hard' }))

    // Only hard problems should be visible
    expect(screen.getByText('N-Queens')).toBeInTheDocument()
    expect(screen.queryByText('Binary Tree Level Order Traversal')).not.toBeInTheDocument()
    expect(screen.queryByText('Triangle')).not.toBeInTheDocument()
    expect(screen.getByText('1 problem')).toBeInTheDocument()
  })

  it('should filter problems by topics', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    // Open topics filter
    const topicsFilter = screen.getByRole('combobox', { name: /topics/i })
    await user.click(topicsFilter)

    // Select BFS topic
    await user.click(screen.getByRole('option', { name: 'BFS' }))

    // Only BFS problems should be visible
    expect(screen.getByText('Binary Tree Level Order Traversal')).toBeInTheDocument()
    expect(screen.queryByText('N-Queens')).not.toBeInTheDocument()
    expect(screen.queryByText('Triangle')).not.toBeInTheDocument()
  })

  it('should filter problems by search term', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const searchInput = screen.getByRole('textbox', { name: /search/i })
    await user.type(searchInput, 'tree')

    // Only problems with 'tree' in title or description should be visible
    expect(screen.getByText('Binary Tree Level Order Traversal')).toBeInTheDocument()
    expect(screen.queryByText('N-Queens')).not.toBeInTheDocument()
    expect(screen.queryByText('Triangle')).not.toBeInTheDocument()
  })

  it('should sort problems by title alphabetically', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
    await user.selectOptions(sortSelect, 'title')

    const problemCards = screen.getAllByRole('article')
    const titles = problemCards.map(card => within(card).getByRole('heading').textContent)

    expect(titles[0]).toBe('Binary Tree Level Order Traversal')
    expect(titles[1]).toBe('N-Queens')
    expect(titles[2]).toBe('Triangle')
  })

  it('should sort problems by difficulty (easy -> medium -> hard)', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
    await user.selectOptions(sortSelect, 'difficulty')

    const problemCards = screen.getAllByRole('article')
    const difficulties = problemCards.map(card => 
      within(card).getByText(/easy|medium|hard/).textContent
    )

    expect(difficulties[0]).toBe('medium')
    expect(difficulties[1]).toBe('medium')
    expect(difficulties[2]).toBe('hard')
  })

  it('should sort problems by leetcode number', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
    await user.selectOptions(sortSelect, 'leetcodeNumber')

    const problemCards = screen.getAllByRole('article')
    const numbers = problemCards.map(card => {
      const link = within(card).queryByRole('link')
      return link ? parseInt(link.textContent || '0') : 0
    })

    expect(numbers[0]).toBe(51)
    expect(numbers[1]).toBe(102)
    expect(numbers[2]).toBe(120)
  })

  it('should toggle sort order between ascending and descending', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const sortOrderButton = screen.getByRole('button', { name: /sort order/i })
    
    // Initial order should be ascending
    expect(sortOrderButton).toHaveAttribute('aria-label', 'Sort ascending')

    await user.click(sortOrderButton)

    // Should toggle to descending
    expect(sortOrderButton).toHaveAttribute('aria-label', 'Sort descending')
  })

  it('should clear all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    // Apply filters
    const searchInput = screen.getByRole('textbox', { name: /search/i })
    await user.type(searchInput, 'tree')

    const difficultyFilter = screen.getByRole('combobox', { name: /difficulty/i })
    await user.click(difficultyFilter)
    await user.click(screen.getByRole('option', { name: 'medium' }))

    // Only 1 problem should be visible
    expect(screen.getByText('1 problem')).toBeInTheDocument()

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear filters/i })
    await user.click(clearButton)

    // All problems should be visible again
    expect(screen.getByText('3 problems')).toBeInTheDocument()
    expect(searchInput).toHaveValue('')
  })

  it('should handle empty results gracefully', () => {
    render(<ProblemsGrid problems={[]} />)

    expect(screen.getByText('No problems found')).toBeInTheDocument()
    expect(screen.getByText('0 problems')).toBeInTheDocument()
  })

  it('should be keyboard accessible for all interactive elements', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    // Tab through all interactive elements
    await user.tab() // Search input
    expect(screen.getByRole('textbox', { name: /search/i })).toHaveFocus()

    await user.tab() // Difficulty filter
    expect(screen.getByRole('combobox', { name: /difficulty/i })).toHaveFocus()

    await user.tab() // Topics filter
    expect(screen.getByRole('combobox', { name: /topics/i })).toHaveFocus()

    await user.tab() // Sort select
    expect(screen.getByRole('combobox', { name: /sort by/i })).toHaveFocus()

    await user.tab() // Sort order button
    expect(screen.getByRole('button', { name: /sort order/i })).toHaveFocus()

    await user.tab() // Clear filters button
    expect(screen.getByRole('button', { name: /clear filters/i })).toHaveFocus()
  })

  it('should announce filter changes to screen readers', async () => {
    const user = userEvent.setup()
    render(<ProblemsGrid problems={mockProblems} />)

    const difficultyFilter = screen.getByRole('combobox', { name: /difficulty/i })
    await user.click(difficultyFilter)
    await user.click(screen.getByRole('option', { name: 'hard' }))

    // Check for aria-live region update
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1 of 3 problems')
  })

  it('should persist filter state when problems prop changes', () => {
    const { rerender } = render(<ProblemsGrid problems={mockProblems} />)

    const searchInput = screen.getByRole('textbox', { name: /search/i })
    expect(searchInput).toHaveValue('')

    // Add more problems
    const newProblems = [...mockProblems, {
      id: 'new-problem',
      title: 'New Problem',
      description: 'A new problem.',
      difficulty: 'easy' as const,
      topics: ['New'],
      functionName: 'newFunction',
      sourceFile: 'backend/algorithms/new.py'
    }]

    rerender(<ProblemsGrid problems={newProblems} />)
    expect(screen.getByText('4 problems')).toBeInTheDocument()
  })
})