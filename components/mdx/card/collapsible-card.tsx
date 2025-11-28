"use client"

import { createContext, use, useState, useId, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ChevronRight } from "lucide-react"

// Context
interface CardState {
  isOpen: boolean
  toggle: () => void
  contentId: string
  reducedMotion: boolean | null
}

const CardContext = createContext<CardState | null>(null)

// Variants
const contentVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { type: "spring", stiffness: 400, damping: 35 },
      opacity: { type: "spring", stiffness: 400, damping: 35 },
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { type: "spring", stiffness: 400, damping: 35 },
      opacity: { type: "spring", stiffness: 400, damping: 35 },
    },
  },
} as const

const chevronVariants = {
  open: { rotate: 90 },
  closed: { rotate: 0 },
} as const

const reducedVariants = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
} as const

// Root
interface RootProps {
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

function Root({ children, defaultOpen = false, className = "" }: RootProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const reducedMotion = useReducedMotion()

  return (
    <CardContext value={{ isOpen, toggle: () => setIsOpen((p) => !p), contentId, reducedMotion }}>
      <div
        className={`rounded-md bg-neutral-50 dark:bg-neutral-900 ${className}`}
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
      </div>
    </CardContext>
  )
}

// Trigger
interface TriggerProps {
  children: ReactNode
  className?: string
}

function Trigger({ children, className = "" }: TriggerProps) {
  const ctx = use(CardContext)
  if (!ctx) throw new Error("Trigger must be inside CollapsibleCard")

  return (
    <button
      type="button"
      onClick={ctx.toggle}
      aria-expanded={ctx.isOpen}
      aria-controls={ctx.contentId}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-50 ${className}`}
    >
      <motion.span
        variants={chevronVariants}
        initial={false}
        animate={ctx.isOpen ? "open" : "closed"}
        transition={ctx.reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 25 }}
        className="text-neutral-400 dark:text-neutral-500"
      >
        <ChevronRight size={14} strokeWidth={2} />
      </motion.span>
      <span className="flex-1">{children}</span>
    </button>
  )
}

// Content
interface ContentProps {
  children: ReactNode
  className?: string
}

function Content({ children, className = "" }: ContentProps) {
  const ctx = use(CardContext)
  if (!ctx) throw new Error("Content must be inside CollapsibleCard")

  return (
    <motion.div
      id={ctx.contentId}
      variants={ctx.reducedMotion ? reducedVariants : contentVariants}
      initial={false}
      animate={ctx.isOpen ? "open" : "closed"}
      className="overflow-hidden"
    >
      <div className={`pb-3 pl-9 pr-3 text-sm text-neutral-600 dark:text-neutral-400 ${className}`}>
        {children}
      </div>
    </motion.div>
  )
}

// Exports
export {
  Root as CollapsibleCard,
  Trigger as CollapsibleCardTrigger,
  Content as CollapsibleCardContent,
}

export type { RootProps as CollapsibleCardProps, TriggerProps, ContentProps }
