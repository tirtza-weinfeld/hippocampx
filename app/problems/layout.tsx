import type { Metadata } from 'next'
import { ProblemsMascotWrapper } from '@/components/problems/mascot/problems-mascot-wrapper'


export const metadata: Metadata = {
  title: 'Algorithm Problems',
  description: 'A comprehensive collection of algorithm problems with detailed explanations and solutions.',
}

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-5">
      {children}
      <ProblemsMascotWrapper />
    </div>
  )
}
