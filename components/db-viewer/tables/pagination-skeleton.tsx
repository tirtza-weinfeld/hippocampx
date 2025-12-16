export function PaginationSkeleton() {
  {/* Pagination skeleton */ }
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-2 py-4 mt-2">
      <div className="h-4 w-24 bg-db-border/30 rounded animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="h-10 w-20 bg-db-border/30 rounded-xl animate-pulse" />
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="size-10 bg-db-border/30 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-16 bg-db-border/30 rounded-xl animate-pulse" />
      </div>
    </div>
  )
}