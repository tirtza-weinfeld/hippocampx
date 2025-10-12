'use client'

import { use, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { MobileViewportMeta } from '../../mobile-viewport-meta'
import { BottomNavigation } from './bottom-navigation'
import { CS_LEGENDS } from './settings-view'
import {
  MascotStateContext,
  MascotActionsContext,
} from './mascot-context'
import { MascotSettingsContext } from './mascot-settings-context'
import { cn } from '@/lib/utils'

/**
 * Client component that handles mascot dialog UI, animations, and interactivity.
 * Receives server-rendered views as props and displays them based on active feature.
 */
export function MascotDialog({
  views,
}: {
  views: Record<string, React.ReactNode>
}) {
  const { selectedIcon, stayOpen } = use(MascotSettingsContext)
  const { activeFeature, isOpen, isFullscreen } = use(MascotStateContext)
  const { setIsOpen, toggleFullscreen } = use(MascotActionsContext)
  const dialogRef = useRef<HTMLDivElement>(null)

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget && !stayOpen) {
      event.preventDefault()
      event.stopPropagation()
      setIsOpen(false)
    }
  }

  function handleCloseClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(false)
  }

  function handleFullscreenClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    toggleFullscreen()
  }

  return (
    <>
      <MobileViewportMeta />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            {!stayOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
                onClick={handleBackdropClick}
              />
            )}

            {/* Dialog */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className={cn(
                'bg-background/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border-2 border-primary/50 transform-gpu will-change-transform flex flex-col overflow-hidden',
                isFullscreen
                  ? 'w-screen h-screen max-w-none max-h-none rounded-none'
                  : 'w-[95vw] sm:w-[420px] h-[90vh] sm:h-[520px] max-w-[420px] max-h-[520px]'
              )}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: 'translate3d(0,0,0)',
                position: 'fixed',
                ...(isFullscreen
                  ? { top: 0, left: 0, right: 0, bottom: 0 }
                  : { bottom: '4rem', right: '1rem' }),
                zIndex: 9999,
              }}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {(() => {
                    const iconConfig = CS_LEGENDS[selectedIcon]
                    if (!iconConfig) return null
                    const IconComponent = iconConfig.icon as React.ComponentType<{
                      className?: string
                    }>
                    return <IconComponent className="w-5 h-5" />
                  })()}
                  <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Problems Assistant
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={handleFullscreenClick}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </motion.button>
                  <motion.button
                    onClick={handleCloseClick}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close mascot"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Main Content Area - Render the active view (server component passed as prop) */}
              <div
                className="p-2 h-[calc(100%-112px)] overflow-auto flex flex-col"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {views[activeFeature]}
              </div>

              {/* Bottom Navigation */}
              <div className="flex-shrink-0">
                <BottomNavigation />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
