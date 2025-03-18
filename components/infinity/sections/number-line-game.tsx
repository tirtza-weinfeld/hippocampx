"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function NumberLineGame() {
  const [zoom, setZoom] = useState(1)
  const [showingPoints, setShowingPoints] = useState(false)
  const [message, setMessage] = useState("")
  const [isZooming, setIsZooming] = useState(false)

  const handleZoomIn = () => {
    if (zoom < 4) {
      setIsZooming(true)
      setTimeout(() => {
        setZoom(zoom + 1)
        updateMessage(zoom + 1)
        setIsZooming(false)
      }, 300)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 1) {
      setIsZooming(true)
      setTimeout(() => {
        setZoom(zoom - 1)
        updateMessage(zoom - 1)
        setIsZooming(false)
      }, 300)
    }
  }

  const updateMessage = (newZoom: number) => {
    if (newZoom === 1) {
      setMessage("This is our number line. It contains all numbers from negative infinity to positive infinity!")
    } else if (newZoom === 2) {
      setMessage("As we zoom in, we can see more numbers between the whole numbers, like 1.5 or 2.75!")
    } else if (newZoom === 3) {
      setMessage(
        "Zooming in more reveals even more numbers! Between any two numbers, there are infinitely many more numbers!",
      )
    } else if (newZoom === 4) {
      setMessage(
        "No matter how much we zoom in, we'll always find more numbers between any two points. This is uncountable infinity!",
      )
    }
  }

  const handleReset = () => {
    setZoom(1)
    setShowingPoints(false)
    setMessage("This is our number line. It contains all numbers from negative infinity to positive infinity!")
    setIsZooming(false)
  }

  const handleTogglePoints = () => {
    setShowingPoints(!showingPoints)
  }

  return (
    <div className="card mt-8">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <motion.div
            className="mr-4 text-4xl"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            📏
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold gradient-text gradient-primary">The Infinite Number Line</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Explore how there are infinitely many numbers between any two points!
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-gradient-to-r from-secondary-100 to-secondary-200 dark:from-secondary-900/50 dark:to-secondary-800/50 p-6 rounded-xl mb-4 min-h-[4rem]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p>
              {message ||
                "This is our number line. It contains all numbers from negative infinity to positive infinity!"}
            </p>
          </motion.div>

          <div className="relative h-24 flex flex-col items-center justify-center">
            {/* Number line */}
            <motion.div
              className="w-full h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full relative"
              animate={isZooming ? { scale: 1.5, opacity: 0.5 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Markers based on zoom level */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`zoom-level-${zoom}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {zoom === 1 && (
                    <>
                      {[-3, -2, -1, 0, 1, 2, 3].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute top-0 h-4 w-1 bg-gray-800 dark:bg-gray-200"
                          style={{ left: `${(num + 3) * 14.28}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: 16 }}
                          transition={{ delay: (num + 3) * 0.1, duration: 0.3 }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm">{num}</div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {zoom === 2 && (
                    <>
                      {[0, 0.5, 1, 1.5, 2].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute top-0 h-4 w-1 bg-gray-800 dark:bg-gray-200"
                          style={{ left: `${num * 25}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: 16 }}
                          transition={{ delay: num * 0.1, duration: 0.3 }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm">{num}</div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {zoom === 3 && (
                    <>
                      {[1, 1.1, 1.2, 1.3, 1.4, 1.5].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute top-0 h-4 w-1 bg-gray-800 dark:bg-gray-200"
                          style={{ left: `${(num - 1) * 100}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: 16 }}
                          transition={{ delay: (num - 1) * 0.2, duration: 0.3 }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm">{num.toFixed(1)}</div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {zoom === 4 && (
                    <>
                      {[1.0, 1.02, 1.04, 1.06, 1.08, 1.1].map((num) => (
                        <motion.div
                          key={num}
                          className="absolute top-0 h-4 w-1 bg-gray-800 dark:bg-gray-200"
                          style={{ left: `${(num - 1) * 1000}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: 16 }}
                          transition={{ delay: (num - 1) * 0.5, duration: 0.3 }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-sm">{num.toFixed(2)}</div>
                        </motion.div>
                      ))}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Points visualization */}
              {showingPoints && (
                <div className="absolute top-6 left-0 w-full">
                  <div className="flex justify-between mt-4">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-accent-500"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: Math.random() * 0.7 + 0.3, scale: 1 }}
                        transition={{ delay: i * 0.01, duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex flex-wrap justify-between w-full mt-8 gap-2">
              <motion.button
                className="btn btn-primary"
                onClick={handleZoomIn}
                disabled={zoom >= 4 || isZooming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Zoom In 🔍
              </motion.button>

              <motion.button
                className="btn btn-secondary"
                onClick={handleTogglePoints}
                disabled={isZooming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showingPoints ? "Hide Points" : "Show Points"}
              </motion.button>

              <motion.button
                className="btn btn-primary"
                onClick={handleZoomOut}
                disabled={zoom <= 1 || isZooming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Zoom Out 🔍
              </motion.button>
            </div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 p-6 rounded-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h3 className="font-bold text-lg mb-2">Uncountable Infinity</h3>
            <p>
              The number line shows us a different kind of infinity than counting numbers. Between any two numbers (like
              1 and 2), there are infinitely many more numbers (1.1, 1.01, 1.001...). This is called &quot;uncountable
              infinity&quot; and it&apos;s actually bigger than the infinity of counting numbers!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          className="btn btn-outline w-full"
          onClick={handleReset}
          disabled={isZooming}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset Number Line
        </motion.button>
      </div>
    </div>
  )
}

