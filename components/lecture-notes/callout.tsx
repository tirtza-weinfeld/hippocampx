"use client"

import { useState, startTransition, ViewTransition, type ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { BookOpen, FlaskConical, Code2, ListChecks, ChevronDown } from "lucide-react"

const ICONS = {
  theorem: BookOpen,
  example: FlaskConical,
  algorithm: Code2,
  summary: ListChecks,
}

type CalloutType = keyof typeof ICONS

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
  const Icon = ICONS[type]

  const toggle = () => {
    if (!collapsible) return
    startTransition(() => setIsOpen(o => !o))
  }

  return (
    <aside data-callout={type} className="my-6 overflow-hidden rounded-xl backdrop-blur-sm starting:opacity-0 starting:translate-y-2 transition duration-300 data-[callout=theorem]:bg-gradient-callout-theorem data-[callout=example]:bg-gradient-callout-example data-[callout=algorithm]:bg-gradient-callout-algorithm data-[callout=summary]:bg-gradient-callout-summary"
    
    >
      <button
        type="button"
        onClick={toggle}
        disabled={!collapsible}
        aria-expanded={collapsible ? isOpen : undefined}
        className="flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-default not-disabled:cursor-pointer not-disabled:hover:bg-black/2 dark:not-disabled:hover:bg-white/2"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl shadow-lg in-data-[callout=theorem]:bg-gradient-callout-theorem-icon in-data-[callout=theorem]:shadow-callout-theorem/30 in-data-[callout=example]:bg-gradient-callout-example-icon in-data-[callout=example]:shadow-callout-example/30 in-data-[callout=algorithm]:bg-gradient-callout-algorithm-icon in-data-[callout=algorithm]:shadow-callout-algorithm/30 in-data-[callout=summary]:bg-gradient-callout-summary-icon in-data-[callout=summary]:shadow-callout-summary/30">
          <Icon className="size-4 text-white drop-shadow-md" />
        </span>

        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-wide in-data-[callout=theorem]:text-gradient-callout-theorem-accent in-data-[callout=example]:text-gradient-callout-example-accent in-data-[callout=algorithm]:text-gradient-callout-algorithm-accent in-data-[callout=summary]:text-gradient-callout-summary-accent">{type}</span>
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
