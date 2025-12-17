import { Suspense } from "react";
import { getTableStats, getTableMetadata, queryTableData } from "@/lib/db-viewer/queries";
import { TableBrowser } from "@/components/db-viewer";
import type { SortConfig } from "@/lib/db-viewer/types";

export const metadata = {
  title: "Table Browser | Database Explorer",
  description: "Browse and query database tables",
};

interface SearchParams {
  table?: string;
  page?: string;
  sort?: string;
  dir?: "asc" | "desc";
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function TableBrowserLoader({ searchParams }: { searchParams: SearchParams }) {
  const { table, page = "1", sort, dir } = searchParams;

  const stats = await getTableStats();

  if (table) {
    const sortConfig: SortConfig | undefined = sort && dir
      ? { column: sort, direction: dir }
      : undefined;

    const [tableData, tableMetadata] = await Promise.all([
      queryTableData(table, {
        page: Number(page),
        pageSize: 25,
        sort: sortConfig,
      }),
      getTableMetadata(table),
    ]);

    return (
      <TableBrowser
        initialStats={stats}
        selectedTable={table}
        initialData={tableData}
        initialMetadata={tableMetadata}
        currentPage={Number(page)}
        currentSort={sortConfig}
      />
    );
  }

  return <TableBrowser initialStats={stats} />;
}

function TableBrowserSkeleton() {
  return (
    <div className="flex h-full overflow-hidden bg-linear-to-r from-transparent via-db-surface to-transparent">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-[300px] flex-shrink-0 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-db-border/30 animate-pulse" />
          <div>
            <div className="h-4 w-16 bg-db-border/50 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-db-border/30 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-db-border/30 rounded-xl animate-pulse mb-3" />
        <div className="flex gap-1.5 mb-4">
          <div className="h-7 w-12 bg-db-border/40 rounded-lg animate-pulse" />
          <div className="h-7 w-14 bg-db-border/30 rounded-lg animate-pulse" />
          <div className="h-7 w-14 bg-db-border/30 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          {[65, 72, 58, 80, 55, 68, 75, 62, 70, 78].map((width, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            >
              <div className="size-8 rounded-lg bg-db-border/30 animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
              <div className="flex-1">
                <div className="h-4 bg-db-border/30 rounded animate-pulse" style={{ width: `${width}%`, animationDelay: `${i * 50}ms` }} />
              </div>
              <div className="h-4 w-8 bg-db-border/20 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col p-4 lg:p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md w-full">
            <div className="size-20 mx-auto rounded-3xl bg-db-border/30 animate-pulse mb-8" />
            <div className="h-8 w-56 mx-auto bg-db-border/40 rounded animate-pulse mb-3" />
            <div className="h-4 w-40 mx-auto bg-db-border/30 rounded animate-pulse mb-8" />
            <div className="h-4 w-48 mx-auto bg-db-border/20 rounded animate-pulse mb-10" />
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-db-surface-raised/50">
                <div className="size-2 rounded-full bg-db-neon/50 animate-pulse" />
                <div className="h-4 w-10 bg-db-border/30 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<TableBrowserSkeleton />}>
      <TableBrowserLoader searchParams={params} />
    </Suspense>
  );
}
