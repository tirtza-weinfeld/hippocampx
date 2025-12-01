"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, type Variants } from "motion/react"
import {
  BookOpen,
  Calculator,
  HelpCircle,
  Dumbbell,
  Lightbulb,
  Gamepad2,
  InfinityIcon,
} from "lucide-react"
import { useIsMobile as useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Route } from "next"

// Infinity-themed symbols for decoration
const infinitySymbols = ["∞", "ℵ", "ω", "⧜", "∝", "⧞"]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMobile()
  const [activeSymbol, setActiveSymbol] = useState(0)

  // Navigation items with infinity theme
  const navItems = [
    {
      name: "Explore",
      href: "/infinity",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Begin your journey into infinity",
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500",
      symbol: "∞",
      notation: "ℵ₀",
      position: 0,
    },
    {
      name: "Compare",
      href: "/old/infinity/compare",
      icon: <Calculator className="h-5 w-5" />,
      description: "Compare different types of infinity",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500",
      symbol: "ℵ",
      notation: "ℵ₁",
      position: 1,
    },
    {
      name: "Concepts",
      href: "/old/infinity/concepts",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Learn key infinity concepts",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500",
      symbol: "ω",
      notation: "ω",
      position: 2,
    },
    {
      name: "Practice",
      href: "/old/infinity/practice",
      icon: <Dumbbell className="h-5 w-5" />,
      description: "Test your understanding of infinity",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-500",
      symbol: "∝",
      notation: "∞ + 1",
      position: 3,
    },
    {
      name: "Paradoxes",
      href: "/old/infinity/paradoxes",
      icon: <Lightbulb className="h-5 w-5" />,
      description: "Explore mind-bending infinity paradoxes",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500",
      symbol: "⧜",
      notation: "ℵω",
      position: 4,
    },
    {
      name: "Playground",
      href: "/old/infinity/playground",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Interactive infinity experiments",
      color: "from-pink-500 to-fuchsia-500",
      bgColor: "bg-pink-500",
      symbol: "⧞",
      notation: "∞∞",
      position: 5,
    },
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Rotate through infinity symbols
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSymbol((prev) => (prev + 1) % infinitySymbols.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen || !mounted) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        fabRef.current &&
        !fabRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, mounted])

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/infinity") {
      return pathname === "/infinity"
    }
    return pathname === path
  }

  // Animation variants for FAB
  const fabVariants: Variants = {
    closed: {
      scale: 1,
      rotate: 0,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    open: {
      scale: 1.1,
      rotate: 360,
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
  }

  // Calculate position along infinity curve
  const getInfinityPosition = (index: number, total: number) => {
    const t = (index / (total - 1)) * Math.PI * 2
    const scale = isMobile ? 100 : 150 // Radius of the infinity curve
    const x = scale * Math.sin(t) / (1 + Math.cos(t) * Math.cos(t))
    const y = scale * Math.sin(t) * Math.cos(t) / (1 + Math.cos(t) * Math.cos(t))
    return { x, y }
  }

  // Toggle navigation
  const toggleNav = () => {
    setIsOpen(!isOpen)
  }

  // Handle touch events for mobile
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null)
  const handleTouchStart = (itemName: string) => {
    if (touchTimeout) clearTimeout(touchTimeout)
    setActiveItem(itemName)
  }
  const handleTouchEnd = () => {
    const timeout = setTimeout(() => setActiveItem(null), 100)
    setTouchTimeout(timeout)
  }

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) return null

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:px-4 focus:py-2 focus:bg-background focus:z-[100] focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Main navigation container */}
      <div 
        className="fixed inset-0" 
        style={{ 
          zIndex: 9997,
          pointerEvents: 'none',
        }}
        aria-label="Navigation" 
        role="navigation"
      >
        {/* Expanding FAB button */}
        <motion.button
          ref={fabRef}
          onClick={toggleNav}
          className={cn(
            "fixed flex items-center justify-center rounded-full shadow-lg",
            "h-14 w-14",
            "right-6 top-6 md:right-8 md:top-8",
            "safe-area-inset-right safe-area-inset-top",
            isOpen 
              ? "bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600" 
              : "bg-gradient-to-r from-yellow-600 to-amber-600 text-white",
          )}
          style={{
            zIndex: 99999,
            position: 'fixed',
            transform: 'none',
            pointerEvents: 'auto',
          }}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={fabVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open infinity navigation menu"}
        >
          {/* Icon that changes between infinity and X */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-white relative z-10"
            >
              {isOpen ? (
                <div className="relative w-6 h-6">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ 
                      opacity: [1, 0.5, 1],
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    <div className="w-4 h-0.5 bg-white absolute" />
                    <div className="w-0.5 h-4 bg-white absolute" />
                    {/* Infinity decoration */}
                    <div className="absolute -inset-2 flex items-center justify-center opacity-50">
                      {infinitySymbols.map((symbol, i) => (
                        <motion.span
                          key={i}
                          className="text-[8px] absolute"
                          style={{
                            transform: `rotate(${i * 60}deg) translateY(-8px)`,
                          }}
                        >
                          {symbol}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="relative">
                  <InfinityIcon className="h-6 w-6" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                  >
                    <span className="text-sm font-bold" aria-hidden="true">
                      {infinitySymbols[activeSymbol]}
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Infinity-themed decoration */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            aria-hidden="true"
          >
            <svg width="100%" height="100%" viewBox="0 0 56 56">
              <path
                d="M28 20 Q36 20 36 28 T28 36 T20 28 T28 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {infinitySymbols.map((symbol, i) => (
                <text
                  key={i}
                  x={28 + Math.cos(i * Math.PI / 3) * 10}
                  y={28 + Math.sin(i * Math.PI / 3) * 10}
                  className="text-[8px]"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {symbol}
                </text>
              ))}
            </svg>
          </motion.div>
        </motion.button>

        {/* Expanded navigation overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                style={{
                  zIndex: 99997,
                  pointerEvents: 'auto',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleNav}
                aria-hidden="true"
              >
                {/* Floating infinity symbols in background */}
                {infinitySymbols.map((symbol, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary/10 select-none"
                    style={{
                      fontSize: `${Math.random() * 40 + 20}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      pointerEvents: 'none',
                      zIndex: 99998,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      y: [0, Math.random() * 30 - 15],
                      x: [0, Math.random() * 30 - 15],
                      rotate: [0, Math.random() * 20 - 10],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: Math.random() * 5 + 5,
                      repeatType: "reverse",
                    }}
                    aria-hidden="true"
                  >
                    {symbol}
                  </motion.div>
                ))}
              </motion.div>

              {/* Navigation items in infinity pattern */}
              <div
                ref={navRef}
                className="fixed"
                style={{
                  right: '50%',
                  top: '50%',
                  zIndex: 99998,
                  pointerEvents: 'none',
                }}
                id="navigation-menu"
                role="menu"
                aria-orientation="horizontal"
              >
                {navItems.map((item, index) => {
                  const active = isActive(item.href)
                  const position = getInfinityPosition(index, navItems.length)

                  return (
                    <motion.div
                      key={item.name}
                      className="absolute"
                      style={{
                        position: 'absolute',
                        pointerEvents: 'auto',
                        zIndex: 99998,
                      }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: position.x,
                        y: position.y,
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: index * 0.05,
                      }}
                    >
                      {/* Tooltip */}
                      <AnimatePresence>
                        {activeItem === item.name && (
                          <motion.div
                            className="absolute bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 whitespace-nowrap z-[100]"
                            style={{
                              right: '100%',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              marginRight: '1rem',
                              pointerEvents: 'none',
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs font-mono text-primary">{item.notation}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                            {/* Arrow */}
                            <div 
                              className="absolute w-2 h-2 bg-background/90 rotate-45 border-t border-r border-border/50"
                              style={{
                                right: '-0.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation button */}
                      <Link
                        href={item.href as Route}
                        className={cn(
                          "flex items-center justify-center rounded-full shadow-lg transition-all relative",
                          "h-14 w-14",
                          active ? `bg-gradient-to-br ${item.color}` : item.bgColor,
                          "text-white relative overflow-hidden",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          "hover:scale-105 active:scale-95",
                        )}
                        onMouseEnter={() => setActiveItem(item.name)}
                        onMouseLeave={() => setActiveItem(null)}
                        onTouchStart={() => handleTouchStart(item.name)}
                        onTouchEnd={handleTouchEnd}
                        aria-label={`${item.name}${active ? " (current page)" : ""}`}
                        aria-current={active ? "page" : undefined}
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Active state indicators */}
                        {active && (
                          <>
                            {/* Rotating infinity symbol */}
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-white/30"
                              style={{
                                borderRadius: "50%",
                                borderStyle: "solid",
                                borderWidth: "2px",
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                clipPath: "path('M28 20 Q36 20 36 28 T28 36 T20 28 T28 20')",
                              }}
                              animate={{ rotate: 360 }}
                              transition={{ 
                                duration: 8, 
                                repeat: Infinity, 
                                ease: "linear" 
                              }}
                              aria-hidden="true"
                            />
                            {/* Pulsing glow */}
                            <motion.div
                              className="absolute inset-0 rounded-full bg-white/20"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0.4, 0.2],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                              aria-hidden="true"
                            />
                            {/* Floating infinity symbols */}
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute text-[10px] text-white/60"
                                initial={{ 
                                  scale: 0,
                                  opacity: 0,
                                  x: 0,
                                  y: 0,
                                }}
                                animate={{
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0],
                                  x: [0, (Math.random() - 0.5) * 40],
                                  y: [0, (Math.random() - 0.5) * 40],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.5,
                                  repeatDelay: 1,
                                }}
                                aria-hidden="true"
                              >
                                {item.symbol}
                              </motion.div>
                            ))}
                          </>
                        )}

                        {/* Icon */}
                        <div className="relative z-10">
                          {item.icon}
                        </div>

                        {/* Symbol overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: active ? [0, 1, 0] : 0 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          aria-hidden="true"
                        >
                          <span className="text-sm font-bold">{item.symbol}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
} 