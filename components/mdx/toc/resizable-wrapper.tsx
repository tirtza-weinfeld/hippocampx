"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useMotionValue, animate, useMotionValueEvent } from 'motion/react'
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
  const [dragStartTime, setDragStartTime] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)

  // Update width when defaultWidth changes (e.g., on screen resize)
  useEffect(() => {
    width.set(defaultWidth)
  }, [defaultWidth, width])

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Only prevent default for mouse events, not touch events (which are passive)
    if ('clientX' in e) {
      e.preventDefault()
    }
    e.stopPropagation()

    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    setDragStartTime(Date.now())
    setDragStartX(clientX || 0)
    setDragDistance(0)

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    setIsDragging(true)
  }, [])

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    if (clientX === undefined) return

    // Calculate drag distance
    const currentDistance = Math.abs(clientX - dragStartX)
    setDragDistance(currentDistance)

    const newWidth = window.innerWidth - clientX
    const maxWidth = Math.min(window.innerWidth * 0.9, 500) // 90% of screen width
    width.set(Math.max(0, Math.min(maxWidth, newWidth)))
  }, [isDragging, width, dragStartX])

  const handleEnd = useCallback(() => {
    const dragDuration = Date.now() - dragStartTime
    const isQuickClick = dragDuration < 200 && dragDistance < 5 // Quick click with minimal movement

    setIsDragging(false)
    document.body.style.cursor = 'auto'
    document.body.style.userSelect = 'auto'

    // If it was a quick click (not a drag), toggle the panel
    if (isQuickClick) {
      const currentWidth = width.get()
      if (currentWidth > MIN_WIDTH / 2) {
        // Panel is open, close it
        animate(width, 0, { type: 'spring', stiffness: 400, damping: 40 })
      } else {
        // Panel is closed, open it to default width
        const targetWidth = window.innerWidth < 768 ? 320 : 320
        animate(width, targetWidth, { type: 'spring', stiffness: 400, damping: 40 })
      }
      return
    }

    // Normal drag behavior
    const currentWidth = width.get()
    if (currentWidth < MIN_WIDTH) {
      if (currentWidth > MIN_WIDTH / 2) {
        animate(width, MIN_WIDTH, { type: 'spring', stiffness: 400, damping: 40 })
      } else {
        animate(width, 0, { type: 'spring', stiffness: 400, damping: 40 })
      }
    }
  }, [width, dragStartTime, dragDistance])

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

  return { width, handleStart }
}

export function ResizableWrapper({ headings: headingsJson, children, className }: ResizableWrapperProps) {
  const defaultWidth = useResponsiveDefaultWidth()
  const { width, handleStart } = useResizablePanel(defaultWidth)
  const tocRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

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

  // Handle clicking outside TOC to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!isMobile) return
      
      const currentWidth = width.get()
      if (currentWidth === 0) return // TOC is already closed
      
      const target = event.target as Node
      
      // Check if click is outside both the TOC and the handle
      const isOutsideToc = tocRef.current && !tocRef.current.contains(target)
      const isOutsideHandle = handleRef.current && !handleRef.current.contains(target)
      
      if (isOutsideToc && isOutsideHandle) {
        // Close the TOC panel
        animate(width, 0, { type: 'spring', stiffness: 400, damping: 40 })
      }
    }

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobile, width])

  useMotionValueEvent(width, "change", (w) => {
    // Update handle position immediately to match panel width
    handleRight.set(w > 0 ? w : KNOB_OFFSET);

    if (w > 0) {
      contentPointerEvents.set('auto');
      // animate(contentOpacity, 1, { duration: 0.2 });
      contentOpacity.set(1); // Immediate update
    } else {
      contentPointerEvents.set('none');
      // animate(contentOpacity, 0, { duration: 0.2 });
      contentOpacity.set(0); // Immediate update

    }
  })

  let headings: TocHeading[] = []
  try {
    const parsedHeadings = JSON.parse(headingsJson) as TocHeading[]
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
        <div className='max-w-4xl mx-auto print:w-[600px] relative'>
          {children}

        </div>
      </motion.div>

      {/* Enhanced draggable handle with toggle functionality */}
      <motion.div
        ref={handleRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{ right: handleRight }}
        className={cn(
          "print:hidden", 
          "fixed top-1/2 -translate-y-1/2 z-50 group",
          // Same size for both mobile and desktop
          "md:w-6  w-7 h-32",
          "flex items-center justify-center cursor-col-resize touch-none"
        )}
        aria-label="Toggle and resize Table of Contents"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Visual handle with enhanced styling */}
        <div className={cn(
          "rounded-full transition-all duration-200 ease-in-out",
          // Same size for both mobile and desktop
          "w-3 md:w-2 h-28",
          // Consistent visual handle color across all states. Hover/active feedback is handled by scale and shadow, not color change.
          "bg-gradient-to-b from-sky-400/10 to-sky-600/10 dark:from-sky-500/10 dark:to-sky-700/10",
          "group-hover:shadow-lg group-active:shadow-xl",
          "group-hover:shadow-sky-500/20 group-active:shadow-sky-500/30"
        )} />
      </motion.div>

      <motion.aside
        ref={tocRef}
        className={cn(
          "print:hidden",
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
        {/* Enhanced draggable left border area */}
        <motion.div
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={cn(
            "absolute left-0 top-0 bottom-0 cursor-col-resize z-10 touch-none",
            // Responsive drag area
            isMobile ? "w-4" : "w-2" // Larger drag area on mobile, but not too large
          )}
          aria-label="Toggle and resize Table of Contents"
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