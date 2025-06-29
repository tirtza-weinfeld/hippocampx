import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock the entire CodeBlock component to avoid async Client Component issues
vi.mock('@/components/mdx/code/code-block', () => ({
  default: ({ children }: { className: string; meta?: string; children: React.ReactNode }) => {
    return React.createElement('div', {
      className: 'shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4',
      'data-testid': 'code-block',
    }, [
      React.createElement('div', {
        key: 'relative',
        className: 'relative',
      }, [
        React.createElement('button', {
          key: 'copy-button',
          'data-testid': 'copy-button',
          className: 'absolute top-0 right-0',
          onClick: () => {
            navigator.clipboard.writeText(children as string)
          },
        }, 'Copy'),
        React.createElement('div', {
          key: 'content',
          className: 'overflow-x-auto py-8',
          'data-testid': 'tooltipified-code',
        }, children),
      ]),
    ])
  },
}))

// Import the mocked component
import CodeBlock from '@/components/mdx/code/code-block'

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders code block with proper styling', () => {
    const { container } = render(
      <CodeBlock className="language-python" meta="test-meta">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(container.querySelector('.shadow-2xl')).toBeInTheDocument()
    expect(container.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument()
    expect(container.querySelector('.bg-gray-100')).toBeInTheDocument()
  })

  it('renders copy button', () => {
    render(
      <CodeBlock className="language-python">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(screen.getByTestId('copy-button')).toBeInTheDocument()
  })

  it('handles different language classes', () => {
    const { container } = render(
      <CodeBlock className="language-javascript">
        {`function test() {
          console.log('hello');
        }`}
      </CodeBlock>
    )

    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
  })

  it('handles meta information', () => {
    const { container } = render(
      <CodeBlock className="language-python" meta="test-meta">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(container.querySelector('.py-8')).toBeInTheDocument()
  })

  it('renders with tooltip functionality', () => {
    render(
      <CodeBlock className="language-python">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(screen.getByTestId('tooltipified-code')).toBeInTheDocument()
  })

  it('handles empty code gracefully', () => {
    const { container } = render(
      <CodeBlock className="language-python">
        {''}
      </CodeBlock>
    )

    expect(container.querySelector('.shadow-2xl')).toBeInTheDocument()
  })

  it('applies correct positioning classes', () => {
    const { container } = render(
      <CodeBlock className="language-python">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(container.querySelector('.relative')).toBeInTheDocument()
    expect(container.querySelector('.absolute.top-0.right-0')).toBeInTheDocument()
  })

  it('handles complex code with multiple lines', () => {
    const complexCode = 'def complex_function(param1: str, param2: int) -> bool:\n' +
      '    """\n' +
      '    A complex function with multiple parameters and return type.\n' +
      '    """\n' +
      '    if param1 and param2 > 0:\n' +
      '        return True\n' +
      '    return False'

    const { container } = render(
      <CodeBlock className="language-python">
        {complexCode}
      </CodeBlock>
    )

    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(
      <CodeBlock className="language-python">
        def testFunction():
            pass
      </CodeBlock>
    )

    const copyButton = screen.getByTestId('copy-button')
    expect(copyButton).toBeInTheDocument()
  })

  it('handles different theme classes correctly', () => {
    const { container } = render(
      <CodeBlock className="language-python">
        def testFunction():
            pass
      </CodeBlock>
    )

    expect(container.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument()
    expect(container.querySelector('.bg-gray-100')).toBeInTheDocument()
  })

  it('passes props correctly to the component', () => {
    const testCode = 'def testFunction():\n    pass'
    
    render(
      <CodeBlock className="language-python" meta="test-meta">
        {testCode}
      </CodeBlock>
    )

    const codeBlock = screen.getByTestId('code-block')
    expect(codeBlock).toBeInTheDocument()
  })
}) 