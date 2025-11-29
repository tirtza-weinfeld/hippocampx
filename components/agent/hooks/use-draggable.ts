import { useState, useEffect, useRef } from "react"
import { useAgentDialogStore } from "../store/agent-dialog-store"

/**
 * Custom hook for draggable functionality.
 * Integrates with Zustand store for persistent position state.
 */
export function useDraggable(enabled: boolean = true) {
    const position = useAgentDialogStore((state) => state.position)
    const setPosition = useAgentDialogStore((state) => state.setPosition)

    const [isDragging, setIsDragging] = useState(false)
    const dragStartRef = useRef({ x: 0, y: 0 })

    function handleMouseDown(e: React.MouseEvent | React.TouchEvent) {
        if (!enabled) return

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

        setIsDragging(true)
        dragStartRef.current = {
            x: clientX - position.x,
            y: clientY - position.y
        }
    }

    useEffect(() => {
        if (!isDragging) return

        function handleMove(e: MouseEvent | TouchEvent) {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

            setPosition({
                x: clientX - dragStartRef.current.x,
                y: clientY - dragStartRef.current.y
            })
        }

        function handleEnd() {
            setIsDragging(false)
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
    }, [isDragging, setPosition])

    return {
        position,
        isDragging,
        handleMouseDown
    }
}
