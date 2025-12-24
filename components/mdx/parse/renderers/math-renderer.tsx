'use client'

import katex from 'katex'

interface MathRendererProps {
  latex: string
  display?: boolean
  className?: string
}

export function MathRenderer({ latex, display = false, className = '' }: MathRendererProps) {
  const processedEquation = latex.replace(/\\\\/g, '\\')

  const ref = (el: HTMLSpanElement | null) => {
    if (!el) return

    try {
      katex.render(processedEquation, el, {
        throwOnError: false,
        displayMode: display,
        strict: false,
        trust: true,
        output: 'html',
        maxSize: 10,
        maxExpand: 1000,
        minRuleThickness: 0.04
      })

      // Replace KaTeX inline color styles with data-step attributes
      el.querySelectorAll<HTMLElement>('[style*="color"]').forEach(node => {
        const style = node.getAttribute('style') || ''
        const match = style.match(/color:\s*(\w+)/)
        if (match) {
          node.setAttribute('data-step', match[1])
          node.removeAttribute('style')
        }
      })
    } catch (error) {
      console.error('KaTeX rendering error:', error)
      el.textContent = display ? `$$${latex}$$` : `$${latex}$`
    }
  }

  return (
    <span
      ref={ref}
      className={`katex-container ${className}`.trim()}
    />
  )
}