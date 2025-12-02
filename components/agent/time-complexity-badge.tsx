"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"

type TimeComplexityBadgeProps = {
    children: ReactNode
}

/**
 * Client wrapper for time complexity badge - handles animation only.
 * Content (with KaTeX math) is rendered by server component and passed as children.
 */
export function TimeComplexityBadge({ children }: TimeComplexityBadgeProps) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.15,
                ease: "easeOut"
            }}
            className={cn(
                "bg-linear-to-r from-amber-50 to-sky-100 dark:from-black dark:to-gray-900",
                "w-fit",
                "rounded-full flex items-center gap-1",
                "shadow-sm shadow-sky-500/30 dark:shadow-sky-500/80",
                "px-2 py-0.5",
            )}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
        >
            <span className={cn(
                "bg-linear-to-r from-amber-500 to-orange-600 dark:from-amber-500 dark:to-orange-600",
                "bg-clip-text text-transparent",
                "text-xs font-mono",
                "[&_.katex]:text-amber-600 [&_.katex]:dark:text-amber-400",
            )}>
                {children}
            </span>
        </motion.span>
    )
}
