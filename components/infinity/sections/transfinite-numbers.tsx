"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function TransfiniteNumbers() {
  const [step, setStep] = useState(0)
  const [showExample, setShowExample] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNextStep = () => {
    if (step < 3) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setShowExample(false)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(0)
      setShowExample(false)
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
              rotateY: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 3,
            }}
          >
            🔄
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text gradient-primary">Transfinite Numbers</h2>
            <p className="text-gray-600 dark:text-gray-300">Numbers that are bigger than any finite number!</p>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">What are Transfinite Numbers?</h3>
                  <p>
                    Transfinite numbers are numbers that are larger than all finite numbers, but they&apos;re still not the
                    &quot;absolute infinite.&quot; They were invented by mathematician Georg Cantor in the late 19th century.
                  </p>
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <p className="text-center font-medium">
                      Transfinite numbers help us understand and compare different sizes of infinity!
                    </p>
                  </motion.div>
                  <div className="flex justify-center mt-4">
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
                      ω
                    </motion.div>
                  </div>
                  <p className="text-center">
                    The Greek letter omega (ω) represents the first transfinite number - it&apos;s bigger than any counting
                    number!
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Ordinal Numbers</h3>
                  <p>
                    Ordinal numbers tell us the position of something in a sequence. Like first, second, third, and so
                    on. Transfinite ordinals continue this sequence beyond the finite numbers!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 my-4">
                    {[
                      "1st",
                      "2nd",
                      "3rd",
                      "4th",
                      "...",
                      "ω",
                      "ω+1",
                      "ω+2",
                      "...",
                      "ω·2",
                      "...",
                      "ω²",
                      "...",
                      "ω^ω",
                    ].map((num, i) => (
                      <motion.div
                        key={i}
                        className={`px-3 py-2 rounded-xl font-bold ${
                          i < 4
                            ? "bg-blue-200 dark:bg-blue-800"
                            : i < 5
                              ? "bg-blue-300 dark:bg-blue-700"
                              : "bg-purple-300 dark:bg-purple-700"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                  <p>
                    After all finite ordinals (1st, 2nd, 3rd, ...), we reach the first transfinite ordinal: ω (omega).
                    Then we can keep going with ω+1, ω+2, and even ω·2, ω², and more!
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Cardinal Numbers</h3>
                  <p>
                    Cardinal numbers tell us the size of a set - how many elements it has. Transfinite cardinals tell us
                    the size of infinite sets!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-bold text-center mb-2">Finite Cardinals</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[1, 2, 3, 4, 5, "..."].map((num, i) => (
                          <motion.div
                            key={i}
                            className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center font-bold"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-bold text-center mb-2">Transfinite Cardinals</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["ℵ₀", "ℵ₁", "ℵ₂", "..."].map((num, i) => (
                          <motion.div
                            key={i}
                            className="w-8 h-8 bg-purple-300 dark:bg-purple-700 rounded-full flex items-center justify-center font-bold"
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              delay: i * 0.2,
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            }}
                          >
                            {num}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  <p>
                    The cardinal number ℵ₀ (aleph-null) represents the size of the set of all counting numbers. ℵ₁
                    (aleph-one) represents a larger infinity, and so on.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-center">Transfinite Arithmetic</h3>
                  <p>We can do math with transfinite numbers, but the rules are different from regular numbers!</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">➕</div>
                      <div className="text-center font-bold">ℵ₀ + 1 = ℵ₀</div>
                      <p className="text-sm text-center mt-2">
                        Adding any finite number to infinity gives the same infinity!
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">✖️</div>
                      <div className="text-center font-bold">ℵ₀ × 2 = ℵ₀</div>
                      <p className="text-sm text-center mt-2">
                        Multiplying infinity by any finite number gives the same infinity!
                      </p>
                    </motion.div>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col items-center"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">➖</div>
                      <div className="text-center font-bold">ℵ₁ - ℵ₀ = ℵ₁</div>
                      <p className="text-sm text-center mt-2">
                        Subtracting a smaller infinity from a larger one leaves the larger infinity!
                      </p>
                    </motion.div>
                  </div>
                  <p className="text-center font-medium">
                    Transfinite arithmetic helps us understand how different infinities relate to each other!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showExample && (
              <motion.div
                className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 p-6 rounded-xl min-h-[4rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-lg mb-2">Fun Example:</h3>
                {step === 0 && (
                  <p>
                    Imagine you have an infinite line of dominoes that stretches as far as you can see. If you knock
                    over the first one, will the last one ever fall? There is no &quot;last&quot; domino in an infinite line! This
                    is why we need transfinite numbers to talk about positions beyond all finite positions.
                  </p>
                )}
                {step === 1 && (
                  <p>
                    Think of a library with infinite books numbered 1, 2, 3, and so on. The book at position ω would
                    come after all the finite-numbered books. Then book ω+1 would come next, and so on. It&apos;s like having
                    a &quot;super section&quot; that comes after all the regular sections!
                  </p>
                )}
                {step === 2 && (
                  <p>
                    Imagine two infinite hotels: one with rooms numbered 1, 2, 3, ... (countably infinite, size ℵ₀) and
                    another with rooms for every possible decimal number (uncountably infinite, size ℵ₁). The second
                    hotel has WAY more rooms, even though both are infinite!
                  </p>
                )}
                {step === 3 && (
                  <p>
                    If you have an infinite collection of marbles (ℵ₀) and someone gives you 100 more, you still have
                    exactly the same number of marbles (ℵ₀)! But if someone gives you an uncountable infinity of marbles
                    (ℵ₁), then you have more than before. Infinity math is weird and wonderful!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-between gap-2">
            <motion.button
              className="btn btn-outline"
              onClick={() => setShowExample(!showExample)}
              disabled={isAnimating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showExample ? "Hide" : "Show"} Fun Example
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

