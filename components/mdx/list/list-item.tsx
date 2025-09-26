"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {Spade, Club, Diamond, Heart } from "lucide-react"

export interface ListItemProps {
  children: ReactNode
  className?: string
  level: number
  displayNumber?: string
  headerItem?: boolean
}

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
} as const


const getIconConfig = (level: number) => {
  const configs = [
    {
      Icon: Spade,
      levelcolor: "teal-500",
      gradient: "from-sky-500 to-cyan-500 via-cyan-600",
      background: "from-sky-500/60 to-cyan-500/50 via-cyan-500/50  dark:from-cyan-900/50 dark:via-sky-900/20 dark:to-cyan-900/40"
    },
    // Level 1
    {
      Icon: Club,
      levelcolor: "green-500",
      gradient: "from-blue-500 to-indigo-500 via-indigo-600",
      background: "from-blue-500/60 to-indigo-500/10 via-indigo-50/10  dark:from-indigo-900/40 dark:via-blue-900/20 dark:to-indigo-900/40"
    }, // Level 2
    {
      Icon: Diamond,
      levelcolor: "orange-500",
      gradient: "from-pink-500 to-rose-500 via-rose-600",
      background: " from-pink-500/60 to-rose-500/10 via-rose-50/10  dark:from-rose-900/40 dark:via-pink-900/20 dark:to-rose-900/40"
    }, // Level 3
    {
      Icon: Heart,
      levelcolor: "yellow-500",
      gradient: "from-pink-500 to-rose-500 via-yellow-600",
      background: "from-pink-500/90 to-rose-500/10 via-rose-50/10  dark:from-rose-900/40 dark:via-pink-900/20 dark:to-rose-900/40"
    },
  ] as const

  const normalizedLevel = Math.max(0, level - 1)
  return configs[normalizedLevel % configs.length] || configs[0]
}


export default function ListItem({
  children,
  className = "",
  level,
  displayNumber,
  headerItem,
  ...props
}: ListItemProps) {
  const showNumber = displayNumber !== undefined
  const { Icon, levelcolor } = getIconConfig(level)

// if(headerItem){
//   console.log("headerItem", headerItem,children)
// }

  return (
    <motion.li
      variants={listItemVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        'data-list-item=special',
        "flex items-start gap-3",
        "text-gray-700 dark:text-gray-300",
        "leading-relaxed",
        // "p-0 @md:p-3",
        // "p-0",
        // "p-3",
        "p-2",

        "rounded-xl",
        "border border-gray-200/40 dark:border-gray-700/40",
        "shadow-sm backdrop-blur-sm",
        "transition-all duration-300",
        "hover:shadow-md hover:border-sky-300/50 dark:hover:border-sky-600/50",
        `hover:bg-linear-to-r hover:from-white/90 hover:via-${levelcolor}-50/50`,
        ` hover:to-white/90 dark:hover:from-gray-800/60 dark:hover:via-gray-900/30 dark:hover:to-gray-800/60`,
        className,
    
      )}
      {...props}
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: showNumber ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "flex items-center justify-center flex-shrink-0 mt-0.5 ",
          "w-6 h-6 rounded-full",
          "shadow-lg ",
          `shadow-${levelcolor}`,
          // ` bg-linear-to-r ${background}`
          // showNumber
          //   ? "w-6 h-6 rounded-full bg-linear-to-r from-sky-500 to-cyan-500"
          //   : `w-6 h-6 rounded-full bg-linear-to-r ${gradient}`
        )}
      >
        {showNumber ? (
          <span className={cn(" text-xs font-bold",`text-${levelcolor}`)}>
            {displayNumber}
          </span>
        ) : (
          <Icon className={cn(
            "w-3 h-3  ",
            `text-${levelcolor}`
          )} />
        )}
        {/* <span className="absolute top-0 right-0 text-em-gradient">level: {level}</span> */}
      </motion.div>

      <div className={cn(
        "min-w-0 flex-1",
       
        //  headerItem && "[&>*:first-child]:font-semibold [&>*:first-child]:text-em-gradient ",
      )}>
 

          
          {children}


      </div>
    </motion.li>
  )
}