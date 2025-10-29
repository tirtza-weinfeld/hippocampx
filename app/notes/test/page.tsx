// import { AgentWrapperDialog } from '@/components/agent/agent-wrapper-dialog'

// import { ProblemsMascot } from "@/components/problems/mascot/problems-mascot";
// import { MascotProviders } from "@/components/problems/mascot/mascot-providers";
import { lazy, Suspense } from 'react'
const AgentWrapperDialog = lazy(() => import('@/components/agent/agent-wrapper-dialog'))
import AgentWrapper from '@/components/problems/agent/wrapper'
// import { SlowComponent } from '@/components/problems/agent/wrapper'
// const SlowComponent = lazy(() => import('@/components/problems/agent/wrapper'))
// const AgentWrapper = lazy(() => import('@/components/problems/agent/wrapper'))

export default function TestPage() {
  return (
    <div>
      
      {/* <AgentWrapperDialog>
        <AgentWrapper />
        </AgentWrapperDialog> */}

      {/* <MascotProviders>
        <ProblemsMascot />
      </MascotProviders> */}
    </div>
  )
}