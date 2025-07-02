'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import type { ReactNode } from 'react'
import { isValidColorName } from '@/lib/step-colors'

export interface InlineCodeClientProps {
  children: ReactNode
  highlighted: boolean
  step?: number
  colorName?: string
}

export const InlineCodeClient = memo(function InlineCodeClient({ 
  children, 
  highlighted, 
  step,
  colorName
}: InlineCodeClientProps) {
  // Step or color highlighting styles - use same structure as regular code but with step colors
  if (step || colorName) {
    let colorName_final: string;
    
    if (step) {
      // Get color name from step number
      const stepColors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
      colorName_final = stepColors[(step - 1) % stepColors.length];
    } else if (colorName && isValidColorName(colorName)) {
      colorName_final = colorName;
    } else {
      colorName_final = 'blue'; // fallback
    }

    return (
      <motion.code
        className={`
         inline-block 
          bg-linear-to-r 
          from-${colorName_final}-500/10  from-10%  via-${colorName_final}-500/10 via-20% to-${colorName_final}-500/10 to-90%
           dark:from-${colorName_final}-700/20  dark:via-${colorName_final}-800/20 dark:to-${colorName_final}-700/20  
           px-1.5 py-0.5 rounded text-sm font-mono
           hover:bg-linear-to-l
           shadow-sm
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        role="code"
        aria-label={step ? `Code step ${step}` : `Code color ${colorName}`}
      >
        <span className={`
        
         bg-linear-to-r 
          from-${colorName_final}-500  from-10%  via-${colorName_final}-500 via-20% to-${colorName_final}-500 to-90%
           dark:from-${colorName_final}-700  dark:via-${colorName_final}-500 dark:to-${colorName_final}-500  
           text-transparent bg-clip-text
           font-bold
           hover:bg-linear-to-l
           `}>
        {children}
        </span>
      </motion.code>
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