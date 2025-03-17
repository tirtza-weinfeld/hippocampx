"use client"

import type React from "react"

import { useRef, useState, useCallback, useEffect } from "react"

interface SwipeableOptions {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
  onSwipedUp?: () => void
  onSwipedDown?: () => void
  preventDefaultTouchmoveEvent?: boolean
  trackMouse?: boolean
  swipeThreshold?: number
}

interface SwipeableHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
}

export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  preventDefaultTouchmoveEvent = false,
  trackMouse = false,
  swipeThreshold = 50,
}: SwipeableOptions): SwipeableHandlers {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)

  // Use refs to track mouse movement
  const mouseStartX = useRef<number | null>(null)
  const mouseStartY = useRef<number | null>(null)

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
    setIsSwiping(true)
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }

      if (!isSwiping) return

      setTouchEndX(e.targetTouches[0].clientX)
      setTouchEndY(e.targetTouches[0].clientY)
    },
    [isSwiping, preventDefaultTouchmoveEvent],
  )

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!isSwiping || touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) {
      setIsSwiping(false)
      return
    }

    const distX = touchEndX - touchStartX
    const distY = touchEndY - touchStartY

    if (Math.abs(distX) > Math.abs(distY)) {
      // Horizontal swipe
      if (Math.abs(distX) > swipeThreshold) {
        if (distX > 0) {
          onSwipedRight?.()
        } else {
          onSwipedLeft?.()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(distY) > swipeThreshold) {
        if (distY > 0) {
          onSwipedDown?.()
        } else {
          onSwipedUp?.()
        }
      }
    }

    setIsSwiping(false)
    setTouchStartX(null)
    setTouchEndX(null)
    setTouchStartY(null)
    setTouchEndY(null)
  }, [
    isSwiping,
    onSwipedDown,
    onSwipedLeft,
    onSwipedRight,
    onSwipedUp,
    swipeThreshold,
    touchEndX,
    touchEndY,
    touchStartX,
    touchStartY,
  ])

  // Handle mouse events for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseStartX.current = e.clientX
    mouseStartY.current = e.clientY
    setIsSwiping(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSwiping) return

      setTouchEndX(e.clientX)
      setTouchEndY(e.clientY)
    },
    [isSwiping],
  )

  const handleMouseUp = useCallback(() => {
    handleTouchEnd()
  }, [handleTouchEnd])

  // Add global mouse event listeners
  useEffect(() => {
    if (trackMouse && isSwiping) {
      document.addEventListener("mousemove", handleMouseMove as unknown as (e: MouseEvent) => void)
      document.addEventListener("mouseup", handleMouseUp as unknown as (e: MouseEvent) => void)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove as unknown as (e: MouseEvent) => void)
        document.removeEventListener("mouseup", handleMouseUp as unknown as (e: MouseEvent) => void)
      }
    }
  }, [handleMouseMove, handleMouseUp, isSwiping, trackMouse])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    ...(trackMouse
      ? {
          onMouseDown: handleMouseDown,
        }
      : {}),
  }
}

