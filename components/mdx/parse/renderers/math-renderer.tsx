"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathRendererProps {
  latex: string
  display?: boolean
  className?: string
}

export function MathRenderer({ latex, display = false, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Process the equation (similar to your existing math components)
      const processedEquation = latex.replace(/\\\\/g, "\\")

      katex.render(processedEquation, containerRef.current, {
        throwOnError: false,
        displayMode: display,
        strict: false,
        trust: true,
        output: "html",
        maxSize: 10,
        maxExpand: 1000,
        minRuleThickness: 0.04
      })
    } catch (error) {
      console.error("KaTeX rendering error:", error)
      if (containerRef.current) {
        containerRef.current.textContent = display ? `$$${latex}$$` : `$${latex}$`
      }
    }
  }, [latex, display])

  return (
    <span
      ref={containerRef}
      className={`katex-container ${className}`}
    />
  )
}