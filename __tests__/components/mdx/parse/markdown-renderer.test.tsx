import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from '@/components/mdx/parse'
import '@testing-library/jest-dom'

describe('MarkdownRenderer', () => {
  it('should render basic text without markdown', () => {
    render(<MarkdownRenderer>Plain text without formatting</MarkdownRenderer>)
    expect(screen.getByText('Plain text without formatting')).toBeInTheDocument()
  })

  it('should render bold text', () => {
    const { container } = render(<MarkdownRenderer>This has **bold text** in it</MarkdownRenderer>)
    const strongElement = container.querySelector('strong')
    expect(strongElement).toBeInTheDocument()
    expect(strongElement).toHaveTextContent('bold text')
  })

  it('should render italic text', () => {
    const { container } = render(<MarkdownRenderer>This has *italic text* in it</MarkdownRenderer>)
    const emElement = container.querySelector('em')
    expect(emElement).toBeInTheDocument()
    expect(emElement).toHaveTextContent('italic text')
  })

  it('should render inline code', () => {
    const { container } = render(<MarkdownRenderer>This has `inline code` in it</MarkdownRenderer>)
    const codeElement = container.querySelector('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveTextContent('inline code')
  })

  it('should render step syntax with data attributes', () => {
    const { container } = render(<MarkdownRenderer>This has [19!](step colored text)</MarkdownRenderer>)
    const stepElement = container.querySelector('[data-step]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveAttribute('data-step', 'gray') // step 19 = gray
    expect(stepElement).toHaveTextContent('step colored text')
  })

  it('should render red step syntax', () => {
    const { container } = render(<MarkdownRenderer>This has [red!](red colored text)</MarkdownRenderer>)
    const stepElement = container.querySelector('[data-step="red"]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveTextContent('red colored text')
  })

  it('should render links correctly', () => {
    render(<MarkdownRenderer>Check out [this link](https://example.com)</MarkdownRenderer>)
    const linkElement = screen.getByRole('link')
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute('href', 'https://example.com')
    expect(linkElement).toHaveTextContent('this link')
    expect(linkElement).toHaveAttribute('target', '_blank') // external link
  })

  it('should render complex real-world problem definition', () => {
    const problemText = "Given a partially filled 9×9 board with digits `$1$–$9$` and `$.$` for empty cells, determine if it is valid - [19!](no duplicates in any row, column, or 3×3 sub-box.)"

    const { container } = render(<MarkdownRenderer>{problemText}</MarkdownRenderer>)

    // Should have inline code
    const codeElements = container.querySelectorAll('code')
    expect(codeElements.length).toBeGreaterThan(0)

    // Should have step colored text
    const stepElement = container.querySelector('[data-step="gray"]')
    expect(stepElement).toBeInTheDocument()
    expect(stepElement).toHaveTextContent('no duplicates in any row, column, or 3×3 sub-box.')
  })

  it('should render step syntax in bold text', () => {
    const { container } = render(<MarkdownRenderer>**[5!]This is bold with step color**</MarkdownRenderer>)
    const strongElement = container.querySelector('strong')
    expect(strongElement).toBeInTheDocument()
    expect(strongElement).toHaveAttribute('data-step', 'lime') // step 5 = lime
    expect(strongElement).toHaveTextContent('This is bold with step color')
  })

  it('should render step syntax in inline code', () => {
    const { container } = render(<MarkdownRenderer>`[3!]colored code`</MarkdownRenderer>)
    const codeElement = container.querySelector('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveAttribute('data-step', 'amber') // step 3 = amber
    expect(codeElement).toHaveTextContent('colored code')
  })

  it('should handle mixed formatting', () => {
    const { container } = render(<MarkdownRenderer>Text with **bold** and *italic* and `code` and [1!](steps)</MarkdownRenderer>)

    expect(container.querySelector('strong')).toHaveTextContent('bold')
    expect(container.querySelector('em')).toHaveTextContent('italic')
    expect(container.querySelector('code')).toHaveTextContent('code')
    expect(container.querySelector('[data-step="red"]')).toHaveTextContent('steps')
  })

  it('should render empty or null text gracefully', () => {
    const { container } = render(<MarkdownRenderer>{''}</MarkdownRenderer>)
    expect(container.firstChild).toBeNull()
  })

  // Test math rendering (should show LaTeX as styled text since we're using client-side fallback)
  it('should render inline math', () => {
    const { container } = render(<MarkdownRenderer>The complexity is $O(n^2)$</MarkdownRenderer>)
    const mathElement = container.querySelector('.katex-container')
    expect(mathElement).toBeInTheDocument()
  })

  // Test for the specific bug: text reordering with math expressions
  it('should maintain correct text order with multiple math expressions', () => {
    const text = "find minimum $k$ such that $\\sum_{i=1}^{n} x_i \\leq h$ where each hour"
    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)

    const fullText = container.textContent || ''
    // "where each hour" should come AFTER the math expressions
    const whereIndex = fullText.indexOf('where each hour')
    const sumIndex = fullText.indexOf('∑') // KaTeX renders summation symbol
    const kIndex = fullText.indexOf('k')

    // The word "where" should appear after the math content
    expect(whereIndex).toBeGreaterThan(sumIndex)
    expect(whereIndex).toBeGreaterThan(kIndex)
  })

  it('should render the Koko banana problem definition correctly', () => {
    const text = "Given banana piles `piles` and hour limit `h`, find the minimum eating speed $k \\in \\mathbb{N}$ such that $\\sum_{i=1}^{|piles|} \\lceil \\frac{p_i}{k} \\rceil \\leq h$ where each hour Koko eats up to `k` bananas from one pile (any leftover hour is wasted)"

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const fullText = container.textContent || ''

    // "where each hour" must come after both math expressions
    const whereIndex = fullText.indexOf('where each hour')
    expect(whereIndex).toBeGreaterThan(-1)

    // The text should contain "where each hour" after mathematical content
    // We can check that the order is: "such that" ... math ... "where each hour"
    const suchThatIndex = fullText.indexOf('such that')
    expect(suchThatIndex).toBeGreaterThan(-1)
    expect(whereIndex).toBeGreaterThan(suchThatIndex)
  })

  it('should render bold text with math inside', () => {
    const { container } = render(<MarkdownRenderer>**$k$**</MarkdownRenderer>)
    const strongElement = container.querySelector('strong')
    expect(strongElement).toBeInTheDocument()

    // The strong element should contain the math
    const mathElement = strongElement?.querySelector('.katex-container')
    expect(mathElement).toBeInTheDocument()
  })

  it('should render italic text with math inside', () => {
    const { container } = render(<MarkdownRenderer>*$x^2$*</MarkdownRenderer>)
    const emElement = container.querySelector('em')
    expect(emElement).toBeInTheDocument()

    // The em element should contain the math
    const mathElement = emElement?.querySelector('.katex-container')
    expect(mathElement).toBeInTheDocument()
  })

  // List rendering tests
  it('should render basic unordered list', () => {
    const text = `- First item
- Second item
- Third item`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(3)
  })

  it('should render basic ordered list with display numbers', () => {
    const text = `1. First item
2. Second item
3. Third item`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(3)
  })

  it('should render nested lists with correct levels', () => {
    const text = `- Level 1 item
  - Level 2 item
  - Level 2 item
- Level 1 item`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const allListItems = container.querySelectorAll('li')
    expect(allListItems.length).toBeGreaterThan(0)
  })

  it('should render collapsible list items', () => {
    const text = `- Collapsible: This is a collapsible item
- Regular item`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)

    // Check for collapsible trigger button (indicates collapsible item)
    const collapsibleTrigger = container.querySelector('button[type="button"]')
    expect(collapsibleTrigger).toBeInTheDocument()
  })

  it('should handle list items with trailing colons as header items', () => {
    const text = `- Header item:
- Regular item`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
  })

  it('should detect different list markers', () => {
    const text = `- Dash marker
+ Plus marker
* Star marker`

    const { container } = render(<MarkdownRenderer>{text}</MarkdownRenderer>)
    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(3)
  })
})