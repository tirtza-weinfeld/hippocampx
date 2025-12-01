"use client"

import * as React from "react"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { BookOpen, X, ChevronUp } from "lucide-react"

type ProblemDeepDiveProps = {
  readonly title: string
  readonly children: React.ReactNode
  readonly className?: string
  readonly size?: "default" | "large" | "full"
}

export function ProblemDeepDive({
  title,
  children,
  className,
  size = "default",
}: ProblemDeepDiveProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isOpen, setIsOpen] = React.useState(false)
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [modalSize, setModalSize] = React.useState({ width: 0, height: 0 })
  const [isResizing, setIsResizing] = React.useState(false)

  // Mobile detection hook
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return

    if (isMobile) {
      // Mobile: use viewport dimensions with safe padding
      setModalSize({
        width: window.innerWidth - 32, // 2rem padding
        height: window.innerHeight - 64  // 4rem padding for top/bottom
      })
    } else {
      // Desktop: original size logic
      const initialSizes = {
        default: { width: 800, height: 600 },
        large: { width: 1000, height: 700 },
        full: { width: window.innerWidth * 0.9, height: window.innerHeight * 0.9 }
      }
      setModalSize(initialSizes[size])
    }
  }, [isOpen, size, isMobile])

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const target = e.currentTarget
    setShowScrollTop(target.scrollTop > 200)
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleDragStart(event: React.PointerEvent, direction: string) {
    event.stopPropagation()
    setIsResizing(true)

    const startX = event.clientX
    const startY = event.clientY
    const startWidth = modalSize.width
    const startHeight = modalSize.height
    const startPosX = position.x
    const startPosY = position.y

    function handleMove(e: PointerEvent) {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newPosX = startPosX
      let newPosY = startPosY

      if (direction.includes("e")) {
        newWidth = Math.max(400, Math.min(window.innerWidth * 0.95, startWidth + deltaX))
      }
      if (direction.includes("w")) {
        const widthDelta = Math.max(400, Math.min(window.innerWidth * 0.95, startWidth - deltaX))
        if (widthDelta >= 400) {
          newWidth = widthDelta
          newPosX = startPosX + deltaX
        }
      }
      if (direction.includes("s")) {
        newHeight = Math.max(400, Math.min(window.innerHeight * 0.95, startHeight + deltaY))
      }
      if (direction.includes("n")) {
        const heightDelta = Math.max(400, Math.min(window.innerHeight * 0.95, startHeight - deltaY))
        if (heightDelta >= 400) {
          newHeight = heightDelta
          newPosY = startPosY + deltaY
        }
      }

      setModalSize({ width: newWidth, height: newHeight })
      setPosition({ x: newPosX, y: newPosY })
    }

    function handleEnd() {
      setIsResizing(false)
      document.removeEventListener("pointermove", handleMove)
      document.removeEventListener("pointerup", handleEnd)
    }

    document.addEventListener("pointermove", handleMove)
    document.addEventListener("pointerup", handleEnd)
  }

  const actualSize = modalSize

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <motion.button
          className={cn(
            "group relative inline-flex items-center gap-2.5",
            "px-4 py-2 rounded-full",
            "bg-linear-to-r from-blue-500/10 via-violet-500/10 to-purple-500/10",
            "hover:from-blue-500/20 hover:via-violet-500/20 hover:to-purple-500/20",
            "border border-blue-500/20 hover:border-violet-500/30",
            "shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-violet-500/20",
            "transition-all duration-300 ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
            "cursor-pointer",
            className
          )}
          whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
          aria-label={`Open ${title} deep dive`}
        >
          <motion.div
            className="relative z-10"
            animate={shouldReduceMotion ? {} : {
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
          </motion.div>

          <span className={cn(
            "relative z-10 text-sm font-semibold tracking-wide",
            "bg-linear-to-r from-blue-700 via-violet-600 to-purple-600",
            "dark:from-blue-400 dark:via-violet-400 dark:to-purple-400",
            "bg-clip-text text-transparent",
            "transition-all duration-300"
          )}>
            {title}
          </span>
        </motion.button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <motion.div
              ref={modalRef}
              drag={!isResizing && !isMobile}
              dragMomentum={false}
              dragElastic={0}
              onDragEnd={(_, info) => {
                setPosition(prev => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }))
              }}
              style={{
                width: actualSize.width,
                height: actualSize.height,
                x: isMobile ? 0 : position.x,
                y: isMobile ? 0 : position.y,
              }}
              className={cn(
                "fixed left-[50%] top-[50%] z-[200]",
                "translate-x-[-50%] translate-y-[-50%]",
                "flex flex-col overflow-hidden",
                "rounded-2xl",
                "shadow-2xl shadow-black/20",
                "bg-background",
                "border-2",
                isResizing ? "border-blue-500/50" : "border-border/50",
                "transition-colors duration-200",
                isMobile && "max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)]"
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header - draggable */}
              <div
                className={cn(
                  "sticky top-0 z-50",
                  "px-[max(1.5rem,env(safe-area-inset-left))] py-4 pr-[max(1.5rem,env(safe-area-inset-right))]",
                  "border-b border-border/50",
                  "bg-linear-to-r from-background via-background/98 to-background",
                  "backdrop-blur-xl",
                  !isMobile && "cursor-move",
                  "select-none"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "p-2 rounded-xl shrink-0",
                      "bg-linear-to-br from-blue-500/10 to-violet-500/10",
                      "border border-blue-500/20"
                    )}>
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold line-clamp-1">
                      {title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* <motion.button
                      onClick={toggleMaximize}
                      className={cn(
                        "p-2 rounded-lg",
                        "hover:bg-muted transition-colors",
                        "text-muted-foreground hover:text-foreground"
                      )}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      aria-label={isMaximized ? "Restore size" : "Maximize"}
                    >
                      {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </motion.button> */}

                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "p-3 rounded-lg min-h-[44px] min-w-[44px]",
                        "flex items-center justify-center",
                        "hover:bg-destructive/10 transition-colors",
                        "text-muted-foreground hover:text-destructive"
                      )}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={cn(
                  "flex-1 overflow-y-auto overflow-x-hidden",
                  "px-[max(1.5rem,env(safe-area-inset-left))] py-6 pr-[max(1.5rem,env(safe-area-inset-right))]",
                  "scroll-smooth",
                  isMobile && "touch-pan-y"
                )}
              >
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={cn(
                    "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
                    "prose-headings:font-semibold",
                    "prose-p:leading-relaxed",
                    "prose-pre:rounded-lg",
                    "prose-img:rounded-xl",
                    "prose-a:text-blue-600 dark:prose-a:text-blue-400"
                  )}
                >
                  {children}
                </motion.div>
                <div className="h-20" aria-hidden="true" />
              </div>

              {/* Scroll to top */}
              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className={cn(
                      "fixed bottom-6 right-6 z-50",
                      "min-h-[44px] min-w-[44px]",
                      "flex items-center justify-center",
                      "p-3 rounded-xl",
                      "bg-blue-500 text-white",
                      "shadow-lg hover:shadow-xl",
                      "transition-shadow"
                    )}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                    aria-label="Scroll to top"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Resize handles - only when not mobile */}
              {!isMobile && (
                <>
                  {/* Edges */}
                  <div
                    onPointerDown={(e) => handleDragStart(e, "n")}
                    className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500/30 transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "e")}
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/30 transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "s")}
                    className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500/30 transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "w")}
                    className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/30 transition-colors z-50"
                  />

                  {/* Corners */}
                  <div
                    onPointerDown={(e) => handleDragStart(e, "nw")}
                    className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-500/40 rounded-tl-2xl transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "ne")}
                    className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize hover:bg-blue-500/40 rounded-tr-2xl transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "se")}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-500/40 rounded-br-2xl transition-colors z-50"
                  />
                  <div
                    onPointerDown={(e) => handleDragStart(e, "sw")}
                    className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize hover:bg-blue-500/40 rounded-bl-2xl transition-colors z-50"
                  />
                </>
              )}
            </motion.div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
