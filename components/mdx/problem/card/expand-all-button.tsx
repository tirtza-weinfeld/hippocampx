// "use client"

// import { cn } from "@/lib/utils"
// import { ChevronsDown, ChevronsUp } from "lucide-react"
// import { useProblemCardContext } from "./problem-context"

// /**
//  * Button component for expanding or collapsing all problem cards.
//  *
//  * Automatically determines whether to show "Expand All" or "Collapse All"
//  * based on the current expansion state of all problems.
//  */
// export function ProblemCardExpandAllButton({ className }: {
//     className?: string
// }) {
//     const { expandAll, collapseAll, expandedProblems, allProblemIds } = useProblemCardContext()

//     const allExpanded = expandedProblems.size === allProblemIds.size && allProblemIds.size > 0
//     const Icon = allExpanded ? ChevronsUp : ChevronsDown
//     const label = allExpanded ? "Collapse All" : "Expand All"

//     function handleClick(): void {
//         if (allExpanded) {
//             collapseAll()
//         } else {
//             expandAll()
//         }
//     }

//     // Don't show button if there are no problems
//     if (allProblemIds.size === 0) {
//         return null
//     }

//     return (
//         <button
//             onClick={handleClick}
//             className={cn(
//                 "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
//                 "text-sm font-medium",
//                 "bg-blue-50 dark:bg-blue-900/20",
//                 "text-blue-700 dark:text-blue-300",
//                 "border border-blue-200 dark:border-blue-800",
//                 "hover:bg-blue-100 dark:hover:bg-blue-900/30",
//                 "transition-colors duration-150",
//                 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
//                 className
//             )}
//             type="button"
//             aria-label={label}
//         >
//             <Icon className="w-4 h-4" />
//             <span>{label}</span>
//         </button>
//     )
// }
