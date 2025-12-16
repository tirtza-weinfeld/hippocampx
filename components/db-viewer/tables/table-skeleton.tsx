import { PaginationSkeleton } from "./pagination-skeleton";

export function TableSkeleton() {
  return (
    <div className="flex flex-col flex-1 h-full gap-4">
      {/* Table skeleton */}
      <div className="flex-1 min-h-0 rounded-2xl overflow-hidden">
        <div className="h-full">
          {/* Header skeleton */}
          <div className="flex gap-4 p-4 bg-db-surface-raised/95">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <div className="h-4 w-20 bg-db-border/50 rounded animate-pulse mb-2" />
                <div className="h-5 w-16 bg-db-border/30 rounded animate-pulse" />
              </div>
            ))}
          </div>
          {/* Row skeletons */}
          <div className="divide-y divide-db-border/20">
            {Array.from({ length: 8 }).map((_, rowIdx) => (
              <div key={rowIdx} className="flex gap-4 p-4">
                {Array.from({ length: 4 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex-1 min-w-[120px]">
                    <div
                      className="h-4 bg-db-border/30 rounded animate-pulse"
                      style={{
                        width: `${60 + Math.random() * 30}%`,
                        animationDelay: `${(rowIdx * 4 + colIdx) * 50}ms`
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PaginationSkeleton />

    </div>
  );
}