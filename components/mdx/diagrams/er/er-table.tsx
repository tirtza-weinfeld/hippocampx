"use client"

import { useRef, useState, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { TableLayout, Point, ColumnHighlight } from './types'
import { ERColumn } from './er-column'
import { cn } from '@/lib/utils'

interface ERTableProps {
  layout: TableLayout
  highlighted: boolean
  selected: boolean
  zIndex?: number
  scale?: number
  columnHighlights?: ColumnHighlight[]
  verbose?: boolean
  onHover: (tableName: string | null) => void
  onSelect: (tableName: string | null) => void
  onDrag?: (tableName: string, position: Point) => void
  onColumnClick?: (table: string, column: string) => void
  onVerboseToggle?: (tableName: string) => void
}

export function ERTable({
  layout,
  highlighted,
  selected,
  zIndex,
  scale = 1,
  columnHighlights = [],
  verbose = false,
  onHover,
  onSelect,
  onDrag,
  onColumnClick,
  onVerboseToggle,
}: ERTableProps) {
  const { table, position, dimensions } = layout
  const tableRef = useRef<HTMLElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 })
  const dragStart = useRef<{ pointerX: number; pointerY: number; tableX: number; tableY: number } | null>(null)
  const shouldReduceMotion = useReducedMotion()

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return
    // Don't stopPropagation - canvas needs to track all pointers for pinch-to-zoom
    // Canvas will check isOnTable and skip panning when pointer is on table

    setIsDragging(true)
    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      tableX: position.x,
      tableY: position.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging || !dragStart.current) return
    e.stopPropagation()

    const deltaX = e.clientX - dragStart.current.pointerX
    const deltaY = e.clientY - dragStart.current.pointerY

    setDragOffset({ x: deltaX, y: deltaY })

    if (onDrag) {
      onDrag(table.name, {
        x: dragStart.current.tableX + deltaX,
        y: dragStart.current.tableY + deltaY,
      })
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging) return
    e.stopPropagation()

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
    dragStart.current = null
  }

  function handleClick(e: React.MouseEvent) {
    // Don't trigger selection if we just dragged
    if (Math.abs(dragOffset.x) > 5 || Math.abs(dragOffset.y) > 5) {
      e.stopPropagation()
      return
    }
    onSelect(selected ? null : table.name)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(selected ? null : table.name)
    }
  }

  // Check if any columns have metadata (comment or example)
  const hasAnyMetadata = table.columns.some(col => col.comment !== undefined || col.example !== undefined)

  function handleVerboseToggle(e: React.MouseEvent) {
    e.stopPropagation()
    onVerboseToggle?.(table.name)
  }

  // Calculate table dimensions (verbose mode expands width via fit-content, not height)
  const baseColumnHeight = 32
  const tableHeight = 44 + table.columns.length * baseColumnHeight

  // Position is at the center, offset by scaled size
  const centerX = position.x + dimensions.width / 2
  const centerY = position.y + tableHeight / 2

  // Use scale prop directly, no hover/click effects
  const effectiveScale = scale

  return (
    <motion.article
      ref={tableRef}
      data-er-table
      data-table-name={table.name}
      data-highlighted={highlighted}
      data-selected={selected}
      data-dragging={isDragging}
      className={cn(
        'absolute rounded-lg border-2 overflow-hidden bg-er-card border-er-border',
        isDragging && 'cursor-grabbing',
        !isDragging && 'cursor-grab',
        scale !== 1 && 'ring-2 ring-er-line/50'
      )}
      style={{
        left: centerX,
        top: centerY,
        width: verbose && hasAnyMetadata ? 'fit-content' : dimensions.width,
        minWidth: dimensions.width,
        marginLeft: -dimensions.width / 2,
        marginTop: -tableHeight / 2,
        zIndex: isDragging ? 1000 : zIndex,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => !isDragging && onHover(table.name)}
      onPointerLeave={() => !isDragging && onHover(null)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Table ${table.name}, ${table.columns.length} columns. Drag to reposition. Scroll to zoom.`}
      initial={false}
      animate={{
        scale: effectiveScale,
        boxShadow: isDragging
          ? '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          : scale > 1
            ? '0 10px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
            : highlighted || selected
              ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      }}
      transition={{
        scale: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: shouldReduceMotion ? 0 : undefined,
        },
        boxShadow: {
          duration: shouldReduceMotion ? 0 : 0.2,
        },
      }}
    >
      <header className="bg-er-card-header px-3 py-2 font-semibold text-er-text border-b border-er-border flex items-center gap-2">
        <svg
          className="w-4 h-4 text-er-text-muted shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="4" cy="4" r="1.5" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        <span
          className="truncate cursor-pointer hover:text-er-text-muted active:text-er-copy active:scale-95 transition-transform"
          onClick={(e) => {
            e.stopPropagation()
            void navigator.clipboard.writeText(table.name)
          }}
          role="button"
          tabIndex={0}
          aria-label={`Copy table name: ${table.name}`}
        >
          {table.name}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {scale !== 1 && (
            <span className="text-xs font-mono text-er-text-muted">
              {Math.round(scale * 100)}%
            </span>
          )}
          {hasAnyMetadata && (
            <button
              type="button"
              onClick={handleVerboseToggle}
              className={cn(
                'w-6 h-6 pointer-coarse:w-8 pointer-coarse:h-8 rounded flex items-center justify-center text-xs font-bold transition-colors',
                'active:scale-90 active:opacity-80',
                verbose
                  ? 'bg-er-pk-soft text-er-pk'
                  : 'bg-er-card text-er-text-muted hover:bg-er-card-header hover:text-er-text'
              )}
              aria-label={verbose ? 'Hide column descriptions' : 'Show column descriptions'}
              aria-pressed={verbose}
              title={verbose ? 'Hide descriptions (click to collapse)' : 'Show descriptions (click to expand)'}
            >
              ?
            </button>
          )}
        </div>
      </header>
      <div>
        {table.columns.map(col => {
          const highlight = columnHighlights.find(h => h.column === col.name)
          return (
            <ERColumn
              key={col.name}
              column={col}
              tableName={table.name}
              highlight={highlight?.type}
              verbose={verbose}
              onColumnClick={onColumnClick}
            />
          )
        })}
      </div>
    </motion.article>
  )
}
