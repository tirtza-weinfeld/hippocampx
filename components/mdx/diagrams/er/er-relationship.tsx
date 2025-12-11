import type { RelationshipPath } from './types'

interface ERRelationshipProps {
  path: RelationshipPath
  highlighted: boolean
}

export function ERRelationship({ path, highlighted }: ERRelationshipProps) {
  return (
    <path
      data-er-relation
      data-highlighted={highlighted}
      d={path.path}
      markerEnd="url(#er-crowfoot-many)"
      markerStart="url(#er-crowfoot-one)"
    />
  )
}

export function ERRelationshipDefs() {
  return (
    <defs>
      <marker
        id="er-crowfoot-one"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <line x1="0" y1="5" x2="10" y2="5" className="stroke-er-relation stroke-1" />
      </marker>
      <marker
        id="er-crowfoot-many"
        viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <line x1="0" y1="5" x2="10" y2="0" className="stroke-er-relation stroke-1" />
        <line x1="0" y1="5" x2="10" y2="5" className="stroke-er-relation stroke-1" />
        <line x1="0" y1="5" x2="10" y2="10" className="stroke-er-relation stroke-1" />
      </marker>
    </defs>
  )
}
