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
  Binary,
} from "lucide-react"
import { useIsMobile as useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// Binary symbols for decoration
const binarySymbols = ["0", "1", "10", "11", "100", "101", "110", "111"]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMobile()
  const [activeSymbol, setActiveSymbol] = useState(0)
  const [curvePoints, setCurvePoints] = useState("")

  // Refs for keyboard navigation
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const navItems = [
    {
      name: "Learn",
      href: "/binary",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Start your binary learning journey",
      color: "from-violet-500 to-blue-500",
      bgColor: "bg-violet-500",
      emoji: "📚",
      symbol: "0",
      equation: "learn = fun",
      binaryNotation: "0b0001",
      angle: 0,
    },
    {
      name: "Convert",
      href: "/binary/convert",
      icon: <Calculator className="h-5 w-5" />,
      description: "Convert between binary and decimal",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-500",
      emoji: "🔢",
      symbol: "1",
      equation: "decimal ⟷ binary",
      binaryNotation: "0b0010",
      angle: 60,
    },
    {
      name: "How To",
      href: "/binary/explain",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Learn binary conversion steps",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500",
      emoji: "❓",
      symbol: "10",
      equation: "steps = success",
      binaryNotation: "0b0011",
      angle: 120,
    },
    {
      name: "Practice",
      href: "/binary/practice",
      icon: <Dumbbell className="h-5 w-5" />,
      description: "Test your binary skills",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500",
      emoji: "💪",
      symbol: "11",
      equation: "practice++",
      binaryNotation: "0b0100",
      angle: 180,
    },
    {
      name: "Fun Facts",
      href: "/binary/fun",
      icon: <Lightbulb className="h-5 w-5" />,
      description: "Discover interesting binary facts",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500",
      emoji: "💡",
      symbol: "100",
      equation: "knowledge += fun",
      binaryNotation: "0b0101",
      angle: 240,
    },
    {
      name: "Play",
      href: "/binary/play",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Learn binary through interactive games",
      color: "from-rose-500 to-red-500",
      bgColor: "bg-rose-500",
      emoji: "🎮",
      symbol: "101",
      equation: "fun * learning",
      binaryNotation: "0b0110",
      angle: 300,
    },
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Rotate through binary symbols
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSymbol((prev) => (prev + 1) % binarySymbols.length)
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

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          setIsOpen(false)
          fabRef.current?.focus()
          break
        case "Tab":
          // Allow natural tab navigation
          break
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          navItemRefs.current[1]?.focus()
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          navItemRefs.current[0]?.focus()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, mounted])

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/binary") {
      return pathname === "/binary" // Only exact match for home path
    }
    return pathname === path
  }

  // Animation variants
  const fabVariants: Variants = {
    closed: {
      scale: 1,
      rotate: 0,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    open: {
      scale: 1.1,
      rotate: 180,
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
  }

  // Calculate position for vertical stack
  const getStackPosition = (index: number, total: number) => {
    const spacing = 70; // Space between items
    const startY = -((total - 1) * spacing) / 2; // Center the stack
    return {
      x: 0, // All items aligned vertically
      y: startY + (index * spacing),
    }
  }

  // Toggle navigation
  const toggleNav = () => {
    setIsOpen(!isOpen)
  }

  // Handle keyboard activation
  const handleKeyActivation = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      callback()
    }
  }

  // Generate binary pattern points
  useEffect(() => {
    // Binary pattern visualization functions
    const binaryPatterns = [
      // Binary counter pattern
      (t: number) => {
        const count = Math.floor(t / 30) % 8 // 3-bit counter
        return count * 15 - 30 // Scale and center
      },
      // Binary wave pattern
      (t: number) => Math.sin(t / 10) * 30 * (Math.floor(t / 50) % 2), // Binary modulated sine wave
      // Binary tree pattern
      (t: number) => {
        const depth = Math.floor(t / 40) % 4
        return (2 ** depth - 1) * 10 - 30
      },
      // Binary shift pattern
      (t: number) => {
        const shift = Math.floor(t / 25) % 6
        return ((1 << shift) - 32) * 2
      },
    ]
    if (!mounted) return

    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      const t = Date.now() - startTime
      const points: [number, number][] = []
      const pattern = binaryPatterns[Math.floor(t / 4000) % binaryPatterns.length]

      for (let x = 0; x <= 200; x += 5) {
        const y = pattern(x + t / 20)
        points.push([x, y])
      }

      // Convert to SVG path format
      const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1] + 100}`).join(" ")
      setCurvePoints(pathData)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [mounted])

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

  // FAB position in top right with margin
  const fabPositionX = 24

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
            isOpen ? "h-16 w-16" : "h-14 w-14",
            "right-6 top-6 md:right-8 md:top-8",
            "safe-area-inset-right safe-area-inset-top",
            isOpen 
              ? "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600" 
              : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
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
          whileHover={{ scale: isOpen ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open binary navigation menu"}
        >
          {/* Icon that changes between binary and X */}
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
                    {/* Binary decoration */}
                    <div className="absolute -inset-2 flex items-center justify-center opacity-50">
                      <span className="text-[8px] font-mono absolute top-0">1</span>
                      <span className="text-[8px] font-mono absolute right-0">0</span>
                      <span className="text-[8px] font-mono absolute bottom-0">1</span>
                      <span className="text-[8px] font-mono absolute left-0">0</span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="relative">
                  <Binary className="h-6 w-6" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                  >
                    <span className="text-sm font-bold font-mono" aria-hidden="true">
                      {binarySymbols[activeSymbol]}
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Binary-themed decoration */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            aria-hidden="true"
          >
            <svg width="100%" height="100%" viewBox="0 0 56 56">
              <line x1="28" y1="10" x2="28" y2="46" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="28" x2="46" y2="28" stroke="currentColor" strokeWidth="0.5" />
              <text x="20" y="25" className="text-[8px] font-mono">0</text>
              <text x="32" y="25" className="text-[8px] font-mono">1</text>
              <text x="20" y="35" className="text-[8px] font-mono">1</text>
              <text x="32" y="35" className="text-[8px] font-mono">0</text>
            </svg>
          </motion.div>

          {/* Pulsing animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden="true"
          />
        </motion.button>

        {/* Expanded navigation overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - full screen with click handler */}
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
                {/* Floating binary symbols in background */}
                {binarySymbols.map((symbol, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary/10 font-mono font-bold select-none"
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

              {/* Orbit navigation */}
              <div
                ref={navRef}
                className="fixed"
                style={{
                  right: fabPositionX + 80, // Position to the right of FAB
                  top: '50%', // Center vertically
                  zIndex: 99998,
                  pointerEvents: 'auto',
                  transform: 'translateY(-50%)', // Center alignment
                }}
                id="navigation-menu"
                role="menu"
                aria-orientation="vertical"
              >
                {/* Navigation items in vertical stack */}
                {navItems.map((item, index) => {
                  const active = isActive(item.href)
                  const position = getStackPosition(index, navItems.length)

                  return (
                    <motion.div
                      key={item.name}
                      className="absolute"
                      style={{
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto',
                        zIndex: 99998,
                      }}
                      initial={{ opacity: 0, x: 50, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, x: 50, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: index * 0.05,
                      }}
                    >
                      {/* Binary notation tooltip */}
                      <AnimatePresence>
                        {activeItem === item.name && (
                          <motion.div
                            className="absolute bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 whitespace-nowrap z-[100]"
                            style={{
                              position: 'absolute',
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
                            <div className="text-xs font-mono text-primary">{item.binaryNotation}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                            {/* Add a small arrow at the right */}
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

                      <Link
                        ref={(el) => { navItemRefs.current[index] = el }}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center rounded-full shadow-lg transition-all relative",
                          "h-14 w-14", // Same size for all
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
                        tabIndex={isOpen ? 0 : -1}
                        onFocus={() => {}}
                        onKeyDown={(e) => handleKeyActivation(e, () => {})}
                        onClick={() => setIsOpen(false)}
                      >
                        {/* Active state indicators */}
                        {active && (
                          <>
                            {/* Rotating binary ring */}
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
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
                            {/* Binary particles */}
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute text-[8px] font-mono text-white/60"
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
                                {Math.random() > 0.5 ? '1' : '0'}
                              </motion.div>
                            ))}
                          </>
                        )}

                        {/* Icon */}
                        <div className="relative z-10">
                          {item.icon}
                        </div>

                        {/* Binary symbol overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: active ? [0, 1, 0] : 0 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          aria-hidden="true"
                        >
                          <span className="text-sm font-bold font-mono">{item.symbol}</span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Binary visualization */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{
                    width: isMobile ? 300 : 400,
                    height: isMobile ? 300 : 400,
                    transform: "translate(-150%, 100px)", // Move visualization further left and down
                  }}
                  aria-hidden="true"
                >
                  {/* Binary pattern */}
                  <motion.path
                    d={curvePoints}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/40"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </svg>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
} 