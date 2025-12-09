import { Skeleton } from "@/components/ui/skeleton";
import { Link2 } from "lucide-react";

export function RelationsSkeleton() {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-50 to-orange-100/80 dark:from-amber-950/60 dark:to-orange-900/40 ring-1 ring-amber-200/50 dark:ring-amber-700/30">
          <Link2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Related Words</h2>
      </div>

      <div className="grid gap-3 grid-cols-3 w-70">
        {[1, 2, 3, 4, 5].map(function renderSkeleton(i) {
          return (
            <Skeleton key={i} className="h-4 rounded-xl" />
          );
        })}
      </div>
    </section>
  );
}
