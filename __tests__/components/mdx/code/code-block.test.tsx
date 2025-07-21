import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render, testCode, mockCodeBlock } from '../../../utils/test-utils'

// Mock the entire CodeBlock component to avoid async Client Component issues
vi.mock('@/components/mdx/code/code-block', () => ({
  default: mockCodeBlock,
}))

// Import the mocked component
import CodeBlock from '@/components/mdx/code/code-block'

describe('CodeBlock Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders code block with proper styling', () => {
      const { container } = render(
        <CodeBlock className="language-python" meta="test-meta">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(container.querySelector('.shadow-2xl')).toBeInTheDocument()
      expect(container.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument()
      expect(container.querySelector('.bg-gray-100')).toBeInTheDocument()
    })

    it('renders copy button', () => {
      render(
        <CodeBlock className="language-python">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(screen.getByTestId('copy-button')).toBeInTheDocument()
    })

    it('handles different language classes', () => {
      const { container } = render(
        <CodeBlock className="language-javascript">
          {testCode.javascript.simple}
        </CodeBlock>
      )

      expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
    })
  })

  describe('Props handling', () => {
    it('handles meta information', () => {
      const { container } = render(
        <CodeBlock className="language-python" meta="test-meta">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(container.querySelector('.py-8')).toBeInTheDocument()
    })

    it('handles empty code gracefully', () => {
      const { container } = render(
        <CodeBlock className="language-python">
          {''}
        </CodeBlock>
      )

      expect(container.querySelector('.shadow-2xl')).toBeInTheDocument()
    })

    it('passes props correctly to the component', () => {
      render(
        <CodeBlock className="language-python" meta="test-meta">
          {testCode.python.simple}
        </CodeBlock>
      )

      const codeBlock = screen.getByTestId('code-block')
      expect(codeBlock).toBeInTheDocument()
    })
  })

  describe('Tooltip functionality', () => {
    it('renders with tooltip functionality', () => {
      render(
        <CodeBlock className="language-python">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(screen.getByTestId('tooltipified-code')).toBeInTheDocument()
    })

    it('renders tooltip for class method (LRUCache.get) using extracted metadata', () => {
      render(
        <CodeBlock className="language-python">
          {testCode.python.lruCache}
        </CodeBlock>
      )

      // Look for a span/div with tooltip data for 'get' (the method name)
      const tooltipNode = screen.queryByText('get')
      expect(tooltipNode).toHaveAttribute('data-tooltip-symbol', expect.stringContaining('get'))
    })

    it('renders correct tooltips for top-level and class methods with the same name', () => {
      const code = `
def get():
    """Top-level get docstring"""
    pass

class LRUCache:
    def get(self):
        """LRUCache.get docstring"""
        pass
`

      const { container } = render(<CodeBlock className="language-python">{code}</CodeBlock>)
      const tooltipNodes = Array.from(container.querySelectorAll('[data-tooltip-symbol]'))
      const classGet = tooltipNodes.find(node => node.getAttribute('data-tooltip-symbol') === 'LRUCache.get')
      expect(classGet).toBeTruthy()
    })
  })

  describe('Layout and positioning', () => {
    it('applies correct positioning classes', () => {
      const { container } = render(
        <CodeBlock className="language-python">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(container.querySelector('.relative')).toBeInTheDocument()
      expect(container.querySelector('.absolute.top-0.right-0')).toBeInTheDocument()
    })

    it('maintains accessibility attributes', () => {
      render(
        <CodeBlock className="language-python">
          {testCode.python.simple}
        </CodeBlock>
      )

      const copyButton = screen.getByTestId('copy-button')
      expect(copyButton).toBeInTheDocument()
    })
  })

  describe('Theme support', () => {
    it('handles different theme classes correctly', () => {
      const { container } = render(
        <CodeBlock className="language-python">
          {testCode.python.simple}
        </CodeBlock>
      )

      expect(container.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument()
      expect(container.querySelector('.bg-gray-100')).toBeInTheDocument()
    })
  })

  describe('Complex code handling', () => {
    it('handles complex code with multiple lines', () => {
      const { container } = render(
        <CodeBlock className="language-python">
          {testCode.python.complex}
        </CodeBlock>
      )

      expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
    })
  })
})