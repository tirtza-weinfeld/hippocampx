
"use client"
import { cn } from "@/lib/utils"
import { Activity } from "react"
import { useCalloutContext } from "./callout-context"
import { Braces, Code, Lightbulb, SquareChartGantt, Timer, Variable } from 'lucide-react'
import type { CalloutTab } from "./callout-context"
import { Tooltip } from "./tooltip"


const TAB_CONFIG = {
    codeSnippet: { Icon: Code, label: 'Code', className: 'text-blue-500 bg-blue-500/10' },
    intuition: { Icon: Lightbulb, label: 'Intuition', className: ' text-yellow-500 bg-yellow-500/10' },
    timeComplexity: { Icon: Timer, label: 'Time', className: 'text-purple-500 bg-purple-500/10' },
    keyVariables: { Icon: Variable, label: 'Variables', className: 'text-green-500 bg-green-500/10' },
    keyExpressions: { Icon: Braces, label: 'Expressions', className: 'text-orange-500 bg-orange-500/10' },
    definition: { Icon: SquareChartGantt, label: 'Definition', className: 'text-sky-400 bg-sky-500/10' },

} as const


/**
 * Floating action button for toggling callout tabs with icon representation.
 * Clean button design with clear visual feedback.
 */
export function FabButton({ className, files, tab }: {
    className?: string;
    files?: Set<string>;
    tab: CalloutTab;
}) {
    const { activeFile, setActiveTab, activeTab, displayDialog, setDisplayDialog } = useCalloutContext()

    const isVisible = !files || files.has(activeFile)
    const isActive = tab === activeTab && displayDialog

    const config = TAB_CONFIG[tab]
    if (!config) return null

    const { Icon, label } = config

    function handleClick() {

        if (!displayDialog) {
            setDisplayDialog(true)
        } 
        if (activeTab !== tab) {
            setActiveTab(tab)
        }
    }
    // function handleClick() {
    //     // Always open dialog first, then toggle tab
    //     if (!displayDialog) {
    //         setDisplayDialog(true)
    //         setActiveTab(tab)
    //     } else if (tab === activeTab) {
    //         setDisplayDialog(false)
    //     } else {
    //         setActiveTab(tab)
    //     }
    // }

    return (
        // <Activity mode={isVisible ? 'visible' : 'hidden'}>
        <Tooltip content={label}>
            <button
                onClick={handleClick}
                aria-pressed={isActive}
                aria-label={`${label} tab`}
                className={cn(
                    'flex items-center gap-1 px-1 py-1 rounded-full',
                    'text-sm font-medium transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    isActive
                        ? 'shadow-sm ring-1 ring-current'
                        : 'hover:bg-white/60 dark:hover:bg-gray-700/60',
                    config.className,
                    className,
                    !isVisible && 'opacity-20'
                )}
            >
                <Icon className="@md:w-4 @md:h-4 w-3 h-3" />
                {/* {isActive && <span className="text-xs font-semibold">{label}</span>} */}
            </button>
        </Tooltip>
        // </Activity>
    )
}