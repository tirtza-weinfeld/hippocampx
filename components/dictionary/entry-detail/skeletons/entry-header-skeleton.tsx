import { Skeleton } from "@/components/ui/skeleton";

export function EntryHeaderSkeleton() {
  return (
    <header className="space-y-2">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-20" />
      </div>
    </header>
  );
}
