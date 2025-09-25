import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from '@/components/mdx/parse'
import '@testing-library/jest-dom'

describe('MarkdownRenderer', () => {
  it('should render basic text without markdown', () => {
    render(<MarkdownRenderer text="Plain text without formatting" />)
    expect(screen.getByText('Plain text without formatting')).toBeInTheDocument()
  })

  it('should render bold text', () => {
    const { container } = render(<MarkdownRenderer text="This has **bold text** in it" />)
    const strongElement = container.querySelector('strong')
    expect(strongElement).toBeInTheDocument()
    expect(strongElement).toHaveTextContent('bold text')
  })

  it('should render italic text', () => {
    const { container } = render(<MarkdownRenderer text="This has *italic text* in it" />)
    const emElement = container.querySelector('em')
    expect(emElement).toBeInTheDocument()
    expect(emElement).toHaveTextContent('italic text')
  })

  it('should render inline code', () => {
    const { container } = render(<MarkdownRenderer text="This has `inline code` in it" />)
    const codeElement = container.querySelector('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveTextContent('inline code')
  })

  it('should render step syntax with data attributes', () => {
    const { container } = render(<MarkdownRenderer text="This has [19!]step colored text" />)
    const stepElement = container.querySelector('[data-step]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveAttribute('data-step', 'gray') // step 19 = gray
    expect(stepElement).toHaveTextContent('step colored text')
  })

  it('should render red step syntax', () => {
    const { container } = render(<MarkdownRenderer text="This has [red!]red colored text" />)
    const stepElement = container.querySelector('[data-step="red"]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveTextContent('red colored text')
  })

  it('should render links correctly', () => {
    render(<MarkdownRenderer text="Check out [this link](https://example.com)" />)
    const linkElement = screen.getByRole('link')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', 'https://example.com')
    expect(linkElement).toHaveTextContent('this link')
    expect(linkElement).toHaveAttribute('target', '_blank') // external link
  })

  it('should render complex real-world problem definition', () => {
    const problemText = "Given a partially filled 9×9 board with digits `$1$–$9$` and `$.$` for empty cells, determine if it is valid - [19!]no duplicates in any row, column, or 3×3 sub-box."

    const { container } = render(<MarkdownRenderer text={problemText} />)

    // Should have inline code
    const codeElements = container.querySelectorAll('code')
    expect(codeElements.length).toBeGreaterThan(0)

    // Should have step colored text
    const stepElement = container.querySelector('[data-step="gray"]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveTextContent('no duplicates in any row, column, or 3×3 sub-box.')
  })

  it('should render step syntax in bold text', () => {
    const { container } = render(<MarkdownRenderer text="**[5!]This is bold with step color**" />)
    const strongElement = container.querySelector('strong')
    expect(strongElement).toBeInTheDocument()
    expect(strongElement).toHaveAttribute('data-step', 'lime') // step 5 = lime
    expect(strongElement).toHaveTextContent('This is bold with step color')
  })

  it('should render step syntax in inline code', () => {
    const { container } = render(<MarkdownRenderer text="`[3!]colored code`" />)
    const codeElement = container.querySelector('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveAttribute('data-step', 'amber') // step 3 = amber
    expect(codeElement).toHaveTextContent('colored code')
  })

  it('should handle mixed formatting', () => {
    const { container } = render(<MarkdownRenderer text="Text with **bold** and *italic* and `code` and [1!]steps" />)

    expect(container.querySelector('strong')).toHaveTextContent('bold')
    expect(container.querySelector('em')).toHaveTextContent('italic')
    expect(container.querySelector('code')).toHaveTextContent('code')
    expect(container.querySelector('[data-step="red"]')).toHaveTextContent('steps')
  })

  it('should render empty or null text gracefully', () => {
    const { container } = render(<MarkdownRenderer text="" />)
    expect(container.firstChild).toBeNull()
  })

  // Test math rendering (should show LaTeX as styled text since we're using client-side fallback)
  it('should render inline math', () => {
    const { container } = render(<MarkdownRenderer text="The complexity is $O(n^2)$" />)
    const mathElement = container.querySelector('.katex-container')
    expect(mathElement).toBeInTheDocument()
  })
})