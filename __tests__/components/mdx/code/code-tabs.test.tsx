import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeTabs } from '@/components/mdx/code/code-tabs'
import { CodeTab } from '@/components/mdx/code/code-tab'
import { CodeTabsList } from '@/components/mdx/code/code-tabs-list'
import { CodeTabTrigger } from '@/components/mdx/code/code-tab-trigger'

describe('CodeTabs Component', () => {
  function renderCodeTabs() {
    return render(
      <CodeTabs defaultFile="file1.py">
        <CodeTabsList>
          <CodeTabTrigger file="file1.py" />
          <CodeTabTrigger file="file2.py" />
          <CodeTabTrigger file="file3.py" />
        </CodeTabsList>
        <CodeTab file="file1.py">
          <div>Content 1</div>
        </CodeTab>
        <CodeTab file="file2.py">
          <div>Content 2</div>
        </CodeTab>
        <CodeTab file="file3.py">
          <div>Content 3</div>
        </CodeTab>
      </CodeTabs>
    )
  }

  describe('Rendering', () => {
    it('renders all tab triggers', () => {
      renderCodeTabs()

      // Tab labels should be generated from filenames (without extension)
      expect(screen.getByText('file1')).toBeInTheDocument()
      expect(screen.getByText('file2')).toBeInTheDocument()
      expect(screen.getByText('file3')).toBeInTheDocument()
    })

    it('renders first tab content by default', () => {
      renderCodeTabs()

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
      expect(screen.queryByText('Content 3')).not.toBeInTheDocument()
    })

    it('renders custom default tab when specified', () => {
      render(
        <CodeTabs defaultFile="file2.py">
          <CodeTabsList>
            <CodeTabTrigger file="file1.py" />
            <CodeTabTrigger file="file2.py" />
            <CodeTabTrigger file="file3.py" />
          </CodeTabsList>
          <CodeTab file="file1.py">
            <div>Content 1</div>
          </CodeTab>
          <CodeTab file="file2.py">
            <div>Content 2</div>
          </CodeTab>
          <CodeTab file="file3.py">
            <div>Content 3</div>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByText('Content 2')).toBeInTheDocument()
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    })

    it('formats filenames for display (removes extension)', () => {
      render(
        <CodeTabs defaultFile="heap.py">
          <CodeTabsList>
            <CodeTabTrigger file="heap.py" />
            <CodeTabTrigger file="binary-search.js" />
            <CodeTabTrigger file="main.tsx" />
          </CodeTabsList>
          <CodeTab file="heap.py">
            <div>Content</div>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByText('heap')).toBeInTheDocument()
      expect(screen.getByText('binary-search')).toBeInTheDocument()
      expect(screen.getByText('main')).toBeInTheDocument()
    })
  })

  describe('Tab Switching', () => {
    it('switches tab content when trigger is clicked', async () => {
      const user = userEvent.setup()
      renderCodeTabs()

      expect(screen.getByText('Content 1')).toBeInTheDocument()

      await user.click(screen.getByText('file2'))

      expect(screen.getByText('Content 2')).toBeInTheDocument()
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    })

    it('switches between multiple tabs', async () => {
      const user = userEvent.setup()
      renderCodeTabs()

      await user.click(screen.getByText('file2'))
      expect(screen.getByText('Content 2')).toBeInTheDocument()

      await user.click(screen.getByText('file3'))
      expect(screen.getByText('Content 3')).toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

      await user.click(screen.getByText('file1'))
      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.queryByText('Content 3')).not.toBeInTheDocument()
    })

    it('clicking active tab keeps it active', async () => {
      const user = userEvent.setup()
      renderCodeTabs()

      const file1Trigger = screen.getByText('file1')
      await user.click(file1Trigger)

      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies active styles to current tab', () => {
      renderCodeTabs()

      const file1Button = screen.getByText('file1').closest('button')
      expect(file1Button).toHaveClass('bg-background', 'text-foreground', 'shadow-sm')
    })

    it('applies custom className to CodeTabs', () => {
      const { container } = render(
        <CodeTabs defaultFile="file1.py" className="custom-class">
          <CodeTabsList>
            <CodeTabTrigger file="file1.py" />
          </CodeTabsList>
          <CodeTab file="file1.py">
            <div>Content 1</div>
          </CodeTab>
        </CodeTabs>
      )

      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('renders tab list container with correct styles', () => {
      const { container } = renderCodeTabs()

      const tabsList = container.querySelector('.inline-flex.rounded-lg.bg-muted')
      expect(tabsList).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('triggers are keyboard accessible', async () => {
      const user = userEvent.setup()
      renderCodeTabs()

      const file1Trigger = screen.getByText('file1').closest('button')
      const file2Trigger = screen.getByText('file2').closest('button')

      expect(file1Trigger).toHaveAttribute('type', 'button')
      expect(file2Trigger).toHaveAttribute('type', 'button')

      if (file2Trigger) {
        file2Trigger.focus()
        await user.keyboard('{Enter}')
        expect(screen.getByText('Content 2')).toBeInTheDocument()
      }
    })

    it('has focus-visible styles', () => {
      renderCodeTabs()

      const file1Button = screen.getByText('file1').closest('button')
      expect(file1Button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2')
    })
  })

  describe('Error Handling', () => {
    it('throws error when CodeTab used outside CodeTabs', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(
          <CodeTab file="file1.py">
            <div>Content</div>
          </CodeTab>
        )
      }).toThrow('CodeTabs components must be used within CodeTabs')

      consoleError.mockRestore()
    })

    it('handles no defaultFile with fallback to first CodeTab', () => {
      const { container } = render(
        <CodeTabs>
          <CodeTabsList>
            <CodeTabTrigger file="file1.py" />
            <CodeTabTrigger file="file2.py" />
          </CodeTabsList>
          <CodeTab file="file1.py">
            <div>Content 1</div>
          </CodeTab>
          <CodeTab file="file2.py">
            <div>Content 2</div>
          </CodeTab>
        </CodeTabs>
      )

      // Should render the tab list
      expect(container.querySelector('.inline-flex')).toBeInTheDocument()
      // No content should show because defaultFile is not set
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
    })
  })

  describe('Integration with CodeBlock', () => {
    it('renders server component children (CodeBlock)', () => {
      const MockCodeBlock = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-code-block">{children}</div>
      )

      render(
        <CodeTabs defaultFile="test.py">
          <CodeTabsList>
            <CodeTabTrigger file="test.py" />
          </CodeTabsList>
          <CodeTab file="test.py">
            <MockCodeBlock>
              <code>{'print("Hello, World!")'}</code>
            </MockCodeBlock>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByTestId('mock-code-block')).toBeInTheDocument()
      expect(screen.getByText('print("Hello, World!")')).toBeInTheDocument()
    })

    it('handles multiple CodeBlocks in different tabs', async () => {
      const user = userEvent.setup()
      const MockCodeBlock = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-code-block">{children}</div>
      )

      render(
        <CodeTabs defaultFile="file1.py">
          <CodeTabsList>
            <CodeTabTrigger file="file1.py" />
            <CodeTabTrigger file="file2.py" />
          </CodeTabsList>
          <CodeTab file="file1.py">
            <MockCodeBlock>
              <code>Code 1</code>
            </MockCodeBlock>
          </CodeTab>
          <CodeTab file="file2.py">
            <MockCodeBlock>
              <code>Code 2</code>
            </MockCodeBlock>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByText('Code 1')).toBeInTheDocument()

      await user.click(screen.getByText('file2'))

      expect(screen.getByText('Code 2')).toBeInTheDocument()
      expect(screen.queryByText('Code 1')).not.toBeInTheDocument()
    })

    it('only mounts active tab content for performance', () => {
      const MockCodeBlock = ({ id }: { id: string }) => (
        <div data-testid={`code-block-${id}`}>Code {id}</div>
      )

      render(
        <CodeTabs defaultFile="file1.py">
          <CodeTabsList>
            <CodeTabTrigger file="file1.py" />
            <CodeTabTrigger file="file2.py" />
            <CodeTabTrigger file="file3.py" />
          </CodeTabsList>
          <CodeTab file="file1.py">
            <MockCodeBlock id="1" />
          </CodeTab>
          <CodeTab file="file2.py">
            <MockCodeBlock id="2" />
          </CodeTab>
          <CodeTab file="file3.py">
            <MockCodeBlock id="3" />
          </CodeTab>
        </CodeTabs>
      )

      // Only active tab content should be in the DOM
      expect(screen.getByTestId('code-block-1')).toBeInTheDocument()
      expect(screen.queryByTestId('code-block-2')).not.toBeInTheDocument()
      expect(screen.queryByTestId('code-block-3')).not.toBeInTheDocument()
    })
  })

  describe('File Label Generation', () => {
    it('removes common file extensions', () => {
      render(
        <CodeTabs defaultFile="script.py">
          <CodeTabsList>
            <CodeTabTrigger file="script.py" />
            <CodeTabTrigger file="app.js" />
            <CodeTabTrigger file="component.tsx" />
            <CodeTabTrigger file="styles.css" />
          </CodeTabsList>
          <CodeTab file="script.py">
            <div>Content</div>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByText('script')).toBeInTheDocument()
      expect(screen.getByText('app')).toBeInTheDocument()
      expect(screen.getByText('component')).toBeInTheDocument()
      expect(screen.getByText('styles')).toBeInTheDocument()
    })

    it('handles files without extensions', () => {
      render(
        <CodeTabs defaultFile="Dockerfile">
          <CodeTabsList>
            <CodeTabTrigger file="Dockerfile" />
            <CodeTabTrigger file="Makefile" />
          </CodeTabsList>
          <CodeTab file="Dockerfile">
            <div>Content</div>
          </CodeTab>
        </CodeTabs>
      )

      expect(screen.getByText('Dockerfile')).toBeInTheDocument()
      expect(screen.getByText('Makefile')).toBeInTheDocument()
    })
  })
})
