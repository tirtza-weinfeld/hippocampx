"use client"
import { useCalloutContext } from "./callout-context"
import { cn } from "@/lib/utils"
import { X, Maximize2, Minimize2, GripVertical } from 'lucide-react'
import { Activity } from "react"
import { useState, useRef, Children, isValidElement, cloneElement } from "react"
import { useDraggable } from "./hooks/use-draggable"
import { useResizable } from "./hooks/use-resizable"
import { useClickOutside } from "./hooks/use-click-outside"
import { ResizeHandle } from "./resize-handle"
import { Tooltip } from "./tooltip"

/**
 * Modern draggable and resizable dialog for problem card callouts.
 *
 * Features:
 * - Drag from header to reposition
 * - Resize from all edges and corners
 * - Maximize/minimize toggle
 * - Easy dismiss (click outside to close)
 * - Fully scrollable content area
 * - Shows file tabs and FAB buttons inside dialog
 */
export function ProblemCardDialog({ children }: {
    children: React.ReactNode;
}) {
    const { displayDialog, setDisplayDialog, files, activeFile, setActiveFile, fabButtons, activeTab } = useCalloutContext()

    const [isMaximized, setIsMaximized] = useState(false)
    const [easyDismiss, setEasyDismiss] = useState(false)

    const dialogRef = useRef<HTMLDivElement>(null)

    // Draggable logic - use lazy initializer to avoid hydration mismatch
    const { position, isDragging, handleMouseDown: handleDragStart, setPosition } = useDraggable(
        () => ({
            x: typeof window !== 'undefined' ? window.innerWidth - 450 : 0,
            y: 100
        }),
        !isMaximized
    )

    // Resizable logic
    const { size, resizeDirection, handleMouseDownResize } = useResizable(
        { width: 480, height: 600 },
        position,
        setPosition,
        { minWidth: 350, minHeight: 250 },
        !isMaximized
    )

    // Click outside to dismiss
    useClickOutside(dialogRef, () => setDisplayDialog(false), easyDismiss && displayDialog)

    function handleClose() {
        setDisplayDialog(false)
    }

    function handleMaximize() {
        setIsMaximized(!isMaximized)
    }

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

    function getTabLabel() {
        const tabLabels = {
            intuition: 'Intuition',
            timeComplexity: 'Time Complexity',
            keyVariables: 'Key Variables',
            keyExpressions: 'Key Expressions',
            definition: 'Definition',
            codeSnippet: 'Code Snippet',
        }
        return tabLabels[activeTab] || 'Explanation'
    }

    return (
        <Activity mode={displayDialog ? 'visible' : 'hidden'}>
            <div
                ref={dialogRef}
                className={cn(
                    'fixed z-50',
                    'bg-white dark:bg-gray-900',
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
                    className={cn(
                        '@container flex items-center justify-between flex-shrink-0',
                        'px-4 py-3',
                        'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800',
                        'border-b border-gray-200 dark:border-gray-700',
                        !isMaximized && 'cursor-move',
                    )}
                >
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <GripVertical className="w-4 h-4" />
                        <span className="hidden @md:block text-xs font-medium 
                        bg-linear-to-r hover:bg-linear-to-l
                         from-sky-500 via-blue-500 to-emerald-400 dark:from-sky-500 dark:via-blue-500 dark:to-emerald-500
                        bg-clip-text text-transparent hover:text-transparent
                        ">{getTabLabel()}</span>
                    </div>

                    {/* FAB Buttons */}
                    {/* {fabButtons && ( */}
                    <div className="flex items-center @md:gap-2 gap-1">
                        {Children.map(fabButtons, (child) => {
                            if (isValidElement(child)) {
                                return cloneElement(child as React.ReactElement)
                            }
                            return child
                        })}
                        {/* </div> */}
                        {/* )} */}
                    </div>

                    <div className=" flex items-center gap-1">
                        <div className="block @md:hidden h-4 w-px bg-gray-300 dark:bg-gray-600" />

                        {/* Easy Dismiss Toggle */}
                        <Tooltip content={`${easyDismiss ? 'Light Dismiss Enabled' : 'Light Dismiss Disabled'}`}>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={easyDismiss}
                                aria-label="Click outside to close"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setEasyDismiss(!easyDismiss)
                                }}
                                className={cn(
                                    'relative inline-flex @md:h-5 @md:w-9 h-4 w-7 m-1  items-center rounded-full transition-colors duration-200',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2',
                                    easyDismiss
                                        ? 'bg-linear-to-r from-sky-400 via-blue-600/80 to-emerald-400/10 dark:from-sky-600 dark:via-blue-600 dark:to-emerald-500'
                                        : 'bg-linear-to-r from-gray-300 via-gray-600 to-gray-300 dark:from-gray-300 dark:via-gray-600 dark:to-gray-300'
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-block @md:h-4 @md:w-4 h-3 w-3 transform rounded-full bg-white transition-transform duration-200',
                                        easyDismiss ? 'translate-x-5' : 'translate-x-0.5'
                                    )}
                                />
                            </button>
                        </Tooltip>

                        {/* <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" /> */}

                        {/* Window Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleMaximize}
                                aria-label={isMaximized ? "Restore" : "Maximize"}
                                className={cn(
                                    'p-1 @md:p-2 rounded-lg',
                                    'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                    'hover:bg-gray-200 dark:hover:bg-gray-700',
                                    'transition-colors duration-150',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40'
                                )}
                            >
                                {isMaximized ? <Minimize2 className="@md:w-4 @md:h-4 w-3 h-3" /> : <Maximize2 className="@md:w-4 @md:h-4 w-3 h-3" />}
                            </button>
                            {/* <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" /> */}

                            <button
                                onClick={handleClose}
                                aria-label="Close dialog"
                                className={cn(
                                    ' p-1 @md:p-2 rounded-lg',
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

                {/* File Tabs */}
                {
                    files.length > 1 && (
                        <div className="flex items-center gap-1 px-4 pt-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-shrink-0">
                            {files.map((file) => {
                                const isActive = activeFile === file
                                return (
                                    <button
                                        key={file}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveFile(file)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-b-none!  text-xs font-mono font-medium',
                                            'transition-colors duration-150',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                                            isActive
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
                                        )}
                                        type="button"
                                    >
                                        {file}
                                    </button>
                                )
                            })}
                        </div>
                    )
                }

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </div >
        </Activity >
    )
}
