"use client"

import type { KeyboardEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Column, Constraint, ForeignKey } from './types'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface ERColumnProps {
  column: Column
  tableName: string
  highlight?: 'pk' | 'fk'
  verbose?: boolean
  onColumnClick?: (table: string, column: string) => void
}

interface ConstraintBadgeProps {
  constraint: Constraint
  foreignKey?: ForeignKey
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONSTRAINT_STYLES = {
  PK: 'bg-er-pk text-er-pk-text',
  FK: 'bg-er-fk text-er-fk-text cursor-pointer hover:opacity-80 transition-opacity',
  UK: 'bg-er-uk text-er-uk-text',
} as const satisfies Record<Constraint, string>

// ============================================================================
// COMPONENTS
// ============================================================================

function ConstraintBadge({ constraint, foreignKey }: ConstraintBadgeProps) {
  const title = foreignKey
    ? `References ${foreignKey.table}.${foreignKey.column}`
    : undefined

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 text-xs rounded font-mono select-none',
        CONSTRAINT_STYLES[constraint]
      )}
      title={title}
    >
      {constraint}
    </span>
  )
}

// ============================================================================
// INLINE METADATA (for verbose mode - horizontal expansion)
// ============================================================================

interface InlineMetadataProps {
  comment?: string
  example?: string
}

function InlineMetadata({ comment, example }: InlineMetadataProps) {
  const shouldReduceMotion = useReducedMotion()

  if (!comment && !example) return null

  return (
    <motion.span
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0, width: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
      className="overflow-hidden flex items-center gap-2 text-xs shrink-0 whitespace-nowrap"
    >
      <span className="w-px h-4 bg-er-border" />
      {comment && <span className="text-er-comment">{comment}</span>}
      {example && <span className="font-mono text-er-example">{example}</span>}
    </motion.span>
  )
}

export function ERColumn({ column, tableName, highlight, verbose, onColumnClick }: ERColumnProps) {
  const hasConstraints = column.constraints.length > 0
  const hasPK = column.constraints.includes('PK')
  const hasFK = column.constraints.includes('FK')
  const isClickable = hasPK || hasFK
  const hasMetadata = column.comment !== undefined || column.example !== undefined

  function handleClick() {
    if (isClickable && onColumnClick) {
      onColumnClick(tableName, column.name)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.key === 'Enter' || event.key === ' ') && isClickable && onColumnClick) {
      event.preventDefault()
      onColumnClick(tableName, column.name)
    }
  }

  return (
    <div className="border-b border-er-border last:border-b-0">
      <div
        className={cn(
          'er-column relative',
          'flex items-center gap-2 px-3 py-1.5 pointer-coarse:py-2.5',
          'transition-colors',
          isClickable && 'cursor-pointer hover:bg-er-entity-header/50 active:bg-er-entity-header/70',
          !isClickable && 'hover:bg-er-entity-header/30 active:bg-er-entity-header/50',
          highlight === 'pk' && 'er-row-highlight-pk',
          highlight === 'fk' && 'er-row-highlight-fk'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-label={isClickable ? `Select ${column.name} to highlight related columns` : undefined}
      >
        {/* Connection indicator - left side (for incoming arrows to PK) */}
        {hasPK && (
          <span
            className={cn(
              'absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-sm',
              highlight === 'pk' ? 'bg-er-relation-highlight-pk' : 'bg-er-pk-text'
            )}
            aria-hidden="true"
          />
        )}

        {/* Connection indicator - right side (for outgoing arrows from FK) */}
        {hasFK && (
          <span
            className={cn(
              'absolute -right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shadow-sm',
              highlight === 'fk' ? 'bg-er-relation-highlight-fk' : 'bg-er-fk-text'
            )}
            aria-hidden="true"
          />
        )}

        <span className="flex-1 whitespace-nowrap">
          <span
            className="font-medium text-er-text cursor-pointer hover:text-er-text-muted active:text-er-copy active:scale-95 inline-block transition-transform"
            onClick={(e) => {
              e.stopPropagation()
              void navigator.clipboard.writeText(column.name)
            }}
            role="button"
            tabIndex={0}
            aria-label={`Copy column name: ${column.name}`}
          >
            {column.name}
          </span>
        </span>

        <span className="text-er-text-muted text-sm font-mono shrink-0">
          {column.type}
        </span>

        {hasConstraints && (
          <div className="flex gap-1 shrink-0">
            {column.constraints.map(constraint => (
              <ConstraintBadge
                key={constraint}
                constraint={constraint}
                foreignKey={constraint === 'FK' ? column.foreignKey : undefined}
              />
            ))}
          </div>
        )}

        {/* Inline metadata shown when verbose mode is enabled - horizontal */}
        <AnimatePresence>
          {verbose && hasMetadata && (
            <InlineMetadata comment={column.comment} example={column.example} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
