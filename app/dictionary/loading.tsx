export default function Loading() {
  return (
    <div className="min-h-screen relative">
      {/* Ambient background */}
      <div
        className="fixed inset-0 -z-10 bg-dict-page-gradient pointer-events-none"
        aria-hidden="true"
      />

      {/* Header skeleton */}
      <div className="sticky top-0 z-20 bg-dict-glass backdrop-blur-xl border-b border-dict-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 flex-1 max-w-md bg-dict-skeleton rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-dict-skeleton rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <main className="container mx-auto px-4 pb-12 pt-6">
        {/* Results count skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-28 rounded-full bg-dict-skeleton animate-pulse" />
        </div>

        {/* Entry list skeleton */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden bg-dict-glass backdrop-blur-sm border border-dict-border/40"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="p-4 sm:p-5 flex items-start gap-4">
                {/* Word skeleton */}
                <div className="shrink-0 flex flex-col gap-1.5">
                  <div
                    className="h-5 rounded-md bg-dict-skeleton animate-pulse"
                    style={{ width: `${80 + (i % 3) * 20}px` }}
                  />
                  <div className="h-3 w-16 rounded bg-dict-surface-2/60 animate-pulse" />
                </div>

                {/* Definition skeleton */}
                <div className="flex-1 space-y-2 pt-0.5">
                  <div
                    className="h-4 rounded bg-dict-skeleton animate-pulse"
                    style={{ width: `${70 + (i % 4) * 8}%` }}
                  />
                  <div
                    className="h-4 rounded bg-dict-surface-3/50 animate-pulse"
                    style={{ width: `${40 + (i % 3) * 15}%` }}
                  />
                </div>

                {/* Tag placeholder */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <div className="h-6 w-14 rounded-full bg-dict-surface-2/40 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
