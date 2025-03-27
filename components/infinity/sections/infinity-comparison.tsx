"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScaleIcon } from "../icons/tab-icons"

// Fun component to explain different number types
function NumberTypesExplainer({ onClose }: { onClose: () => void }) {
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("modal-backdrop")) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-4 border-fun-purple p-4 sm:p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-transparent bg-clip-text">
          Number Families! 🔢
        </h3>
        <motion.button
          onClick={onClose}
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-2"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl border-2 border-blue-300 dark:border-blue-700"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🔢</span>
            <h4 className="font-bold text-blue-600 dark:text-blue-400">Natural Numbers</h4>
          </div>
          <p className="text-sm">The counting numbers: 1, 2, 3, 4, 5, ...</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {[1, 2, 3, 4, "..."].map((num, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-white dark:bg-blue-800 rounded-full flex items-center justify-center font-bold shadow-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl border-2 border-green-300 dark:border-green-700"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">➖</span>
            <h4 className="font-bold text-green-600 dark:text-green-400">Integers</h4>
          </div>
          <p className="text-sm">Natural numbers, zero, and negative numbers</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["...", -2, -1, 0, 1, 2, "..."].map((num, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-white dark:bg-green-800 rounded-full flex items-center justify-center font-bold shadow-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-2xl border-2 border-purple-300 dark:border-purple-700"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🍕</span>
            <h4 className="font-bold text-purple-600 dark:text-purple-400">Rational Numbers</h4>
          </div>
          <p className="text-sm">Numbers that can be written as fractions (p/q)</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["1/2", "3/4", "-5/2", "1.5", "0.333..."].map((num, i) => (
              <motion.div
                key={i}
                className="min-w-8 px-2 h-8 bg-white dark:bg-purple-800 rounded-full flex items-center justify-center font-bold shadow-sm text-xs"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-2xl border-2 border-pink-300 dark:border-pink-700"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🌈</span>
            <h4 className="font-bold text-pink-600 dark:text-pink-400">Real Numbers</h4>
          </div>
          <p className="text-sm">All numbers on the number line (including irrational numbers)</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["π", "√2", "e", "0.101001000..."].map((num, i) => (
              <motion.div
                key={i}
                className="min-w-8 px-2 h-8 bg-white dark:bg-pink-800 rounded-full flex items-center justify-center font-bold shadow-sm text-xs"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {num}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h4 className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Fun Fact!
        </h4>
        <p>
          The real numbers (like all decimal numbers) are an <strong>uncountable infinity</strong> - there are more of
          them than there are counting numbers!
        </p>
      </motion.div>

      <div className="mt-4 flex justify-center">
        <motion.button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-fun-purple to-fun-pink text-white rounded-full font-bold shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          I understand! Let&apos;s compare infinities!
        </motion.button>
      </div>
    </motion.div>
  )
}

export function InfinityComparison() {
  const [step, setStep] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showNumberTypes, setShowNumberTypes] = useState(false)

  const handleNextStep = () => {
    if (step < 3) {
      setIsAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setShowExplanation(false)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleReset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(0)
      setShowExplanation(false)
      setIsAnimating(false)
    }, 300)
  }

  // Content for each step
  const steps = [
    {
      title: "Different Types of Infinity",
      content: (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-2 border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Number Families</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <motion.div
                className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">🔢</span>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">Natural Numbers</h4>
                </div>
                <p className="text-sm">1, 2, 3, 4, 5, ...</p>
              </motion.div>

              <motion.div
                className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">➖</span>
                  <h4 className="font-bold text-green-600 dark:text-green-400">Integers</h4>
                </div>
                <p className="text-sm">..., -2, -1, 0, 1, 2, ...</p>
              </motion.div>

              <motion.div
                className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">🍕</span>
                  <h4 className="font-bold text-purple-600 dark:text-purple-400">Rational Numbers</h4>
                </div>
                <p className="text-sm">Fractions like 1/2, 3/4, 0.75</p>
              </motion.div>

              <motion.div
                className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-2xl"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">🌈</span>
                  <h4 className="font-bold text-pink-600 dark:text-pink-400">Real Numbers</h4>
                </div>
                <p className="text-sm">All numbers including π, √2, etc.</p>
              </motion.div>
            </div>

            <motion.div
              className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-medium text-center">
                <span className="text-xl mr-2">❓</span>
                Which set has more numbers: the counting numbers or all real numbers?
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <motion.div
              className="flex-1 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-5 rounded-3xl shadow-md border-2 border-blue-300 dark:border-blue-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="font-bold text-lg text-center text-blue-700 dark:text-blue-300 mb-3">Counting Numbers</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 4, 5, "..."].map((num, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 bg-white dark:bg-blue-800 rounded-full flex items-center justify-center font-bold shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 text-center text-blue-700 dark:text-blue-300">Also called &quot;Natural Numbers&quot;</p>
            </motion.div>

            <motion.div
              className="flex-1 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 p-5 rounded-3xl shadow-md border-2 border-purple-300 dark:border-purple-700"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="font-bold text-lg text-center text-purple-700 dark:text-purple-300 mb-3">Real Numbers</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {["π", "√2", "0.333...", "42", "-7.5"].map((num, i) => (
                  <motion.div
                    key={i}
                    className="min-w-10 px-2 h-10 bg-white dark:bg-purple-800 rounded-full flex items-center justify-center font-bold shadow-sm text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 text-center text-purple-700 dark:text-purple-300">All numbers on the number line</p>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: "Can We Match Them Up?",
      content: (
        <div className="space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-2 border-blue-200 dark:border-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Let&apos;s Try to Pair Them Up</h3>

            <p className="mb-4">
              If two sets have the same size, we should be able to match each item from one set with exactly one item
              from the other set.
            </p>

            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-md">
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 top-1/2 -translate-y-1/2"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />

                <div className="flex justify-between relative">
                  {[1, 2, 3, 4, 5].map((num, i) => (
                    <motion.div
                      key={i}
                      className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center font-bold shadow-md z-10 border-2 border-blue-300 dark:border-blue-600"
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>

                {[1, 2, 3, 4, 5].map((num  , i) => (
                  <motion.div
                    key={i}
                    className="absolute h-16 border-l-2 border-dashed border-gray-400 dark:border-gray-500"
                    style={{ left: `${(i * 25) - 12.5 + 6.25}%` }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 80, opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                ))}

                <div className="flex justify-between relative mt-20">
                  {["0.5", "0.25", "0.333...", "0.125", "0.2"].map((num, i) => (
                    <motion.div
                      key={i}
                      className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10 border-2 border-purple-300 dark:border-purple-600"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <p className="font-medium text-center">
                <span className="text-xl mr-2">🤔</span>
                But wait! What about all the other real numbers? There are infinitely many real numbers between any two
                numbers!
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 p-5 rounded-3xl shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-full max-w-md h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div className="absolute -top-8 left-1/4 transform -translate-x-1/2 text-center">
                  <div className="font-bold">0.25</div>
                  <div className="w-0.5 h-4 bg-gray-400 dark:bg-gray-500 mx-auto mt-1"></div>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="font-bold">0.5</div>
                  <div className="w-0.5 h-4 bg-gray-400 dark:bg-gray-500 mx-auto mt-1"></div>
                </div>
                <div className="absolute -top-8 left-3/4 transform -translate-x-1/2 text-center">
                  <div className="font-bold">0.75</div>
                  <div className="w-0.5 h-4 bg-gray-400 dark:bg-gray-500 mx-auto mt-1"></div>
                </div>

                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 w-1 h-1 bg-red-500 rounded-full"
                    style={{ left: `${Math.random() * 100}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + i * 0.05 }}
                  />
                ))}
              </div>
            </div>

            <p className="text-center font-medium">
              Between any two real numbers, there are infinitely many more real numbers!
            </p>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Cantor&apos;s Diagonal Argument",
      content: (
        <div className="space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-2 border-blue-200 dark:border-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Cantor&apos;s Clever Proof</h3>

            <p className="mb-4">
              Mathematician Georg Cantor found a brilliant way to prove that there are more real numbers than counting
              numbers.
            </p>

            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl mb-4">
              <p className="font-medium mb-2">Imagine we try to list ALL decimal numbers between 0 and 1:</p>

              <div className="font-mono text-sm overflow-x-auto space-y-1">
                {[
                  ["1st number:", "0.", "5", "1234..."],
                  ["2nd number:", "0.", "3", "7654..."],
                  ["3rd number:", "0.", "8", "2468..."],
                  ["4th number:", "0.", "2", "9753..."],
                  ["5th number:", "0.", "6", "1357..."],
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    className="flex"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <span className="w-24 text-gray-500 dark:text-gray-400">{row[0]}</span>
                    <span>{row[1]}</span>
                    <motion.span
                      className="text-red-500 font-bold"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: i * 0.2,
                      }}
                    >
                      {row[2]}
                    </motion.span>
                    <span>{row[3]}</span>
                  </motion.div>
                ))}
                <div className="text-center">...</div>
              </div>
            </div>

            <motion.div
              className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-medium">
                <span className="text-xl mr-2">💡</span>
                Now we create a NEW number by changing each digit on the diagonal (in red):
              </p>
              <p className="mt-2 font-mono text-center">
                0.
                <motion.span
                  className="text-red-500 font-bold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  46913
                </motion.span>
                ...
              </p>
              <p className="mt-2">(We changed 5→4, 3→6, 8→9, 2→1, 6→3, etc.)</p>
            </motion.div>

            <motion.div
              className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl border border-green-200 dark:border-green-800"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="font-medium text-center">
                This new number can&apos;t be on our list! It differs from the 1st number in the 1st digit, from the 2nd
                number in the 2nd digit, and so on.
              </p>
              <p className="mt-2 text-center font-bold">
                This proves there are more real numbers than counting numbers!
              </p>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Different Sizes of Infinity",
      content: (
        <div className="space-y-6">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border-2 border-blue-200 dark:border-blue-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">The Amazing Conclusion!</h3>

            <p className="mb-6 text-center">
              Mathematicians use special symbols to represent different sizes of infinity:
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <motion.div
                className="flex-1 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-5 rounded-3xl shadow-md"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-2">
                  <motion.div
                    className="w-16 h-16 bg-white dark:bg-blue-800 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-300 dark:border-blue-600"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    <span className="text-3xl font-bold">ℵ₀</span>
                  </motion.div>
                </div>
                <h4 className="font-bold text-lg text-center text-blue-700 dark:text-blue-300 mb-2">
                  Countable Infinity
                </h4>
                <p className="text-center">The size of the set of counting numbers (1, 2, 3, ...)</p>
                <div className="mt-3 bg-blue-200 dark:bg-blue-800 p-2 rounded-lg">
                  <p className="text-center text-sm">
                    Also includes integers, rational numbers, and other &quot;listable&quot; sets
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex-1 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 p-5 rounded-3xl shadow-md"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-center mb-2">
                  <motion.div
                    className="w-16 h-16 bg-white dark:bg-purple-800 rounded-full flex items-center justify-center shadow-lg border-2 border-purple-300 dark:border-purple-600"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                  >
                    <span className="text-3xl font-bold">ℵ₁</span>
                  </motion.div>
                </div>
                <h4 className="font-bold text-lg text-center text-purple-700 dark:text-purple-300 mb-2">
                  Uncountable Infinity
                </h4>
                <p className="text-center">The size of the set of real numbers (all decimal numbers)</p>
                <div className="mt-3 bg-purple-200 dark:bg-purple-800 p-2 rounded-lg">
                  <p className="text-center text-sm">Too many to list - a bigger infinity!</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-bold text-lg text-center mb-2">Mind-Blowing Fact!</h4>
              <p className="text-center">
                There are infinitely many different sizes of infinity! Each one is bigger than the last!
              </p>
              <div className="flex justify-center mt-3">
                <div className="flex items-end space-x-2">
                  {["ℵ₀", "ℵ₁", "ℵ₂", "ℵ₃", "..."].map((symbol, i) => (
                    <motion.div
                      key={i}
                      className="bg-white dark:bg-yellow-800 px-3 py-1 rounded-lg flex items-center justify-center font-bold shadow-sm"
                      style={{ height: `${(i + 1) * 20}px` }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
  ]

  return (
    <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex justify-center sm:justify-start">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <ScaleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-fun-teal" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-fun-orange rounded-full shadow-md"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center sm:text-left">
              <span className="bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-transparent bg-clip-text">
                Comparing Infinities
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1 text-center sm:text-left">
              Let&apos;s see how some infinities are bigger than others!
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange"
            initial={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Step title */}
        <motion.div
          key={`title-${step}`}
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-fun-teal to-fun-green text-transparent bg-clip-text">
              {steps[step].title}
            </span>
          </h3>
        </motion.div>

        <div className="flex justify-center mb-4">
          <motion.button
            onClick={() => setShowNumberTypes(true)}
            className="px-4 py-2 bg-gradient-to-r from-fun-blue to-fun-teal text-white rounded-full text-sm font-medium shadow-md flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">🔢</span>
            What are these different number types?
          </motion.button>
        </div>

        <AnimatePresence>
          {showNumberTypes && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <NumberTypesExplainer onClose={() => setShowNumberTypes(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              className="mt-6 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 p-6 rounded-3xl shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-300">Explanation:</h3>
              {step === 0 && (
                <p>
                  Different types of numbers help us understand infinity. While natural numbers, integers, and rational
                  numbers are all &quot;countably infinite&quot; (size ℵ₀), the real numbers are &quot;uncountably infinite&quot;
                  (size ℵ₁) - a bigger infinity!
                </p>
              )}
              {step === 1 && (
                <p>
                  No matter how we try to pair up counting numbers with real numbers, we&apos;ll always miss some real
                  numbers. That&apos;s because there are infinitely many real numbers between any two numbers on the number
                  line!
                </p>
              )}
              {step === 2 && (
                <p>
                  Cantor&apos;s diagonal argument is a clever proof that shows no matter how we try to list all real numbers,
                  we can always construct a new real number that&apos;s not on our list. This proves that real numbers are
                  &quot;uncountably infinite&quot; - a bigger infinity than counting numbers!
                </p>
              )}
              {step === 3 && (
                <p>
                  Mathematicians use different symbols (like ℵ₀ and ℵ₁) to represent different sizes of infinity. There
                  are actually infinitely many different sizes of infinity! This amazing discovery by Georg Cantor
                  changed mathematics forever.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex flex-wrap justify-between gap-2 mt-6">
          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow-md flex items-center"
            onClick={() => setShowExplanation(!showExplanation)}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {showExplanation ? "Hide" : "Show"} Explanation
          </motion.button>

          {step < steps.length - 1 ? (
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-fun-purple via-fun-pink to-fun-orange text-white rounded-full shadow-md flex items-center"
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
              Next Step
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          ) : (
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-md flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Complete!
            </motion.button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-indigo-950">
        <motion.button
          className="w-full px-4 py-2 bg-gradient-to-r
           from-blue-200 to-indigo-300 dark:from-rose-700
            dark:to-indigo-600 text-gray-800 dark:text-white rounded-full shadow-md flex items-center justify-center"
          onClick={handleReset}
          disabled={isAnimating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Start Over
        </motion.button>
      </div>
    </div>
  )
}

