import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CollapsibleSection } from '@/components/mdx/collapsible/collapsible-section'
import { CollapsibleSectionHeader } from '@/components/mdx/collapsible/collapsible-section-header'
import { CollapsibleSectionContent } from '@/components/mdx/collapsible/collapsible-section-content'

function TestCollapsibleSection({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <CollapsibleSection defaultOpen={defaultOpen}>
      <CollapsibleSectionHeader as="h2" id="test-section">
        Test Section
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        <p>This is the collapsible content</p>
      </CollapsibleSectionContent>
    </CollapsibleSection>
  )
}

describe('CollapsibleSection', () => {
  test('renders with header and content', () => {
    render(<TestCollapsibleSection defaultOpen={true} />)

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('This is the collapsible content')).toBeInTheDocument()
  })

  test('starts collapsed by default', () => {
    render(<TestCollapsibleSection />)

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.queryByText('This is the collapsible content')).not.toBeInTheDocument()
  })

  test('starts expanded when defaultOpen is true', () => {
    render(<TestCollapsibleSection defaultOpen={true} />)

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('This is the collapsible content')).toBeInTheDocument()
  })

  test('toggles content on header click', async () => {
    render(<TestCollapsibleSection />)

    const header = screen.getByRole('button', { name: /test section/i })

    // Initially collapsed
    expect(screen.queryByText('This is the collapsible content')).not.toBeInTheDocument()
    expect(header).toHaveAttribute('aria-expanded', 'false')

    // Click to expand
    fireEvent.click(header)
    expect(screen.getByText('This is the collapsible content')).toBeInTheDocument()
    expect(header).toHaveAttribute('aria-expanded', 'true')

    // Click to collapse
    fireEvent.click(header)
    expect(header).toHaveAttribute('aria-expanded', 'false')

    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText('This is the collapsible content')).not.toBeInTheDocument()
    })
  })

  test('supports keyboard navigation with Enter key', async () => {
    render(<TestCollapsibleSection />)

    const header = screen.getByRole('button', { name: /test section/i })

    // Focus the header
    header.focus()
    expect(header).toHaveFocus()

    // Press Enter to expand
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' })
    expect(screen.getByText('This is the collapsible content')).toBeInTheDocument()

    // Press Enter to collapse
    fireEvent.keyDown(header, { key: 'Enter', code: 'Enter' })

    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText('This is the collapsible content')).not.toBeInTheDocument()
    })
  })

  test('supports keyboard navigation with Space key', async () => {
    render(<TestCollapsibleSection />)

    const header = screen.getByRole('button', { name: /test section/i })

    // Focus the header
    header.focus()

    // Press Space to expand
    fireEvent.keyDown(header, { key: ' ', code: 'Space' })
    expect(screen.getByText('This is the collapsible content')).toBeInTheDocument()

    // Press Space to collapse
    fireEvent.keyDown(header, { key: ' ', code: 'Space' })

    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText('This is the collapsible content')).not.toBeInTheDocument()
    })
  })

  test('header has correct ARIA attributes', () => {
    render(<TestCollapsibleSection />)

    const header = screen.getByRole('button', { name: /test section/i })

    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(header).toHaveAttribute('aria-controls', 'test-section-content')
    expect(header).toHaveAttribute('type', 'button')
  })

  test('renders correct heading level', () => {
    render(
      <CollapsibleSection>
        <CollapsibleSectionHeader as="h3" id="test-h3">
          H3 Heading
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <p>Content</p>
        </CollapsibleSectionContent>
      </CollapsibleSection>
    )

    const heading = screen.getByRole('heading', { level: 3, name: /h3 heading/i })
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H3')
  })

  test('applies correct styling classes', () => {
    const { container } = render(<TestCollapsibleSection />)

    const section = container.querySelector('.collapsible-section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('rounded-xl')
    expect(section).toHaveClass('border')
  })

  test('header includes chevron icon', () => {
    render(<TestCollapsibleSection />)

    const header = screen.getByRole('button', { name: /test section/i })
    const chevron = header.querySelector('svg')

    expect(chevron).toBeInTheDocument()
    expect(chevron).toHaveClass('w-6')
    expect(chevron).toHaveClass('h-6')
  })

  test('works with multiple collapsible sections independently', async () => {
    render(
      <>
        <CollapsibleSection>
          <CollapsibleSectionHeader as="h2" id="section-1">
            Section 1
          </CollapsibleSectionHeader>
          <CollapsibleSectionContent>
            <p>Content 1</p>
          </CollapsibleSectionContent>
        </CollapsibleSection>

        <CollapsibleSection>
          <CollapsibleSectionHeader as="h2" id="section-2">
            Section 2
          </CollapsibleSectionHeader>
          <CollapsibleSectionContent>
            <p>Content 2</p>
          </CollapsibleSectionContent>
        </CollapsibleSection>
      </>
    )

    const header1 = screen.getByRole('button', { name: /section 1/i })
    const header2 = screen.getByRole('button', { name: /section 2/i })

    // Both initially collapsed
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    // Expand first section
    fireEvent.click(header1)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    // Expand second section
    fireEvent.click(header2)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()

    // Collapse first section
    fireEvent.click(header1)

    // Wait for exit animation to complete
    await waitFor(() => {
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })
})

describe('CollapsibleSectionHeader', () => {
  test('renders different heading levels correctly', () => {
    const headingLevels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

    headingLevels.forEach((level) => {
      const { container } = render(
        <CollapsibleSection>
          <CollapsibleSectionHeader as={level} id={`test-${level}`}>
            {`Heading ${level}`}
          </CollapsibleSectionHeader>
          <CollapsibleSectionContent>
            <p>Content</p>
          </CollapsibleSectionContent>
        </CollapsibleSection>
      )

      const heading = container.querySelector(level)
      expect(heading).toBeInTheDocument()
      expect(heading?.textContent).toBe(`Heading ${level}`)
    })
  })

  test('applies correct font sizes based on heading level', () => {
    render(
      <CollapsibleSection>
        <CollapsibleSectionHeader as="h1" id="test-h1" level="1">
          H1 Heading
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <p>Content</p>
        </CollapsibleSectionContent>
      </CollapsibleSection>
    )

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-3xl')
  })
})

describe('CollapsibleSectionContent', () => {
  test('renders children when section is open', () => {
    render(
      <CollapsibleSection defaultOpen={true}>
        <CollapsibleSectionHeader as="h2" id="test">
          Header
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <div data-testid="test-content">Test Content</div>
        </CollapsibleSectionContent>
      </CollapsibleSection>
    )

    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  test('does not render children when section is closed', () => {
    render(
      <CollapsibleSection defaultOpen={false}>
        <CollapsibleSectionHeader as="h2" id="test">
          Header
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>
          <div data-testid="test-content">Test Content</div>
        </CollapsibleSectionContent>
      </CollapsibleSection>
    )

    expect(screen.queryByTestId('test-content')).not.toBeInTheDocument()
  })
})
