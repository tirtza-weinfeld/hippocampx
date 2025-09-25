/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Variants } from 'motion/react'

interface TooltipSymbol {
  symbol: string
  signature: string
  description: string
  return_type: string
  parameters?: Record<string, string>
  complexity?: string
  examples?: string[]
}

interface VSCodeTooltipProps {
  readonly data: TooltipSymbol
  readonly position: Readonly<{ x: number; y: number }>
  readonly 'reduced-motion'?: boolean
}

// Mock motion with proper animation support
const mockMotionDiv = vi.fn(({ children, variants, initial, animate, exit, style, className, ...props }: any) => (
  <div 
    {...props}
    className={className}
    style={style}
    data-testid="motion-tooltip"
    data-initial={initial}
    data-animate={animate}
    data-exit={exit}
    data-variants={JSON.stringify(variants)}
  >
    {children}
  </div>
))

vi.mock('motion/react', () => ({
  motion: {
    div: mockMotionDiv
  }
}))

// Mock SyntaxHighlightedSignature component  
const MockSyntaxHighlightedSignature = vi.fn(({ signature, language, className }: {
  signature: string
  language: string  
  className?: string
}) => (
  <div 
    className={className}
    data-testid="syntax-highlighted-signature"
    data-language={language}
  >
    <code>{signature}</code>
  </div>
))

vi.mock('@/components/problems/syntax-highlighted-signature', () => ({
  SyntaxHighlightedSignature: MockSyntaxHighlightedSignature
}))

const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8, 
    scale: 0.95,
    filter: 'blur(4px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.5
    }
  }
} satisfies Variants

// VSCodeTooltip implementation
function VSCodeTooltip({ data, position, 'reduced-motion': reducedMotion }: VSCodeTooltipProps) {
  const { SyntaxHighlightedSignature } = require('@/components/problems/syntax-highlighted-signature')
  
  return (
    <mockMotionDiv
      className="fixed z-50 max-w-sm bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl"
      style={{ 
        left: position.x, 
        top: position.y, 
        transform: 'translateX(-50%) translateY(-100%)' 
      }}
      variants={tooltipVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      // Respect user motion preferences
      {...(reducedMotion && { transition: { duration: 0.15 } })}
    >
      <div className="p-3">
        {/* Function signature with syntax highlighting */}
        <SyntaxHighlightedSignature 
          signature={data.signature} 
          language="python" 
          className="block text-sm font-mono mb-2"
        />
        
        {/* Description with proper typography */}
        <p className="text-xs text-gray-300 leading-relaxed mb-2">
          {data.description}
        </p>
        
        {/* Return type badge */}
        {data.return_type && (
          <span className="inline-block px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded font-mono">
            → {data.return_type}
          </span>
        )}
        
        {/* Parameters if available */}
        {data.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Parameters:</div>
            {Object.entries(data.parameters).map(([name, type]) => (
              <div key={name} className="text-xs text-gray-300">
                <span className="text-blue-300 font-mono">{name}</span>
                <span className="text-gray-500">: </span>
                <span className="text-purple-300 font-mono">{type}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Complexity info if available */}
        {data.complexity && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <span className="text-xs text-orange-300">⚡ {data.complexity}</span>
          </div>
        )}
        
        {/* Examples if available */}
        {data.examples && data.examples.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-1">Examples:</div>
            {data.examples.map((example, index) => (
              <div key={index} className="text-xs text-green-300 font-mono">
                {example}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Tooltip arrow with CSS custom properties */}
      <div 
        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
        style={{ '--arrow-color': 'rgb(17 24 39)' } satisfies React.CSSProperties}
      />
    </mockMotionDiv>
  )
}

describe('VSCodeTooltip', () => {
  const mockPosition = { x: 100, y: 200 }
  
  const basicTooltipData: TooltipSymbol = {
    symbol: 'deque',
    signature: 'deque([iterable[, maxlen]]) -> deque',
    description: 'Double-ended queue with O(1) append/pop operations',
    return_type: 'deque[T]'
  }
  
  const complexTooltipData: TooltipSymbol = {
    symbol: 'popleft',
    signature: 'deque.popleft() -> T',
    description: 'Remove and return element from left side of deque',
    return_type: 'T',
    parameters: {
      'self': 'deque[T]'
    },
    complexity: 'O(1)',
    examples: [
      'q = deque([1, 2, 3])',
      'q.popleft()  # Returns 1'
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render tooltip with basic content', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    expect(screen.getByTestId('motion-tooltip')).toBeInTheDocument()
    expect(screen.getByText('Double-ended queue with O(1) append/pop operations')).toBeInTheDocument()
    expect(screen.getByText('→ deque[T]')).toBeInTheDocument()
  })

  it('should position tooltip correctly', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    const tooltip = screen.getByTestId('motion-tooltip')
    expect(tooltip).toHaveStyle({
      left: '100px',
      top: '200px',
      transform: 'translateX(-50%) translateY(-100%)'
    })
  })

  it('should render syntax highlighted signature', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    expect(MockSyntaxHighlightedSignature).toHaveBeenCalledWith({
      signature: 'deque([iterable[, maxlen]]) -> deque',
      language: 'python',
      className: 'block text-sm font-mono mb-2'
    }, {})
    
    expect(screen.getByTestId('syntax-highlighted-signature')).toBeInTheDocument()
    expect(screen.getByTestId('syntax-highlighted-signature')).toHaveAttribute('data-language', 'python')
  })

  it('should configure framer motion with correct animation variants', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    const tooltip = screen.getByTestId('motion-tooltip')
    expect(tooltip).toHaveAttribute('data-initial', 'hidden')
    expect(tooltip).toHaveAttribute('data-animate', 'visible')
    expect(tooltip).toHaveAttribute('data-exit', 'hidden')
    
    const variants = JSON.parse(tooltip.getAttribute('data-variants') || '{}')
    expect(variants.hidden).toEqual({
      opacity: 0,
      y: 8,
      scale: 0.95,
      filter: 'blur(4px)'
    })
    expect(variants.visible).toEqual({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.5
      }
    })
  })

  it('should handle reduced motion preference', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
        reduced-motion={true}
      />
    )
    
    expect(mockMotionDiv).toHaveBeenCalledWith(
      expect.objectContaining({
        transition: { duration: 0.15 }
      }),
      expect.any(Object)
    )
  })

  it('should render parameters section when available', () => {
    render(
      <VSCodeTooltip 
        data={complexTooltipData}
        position={mockPosition}
      />
    )
    
    expect(screen.getByText('Parameters:')).toBeInTheDocument()
    expect(screen.getByText('self')).toBeInTheDocument()
    expect(screen.getByText('deque[T]')).toBeInTheDocument()
  })

  it('should render complexity information when available', () => {
    render(
      <VSCodeTooltip 
        data={complexTooltipData}
        position={mockPosition}
      />
    )
    
    expect(screen.getByText('⚡ O(1)')).toBeInTheDocument()
  })

  it('should render examples when available', () => {
    render(
      <VSCodeTooltip 
        data={complexTooltipData}
        position={mockPosition}
      />
    )
    
    expect(screen.getByText('Examples:')).toBeInTheDocument()
    expect(screen.getByText('q = deque([1, 2, 3])')).toBeInTheDocument()
    expect(screen.getByText('q.popleft()  # Returns 1')).toBeInTheDocument()
  })

  it('should not render optional sections when data is not available', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    expect(screen.queryByText('Parameters:')).not.toBeInTheDocument()
    expect(screen.queryByText('Examples:')).not.toBeInTheDocument()
    expect(screen.queryByText(/⚡/)).not.toBeInTheDocument()
  })

  it('should render tooltip arrow', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    const arrow = screen.getByTestId('motion-tooltip').querySelector('.absolute.top-full')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveClass('border-4', 'border-transparent', 'border-t-gray-900')
    expect(arrow).toHaveStyle({ '--arrow-color': 'rgb(17 24 39)' })
  })

  it('should apply correct CSS classes for styling', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    const tooltip = screen.getByTestId('motion-tooltip')
    expect(tooltip).toHaveClass(
      'fixed',
      'z-50', 
      'max-w-sm',
      'bg-gray-900/95',
      'backdrop-blur-md',
      'border',
      'border-gray-700',
      'rounded-lg',
      'shadow-xl'
    )
  })

  it('should handle empty parameters object', () => {
    const dataWithEmptyParams = {
      ...basicTooltipData,
      parameters: {}
    }
    
    render(
      <VSCodeTooltip 
        data={dataWithEmptyParams}
        position={mockPosition}
      />
    )
    
    expect(screen.queryByText('Parameters:')).not.toBeInTheDocument()
  })

  it('should handle multiple parameters correctly', () => {
    const dataWithMultipleParams: TooltipSymbol = {
      symbol: 'range',
      signature: 'range(start, stop, step) -> range',
      description: 'Create a range of numbers',
      return_type: 'range',
      parameters: {
        'start': 'int',
        'stop': 'int', 
        'step': 'int'
      }
    }
    
    render(
      <VSCodeTooltip 
        data={dataWithMultipleParams}
        position={mockPosition}
      />
    )
    
    expect(screen.getByText('Parameters:')).toBeInTheDocument()
    expect(screen.getByText('start')).toBeInTheDocument()
    expect(screen.getByText('stop')).toBeInTheDocument()
    expect(screen.getByText('step')).toBeInTheDocument()
  })

  it('should handle multiple examples correctly', () => {
    const dataWithMultipleExamples: TooltipSymbol = {
      ...basicTooltipData,
      examples: [
        'deque([1, 2, 3])',
        'deque(maxlen=5)',
        'deque("abc")'
      ]
    }
    
    render(
      <VSCodeTooltip 
        data={dataWithMultipleExamples}
        position={mockPosition}
      />
    )
    
    expect(screen.getByText('Examples:')).toBeInTheDocument()
    expect(screen.getByText('deque([1, 2, 3])')).toBeInTheDocument()
    expect(screen.getByText('deque(maxlen=5)')).toBeInTheDocument()
    expect(screen.getByText('deque("abc")')).toBeInTheDocument()
  })

  it('should handle missing return type gracefully', () => {
    const dataWithoutReturnType = {
      ...basicTooltipData,
      return_type: ''
    }
    
    render(
      <VSCodeTooltip 
        data={dataWithoutReturnType}
        position={mockPosition}
      />
    )
    
    expect(screen.queryByText(/→/)).not.toBeInTheDocument()
  })

  it('should support different position coordinates', () => {
    const differentPosition = { x: 500, y: 300 }
    
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={differentPosition}
      />
    )
    
    const tooltip = screen.getByTestId('motion-tooltip')
    expect(tooltip).toHaveStyle({
      left: '500px',
      top: '300px'
    })
  })

  it('should maintain proper z-index for overlay positioning', () => {
    render(
      <VSCodeTooltip 
        data={basicTooltipData}
        position={mockPosition}
      />
    )
    
    const tooltip = screen.getByTestId('motion-tooltip')
    expect(tooltip).toHaveClass('z-50')
  })
})