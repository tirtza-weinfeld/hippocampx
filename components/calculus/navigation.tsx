"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, type Variants } from "motion/react"
import {
  Home,
  BookOpen,
  FlaskRound,
  Gamepad2,
  Calculator,
  X,
} from "lucide-react"
import { useIsMobile as useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@/components/calculus/visually-hidden"
import { Route } from "next"
// import { SparklesCore } from "@/components/calculus/ui/sparkles"

// Math symbols for decoration
const mathSymbols = ["∫", "∑", "∂", "∞", "π", "√", "Δ", "∇", "lim", "dx"]

// Calculus-specific functions for visualization
const functions = [
  // Sine wave
  (x: number) => Math.sin(x / 10) * 30,
  // Parabola
  (x: number) => (x * x) / 100 - 30,
  // Exponential
  (x: number) => 20 * Math.exp(x / 50) - 30,
  // Logarithmic
  (x: number) => 20 * Math.log(x + 20) - 30,
  // Sigmoid
  (x: number) => 30 / (1 + Math.exp(-x / 10)) - 15,
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const isMobile = useMobile()
  const [activeSymbol, setActiveSymbol] = useState(0)
  const [activeFunction, setActiveFunction] = useState(0)
  const [, setShowSettings] = useState(false)
  const [focusIndex, setFocusIndex] = useState(-1)
  const [curvePoints, setCurvePoints] = useState<string>("")
  const [derivativePoints, setDerivativePoints] = useState<string>("")

  // Refs for keyboard navigation
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  const navItems = [
    {
      name: "Calculus",
      href: "/calculus",
      icon: <Home className="h-5 w-5" />,
      description: "Return to the main dashboard",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500",
      emoji: "🏠",
      symbol: "∫",
      equation: "f(x) = home",
      calcNotation: "∫f(x)dx",
      angle: 0, // angle in the circle
    },
    {
      name: "Learning Paths",
      href: "/calculus/learning-paths",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Explore guided learning journeys",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500",
      emoji: "📚",
      symbol: "∑",
      equation: "∑ knowledge",
      calcNotation: "∑_{i=1}^{n} learn_i",
      angle: 72, // 360 / 5 = 72 degrees apart
    },
    {
      name: "Interactive Lab",
      href: "/calculus/lab",
      icon: <FlaskRound className="h-5 w-5" />,
      description: "Experiment with interactive tools",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-500",
      emoji: "🧪",
      symbol: "Δ",
      equation: "Δexperiment",
      calcNotation: "lim_{Δx→0} Δy/Δx",
      angle: 144,
    },
    {
      name: "Games",
      href: "/calculus/games",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Learn through fun educational games",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500",
      emoji: "🎮",
      symbol: "π",
      equation: "fun × learning",
      calcNotation: "∫fun·d(learning)",
      angle: 216,
    },
    
  ]

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate function curve points
  useEffect(() => {
    if (!mounted) return

    // Generate points for the function curve
    const fn = functions[activeFunction]
    const points: [number, number][] = []
    const derivPoints: [number, number][] = []

    // Calculate function points
    for (let x = 0; x <= 200; x += 5) {
      const y = fn(x)
      points.push([x, y])
    }

    // Calculate derivative points (using finite difference)
    for (let i = 1; i < points.length; i++) {
      const x = (points[i][0] + points[i - 1][0]) / 2
      const slope = (points[i][1] - points[i - 1][1]) / (points[i][0] - points[i - 1][0])
      // Scale the derivative for better visualization
      const scaledSlope = slope * 15
      derivPoints.push([x, scaledSlope])
    }

    // Convert to SVG path format
    const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1] + 100}`).join(" ")
    setCurvePoints(pathData)

    const derivPathData = derivPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1] + 150}`).join(" ")
    setDerivativePoints(derivPathData)

    // Rotate through functions
    const interval = setInterval(() => {
      setActiveFunction((prev) => (prev + 1) % functions.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [mounted, activeFunction])

  // Rotate through math symbols
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSymbol((prev) => (prev + 1) % mathSymbols.length)
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
          setFocusIndex((prev) => {
            const newIndex = prev >= navItems.length ? 0 : prev + 1
            if (newIndex === navItems.length) {
              settingsButtonRef.current?.focus()
            } else {
              navItemRefs.current[newIndex]?.focus()
            }
            return newIndex
          })
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          setFocusIndex((prev) => {
            const newIndex = prev <= 0 ? navItems.length : prev - 1
            if (newIndex === navItems.length) {
              settingsButtonRef.current?.focus()
            } else {
              navItemRefs.current[newIndex]?.focus()
            }
            return newIndex
          })
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, mounted, navItems.length])

  // Close navigation on route change - no longer needed as we close on click
  // useEffect(() => {
  //   setIsOpen(false)
  // }, [pathname])

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" // Only exact match for home path
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Animation variants
  const fabVariants: Variants = {
    closed: {
      scale: 1,
      rotate: 0,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    },
    open: {
      scale: 1.2,
      rotate: 45,
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
    },
  }



  // Calculate position for orbit items
  const getOrbitPosition = (angle: number, radius: number) => {
    // Convert angle to radians
    const radians = (angle - 90) * (Math.PI / 180)
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    }
  }

  // Toggle navigation
  const toggleNav = () => {
    setIsOpen(!isOpen)
    setShowSettings(false)
    setFocusIndex(-1)
  }



  // Handle keyboard activation
  const handleKeyActivation = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      callback()
    }
  }

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) return null

  // FAB position in top right with margin
  const fabPositionX = 24
  const fabPositionY = 24

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:px-4 focus:py-2 focus:bg-background focus:z-[100] focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* Main navigation container - positioned fixed */}
      <div className="fixed inset-0 pointer-events-none z-[9999]" aria-label="Navigation" role="navigation">
        {/* Sparkles background */}
        <div className="absolute inset-0 w-64 h-full">
          {/* <SparklesCore
            id="nav-sparkles"
            className="absolute inset-0"
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleColor="#7C3AED"
            particleDensity={10}
          /> */}
        </div>

        {/* Expanding FAB button */}
        <motion.button
          ref={fabRef}
          onClick={toggleNav}
          className={cn(
            "fixed flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg pointer-events-auto",
            isOpen ? "h-16 w-16" : "h-14 w-14",
            "right-6 top-6 md:right-8 md:top-8", // Responsive positioning
            "safe-area-inset-right safe-area-inset-top" // Support for notches and home indicators
          )}
          style={{
            zIndex: 10000,
            position: 'fixed',
            transform: 'none',
          }}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={fabVariants}
          whileHover={{ scale: isOpen ? 1.2 : 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {/* Icon that changes between calculator and X */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <div className="relative">
                  <Calculator className="h-6 w-6" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatDelay: 1 }}
                  >
                    <span className="text-sm font-bold" aria-hidden="true">
                      {mathSymbols[activeSymbol]}
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Calculus-themed decoration */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            aria-hidden="true"
          >
            <svg width="100%" height="100%" viewBox="0 0 56 56">
              {/* Coordinate system */}
              <line x1="28" y1="10" x2="28" y2="46" stroke="currentColor" strokeWidth="0.5" />
              <line x1="10" y1="28" x2="46" y2="28" stroke="currentColor" strokeWidth="0.5" />

              {/* Function curve */}
              <path d="M 10,28 Q 28,10 46,28" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Integral symbol */}
              <path
                d="M 20,18 C 24,16 24,22 20,20 C 16,18 16,38 20,36 C 24,34 24,40 20,38"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>

          {/* Pulsing animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            aria-hidden="true"
          />
        </motion.button>

        {/* Expanded navigation overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop - full screen with click handler */}
              <motion.div
                className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleNav}
                aria-hidden="true"
              >
                {/* Floating math symbols in background */}
                {mathSymbols.map((symbol, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary/10 font-bold select-none"
                    style={{
                      fontSize: `${Math.random() * 40 + 20}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      y: [0, Math.random() * 30 - 15],
                      x: [0, Math.random() * 30 - 15],
                      rotate: [0, Math.random() * 20 - 10],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
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
                className="absolute pointer-events-auto"
                style={{
                  right: fabPositionX,
                  top: fabPositionY,
                }}
                id="navigation-menu"
                role="menu"
                aria-orientation="horizontal"
              >
                {/* Navigation items in orbit - quarter-circle toward bottom-left */}
                {navItems.map((item, index) => {
                  const active = isActive(item.href)
                  // Use a quarter-circle layout starting from the top-right
                  const orbitRadius = isMobile ? 120 : 150
                  // Adjust angles to create a quarter-circle toward bottom-left (inward)
                  // Distribute items between 225° and 315° (bottom-left quadrant)
                  const adjustedAngle = 225 + (index * 90) / (navItems.length - 1)
                  const position = {
                    x: getOrbitPosition(adjustedAngle, orbitRadius).x - 200, // Move 100px more to the left
                    y: getOrbitPosition(adjustedAngle, orbitRadius).y + 150, // Move 100px more down
                  }

                  return (
                    <motion.div
                      key={item.name}
                      className="absolute"
                      style={{
                        originX: "50%",
                        originY: "50%",
                      }}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        x: position.x,
                        y: position.y,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.05,
                      }}
                      onHoverStart={() => setActiveItem(item.name)}
                      onHoverEnd={() => setActiveItem(null)}
                    >
                      <Link
                        ref={(el) => { navItemRefs.current[index] = el }}
                        href={item.href as Route}
                        className={cn(
                          "flex items-center justify-center rounded-full shadow-lg transition-all",
                          active ? "h-16 w-16" : "h-14 w-14",
                          active ? `bg-gradient-to-br ${item.color}` : item.bgColor,
                          "text-white relative overflow-hidden",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        )}
                        aria-label={`${item.name}${active ? " (current page)" : ""}`}
                        aria-current={active ? "page" : undefined}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        onFocus={() => setFocusIndex(index)}
                        onKeyDown={(e) => handleKeyActivation(e, () => {})}
                        onClick={() => setIsOpen(false)} // Add this line to close navigation when clicked
                      >
                        {/* Calculus-themed background */}
                        <motion.div className="absolute inset-0 opacity-20" aria-hidden="true">
                          <svg width="100%" height="100%" viewBox="0 0 56 56" className="opacity-70">
                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                              <line
                                key={`h-${i}`}
                                x1="0"
                                y1={14 * i + 7}
                                x2="56"
                                y2={14 * i + 7}
                                stroke="currentColor"
                                strokeWidth="0.5"
                                strokeDasharray="1,1"
                              />
                            ))}
                            {[0, 1, 2, 3, 4].map((i) => (
                              <line
                                key={`v-${i}`}
                                x1={14 * i + 7}
                                y1="0"
                                x2={14 * i + 7}
                                y2="56"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                strokeDasharray="1,1"
                              />
                            ))}

                            {/* Function curve specific to each item */}
                            {item.name === "Home" && (
                              <path
                                d="M 10,46 C 20,10 36,46 46,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            )}
                            {item.name === "Learning Paths" && (
                              <path
                                d="M 10,28 L 20,28 L 20,18 L 30,18 L 30,28 L 40,28 L 40,18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            )}
                            {item.name === "Interactive Lab" && (
                              <path d="M 10,46 Q 28,10 46,46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            )}
                            {item.name === "Games" && (
                              <path
                                d="M 10,28 Q 28,10 46,28 Q 28,46 10,28 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            )}
                            {item.name === "My Progress" && (
                              <path
                                d="M 10,46 L 20,36 L 30,40 L 40,20 L 46,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            )}
                          </svg>
                        </motion.div>

                        {/* Icon with math symbol */}
                        <div className="relative">
                          <motion.div
                            animate={active ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                          >
                            {item.icon}
                          </motion.div>
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: active ? [0, 1, 0] : 0 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                            aria-hidden="true"
                          >
                            <span className="text-sm font-bold">{item.symbol}</span>
                          </motion.div>
                        </div>

                        {/* Pulse effect for active item */}
                        {active && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(255,255,255,0)",
                                "0 0 0 10px rgba(255,255,255,0.3)",
                                "0 0 0 0 rgba(255,255,255,0)",
                              ],
                            }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                            aria-hidden="true"
                          />
                        )}

                        {/* Screen reader text */}
                        <VisuallyHidden>{item.name}</VisuallyHidden>
                      </Link>

                      {/* Calculus notation tooltip - positioned to be visible */}
                      <AnimatePresence>
                        {(activeItem === item.name || (active && pathname === item.href) || focusIndex === index) && (
                          <motion.div
                            className="absolute bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 whitespace-nowrap z-10"
                            style={{
                              // Position tooltip based on item position to ensure it's visible
                              left: position.x < -50 ? "100%" : "50%",
                              top: position.y > 50 ? "auto" : "100%",
                              bottom: position.y > 50 ? "100%" : "auto",
                              transform: position.x < -50 ? "translateX(10px)" : "translateX(-50%)",
                              marginTop: position.y > 50 ? 0 : 8,
                              marginBottom: position.y > 50 ? 8 : 0,
                            }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            aria-hidden="true" // Not needed for screen readers as the link already has an accessible name
                          >
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs font-mono text-primary">{item.calcNotation}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}

               

                {/* Calculus visualization - function and derivative */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{
                    width: isMobile ? 300 : 400,
                    height: isMobile ? 300 : 400,
                    transform: "translate(-150%, 100px)", // Move visualization further left and down
                  }}
                  aria-hidden="true"
                >
                  {/* Coordinate system */}
                  <line
                    x1="0"
                    y1="100"
                    x2="200"
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="text-primary/20"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="200"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="text-primary/20"
                  />

                  {/* X-axis labels */}
                  <text x="5" y="95" className="text-[8px] fill-current text-primary/30">
                    f(x)
                  </text>
                  <text x="5" y="145" className="text-[8px] fill-current text-primary/30">
                    f&apos; (x)
                  </text>

                  {/* Function curve */}
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

                  {/* Derivative curve */}
                  <motion.path
                    d={derivativePoints}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-secondary/40"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />

                  {/* Area under curve (integral visualization) */}
                  <motion.path
                    d={`${curvePoints} L 200,100 L 0,100 Z`}
                    fill="currentColor"
                    className="text-primary/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                  />

                  {/* Tangent line at a point */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, 100, 200, 0] }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "linear" }}
                  >
                    <circle cx="100" cy="100" r="3" className="fill-current text-secondary/60" />
                    <line
                      x1="80"
                      y1="110"
                      x2="120"
                      y2="90"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-secondary/60"
                    />
                  </motion.g>
                </svg>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
