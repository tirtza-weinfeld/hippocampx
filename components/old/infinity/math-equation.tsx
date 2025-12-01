"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathEquationProps {
  equation: string
  className?: string
  display?: boolean
  scale?: number
}

export function MathEquation({ equation, className = "", display = false, scale = 1 }: MathEquationProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Replace escaped backslashes with single backslashes for KaTeX
      const processedEquation = equation.replace(/\\\\/g, "\\")
      
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

      if (scale !== 1 && containerRef.current) {
        containerRef.current.style.transform = `scale(${scale})`
        containerRef.current.style.transformOrigin = "center center"
      }
    } catch (error) {
      console.error("KaTeX rendering error:", error)
      if (containerRef.current) {
        containerRef.current.textContent = equation
      }
    }
  }, [equation, display, scale])

  return (
    <span 
      ref={containerRef}
      className={`katex-container ${className}`}
      style={{ 
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
        margin: "0 0.1em"
      }}
    />
  )
} 