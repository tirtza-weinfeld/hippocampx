'use client'

import { useEffect, useRef, useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface InlineMathProps {
  children: string
  className?: string
  [key: string]: unknown // For other HTML attributes
}

export function InlineMath({ children, className = '', ...props }: InlineMathProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  // Memoize processed equation to avoid unnecessary recalculations
  const processedEquation = useMemo(() => {
    return children.replace(/\\\\\\\\/g, '\\\\')
  }, [children])

  // Memoize combined classes
  const combinedClasses = useMemo(() => {
    return `inline-math ${className}`.trim()
  }, [className])

  useEffect(() => {
    if (!containerRef.current) return

    try {
      katex.render(processedEquation, containerRef.current, {
        throwOnError: false,
        displayMode: false,
        strict: false,
        trust: true,
        output: 'html',
        maxSize: 10,
        maxExpand: 1000,
        minRuleThickness: 0.04
      })
      
      // Ensure KaTeX output inherits parent styles
      const katexSpan = containerRef.current.querySelector('.katex')
      if (katexSpan) {
        katexSpan.classList.add('inline-math-katex')
      }
    } catch (error) {
      console.error('KaTeX rendering error:', error)
      if (containerRef.current) {
        containerRef.current.textContent = children
      }
    }
  }, [processedEquation, children])

  return (
    <span
      ref={containerRef}
      className={combinedClasses}
      {...props}
    />
  )
}