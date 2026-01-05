export function GameSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      {/* Progress indicator skeleton - 7 dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className="size-8 rounded-full bg-gradient-wv-locked/30 animate-pulse" />
            {i < 6 && <div className="mx-1 h-0.5 w-6 bg-gradient-wv-locked/20" />}
          </div>
        ))}
      </div>

      {/* Title skeleton */}
      <div className="space-y-2 text-center">
        <div className="mx-auto h-7 w-48 rounded-lg bg-gradient-wv-surface animate-pulse" />
        <div className="mx-auto h-4 w-64 rounded bg-gradient-wv-surface animate-pulse" />
      </div>

      {/* Hint section skeleton */}
      <div className="rounded-2xl bg-gradient-wv-hint-bg/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-gradient-wv-surface animate-pulse" />
          <div className="h-4 w-20 rounded bg-gradient-wv-surface animate-pulse" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-7 w-16 rounded-lg bg-gradient-wv-surface animate-pulse" />
              <div className="h-4 flex-1 rounded bg-gradient-wv-surface/50 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Main content area skeleton */}
      <div className="min-h-[300px] rounded-3xl bg-gradient-wv-surface/50 p-6 space-y-4">
        <div className="h-2 rounded-full bg-gradient-wv-progress-bg animate-pulse" />
        <div className="h-24 rounded-2xl bg-gradient-wv-surface animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-gradient-wv-surface animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-24 rounded-xl bg-gradient-wv-surface animate-pulse" />
        <div className="h-4 w-24 rounded bg-gradient-wv-surface animate-pulse" />
        <div className="h-10 w-24 rounded-xl bg-gradient-wv-surface animate-pulse" />
      </div>
    </div>
  );
}
