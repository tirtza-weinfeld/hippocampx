'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import type { ReactNode } from 'react'

export interface InlineCodeClientProps {
  children: ReactNode
  highlighted: boolean
  step?: number
}

export const InlineCodeClient = memo(function InlineCodeClient({ 
  children, 
  highlighted, 
  step 
}: InlineCodeClientProps) {
  // Step highlighting styles with better color contrast
  if (step) {
    const stepStyles = {
      1: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
      2: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
      3: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200',
      4: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
      5: 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200',
    }[step] || 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200'

    return (
      <motion.span
        className={`inline-block px-1.5 py-0.5 rounded text-sm font-mono border-b-2 ${stepStyles}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        role="code"
        aria-label={`Code step ${step}`}
      >
        {children}
      </motion.span>
    )
  }

  // Regular highlighted code with better contrast
  if (highlighted) {
    return (
      <motion.span
        className="


       
 text-sm font-mono       
          "
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
          role="code"
      >
        {children}
      </motion.span>
    )
  }

  // Default inline code with better styling
  return (
    <motion.code
      className="
       inline-block 
        bg-linear-to-r 
        from-green-500/10  from-10%  via-sky-500/10 via-20% to-blue-500/10 to-90%
         dark:from-teal-700/20  dark:via-sky-800/20 dark:to-blue-700/20  
         px-1.5 py-0.5 rounded text-sm font-mono
         hover:bg-linear-to-l
         shadow-sm
      "
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <span className="
      
       bg-linear-to-r 
        from-teal-500  from-10%  via-sky-500 via-20% to-blue-500 to-90%
         dark:from-teal-700  dark:via-sky-500 dark:to-blue-500  
         text-transparent bg-clip-text
         font-bold
         hover:bg-linear-to-l
         ">
      {children}
      </span>
    </motion.code>
  )
}) 