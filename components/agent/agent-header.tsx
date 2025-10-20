"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useProblemState } from './problem-state-context'

type AgentHeaderProps = {
  title: string
  id: string
}

export function AgentHeader({ title, id }: AgentHeaderProps) {
  const { isExpanded, setExpanded } = useProblemState()

  return (
    <div className="relative px-5 py-4 ">
      <h2 id={id} className="text-lg font-semibold">
        <a className="bg-linear-to-r hover:bg-linear-to-l 
      from-teal-600 via-blue-400 to-sky-400
      dark:from-teal-400 dark:via-blue-400 dark:to-sky-400
       bg-clip-text text-transparent"
        href={`#${id}`}>

          {title}
        </a>
      </h2>


      <button
        className={cn(
          "absolute top-3 right-3 p-2 rounded-lg h-9 w-9 bg-gray-100 dark:bg-gray-800",
          "hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        )}
        onClick={() => setExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse problem" : "Expand problem"}
        type="button"
      >
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    </div>
  )
}
