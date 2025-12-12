/**
 * ERDiagram Types
 *
 * Types for ER diagram rendering.
 * Plugin provides topology (graph analysis), component handles layout.
 */

// ============================================================================
// SCHEMA TYPES (from plugin)
// ============================================================================

export type Constraint = "PK" | "FK" | "UK"

export interface ForeignKey {
  table: string
  column: string
}

export interface Column {
  name: string
  type: string
  constraints: Constraint[]
  foreignKey?: ForeignKey
}

export interface Table {
  name: string
  columns: Column[]
}

export interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
}

// ============================================================================
// TOPOLOGY TYPES (computed by plugin at build time)
// ============================================================================

export interface TableMetrics {
  columnCount: number
  incomingFKs: number
  outgoingFKs: number
  isPrimaryHub: boolean
}

export interface Cluster {
  id: string
  tables: string[]
  root: string
}

export interface ERTopology {
  tables: Table[]
  relationships: Relationship[]
  metrics: Record<string, TableMetrics>
  layers: string[][]
  clusters: Cluster[]
}

// ============================================================================
// LAYOUT TYPES (computed by component at runtime)
// ============================================================================

export interface Point {
  x: number
  y: number
}

export interface Dimensions {
  width: number
  height: number
}

export interface TableLayout {
  table: Table
  position: Point
  dimensions: Dimensions
}

export interface RelationshipPath {
  relationship: Relationship
  path: string
  fkSide: 'left' | 'right'  // Which side the FK connects from
}

export interface DiagramLayout {
  tables: TableLayout[]
  relationships: RelationshipPath[]
  viewBox: Dimensions
}

// ============================================================================
// INTERACTION TYPES
// ============================================================================

export type TablePositions = Partial<Record<string, Point>>
export type TableScales = Partial<Record<string, number>>

export interface SelectedColumn {
  table: string
  column: string
}

export type HighlightMode = 'pk' | 'fk'

export interface ColumnHighlight {
  table: string
  column: string
  type: HighlightMode
}

export interface HighlightState {
  mode: HighlightMode
  columns: ColumnHighlight[]
  relationships: Relationship[]
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ERDiagramProps {
  topology: ERTopology
  title?: string
  className?: string
}
