import { useState, useEffect, useRef } from "react"
import { useAgentDialogStore } from "../store/agent-dialog-store"

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

type ResizeConstraints = {
    minWidth: number
    minHeight: number
}

/**
 * Custom hook for resizable functionality from all edges and corners.
 * Integrates with Zustand store for persistent size and position state.
 */
export function useResizable(
    constraints: ResizeConstraints = { minWidth: 300, minHeight: 200 },
    enabled: boolean = true
) {
    const size = useAgentDialogStore((state) => state.size)
    const setSize = useAgentDialogStore((state) => state.setSize)
    const position = useAgentDialogStore((state) => state.position)
    const setPosition = useAgentDialogStore((state) => state.setPosition)
    const setSizeAndPosition = useAgentDialogStore((state) => state.setSizeAndPosition)

    const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)

    const resizeStartRef = useRef({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        mouseX: 0,
        mouseY: 0
    })

    function handleMouseDownResize(direction: ResizeDirection) {
        return (e: React.MouseEvent | React.TouchEvent) => {
            if (!enabled) return

            e.stopPropagation()

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

            setResizeDirection(direction)
            resizeStartRef.current = {
                width: size.width,
                height: size.height,
                x: position.x,
                y: position.y,
                mouseX: clientX,
                mouseY: clientY
            }
        }
    }

    useEffect(() => {
        if (!resizeDirection) return

        const direction = resizeDirection
        const constraintsRef = { ...constraints }

        function handleMove(e: MouseEvent | TouchEvent) {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

            const deltaX = clientX - resizeStartRef.current.mouseX
            const deltaY = clientY - resizeStartRef.current.mouseY

            let newWidth = resizeStartRef.current.width
            let newHeight = resizeStartRef.current.height
            let newX = resizeStartRef.current.x
            let newY = resizeStartRef.current.y

            // Handle horizontal resizing
            if (direction.includes('e')) {
                newWidth = Math.max(constraintsRef.minWidth, resizeStartRef.current.width + deltaX)
            } else if (direction.includes('w')) {
                const potentialWidth = resizeStartRef.current.width - deltaX
                if (potentialWidth >= constraintsRef.minWidth) {
                    newWidth = potentialWidth
                    newX = resizeStartRef.current.x + deltaX
                } else {
                    // At minimum width, don't move position
                    newWidth = constraintsRef.minWidth
                    newX = resizeStartRef.current.x + (resizeStartRef.current.width - constraintsRef.minWidth)
                }
            }

            // Handle vertical resizing
            if (direction.includes('s')) {
                newHeight = Math.max(constraintsRef.minHeight, resizeStartRef.current.height + deltaY)
            } else if (direction.includes('n')) {
                const potentialHeight = resizeStartRef.current.height - deltaY
                if (potentialHeight >= constraintsRef.minHeight) {
                    newHeight = potentialHeight
                    newY = resizeStartRef.current.y + deltaY
                } else {
                    // At minimum height, don't move position
                    newHeight = constraintsRef.minHeight
                    newY = resizeStartRef.current.y + (resizeStartRef.current.height - constraintsRef.minHeight)
                }
            }

            // Batch updates using Zustand's atomic update to avoid visual jumps
            const positionChanged = newX !== resizeStartRef.current.x || newY !== resizeStartRef.current.y

            if (positionChanged) {
                // Update both size and position atomically
                setSizeAndPosition({ width: newWidth, height: newHeight }, { x: newX, y: newY })
            } else {
                setSize({ width: newWidth, height: newHeight })
            }
        }

        function handleEnd() {
            setResizeDirection(null)
        }

        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', handleEnd)
        document.addEventListener('touchmove', handleMove, { passive: false })
        document.addEventListener('touchend', handleEnd)

        return () => {
            document.removeEventListener('mousemove', handleMove)
            document.removeEventListener('mouseup', handleEnd)
            document.removeEventListener('touchmove', handleMove)
            document.removeEventListener('touchend', handleEnd)
        }
    }, [resizeDirection, constraints, setSize, setPosition, setSizeAndPosition])

    return {
        size,
        resizeDirection,
        handleMouseDownResize
    }
}
