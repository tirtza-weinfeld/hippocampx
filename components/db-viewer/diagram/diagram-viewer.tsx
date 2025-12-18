"use client";

import { ERDiagram } from "./er-diagram";
import type { SchemaTopology } from "@/lib/db-viewer/types";

interface DiagramViewerProps {
  topology: SchemaTopology;
}

export function DiagramViewer({ topology }: DiagramViewerProps) {
  return (
    <div className="relative size-full">
      <ERDiagram topology={topology} />
    </div>
  );
}
