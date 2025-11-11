
import AgentWrapperDialog from '@/components/agent/agent-wrapper-dialog';
// import AgentWrapper from '@/components/problems/agent/wrapper';
import AgentDbWrapper from '@/components/problems/agent-db/wrapper';
export default function AllPage() {
  return (
    <div>
      <AgentWrapperDialog>
        <AgentDbWrapper />
        </AgentWrapperDialog>
    </div>
  )
}