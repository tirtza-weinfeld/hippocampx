import type { Metadata } from 'next'
// import { MascotProviders } from '@/components/problems/mascot/mascot-providers'
// import { ProblemsMascot } from '@/components/problems/mascot/problems-mascot'
// import { AgentWrapperDialog } from '@/components/agent/agent-wrapper-dialog'
import { lazy } from 'react'
// const AgentWrapper = lazy(() => import('@/components/problems/agent/wrapper'))

const MascotProviders = lazy(() => import('@/components/problems/mascot/mascot-providers'))
const ProblemsMascot = lazy(() => import('@/components/problems/mascot/problems-mascot'))

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
      <MascotProviders>
        <ProblemsMascot />
      </MascotProviders>
      {/* <AgentWrapperDialog>
        <AgentWrapper />
      </AgentWrapperDialog> */}

    </div>
  )
}
