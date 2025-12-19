import { Suspense } from "react";
import { buildSchemaTopologyWithComments } from "@/lib/db-viewer/schema-topology";
import { DiagramViewer } from "@/components/db-viewer";

export const metadata = {
  title: "ER Diagram | Database Explorer",
  description: "Visualize database schema relationships",
};

async function DiagramLoader() {
  const topology = await buildSchemaTopologyWithComments();
  return <DiagramViewer topology={topology} />;
}

function DiagramSkeleton() {
  return (
    <div className="size-full er-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="size-16 mx-auto rounded-2xl bg-er-table-border/30 animate-pulse mb-4" />
        <div className="h-6 w-48 mx-auto bg-er-table-border/40 rounded animate-pulse mb-2" />
        <div className="h-4 w-32 mx-auto bg-er-table-border/30 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<DiagramSkeleton />}>
      <DiagramLoader />
    </Suspense>
  );
}
