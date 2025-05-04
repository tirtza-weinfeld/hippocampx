import { SearchX } from "lucide-react"

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted/30">
        <SearchX className="h-10 w-10 text-muted-foreground" />
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400">
          <span className="text-lg">?</span>
        </div>
      </div>
      <div className="text-lg font-medium">No results found</div>
      <div className="mt-1 max-w-xs text-sm text-muted-foreground">
        Try searching for something else or check your spelling
      </div>
    </div>
  )
}
