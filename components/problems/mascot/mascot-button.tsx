'use client'

import { use } from 'react'
import { motion } from 'motion/react'
import { MascotStateContext, MascotActionsContext } from './mascot-context'
import { MascotSettingsContext } from './mascot-settings-context'
import { CS_LEGENDS } from './settings-view'
import { cn } from '@/lib/utils'

/**
 * Client component for the mascot toggle button.
 */
export function MascotButton() {
  const { selectedIcon } = use(MascotSettingsContext)
  const { isOpen } = use(MascotStateContext)
  const { toggleOpen } = use(MascotActionsContext)

  return (
    <motion.button
      className={cn(
        `fixed bottom-4 right-4 w-14 h-14 rounded-full bg-linear-to-r hover:bg-linear-to-l
         text-white flex items-center justify-center shadow-lg border-2
         border-white dark:border-gray-800`,
        `from-${CS_LEGENDS[selectedIcon].color}-500/80 to-${CS_LEGENDS[selectedIcon].color}-600/50 via-${CS_LEGENDS[selectedIcon].color}-400/80`
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleOpen()
      }}
      style={{
        zIndex: 10000,
      }}
      aria-label={isOpen ? 'Close mascot' : 'Open mascot'}
    >
      {(() => {
        const iconConfig = CS_LEGENDS[selectedIcon]
        if (!iconConfig) return null
        const IconComponent = iconConfig.icon as React.ComponentType<{
          className?: string
        }>
        return <IconComponent className="w-6 h-6" />
      })()}
    </motion.button>
  )
}
