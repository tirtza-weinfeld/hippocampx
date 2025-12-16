export default function Loading() {
  return (
    <div className="animate-pulse p-8 max-w-4xl mx-auto">
      {/* Title skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />

      {/* Description skeleton */}
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8" />

      {/* Problem list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div
              className="h-5 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ width: `${200 + (i % 5) * 40}px` }}
            />
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
