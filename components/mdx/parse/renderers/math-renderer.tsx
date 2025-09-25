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

      // Ensure KaTeX output inherits parent styles
      const katexSpan = containerRef.current.querySelector('.katex')
      if (katexSpan) {
        katexSpan.classList.add(display ? 'display-math-katex' : 'inline-math-katex')
      }
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
      className={`katex-container ${display ? 'display-math' : 'inline-math'} ${className}`}
      style={{
        display: display ? "block" : "inline-flex",
        alignItems: "center",
        justifyContent: display ? "center" : "flex-start",
        verticalAlign: display ? "baseline" : "middle",
        margin: display ? "0.5em 0" : "0 0.1em",
        textAlign: display ? "center" : "left"
      }}
    />
  )
}