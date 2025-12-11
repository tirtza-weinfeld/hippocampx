"use client"

import { useState, useMemo } from 'react'
import type { ERDiagramProps } from './types'
import { useERLayout } from './use-er-layout'
import { ERCanvas } from './er-canvas'
import { ERTable } from './er-table'
import { ERRelationship, ERRelationshipDefs } from './er-relationship'

export function ERDiagram({ topology, title, className }: ERDiagramProps) {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const layout = useERLayout(topology)

  const activeTable = selectedTable ?? hoveredTable

  const highlightedRelationships = useMemo(() => {
    if (!activeTable) return new Set<string>()
    return new Set(
      topology.relationships
        .filter(r => r.from.table === activeTable || r.to.table === activeTable)
        .map(r => `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`)
    )
  }, [activeTable, topology.relationships])

  const getRelationshipKey = (r: typeof topology.relationships[0]) =>
    `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`

  return (
    <figure className={className}>
      {title && <figcaption className="text-er-text font-semibold mb-3">{title}</figcaption>}
      <ERCanvas viewBox={layout.viewBox}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width={layout.viewBox.width}
          height={layout.viewBox.height}
        >
          <ERRelationshipDefs />
          {layout.relationships.map(rel => (
            <ERRelationship
              key={getRelationshipKey(rel.relationship)}
              path={rel}
              highlighted={highlightedRelationships.has(getRelationshipKey(rel.relationship))}
            />
          ))}
        </svg>

        {layout.tables.map(tableLayout => (
          <ERTable
            key={tableLayout.table.name}
            layout={tableLayout}
            highlighted={tableLayout.table.name === hoveredTable}
            selected={tableLayout.table.name === selectedTable}
            onHover={setHoveredTable}
            onSelect={setSelectedTable}
          />
        ))}
      </ERCanvas>
    </figure>
  )
}
