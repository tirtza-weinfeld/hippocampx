import { useEffect, RefObject } from "react"

/**
 * Custom hook for detecting clicks outside a referenced element.
 * Useful for dismissing modals, dropdowns, etc.
 *
 * Ignores clicks on portal elements (dropdowns, popovers, tooltips, etc.)
 * that are rendered outside the dialog but belong to it.
 */
export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    onClickOutside: () => void,
    enabled: boolean = true,
    excludeRefs: RefObject<HTMLElement | null>[] = []
) {
    useEffect(() => {
        if (!enabled) return

        // Track if this is the first render to prevent immediate dismissal
        let isInitialRender = true
        const initialTimeoutId = setTimeout(() => {
            isInitialRender = false
        }, 50)

        function handleClickOutside(e: MouseEvent) {
            // Skip if initial render period
            if (isInitialRender) return

            const target = e.target as Node

            // Check if click is on an excluded element
            const isExcluded = excludeRefs.some(excludeRef =>
                excludeRef.current && excludeRef.current.contains(target)
            )

            if (isExcluded) return

            // Check if click is outside the dialog
            if (ref.current && !ref.current.contains(target)) {
                // Check if click is on a portal element (dropdown, popover, tooltip, etc.)
                // These are typically rendered at document.body level with specific data attributes or roles
                const element = target as Element
                const isPortalClick = element.closest?.(
                    '[role="dialog"], [role="menu"], [role="listbox"], [role="tooltip"], ' +
                    '[data-radix-popper-content-wrapper], [data-radix-portal], ' +
                    '[data-headlessui-portal], .popover, .dropdown-menu, .tooltip'
                )

                // Check if click is on our custom dropdown portal
                const isDropdownPortal = element.closest?.('[data-dropdown-portal]')

                // Only trigger onClickOutside if it's not a portal click
                if (!isPortalClick && !isDropdownPortal) {
                    onClickOutside()
                }
            }
        }

        // Add listener immediately but protect with isInitialRender flag
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            clearTimeout(initialTimeoutId)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [enabled, ref, onClickOutside, excludeRefs])
}
