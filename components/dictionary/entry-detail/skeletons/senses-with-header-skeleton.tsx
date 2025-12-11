export function SensesWithHeaderSkeleton() {
  return (
    <>
      {/* Entry metadata skeleton - matches the real component */}
      <div className="flex items-center gap-3 text-dict-text-secondary -mt-4">
        <div className="h-4 w-12 rounded bg-dict-skeleton" />
        <span className="text-dict-text-tertiary">|</span>
        <div className="h-4 w-6 rounded bg-dict-skeleton" />
      </div>

      {/* Senses skeleton - matches SensesList styling */}
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
                    <div className="h-5 w-full rounded bg-dict-skeleton" />
                    <div className="h-5 w-3/4 rounded bg-dict-skeleton" />
                  </div>

                  {/* Example skeleton - matches indented styling */}
                  <div className="space-y-2 pl-4 border-l-2 border-dict-border">
                    <div className="space-y-1">
                      <div className="h-4 w-full rounded bg-dict-skeleton" />
                      <div className="h-3 w-32 rounded bg-dict-skeleton" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
