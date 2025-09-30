"use client"

import { motion, AnimatePresence } from "motion/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { listItemVariants, getIconConfig } from "./list-item"

export interface CollapsibleListItemProps {
  children: ReactNode
  title: ReactNode
  className?: string
  level: number
  displayNumber?: string
  headerItem?: boolean
  marker?: string
  defaultOpen?: boolean
}

const contentVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
      },
      opacity: {
        duration: 0.2,
        delay: 0.1,
      },
    },
  },
} as const

export default function CollapsibleListItem({
  children,
  title,
  className = "",
  level,
  displayNumber,
  headerItem,
  marker,
  defaultOpen = false,
  ...props
}: CollapsibleListItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const showNumber = displayNumber !== undefined
  const { Icon, levelcolor } = getIconConfig(level)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <motion.li
        variants={listItemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "data-list-item=collapsible",
          "flex flex-col",
          "text-gray-700 dark:text-gray-300",
          "leading-relaxed",
          marker === "+" && "ml-6",
          "p-2",
          "rounded-xl",
          "border border-gray-200/40 dark:border-gray-700/40",
          "shadow-sm backdrop-blur-sm",
          "transition-all duration-300",
          "hover:shadow-md hover:border-sky-300/50 dark:hover:border-sky-600/50",
          `hover:bg-linear-to-r hover:from-white/90 hover:via-${levelcolor}-50/50`,
          ` hover:to-white/90 dark:hover:from-gray-800/60 dark:hover:via-gray-900/30 dark:hover:to-gray-800/60`,
          className
        )}
        {...props}
      >
        <CollapsibleTrigger className="flex items-start gap-3 w-full text-left">
          {marker !== "+" && (
            <motion.div
              whileHover={{ scale: 1.15, rotate: showNumber ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "flex items-center justify-center flex-shrink-0 mt-0.5",
                "w-6 h-6 rounded-full",
                "shadow-lg",
                `shadow-${levelcolor}`
              )}
            >
              {showNumber ? (
                <span className={cn("text-xs font-bold", `text-${levelcolor}`)}>
                  {displayNumber}
                </span>
              ) : (
                <Icon className={cn("w-3 h-3", `text-${levelcolor}`)} />
              )}
            </motion.div>
          )}

          <div className="min-w-0 flex-1">
            <div className={cn("text-sm", !isOpen && "truncate")}>{title}</div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-0.5"
          >
            <ChevronDown
              className={cn("w-5 h-5", `text-${levelcolor}`)}
              aria-hidden="true"
            />
          </motion.div>
        </CollapsibleTrigger>

        <CollapsibleContent forceMount asChild>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="content"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="overflow-hidden"
              >
                <div className="pt-3 pl-9">{children}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </motion.li>
    </Collapsible>
  )
}
