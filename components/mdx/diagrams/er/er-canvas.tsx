"use client"

import { useRef, useState, type ReactNode, type PointerEvent, type WheelEvent } from 'react'

interface ERCanvasProps {
  children: ReactNode
  viewBox: { width: number; height: number }
  onPanToTable?: (tableName: string) => void
}

interface Transform {
  x: number
  y: number
  scale: number
}

export function ERCanvas({ children, viewBox }: ERCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    setTransform(t => ({ ...t, x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }))
  }

  const handlePointerUp = () => setIsDragging(false)

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(transform.scale * delta, 0.25), 3)

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    setTransform(t => ({
      scale: newScale,
      x: mouseX - (mouseX - t.x) * (newScale / t.scale),
      y: mouseY - (mouseY - t.y) * (newScale / t.scale),
    }))
  }

  const handleDoubleClick = () => setTransform({ x: 0, y: 0, scale: 1 })

  return (
    <div
      ref={containerRef}
      data-er-canvas
      data-dragging={isDragging}
      className="relative overflow-hidden w-full min-h-[500px] bg-er-entity/30 border border-er-border rounded-xl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
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
    </div>
  )
}
