"use client"

import { AlertCircle, Info, Lightbulb, Notebook, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

const ICONS = {
  important: AlertCircle,
  note: Notebook,
  tip: Lightbulb,
  warning: AlertTriangle,
  caution: Info,
} as const

const LABELS = {
  important: "Important",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  caution: "Caution",
} as const

const STYLES = {
  important: {
    gradient: "from-white to-alert-important/15 dark:from-gray-900 dark:to-alert-important/20",
    border: "border-alert-important",
    text: "text-alert-important",
    iconBg: "bg-alert-important/10",
  },
  note: {
    gradient: "from-white to-alert-note/10 dark:from-gray-900 dark:to-alert-note/20",
    border: "border-alert-note",
    text: "text-alert-note",
    iconBg: "bg-alert-note/10",
  },
  tip: {
    gradient: "from-white to-alert-tip/15 dark:from-gray-900 dark:to-alert-tip/20",
    border: "border-alert-tip",
    text: "text-alert-tip",
    iconBg: "bg-alert-tip/10",
  },
  warning: {
    gradient: "from-white to-alert-warning/15 dark:from-gray-900 dark:to-alert-warning/20",
    border: "border-alert-warning",
    text: "text-alert-warning",
    iconBg: "bg-alert-warning/10",
  },
  caution: {
    gradient: "from-white to-alert-caution/15 dark:from-gray-900 dark:to-alert-caution/20",
    border: "border-alert-caution",
    text: "text-alert-caution",
    iconBg: "bg-alert-caution/10",
  },
} as const

type CardType = keyof typeof ICONS

type CardProps = {
  type: CardType
  children: ReactNode
  title?: string
  className?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    }
  },
} as const

const iconVariants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      delay: 0.1,
    }
  },
} as const

const contentVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: 0.15,
    }
  },
} as const

export default function Card({ children, title, className ,type="note" }: CardProps) {
  const Icon = ICONS[type]
  const styles = STYLES[type]
  const label = LABELS[type]
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={reducedMotion ? undefined : cardVariants}
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      whileHover={reducedMotion ? {} : { scale: 1.01, y: -2 }}
      transition={reducedMotion ? { duration: 0 } : undefined}
      className={cn(
        "relative overflow-hidden",
        "rounded-xl",
        "bg-linear-to-br",
        styles.gradient,
        "border-l-4",
        styles.border,
        "shadow-lg dark:shadow-2xl",
        "backdrop-blur-sm",
        "p-5",
        "my-4",
        "transition-shadow duration-300 ease-out",
        "hover:shadow-xl dark:hover:shadow-3xl",
        className
      )}
      role="region"
      aria-label={`${label} card`}
    >
      <div className="flex items-start gap-4">
        <motion.div
          variants={reducedMotion ? undefined : iconVariants}
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          className={cn(
            "flex-shrink-0 rounded-xl p-2.5",
            styles.iconBg,
            "backdrop-blur-sm"
          )}
        >
          <Icon className={cn("w-5 h-5", styles.text)} aria-hidden="true" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.div
            variants={reducedMotion ? undefined : contentVariants}
            initial={reducedMotion ? false : "hidden"}
            animate="visible"
            className={cn(
              "font-semibold text-sm uppercase tracking-wide mb-2",
              styles.text
            )}
          >
            {title ?? label}
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reducedMotion ? { duration: 0 } : {
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: 0.2,
            }}
            className={cn(
              "text-sm leading-relaxed",
              "text-neutral-700 dark:text-neutral-300",
              "[&_p]:mb-2 [&_p:last-child]:mb-0",
              "[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2",
              "[&_code]:bg-black/5 dark:[&_code]:bg-white/10",
              "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono"
            )}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
