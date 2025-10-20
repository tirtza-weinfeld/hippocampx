import { cn } from "@/lib/utils"

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type ResizeHandleProps = {
    direction: ResizeDirection
    onMouseDown: (e: React.MouseEvent) => void
}

const directionStyles: Record<ResizeDirection, string> = {
    n: 'top-0 left-0 right-0 h-1 cursor-ns-resize',
    s: 'bottom-0 left-0 right-0 h-1 cursor-ns-resize',
    e: 'top-0 right-0 bottom-0 w-1 cursor-ew-resize',
    w: 'top-0 left-0 bottom-0 w-1 cursor-ew-resize',
    ne: 'top-0 right-0 w-3 h-3 cursor-nesw-resize rounded-tr-xl',
    nw: 'top-0 left-0 w-3 h-3 cursor-nwse-resize rounded-tl-xl',
    se: 'bottom-0 right-0 w-3 h-3 cursor-nwse-resize rounded-br-xl',
    sw: 'bottom-0 left-0 w-3 h-3 cursor-nesw-resize rounded-bl-xl',
}

/**
 * Resize handle component for edges and corners.
 * Displays an invisible hit area that shows visual feedback on hover.
 */
export function ResizeHandle({ direction, onMouseDown }: ResizeHandleProps) {
    return (
        <div
            onMouseDown={onMouseDown}
            className={cn(
                'absolute hover:bg-blue-500/20 transition-colors duration-150',
                directionStyles[direction]
            )}
        />
    )
}
