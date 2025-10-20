"use client"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { Activity } from "react"
import { useCalloutContext } from "./callout-context"

/**
 * Fab group component for problem card callouts with FAB buttons.
 * Hides when dialog is open and registers itself in context for dialog to use.
 */
export function FabGroup({ children }: { children: React.ReactNode }) {
    const { displayDialog, setFabButtons } = useCalloutContext()

    // Register FAB buttons in context
    useEffect(() => {
        setFabButtons(children)
    }, [children, setFabButtons])

    return (
        <Activity mode={displayDialog ? 'hidden' : 'visible'}>
            <div
                data-fab-group
                className="absolute top-0 right-7 flex items-center gap-2 px-4 py-2"
            >
                {children}
            </div>
        </Activity>
    )
}
