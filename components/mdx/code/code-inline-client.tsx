'use client'

import { motion } from 'motion/react'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InlineCodeClientProps {
  children: ReactNode
  highlighted: boolean
  [key: string]: unknown // For HTML attributes
}

// Helper function to render content (math is handled upstream in code-inline.tsx)
function renderContent(content: ReactNode): ReactNode {
  return content;
}

export const InlineCodeClient = memo(function InlineCodeClient({
  children,
  highlighted,
  ...props
}: InlineCodeClientProps) {

  // Regular highlighted code with better contrast
  if (highlighted) {

    return (
      <motion.code

        className="inline-code inline-block  px-1.5 py-0.5 rounded text-sm font-mono shadow-sm bg-linear-to-r 
       hover:bg-linear-to-l from-step/7 via-step/5 to-step/3 px-1.5 py-0.5 "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        <span 
        className=" bg-linear-to-r hover:bg-linear-to-l from-step via-step/50 to-step/90 bg-clip-text text-transparent"
        >
          {renderContent(children)}
        </span>
      </motion.code>


    )
  }

  // Default inline code with better styling
  return (
    <motion.code
      className={cn(
        "inline-code inline-block ",
        "bg-linear-to-r hover:bg-linear-to-l",
        "from-green-500/10  from-10%  via-sky-500/10 via-20% to-blue-500/10 to-90%",
        "dark:from-teal-700/20  dark:via-sky-800/20 dark:to-blue-700/20  ",
        "px-1.5 py-0.5 rounded text-sm font-mono",
        "shadow-sm",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      <span className={cn(

        "bg-linear-to-r hover:bg-linear-to-l",
        "from-teal-500  from-10%  via-sky-500 via-20% to-blue-500 to-90%",
        "dark:from-teal-700  dark:via-sky-500 dark:to-blue-500  ",
        "text-transparent bg-clip-text",
        "font-bold",


      )}>      {renderContent(children)}
      </span>
    </motion.code>
  )
}) 