"use client"

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ERDiagramProps, Point, SelectedColumn, ColumnHighlight, HighlightState } from './types'
import { useERLayout } from './use-er-layout'
import { ERCanvas } from './er-canvas'
import { ERTable } from './er-table'
import { ERDomain } from './er-domain'
import { ERRelationship, ERRelationshipDefs } from './er-relationship'
import { ERHelpModal } from './er-help-modal'
import { useERPersistence, generateDiagramId } from './store'
import { cn } from '@/lib/utils'
import type { ERTopology } from './types'

/**
 * Compute which columns and relationships to highlight based on selected column.
 *
 * Educational UX:
 * - When FK clicked: arrows are ORANGE (showing "I reference this PK")
 * - When PK clicked: arrows are BLUE (showing "these FKs reference me")
 */
function computeHighlights(
  topology: ERTopology,
  selectedColumn: SelectedColumn | null
): HighlightState | null {
  if (!selectedColumn) {
    return null
  }

  const { table: selectedTable, column: selectedColName } = selectedColumn

  // Find the selected column data
  const tableData = topology.tables.find(t => t.name === selectedTable)
  const columnData = tableData?.columns.find(c => c.name === selectedColName)

  if (!columnData) {
    return null
  }

  const columns: ColumnHighlight[] = []
  const relationships: ERTopology['relationships'] = []

  const isFK = columnData.constraints.includes('FK') && columnData.foreignKey
  const isPK = columnData.constraints.includes('PK')

  if (isFK && columnData.foreignKey) {
    // User clicked a FK → mode is 'fk' → arrows are orange
    const targetTable = columnData.foreignKey.table
    const targetColumn = columnData.foreignKey.column

    // Highlight the target PK (blue gradient, receives the reference)
    columns.push({ table: targetTable, column: targetColumn, type: 'pk' })

    // Find all FKs that reference the same PK (including the clicked one)
    for (const rel of topology.relationships) {
      if (rel.to.table === targetTable && rel.to.column === targetColumn) {
        columns.push({ table: rel.from.table, column: rel.from.column, type: 'fk' })
        relationships.push(rel)
      }
    }

    return { mode: 'fk', columns, relationships }
  } else if (isPK) {
    // User clicked a PK → mode is 'pk' → arrows are blue
    columns.push({ table: selectedTable, column: selectedColName, type: 'pk' })

    for (const rel of topology.relationships) {
      if (rel.to.table === selectedTable && rel.to.column === selectedColName) {
        columns.push({ table: rel.from.table, column: rel.from.column, type: 'fk' })
        relationships.push(rel)
      }
    }

    return { mode: 'pk', columns, relationships }
  }

  return null
}

export function ERDiagram({ topology, title, className }: ERDiagramProps) {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [verboseTables, setVerboseTables] = useState<Set<string>>(new Set())
  const shouldReduceMotion = useReducedMotion()

  // Generate stable diagram ID for persistence
  // useMemo needed here since generateDiagramId computes a hash
  const diagramId = useMemo(
    () => generateDiagramId(topology, title),
    [topology, title]
  )

  // Persistence hook for localStorage - use persisted values directly
  const {
    positions: tablePositions,
    scales: tableScales,
    isFullscreen,
    canvasTransform,
    setPositions: setTablePositions,
    setScales: setTableScales,
    setFullscreen,
    setCanvasTransform,
    resetLayout: resetPersistedLayout,
  } = useERPersistence(diagramId)

  const { getLayout } = useERLayout(topology)

  // Compute current layout with position and scale overrides
  const currentLayout = getLayout({ positions: tablePositions, scales: tableScales })

  const activeTable = selectedTable ?? hoveredTable

  // Compute column highlights based on selected column
  const highlightState = computeHighlights(topology, selectedColumn)

  // Highlighted relationships - either from column selection or table hover
  const highlightedRelationships = new Set(
    highlightState
      ? highlightState.relationships.map(r => `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`)
      : topology.relationships
          .filter(r => r.from.table === activeTable || r.to.table === activeTable)
          .map(r => `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`)
  )

  // Get column highlights for a specific table
  function getColumnHighlights(tableName: string): ColumnHighlight[] {
    return highlightState?.columns.filter(h => h.table === tableName) ?? []
  }

  function getRelationshipKey(r: typeof topology.relationships[0]) {
    return `${r.from.table}.${r.from.column}-${r.to.table}.${r.to.column}`
  }

  function handleColumnClick(table: string, column: string) {
    // Toggle selection
    if (selectedColumn?.table === table && selectedColumn.column === column) {
      setSelectedColumn(null)
    } else {
      setSelectedColumn({ table, column })
    }
  }

  function handleTableDrag(tableName: string, position: Point) {
    setTablePositions({ ...tablePositions, [tableName]: position })
  }

  function handleTableZoom(tableName: string, delta: number) {
    const currentScale = tableScales[tableName] ?? 1
    const newScale = Math.min(Math.max(currentScale * delta, 0.5), 2.5)
    setTableScales({ ...tableScales, [tableName]: newScale })
  }

  function handleResetLayout() {
    resetPersistedLayout()
  }

  function toggleFullscreen() {
    setFullscreen(!isFullscreen)
  }

  function exitFullscreen() {
    setFullscreen(false)
  }

  function handleVerboseToggle(tableName: string) {
    setVerboseTables(prev => {
      const next = new Set(prev)
      if (next.has(tableName)) {
        next.delete(tableName)
      } else {
        next.add(tableName)
      }
      return next
    })
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isFullscreen) {
        setFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, setFullscreen])

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  const hasCustomLayout = Object.keys(tablePositions).length > 0 ||
    Object.keys(tableScales).length > 0 ||
    canvasTransform.x !== 0 ||
    canvasTransform.y !== 0 ||
    canvasTransform.scale !== 1

  return (
    <figure className={cn('relative', className)}>
      {title && (
        <figcaption className="text-er-text font-semibold mb-3">
          {title}
        </figcaption>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-2">
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-er-text-muted hover:text-er-text bg-er-entity/50 hover:bg-er-entity border border-er-border rounded-md transition-colors"
          aria-label="Help - Learn about ER diagrams"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          Help
        </button>
        <AnimatePresence>
          {hasCustomLayout && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              type="button"
              onClick={handleResetLayout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-er-text-muted hover:text-er-text bg-er-entity/50 hover:bg-er-entity border border-er-border rounded-md transition-colors"
              aria-label="Reset table positions and scales to default"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8a6 6 0 0 1 10.472-4M14 8a6 6 0 0 1-10.472 4" />
                <path d="M13 3v3h-3M3 10v3h3" />
              </svg>
              Reset
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-er-text-muted hover:text-er-text bg-er-entity/50 hover:bg-er-entity border border-er-border rounded-md transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? (
            <>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 2v3H2M11 2v3h3M5 14v-3H2M11 14v-3h3" />
              </svg>
              Exit
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" />
              </svg>
              Fullscreen
            </>
          )}
        </button>
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-er-entity/95 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <ERCanvas
        viewBox={currentLayout.viewBox}
        isFullscreen={isFullscreen}
        onTableZoom={handleTableZoom}
        canvasTransform={canvasTransform}
        onCanvasTransformChange={setCanvasTransform}
      >
        {/* Domains and relationships (render under tables) */}
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={currentLayout.viewBox.width}
          height={currentLayout.viewBox.height}
          style={{ zIndex: 0 }}
        >
          <ERRelationshipDefs />
          {/* Domains first (background boxes) */}
          {currentLayout.domains.map(domainLayout => (
            <ERDomain
              key={domainLayout.domain.name}
              layout={domainLayout}
            />
          ))}
          {/* Relationships on top of domains */}
          {currentLayout.relationships.map(rel => {
            const isHighlighted = highlightedRelationships.has(getRelationshipKey(rel.relationship))
            return (
              <ERRelationship
                key={getRelationshipKey(rel.relationship)}
                path={rel}
                highlightMode={isHighlighted ? (highlightState?.mode ?? null) : null}
              />
            )
          })}
        </svg>

        {/* Tables render on top of lines */}
        {currentLayout.tables.map(tableLayout => (
          <ERTable
            key={tableLayout.table.name}
            layout={tableLayout}
            highlighted={tableLayout.table.name === hoveredTable}
            selected={tableLayout.table.name === selectedTable}
            scale={tableScales[tableLayout.table.name] ?? 1}
            columnHighlights={getColumnHighlights(tableLayout.table.name)}
            verbose={verboseTables.has(tableLayout.table.name)}
            onHover={setHoveredTable}
            onSelect={setSelectedTable}
            onDrag={handleTableDrag}
            onColumnClick={handleColumnClick}
            onVerboseToggle={handleVerboseToggle}
          />
        ))}
      </ERCanvas>

      {/* Fullscreen controls */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-er-text bg-er-entity border border-er-border rounded-lg shadow-lg hover:bg-er-entity-header transition-colors"
              aria-label="Help"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Help
            </button>
            {hasCustomLayout && (
              <button
                type="button"
                onClick={handleResetLayout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-er-text bg-er-entity border border-er-border rounded-lg shadow-lg hover:bg-er-entity-header transition-colors"
                aria-label="Reset table positions and scales"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8a6 6 0 0 1 10.472-4M14 8a6 6 0 0 1-10.472 4" />
                  <path d="M13 3v3h-3M3 10v3h3" />
                </svg>
                Reset Layout
              </button>
            )}
            <button
              type="button"
              onClick={exitFullscreen}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-er-text bg-er-entity border border-er-border rounded-lg shadow-lg hover:bg-er-entity-header transition-colors"
              aria-label="Exit fullscreen"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 2v3H2M11 2v3h3M5 14v-3H2M11 14v-3h3" />
              </svg>
              Exit Fullscreen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-2 text-xs text-er-text-muted">
        Drag tables to reposition. Scroll on table to zoom it. Scroll on canvas to zoom all. Double-click canvas to reset view.
        {' '}Click <span className="font-semibold">?</span> in table header to show column descriptions.
        {isFullscreen && ' Press Escape to exit fullscreen.'}
      </p>

      <ERHelpModal open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </figure>
  )
}
