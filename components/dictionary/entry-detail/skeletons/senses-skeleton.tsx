import { Skeleton } from "@/components/ui/skeleton";

export function SensesSkeleton() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <ol className="space-y-5 list-none">
          {[1, 2].map((i) => (
            <li key={i} className="flex gap-4">
              {/* Number */}
              <span className="text-dict-text-tertiary text-sm font-medium mt-0.5 select-none">
                {i}.
              </span>

              <div className="flex-1 space-y-3">
                {/* Definition skeleton */}
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>

                {/* Example skeleton - matches indented styling */}
                <div className="space-y-2 pl-4 border-l-2 border-dict-border">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
