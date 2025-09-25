/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

interface TooltipSymbol {
  symbol: string
  signature: string
  description: string
  return_type: string
  parameters?: Record<string, string>
  complexity?: string
}

interface TooltipState {
  readonly symbol: TooltipSymbol
  readonly position: Readonly<{ x: number; y: number }>
}

// Mock motion for reduced motion testing
const mockUseReducedMotion = vi.fn(() => false)
vi.mock('motion/react', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock VSCodeTooltip
const MockVSCodeTooltip = vi.fn(({ data, position }: { 
  data: TooltipSymbol; 
  position: { x: number; y: number } 
}) => (
  <div 
    data-testid="vscode-tooltip"
    data-symbol={data.symbol}
    style={{ left: position.x, top: position.y }}
  >
    <div data-testid="tooltip-signature">{data.signature}</div>
    <div data-testid="tooltip-description">{data.description}</div>
    <div data-testid="tooltip-return-type">{data.return_type}</div>
    {data.complexity && (
      <div data-testid="tooltip-complexity">{data.complexity}</div>
    )}
  </div>
))

vi.mock('@/components/problems/vscode-tooltip', () => ({
  VSCodeTooltip: MockVSCodeTooltip
}))

// CodeBlockInteractions implementation
function CodeBlockInteractions({ 
  children, 
  tooltipData 
}: { 
  children: ReactNode
  tooltipData: Record<string, TooltipSymbol>
}) {
  const [tooltip, setTooltip] = React.useState<TooltipState | null>(null)
  const prefersReducedMotion = mockUseReducedMotion()
  
  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const symbol = target.dataset.tooltipSymbol
    
    if (symbol && tooltipData[symbol]) {
      const rect = target.getBoundingClientRect()
      setTooltip({
        symbol: tooltipData[symbol],
        position: { 
          x: rect.left + rect.width / 2, 
          y: rect.top - 8 
        }
      })
    }
  }
  
  const handleMouseLeave = () => {
    setTooltip(null)
  }
  
  const { VSCodeTooltip } = require('@/components/problems/vscode-tooltip')
  
  return (
    <>
      <div 
        data-testid="interactions-wrapper"
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      >
        {children}
      </div>
      
      {tooltip && (
        <VSCodeTooltip 
          data={tooltip.symbol}
          position={tooltip.position}
          reduced-motion={prefersReducedMotion}
        />
      )}
    </>
  )
}

// Need React import for useState
import React from 'react'

describe('CodeBlockInteractions', () => {
  const mockTooltipData = {
    'deque': {
      symbol: 'deque',
      signature: 'deque([iterable[, maxlen]]) -> deque',
      description: 'Double-ended queue with O(1) append/pop operations',
      return_type: 'deque[T]',
      parameters: { iterable: 'Iterable[T]', maxlen: 'int | None' }
    },
    'popleft': {
      symbol: 'popleft',
      signature: 'deque.popleft() -> T',
      description: 'Remove and return element from left side',
      return_type: 'T',
      complexity: 'O(1)'
    },
    'len': {
      symbol: 'len',
      signature: 'len(obj) -> int',
      description: 'Return the length of an object',
      return_type: 'int'
    }
  } satisfies Record<string, TooltipSymbol>

  const createMockCodeContent = () => (
    <pre>
      <code>
        <span 
          data-tooltip-symbol="deque"
          data-testid="deque-token"
        >
          deque
        </span>
        <span>(</span>
        <span 
          data-tooltip-symbol="popleft"
          data-testid="popleft-token"
        >
          popleft
        </span>
        <span>)</span>
        <span 
          data-tooltip-symbol="len"
          data-testid="len-token"
        >
          len
        </span>
      </code>
    </pre>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseReducedMotion.mockReturnValue(false)
    
    // Mock getBoundingClientRect for tooltip positioning
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 200,
      width: 50,
      height: 20,
      right: 150,
      bottom: 220,
      x: 100,
      y: 200,
      toJSON: () => {}
    }))
  })

  it('should render children without tooltip initially', () => {
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('deque-token')).toBeInTheDocument()
    expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
  })

  it('should show tooltip on mouse enter with correct data', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    await user.hover(dequeToken)
    
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toBeInTheDocument()
    })
    
    // Check tooltip content
    expect(screen.getByTestId('tooltip-signature')).toHaveTextContent(
      'deque([iterable[, maxlen]]) -> deque'
    )
    expect(screen.getByTestId('tooltip-description')).toHaveTextContent(
      'Double-ended queue with O(1) append/pop operations'
    )
    expect(screen.getByTestId('tooltip-return-type')).toHaveTextContent('deque[T]')
  })

  it('should hide tooltip on mouse leave', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    
    // Show tooltip
    await user.hover(dequeToken)
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toBeInTheDocument()
    })
    
    // Hide tooltip
    await user.unhover(dequeToken)
    await waitFor(() => {
      expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
    })
  })

  it('should calculate correct tooltip position based on element bounds', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    await user.hover(dequeToken)
    
    await waitFor(() => {
      const tooltip = screen.getByTestId('vscode-tooltip')
      expect(tooltip).toHaveStyle({
        left: '125px', // 100 + 50/2 (left + width/2)
        top: '192px'   // 200 - 8 (top - 8)
      })
    })
  })

  it('should show different tooltip content for different symbols', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    // Test popleft tooltip
    const popleftToken = screen.getByTestId('popleft-token')
    await user.hover(popleftToken)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-signature')).toHaveTextContent(
        'deque.popleft() -> T'
      )
      expect(screen.getByTestId('tooltip-description')).toHaveTextContent(
        'Remove and return element from left side'
      )
      expect(screen.getByTestId('tooltip-complexity')).toHaveTextContent('O(1)')
    })
    
    await user.unhover(popleftToken)
    
    // Test len tooltip
    const lenToken = screen.getByTestId('len-token')
    await user.hover(lenToken)
    
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-signature')).toHaveTextContent(
        'len(obj) -> int'
      )
      expect(screen.getByTestId('tooltip-description')).toHaveTextContent(
        'Return the length of an object'
      )
    })
  })

  it('should not show tooltip for elements without tooltip data', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        <div>
          <span data-testid="no-tooltip-element">no_tooltip</span>
          <span data-tooltip-symbol="unknown" data-testid="unknown-symbol">unknown</span>
        </div>
      </CodeBlockInteractions>
    )
    
    // Hover over element without tooltip data
    await user.hover(screen.getByTestId('no-tooltip-element'))
    expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
    
    // Hover over element with unknown symbol
    await user.hover(screen.getByTestId('unknown-symbol'))
    expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
  })

  it('should handle rapid hover/unhover events correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    const popleftToken = screen.getByTestId('popleft-token')
    
    // Rapid sequence of hovers
    await user.hover(dequeToken)
    await user.hover(popleftToken)
    await user.hover(dequeToken)
    await user.unhover(dequeToken)
    
    // Should handle gracefully without crashes
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
  })

  it('should pass reduced motion preference to tooltip', async () => {
    mockUseReducedMotion.mockReturnValue(true)
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    await user.hover(dequeToken)
    
    await waitFor(() => {
      expect(MockVSCodeTooltip).toHaveBeenCalledWith(
        expect.objectContaining({
          'reduced-motion': true
        }),
        expect.any(Object)
      )
    })
  })

  it('should use event delegation for performance', () => {
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const wrapper = screen.getByTestId('interactions-wrapper')
    
    // Should have mouse event handlers on the wrapper, not individual elements
    expect(wrapper).toHaveAttribute('onMouseOver')
    expect(wrapper).toHaveAttribute('onMouseOut')
    
    // Individual tokens should not have handlers
    const dequeToken = screen.getByTestId('deque-token')
    expect(dequeToken).not.toHaveAttribute('onMouseOver')
    expect(dequeToken).not.toHaveAttribute('onMouseOut')
  })

  it('should handle nested code structures correctly', async () => {
    const user = userEvent.setup()
    
    const nestedContent = (
      <div>
        <div>
          <span data-tooltip-symbol="deque" data-testid="nested-deque">deque</span>
        </div>
        <pre>
          <code>
            <span data-tooltip-symbol="len" data-testid="nested-len">len</span>
          </code>
        </pre>
      </div>
    )
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {nestedContent}
      </CodeBlockInteractions>
    )
    
    // Should work with nested structures
    const nestedDeque = screen.getByTestId('nested-deque')
    await user.hover(nestedDeque)
    
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip-signature')).toHaveTextContent(
        'deque([iterable[, maxlen]]) -> deque'
      )
    })
  })

  it('should maintain tooltip state consistency during rapid interactions', async () => {
    const user = userEvent.setup()
    
    render(
      <CodeBlockInteractions tooltipData={mockTooltipData}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    const dequeToken = screen.getByTestId('deque-token')
    const popleftToken = screen.getByTestId('popleft-token')
    
    // Show first tooltip
    await user.hover(dequeToken)
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toHaveAttribute('data-symbol', 'deque')
    })
    
    // Switch to second tooltip
    await user.hover(popleftToken)
    await waitFor(() => {
      expect(screen.getByTestId('vscode-tooltip')).toHaveAttribute('data-symbol', 'popleft')
    })
    
    // Should only have one tooltip at a time
    const tooltips = screen.getAllByTestId('vscode-tooltip')
    expect(tooltips).toHaveLength(1)
  })

  it('should handle empty tooltip data gracefully', () => {
    render(
      <CodeBlockInteractions tooltipData={{}}>
        {createMockCodeContent()}
      </CodeBlockInteractions>
    )
    
    expect(screen.getByTestId('interactions-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('deque-token')).toBeInTheDocument()
    expect(screen.queryByTestId('vscode-tooltip')).not.toBeInTheDocument()
  })
})