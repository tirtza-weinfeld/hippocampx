"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion } from "motion/react"

interface SwipeContainerProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export default function SwipeContainer({ children, onSwipeLeft, onSwipeRight, className = "" }: SwipeContainerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50

  const containerRef = useRef<HTMLDivElement>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setSwiping(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)

    // Determine swipe direction for visual feedback
    if (touchStart - currentTouch > 10) {
      setSwipeDirection("left")
    } else if (currentTouch - touchStart > 10) {
      setSwipeDirection("right")
    } else {
      setSwipeDirection(null)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    setSwiping(false)
    setSwipeDirection(null)

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Calculate the X offset for visual feedback during swipe
  const getSwipeOffset = () => {
    if (!touchStart || !touchEnd || !swiping) return 0

    // Limit the maximum offset to 50px
    const maxOffset = 50
    const offset = touchEnd - touchStart

    if (offset > maxOffset) return maxOffset
    if (offset < -maxOffset) return -maxOffset

    return offset
  }

  return (
    <motion.div
      ref={containerRef}
      className={`swipe-area ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      animate={{
        x: swiping ? getSwipeOffset() : 0,
        opacity: swiping ? (Math.abs(getSwipeOffset()) > 30 ? 0.8 : 1) : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}

      {/* Visual indicators for swipe direction */}
      {swiping && swipeDirection === "left" && (
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      )}

      {swiping && swipeDirection === "right" && (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}

