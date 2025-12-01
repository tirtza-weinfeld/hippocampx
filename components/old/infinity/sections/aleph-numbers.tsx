"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function AlephNumbers() {
  const [step, setStep] = useState(0)
  const [showGame, setShowGame] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [message, setMessage] = useState("")

  const handleNextStep = () => {
    if (step < 3) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setShowGame(false)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(0)
      setShowGame(false)
      setIsAnimating(false)
      setSelectedCards([])
      setMessage("")
    }, 300)
  }

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index))
    } else {
      setSelectedCards([...selectedCards, index])

      if (index === 0 && selectedCards.length === 0) {
        setMessage("That's ℵ₀ (aleph-null), the size of counting numbers!")
      } else if (index === 1 && selectedCards.includes(0)) {
        setMessage("That's ℵ₁ (aleph-one), the size of all real numbers!")
      } else if (index === 2 && selectedCards.includes(1)) {
        setMessage("That's ℵ₂ (aleph-two), even bigger than aleph-one!")
      }
    }
  }

  return (
    <div className="card">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <motion.div
            className="mr-4 text-4xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ℵ
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text gradient-primary">Aleph Numbers</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The family of numbers that measure the size of infinite sets!
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">What are Aleph Numbers?</h3>
                  <p>
                    Aleph numbers are a special family of numbers used to describe the size of infinite sets. They&apos;re
                    named after the first letter of the Hebrew alphabet: ℵ (aleph).
                  </p>
                  <div className="flex justify-center my-6">
                    <motion.div
                      className="text-7xl font-bold gradient-text gradient-primary"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      ℵ
                    </motion.div>
                  </div>
                  <p>
                    Mathematician Georg Cantor created these numbers to help us understand that there are different
                    sizes of infinity! Each aleph number represents a different infinite size.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Aleph-Null (ℵ₀)</h3>
                  <p>
                    The smallest aleph number is ℵ₀ (aleph-null). It represents the size of the set of all counting
                    numbers (1, 2, 3, ...).
                  </p>
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md my-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <h4 className="font-bold text-center mb-2">Examples of ℵ₀-sized sets:</h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {[
                        "All counting numbers: 1, 2, 3, 4, ...",
                        "All even numbers: 2, 4, 6, 8, ...",
                        "All integers: ..., -2, -1, 0, 1, 2, ...",
                        "All fractions (rational numbers)",
                      ].map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2, duration: 0.5 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <p className="text-center font-medium">
                    All these sets have the same size: ℵ₀, even though some seem &quot;bigger&quot; than others!
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Aleph-One (ℵ₁)</h3>
                  <p>
                    The next aleph number is ℵ₁ (aleph-one). It represents a bigger infinity than ℵ₀. It&apos;s the size of
                    the set of all real numbers (all possible points on a number line).
                  </p>
                  <div className="flex justify-center my-4">
                    <div className="relative w-full max-w-md h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute top-0 h-3 w-0.5 bg-purple-500 dark:bg-purple-400"
                          style={{ left: `${i * 5}%` }}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 12, opacity: Math.random() * 0.5 + 0.5 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                        />
                      ))}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-center">
                        <span className="text-lg font-bold">ℵ₁</span>
                        <p className="text-xs">Uncountably many points!</p>
                      </div>
                    </div>
                  </div>
                  <p>
                    There are so many real numbers that they can&apos;t be put in a list or counted one by one. That&apos;s why we
                    call this &quot;uncountable infinity&quot; - it&apos;s strictly bigger than ℵ₀!
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">The Aleph Hierarchy</h3>
                  <p>
                    The aleph numbers continue: ℵ₀, ℵ₁, ℵ₂, ℵ₃, ... Each one represents a bigger infinity than the ones
                    before it!
                  </p>
                  <div className="flex justify-center my-6">
                    <div className="flex flex-col items-center">
                      <div className="flex items-end">
                        {["ℵ₀", "ℵ₁", "ℵ₂", "ℵ₃", "..."].map((num, i) => (
                          <motion.div
                            key={i}
                            className="mx-2 bg-gradient-to-b from-purple-300 to-purple-500 dark:from-purple-700 dark:to-purple-500 rounded-lg flex items-center justify-center font-bold p-2"
                            style={{ height: `${(i + 1) * 20}px`, width: `${40 + i * 5}px` }}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{
                              y: 0,
                              opacity: 1,
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              delay: i * 0.2,
                              duration: 0.5,
                              scale: {
                                delay: i * 0.2 + 1,
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              },
                            }}
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                      <div className="h-1 bg-gradient-to-r from-primary-400 to-secondary-400 w-full mt-1 rounded-full" />
                      <p className="text-center mt-2">Each aleph number represents a bigger infinity!</p>
                    </div>
                  </div>
                  <p>
                    The Continuum Hypothesis is a famous math question that asks if there&apos;s any infinity between ℵ₀ and
                    ℵ₁. Amazingly, mathematicians proved this question can&apos;t be answered with our current math rules!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showGame && (
              <motion.div
                className="bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 p-6 rounded-xl min-h-[4rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-lg mb-4 text-center">Aleph Card Game</h3>
                <p className="mb-4 text-center">Click the cards to learn about different aleph numbers!</p>

                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { symbol: "ℵ₀", name: "Aleph-null", desc: "Countable infinity" },
                    { symbol: "ℵ₁", name: "Aleph-one", desc: "Uncountable infinity" },
                    { symbol: "ℵ₂", name: "Aleph-two", desc: "Even bigger infinity" },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      onClick={() => handleCardClick(i)}
                      className={`w-24 h-32 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                        selectedCards.includes(i)
                          ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white"
                          : "bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={selectedCards.includes(i) ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="text-3xl font-bold mb-2">{card.symbol}</div>
                      <div className="text-xs text-center px-2">{card.name}</div>
                      {selectedCards.includes(i) && (
                        <motion.div
                          className="text-xs mt-1 px-1 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {card.desc}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      className="mt-4 text-center font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-between gap-2">
            <motion.button
              className="btn btn-outline"
              onClick={() => setShowGame(!showGame)}
              disabled={isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showGame ? "Hide" : "Play"} Aleph Card Game
            </motion.button>

            {step < 3 ? (
              <motion.button
                className="btn btn-primary"
                onClick={handleNextStep}
                disabled={isAnimating}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                Next Topic →
              </motion.button>
            ) : (
              <motion.button
                className="btn gradient-primary text-white"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Review Again
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

