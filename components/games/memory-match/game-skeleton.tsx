export function GameSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats bar skeleton */}
      <div className="h-16 rounded-2xl bg-gradient-mm-back/10 animate-pulse" />
      {/* Card grid skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl bg-gradient-mm-back/15 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
