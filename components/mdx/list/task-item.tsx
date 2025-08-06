"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { ListContext } from './list-context'

interface TaskItemProps {
  children: ReactNode
  className?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  onClick?: () => void
}

// Animation variants for task items
const taskItemVariants = {
  hidden: { opacity: 0, x: -15, scale: 0.95 },
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

export const TaskItem = ({ 
  children, 
  className = "", 
  checked = false, 
  disabled = false,
  onChange,
  ...props 
}: TaskItemProps) => {
  const { type: listType } = useContext(ListContext)
  const isInOrderedList = listType === 'ordered'
  
  // Local state for checkbox if no onChange provided
  const [localChecked, setLocalChecked] = useState(checked)
  const isChecked = onChange ? checked : localChecked

  const handleToggle = () => {
    if (disabled) return
    
    const newChecked = !isChecked
    if (onChange) {
      onChange(newChecked)
    } else {
      setLocalChecked(newChecked)
    }
  }

  return (
    <motion.li
      variants={taskItemVariants}
      whileHover={{ x: 3, scale: 1.01 }}
      data-item-type="task"
      data-checked={isChecked}
      className={cn(
        "task-item",
        "flex items-start gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        "py-3 px-4",
        "rounded-xl",
        "relative",
        // Base background - different for completed vs incomplete
        isChecked 
          ? "bg-gradient-to-r from-green-50/70 via-emerald-50/40 to-green-50/70 dark:from-green-900/15 dark:via-emerald-900/10 dark:to-green-900/15"
          : "bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-blue-50/70 dark:from-blue-900/15 dark:via-sky-900/10 dark:to-blue-900/15",
        // Border - different for completed vs incomplete
        isChecked
          ? "border border-green-200/50 dark:border-green-700/40"
          : "border border-blue-200/50 dark:border-blue-700/40",
        // Shadow
        "shadow-md backdrop-blur-sm",
        "transition-all duration-300",
        // Hover effects
        isChecked
          ? "hover:shadow-lg hover:border-green-300/60 dark:hover:border-green-600/50"
          : "hover:shadow-lg hover:border-blue-300/60 dark:hover:border-blue-600/50",
        // Completed task styling
        isChecked && "opacity-75",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Checkbox - adapts based on list type */}
      <motion.label
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        className={cn(
          "flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer",
          disabled && "cursor-not-allowed",
          isInOrderedList ? "w-7 h-7" : "w-6 h-6" // Slightly larger for ordered lists
        )}
      >
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
          className="sr-only" // Hide default checkbox, use custom styling
          aria-label={typeof children === 'string' ? children : 'Task item'}
        />
        
        {/* Custom checkbox design */}
        <motion.div
          animate={{
            backgroundColor: isChecked 
              ? 'rgb(34 197 94)' // green-500
              : 'rgb(255 255 255)', // white
            borderColor: isChecked 
              ? 'rgb(34 197 94)' // green-500
              : 'rgb(156 163 175)', // gray-400
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex items-center justify-center border-2 shadow-sm",
            isInOrderedList 
              ? "w-7 h-7 rounded-lg" // Rounded square for ordered lists
              : "w-6 h-6 rounded-md", // Smaller rounded square for unordered lists
            disabled && "opacity-50"
          )}
        >
          {/* Checkmark */}
          <motion.div
            initial={false}
            animate={{
              scale: isChecked ? 1 : 0,
              opacity: isChecked ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="text-white font-bold"
          >
            ✓
          </motion.div>
        </motion.div>
      </motion.label>

      {/* Content - with strikethrough for completed tasks */}
      <div 
        className={cn(
          "min-w-0 flex-1 transition-all duration-300",
          isChecked && "line-through opacity-75"
        )}
      >
        {children}
      </div>

      {/* Status indicator on the left border */}
      <div 
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-r-md opacity-60 transition-all duration-300",
          isChecked 
            ? "bg-gradient-to-b from-green-400 via-emerald-400 to-green-500"
            : "bg-gradient-to-b from-blue-400 via-sky-400 to-blue-500"
        )}
        aria-hidden="true"
      />
    </motion.li>
  )
}