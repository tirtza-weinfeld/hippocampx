"use client"

import { cn } from "@/lib/utils"
import { X, Maximize2, Minimize2, GripVertical } from 'lucide-react'
import { useRef, useEffect, type ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { useDraggable } from "./hooks/use-draggable"
import { useResizable } from "./hooks/use-resizable"
import { useClickOutside } from "./hooks/use-click-outside"
import { ResizeHandle } from "./resize-handle"
import { AgentTooltip } from "./agent-tooltip"
import { useAgentDialogStore } from "./store/agent-dialog-store"

type AgentDialogProps = {
    children: ReactNode
    isOpen: boolean
    onClose: () => void
    excludeClickOutsideRefs?: React.RefObject<HTMLElement | null>[]
}

/**
 * Modern draggable and resizable dialog for agent problems view.
 *
 * Features:
 * - Drag from header to reposition
 * - Resize from all edges and corners
 * - Maximize/minimize toggle
 * - Easy dismiss (click outside to close)
 * - Fully scrollable content area
 * - Preserves state when closed/reopened
 */
export function AgentDialog({ children, isOpen, onClose, excludeClickOutsideRefs = [] }: AgentDialogProps) {

    const shouldReduceMotion = useReducedMotion()

    const dialogRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Get all state from Zustand store
    const scrollPosition = useAgentDialogStore((state) => state.scrollPosition)
    const setScrollPosition = useAgentDialogStore((state) => state.setScrollPosition)
    const isMaximized = useAgentDialogStore((state) => state.isMaximized)
    const toggleMaximized = useAgentDialogStore((state) => state.toggleMaximized)
    const easyDismiss = useAgentDialogStore((state) => state.easyDismiss)
    const toggleEasyDismiss = useAgentDialogStore((state) => state.toggleEasyDismiss)
    const position = useAgentDialogStore((state) => state.position)
    const size = useAgentDialogStore((state) => state.size)

    // Draggable logic
    const { isDragging, handleMouseDown: handleDragStart } = useDraggable(!isMaximized)

    // Resizable logic
    const { resizeDirection, handleMouseDownResize } = useResizable(
        {
            minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 400,
            minHeight: 300
        },
        !isMaximized
    )

    // Click outside to dismiss (excluding mascot trigger button)
    // Wrap onClose to first close any open dropdowns before closing the dialog
    function handleClose() {
        // Dispatch event to close all dropdowns first
        window.dispatchEvent(new CustomEvent('agent-dialog-closing'))
        // Small delay to let dropdowns close before dialog unmounts
        setTimeout(() => {
            onClose()
        }, 0)
    }

    useClickOutside(dialogRef, handleClose, easyDismiss && isOpen, excludeClickOutsideRefs)

    // Restore scroll position when dialog opens
    useEffect(() => {
        if (isOpen && contentRef.current && scrollPosition > 0) {
            // Use requestAnimationFrame for smooth restoration
            requestAnimationFrame(() => {
                if (contentRef.current) {
                    contentRef.current.scrollTop = scrollPosition
                }
            })
        }
    }, [isOpen, scrollPosition])

    // Save scroll position with debouncing
    useEffect(() => {
        const contentElement = contentRef.current
        if (!contentElement || !isOpen) return

        function handleScroll() {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }

            scrollTimeoutRef.current = setTimeout(() => {
                if (contentRef.current) {
                    setScrollPosition(contentRef.current.scrollTop)
                }
            }, 300) // 300ms debounce
        }

        contentElement.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            contentElement.removeEventListener('scroll', handleScroll)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [isOpen, setScrollPosition])

    function getCursorClass() {
        if (isDragging) return 'cursor-move'
        if (!resizeDirection) return ''

        const cursorMap = {
            n: 'cursor-ns-resize',
            s: 'cursor-ns-resize',
            e: 'cursor-ew-resize',
            w: 'cursor-ew-resize',
            ne: 'cursor-nesw-resize',
            nw: 'cursor-nwse-resize',
            se: 'cursor-nwse-resize',
            sw: 'cursor-nesw-resize',
        }
        return cursorMap[resizeDirection] || ''
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dialogRef}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -20 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -20 }}
                    transition={{
                        duration: shouldReduceMotion ? 0 : 0.2,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className={cn(
                        '@container',
                        'fixed z-50',
                        'bg-background',
                        'rounded-xl',
                        'shadow-2xl border border-gray-300 dark:border-gray-600',
                        'flex flex-col',
                        'overflow-hidden',
                        getCursorClass(),
                        resizeDirection && 'select-none',
                        isMaximized && 'inset-4'
                    )}
                    style={isMaximized ? {} : {
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: `${size.width}px`,
                        height: `${size.height}px`
                    }}
                    role="dialog"
                    aria-modal="false"
                >
                {/* Resize Handles */}
                {!isMaximized && (
                    <>
                        <ResizeHandle direction="n" onMouseDown={handleMouseDownResize('n')} />
                        <ResizeHandle direction="s" onMouseDown={handleMouseDownResize('s')} />
                        <ResizeHandle direction="e" onMouseDown={handleMouseDownResize('e')} />
                        <ResizeHandle direction="w" onMouseDown={handleMouseDownResize('w')} />
                        <ResizeHandle direction="ne" onMouseDown={handleMouseDownResize('ne')} />
                        <ResizeHandle direction="nw" onMouseDown={handleMouseDownResize('nw')} />
                        <ResizeHandle direction="se" onMouseDown={handleMouseDownResize('se')} />
                        <ResizeHandle direction="sw" onMouseDown={handleMouseDownResize('sw')} />
                    </>
                )}

                {/* Header - Drag Handle */}
                <header
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    className={cn(
                        '@container flex items-center justify-between flex-shrink-0',
                        'px-4 py-3',
                        'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800',
                        'border-b border-gray-200 dark:border-gray-700',
                        !isMaximized && 'cursor-move touch-none',
                    )}
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <GripVertical className="w-4 h-4" />
                        <span className="text-xs font-medium
                        bg-linear-to-r hover:bg-linear-to-l
                         from-teal-600 via-blue-400 to-sky-400 dark:from-teal-400 dark:via-blue-400 dark:to-sky-400
                        bg-clip-text text-transparent hover:text-transparent
                        ">Algorithm Problems</span>
                    </div>

                    <div className="flex items-center gap-1">

                        {/* Easy Dismiss Toggle */}
                        <AgentTooltip
                            content={easyDismiss ? 'Light Dismiss Enabled' : 'Light Dismiss Disabled'}
                            side="bottom"
                            className="bg-blue-500/5 text-blue-500 fill-blue-500"
                        >
                            <button
                                type="button"
                                role="switch"
                                aria-checked={easyDismiss}
                                aria-label="Click outside to close"
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleEasyDismiss()
                                }}
                                className={cn(
                                    'relative inline-flex h-6 w-10  items-center rounded-full',
                                    'transition-all duration-300 ease-in-out',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                    'shadow-sm hover:shadow-md',
                                    easyDismiss
                                      ? `bg-gradient-to-r from-blue-500/20 via-sky-800/20 to-teal-500/20
                                         dark:from-blue-900/80 dark:via-sky-950/80 dark:to-blue-950/80 focus-visible:ring-cyan-900`
                                        : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 focus-visible:ring-gray-400/50'
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-block h-5 w-5 transform rounded-full transition-all duration-300 ease-in-out',
                                        'shadow-md',
                                        easyDismiss
                                            ? 'translate-x-4.5 bg-white dark:bg-gray-50'
                                            : 'translate-x-0.5 bg-white dark:bg-gray-200'
                                    )}
                                />
                            </button>
                        </AgentTooltip>

                        {/* Window Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleMaximized}
                                aria-label={isMaximized ? "Restore" : "Maximize"}
                                className={cn(
                                    'p-2 rounded-lg',
                                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                    'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    'transition-colors duration-150',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
                                )}
                            >
                                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={handleClose}
                                aria-label="Close dialog"
                                className={cn(
                                    'p-2 rounded-lg',
                                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                    'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    'transition-colors duration-150',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
                                )}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area - Scrollable */}
                <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden m-2">
                    {children}
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    )
}
