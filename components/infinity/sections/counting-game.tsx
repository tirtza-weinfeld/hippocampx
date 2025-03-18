"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HashIcon } from "../icons/tab-icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function CountingGame() {
  const [count, setCount] = useState(0)
  const [autoCount, setAutoCount] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [message, setMessage] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoCount) {
      interval = setInterval(() => {
        setCount((prev) => prev + 1)
      }, 1000 / speed)
    }

    return () => clearInterval(interval)
  }, [autoCount, speed])

  useEffect(() => {
    if (count === 10) {
      setMessage("Keep going! We're just getting started!")
    } else if (count === 50) {
      setMessage("Wow! You're counting fast! But infinity is still WAY bigger!")
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else if (count === 100) {
      setMessage("Amazing! But even if you counted forever, you'd never reach infinity!")
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else if (count > 100 && count % 100 === 0) {
      setMessage("Still going! Infinity is endless!")
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    const timeout = setTimeout(() => {
      setMessage("")
    }, 3000)

    return () => clearTimeout(timeout)
  }, [count])

  const handleReset = () => {
    setCount(0)
    setAutoCount(false)
    setSpeed(1)
    setMessage("")
    setShowConfetti(false)
  }

  const increaseSpeed = () => {
    setSpeed((prev) => Math.min(prev + 1, 10))
  }

  const decreaseSpeed = () => {
    setSpeed((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex justify-center sm:justify-start">
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <HashIcon className="w-16 h-16 sm:w-20 sm:h-20 text-fun-orange" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-fun-yellow rounded-full shadow-md"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }
              }
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-center sm:text-left">
              The Counting Game
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-1 text-center sm:text-left">
              Let&apos;s count towards infinity! (Spoiler: We&apos;ll never get there!)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center">
            <div className="h-24 flex items-center justify-center">
              <motion.div
                className="text-5xl sm:text-7xl font-extrabold gradient-text gradient-fun"
                key={count}
                initial={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: prefersReducedMotion ? "tween" : "spring",
                  stiffness: 500,
                  damping: 15,
                  duration: prefersReducedMotion ? 0.1 : undefined,
                }}
              >
                {count.toLocaleString()}
              </motion.div>
            </div>

            <div className="h-20 flex items-center justify-center w-full max-w-md">
              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    className="bg-gradient-to-r from-fun-purple to-fun-pink p-4 rounded-xl text-center w-full shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <p className="text-white font-bold">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                      top: "-5%",
                      left: `${Math.random() * 100}%`,
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                      width: `${Math.random() * 1 + 0.5}rem`,
                      height: `${Math.random() * 1 + 0.5}rem`,
                    }}
                    animate={{
                      top: "105%",
                      rotate: Math.random() * 720,
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <motion.button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-fun-yellow to-fun-orange text-black font-bold shadow-md border-2 border-black"
                onClick={() => setCount((prev) => prev + 1)}
                disabled={autoCount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <span className="mr-2">Count Up</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M12 5L6 11M12 5L18 11"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </motion.button>

              <motion.button
                className={`px-6 py-3 rounded-full font-bold shadow-md border-2 border-black ${
                  autoCount
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    : "bg-gradient-to-r from-fun-purple to-fun-pink text-white"
                }`}
                onClick={() => setAutoCount(!autoCount)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {autoCount ? "Stop Counting" : "Auto Count"}
              </motion.button>
            </div>

            {autoCount && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md"
                  onClick={decreaseSpeed}
                  disabled={speed === 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 9L12 16L5 9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="ml-1">Slower</span>
                </motion.button>
                <div className="text-lg font-medium min-w-[100px] text-center bg-white dark:bg-neutral-700 px-4 py-2 rounded-full shadow-inner">
                  Speed: {speed}x
                </div>
                <motion.button
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-md"
                  onClick={increaseSpeed}
                  disabled={speed === 10}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-1">Faster</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 15L12 8L19 15"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <motion.button
          className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 text-neutral-800 dark:text-white font-bold shadow-md"
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset Counter
          </span>
        </motion.button>
      </div>

      <motion.div
        className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-t border-blue-200 dark:border-blue-800/50"
        whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex justify-center sm:justify-start">
            <div className="bg-blue-500 rounded-full p-2 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.5 9L11 12L8.5 15M13 15H15.5M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-200">What&apos;s happening?</h3>
            <p className="text-blue-900 dark:text-blue-100">
              We&apos;re counting up, one number at a time. But no matter how high we count or how fast we go, we&apos;ll never
              reach infinity! That&apos;s because:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-900 dark:text-blue-100">
              <li>Infinity is not a specific number - it&apos;s the concept of endlessness</li>
              <li>No matter how big a number gets, infinity is always bigger</li>
              <li>Even if we counted forever, we&apos;d always be at a finite number</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

