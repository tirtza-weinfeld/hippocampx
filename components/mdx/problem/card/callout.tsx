// "use client"
// import { cn } from "@/lib/utils"
// import { useState, useEffect, Children, isValidElement, ReactElement, createContext, useContext } from "react"
// import { Activity } from "react"
// import { CalloutContext, useCalloutContext } from "./callout-context"
// import { Book, Braces,  Code,  File, Lightbulb, SquareChartGantt, Timer, Variable } from 'lucide-react'
// import type { CalloutTab } from "./callout-context"
// import { Tooltip } from "./tooltip"
// import { useProblemCardContext } from "./problem-context"
// import { useCardVisibility, useCardOrder } from "./filter-context"



/**
 * Tab button for switching between different file views in problem callouts.
 * Clean, modern design with clear active state indication.
 */
// export function ProblemFileTrigger({ file, className }: { file: string; className?: string }) {
//     const { activeFile, setActiveFile } = useCalloutContext()
//     const isActive = activeFile === file

//     return (
//         <button
//             role="tab"
//             aria-selected={isActive}
//             onClick={() => setActiveFile(file)}
//             className={cn(
//                 'relative inline-flex items-center justify-center whitespace-nowrap',
//                 "rounded-none!",
//                 'px-4 py-2.5',
//                 "rounded-t-lg!",
//                 'text-sm font-medium font-mono',
//                 'transition-colors duration-150',
//                 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
//                 'disabled:pointer-events-none disabled:opacity-50',
//                 'bg-gray-50 dark:bg-gray-900  shadow-sm hover:bg-blue-50 dark:hover:bg-blue-800/20',

//                 isActive ? 'text-blue-600 dark:text-blue-400 border-t-2 border-blue-500' :
//                     'hover:text-gray-900 hover:dark:text-blue-300',

//                 className,

//             )}
//             type="button"
//         >
//             {file}
//         </button>
//     )
// }

/**
 * Container for file tab triggers in problem callouts.
 * Registers files in context so dialog can display them.
 */
// export function ProblemFileList({ children, className }: { children: React.ReactNode; className?: string }) {


//     return (
//         <div
//             role="tablist"
//             className={cn(
//                 'flex items-end gap-1',
//                 'px-3 pt-3 pb-0',
//                 'border-b border-gray-100 dark:border-gray-900',
//                 className
//             )}
//         >
//             {children}
//         </div>
//     )
// }





/**
 * Code snippet container with file-based conditional visibility.
 * Uses Activity to preserve component state when switching files.
 */
// export function ProblemCardCalloutCodeSnippet({ children, file }: {
//     children: React.ReactNode;
//     file: string;
// }) {
//     const { activeFile } = useCalloutContext()

//     return (
//         <Activity mode={activeFile === file ? 'visible' : 'hidden'}>
//             <div className="p-4 bg-white dark:bg-gray-900">
//                 {children}
//             </div>
//         </Activity>
//     )
// }
