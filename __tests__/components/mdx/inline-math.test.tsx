import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InlineMath } from '@/components/mdx/inline-math'

// Mock KaTeX to avoid DOM manipulation in tests
vi.mock('katex', () => ({
  default: {
    render: vi.fn((equation: string, element: HTMLElement) => {
      if (element) {
        element.innerHTML = `<span class="katex">${equation}</span>`
        // Simulate applying styles after rendering
        Object.assign(element.style, {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          margin: '0 0.1em'
        })
      }
    })
  }
}))

describe('InlineMath', () => {
  it('renders math expression correctly', () => {
    render(<InlineMath>s</InlineMath>)
    
    const mathElement = screen.getByText('s')
    expect(mathElement).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<InlineMath className="custom-class">x + y</InlineMath>)
    
    const container = document.querySelector('.inline-math')
    expect(container).toHaveClass('custom-class')
  })

  it('applies inline styles after KaTeX rendering', () => {
    render(<InlineMath>x + y</InlineMath>)
    
    const container = document.querySelector('.inline-math')
    expect(container).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      margin: '0 0.1em'
    })
  })

  it('handles complex math expressions', () => {
    const mathExpr = '\\frac{a}{b}'
    render(<InlineMath>{mathExpr}</InlineMath>)
    
    const mathElement = screen.getByText(mathExpr)
    expect(mathElement).toBeInTheDocument()
  })

  it('handles empty content gracefully', () => {
    render(<InlineMath>{''}</InlineMath>)
    
    const container = document.querySelector('.inline-math')
    expect(container).toBeInTheDocument()
  })
}) 