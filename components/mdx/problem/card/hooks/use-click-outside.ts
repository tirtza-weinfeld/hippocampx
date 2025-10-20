import { useEffect, RefObject } from "react"

/**
 * Custom hook for detecting clicks outside a referenced element.
 * Useful for dismissing modals, dropdowns, etc.
 */
export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    onClickOutside: () => void,
    enabled: boolean = true
) {
    useEffect(() => {
        if (!enabled) return

        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClickOutside()
            }
        }

        // Add delay to prevent immediate dismissal on open
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)

        return () => {
            clearTimeout(timeoutId)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [enabled, ref, onClickOutside])
}
