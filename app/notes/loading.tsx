export default function Loading() {
  return (
    <div className="animate-pulse max-w-none">
      {/* Title skeleton */}
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>

      {/* Code block skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8 mb-8" />

      {/* More content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  )
}
