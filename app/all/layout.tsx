import { Suspense } from 'react'


export default function AllLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-5">
        <h1 className="text-2xl font-bold">All Problems</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
    </div>
  )
}