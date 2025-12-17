"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import type { ExpandedItems } from "../types"
import { navigationItems, SIDEBAR_COOKIE_NAME, SIDEBAR_COOKIE_MAX_AGE } from "../constants"

export function useSidebarState(defaultOpen: boolean, isMobile: boolean) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({})
  const pathname = usePathname()
  const navRefs = useRef<Map<string, HTMLElement>>(new Map())

  const setExpandedWithCookie = (value: boolean | ((value: boolean) => boolean)) => {
    const expandedState = typeof value === "function" ? value(isExpanded) : value
    setIsExpanded(expandedState)
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${expandedState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  }

  useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => pathname === child.href || (pathname.startsWith(child.href + "/") && child.href !== "/"),
        )

        const isDashboardActive = item.href === "/" && pathname.startsWith("/dashboard")

        if (isChildActive || isDashboardActive || pathname.startsWith(item.href + "/")) {
          setExpandedItems((prev) => ({
            ...prev,
            [item.href]: true,
          }))
        }
      }
    })
  }, [pathname])

  const toggleSidebar = () => {
    setExpandedWithCookie((prev) => !prev)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev)
  }

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev)
  }

  function handleNavigation(href: string, parentHref?: string) {
    setIsSearchOpen(false)

    if (isMobile) {
      setIsMobileOpen(false)
    }

    if (parentHref) {
      setExpandedItems((prev) => ({
        ...prev,
        [parentHref]: true,
      }))
    } else {
      const parentItem = navigationItems.find((item) => item.href === href && item.children)
      if (parentItem) {
        setExpandedItems((prev) => ({
          ...prev,
          [href]: true,
        }))
      }
    }
  }

  function registerNavRef(href: string, el: HTMLElement | null) {
    if (el) {
      navRefs.current.set(href, el)
    }
  }

  return {
    state: {
      isExpanded,
      isMobileOpen,
      isSearchOpen,
      expandedItems,
      pathname,
    },
    actions: {
      toggleSidebar,
      toggleMobileSidebar,
      toggleSearch,
      setIsSearchOpen,
      setIsMobileOpen,
      setExpandedItems,
      handleNavigation,
    },
    refs: {
      navRefs,
      registerNavRef,
    },
  }
}
