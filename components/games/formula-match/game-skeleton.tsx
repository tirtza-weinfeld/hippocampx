export function GameSkeleton() {
  return (
    <div className="relative mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-fm-term/8 p-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-gradient-fm-term/20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gradient-fm-term/15 animate-pulse" />
            <div className="h-3 w-20 rounded bg-gradient-fm-term/10 animate-pulse" />
          </div>
        </div>
        <div className="h-14 w-24 rounded-xl bg-gradient-fm-success/15 animate-pulse" />
      </div>

      {/* Board skeleton */}
      <div className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8">
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-gradient-fm-term/20" />

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Terms column */}
          <div className="space-y-4">
            <div className="h-4 w-16 rounded bg-gradient-fm-term/20 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-gradient-fm-term/10 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Formulas column */}
          <div className="space-y-4">
            <div className="h-4 w-20 rounded bg-gradient-fm-formula/20 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-2xl bg-gradient-fm-formula/10 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
