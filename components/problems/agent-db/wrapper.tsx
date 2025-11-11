import {  Suspense } from "react";

import AgentComponent from "./Agent";
export default function AgentDbWrapper() {
  return (<Suspense fallback={<div>Loading...</div>}> <AgentComponent /> </Suspense>)
}
