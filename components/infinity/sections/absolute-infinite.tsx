"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AbsoluteInfinite() {
  const [step, setStep] = useState(0)
  const [showStars, setShowStars] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNextStep = () => {
    if (step < 3) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setShowStars(false)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(0)
      setShowStars(false)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="card">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <motion.div
            className="mr-4 text-4xl"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            ⚡
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text gradient-primary">The Absolute Infinite</h2>
            <p className="text-gray-600 dark:text-gray-300">The biggest infinity of them all!</p>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">What is the Absolute Infinite?</h3>
                  <p>
                    The Absolute Infinite is a concept that goes beyond all other infinities. It&apos;s so big that it can&apos;t
                    even be properly described using mathematics!
                  </p>
                  <div className="flex justify-center my-6">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      <div className="text-6xl gradient-text gradient-accent">∞</div>
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          ease: "linear",
                        }}
                      >
                        <div className="w-16 h-16 rounded-full border-4 border-yellow-400 dark:border-yellow-500 opacity-50"></div>
                      </motion.div>
                    </motion.div>
                  </div>
                  <p>
                    Georg Cantor, who created the theory of infinite numbers, believed that the Absolute Infinite was
                    beyond human understanding and could only be fully comprehended by God!
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Beyond All Alephs</h3>
                  <p>
                    Remember how we learned about the aleph numbers (ℵ₀, ℵ₁, ℵ₂, ...)? Each one is a bigger infinity
                    than the ones before it. But the Absolute Infinite is bigger than ALL of them combined!
                  </p>
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md my-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-end mb-4">
                        {["ℵ₀", "ℵ₁", "ℵ₂", "ℵ₃", "..."].map((num, i) => (
                          <motion.div
                            key={i}
                            className="mx-1 bg-gradient-to-b from-purple-300 to-purple-500 dark:from-purple-700 dark:to-purple-500 rounded-lg flex items-center justify-center font-bold p-1 text-sm"
                            style={{ height: `${(i + 1) * 15}px`, width: `${30 + i * 5}px` }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                      <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 mb-6" />
                      <motion.div
                        className="bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-400 rounded-lg p-3 font-bold text-center"
                        initial={{ scale: 0 }}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          delay: 0.5,
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        Absolute Infinite
                        <div className="text-xs font-normal mt-1">Beyond all alephs!</div>
                      </motion.div>
                    </div>
                  </motion.div>
                  <p>
                    The Absolute Infinite is so large that if you tried to assign it a specific size (like an aleph
                    number), you would run into contradictions and paradoxes!
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Paradoxes of the Infinite</h3>
                  <p>When we try to work with the Absolute Infinite, we run into mind-bending paradoxes!</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <h4 className="font-bold text-center mb-2">Burali-Forti Paradox</h4>
                      <p className="text-sm">
                        If we try to create the &quot;set of all ordinal numbers,&quot; we get a contradiction! This set would
                        need to contain itself, which leads to logical problems.
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <h4 className="font-bold text-center mb-2">Russell&apos;s Paradox</h4>
                      <p className="text-sm">
                        Consider the &quot;set of all sets that don&apos;t contain themselves.&quot; Should this set contain itself?
                        Either answer leads to a contradiction!
                      </p>
                    </motion.div>
                  </div>
                  <p>
                    These paradoxes show us that there are limits to what we can define mathematically. The Absolute
                    Infinite lies beyond these limits!
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">The Infinite Journey</h3>
                  <p>
                    Our journey through infinity has taken us from countable infinity (ℵ₀) to uncountable infinity (ℵ₁)
                    and beyond, all the way to the Absolute Infinite!
                  </p>
                  <div className="relative h-40 my-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="text-6xl font-bold gradient-text gradient-primary"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        ∞
                      </motion.div>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      Finite
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 left-1/4 text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      ℵ₀
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 left-1/2 text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      ℵ₁
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 left-3/4 text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      ℵ₂...
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 right-0 text-lg font-bold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      Absolute
                    </motion.div>
                    <motion.div
                      className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.2, duration: 1 }}
                    />
                    {[0, 1 / 4, 1 / 2, 3 / 4, 1].map((pos, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-0 h-6 w-0.5"
                        style={{
                          left: `${pos * 100}%`,
                          backgroundColor:
                            i === 0
                              ? "#3B82F6"
                              : i === 1
                                ? "#8B5CF6"
                                : i === 2
                                  ? "#D946EF"
                                  : i === 3
                                    ? "#EC4899"
                                    : "#EAB308",
                        }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1.2 + i * 0.2, duration: 0.5 }}
                      />
                    ))}
                  </div>
                  <p className="text-center font-medium">
                    The study of infinity shows us that mathematics is an endless adventure, with new discoveries
                    waiting around every corner!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showStars && (
              <motion.div
                className="relative bg-black rounded-xl min-h-[12rem] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, Math.random() * 2 + 1, 1],
                        opacity: [0.2, 1, 0.2],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: Math.random() * 5,
                      }}
                    />
                  ))}
                </div>
                <div className="relative z-10 p-6 text-center text-white">
                  <h3 className="font-bold text-xl mb-4">The Universe and Beyond</h3>
                  <p>
                    Just like the stars in the night sky seem to go on forever, the concept of infinity stretches our
                    minds to contemplate the boundless.
                  </p>
                  <p className="mt-2">The Absolute Infinite reminds us that there will always be more to discover!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-between gap-2">
            <motion.button
              className="btn btn-outline"
              onClick={() => setShowStars(!showStars)}
              disabled={isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showStars ? "Hide" : "Show"} Cosmic Perspective
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

