import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MathRenderer } from '@/components/mdx/parse/renderers/math-renderer'

vi.mock('katex', () => ({
  default: {
    render: vi.fn((equation: string, element: HTMLElement) => {
      // Simulate KaTeX output with inline color styles
      if (equation.includes('\\textcolor{red}')) {
        element.innerHTML = `<span class="katex"><span style="color: red">colored</span></span>`
      } else {
        element.innerHTML = `<span class="katex">${equation}</span>`
      }
    })
  }
}))

describe('MathRenderer', () => {
  it('renders math expression', () => {
    const { container } = render(<MathRenderer latex="x + y" />)
    expect(container.querySelector('.katex')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<MathRenderer latex="x" className="custom-class" />)
    expect(container.querySelector('.katex-container')).toHaveClass('custom-class')
  })

  it('renders complex expressions', () => {
    const { container } = render(<MathRenderer latex="\\frac{a}{b}" />)
    expect(container.querySelector('.katex')).toBeInTheDocument()
  })

  it('handles empty content', () => {
    const { container } = render(<MathRenderer latex="" />)
    expect(container.querySelector('.katex-container')).toBeInTheDocument()
  })

  it('supports display mode', () => {
    const { container } = render(<MathRenderer latex="x^2" display />)
    expect(container.querySelector('.katex-container')).toBeInTheDocument()
  })

  it('converts inline color styles to data-step attributes', () => {
    const { container } = render(<MathRenderer latex="\\textcolor{red}{x}" />)

    const coloredEl = container.querySelector('[data-step="red"]')
    expect(coloredEl).toBeInTheDocument()
    expect(coloredEl).not.toHaveAttribute('style')
  })
})
