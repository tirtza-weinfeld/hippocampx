"use client"

import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Confetti } from "@/components/calculus/confetti"
import { ArrowRight } from "lucide-react"
import { useReducedMotion } from "motion/react"

export function HomeHero() {
  const [mounted, setMounted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 100) // Reset after animation starts
  }

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    triggerConfetti()

    setTimeout(() => {
      setIsAnimating(false)
    }, 2000)
  }

  // Animation variants with reduced motion support
  const textVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut" as const,
      },
    }),
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
        delay: shouldReduceMotion ? 0 : 0.4,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
    tap: {
      scale: shouldReduceMotion ? 1 : 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut" as const,
      },
    },
  }

  const graphicVariants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.5,
        delay: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <section className="py-12 md:py-16">
      <Confetti trigger={showConfetti} count={150} />
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                Discover the Magic of Calculus
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-foreground/80 md:text-xl"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={0.2}
              >
                Join Newton and friends on an exciting adventure through slopes, curves, and infinite possibilities with
                fun interactive visualizations!
              </motion.p>
            </div>

            {/* What is Calculus section */}
            <motion.div
              className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900/50 shadow-sm"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">What is Calculus?</h2>
              <p className="mb-3">Calculus is like having superpowers for understanding how things change! 🦸‍♂️</p>
              <p className="mb-3">
                Imagine watching a roller coaster zoom by. How fast is it going at each moment? How steep is the track?
                When will it reach the bottom? Calculus gives us the tools to answer these questions!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">Derivatives</h3>
                  <p className="text-sm">
                    Find how things change from moment to moment, like the speed of a car or the spread of a virus.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">Integrals</h3>
                  <p className="text-sm">
                    Add up infinitely many tiny pieces to find areas, volumes, and totals of changing quantities.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              <Link href="/calculus/learning-paths">
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/calculus/lab">
                <motion.div
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button size="lg" variant="outline" className="border-2 hover:bg-secondary/20">
                    Explore Math Lab
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            variants={graphicVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] flex items-center justify-center">
              {/* Interactive function visualization */}
              <svg
                width="100%"
                height="100%"
                viewBox="-10 -10 20 20"
                className="cursor-pointer"
                onClick={startAnimation}
              >
                {/* Coordinate system */}
                <motion.line
                  x1="-10"
                  y1="0"
                  x2="10"
                  y2="0"
                  stroke="currentColor"
                  strokeWidth="0.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 0.2 }}
                />
                <motion.line
                  x1="0"
                  y1="-10"
                  x2="0"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="0.1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0.1 : 1, delay: 0.2 }}
                />

                {/* X-axis ticks */}
                {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((x) => (
                  <motion.g
                    key={`x-tick-${x}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.5 + Math.abs(x) * 0.05 }}
                  >
                    <line x1={x} y1="-0.2" x2={x} y2="0.2" stroke="currentColor" strokeWidth="0.1" />
                    <text x={x} y="0.7" fontSize="0.5" textAnchor="middle" fill="currentColor">
                      {x}
                    </text>
                  </motion.g>
                ))}

                {/* Y-axis ticks */}
                {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((y) => (
                  <motion.g
                    key={`y-tick-${y}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.5 + Math.abs(y) * 0.05 }}
                  >
                    <line x1="-0.2" y1={y} x2="0.2" y2={y} stroke="currentColor" strokeWidth="0.1" />
                    <text x="-0.7" y={y + 0.15} fontSize="0.5" textAnchor="end" fill="currentColor">
                      {y}
                    </text>
                  </motion.g>
                ))}

                {/* Parabola function y = x² */}
                <motion.path
                  d={Array.from({ length: 200 })
                    .map((_, i) => {
                      const x = -5 + i * 0.05
                      const y = x * x
                      return (i === 0 ? "M" : "L") + `${x},${-y}`
                    })
                    .join(" ")}
                  className="stroke-violet-500 dark:stroke-violet-400"
                  strokeWidth="0.15"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: isAnimating ? [0, 1, 0] : 1,
                    opacity: isAnimating ? [0, 1, 0] : 1,
                  }}
                  transition={{
                    duration: isAnimating ? 2 : shouldReduceMotion ? 0.1 : 1.5,
                    delay: isAnimating ? 0 : shouldReduceMotion ? 0 : 0.7,
                    repeat: isAnimating ? 0 : 0,
                    ease: "easeInOut" as const,
                  }}
                />

                {/* Sine function y = sin(x) */}
                {mounted && (
                  <motion.path
                    d={Array.from({ length: 200 })
                      .map((_, i) => {
                        const x = -5 + i * 0.05
                        const y = Math.sin(x)
                        return (i === 0 ? "M" : "L") + `${x},${-y}`
                      })
                      .join(" ")}
                    className="stroke-indigo-500 dark:stroke-indigo-400"
                    strokeWidth="0.15"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: isAnimating ? [0, 1, 0] : 1,
                      opacity: isAnimating ? [0, 1, 0] : 1,
                    }}
                    transition={{
                      duration: isAnimating ? 2 : shouldReduceMotion ? 0.1 : 1.5,
                      delay: isAnimating ? 0.2 : shouldReduceMotion ? 0 : 1,
                      repeat: isAnimating ? 0 : 0,
                      ease: "easeInOut" as const,
                    }}
                  />
                )}

                {/* Tangent visualization */}
                {isAnimating && (
                  <motion.g>
                    <motion.circle
                      cx="1"
                      cy="-1"
                      r="0.2"
                      className="fill-pink-500 dark:fill-pink-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: 0.5 }}
                    />
                    <motion.line
                      x1="-1"
                      y1="-3"
                      x2="3"
                      y2="1"
                      className="stroke-pink-500 dark:stroke-pink-400"
                      strokeWidth="0.1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: 0.7 }}
                    />
                  </motion.g>
                )}

                {/* Area under curve visualization */}
                {isAnimating && (
                  <motion.path
                    d="M-3,-0 L-3,-0.7071 L-2.5,-0.4677 L-2,-0.2794 L-1.5,-0.1367 L-1,-0.0404 L-0.5,-0.0025 L0,-0 L0.5,-0.0025 L1,-0.0404 L1.5,-0.1367 L2,-0.2794 L2.5,-0.4677 L3,-0.7071 L3,0 Z"
                    className="fill-violet-500/20 dark:fill-violet-400/20 stroke-violet-500 dark:stroke-violet-400"
                    strokeWidth="0.05"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, delay: 1 }}
                  />
                )}

                {/* Instruction text */}
                <text x="0" y="8" fontSize="0.7" textAnchor="middle" fill="currentColor" className="animate-pulse">
                  Click to see calculus in action!
                </text>
              </svg>

              {/* Math symbols floating */}
              <motion.div
                className="absolute text-3xl font-bold text-violet-500 dark:text-violet-400"
                style={{ top: "10%", left: "20%" }}
                animate={shouldReduceMotion ? {} : { y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const }}
              >
                ∫
              </motion.div>
              <motion.div
                className="absolute text-3xl font-bold text-indigo-500 dark:text-indigo-400"
                style={{ top: "30%", right: "15%" }}
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const, delay: 0.5 }}
              >
                d/dx
              </motion.div>
              <motion.div
                className="absolute text-3xl font-bold text-blue-500 dark:text-blue-400"
                style={{ bottom: "25%", left: "15%" }}
                animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const, delay: 0.8 }}
              >
                lim
              </motion.div>
              <motion.div
                className="absolute text-3xl font-bold text-sky-500 dark:text-sky-400"
                style={{ bottom: "15%", right: "25%" }}
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as const, delay: 1.2 }}
              >
                Σ
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

