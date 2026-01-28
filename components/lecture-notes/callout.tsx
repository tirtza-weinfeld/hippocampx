"use client"

import { useState, startTransition, ViewTransition, type ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { BookOpen, FlaskConical, Code2, ListChecks, ChevronDown } from "lucide-react"

const CONFIG = {
  theorem: { icon: BookOpen, bg: "bg-callout-theorem", accent: "callout-theorem" },
  example: { icon: FlaskConical, bg: "bg-callout-example", accent: "callout-example" },
  algorithm: { icon: Code2, bg: "bg-callout-algorithm", accent: "callout-algorithm" },
  summary: { icon: ListChecks, bg: "bg-callout-summary", accent: "callout-summary" },
} as const

type CalloutType = keyof typeof CONFIG

const contentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
}

export function Callout({
  type,
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  type: CalloutType
  title?: string
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const reducedMotion = useReducedMotion()
  const { icon: Icon, bg, accent } = CONFIG[type]

  const toggle = () => {
    if (!collapsible) return
    startTransition(() => setIsOpen(o => !o))
  }

  return (
    <aside className={`my-6 overflow-hidden rounded-lg border ${accent} ${bg} starting:opacity-0 starting:translate-y-2 transition duration-200`}>
      <button
        type="button"
        onClick={toggle}
        disabled={!collapsible}
        aria-expanded={collapsible ? isOpen : undefined}
        className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-default not-disabled:cursor-pointer not-disabled:hover:bg-black/2 dark:not-disabled:hover:bg-white/2"
      >
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-md bg-current/15 ${accent}`}>
          <Icon className="size-4" />
        </span>

        <span className="flex flex-1 flex-col gap-0.5">
          <span className={`text-xs font-medium uppercase tracking-wide ${accent}`}>{type}</span>
          {title && <span className="text-sm font-semibold text-foreground">{title}</span>}
        </span>

        {collapsible && (
          <ViewTransition>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="text-muted-foreground"
            >
              <ChevronDown className="size-4" />
            </motion.span>
          </ViewTransition>
        )}
      </button>

      <AnimatePresence initial={false} mode="popLayout">
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{
              height: { duration: reducedMotion ? 0 : 0.2, ease: "easeOut" },
              opacity: { duration: reducedMotion ? 0 : 0.15 },
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground *:first:mt-0 *:last:mb-0 **:strong:font-semibold **:strong:text-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
