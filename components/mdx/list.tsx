"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Minus, Star, Sparkles, Check, ListChecks, Award, ArrowRight, Shapes, Triangle } from "lucide-react" 
import { useState, createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface ListProps {
  children: ReactNode
  className?: string
}

interface ListItemProps {
  children: ReactNode
  className?: string
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
}

const getUnorderedIcon = (level: number) => {
  const icons = [
    { Icon: Shapes, gradient: "from-sky-500 to-cyan-500" },
    { Icon: Minus, gradient: "from-teal-500 to-emerald-500" },
    { Icon: ArrowRight, gradient: "from-blue-500 to-indigo-500" },
    { Icon: Triangle, gradient: "from-teal-500 to-emerald-500" },
    { Icon: Star, gradient: "from-cyan-500 to-blue-500" },
    { Icon: Sparkles, gradient: "from-emerald-500 to-teal-500" },
  ]
  return icons[level % icons.length]
}

const ListContext = createContext({ level: 0, type: "unordered" as "ordered" | "unordered" })

export const UnorderedList = ({ children, className = "" }: ListProps) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0

  return (
    <ListContext.Provider value={{ level: level + 1, type: "unordered" }}>
      <motion.ul
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={`
          ${isNested ? "mt-3 mb-3 ml-4" : "mb-8 ml-0"} 
          space-y-3
          ${className}
        `}
      >
        {children}
      </motion.ul>
    </ListContext.Provider>
  )
}

export const OrderedList = ({ children, className = "" }: ListProps) => {
  const parentContext = useContext(ListContext)
  const level = parentContext.level
  const isNested = level > 0

  const getListStyle = (level: number) => {
    const styles = [
      "list-decimal",
      "list-[lower-alpha]",
      "list-[lower-roman]",
      "list-[upper-alpha]",
      "list-[upper-roman]",
    ]
    return styles[level % styles.length]
  }

  return (
    <ListContext.Provider value={{ level: level + 1, type: "ordered" }}>
      <motion.ol
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          // isNested ? "mt-3 mb-3 ml-4" : "mb-8 ml-0",
          isNested ? " ml-4" : " ml-0",
          "my-2",
          "space-y-3",
          getListStyle(level),
          // "list-decimal",
          "list-none",
       
          
          className
        )}
      >
        {children}
      </motion.ol>
    </ListContext.Provider>
  )
}

export const ListItem = ({ children, className = "" }: ListItemProps) => {
  const { level, type } = useContext(ListContext)
  
  // Check if this looks like a header item (short text ending with colon)
  const isHeaderItem = (() => {
    if (typeof children === 'string') {
      return children.trim().endsWith(':') && children.trim().length < 100
    }
    // Check if children contains only text that ends with colon
    if (Array.isArray(children) && children.length === 1) {
      const child = children[0]
      if (typeof child === 'string') {
        return child.trim().endsWith(':') && child.trim().length < 100
      }
      // Check for bold text that ends with colon
      if (child && typeof child === 'object' && 'props' in child && child.props?.children) {
        const text = child.props.children
        if (typeof text === 'string') {
          return text.trim().endsWith(':') && text.trim().length < 100
        }
      }
    }
    return false
  })()

  if (type === "ordered") {
    return (
      <motion.li
        variants={itemVariants}
        whileHover={{ x: 4 }} // Subtle hover for ordered list items
        className={cn(
          "text-gray-700 dark:text-gray-300",
          "leading-relaxed",
          "py-2",
          "rounded-lg",
          "relative",
          "pl-8", 
          className,
          "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5",
          "before:bg-gradient-to-b before:from-sky-400 before:to-teal-400 before:rounded-r-md",
          "bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent",
          "transition-all duration-200",
        )}
      >
        <div className="flex items-start ">
          <div className="flex-1">{children}</div>
        </div>
      </motion.li>
    )
  }

  const { Icon, gradient } = getUnorderedIcon(level - 1)

  // If this looks like a header item, style it as a section header
  if (isHeaderItem) {
    return (
      <motion.li
        variants={itemVariants}
        className={`
          text-gray-700 dark:text-gray-300 
          leading-relaxed
          mb-2
          ${className}
        `}
      >
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`
              w-5 h-5
              bg-gradient-to-r ${gradient}
              rounded-full
              flex items-center justify-center
              shadow-md
              mt-0.5
              flex-shrink-0
            `}
          >
            <Icon className="w-2.5 h-2.5 text-white" fill="currentColor" />
          </motion.div>
          <div className="flex-1 font-medium">{children}</div>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 2 }} // Subtle hover for list items
      className={`
        flex items-start gap-4 
        text-gray-700 dark:text-gray-300 
        leading-relaxed
        p-3
        rounded-xl
        bg-gradient-to-r from-white/80 via-sky-50/50 to-white/80 dark:from-gray-800/50 dark:via-gray-900/30 dark:to-gray-800/50
        border border-gray-200/50 dark:border-gray-700/50
        shadow-sm
        backdrop-blur-sm
        ${className}
      `}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`
          w-6 h-6
          bg-gradient-to-r ${gradient}
          rounded-full
          flex items-center justify-center
          shadow-lg
          mt-0.5
          flex-shrink-0
        `}
      >
        <Icon className="w-3 h-3 text-white" fill="currentColor" />
      </motion.div>

      <div className="flex-1 min-w-0">{children}</div>
    </motion.li>
  )
}


// Enhanced Task List
export const TaskList = ({ children, className = "" }: ListProps) => {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="visible" className={`space-y-4 mb-8 ${className}`}>
      <div className="flex items-center gap-3 mb-4 text-gray-700 dark:text-gray-300">
        <ListChecks className="w-6 h-6 text-sky-500" />
        <h4 className="font-semibold text-lg">Your Tasks</h4>
      </div>
      {children}
    </motion.ul>
  )
}

interface TaskItemProps {
  children: ReactNode
  completed?: boolean
  className?: string
}

export const TaskItem = ({ children, completed = false, className = "" }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(completed)

  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className={`
        flex items-start gap-4 
        p-4
        rounded-xl
        border border-gray-200 dark:border-gray-700
        bg-gradient-to-r from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900
        shadow-lg
        backdrop-blur-sm
        transition-all duration-300
        ${className}
      `}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCompleted(!isCompleted)}
        className={`
          w-6 h-6 
          rounded-full 
          border-2 
          flex items-center justify-center
          mt-0.5
          transition-all duration-300
          shadow-md
          flex-shrink-0
          ${
            isCompleted
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-500 text-white shadow-teal-200 dark:shadow-teal-900/50"
              : "border-gray-300 dark:border-gray-600 hover:border-teal-400 bg-white dark:bg-gray-700"
          }
        `}
        aria-checked={isCompleted}
        role="checkbox"
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-3 h-3" />
          </motion.div>
        )}
      </motion.button>

      <div
        className={`
        flex-1 
        transition-all duration-300
        ${isCompleted ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"}
      `}
      >
        {children}
      </div>
    </motion.li>
  )
}

// Enhanced Feature List
export const FeatureList = ({ children, className = "" }: ListProps) => {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="visible" className={`space-y-6 mb-8 ${className}`}>
      {children}
    </motion.ul>
  )
}

interface FeatureItemProps {
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export const FeatureItem = ({ children, icon, className = "" }: FeatureItemProps) => {
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        flex items-start gap-5 
        p-6
        rounded-2xl
        border border-gray-200/50 dark:border-gray-700/50
        bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900
        shadow-xl
        backdrop-blur-sm
        relative
        overflow-hidden
        ${className}
      `}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/5 via-teal-500/5 to-blue-500/5 rounded-full blur-2xl" />

      <div className="flex-shrink-0 relative z-10">
        {icon || (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-teal-500 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
            <Award className="w-6 h-6 text-white" /> {/* Changed default icon to Award */}
          </div>
        )}
      </div>

      <div className="flex-1 relative z-10 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{children}</div>
    </motion.li>
  )
}



