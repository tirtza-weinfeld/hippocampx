"use client"

import { motion } from "framer-motion"
import { InfinityIcon } from "../icons/tab-icons"
import { useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type LearnSectionProps = {
  onExplore: () => void
}

export function LearnSection({ onExplore }: LearnSectionProps) {
  const [showFunFact, setShowFunFact] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-8">
      <motion.div
        className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex justify-center sm:justify-start">
              <motion.div
                className="text-5xl text-fun-yellow"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.2, 1, 1.2, 1],
                      }
                }
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <InfinityIcon className="w-16 h-16 sm:w-20 sm:h-20" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-fun-pink rounded-full"
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
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-center sm:text-left">
                What is Infinity?
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-1 text-center sm:text-left">
                Infinity is not just a really big number - it&apos;s endless!
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-base sm:text-lg">
              Imagine counting: 1, 2, 3, 4, 5... and never stopping. That&apos;s infinity! It&apos;s not a specific number,
              but rather the concept of something that goes on forever without end. The symbol for infinity looks like this:
              <motion.span
                className="text-2xl sm:text-3xl inline-block ml-2 text-fun-purple"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 5, 0],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                ∞
              </motion.span>
            </p>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-fun-yellow to-fun-orange p-4 sm:p-6 shadow-lg"
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowFunFact(!showFunFact)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex justify-center sm:justify-start">
                <div className="bg-white rounded-full p-2 shadow-md">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-black">Fun Fact:</h3>
                <p className="text-black font-medium">
                  {showFunFact
                    ? "The infinity symbol (∞) was introduced by the English mathematician John Wallis in 1655!"
                    : "Did you know there are different sizes of infinity? Some infinities are bigger than others!"}
                </p>
                <p className="text-sm mt-2 text-black">
                  {showFunFact ? "Click for another fact!" : "Click to learn more!"}
                </p>
              </div>
            </div>

            <motion.div
              className="absolute -bottom-6 -right-6 w-24 h-24"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      rotate: [0, 360],
                    }
              }
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M50,10 L53,40 L83,50 L53,60 L50,90 L47,60 L17,50 L47,40 Z"
                  fill="#FFD600"
                  stroke="#000000"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              className="rounded-xl bg-gradient-to-r from-fun-orange to-fun-yellow p-4 sm:p-6 shadow-lg"
              initial={{ x: prefersReducedMotion ? 0 : -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex justify-center sm:justify-start">
                  <div className="bg-white rounded-full p-2 shadow-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7 16V4M17 8V20M3 8H11M13 16H21"
                        stroke="#000000"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-black">Countable Infinity</h4>
                  <p className="text-black">
                    This is like all the counting numbers (1, 2, 3...) that go on forever. We call this &quot;countable&quot;
                    because we can list them in order, even though we&apos;d never finish counting! Mathematicians call this
                    ℵ₀ (aleph-null).
                  </p>
                </div>
              </div>

              <motion.div
                className="mt-4 flex justify-center"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        x: [0, 10, 0],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {[1, 2, 3, "...", "∞"].map((num, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-black shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="rounded-xl bg-gradient-to-r from-fun-purple to-fun-pink p-4 sm:p-6 shadow-lg"
              initial={{ x: prefersReducedMotion ? 0 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex justify-center sm:justify-start">
                  <div className="bg-white rounded-full p-2 shadow-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 6H5M5 6H21M5 6V20M5 20H21M21 6V20M9 12H10M10 12H11M10 12V11M10 12V13M15 9H14M14 9H13M14 9V10M14 9V8M15 15H14M14 15H13M14 15V16M14 15V14"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Uncountable Infinity</h4>
                  <p className="text-white">
                    This is like all the points on a line or all possible decimal numbers. There are so many that we
                    can&apos;t even list them in order - it&apos;s a bigger infinity! Mathematicians call this ℵ₁ (aleph-one).
                  </p>
                </div>
              </div>

              <motion.div
                className="mt-4 flex justify-center"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.05, 1],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="h-10 w-full bg-white rounded-full relative shadow-md">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-0 h-full w-1 bg-fun-pink"
                      style={{ left: `${i * 10}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    />
                  ))}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold">Infinite Points!</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8">
            <motion.button
              className="px-8 py-4 rounded-full bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-white text-xl font-bold shadow-lg border-4 border-white dark:border-neutral-800"
              onClick={onExplore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            >
              <span className="mr-2">Let&apos;s Play With Infinity!</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

