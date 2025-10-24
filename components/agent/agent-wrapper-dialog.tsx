"use client"

import { Suspense, useState, useRef } from "react"
import { AgentDialog } from "./agent-dialog"
import { AgentMascotButton } from "./agent-mascot-button"


/**
 * Client wrapper that provides the resizable/draggable dialog
 * with mascot trigger button for the agent component.
 *
 * Preserves state when dialog is closed/reopened.
 * Uses custom dropdowns that render inline (not as portals).
 */
export  default function AgentWrapperDialog({ children }: { children: React.ReactNode }) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const mascotButtonRef = useRef<HTMLButtonElement>(null)

  function toggleDialog() {
    setDialogOpen(!isDialogOpen)
  }

  function closeDialog() {
    setDialogOpen(false)
  }

  return (
    <>
      {/* Mascot trigger button */}
      <AgentMascotButton
        ref={mascotButtonRef}
        onClick={toggleDialog}
        isOpen={isDialogOpen}
      />

      {/* Resizable/Draggable Dialog */}
      <AgentDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        excludeClickOutsideRefs={[mascotButtonRef]}
      >
        <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
          {children}
        </Suspense>
      </AgentDialog>
    </>
  )
}
