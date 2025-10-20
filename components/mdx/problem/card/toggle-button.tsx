"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useProblemCardContext } from "./problem-context"

/**
 * Client-side toggle button for expanding/collapsing individual problem cards.
 * Responds to both individual toggles and global expand/collapse all actions.
 */
export function ProblemCardToggleButton({ id }: { id: string }) {
    const { toggleProblem, isExpanded } = useProblemCardContext()
    const expanded = isExpanded(id)

    function handleToggle(): void {
        toggleProblem(id)
    }

    return (
        <button
            className={cn(
                "absolute top-1 right-2 p-2 rounded-lg h-7 bg-gray-300/10",
                "hover:bg-gray-300/20 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            )}
            onClick={handleToggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse problem" : "Expand problem"}
            type="button"
        >
            <ChevronDown
                className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200",
                    expanded && "rotate-180"
                )}
            />
        </button>
    )
}
