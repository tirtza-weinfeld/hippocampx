"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, animate, useMotionValueEvent } from 'framer-motion'
import { TableOfContents } from './table-of-contents'
import { cn } from '@/lib/utils'

interface TocHeading {
  text: string
  id: string
  level: number
}

interface ResizableWrapperProps {
  headings: string
  children: React.ReactNode
  className?: string
}

const MIN_WIDTH = 240
const KNOB_OFFSET = 12 // The handle's visible offset when closed

// Custom hook to get responsive default width
const useResponsiveDefaultWidth = () => {
  const [defaultWidth, setDefaultWidth] = useState(320)

  useEffect(() => {
    const updateWidth = () => {
      // On small screens (mobile), default to 0 (closed)
      // On larger screens, default to 320
      const isSmallScreen = window.innerWidth < 768 // md breakpoint
      setDefaultWidth(isSmallScreen ? 0 : 320)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return defaultWidth
}

const useResizablePanel = (defaultWidth: number) => {
  const width = useMotionValue(defaultWidth)
  const [isDragging, setIsDragging] = useState(false)

  // Update width when defaultWidth changes (e.g., on screen resize)
  useEffect(() => {
    width.set(defaultWidth)
  }, [defaultWidth, width])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Only prevent default for mouse events, not touch events
    if ('clientX' in e) {
      e.preventDefault()
    }
    e.stopPropagation()
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    setIsDragging(true)
  }, [])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    if (clientX === undefined) return
    
    const newWidth = window.innerWidth - clientX
    const maxWidth = Math.min(window.innerWidth * 0.9, 500) // 90% of screen width
    width.set(Math.max(0, Math.min(maxWidth, newWidth)))
  }, [isDragging, width])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
    document.body.style.cursor = 'auto'
    document.body.style.userSelect = 'auto'
    
    const currentWidth = width.get()
    if (currentWidth < MIN_WIDTH) {
      if (currentWidth > MIN_WIDTH / 2) {
        animate(width, MIN_WIDTH, { type: 'spring', stiffness: 400, damping: 40 })
      } else {
        animate(width, 0, { type: 'spring', stiffness: 400, damping: 40 })
      }
    }
  }, [width])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      // Use passive: false for touchmove to allow preventDefault
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    }
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  return { width, handleStart, isDragging }
}

export function ResizableWrapper({ headings: headingsJson, children, className }: ResizableWrapperProps) {
  const defaultWidth = useResponsiveDefaultWidth()
  const { width, handleStart, isDragging } = useResizablePanel(defaultWidth)
  
  const handleRight = useMotionValue(defaultWidth);
  const contentOpacity = useMotionValue(defaultWidth > 0 ? 1 : 0);
  const contentPointerEvents = useMotionValue(defaultWidth > 0 ? 'auto' : 'none');
  const [isMobile, setIsMobile] = useState(false)

  // Track if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Callback to close TOC on mobile when heading is clicked
  const handleMobileHeadingClick = useCallback(() => {
    if (window.innerWidth < 768) {
      // Close the TOC panel on mobile
      animate(width, 0, { type: 'spring', stiffness: 400, damping: 40 })
    }
  }, [width])

  useMotionValueEvent(width, "change", (w) => {
    if(isDragging) {
      handleRight.set(w > 0 ? w : KNOB_OFFSET);
    } else {
      animate(handleRight, w > 0 ? w : KNOB_OFFSET, { type: 'spring', stiffness: 400, damping: 40 });
    }

    if (w > 0) {
      contentPointerEvents.set('auto');
      animate(contentOpacity, 1, { duration: 0.2 });
    } else {
      contentPointerEvents.set('none');
      animate(contentOpacity, 0, { duration: 0.2 });
    }
  })

  let headings: TocHeading[] = []
  try {
    const parsedHeadings = JSON.parse(headingsJson)
    if (Array.isArray(parsedHeadings)) headings = parsedHeadings
  } catch (e) {
    console.error("Failed to parse TOC headings:", e)
  }

  if (headings.length === 0) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="transition-none"
        style={{ 
          // On mobile: no padding (TOC slides over content)
          // On desktop: padding to push content (TOC pushes content)
          paddingRight: isMobile ? 0 : width 
        }}
      >
        <div className='max-w-4xl mx-auto'>
        {children}

        </div>
      </motion.div>

      {/* Draggable handle (door knob) - always visible */}
      <motion.div
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{ right: handleRight }}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 w-4 h-24 flex items-center justify-center cursor-col-resize z-50 group touch-none",
          // On mobile: adjust positioning for full-height TOC
          isMobile && "top-1/2"
        )}
        aria-label="Resize Table of Contents"
      >
        <div className="w-2 h-20 bg-border rounded-full transition-colors duration-200 ease-in-out 
        group-hover:bg-sky-500/20 group-active:bg-sky-500/20" />
      </motion.div>

      <motion.aside
        className={cn(
          "backdrop-blur-lg border border-sky-200/30 border-2 shadow-xl shadow-sky-200/30 z-40 dark:shadow-sky-800/20 dark:border-sky-800/20 rounded-2xl",
          // On mobile: full height with better positioning
          // On desktop: standard positioning
          isMobile 
            ? "fixed top-0 bottom-0 right-0 rounded-l-2xl rounded-r-none" 
            : "fixed top-2 bottom-2 right-2"
        )}
        style={{ 
          width: width, 
          pointerEvents: contentPointerEvents 
        }}
      >
        {/* Draggable left border area - always visible */}
        <motion.div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-10 touch-none"
          aria-label="Resize Table of Contents"
        />
        
        <motion.div 
          className={cn(
            "h-full overflow-hidden",
            // On mobile: more padding for better touch targets
            // On desktop: standard padding
            isMobile 
              ? "p-4 pt-12" 
              : "p-3 sm:p-4 md:p-6 pt-8 sm:pt-10 md:pt-12"
          )}
          style={{ opacity: contentOpacity }}
        >
          <TableOfContents headings={headings} maxHeight="calc(100vh - 120px)" onHeadingClick={handleMobileHeadingClick} />
        </motion.div>
      </motion.aside>
    </div>
  )
} 