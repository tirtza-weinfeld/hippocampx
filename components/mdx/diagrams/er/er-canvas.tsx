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
  /** Whether this is a fresh diagram with no persisted layout */
  shouldFitToView?: boolean
  /** Key to force re-fit when reset is triggered */
  fitToViewKey?: number
}

type ResizeEdge = 'bottom' | 'right' | 'bottom-right' | null

const DEFAULT_TRANSFORM: CanvasTransform = { x: 0, y: 0, scale: 1 }

/** Compute distance between two points */
function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/** Compute midpoint between two points */
function getMidpoint(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
}

/** Calculate transform to fit content within container with padding */
function calculateFitTransform(
  containerWidth: number,
  containerHeight: number,
  contentWidth: number,
  contentHeight: number,
  padding = 20
): CanvasTransform {
  const availableWidth = containerWidth - padding * 2
  const availableHeight = containerHeight - padding * 2

  const scaleX = availableWidth / contentWidth
  const scaleY = availableHeight / contentHeight
  const scale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%

  // Center the content
  const scaledWidth = contentWidth * scale
  const scaledHeight = contentHeight * scale
  const x = (containerWidth - scaledWidth) / 2
  const y = (containerHeight - scaledHeight) / 2

  return { x, y, scale }
}

export function ERCanvas({
  children,
  viewBox,
  isFullscreen = false,
  minHeight = 400,
  onTableZoom,
  canvasTransform: controlledTransform,
  onCanvasTransformChange,
  shouldFitToView = false,
  fitToViewKey = 0,
}: ERCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalTransform, setInternalTransform] = useState<CanvasTransform>(DEFAULT_TRANSFORM)
  const lastFitKeyRef = useRef(-1)

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

  // Track active pointers for pinch-to-zoom on mobile
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const lastPinchDistance = useRef<number | null>(null)
  const isPinching = useRef(false)
  const pinchTargetTable = useRef<string | null>(null)

  // Store callbacks in refs to avoid stale closures in wheel handler
  const onTableZoomRef = useRef(onTableZoom)
  const updateTransformRef = useRef(updateTransform)

  useEffect(() => {
    onTableZoomRef.current = onTableZoom
    updateTransformRef.current = updateTransform
  })

  // Fit to view on initial mount or when fitToViewKey changes (reset)
  useEffect(() => {
    // Skip if already fitted for this key, or if not requested
    if (!shouldFitToView || lastFitKeyRef.current === fitToViewKey) return
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const fitTransform = calculateFitTransform(
      rect.width,
      rect.height,
      viewBox.width,
      viewBox.height
    )

    updateTransform(fitTransform)
    lastFitKeyRef.current = fitToViewKey
  }, [shouldFitToView, fitToViewKey, viewBox.width, viewBox.height])

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
    // Check if clicking on a table (tables handle their own drag/interaction)
    const target = e.target as HTMLElement
    const isOnTable = target.closest('[data-er-table]')

    // Always track pointers for pinch-to-zoom (even on tables for canvas-level zoom)
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    // If 2 pointers, start pinch zoom mode
    if (activePointers.current.size === 2) {
      const pointers = Array.from(activePointers.current.values())
      lastPinchDistance.current = getDistance(pointers[0], pointers[1])
      isPinching.current = true
      setIsDragging(false)

      // Determine pinch target: check if midpoint is over a table
      const midpoint = getMidpoint(pointers[0], pointers[1])
      const elementAtMidpoint = document.elementFromPoint(midpoint.x, midpoint.y)
      const tableElement = elementAtMidpoint?.closest('[data-er-table]')
      pinchTargetTable.current = tableElement instanceof HTMLElement
        ? tableElement.dataset.tableName ?? null
        : null

      // Capture ALL pointers on canvas container for pinch gesture
      // This ensures tables release their pointer capture
      for (const pointerId of activePointers.current.keys()) {
        containerRef.current?.setPointerCapture(pointerId)
      }
      return
    }

    // Don't pan when clicking on tables (they handle their own drag)
    if (isOnTable) return

    // Capture this pointer on canvas container for panning
    containerRef.current?.setPointerCapture(e.pointerId)

    // Single pointer - start panning (only for primary button)
    if (e.button !== 0) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y }
  }

  function handlePointerMove(e: PointerEvent) {
    // Update pointer position in tracking
    if (activePointers.current.has(e.pointerId)) {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    }

    // Handle pinch-to-zoom when 2 pointers are active
    if (activePointers.current.size === 2 && isPinching.current) {
      const pointers = Array.from(activePointers.current.values())
      const currentDistance = getDistance(pointers[0], pointers[1])

      if (lastPinchDistance.current !== null && currentDistance > 0) {
        const delta = currentDistance / lastPinchDistance.current

        // Pinching over a table → zoom that table
        if (pinchTargetTable.current && onTableZoom) {
          onTableZoom(pinchTargetTable.current, delta)
        } else {
          // Pinching on canvas → global zoom
          const midpoint = getMidpoint(pointers[0], pointers[1])
          const container = containerRef.current
          const rect = container?.getBoundingClientRect()

          if (rect) {
            const pinchX = midpoint.x - rect.left
            const pinchY = midpoint.y - rect.top

            updateTransform(prev => {
              const newScale = Math.min(Math.max(prev.scale * delta, 0.25), 3)
              return {
                scale: newScale,
                x: pinchX - (pinchX - prev.x) * (newScale / prev.scale),
                y: pinchY - (pinchY - prev.y) * (newScale / prev.scale),
              }
            })
          }
        }

        lastPinchDistance.current = currentDistance
      }
      return
    }

    // Handle single-pointer panning
    if (!isDragging) return
    updateTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }))
  }

  function handlePointerUp(e: PointerEvent) {
    // Remove this pointer from tracking
    activePointers.current.delete(e.pointerId)

    // Reset pinch state if we drop below 2 pointers
    if (activePointers.current.size < 2) {
      isPinching.current = false
      lastPinchDistance.current = null
      pinchTargetTable.current = null
    }

    setIsDragging(false)
  }

  function handlePointerLeave(e: PointerEvent) {
    // Clean up pointer tracking when pointer leaves canvas
    activePointers.current.delete(e.pointerId)

    // Reset pinch state if we drop below 2 pointers
    if (activePointers.current.size < 2) {
      isPinching.current = false
      lastPinchDistance.current = null
      pinchTargetTable.current = null
    }
  }

  function handleDoubleClick(e: React.MouseEvent) {
    // Don't reset on table double-click
    const target = e.target as HTMLElement
    if (target.closest('[data-er-table]')) return

    // Fit to view on double-click
    const container = containerRef.current
    if (!container) {
      updateTransform(DEFAULT_TRANSFORM)
      return
    }

    const rect = container.getBoundingClientRect()
    const fitTransform = calculateFitTransform(
      rect.width,
      rect.height,
      viewBox.width,
      viewBox.height
    )
    updateTransform(fitTransform)
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
        data-pinching={isPinching.current}
        className={cn(
          'relative overflow-hidden w-full bg-er-entity/30 border border-er-border rounded-xl select-none',
          'touch-none', // Prevent browser gestures, we handle everything
          isDragging && 'cursor-grabbing',
          !isDragging && 'cursor-grab',
          isFullscreen && 'fixed inset-0 z-50 rounded-none border-none',
          // Safe area insets for mobile
          isFullscreen && 'pb-safe pt-safe'
        )}
        style={{ height: isFullscreen ? '100dvh' : containerHeight }} // dvh for mobile viewport
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
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
