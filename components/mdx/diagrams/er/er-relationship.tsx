"use client"

import { motion, useReducedMotion } from 'motion/react'
import type { RelationshipPath, HighlightMode } from './types'

interface ERRelationshipProps {
  path: RelationshipPath
  highlightMode: HighlightMode | null
}

export function ERRelationship({ path, highlightMode }: ERRelationshipProps) {
  const shouldReduceMotion = useReducedMotion()
  const isHighlighted = highlightMode !== null

  const pathTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    duration: shouldReduceMotion ? 0 : undefined,
  }

  // Use fkSide directly: 'right' → marker points right, 'left' → marker points left
  const fkMarkerSuffix = highlightMode ? `-${path.fkSide}-${highlightMode}` : `-${path.fkSide}`
  const pkMarkerSuffix = highlightMode ? `-${highlightMode}` : ''

  return (
    <g className="er-relationship-group">
      {/* Shadow/glow for better visibility */}
      <motion.path
        d={path.path}
        data-highlight-mode={highlightMode}
        className="fill-none stroke-er-relation/40 data-[highlight-mode=fk]:stroke-er-relation-highlight-fk/50 data-[highlight-mode=pk]:stroke-er-relation-highlight-pk/50"
        initial={false}
        animate={{
          d: path.path,
          strokeWidth: isHighlighted ? 10 : 8,
        }}
        transition={pathTransition}
        strokeLinecap="round"
      />
      {/* Main path */}
      <motion.path
        data-er-relation
        data-highlight-mode={highlightMode}
        className="fill-none stroke-er-relation stroke-[2] data-[highlight-mode]:stroke-[3]"
        initial={false}
        animate={{
          d: path.path,
        }}
        transition={pathTransition}
        strokeLinecap="round"
        markerStart={`url(#er-fk-marker${fkMarkerSuffix})`}
        markerEnd={`url(#er-pk-marker${pkMarkerSuffix})`}
      />
    </g>
  )
}

export function ERRelationshipDefs() {
  // Marker size must match FK_MARKER_SIZE in use-er-layout.ts
  const size = 8
  const hlSize = 10

  return (
    <defs>
      {/*
        FK Triangle markers:
        - refX at TIP (line comes from tip)
        - Path offset=8 so path starts at tip position
        - Base extends back toward table edge
      */}

      {/* FK pointing RIGHT: tip at right (refX=10), base extends left toward table */}
      <marker
        id="er-fk-marker-right"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        overflow="visible"
      >
        <path d="M 0 1 L 10 5 L 0 9 Z" className="fill-er-relation" />
      </marker>

      {/* FK pointing LEFT: tip at left (refX=0), base extends right toward table */}
      <marker
        id="er-fk-marker-left"
        viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        overflow="visible"
      >
        <path d="M 10 1 L 0 5 L 10 9 Z" className="fill-er-relation" />
      </marker>

      {/* PK circle */}
      <marker
        id="er-pk-marker"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={size}
        markerHeight={size}
        overflow="visible"
      >
        <circle cx="5" cy="5" r="4" className="fill-er-relation" />
      </marker>

      {/* Highlighted FK markers - RIGHT: tip at right (refX=10) */}
      <marker
        id="er-fk-marker-right-fk"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <path d="M 0 1 L 10 5 L 0 9 Z" className="fill-er-relation-highlight-fk" />
      </marker>
      <marker
        id="er-fk-marker-right-pk"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <path d="M 0 1 L 10 5 L 0 9 Z" className="fill-er-relation-highlight-pk" />
      </marker>

      {/* Highlighted FK markers - LEFT: tip at left (refX=0) */}
      <marker
        id="er-fk-marker-left-fk"
        viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <path d="M 10 1 L 0 5 L 10 9 Z" className="fill-er-relation-highlight-fk" />
      </marker>
      <marker
        id="er-fk-marker-left-pk"
        viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <path d="M 10 1 L 0 5 L 10 9 Z" className="fill-er-relation-highlight-pk" />
      </marker>

      {/* Highlighted PK circles */}
      <marker
        id="er-pk-marker-fk"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <circle cx="5" cy="5" r="5" className="fill-er-relation-highlight-fk" />
      </marker>
      <marker
        id="er-pk-marker-pk"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth={hlSize}
        markerHeight={hlSize}
        overflow="visible"
      >
        <circle cx="5" cy="5" r="5" className="fill-er-relation-highlight-pk" />
      </marker>
    </defs>
  )
}
