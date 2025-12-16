import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { problemComponents, problemSlugs, type ProblemSlug } from '@/components/problems/tutorials'
import { ProblemSkeleton } from '@/components/problems/problem-skeleton'

interface ProblemPageProps {
  params: Promise<{
    slug: string
  }>
}

async function ProblemContent({ slug }: { slug: string }) {
  const ComponentLoader = problemComponents[slug as ProblemSlug]
  if (!ComponentLoader) {
    notFound()
  }

  const { default: ProblemComponent } = await ComponentLoader()

  return <ProblemComponent />
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params

  if (!problemSlugs.includes(slug as ProblemSlug)) {
    notFound()
  }

  return (
    <Suspense fallback={<ProblemSkeleton />}>
      <ProblemContent slug={slug} />
    </Suspense>
  )
}
