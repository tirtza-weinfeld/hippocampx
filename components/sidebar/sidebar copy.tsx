"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown,  PanelLeft, Search } from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchDialog } from "@/components/sidebar/search-dialog"
import { InfinityFontSelector } from "@/components/sidebar/infinity-font-selector"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { NavigationItem, routes } from "@/lib/routes"

// Add this HippoLogo component before the Sidebar component
export function HippoLogo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Hippo body */}
      <div
        className="absolute rounded-[60%_60%_50%_50%/70%_70%_40%_40%]"
        style={{
          width: size,
          height: size * 1.1,
          background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)",
          top: 0,
          left: 0,
        }}
      />

      {/* Left ear */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)",
          top: size * 0.05,
          left: size * -0.05,
        }}
      />

      {/* Right ear */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          background: "linear-gradient(135deg, #4fd1c5 0%, #2b6cb0 100%)",
          top: size * 0.05,
          right: size * -0.05,
        }}
      />

      {/* Left eye */}
      <div
        className="absolute bg-white rounded-full border-2 border-gray-800/20"
        style={{
          width: size * 0.17,
          height: size * 0.17,
          top: size * 0.3,
          left: size * 0.2,
        }}
      />

      {/* Right eye */}
      <div
        className="absolute bg-white rounded-full border-2 border-gray-800/20"
        style={{
          width: size * 0.17,
          height: size * 0.17,
          top: size * 0.3,
          right: size * 0.2,
        }}
      />

      {/* Left pupil */}
      <div
        className="absolute bg-black rounded-full"
        style={{
          width: size * 0.06,
          height: size * 0.06,
          top: size * 0.35,
          left: size * 0.25,
        }}
      />

      {/* Right pupil */}
      <div
        className="absolute bg-black rounded-full"
        style={{
          width: size * 0.06,
          height: size * 0.06,
          top: size * 0.35,
          right: size * 0.25,
        }}
      />

      {/* Nose */}
      <div
        className="absolute bg-gray-800 rounded-[50%_50%_60%_60%/50%_50%_70%_70%]"
        style={{
          width: size * 0.25,
          height: size * 0.175,
          top: size * 0.55,
          left: size * 0.375,
        }}
      />

      {/* Left nostril */}
      <div
        className="absolute bg-black rounded-full"
        style={{
          width: size * 0.04,
          height: size * 0.05,
          top: size * 0.6,
          left: size * 0.425,
        }}
      />

      {/* Right nostril */}
      <div
        className="absolute bg-black rounded-full"
        style={{
          width: size * 0.04,
          height: size * 0.05,
          top: size * 0.6,
          right: size * 0.425,
        }}
      />

      {/* Mouth */}
      <div
        className="absolute"
        style={{
          width: size * 0.35,
          height: size * 0.2,
          top: size * 0.7,
          left: size * 0.325,
          borderBottom: "2px solid rgba(0,0,0,0.6)",
          borderLeft: "1.5px solid rgba(0,0,0,0.6)",
          borderRight: "1.5px solid rgba(0,0,0,0.6)",
          borderRadius: "0 0 50% 50%",
        }}
      />

      {/* X mark for the "X" in HippoCampX */}
      <div
        className="absolute"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: size * 0.75,
          left: size * 0.35,
          color: "rgba(0,0,0,0.6)",
          fontWeight: "bold",
          fontSize: size * 0.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        X
      </div>
    </div>
  )
}

// Navigation data
const navigationItems: NavigationItem[] = [
  {
    title: "HippoCampX",
    href: "/",
    icon: () => <HippoLogo size={20}  />,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    // children: [
    //   { title: "Overview", href: "/dashboard" },
    //   { title: "Analytics", href: "/dashboard/analytics" },
    //   { title: "Reports", href: "/dashboard/reports" },
    // ],
  },

  ...routes,
//   {
//     title: "Projects",
//     href: "/projects",
//     icon: Layers,
//     color: "text-violet-500",
//     bgColor: "bg-violet-500/10",
//     children: [
//       { title: "Overview", href: "/projects" },
//       { title: "Recent", href: "/projects/recent" },
//       { title: "Archived", href: "/projects/archived" },
//     ],
//   },
//   {
//     title: "Team",
//     href: "/team",
//     icon: Users,
//     color: "text-blue-500",
//     bgColor: "bg-blue-500/10",
//     children: [
//       { title: "Overview", href: "/team" },
//       { title: "Members", href: "/team/members" },
//       { title: "Roles", href: "/team/roles" },
//       { title: "Invites", href: "/team/invites" },
//     ],
//   },
//   {
//     title: "Performance",
//     href: "/performance",
//     icon: Zap,
//     color: "text-amber-500",
//     bgColor: "bg-amber-500/10",
//     children: [
//       { title: "Overview", href: "/performance" },
//       { title: "Metrics", href: "/performance/metrics" },
//       { title: "Optimization", href: "/performance/optimization" },
//     ],
//   },
//   {
//     title: "Settings",
//     href: "/settings",
//     icon: Settings,
//     color: "text-emerald-500",
//     bgColor: "bg-emerald-500/10",
//     children: [
//       { title: "Overview", href: "/settings" },
//       { title: "General", href: "/settings/general" },
//       { title: "Security", href: "/settings/security" },
//       { title: "Notifications", href: "/settings/notifications" },
//       { title: "Appearance", href: "/settings/appearance" },
//     ],
//   },
]

// Sidebar variants - fixed widths to prevent layout shift
const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300 ease-out",
  {
    variants: {
      state: {
        expanded: "w-64 transform-none",
        collapsed: "w-16 transform-none",
        mobile: "w-64 translate-x-0 shadow-xl",
        mobileHidden: "w-64 -translate-x-full",
      },
    },
    defaultVariants: {
      state: "expanded",
    },
  },
)

// Main content variants - fixed padding to prevent layout shift
const mainContentVariants = cva("min-h-screen transition-all duration-300 ease-out", {
  variants: {
    state: {
      expanded: "md:pl-64",
      collapsed: "md:pl-16",
      mobile: "pl-0",
    },
  },
  defaultVariants: {
    state: "expanded",
  },
})

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = React.useState(false)

  // Refs for navigation items
  const navRefs = React.useRef<Map<string, HTMLLIElement>>(new Map())
  const navContentRef = React.useRef<HTMLElement>(null)

  // State to track which parent items are expanded
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})

  // Track if sidebar is transitioning
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Check if mobile on mount and when window resizes
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Update expandedItems based on current pathname
  React.useEffect(() => {
    // Find which parent item contains the current path
    navigationItems.forEach((item) => {
      if (item.children) {
        // Check if current path is a child of this item
        const isChildActive = item.children.some(
          (child) => pathname === child.href || (pathname.startsWith(child.href + "/") && child.href !== "/"),
        )

        // Special case for dashboard
        const isDashboardActive = item.href === "/" && pathname.startsWith("/dashboard")

        // If this is the active parent, expand it
        if (isChildActive || isDashboardActive || pathname.startsWith(item.href + "/")) {
          setExpandedItems((prev) => ({
            ...prev,
            [item.href]: true,
          }))
        }
      }
    })
  }, [pathname])

  // Toggle sidebar state with animation
  const toggleSidebar = React.useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setIsExpanded((prev) => !prev)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }, [isTransitioning])

  // Toggle mobile sidebar
  const toggleMobileSidebar = React.useCallback(() => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setIsMobileOpen((prev) => !prev)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }, [isTransitioning])

  // Toggle search dialog
  const toggleSearch = React.useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  // Function to expand a parent item
  const expandParentItem = React.useCallback((parentHref: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [parentHref]: true,
    }))
  }, [])

  // Function to scroll to a navigation item
  const scrollToNavItem = React.useCallback(
    (href: string, parentHref?: string) => {
      // If there's a parent, expand it first
      if (parentHref) {
        expandParentItem(parentHref)
      }

      // Find the parent item for this href if not provided
      if (!parentHref) {
        for (const item of navigationItems) {
          if (item.children) {
            const childItem = item.children.find((child) => child.href === href)
            if (childItem) {
              expandParentItem(item.href)
              break
            }
          }
        }
      }

      // Use a small timeout to allow the DOM to update after expanding
      setTimeout(() => {
        const element = navRefs.current.get(href)
        if (element && navContentRef.current) {
          // Only open mobile sidebar if it's closed
          if (isMobile && !isMobileOpen) {
            setIsMobileOpen(true)
          }

          // Scroll the element into view with smooth behavior
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    },
    [expandParentItem, isMobile, isMobileOpen],
  )

  // Handle navigation click
  const handleNavClick = React.useCallback(
    (href: string, parentHref?: string, isParentWithChildren = false, shouldNavigate = true) => {
      setIsSearchOpen(false)

      // For mobile: Only close the sidebar if it's a child item or a parent without children
      if (isMobile) {
        // If it's a parent item with children, don't close the sidebar
        if (isParentWithChildren) {
          // Check if this is the exact active route
          const isExactActive = pathname === href

          // Only close if it's the exact active route
          if (isExactActive) {
            setIsMobileOpen(false)
          }

          // Toggle the expanded state for this item
          setExpandedItems((prev) => ({
            ...prev,
            [href]: !prev[href],
          }))
        } else {
          // For child items or parents without children, close the sidebar
          setIsMobileOpen(false)
        }
      }

      // Only navigate if shouldNavigate is true
      if (shouldNavigate) {
        // Navigate to the page
        router.push(href)
      }

      // If there's a parent, expand it
      if (parentHref) {
        setExpandedItems((prev) => ({
          ...prev,
          [parentHref]: true,
        }))
      }

      // For parent items with children, find if this is a parent
      const parentItem = navigationItems.find((item) => item.href === href && item.children)
      if (parentItem && shouldNavigate) {
        setExpandedItems((prev) => ({
          ...prev,
          [href]: true,
        }))
      }

      // Scroll to the nav item (with a delay to ensure navigation completes)
      if (shouldNavigate) {
        setTimeout(() => {
          scrollToNavItem(href, parentHref)
        }, 300)
      }
    },
    [isMobile, pathname, router, scrollToNavItem],
  )

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Toggle sidebar with Cmd+B
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        if (!isMobile) {
          toggleSidebar()
        } else {
          toggleMobileSidebar()
        }
      }

      // Toggle search with Cmd+K or /
      if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
        e.preventDefault()
        toggleSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar, toggleMobileSidebar, toggleSearch, isMobile])

  // Determine sidebar state
  const sidebarState = React.useMemo(() => {
    if (isMobile) {
      return isMobileOpen ? "mobile" : "mobileHidden"
    }
    return isExpanded ? "expanded" : "collapsed"
  }, [isExpanded, isMobileOpen, isMobile])

  // Determine main content state
  const mainContentState = React.useMemo(() => {
    if (isMobile) {
      return "mobile"
    }
    return isExpanded ? "expanded" : "collapsed"
  }, [isExpanded, isMobile])

  // Register a ref for a navigation item
  const registerNavRef = React.useCallback((href: string, el: HTMLLIElement | null) => {
    if (el) {
      navRefs.current.set(href, el)
    }
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && isMobile && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden animate-in fade-in duration-200"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(sidebarVariants({ state: sidebarState }))}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="h-8"></div>
          {/* {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileSidebar}
              aria-label="Close sidebar"
            >
              <PanelLeft className="h-5 w-5 rotate-180 transition-transform duration-200" />
            </Button>
          )} */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin" ref={navContentRef}>
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.title}
                item={item}
                isExpanded={isExpanded || isMobile}
                pathname={pathname}
                onClick={handleNavClick}
                isOpen={expandedItems[item.href] || false}
                onOpenChange={(open) => {
                  setExpandedItems((prev) => ({
                    ...prev,
                    [item.href]: open,
                  }))
                }}
                registerRef={registerNavRef}
                isMobile={isMobile}
              />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className={cn("flex items-center", isExpanded || isMobile ? "justify-between" : "flex-col gap-4")}>
            <InfinityFontSelector />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                    className="h-9 w-9 rounded-full transition-colors hover:bg-accent"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isExpanded || isMobile ? "top" : "right"}>
                  <div className="flex items-center gap-2">
                    <span>Search</span>
                    <kbd className="rounded border bg-muted px-1 text-xs">⌘K</kbd>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ThemeToggle side={isExpanded || isMobile ? "top" : "right"} />
          </div>
        </div>
      </aside>

      {/* Toggle button (fixed) - consistent position */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
              className="fixed left-4 top-4 z-30 h-10 w-10 rounded-lg border bg-background shadow-md hover:shadow-lg transition-shadow"
              style={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              aria-label={
                isMobile
                  ? isMobileOpen
                    ? "Close sidebar"
                    : "Open sidebar"
                  : isExpanded
                    ? "Collapse sidebar"
                    : "Expand sidebar"
              }
            >
              <PanelLeft
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  (!isExpanded && !isMobile) || (isMobile && !isMobileOpen) ? "" : "rotate-180",
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isMobile
              ? isMobileOpen
                ? "Close sidebar"
                : "Open sidebar"
              : isExpanded
                ? "Collapse sidebar"
                : "Expand sidebar"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main content */}
      <main className={cn(mainContentVariants({ state: mainContentState }))}>{children}</main>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigationItems={navigationItems}
        onNavigate={handleNavClick}
      />
    </>
  )
}

// Navigation Item Component
interface NavItemProps {
  item: {
    title: string
    href: string
    icon: React.ElementType
    color: string
    bgColor: string
    children?: { title: string; href: string }[]
  }
  isExpanded: boolean
  pathname: string
  onClick: (href: string, parentHref?: string, isParentWithChildren?: boolean, shouldNavigate?: boolean) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  registerRef: (href: string, el: HTMLLIElement | null) => void
  isMobile: boolean
}

function NavItem({ item, isExpanded, pathname, onClick, isOpen, onOpenChange, registerRef }: NavItemProps) {
  const itemRef = React.useRef<HTMLLIElement>(null)

  // Register the ref when the component mounts
  React.useEffect(() => {
    if (itemRef.current) {
      registerRef(item.href, itemRef.current)
    }
    return () => {
      registerRef(item.href, null)
    }
  }, [item.href, registerRef])

  // Check if current path is this item or any of its children
  const isActive = React.useMemo(() => {
    // Exact match for the item itself
    if (pathname === item.href) return true

    // Check if any child route is active
    if (item.children) {
      // Special case for dashboard - check if path starts with /dashboard
      if (item.href === "/" && pathname.startsWith("/dashboard")) return true

      // For other items, check if path starts with the item's href
      if (pathname.startsWith(item.href + "/")) return true

      // Check each child explicitly
      return item.children.some((child) => pathname === child.href)
    }

    return false
  }, [pathname, item])

  const Icon = item.icon

  // For collapsed sidebar with children, use popover
  if (!isExpanded && item.children) {
    return (
      <li ref={itemRef} className="relative">
        {/* Active indicator bar */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
            style={{ zIndex: 10 }}
          />
        )}
        <TooltipProvider>
          <Popover open={isOpen} onOpenChange={onOpenChange}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 justify-center rounded-lg transition-all",
                      isActive && "bg-primary/10 text-primary",
                      !isActive && item.bgColor,
                      isActive && "shadow-[0_0_10px_rgba(var(--primary),0.3)]",
                    )}
                    aria-label={item.title}
                    onClick={(e) => {
                      // Only toggle the popover, don't navigate
                      e.stopPropagation()
                      onOpenChange(!isOpen)
                    }}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-primary" : item.color)} />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
            <PopoverContent
              side="right"
              className="w-48 p-2"
              onInteractOutside={() => onOpenChange(false)}
              align="start"
              alignOffset={-5}
              sideOffset={10}
            >
              <div className="space-y-1 animate-in fade-in slide-in-from-left-2 duration-200">
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                  <Icon className={cn("h-4 w-4", item.color)} />
                  <span>{item.title}</span>
                </div>
                <div className="h-px bg-border" />
                {item.children.map((child) => (
                  <Button
                    key={child.title}
                    variant="ghost"
                    className={cn("w-full justify-start px-2 py-1.5 text-sm", pathname === child.href && "bg-accent")}
                    onClick={() => onClick(child.href, item.href)}
                    data-href={child.href}
                  >
                    {child.title}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </li>
    )
  }

  // For collapsed sidebar without children
  if (!isExpanded && !item.children) {
    return (
      <li ref={itemRef} className="relative">
        {/* Active indicator bar */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
            style={{ zIndex: 10 }}
          />
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 justify-center rounded-lg transition-all",
                  isActive && "bg-primary/10 text-primary",
                  !isActive && item.bgColor,
                  isActive && "shadow-[0_0_10px_rgba(var(--primary),0.3)]",
                )}
                onClick={() => onClick(item.href)}
                aria-label={item.title}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : item.color)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    )
  }

  // For expanded sidebar
  return (
    <li ref={itemRef}>
      <div className="space-y-1">
        {/* Parent item - only toggles dropdown if it has children */}
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-2 rounded-lg text-sm font-medium",
            isActive && "bg-accent",
            !isExpanded && "px-0 justify-center",
          )}
          onClick={(e) => {
            // If it has children, only toggle the dropdown
            if (item.children) {
              e.preventDefault()
              onOpenChange(!isOpen)
            } else {
              // If no children, navigate to the item's href
              onClick(item.href)
            }
          }}
        >
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", item.bgColor)}>
            <Icon className={cn("h-5 w-5", item.color)} />
          </div>
          {isExpanded && (
            <span className="animate-in fade-in slide-in-from-left-2 duration-200 truncate">{item.title}</span>
          )}
          {isExpanded && item.children && (
            <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          )}
        </Button>

        {/* Submenu for expanded state */}
        {isExpanded && isOpen && item.children && (
          <div className="ml-10 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children.map((child) => (
              <Button
                key={child.title}
                variant="ghost"
                className={cn("w-full justify-start px-2 py-1.5 text-sm", pathname === child.href && "bg-accent")}
                onClick={() => onClick(child.href, item.href)}
                data-href={child.href}
              >
                <Icon className={cn("h-5 w-5", item.color)} />
                {child.title}
              </Button>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

NavItem.displayName = "NavItem"
