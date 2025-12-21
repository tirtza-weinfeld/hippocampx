"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { SchemaRelationship, ColumnSelection } from "@/lib/db-viewer/types";
import { MARKER_STUB } from "@/lib/db-viewer/er-layout";

interface ERRelationshipsProps {
  relationships: SchemaRelationship[];
  paths: Record<string, string>;
  hiddenTables: Set<string>;
  transitionDuration: number;
  selectedColumn: ColumnSelection | null;
}

const lineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.9 },
  dimmed: { opacity: 0.7 },
  highlighted: { opacity: 1 },
} as const;

interface RelationshipPathProps {
  rel: SchemaRelationship;
  path: string;
  animateState: "hidden" | "visible" | "dimmed" | "highlighted";
  strokeClass: string;
  markerStart: string;
  markerEnd: string;
  transitionDuration: number;
}

function RelationshipPath({
  rel,
  path,
  animateState,
  strokeClass,
  markerStart,
  markerEnd,
  transitionDuration,
}: RelationshipPathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [dashArray, setDashArray] = useState(`0 ${MARKER_STUB} 9999`);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      // Dash pattern: gap (hide start stub), visible (curve), gap (hide end stub)
      const visibleLength = Math.max(0, length - 2 * MARKER_STUB);
      setDashArray(`0 ${MARKER_STUB} ${visibleLength} ${MARKER_STUB}`);
    }
  }, [path]);

  return (
    <motion.path
      ref={pathRef}
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
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={dashArray}
      markerStart={markerStart}
      markerEnd={markerEnd}
    />
  );
}

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

          // Arrow on the "many" side (FK/from side) using markerStart
          const markerStart = highlight === "pk"
            ? "url(#er-arrowhead-start-pk)"
            : highlight === "fk"
              ? "url(#er-arrowhead-start-fk)"
              : "url(#er-arrowhead-start)";

          // Circle on the "one" side (PK/to side) using markerEnd
          const markerEnd = highlight === "pk"
            ? "url(#er-circle-end-pk)"
            : highlight === "fk"
              ? "url(#er-circle-end-fk)"
              : "url(#er-circle-end)";

          const animateState = isHidden
            ? "hidden"
            : highlight
              ? "highlighted"
              : hasSelection
                ? "dimmed"
                : "visible";

          return (
            <RelationshipPath
              key={rel.id}
              rel={rel}
              path={path}
              animateState={animateState}
              strokeClass={strokeClass}
              markerStart={markerStart}
              markerEnd={markerEnd}
              transitionDuration={transitionDuration}
            />
          );
        })}
      </AnimatePresence>
    </g>
  );
}
