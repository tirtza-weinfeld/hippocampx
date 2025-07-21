"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { createContext, useContext, useMemo } from "react"
import { cn } from "@/lib/utils"
import { 
  Check, 
  Circle, 
  Dot, 
  ArrowRight, 
  Star, 
  Sparkles, 
  ListChecks,
  Clock,
  Zap,
  Target,
  Flag,
  Trophy,
  Bookmark
} from "lucide-react"

// Types
interface ListProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'feature' | 'timeline' | 'minimal'
  completed?: string | boolean
}

interface ListItemProps {
  children: ReactNode
  className?: string
  completed?: boolean
}

// Context for list state
const allowedVariants = ["default", "compact", "feature", "timeline", "minimal"] as const;
type ListVariantType = typeof allowedVariants[number];

const ListContext = createContext({ 
  level: 0, 
  type: "unordered" as "ordered" | "unordered",
  variant: "default" as ListVariantType
})

// Modern animation variants with reduced motion support
const getListVariants = (reducedMotion: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: reducedMotion 
      ? { duration: 0.2 }
      : {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
  },
})

const getItemVariants = (reducedMotion: boolean) => ({
  hidden: { opacity: 0, x: reducedMotion ? 0 : -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: reducedMotion
      ? { duration: 0.2 }
      : {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        },
  },
})

// Enhanced icon utilities with more modern gradients
const getUnorderedIcon = (level: number, variant?: string) => {
  if (variant === 'minimal') {
    return { Icon: Dot, gradient: "from-zinc-400 to-stone-500 dark:from-zinc-500 dark:to-zinc-400" }
  }
  
  if (variant === 'feature') {
    const featureIcons = [
      { Icon: Zap, gradient: "from-amber-400 to-orange-500" },
      { Icon: Target, gradient: "from-emerald-400 to-teal-500" },
      { Icon: Flag, gradient: "from-violet-400 to-purple-500" },
      { Icon: Trophy, gradient: "from-rose-400 to-pink-500" },
      { Icon: Bookmark, gradient: "from-blue-400 to-indigo-500" },
    ]
    return featureIcons[level % featureIcons.length]
  }
  
  const modernIcons = [
    { Icon: Circle, gradient: "from-blue-500 to-indigo-600" },
    { Icon: Dot, gradient: "from-emerald-500 to-teal-600" },
    { Icon: ArrowRight, gradient: "from-violet-500 to-purple-600" },
    { Icon: Star, gradient: "from-amber-500 to-orange-600" },
    { Icon: Sparkles, gradient: "from-cyan-500 to-blue-600" },
  ]
  return modernIcons[level % modernIcons.length]
}

const getOrderedStyles = (level: number) => {
  const styles = [
    "list-decimal",
    "list-[lower-alpha]", 
    "list-[lower-roman]",
    "list-[upper-alpha]",
    "list-[upper-roman]"
  ]
  return styles[level % styles.length]
}

// Main List Components
export const UnorderedList = ({ children, className = "", variant = "default", completed, ...props }: ListProps & { [key: string]: any }) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0
  const reducedMotion = Boolean(useReducedMotion())
  
  // Check for variant from plugin data or props
  const dataVariant = props['data-variant'] as string
  // Normalize variant to allowed union
  const effectiveVariant = allowedVariants.includes((dataVariant || variant) as ListVariantType)
    ? (dataVariant || variant) as ListVariantType
    : "default"
  const isCompleted = completed === true || completed === 'true'

  const listVariants = useMemo(() => getListVariants(reducedMotion), [reducedMotion])

  const baseClasses = cn(
    "space-y-2 transition-all duration-200",
    effectiveVariant === 'compact' ? "space-y-1" : "space-y-3",
    effectiveVariant === 'minimal' ? "space-y-1.5" : undefined,
    isNested ? "mt-3 ml-5" : "mb-8",
    isCompleted && "opacity-70"
  )

  return (
    <ListContext.Provider value={{ level: level + 1, type: "unordered", variant: effectiveVariant }}>
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={cn(baseClasses, className)}
        role="list"
      >
        {children}
      </motion.ul>
    </ListContext.Provider>
  )
}

export const OrderedList = ({ children, className = "", variant = "default", completed, ...props }: ListProps & { [key: string]: any }) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0
  const reducedMotion = Boolean(useReducedMotion())
  
  // Check for variant from plugin data or props
  const dataVariant = props['data-variant'] as string
  // Normalize variant to allowed union
  const effectiveVariant = allowedVariants.includes((dataVariant || variant) as ListVariantType)
    ? (dataVariant || variant) as ListVariantType
    : "default"
  const isCompleted = completed === true || completed === 'true'

  const listVariants = useMemo(() => getListVariants(reducedMotion), [reducedMotion])

  const baseClasses = cn(
    "space-y-2 transition-all duration-200",
    effectiveVariant === 'compact' ? "space-y-1 text-sm" : "space-y-3",
    isNested ? "mt-3 ml-6" : "mb-8",
    getOrderedStyles(level),
    isCompleted && "opacity-70"
  )

  return (
    <ListContext.Provider value={{ level: level + 1, type: "ordered", variant: effectiveVariant }}>
      <motion.ol
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={cn(baseClasses, className)}
        role="list"
      >
        {children}
      </motion.ol>
    </ListContext.Provider>
  )
}

export const ListItem = ({ children, className = "", completed }: ListItemProps) => {
  const { level, type, variant } = useContext(ListContext)
  const reducedMotion = Boolean(useReducedMotion())
  
  // Render based on list type and variant
  if (type === "ordered") {
    return <OrderedListItem {...{ children, className, variant, reducedMotion }} />
  }
  
  return <UnorderedListItem {...{ children, className, completed, level, variant, reducedMotion }} />
}

// Specialized Item Components
const OrderedListItem = ({ 
  children, 
  className, 
  variant, 
  reducedMotion 
}: { 
  children: ReactNode
  className?: string
  variant?: string
  reducedMotion?: boolean 
}) => {
  const itemVariants = useMemo(() => getItemVariants(reducedMotion || false), [reducedMotion])
  
  const baseClasses = cn(
    "text-slate-700 dark:text-slate-300",
    "leading-relaxed tracking-wide",
    variant === 'compact' ? "py-0.5 text-sm" : "py-2",
    "relative transition-colors duration-200",
    "hover:text-slate-900 dark:hover:text-slate-100"
  )

  return (
    <motion.li 
      variants={itemVariants} 
      className={cn(baseClasses, className)}
      role="listitem"
    >
      <div className="relative">
        {children}
      </div>
    </motion.li>
  )
}

const UnorderedListItem = ({ 
  children, 
  className, 
  completed, 
  level, 
  variant,
  reducedMotion
}: { 
  children: ReactNode
  className?: string
  completed?: boolean
  level: number
  variant?: string
  reducedMotion?: boolean
}) => {
  const { Icon, gradient } = getUnorderedIcon(level - 1, variant)
  const itemVariants = useMemo(() => getItemVariants(reducedMotion || false), [reducedMotion])

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <motion.li 
        variants={itemVariants} 
        className={cn(
          "flex items-start gap-2 text-slate-600 dark:text-slate-400",
          "hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200",
          completed && "opacity-60 line-through",
          className
        )}
        role="listitem"
      >
        <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-1.5 flex-shrink-0" />
        <span className="flex-1 leading-relaxed">{children}</span>
      </motion.li>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.li 
        variants={itemVariants} 
        className={cn(
          "flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm",
          "hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200",
          completed && "opacity-60 line-through",
          className
        )}
        role="listitem"
      >
        <div className={`w-3 h-3 bg-gradient-to-r ${gradient} rounded-full mt-2 flex-shrink-0 shadow-sm`} />
        <span className="flex-1 leading-relaxed">{children}</span>
      </motion.li>
    )
  }

  // Feature variant
  if (variant === 'feature') {
    return (
      <motion.li 
        variants={itemVariants}
        whileHover={reducedMotion ? {} : { scale: 1.01, y: -1 }}
        className={cn(
          "flex items-start gap-4 p-5 rounded-2xl group",
          "bg-gradient-to-r from-white/90 to-slate-50/60 dark:from-slate-800/90 dark:to-slate-900/60",
          "border border-slate-200/60 dark:border-slate-700/60",
          "shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300",
          "hover:border-slate-300/70 dark:hover:border-slate-600/70",
          completed && "opacity-60",
          className
        )}
        role="listitem"
      >
        <div className="flex-shrink-0">
          <div className={`w-9 h-9 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
        </div>
        <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200">
          {children}
        </div>
      </motion.li>
    )
  }

  // Timeline variant  
  if (variant === 'timeline') {
    return (
      <motion.li variants={itemVariants} className={cn("relative pb-6", className)}>
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center shadow-md z-10`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 absolute top-6" />
          </div>
          <div className="flex-1 pt-0.5 text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </motion.li>
    )
  }

  // Default variant
  return (
    <motion.li 
      variants={itemVariants}
      whileHover={{ x: 2 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        "bg-gradient-to-r from-white/60 to-transparent dark:from-gray-800/40 dark:to-transparent",
        "border-l-2 border-gray-200 dark:border-gray-700",
        "text-gray-700 dark:text-gray-300",
        completed && "opacity-60 line-through",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`w-5 h-5 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center shadow-sm mt-0.5 flex-shrink-0`}
      >
        {completed ? (
          <Check className="w-2.5 h-2.5 text-white" />
        ) : (
          <Icon className="w-2.5 h-2.5 text-white" />
        )}
      </motion.div>
      <div className="flex-1">{children}</div>
    </motion.li>
  )
}

// Specialized List Types
export const TaskList = ({ children, className = "" }: ListProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-3 mb-4 text-gray-700 dark:text-gray-300">
        <ListChecks className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium">Tasks</h4>
      </div>
      <UnorderedList variant="default">{children}</UnorderedList>
    </div>
  )
}

export const FeatureList = ({ children, className = "" }: ListProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <UnorderedList variant="feature">{children}</UnorderedList>
    </div>
  )
}

export const TimelineList = ({ children, className = "" }: ListProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-3 mb-6 text-gray-700 dark:text-gray-300">
        <Clock className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium">Timeline</h4>
      </div>
      <UnorderedList variant="timeline">{children}</UnorderedList>
    </div>
  )
}

export const CompactList = ({ children, className = "" }: ListProps) => {
  return <UnorderedList variant="compact" className={className}>{children}</UnorderedList>
}

export const MinimalList = ({ children, className = "" }: ListProps) => {
  return <UnorderedList variant="minimal" className={className}>{children}</UnorderedList>
}