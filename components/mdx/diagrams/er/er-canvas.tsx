"use client"

import { useRef, useState, useEffect, type ReactNode, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { CanvasTransform } from './types'

interface ERCanvasProps {
  children: ReactNode
  viewBox: { width: number; height: number }
  isFullscreen?: boolean
  minHeight?: number
  onTableZoom?: (tableName: string, delta: number) => void
  /** Controlled canvas transform (zoom/pan) */
  canvasTransform?: CanvasTransform
  /** Callback when canvas transform changes */
  onCanvasTransformChange?: (transform: CanvasTransform) => void
}

type ResizeEdge = 'bottom' | 'right' | 'bottom-right' | null

const DEFAULT_TRANSFORM: CanvasTransform = { x: 0, y: 0, scale: 1 }

export function ERCanvas({
  children,
  viewBox,
  isFullscreen = false,
  minHeight = 400,
  onTableZoom,
  canvasTransform: controlledTransform,
  onCanvasTransformChange,
}: ERCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalTransform, setInternalTransform] = useState<CanvasTransform>(DEFAULT_TRANSFORM)

  // Use controlled or uncontrolled transform
  const isControlled = controlledTransform !== undefined
  const transform = isControlled ? controlledTransform : internalTransform

  function updateTransform(newTransform: CanvasTransform | ((prev: CanvasTransform) => CanvasTransform)) {
    if (isControlled && onCanvasTransformChange) {
      const nextTransform = typeof newTransform === 'function' ? newTransform(transform) : newTransform
      onCanvasTransformChange(nextTransform)
    } else {
      setInternalTransform(newTransform)
    }
  }
  const [isDragging, setIsDragging] = useState(false)
  const [containerHeight, setContainerHeight] = useState(minHeight)
  const [resizeEdge, setResizeEdge] = useState<ResizeEdge>(null)
  const dragStart = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ height: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  // Store callbacks in refs to avoid stale closures in wheel handler
  const onTableZoomRef = useRef(onTableZoom)
  const updateTransformRef = useRef(updateTransform)

  useEffect(() => {
    onTableZoomRef.current = onTableZoom
    updateTransformRef.current = updateTransform
  })

  // Prevent page scroll when zooming inside the canvas
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as HTMLElement
      const tableElement = target.closest('[data-er-table]')

      if (tableElement instanceof HTMLElement && onTableZoomRef.current) {
        // Zooming while hovering a table → scale only that table
        const tableName = tableElement.dataset.tableName
        if (tableName) {
          const delta = e.deltaY > 0 ? 0.9 : 1.1
          onTableZoomRef.current(tableName, delta)
        }
      } else {
        // Zooming on empty canvas → global zoom
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        updateTransformRef.current(prev => {
          const newScale = Math.min(Math.max(prev.scale * delta, 0.25), 3)
          const rect = container?.getBoundingClientRect()
          if (!rect) return prev

          const mouseX = e.clientX - rect.left
          const mouseY = e.clientY - rect.top

          return {
            scale: newScale,
            x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
            y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
          }
        })
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return

    // Check if clicking on a table (don't pan when clicking tables)
    const target = e.target as HTMLElement
    if (target.closest('[data-er-table]')) return

    setIsDragging(true)
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return
    updateTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }))
  }

  function handlePointerUp() {
    setIsDragging(false)
  }

  function handleDoubleClick(e: React.MouseEvent) {
    // Don't reset on table double-click
    const target = e.target as HTMLElement
    if (target.closest('[data-er-table]')) return
    updateTransform(DEFAULT_TRANSFORM)
  }

  function handleResizeStart(edge: ResizeEdge) {
    return function onPointerDown(e: PointerEvent) {
      e.preventDefault()
      e.stopPropagation()
      setResizeEdge(edge)
      resizeStart.current = { height: containerHeight, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    }
  }

  function handleResizeMove(e: PointerEvent) {
    if (!resizeEdge) return
    const deltaY = e.clientY - resizeStart.current.y
    const newHeight = Math.max(minHeight, resizeStart.current.height + deltaY)
    setContainerHeight(newHeight)
  }

  function handleResizeEnd() {
    setResizeEdge(null)
  }

  return (
    <div className="relative">
      <motion.div
        ref={containerRef}
        data-er-canvas
        data-dragging={isDragging}
        className={cn(
          'relative overflow-hidden w-full bg-er-entity/30 border border-er-border rounded-xl touch-none select-none',
          isFullscreen && 'fixed inset-0 z-50 rounded-none border-none'
        )}
        style={{ height: isFullscreen ? '100vh' : containerHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      >
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            width: viewBox.width,
            height: viewBox.height,
          }}
        >
          {children}
        </div>

        {/* Zoom indicator */}
        {transform.scale !== 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 text-xs font-mono text-er-text-muted bg-er-entity/80 rounded-md border border-er-border">
            {Math.round(transform.scale * 100)}%
          </div>
        )}
      </motion.div>

      {/* Resize handles - only show when not fullscreen */}
      {!isFullscreen && (
        <>
          {/* Bottom resize handle */}
          <div
            className="absolute left-4 right-4 bottom-0 h-2 cursor-ns-resize group"
            onPointerDown={handleResizeStart('bottom')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-er-border/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Corner resize handle */}
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize group"
            onPointerDown={handleResizeStart('bottom-right')}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
          >
            <svg
              className="absolute right-1 bottom-1 w-2 h-2 text-er-border/50 group-hover:text-er-border transition-colors"
              viewBox="0 0 6 6"
              fill="currentColor"
            >
              <circle cx="5" cy="1" r="1" />
              <circle cx="5" cy="5" r="1" />
              <circle cx="1" cy="5" r="1" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
