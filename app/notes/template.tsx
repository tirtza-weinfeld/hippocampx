import { Suspense } from 'react'

function LoadingSkeleton() {
  return (
    <div className="animate-pulse max-w-none">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mt-8 mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
    </div>
  )
}

export default function NotesTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {children}
    </Suspense>
  )
}
