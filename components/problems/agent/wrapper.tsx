import { lazy, Suspense } from "react";

const AgentComponent = lazy(() => import("@/components/problems/agent/Agent"));
export default function AgentWrapper() {
  return (<Suspense fallback={<div>Loading...</div>}> <AgentComponent /> </Suspense>)
}
