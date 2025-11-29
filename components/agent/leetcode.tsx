"use client"

import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

type LeetcodeProps = {
  problemNumber: string
  link: string,
  difficulty: 'easy' | 'medium' | 'hard'
  className?: string,

}

export function Leetcode({ problemNumber, link, difficulty, className }: LeetcodeProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group",
        // "shadow-lg",
        // "bg-linear-to-r hover:bg-linear-to-l bg-clip-text text-transparent",
        "w-fit flex items-center gap-1.5 px-2.5 py-1 ",
        // difficulty === 'easy' && 'from-green-400/80 to-emerald-500/80   shadow-green-500/25',
        // difficulty === 'medium' && 'from-yellow-400/60 to-orange-500/60   shadow-orange-500/25',
        // difficulty === 'hard' && 'from-red-400/80 via-red-500/80 to-pink-500/80   shadow-red-500/25',


        // "shadow-shadow-2xl",
        "border-b ",
        "rounded-full",
        difficulty === "easy" && "text-green-500 shadow-green-500/25  border-green-500/25",
        difficulty === "medium" && "text-orange-400 shadow-orange-500/25 border-orange-500/25",
        difficulty === "hard" && "text-red-500 shadow-red-500/25 border-red-500/25  ",
        "hover:-translate-y-1 transition-transform duration-300",
        className
      )}
    >




      <span className={cn(

        "text-xs ",
        // "group-hover:-translate-y-1 transition-transform duration-300"
      )}>.{problemNumber}</span>
      <span className={cn(
        "inline-block",
        "hidden group-hover:inline-block",
      )}>
        <ArrowUpRight className="w-4 h-4" />
      </span>

    </a>
  )
}
