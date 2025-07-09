'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { isValidColorName, getStepColor, getColorText } from '@/lib/step-colors'

interface InlineMathProps {
  children: string
  className?: string
  step?: number
  colorName?: string
}

export function InlineMath({ children, className = '', step, colorName }: InlineMathProps) {
  const containerRef = useRef<HTMLElement>(null)

  // Unify with InlineCodeClient
  let codeClass = '';
  let textColorClass = '';
  if (step || colorName) {
    let colorName_final: string;
    if (step) {
      const stepColors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
      colorName_final = stepColors[(step - 1) % stepColors.length];
      textColorClass = getStepColor(step);
    } else if (colorName && isValidColorName(colorName)) {
      colorName_final = colorName;
      textColorClass = getColorText(colorName);
    } else {
      colorName_final = 'blue';
      textColorClass = getColorText('blue');
    }
    codeClass = `inline-block bg-linear-to-r from-${colorName_final}-500/10 from-10% via-${colorName_final}-500/10 via-20% to-${colorName_final}-500/10 to-90% dark:from-${colorName_final}-700/20 dark:via-${colorName_final}-800/20 dark:to-${colorName_final}-700/20 px-1.5 py-0.5 rounded text-sm font-mono hover:bg-linear-to-l shadow-sm ${textColorClass} ${className}`;
  } else {
    textColorClass = 'text-blue-600 dark:text-blue-400';
    codeClass = `inline-block bg-linear-to-r from-green-500/10 from-10% via-sky-500/10 via-20% to-blue-500/10 to-90% dark:from-teal-700/20 dark:via-sky-800/20 dark:to-blue-700/20 px-1.5 py-0.5 rounded text-sm font-mono hover:bg-linear-to-l shadow-sm ${textColorClass} ${className}`;
  }

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const processedEquation = children.replace(/\\\\/g, '\\')
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
  }, [children])

  return (
    <code
      ref={containerRef}
      className={codeClass}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  )
} 