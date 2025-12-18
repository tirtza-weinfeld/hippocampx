"use client";

import { motion, AnimatePresence } from "motion/react";
import type { SchemaRelationship, ColumnSelection } from "@/lib/db-viewer/types";

interface ERRelationshipsProps {
  relationships: SchemaRelationship[];
  paths: Record<string, string>;
  hiddenTables: Set<string>;
  transitionDuration: number;
  selectedColumn: ColumnSelection | null;
}

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 0.6 },
  dimmed: { pathLength: 1, opacity: 0.15 },
  highlighted: { pathLength: 1, opacity: 1 },
} as const;

function getRelationHighlight(
  rel: SchemaRelationship,
  selection: ColumnSelection | null,
  relationships: SchemaRelationship[]
): "pk" | "fk" | null {
  if (!selection) return null;

  // PK selected: highlight all relations pointing TO this PK (orange)
  if (selection.type === "pk") {
    if (rel.to.table === selection.table && rel.to.column === selection.column) {
      return "pk";
    }
  }

  // FK selected: find the target PK, then highlight ALL relations pointing to that PK (blue)
  if (selection.type === "fk") {
    // Find the relationship for the clicked FK to get its target PK
    const clickedFkRel = relationships.find(
      r => r.from.table === selection.table && r.from.column === selection.column
    );
    if (clickedFkRel) {
      // Highlight all relations pointing to the same PK
      if (rel.to.table === clickedFkRel.to.table && rel.to.column === clickedFkRel.to.column) {
        return "fk";
      }
    }
  }

  return null;
}

export function ERRelationships({
  relationships,
  paths,
  hiddenTables,
  transitionDuration,
  selectedColumn,
}: ERRelationshipsProps) {
  return (
    <g className="er-relationships">
      <AnimatePresence>
        {relationships.map(rel => {
          const path = paths[rel.id];
          if (!path) return null;

          const isHidden =
            hiddenTables.has(rel.from.table) || hiddenTables.has(rel.to.table);
          const highlight = getRelationHighlight(rel, selectedColumn, relationships);
          const hasSelection = selectedColumn !== null;

          const strokeClass = highlight === "pk"
            ? "stroke-db-er-line-pk"
            : highlight === "fk"
              ? "stroke-db-er-line-fk"
              : "stroke-db-er-line";

          const markerEnd = highlight === "pk"
            ? "url(#er-arrowhead-pk)"
            : highlight === "fk"
              ? "url(#er-arrowhead-fk)"
              : "url(#er-arrowhead)";

          const animateState = isHidden
            ? "dimmed"
            : highlight
              ? "highlighted"
              : hasSelection
                ? "dimmed"
                : "visible";

          return (
            <motion.path
              key={rel.id}
              d={path}
              variants={lineVariants}
              initial="hidden"
              animate={animateState}
              exit="hidden"
              transition={{
                duration: transitionDuration,
                ease: "easeOut",
              }}
              className={strokeClass}
              strokeWidth={highlight ? 3 : 2}
              fill="none"
              strokeLinecap="round"
              markerEnd={markerEnd}
            />
          );
        })}
      </AnimatePresence>
    </g>
  );
}
