/**
 * ER Schema Backgrounds
 *
 * Renders colored background regions for each database schema.
 */

import type { SchemaBound } from "@/lib/db-viewer/types";

interface ERSchemaBackgroundsProps {
  schemaBounds: Record<string, SchemaBound>;
}

export function ERSchemaBackgrounds({ schemaBounds }: ERSchemaBackgroundsProps) {
  return (
    <g className="er-schema-backgrounds">
      {Object.entries(schemaBounds).map(([schema, bounds]) => (
        <g key={schema} data-db-schema={bounds.index % 6}>
          <rect
            x={bounds.x}
            y={bounds.y}
            width={bounds.width}
            height={bounds.height}
            rx={12}
            style={{
              fill: "var(--db-er-schema)",
              opacity: 0.1,
              stroke: "var(--db-er-schema)",
              strokeOpacity: 0.3,
            }}
          />
          <text
            x={bounds.x + 12}
            y={bounds.y + 20}
            style={{
              fill: "var(--db-er-schema)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {schema}
          </text>
        </g>
      ))}
    </g>
  );
}
