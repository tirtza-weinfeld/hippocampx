'use client'

import { motion } from 'motion/react'
import { Brain } from 'lucide-react'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

type AgentMascotButtonProps = {
  onClick: () => void
  isOpen: boolean
  ref?: React.Ref<HTMLButtonElement>
}

/**
 * Client component for the agent mascot toggle button.
 * Fixed position button that triggers the agent dialog.
 */
export const AgentMascotButton = forwardRef<HTMLButtonElement, Omit<AgentMascotButtonProps, 'ref'>>(
  function AgentMascotButton({ onClick, isOpen }, ref) {
    return (
      <motion.button
        ref={ref}
      className={cn(
        `fixed bottom-4 right-4 w-14 h-14 rounded-full bg-linear-to-r hover:bg-linear-to-l
         text-white flex items-center justify-center shadow-lg border-2
         border-white dark:border-gray-800`,
        `from-teal-500/80 to-sky-600/50 via-blue-400/80`
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
      style={{
        zIndex: 10000,
      }}
        aria-label={isOpen ? 'Close agent' : 'Open agent'}
      >
        <Brain className="w-6 h-6" />
      </motion.button>
    )
  }
)
