"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ExternalLink, LinkIcon } from "lucide-react"
import Link from "next/link"
import { useProblemState } from './problem-state-context'
import { DifficultyBadge } from '../mdx/difficulty-badge'
import { Leetcode } from './leetcode'
type AgentHeaderProps = {
  title: string
  id: string
  leetcodeUrl: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export function AgentHeader({ title, id, leetcodeUrl, difficulty }: AgentHeaderProps) {
  const { isExpanded, setExpanded } = useProblemState()

  // Extract problem number from id (e.g., "1011-capacity-to-ship..." -> "1011")
  const problemNumber = id.match(/^(\d+)-/)?.[1]

  return (
    <div className="relative px-5 py-1  mr-2">
      <h2 id={id} className={cn("text-lg font-semibold",
    

      )}>
        <Link className={cn(
        "ml-5",
        // "relative",
        "bg-linear-to-r hover:bg-linear-to-l",
        "from-teal-600 via-blue-400 to-sky-400",
        "dark:from-teal-400 dark:via-blue-400 dark:to-sky-400",
        "bg-clip-text text-transparent",
        // " group",
        "underline  decoration-3",
        //  "decoration-transparent",
        "decoration-inherit",
        "decoration-current",
        // "bg-link-gradient",
        // "decoration-red-500",
        // "decoration-none",
      //  "no-underline hover:underline",
      )}
          href={`/problems/${id}`}

        >

          {title}
          <span className={cn(
          "absolute bottom-0 left-0 w-full h-0.5",
          "transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left bg-link-gradient"
        )} />
        </Link>
      </h2>

      {problemNumber && (
        <Leetcode
         className="absolute top-2 -right-2" 
        problemNumber={problemNumber} link={leetcodeUrl}  difficulty={difficulty}
        />
      )}
      <button
        className={cn(
          "absolute top-1 left-1 flex items-center justify-center rounded-lg h-7 w-7 bg-gray-100 dark:bg-gray-800",
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
            "h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    </div>
  )
}
