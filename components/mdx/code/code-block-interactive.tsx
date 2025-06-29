'use client'

import { useState, useCallback, useRef, useEffect, memo, useTransition, useDeferredValue } from 'react'
import type { HighlightedCode } from '@/lib/types'

interface CodeBlockInteractiveProps {
  highlightedCode: HighlightedCode
}

export const CodeBlockInteractive = memo(function CodeBlockInteractive({ 
  highlightedCode
}: CodeBlockInteractiveProps) {
  const [tooltipSymbol, setTooltipSymbol] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isPending, startTransition] = useTransition()
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Defer tooltip updates for better performance
  const deferredTooltipSymbol = useDeferredValue(tooltipSymbol)

  // Close tooltip with useCallback for performance
  const closeTooltip = useCallback(() => {
    startTransition(() => {
      setTooltipSymbol(null)
    })
  }, [startTransition])

  // Handle escape key to close tooltip
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTooltip()
      }
    }

    if (tooltipSymbol) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [tooltipSymbol, closeTooltip])

  // Handle clicks on code content to detect symbols
  const handleCodeClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    
    // Check if the clicked element has tooltip data
    if (target.hasAttribute('data-tooltip')) {
      const symbolName = target.getAttribute('data-symbol')
      const metadata = target.getAttribute('data-metadata')
      
      if (symbolName && metadata) {
        startTransition(() => {
          setTooltipSymbol(symbolName)
          setTooltipPosition({ x: event.clientX, y: event.clientY })
        })
      }
    }
  }, [startTransition])

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const target = event.target as HTMLElement
      
      // Check if the focused element has tooltip data
      if (target.hasAttribute('data-tooltip')) {
        const symbolName = target.getAttribute('data-symbol')
        const metadata = target.getAttribute('data-metadata')
        
        if (symbolName && metadata) {
          const rect = target.getBoundingClientRect()
          startTransition(() => {
            setTooltipSymbol(symbolName)
            setTooltipPosition({ 
              x: rect.left + rect.width / 2, 
              y: rect.top 
            })
          })
        }
      }
    }
  }, [startTransition])

  return (
    <>
      <div 
        className="code-content relative" 
        onClick={handleCodeClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click on code symbols to see tooltips"
        aria-busy={isPending}
      >
        {highlightedCode.jsx}
      </div>
      
      {deferredTooltipSymbol && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md backdrop-blur-sm"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
          onMouseLeave={closeTooltip}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tooltip-title"
          aria-describedby="tooltip-content"
        >
          <TooltipContent symbolName={deferredTooltipSymbol} onClose={closeTooltip} />
        </div>
      )}
    </>
  )
})

// Memoized tooltip content component
const TooltipContent = memo(function TooltipContent({ 
  symbolName, 
  onClose 
}: { 
  symbolName: string
  onClose: () => void
}) {
  return (
    <div id="tooltip-content" className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 id="tooltip-title" className="font-semibold text-sm text-gray-900 dark:text-gray-100">
          {symbolName}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close tooltip"
        >
          ×
        </button>
      </div>

      {/* Content will be pre-rendered by server component */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Tooltip content is pre-rendered by server component
      </div>
    </div>
  )
}) 