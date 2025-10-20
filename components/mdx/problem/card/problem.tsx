

"use client"
import { useState, createContext, useContext } from "react"
import { Activity } from "react"
import { CalloutContext } from "./callout-context"
import type { CalloutTab } from "./callout-context"
import { useCardVisibility, useCardOrder } from "./filter-context"

/**
 * Context for passing problem card ID to child components.
 */
const ProblemCardIdContext = createContext<string>("")

/**
 * Hook to get the current problem card ID from context.
 */
export function useProblemCardId(): string {
  return useContext(ProblemCardIdContext)
}
export type ProblemCardProps = {
    children: React.ReactNode;
    defaultFile?: string;
    solutionFiles?: string[];
    tab?: CalloutTab;
    id: string;
    difficulty?: string;
    topics?: string;
    title?: string;
}
/**
 * Root component for problem card callout system with context provider.
 * Registers with global context for expansion state management.
 * Accepts data attributes for instant filtering.
 */
export function ProblemCard({ children, defaultFile = "solution.py", solutionFiles = ["solution.py"], tab = "definition", id, difficulty, topics, title }: ProblemCardProps) {
    const [activeFile, setActiveFile] = useState(defaultFile)
    const [activeTab, setActiveTab] = useState<CalloutTab>(tab)
    const [displayDialog, setDisplayDialog] = useState(false)
    const [files, setFiles] = useState<string[]>(solutionFiles)
    const [fabButtons, setFabButtons] = useState<React.ReactNode>(null)

    // Activity mode based on filters - zero re-renders!
    const visibilityMode = useCardVisibility(id, difficulty || "", topics || "", title || "")
    const sortOrder = useCardOrder(id)

    return (
        <ProblemCardIdContext value={id}>
            <CalloutContext value={{ activeFile, setActiveFile, activeTab, setActiveTab, displayDialog, setDisplayDialog, files, setFiles, fabButtons, setFabButtons }}>
                <Activity mode={visibilityMode}>
                    <div
                        suppressHydrationWarning
                        className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-md relative mb-4"
                        style={{ order: sortOrder }}
                        data-card-id={id}
                        data-card-difficulty={difficulty}
                        data-card-topics={topics}
                        data-card-title={title}
                    >
                            {children}
                    </div>
                </Activity>
            </CalloutContext>
        </ProblemCardIdContext>
    )
}

