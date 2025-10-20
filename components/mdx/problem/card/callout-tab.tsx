"use client"
import type { CalloutTab } from "./callout-context"
import { useCalloutContext } from "./callout-context"
import { cn } from "@/lib/utils"
import { Activity } from "react"

/**
 * Tab content panel for problem card callouts with conditional visibility.
 * Uses Activity to preserve state when switching tabs.
 */
export function ProblemCardTab({ children, tab, file }: {
    children: React.ReactNode;
    tab: CalloutTab;
    file?: string;
}) {
    const { activeFile, activeTab } = useCalloutContext()
    const isVisible = tab === activeTab && (!file || file === activeFile)

    return (
        <Activity mode={isVisible ? 'visible' : 'hidden'}>
            <div className={cn(
                'px-5 py-4 text-sm leading-relaxed',
                'text-gray-700 dark:text-gray-300',
                tab === "definition" && "[&_p]:italic [&_p]:text-blue-700 dark:[&_p]:text-blue-400"
            )}>
                {children}
            </div>
        </Activity>
    )
}
