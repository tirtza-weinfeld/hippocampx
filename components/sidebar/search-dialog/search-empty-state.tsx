import { SearchX } from "lucide-react"

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
      <div className="relative mb-3 sm:mb-4 flex h-16 sm:h-24 w-16 sm:w-24 items-center justify-center rounded-full bg-muted/30">
        <SearchX className="h-7 sm:h-10 w-7 sm:w-10 text-muted-foreground" />
        <div className="absolute -right-1 sm:-right-2 -top-1 sm:-top-2 flex h-6 sm:h-8 w-6 sm:w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400">
          <span className="text-base sm:text-lg">?</span>
        </div>
      </div>
      <div className="text-base sm:text-lg font-medium">No results found</div>
      <div className="mt-1 max-w-xs text-xs sm:text-sm text-muted-foreground">
        Try searching for something else or check your spelling
      </div>
    </div>
  )
}
