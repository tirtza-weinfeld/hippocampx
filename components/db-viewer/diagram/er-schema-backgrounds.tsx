/**
 * ER Schema Backgrounds
 *
 * Renders colored background regions for each database schema.
 */

import type { SchemaBound } from "@/lib/db-viewer/types";

interface ERSchemaBackgroundsProps {
  schemaBounds: Record<string, SchemaBound>;
  /** Offset the entire background (rect + label) down by this amount */
  offsetY?: number;
}

export function ERSchemaBackgrounds({ schemaBounds, offsetY = 0 }: ERSchemaBackgroundsProps) {
  return (
    <g className="er-schema-backgrounds">
      {Object.entries(schemaBounds).map(([schema, bounds]) => {
        const y = bounds.y + offsetY;
        const height = bounds.height - offsetY;

        return (
          <g key={schema} data-db-schema={bounds.index % 6}>
            <rect
              x={bounds.x}
              y={y}
              width={bounds.width}
              height={height}
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
              y={y + 20}
              style={{
                fill: "var(--db-er-schema)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {schema}
            </text>
          </g>
        );
      })}
    </g>
  );
}
