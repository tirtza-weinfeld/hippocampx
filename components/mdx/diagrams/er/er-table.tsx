"use client"

import type { TableLayout } from './types'
import { ERColumn } from './er-column'

interface ERTableProps {
  layout: TableLayout
  highlighted: boolean
  selected: boolean
  onHover: (tableName: string | null) => void
  onSelect: (tableName: string | null) => void
  onFKClick?: (table: string, column: string) => void
}

export function ERTable({ layout, highlighted, selected, onHover, onSelect, onFKClick }: ERTableProps) {
  const { table, position, dimensions } = layout

  return (
    <article
      data-er-table
      data-highlighted={highlighted}
      data-selected={selected}
      className="absolute rounded-lg border-2 overflow-hidden bg-er-entity border-er-border"
      style={{ left: position.x, top: position.y, width: dimensions.width }}
      onPointerEnter={() => onHover(table.name)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect(selected ? null : table.name)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(selected ? null : table.name)
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Table ${table.name}, ${table.columns.length} columns`}
    >
      <header className="bg-er-entity-header px-3 py-2 font-semibold text-er-text border-b border-er-border">
        {table.name}
      </header>
      <div>
        {table.columns.map(col => <ERColumn key={col.name} column={col} onFKClick={onFKClick} />)}
      </div>
    </article>
  )
}
