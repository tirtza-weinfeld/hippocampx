"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Modern tooltip component with smooth animations.
 * Shows on hover with a subtle fade-in effect below the element.
 */
export function Tooltip({ children, content }: {
    children: React.ReactNode;
    content: string;
}) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        'absolute top-full left-1/2 -translate-x-1/2 mt-2',
                        'px-2 py-1 rounded-md',
                        'bg-linear-to-r from-sky-500/10 via-blue-500/10 to-emerald-400/10',
                        'dark:from-sky-500/10 dark:via-blue-500/10 dark:to-emerald-400/10',

                        'text-xs font-medium whitespace-nowrap',
                        'pointer-events-none',
                        'animate-in fade-in slide-in-from-top-1 duration-200',
                        'shadow-lg z-50'
                    )}
                >
                    <span className="animate-pulse bg-linear-to-r from-sky-500 via-blue-500 to-emerald-400 dark:from-sky-500 dark:via-blue-500 dark:to-emerald-500 bg-clip-text text-transparent hover:text-transparent">
                        {content}</span>
                    {/* Arrow */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-px">
                        <div className="border-4 border-transparent border-b-sky-500/20 dark:border-b-sky-500/20" />
                    </div>
                </div>
            )}
        </div>
    )
}
