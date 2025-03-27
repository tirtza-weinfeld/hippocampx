"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  FlaskRoundIcon,
  Gamepad2,
  Menu,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle sidebar toggle
  const toggleSidebar = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsOpen((prev) => !prev)
  }

  // Close sidebar when clicking outside
  useEffect(() => {
    if (!isOpen || !mounted) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (
        (buttonRef.current && buttonRef.current.contains(target)) ||
        (sidebarRef.current && sidebarRef.current.contains(target))
      ) {
        return
      }
      setIsOpen(false)
    }

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    // Prevent scrolling when sidebar is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, mounted])

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [

    {
      name: "Learning Paths",
      href: "/calculus/learning-paths",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Explore guided learning journeys",
    },
    {
      name: "Interactive Lab",
      href: "/calculus/lab",
      icon: <FlaskRoundIcon className="h-5 w-5" />,
      description: "Experiment with interactive tools",
    },
    {
      name: "Games",
      href: "/calculus/games",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Learn through fun educational games",
    },
    // {
    //   name: "My Progress",
    //   href: "/calculus/progress",
    //   icon: <BarChart2 className="h-5 w-5" />,
    //   description: "Track your learning achievements",
    // },
  ]

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="w-32 h-10"></div>
          <div className="w-auto h-10"></div>
          <div className="w-24 h-10"></div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className="sticky top-0 right-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="banner"
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and mobile menu button */}
          <div className="flex items-center gap-4">
            {/* {isMobile && (
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="relative -ml-2 h-9 w-9 rounded-full text-muted-foreground"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )} */}
            {isMobile && (
              <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="absolute top-3 right-15 h-9 w-9 rounded-full text-foreground"
              >
                <span className="flex items-center gap-2 bg-gradient-to-r from-violet-200 to-indigo-400 
                 dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600 
                
                rounded-full px-2 py-1">
                <Menu className="h-5 w-5 " />

                  <span className="text-lg font-bold pr-3">
                  CalKids
                  </span>
                  {/* {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} */}
                  {/* <span className=" opacity-50 text-muted-foreground  animate-[wiggle_1s_ease-in-out_infinite]">
                    {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </span> */}
                </span>
              </Button>
            )}



            {/* <Link href="/calculus" className="flex items-center gap-2" aria-label="CalKids Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                CalKids
              </span>
            </Link> */}
          </div>

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="mx-4 flex flex-1 justify-center" aria-label="Main navigation">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                            active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground",
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}


        </div>
      </header>

      {/* Mobile sidebar navigation */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            />

            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-background pb-10 shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              id="mobile-navigation"
            >
              {/* Sidebar header */}
              <Link href="/calculus" className={`
              sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-border/40 bg-background/95
               px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60
               
               
               `}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  CalKids
                </span>
              </Link>

              {/* <Link href="/calculus" className="flex items-center gap-2" aria-label="CalKids Home">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
                  <span className="text-lg font-bold text-white">C</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  CalKids
                </span>
              </Link>

              {/* Navigation items */}
              <nav className="px-2 py-4" aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {navItems.map((item, index) => {
                    const active = isActive(item.href)
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                              active
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {item.icon}
                          </span>
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                          </div>
                          {active && <ChevronRight className="ml-auto h-4 w-4 text-primary-foreground/70" />}
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>

              {/* User profile section */}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

