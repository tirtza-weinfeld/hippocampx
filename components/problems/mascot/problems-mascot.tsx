"use client"

import { useRef, use } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BottomNavigation } from "./bottom-navigation"
import { MobileViewportMeta } from "../../mobile-viewport-meta"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { SettingsView, CS_LEGENDS } from "./settings-view"
import { MascotSettingsProvider } from "./mascot-settings-context"
// import MascotSwitch from "./mascot-switch"
// import { DictionaryView } from "./dictionary-view"
import { ProblemsView } from "./problems-view"
import {
  MascotStateContext,
  MascotActionsContext,

  MascotProvider
} from "./mascot-context"
import { MascotSettingsContext } from "./mascot-settings-context"
import { Problems } from "./mascot-types"
// import { Problems, Topics } from "./mascot-types"
import { cn } from "@/lib/utils"

function ProblemsMascotContent({
  problems,
  timeComplexities,
  topics,
  preRenderedSolutions,
}: {
  problems: Problems
  timeComplexities: Record<string, string>
  topics: Record<string, string[]>
  preRenderedSolutions: Record<string, React.ReactNode>
}) {

  // Use React 19 granular context pattern
  // const { selectedIcon, stayOpen, setStayOpen } = use(MascotSettingsContext)
  const { selectedIcon, stayOpen } = use(MascotSettingsContext)
  const { activeFeature, isOpen, isFullscreen } = use(MascotStateContext)
  const { setActiveFeature, setIsOpen, toggleOpen, toggleFullscreen } = use(MascotActionsContext)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle backdrop clicks to close dialog (only if stayOpen is false)
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
    <div className="fixed bottom-4 right-4 z-50">
      <MobileViewportMeta />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay - only render when stayOpen is false */}
            {!stayOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
                onClick={handleBackdropClick}
              />
            )}

            {/* Dialog - always positioned consistently */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className={cn(
                "bg-background/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border-2 border-primary/50 transform-gpu will-change-transform flex flex-col overflow-hidden",
                isFullscreen
                  ? "w-screen h-screen max-w-none max-h-none rounded-none"
                  : "w-[95vw] sm:w-[420px] h-[90vh] sm:h-[520px] max-w-[420px] max-h-[520px]"
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
                    const IconComponent = iconConfig.icon as React.ComponentType<{ className?: string }>
                    return <IconComponent className="w-5 h-5" />
                  })()}
                  <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Problems Assistant
                  </h2>
                </div>
                {/* <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Stay Open</span>
                  <MascotSwitch
                    checked={stayOpen}
                    onCheckedChange={setStayOpen}
                    className="scale-75"
                  />
                </div>
              </div> */}
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={handleFullscreenClick}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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

              {/* Main Content Area */}
              <div className="p-2 h-[calc(100%-112px)] overflow-auto flex flex-col" style={{ WebkitOverflowScrolling: 'touch' }}  >
                {activeFeature === "main" && (
                  <ProblemsView
                    problems={problems}
                    time_complexities={timeComplexities}
                    topics={topics}
                    preRenderedSolutions={preRenderedSolutions}
                  />
                )}

                {/* {activeFeature === "dictionary" && (
                <DictionaryView
                  topics={stats.topics as unknown as Topics}
                />
              )} */}
                {/* {activeFeature === "snippets" && (
                )} */}
                {activeFeature === "settings" && (
                  <SettingsView />
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="flex-shrink-0">
                <BottomNavigation
                  activeFeature={activeFeature}
                  onFeatureChange={setActiveFeature}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mascot Button - Single consistent button */}
      <motion.button
        className={cn(`fixed bottom-4 right-4 w-14 h-14 rounded-full bg-linear-to-r hover:bg-linear-to-l
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
          zIndex: 10000
        }}
        aria-label={isOpen ? "Close mascot" : "Open mascot"}
      >
        {(() => {
          const iconConfig = CS_LEGENDS[selectedIcon]
          if (!iconConfig) return null
          const IconComponent = iconConfig.icon as React.ComponentType<{ className?: string }>
          return <IconComponent className="w-6 h-6" />
        })()}
      </motion.button>
    </div>
  )
}

// Wrapper component with provider
export function ProblemsMascot({
  problems,
  timeComplexities,
  topics,
  preRenderedSolutions,
}: {
  problems: Problems
  timeComplexities: Record<string, string>
  topics: Record<string, string[]>
  preRenderedSolutions: Record<string, React.ReactNode>
}) {
  return (
    <MascotSettingsProvider>
      <MascotProvider>
        <ProblemsMascotContent
          problems={problems}
          timeComplexities={timeComplexities}
          topics={topics}
          preRenderedSolutions={preRenderedSolutions}
        />
      </MascotProvider>
    </MascotSettingsProvider>
  )
}