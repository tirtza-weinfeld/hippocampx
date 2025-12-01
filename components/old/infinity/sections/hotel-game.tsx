"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BuildingIcon } from "../icons/tab-icons"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function HotelGame() {
  const [, setRooms] = useState(10)
  const [guests, setGuests] = useState(10)
  const [newGuests, setNewGuests] = useState(0)
  const [message, setMessage] = useState("")
  const [showSolution, setShowSolution] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (showTutorial) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("modal-backdrop")) {
          setShowTutorial(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showTutorial])

  const handleAddGuest = () => {
    setNewGuests(1)
    setMessage(
      "A new guest arrived! Even though we have infinite rooms, each room already has a guest. Can you find a way to accommodate the new guest?",
    )
    setShowSolution(false)
  }

  const handleAddBusload = () => {
    setNewGuests(10)
    setMessage(
      `A bus with ${10} new guests arrived! All our infinite rooms already have guests. Can you find a way to accommodate all the new guests?`,
    )
    setShowSolution(false)
  }

  const handleSolve = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setShowSolution(true)
      setGuests(guests + newGuests)
      setMessage(`Amazing! You found room for everyone in the Infinity Hotel!`)
      setIsAnimating(false)
    }, 1500)
  }

  const handleReset = () => {
    setRooms(10)
    setGuests(10)
    setNewGuests(0)
    setMessage("")
    setShowSolution(false)
    setIsAnimating(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 relative">
      {showTutorial && (
        <div className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center p-4 modal-backdrop">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 gradient-text gradient-fun">How Hilbert&apos;s Infinity Hotel Works</h3>
            <p className="mb-3 text-gray-800 dark:text-gray-200">
              Imagine a hotel with <strong>infinite</strong> rooms, numbered 1, 2, 3, and so on forever.
            </p>
            <p className="mb-3 text-gray-800 dark:text-gray-200">
              In this thought experiment, every room already has a guest. But here&apos;s the amazing part: we can still fit
              more guests!
            </p>
            <p className="mb-3 text-gray-800 dark:text-gray-200">
              When new guests arrive, we can ask each existing guest to move to a different room according to a specific
              rule. This frees up exactly the number of rooms we need.
            </p>
            <p className="mb-3 text-gray-800 dark:text-gray-200">
              This demonstrates a key property of infinity: adding a finite number to infinity gives you the same
              infinity!
            </p>
            <div className="flex justify-end mt-4">
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-fun-purple to-fun-pink text-white rounded-lg shadow-md"
                onClick={() => setShowTutorial(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Got it!
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex justify-center sm:justify-start">
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      rotateY: [0, 180, 0],
                    }
              }
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 3,
              }}
            >
              <BuildingIcon className="w-16 h-16 sm:w-20 sm:h-20 text-fun-purple" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-fun-orange rounded-full shadow-md"
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
              Hilbert&apos;s Infinity Hotel
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1 text-center sm:text-left">
              A magical hotel with infinite rooms to teach us about countable infinity!
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-full h-48 sm:h-64 mb-6 rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-fun-purple to-fun-pink">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-full max-w-md"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: [0, -5, 0],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                      <rect x="50" y="50" width="300" height="100" fill="#FFFFFF" stroke="#000000" strokeWidth="4" />
                      <rect x="80" y="70" width="40" height="60" fill="#FFD600" stroke="#000000" strokeWidth="2" />
                      <rect x="150" y="70" width="40" height="60" fill="#FFD600" stroke="#000000" strokeWidth="2" />
                      <rect x="220" y="70" width="40" height="60" fill="#FFD600" stroke="#000000" strokeWidth="2" />
                      <rect x="290" y="70" width="40" height="60" fill="#FFD600" stroke="#000000" strokeWidth="2" />
                      <text x="100" y="40" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#FFFFFF">
                        Room 1
                      </text>
                      <text x="170" y="40" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#FFFFFF">
                        Room 2
                      </text>
                      <text x="240" y="40" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#FFFFFF">
                        Room 3
                      </text>
                      <text x="310" y="40" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#FFFFFF">
                        Room 4...
                      </text>
                      <text
                        x="200"
                        y="180"
                        fontFamily="Arial"
                        fontSize="20"
                        fontWeight="bold"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        Infinity Hotel
                      </text>
                    </svg>
                  </motion.div>
                </div>

                {/* Animated guests */}
                {isAnimating && (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        initial={{ x: 80 + i * 70, y: 100 }}
                        animate={{ x: 80 + (i + 1) * 70, y: 100 }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      >
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="8" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                          <path
                            d="M5 21C5 16.5817 8.13401 13 12 13C15.866 13 19 16.5817 19 21"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                        </svg>
                      </motion.div>
                    ))}
                  </>
                )}

                {/* New guest */}
                {newGuests > 0 && !showSolution && (
                  <motion.div
                    className="absolute bottom-10 left-10"
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: [0, -5, 0],
                          }
                    }
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="5" fill="#FFD600" stroke="#000000" strokeWidth="2" />
                      <path
                        d="M5 21C5 16.5817 8.13401 13 12 13C15.866 13 19 16.5817 19 21"
                        stroke="#FFD600"
                        strokeWidth="2"
                      />
                      <text
                        x="12"
                        y="9"
                        fontFamily="Arial"
                        fontSize="6"
                        fontWeight="bold"
                        fill="#000000"
                        textAnchor="middle"
                      >
                        ?
                      </text>
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <span className="text-lg font-bold">
                Current guests: <span className="text-fun-purple">{guests}</span> (infinite)
              </span>
            </div>

            <div className="min-h-24 flex items-center justify-center w-full max-w-md mb-4">
              <AnimatePresence mode="wait">
                {newGuests > 0 && !showSolution && (
                  <motion.div
                    className="p-4 rounded-xl text-center w-full shadow-lg bg-gradient-to-r from-red-500 to-red-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <p className="font-bold text-white">{message}</p>
                  </motion.div>
                )}

                {showSolution && (
                  <motion.div
                    className="p-4 rounded-xl text-center w-full shadow-lg bg-gradient-to-r from-green-500 to-green-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <h3 className="font-bold text-lg mb-2 text-white">Here&apos;s the solution:</h3>
                    <p className="text-white">
                      Ask each guest to move from room N to room N+{newGuests === 1 ? "1" : newGuests}. This frees up
                      rooms 1{newGuests > 1 ? ` through ${newGuests}` : ""} for the new guest{newGuests > 1 ? "s" : ""}!
                    </p>
                    <p className="mt-2 font-bold text-white">
                      This works because both infinity and infinity + {newGuests} are the same size of infinity!
                    </p>
                    <p className="mt-2 text-white text-sm">
                      Mathematically: ℵ₀ + {newGuests} = ℵ₀ (where ℵ₀ is &quot;aleph-null&quot;, the size of countable infinity)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <motion.button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-fun-yellow to-fun-orange text-black font-bold shadow-md border-2 border-black"
                onClick={handleAddGuest}
                disabled={(newGuests > 0 && !showSolution) || isAnimating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M12 4V20M4 12H20"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add 1 Guest
                </span>
              </motion.button>

              <motion.button
                className="px-6 py-3 rounded-full bg-gradient-to-r from-fun-purple to-fun-pink text-white font-bold shadow-md border-2 border-black"
                onClick={handleAddBusload}
                disabled={(newGuests > 0 && !showSolution) || isAnimating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M16 3H1V16H16V3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 8H20L23 11V16H16V8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Add Busload (10)
                </span>
              </motion.button>

              {newGuests > 0 && !showSolution && (
                <motion.button
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-fun-green to-fun-teal text-white font-bold shadow-md border-2 border-black"
                  onClick={handleSolve}
                  disabled={isAnimating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.05, 1],
                        }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <span className="flex items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M9.5 14.5L11.5 16.5L14.5 12.5M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Show Solution
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl border border-purple-200 dark:border-purple-800/50 mt-8 shadow-md">
            <h3 className="font-bold text-lg mb-2 text-purple-800 dark:text-purple-200">What&apos;s happening here?</h3>
            <p className="mb-2 text-purple-900 dark:text-purple-100">
              In Hilbert&apos;s Infinity Hotel, we have <strong>infinitely many rooms</strong>, numbered 1, 2, 3, and so on.
              Even though all rooms are occupied (with infinitely many guests), we can still accommodate more guests!
            </p>
            <p className="mb-2 text-purple-900 dark:text-purple-100">
              When a new guest arrives, we ask each existing guest to move from room N to room N+1. This frees up room 1
              for our new guest.
            </p>
            <p className="text-purple-900 dark:text-purple-100">
              This demonstrates a key property of infinity: <strong>ℵ₀ + 1 = ℵ₀</strong>. In other words, adding a
              finite number to a countable infinity gives you the same countable infinity!
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <motion.button
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white font-bold shadow-md"
              onClick={handleReset}
              disabled={isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
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
                Reset Hotel
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
