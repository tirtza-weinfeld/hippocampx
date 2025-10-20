import { useState, useEffect, useRef } from "react"

type Position = { x: number; y: number }

/**
 * Custom hook for draggable functionality.
 * Handles mouse drag events to update position.
 */
export function useDraggable(initialPosition: Position | (() => Position), enabled: boolean = true) {
    const [position, setPosition] = useState(initialPosition)
    const [isDragging, setIsDragging] = useState(false)
    const dragStartRef = useRef({ x: 0, y: 0 })

    function handleMouseDown(e: React.MouseEvent) {
        if (!enabled) return

        setIsDragging(true)
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    useEffect(() => {
        if (!isDragging) return

        function handleMouseMove(e: MouseEvent) {
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y
            })
        }

        function handleMouseUp() {
            setIsDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return {
        position,
        isDragging,
        handleMouseDown,
        setPosition
    }
}
