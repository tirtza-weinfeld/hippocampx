"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useCollapsibleContext } from "./collapsible-section"

export interface CollapsibleSectionHeaderProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
  level?: string
  className?: string
}

export function CollapsibleSectionHeader({
  children,
  as: Component = 'h2',
  id,
  level,
  className
}: CollapsibleSectionHeaderProps) {
  const { isOpen, setIsOpen } = useCollapsibleContext()
  const shouldReduceMotion = useReducedMotion()

  const headerLevel = level ? parseInt(level, 10) : 2

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-expanded={isOpen}
      aria-controls={id ? `${id}-content` : undefined}
      className={cn(
        "w-full",
        "flex items-center justify-between gap-4",
        "px-6 py-5",
        "text-left",
        "cursor-pointer",
        "transition-all duration-300",
        "rounded-t-xl",
        isOpen && "rounded-b-none",
        !isOpen && "rounded-xl",
        "hover:bg-linear-to-r hover:from-teal-50/50 hover:via-sky-50/30 hover:to-teal-50/50",
        "dark:hover:from-teal-950/30 dark:hover:via-sky-950/20 dark:dark:hover:to-teal-950/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
        className
      )}
      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <Component
        id={id}
        className={cn(
          "flex-1 m-0",
          "font-extrabold tracking-tight",
          "bg-linear-to-r from-teal-600 via-sky-600 to-teal-600 bg-clip-text text-transparent",
          "dark:from-teal-400 dark:via-sky-400 dark:to-teal-400",
          headerLevel === 1 && "text-3xl md:text-4xl",
          headerLevel === 2 && "text-2xl md:text-3xl",
          headerLevel === 3 && "text-xl md:text-2xl",
          headerLevel === 4 && "text-lg md:text-xl",
          headerLevel === 5 && "text-base md:text-lg",
          headerLevel === 6 && "text-sm md:text-base"
        )}
      >
        {children}
      </Component>

      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.3,
          ease: "easeInOut"
        }}
        className="flex-shrink-0"
      >
        <ChevronDown
          className={cn(
            "w-6 h-6",
            "text-teal-600 dark:text-teal-400",
            "transition-colors duration-300"
          )}
          aria-hidden="true"
        />
      </motion.div>
    </motion.button>
  )
}
