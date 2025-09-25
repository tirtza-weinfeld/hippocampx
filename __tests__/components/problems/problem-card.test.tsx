import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ProblemMetadata } from '@/lib/types/problem-metadata'

import { ProblemCard } from '@/components/problems/problem-card'

const mockProblem: ProblemMetadata = {
  id: 'backtrack-solveNQueens',
  title: 'N-Queens',
  description: 'Place n queens on an n x n board such that no two queens threaten each other.',
  leetcodeUrl: 'https://leetcode.com/problems/n-queens/',
  leetcodeNumber: 51,
  difficulty: 'hard',
  topics: ['Backtrack', 'Game'],
  timeComplexity: 'O(N!)',
  spaceComplexity: 'O(N)',
  insight: 'Backtrack with State Tracking ♛',
  functionName: 'solveNQueens',
  sourceFile: 'backend/algorithms/backtrack.py',
  className: 'Backtrack'
}

describe('ProblemCard', () => {
  it('should render problem title and description', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText('N-Queens')).toBeInTheDocument()
    expect(screen.getByText(/Place n queens on an n x n board/)).toBeInTheDocument()
  })

  it('should display difficulty badge with correct styling', () => {
    render(<ProblemCard problem={mockProblem} />)

    const difficultyBadge = screen.getByText('hard')
    expect(difficultyBadge).toBeInTheDocument()
    expect(difficultyBadge).toHaveClass('difficulty-hard')
  })

  it('should render all topics as badges', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText('Backtrack')).toBeInTheDocument()
    expect(screen.getByText('Game')).toBeInTheDocument()
  })

  it('should display leetcode number and link', () => {
    render(<ProblemCard problem={mockProblem} />)

    const leetcodeLink = screen.getByRole('link', { name: /51/i })
    expect(leetcodeLink).toBeInTheDocument()
    expect(leetcodeLink).toHaveAttribute('href', 'https://leetcode.com/problems/n-queens/')
    expect(leetcodeLink).toHaveAttribute('target', '_blank')
    expect(leetcodeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should show time complexity when provided', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText('O(N!)')).toBeInTheDocument()
  })

  it('should show space complexity when provided', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText('O(N)')).toBeInTheDocument()
  })

  it('should display source file and function name', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText(/backtrack\.py/)).toBeInTheDocument()
    expect(screen.getByText(/solveNQueens/)).toBeInTheDocument()
  })

  it('should show class name when provided', () => {
    render(<ProblemCard problem={mockProblem} />)

    expect(screen.getByText(/Backtrack/)).toBeInTheDocument()
  })

  it('should handle problem without optional fields', () => {
    const minimalProblem: ProblemMetadata = {
      id: 'simple-test',
      title: 'Simple Problem',
      description: 'A basic problem.',
      difficulty: 'easy',
      topics: ['Basic'],
      functionName: 'simpleFunction',
      sourceFile: 'backend/algorithms/simple.py'
    }

    render(<ProblemCard problem={minimalProblem} />)

    expect(screen.getByText('Simple Problem')).toBeInTheDocument()
    expect(screen.getByText('A basic problem.')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should expand to show insight on click', async () => {
    const user = userEvent.setup()
    render(<ProblemCard problem={mockProblem} />)

    // Initially insight should not be visible
    expect(screen.queryByText(/Backtrack with State Tracking/)).not.toBeInTheDocument()

    // Click to expand
    const expandButton = screen.getByRole('button', { name: /expand/i })
    await user.click(expandButton)

    expect(screen.getByText(/Backtrack with State Tracking/)).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ProblemCard problem={mockProblem} />)

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-label', 'N-Queens problem card')

    const expandButton = screen.getByRole('button')
    expect(expandButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should handle different difficulty colors', () => {
    const { rerender } = render(<ProblemCard problem={mockProblem} />)
    expect(screen.getByText('hard')).toHaveClass('difficulty-hard')

    const mediumProblem = { ...mockProblem, difficulty: 'medium' as const }
    rerender(<ProblemCard problem={mediumProblem} />)
    expect(screen.getByText('medium')).toHaveClass('difficulty-medium')

    const easyProblem = { ...mockProblem, difficulty: 'easy' as const }
    rerender(<ProblemCard problem={easyProblem} />)
    expect(screen.getByText('easy')).toHaveClass('difficulty-easy')
  })

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<ProblemCard problem={mockProblem} />)

    const expandButton = screen.getByRole('button')
    
    // Focus the expand button
    await user.tab()
    expect(expandButton).toHaveFocus()

    // Press Enter to expand
    await user.keyboard('{Enter}')
    expect(screen.getByText(/Backtrack with State Tracking/)).toBeInTheDocument()
    expect(expandButton).toHaveAttribute('aria-expanded', 'true')
  })
})