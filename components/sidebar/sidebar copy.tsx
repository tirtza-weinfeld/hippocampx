"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown,  PanelLeft, Search} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchDialog } from "@/components/sidebar/search-dialog"
import { InfinityFontSelector } from "@/components/sidebar/infinity-font-selector"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { routes, NavigationItem } from "@/lib/routes"
import { SparklesToggle } from "@/components/calculus/ui/sparkles-toggle"

// HippoLogo component
export function HippoLogo({ size = 40, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <div
      className={cn("relative block", animate && "animate-float")}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Hippo body */}
      <div
        className="absolute rounded-[60%_60%_50%_50%/70%_70%_40%_40%] bg-gradient-to-br from-teal-400 to-blue-600"
        style={{
          width: size,
          height: size * 1.1,
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      {/* Left ear */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-teal-400 to-blue-600"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          top: size * 0.05,
          left: size * -0.05,
          zIndex: 2,
        }}
      />

      {/* Right ear */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-teal-400 to-blue-600"
        style={{
          width: size * 0.2,
          height: size * 0.2,
          top: size * 0.05,
          right: size * -0.05,
          zIndex: 2,
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
          zIndex: 3,
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
          zIndex: 3,
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
          zIndex: 4,
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
          zIndex: 4,
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
          zIndex: 5,
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
          zIndex: 6,
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
          zIndex: 6,
        }}
      />

      {/* Mouth */}
      <div
        className="absolute border-b-2 border-l-[1.5px] border-r-[1.5px] border-black/60 rounded-b-[50%]"
        style={{
          width: size * 0.35,
          height: size * 0.2,
          top: size * 0.7,
          left: size * 0.325,
          zIndex: 5,
        }}
      />

      {/* X mark for the "X" in HippoCampX */}
      <div
        className="absolute flex items-center justify-center font-bold text-black/60"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: size * 0.75,
          left: size * 0.35,
          fontSize: size * 0.2,
          zIndex: 7,
        }}
      >
        X
      </div>
    </div>
  )
}
const navigationItems = routes
// Navigation data
// const navigationItems = [
//   {
//     title: "HippoCampX",
//     href: "/dashboard",
//     icon: (props) => <HippoLogo size={20} {...props} />,
//     color: "text-teal-500",
//     bgColor: "bg-teal-500/10",
//     children: [
//       { title: "Overview", href: "/dashboard" },
//       { title: "Analytics", href: "/dashboard/analytics" },
//       { title: "Reports", href: "/dashboard/reports" },
//     ],
//   },
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
// ]

export function Sidebar({ children }: { children: React.ReactNode }) {
  // State for sidebar
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

  // Add body scroll locking for mobile using Tailwind classes
  React.useEffect(() => {
    if (isMobile && isMobileOpen) {
      document.body.classList.add("overflow-hidden")
      return () => {
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [isMobile, isMobileOpen])

  // Add scroll detection for mobile sidebar
  const navScrollRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!isMobile || !navScrollRef.current) return

    const handleScroll = () => {
      const nav = navScrollRef.current
      if (!nav) return

      if (nav.scrollTop > 10) {
        nav.classList.add("scrolled")
      } else {
        nav.classList.remove("scrolled")
      }
    }

    const nav = navScrollRef.current
    nav.addEventListener("scroll", handleScroll)

    return () => {
      nav?.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile, isMobileOpen])

  // Update expandedItems based on current pathname
  React.useEffect(() => {
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

  // Toggle sidebar state
  const toggleSidebar = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Toggle mobile sidebar
  const toggleMobileSidebar = React.useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

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
      if (parentHref) {
        expandParentItem(parentHref)
      }

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

      setTimeout(() => {
        const element = navRefs.current.get(href)
        if (element && navContentRef.current) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 300)
    },
    [expandParentItem],
  )

  // Handle navigation click
  const handleNavClick = React.useCallback(
    (href: string, parentHref?: string, isParentWithChildren = false, shouldNavigate = true) => {
      setIsSearchOpen(false)

      if (isMobile) {
        if (isParentWithChildren) {
          setExpandedItems((prev) => ({
            ...prev,
            [href]: !prev[href],
          }))
        } else {
          setIsMobileOpen(false)
        }
      }

      if (shouldNavigate) {
        router.push(href)
      }

      if (parentHref) {
        setExpandedItems((prev) => ({
          ...prev,
          [parentHref]: true,
        }))

        setTimeout(() => scrollToNavItem(href, parentHref), 100)
      } else {
        const parentItem = navigationItems.find((item) => item.href === href && item.children)
        if (parentItem && shouldNavigate) {
          setExpandedItems((prev) => ({
            ...prev,
            [href]: true,
          }))
        }

        setTimeout(() => scrollToNavItem(href), 100)
      }
    },
    [isMobile, router, scrollToNavItem, setExpandedItems],
  )

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        if (!isMobile) {
          toggleSidebar()
        } else {
          toggleMobileSidebar()
        }
      }

      if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
        e.preventDefault()
        toggleSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar, toggleMobileSidebar, toggleSearch, isMobile])

  // Register a ref for a navigation item
  const registerNavRef = React.useCallback((href: string, el: HTMLLIElement | null) => {
    if (el) {
      navRefs.current.set(href, el)
    }
  }, [])

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <div className="@container">
        {/* Unified Sidebar Toggle Button - Fixed position for all modes */}
        <button
          className="fixed top-4 left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full
           bg-background/90 shadow-lg backdrop-blur-sm border border-border transition-all duration-300 
           hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary hover:bg-accent/50"
          onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
          aria-label={
            isMobile
              ? isMobileOpen
                ? "Close sidebar"
                : "Open sidebar"
              : isExpanded
                ? "Collapse sidebar"
                : "Expand sidebar"
          }
          aria-expanded={isMobile ? isMobileOpen : isExpanded}
          aria-controls={isMobile ? "mobile-sidebar" : "desktop-sidebar"}
        >
          <PanelLeft
            className={cn(
              "h-5 w-5 text-primary transition-transform duration-300",
              (isMobile ? isMobileOpen : isExpanded) ? "rotate-180" : "rotate-0",
            )}
          />
        </button>

        {/* Mobile Overlay - Reduced blur and adjusted opacity */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              onClick={toggleMobileSidebar}
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar - Solid background and improved z-index */}
        <motion.aside
          id="mobile-sidebar"
          className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] bg-background border-r shadow-xl rounded-2xl"
          initial={{ x: "-100%" }}
          animate={{ x: isMobileOpen ? 0 : "-100%" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 1,
          }}
          aria-label="Main navigation"
          role="navigation"
        >
          <div className="flex flex-col h-full">
            {/* Fixed Header - Improved styling */}
            <div className="flex-shrink-0 flex h-16 items-center px-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 relative">
                  {/* <HippoLogo size={32} animate={true} /> */}
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-500
                 bg-clip-text text-transparent mt-3 ml-5">
                  HippoCampX
                </span>
              </div>
            </div>

            {/* Scrollable Navigation - Improved scrolling behavior */}
            <nav
              className="flex-1 overflow-y-auto overscroll-contain py-4 px-3"
              ref={(el) => {
                navContentRef.current = el
                navScrollRef.current = el
              }}
              aria-label="Sidebar navigation"
            >
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.title}
                    item={item}
                    isExpanded={true}
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
                    isMobile={true}
                  />
                ))}
              </ul>
            </nav>

            {/* Fixed Footer - Improved styling */}
            <div className="flex-shrink-0 border-t p-4">
              <div className={cn("flex items-center", isExpanded ? "justify-between" : "flex-col gap-3")}>
                <InfinityFontSelector />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="h-10 w-10 rounded-full transition-all duration-200 hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-primary" />
                </Button>
                <ThemeToggle side="top" />
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Content Container */}
        <main className="min-h-screen w-full bg-background">{children}</main>

        {/* Search Dialog */}
        <SearchDialog
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          navigationItems={navigationItems}
          onNavigate={handleNavClick}
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          setIsSearchOpen={setIsSearchOpen}
        />
      </div>
    )
  }

  // DESKTOP LAYOUT
  return (
    <div className="@container/main flex h-screen ">
      {/* Desktop Sidebar */}
      <motion.aside
        id="desktop-sidebar"
        className="fixed inset-y-0 left-1  top-1  bottom-1 z-20 bg-background border rounded-2xl"
        initial={{ width: isExpanded ? "16rem" : "5rem" }}
        animate={{ width: isExpanded ? "16rem" : "5rem" }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 1,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 ml-1">
            <div className="flex items-center">
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2"
                  >
                    {/* <HippoLogo size={28} animate={true} /> */}
                    <span className="ml-17 mt-5">HippoCampX</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* <HippoLogo size={28} animate={true} /> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4" ref={navContentRef}>
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isExpanded={isExpanded}
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
                  isMobile={false}
                />
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t">
            <div className={cn("flex items-center", isExpanded ? "justify-between" : "flex-col gap-3")}>
              <InfinityFontSelector />
              <div className="flex items-center gap-2">
                <SparklesToggle side={isExpanded ? "top" : "right"} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="h-10 w-10 rounded-full transition-all duration-200 hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-primary" />
                </Button>
                <ThemeToggle side="top" />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Unified Sidebar Toggle Button - Fixed position for all modes */}
      <button
        className="fixed top-5 left-6 z-[60] flex h-10 w-10 items-center
         justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm border border-border transition-colors 
         duration-300 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary hover:bg-accent/50"
        onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
        aria-label={
          isMobile
            ? isMobileOpen
              ? "Close sidebar"
              : "Open sidebar"
            : isExpanded
              ? "Collapse sidebar"
              : "Expand sidebar"
        }
        aria-expanded={isMobile ? isMobileOpen : isExpanded}
        aria-controls={isMobile ? "mobile-sidebar" : "desktop-sidebar"}
      >
        <PanelLeft
          className={cn(
            "h-5 w-5 text-primary transition-transform duration-300",
            (isMobile ? isMobileOpen : isExpanded) ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {/* Main content */}
      <motion.main
        className="flex-1 overflow-auto"
        initial={{ marginLeft: isExpanded ? "16rem" : "5rem" }}
        animate={{ marginLeft: isExpanded ? "16rem" : "5rem" }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 1,
        }}
      >
        <div className="@container/content px-6 ">{children}</div>
      </motion.main>

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigationItems={navigationItems}
        onNavigate={handleNavClick}
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </div>
  )
}

interface NavItemProps {
  item: NavigationItem
  isExpanded: boolean
  pathname: string
  onClick: (href: string, parentHref?: string, isParentWithChildren?: boolean, shouldNavigate?: boolean) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  registerRef: (href: string, el: HTMLLIElement | null) => void
  isMobile: boolean
}

function NavItem({ item, isExpanded, pathname, onClick, isOpen, onOpenChange, registerRef, isMobile }: NavItemProps) {
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

  // For mobile items with children
  if (isMobile && item.children) {
    return (
      <li ref={itemRef} className="relative">
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/50",
          )}
          onClick={() => onOpenChange(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`submenu-${item.href.replace(/\//g, "-")}`}
        >
          <div className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", item.bgColor)}>
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : item.color)} />
            </div>
            <span>{item.title}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              id={`submenu-${item.href.replace(/\//g, "-")}`}
              className="mt-1 ml-10 space-y-1"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: { duration: 0.2, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                  },
                  opacity: { duration: 0.2 },
                },
              }}
              style={{ overflow: "hidden" }}
            >
              {item.children.map((child, index) => (
                <motion.li
                  key={child.title}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.05 + 0.1,
                    },
                  }}
                >
                  <a
                    href={child.href}
                    className={cn(
                      "flex rounded-lg px-3 py-2 text-sm transition-all",
                      pathname === child.href
                        ? "bg-primary/15 text-primary font-medium"
                        : "hover:bg-muted/50 hover:translate-x-1",
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      onClick(child.href, item.href)
                    }}
                  >
                    {child.title}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    )
  }

  // For mobile items without children
  if (isMobile && !item.children) {
    return (
      <li ref={itemRef} className="relative">
        <a
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive ? "bg-primary/15 text-primary" : "hover:bg-muted/50",
          )}
          onClick={(e) => {
            e.preventDefault()
            onClick(item.href)
          }}
        >
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", item.bgColor)}>
            <Icon className={cn("h-5 w-5", isActive ? "text-primary" : item.color)} />
          </div>
          <span>{item.title}</span>
        </a>
      </li>
    )
  }

  // For collapsed sidebar with children, use popover
  if (!isExpanded && item.children) {
    return (
      <li ref={itemRef} className="relative group">
        {/* Active indicator */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "70%",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
              },
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-gradient-to-b from-teal-500  to-black-500   rounded-r-sm"
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
                      isActive ? "bg-primary/10" : "",
                    )}
                    aria-label={item.title}
                    onClick={(e) => {
                      // Only toggle the popover, don't navigate
                      e.stopPropagation()
                      onOpenChange(!isOpen)
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center">
                      <Icon className={cn("h-5 w-5 transition-transform", isActive ? "text-primary" : item.color)} />
                    </div>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
            <PopoverContent
              side="right"
              className="w-56 p-3 bg-background border rounded-lg"
              onInteractOutside={() => onOpenChange(false)}
              align="start"
              alignOffset={-5}
              sideOffset={12}
            >
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  },
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border-b pb-2 mb-1">
                  <Icon className={cn("h-4 w-4", item.color)} />
                  <span className="bg-gradient-to-r from-teal-500  to-blue-500 bg-clip-text text-transparent">
                    {item.title}
                  </span>
                </div>
                {item.children.map((child, index) => (
                  <motion.div
                    key={child.title}
                    initial={{ x: -5, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        delay: index * 0.03 + 0.1,
                      },
                    }}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 py-2 text-sm rounded-lg transition-all",
                        pathname === child.href
                          ? "bg-primary/20 text-primary font-medium"
                          : "hover:bg-primary/10 hover:translate-x-1",
                      )}
                      onClick={() => onClick(child.href, item.href)}
                      data-href={child.href}
                    >
                      {child.title}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </li>
    )
  }

  // For collapsed sidebar without children
  if (!isExpanded && !item.children) {
    return (
      <li ref={itemRef} className="relative group">
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-gradient-to-b from-teal-500 to-blue-500 rounded-r-sm" />
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10 justify-center rounded-lg transition-all", isActive ? "bg-primary/10" : "")}
                onClick={() => onClick(item.href)}
                aria-label={item.title}
              >
                <div className="flex h-8 w-8 items-center justify-center">
                  <Icon className={cn("h-5 w-5 transition-transform", isActive ? "text-primary" : item.color)} />
                </div>
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
    <li ref={itemRef} className="group">
      <div className="space-y-1 relative">
        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-gradient-to-b from-primary via-indigo-400  to-accent rounded-r-sm" />
        )}

        {/* Parent item - only toggles dropdown if it has children */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 rounded-lg text-sm font-medium transition-all h-10 px-3",
            isActive ? "bg-primary/10" : "",
            !isExpanded && "px-0 justify-center",
            "hover:translate-x-1",
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
          <div className="flex h-8 w-8 items-center justify-center">
            <Icon className={cn("h-5 w-5", isActive ? "text-primary" : item.color)} />
          </div>
          {isExpanded && (
            <span className="animate-fade-in animate-slide-in-from-left duration-200 truncate">{item.title}</span>
          )}
          {isExpanded && item.children && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="ml-auto"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </Button>

        {/* Submenu for expanded state */}
        <AnimatePresence>
          {isExpanded && isOpen && item.children && (
            <motion.div
              className="ml-10 space-y-1"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                  opacity: { duration: 0.2, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                  },
                  opacity: { duration: 0.2 },
                },
              }}
              style={{ overflow: "hidden" }}
            >
              {item.children.map((child, index) => (
                <motion.div
                  key={child.title}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.05 + 0.1,
                    },
                  }}
                >
                  <Button
                    key={child.title}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-3 py-2 text-sm rounded-lg transition-all",
                      pathname === child.href
                        ? "bg-primary/20 text-primary font-medium"
                        : "hover:bg-primary/10 hover:translate-x-1",
                    )}
                    onClick={() => onClick(child.href, item.href)}
                    data-href={child.href}
                  >
                    {child.icon && <child.icon className={`h-4 w-4 ${  pathname === child.href ? `bg-primary/20 text-primary` : item.color}`} />}
                    {child.title }
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  )
}

NavItem.displayName = "NavItem"
