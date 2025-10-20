import { useState, useEffect, useRef } from "react"

type Size = { width: number; height: number }
type Position = { x: number; y: number }
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

type ResizeConstraints = {
    minWidth: number
    minHeight: number
}

/**
 * Custom hook for resizable functionality from all edges and corners.
 * Handles mouse resize events to update size and position.
 */
export function useResizable(
    initialSize: Size,
    position: Position,
    onPositionChange: (position: Position) => void,
    constraints: ResizeConstraints = { minWidth: 300, minHeight: 200 },
    enabled: boolean = true
) {
    const [size, setSize] = useState(initialSize)
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
        return (e: React.MouseEvent) => {
            if (!enabled) return

            e.stopPropagation()
            setResizeDirection(direction)
            resizeStartRef.current = {
                width: size.width,
                height: size.height,
                x: position.x,
                y: position.y,
                mouseX: e.clientX,
                mouseY: e.clientY
            }
        }
    }

    useEffect(() => {
        if (!resizeDirection) return

        const direction = resizeDirection

        function handleMouseMove(e: MouseEvent) {
            const deltaX = e.clientX - resizeStartRef.current.mouseX
            const deltaY = e.clientY - resizeStartRef.current.mouseY

            let newWidth = resizeStartRef.current.width
            let newHeight = resizeStartRef.current.height
            let newX = resizeStartRef.current.x
            let newY = resizeStartRef.current.y

            // Handle horizontal resizing
            if (direction.includes('e')) {
                newWidth = Math.max(constraints.minWidth, resizeStartRef.current.width + deltaX)
            } else if (direction.includes('w')) {
                const potentialWidth = resizeStartRef.current.width - deltaX
                if (potentialWidth >= constraints.minWidth) {
                    newWidth = potentialWidth
                    newX = resizeStartRef.current.x + deltaX
                }
            }

            // Handle vertical resizing
            if (direction.includes('s')) {
                newHeight = Math.max(constraints.minHeight, resizeStartRef.current.height + deltaY)
            } else if (direction.includes('n')) {
                const potentialHeight = resizeStartRef.current.height - deltaY
                if (potentialHeight >= constraints.minHeight) {
                    newHeight = potentialHeight
                    newY = resizeStartRef.current.y + deltaY
                }
            }

            setSize({ width: newWidth, height: newHeight })
            if (newX !== position.x || newY !== position.y) {
                onPositionChange({ x: newX, y: newY })
            }
        }

        function handleMouseUp() {
            setResizeDirection(null)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [resizeDirection, position.x, position.y, size.width, size.height, constraints, onPositionChange])

    return {
        size,
        resizeDirection,
        handleMouseDownResize,
        setSize
    }
}
