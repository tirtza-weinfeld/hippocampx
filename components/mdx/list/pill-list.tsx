"use client"

import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Tags, X } from "lucide-react"

interface PillListProps {
  pills: string[]
  className?: string
}

// Calculate vertical stack positions for smooth spill-down effect
const getStackPosition = (index: number, total: number) => {
  const spacing = 44 // Space between items
  const startY = 16 // Start position below toggle button
  
  return {
    x: 0, // All items aligned vertically
    y: startY + (index * spacing),
  }
}

// Modern semantic color scheme matching MDX design system
const pillStyles = [
  " from-slate-500/80 to-slate-600/80 shadow-slate-500/20",
  " from-blue-500/80 to-blue-600/80 shadow-blue-500/20",
  " from-emerald-500/80 to-emerald-600/80 shadow-emerald-500/20",
  " from-violet-500/80 to-violet-600/80 shadow-violet-500/20",
  " from-orange-500/80 to-orange-600/80 shadow-orange-500/20",
  " from-pink-500/80 to-pink-600/80 shadow-pink-500/20",
  " from-cyan-500/80 to-cyan-600/80 shadow-cyan-500/20",
  " from-indigo-500/80 to-indigo-600/80 shadow-indigo-500/20",
] as const

export const PillList = ({ pills, className }: PillListProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  // Parse pills string into clean array
  // const pillsArray = useMemo(() => {
  //   try {
  //     return pills
  //       .replace(/[\[\]"']/g, '')
  //       .split(',')
  //       .map(p => p.trim())
  //       .filter(p => p.length > 0)
  //   } catch {
  //     return []
  //   }
  // }, [pills])
  const pillsArray = pills

  // Calculate positions for vertical stack expansion
  const itemPositions = useMemo(() => {
    return pillsArray.map((_, index) => 
      getStackPosition(index, pillsArray.length)
    )
  }, [pillsArray])

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  // Enhanced keyboard handlers
  useEffect(() => {
    if (!isExpanded) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        setIsExpanded(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  // Click outside handler
  useEffect(() => {
    if (!isExpanded) return
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-pill-container]')) {
        setIsExpanded(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  if (pillsArray.length === 0) return null

  return (
    <div 
      className={cn("relative z-10 flex flex-col w-fit mb-2 ", className)}
      data-pill-container
    >
      <div className="relative">
        {/* Modern toggle button positioned absolutely like difficulty badge */}
        <motion.button
          onClick={handleToggle}
          className={cn(
            "flex items-center gap-2 mb-2 px-2 py-1 justify-center ",
            "bg-linear-to-r from-sky-400/20  via-blue-500/20 to-sky-500/20 ",
            "shadow-lg shadow-sky-500/20 ",
            "hover:shadow-xl ",
          
            "hover:bg-linear-to-l",
            "transition-all duration-200 ease-out",
            
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isExpanded ? "Hide tags" : "Show tags"}
        >
          {/* Icon with cool animation like binary navigation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? "close" : "open"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {isExpanded ? (
                <div className="relative">
                  <X className="w-4 h-4 text-blue-400" />
                  {/* Pulsing animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <Tags className="w-4 h-4 text-sky-400" />
                  {/* Gentle glow animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/10"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <span className={cn(
            "text-sm bg-linear-to-r from-sky-800 to-sky-500 via-blue-500 bg-clip-text text-transparent",
            "hover:bg-linear-to-l uppercase font-semibold tracking-wide"
          )}>
            Topics
          </span>
         
        </motion.button>

        {/* Pills expand in vertical stack like binary navigation */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {pillsArray.map((pill, index) => {
                const position = itemPositions[index]
                const styleClass = pillStyles[index % pillStyles.length]
                
                return (
                  <motion.div
                    key={`${pill}-${index}`}
                    className="absolute top-10 right-0"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: position.x,
                      y: position.y,
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                    }}
                    transition={{
                      type: shouldReduceMotion ? "tween" : "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: shouldReduceMotion ? 0 : index * 0.08,
                      duration: shouldReduceMotion ? 0.15 : undefined,
                    }}
                    whileHover={{
                      scale: 1.05,
                      x: -6,
                      y: position.y - 2,
                      transition: { 
                        type: shouldReduceMotion ? "tween" : "spring", 
                        stiffness: 400, 
                        damping: 25,
                        duration: shouldReduceMotion ? 0.05 : undefined
                      }
                    }}
                    style={{
                      zIndex: 100 - index,
                    }}
                  >
                    <div className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap",
                      "text-white cursor-default select-none backdrop-blur-sm",
                      "shadow-lg transition-all duration-200",
                      "border border-white/10",
                      "bg-linear-to-r",
                      styleClass,
                      "hover:bg-linear-to-l "
                    )}>
                      {pill.replace(/_/g, ' ').toLowerCase()}
                    </div>
                  </motion.div>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
