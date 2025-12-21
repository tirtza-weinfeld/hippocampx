/**
 * ER Diagram SVG Definitions
 *
 * Reusable SVG markers and filters for relationship lines.
 */

export function ERDefs() {
  return (
    <defs>
      <marker
        id="er-arrowhead"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="8 0, 8 8, 0 4" className="fill-db-er-line" />
      </marker>
      <marker
        id="er-arrowhead-pk"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="8 0, 8 8, 0 4" className="fill-db-er-line-pk" />
      </marker>
      <marker
        id="er-arrowhead-fk"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="8 0, 8 8, 0 4" className="fill-db-er-line-fk" />
      </marker>
      {/* Start markers for many-side arrows (arrow points outward from path start) */}
      <marker
        id="er-arrowhead-start"
        markerWidth={8}
        markerHeight={8}
        refX={0}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 0 8, 8 4" className="fill-db-er-line" />
      </marker>
      <marker
        id="er-arrowhead-start-pk"
        markerWidth={8}
        markerHeight={8}
        refX={0}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 0 8, 8 4" className="fill-db-er-line-pk" />
      </marker>
      <marker
        id="er-arrowhead-start-fk"
        markerWidth={8}
        markerHeight={8}
        refX={0}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <polygon points="0 0, 0 8, 8 4" className="fill-db-er-line-fk" />
      </marker>
      {/* End markers for one-side circles (circle at path end) */}
      <marker
        id="er-circle-end"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx={4} cy={4} r={3} className="fill-db-er-line" />
      </marker>
      <marker
        id="er-circle-end-pk"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx={4} cy={4} r={3} className="fill-db-er-line-pk" />
      </marker>
      <marker
        id="er-circle-end-fk"
        markerWidth={8}
        markerHeight={8}
        refX={8}
        refY={4}
        orient="auto"
        markerUnits="strokeWidth"
      >
        <circle cx={4} cy={4} r={3} className="fill-db-er-line-fk" />
      </marker>
      <filter id="er-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
