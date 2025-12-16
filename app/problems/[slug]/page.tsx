import { notFound } from 'next/navigation'
import { cacheLife, cacheTag } from 'next/cache'
import { problemComponents, problemSlugs, type ProblemSlug } from '@/components/problems/tutorials'

interface ProblemPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return problemSlugs.map(slug => ({ slug }))
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  'use cache'
  cacheTag('problem-page')
  cacheLife('max')

  const { slug } = await params

  if (!problemSlugs.includes(slug as ProblemSlug)) {
    notFound()
  }

  const ComponentLoader = problemComponents[slug as ProblemSlug]
  if (!ComponentLoader) {
    notFound()
  }

  const { default: ProblemComponent } = await ComponentLoader()

  return <ProblemComponent />
}
