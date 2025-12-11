"use client"

import type { KeyboardEvent } from 'react'
import type { Column, Constraint, ForeignKey } from './types'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface ERColumnProps {
  column: Column
  onFKClick?: (table: string, column: string) => void
}

interface ConstraintBadgeProps {
  constraint: Constraint
  foreignKey?: ForeignKey
  onFKClick?: (table: string, column: string) => void
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

function ConstraintBadge({ constraint, foreignKey, onFKClick }: ConstraintBadgeProps) {
  const isClickable = constraint === 'FK' && foreignKey !== undefined && onFKClick !== undefined

  function handleClick() {
    if (foreignKey && onFKClick) {
      onFKClick(foreignKey.table, foreignKey.column)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if ((event.key === 'Enter' || event.key === ' ') && foreignKey && onFKClick) {
      event.preventDefault()
      onFKClick(foreignKey.table, foreignKey.column)
    }
  }

  const title = foreignKey
    ? `Navigate to ${foreignKey.table}.${foreignKey.column}`
    : undefined

  const ariaLabel = foreignKey
    ? `Foreign key referencing ${foreignKey.table}.${foreignKey.column}`
    : constraint

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 text-xs rounded font-mono select-none',
        CONSTRAINT_STYLES[constraint]
      )}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      title={title}
      aria-label={ariaLabel}
    >
      {constraint}
    </span>
  )
}

export function ERColumn({ column, onFKClick }: ERColumnProps) {
  const hasConstraints = column.constraints.length > 0

  return (
    <div
      className={cn(
        'er-column',
        'flex items-center gap-2 px-3 py-1.5',
        'border-b border-er-border last:border-b-0',
        'hover:bg-er-entity-header/50 transition-colors'
      )}
    >
      <span className="font-medium text-er-text flex-1 truncate">
        {column.name}
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
              onFKClick={onFKClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
