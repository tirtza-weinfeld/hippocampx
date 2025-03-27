"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CoinFlipDemo() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [currentSide, setCurrentSide] = useState<"heads" | "tails">("heads")

  const flipCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)

    // Animate coin flipping
    let flips = 0
    const maxFlips = 10
    const interval = setInterval(() => {
      setCurrentSide((prev) => (prev === "heads" ? "tails" : "heads"))
      flips++

      if (flips >= maxFlips) {
        clearInterval(interval)
        const result = Math.random() < 0.5 ? "heads" : "tails"
        setCurrentSide(result)
        setIsFlipping(false)
      }
    }, 100)
  }

  return (
    <section className="py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4">Coin Flip Example</h2>
        <Card className="border-2 bg-background/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Flipping a Fair Coin</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <p>When you flip a fair coin, there are only two possible outcomes: heads or tails.</p>
                <p>
                  Each outcome has the same chance of happening. We say each outcome has a probability of 1/2 or 50%.
                </p>
                <p>
                  This means that if you flip a coin many times, about half of the flips should be heads and half should
                  be tails.
                </p>
                <p>Try flipping the coin multiple times and see what happens!</p>
                <div className="flex justify-center">
                  <Button
                    onClick={flipCoin}
                    disabled={isFlipping}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  >
                    Flip Coin
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative h-40 w-40 cursor-pointer"
                  animate={isFlipping ? { rotateY: [0, 180, 360], rotateX: [0, 180, 360] } : {}}
                  transition={{ duration: 0.5 }}
                  onClick={flipCoin}
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentSide}
                      className={`absolute inset-0 rounded-full flex items-center justify-center text-4xl ${
                        currentSide === "heads"
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          : "bg-gradient-to-r from-amber-500 to-orange-500"
                      } text-white font-bold shadow-lg border-4 border-white dark:border-gray-800`}
                      initial={{ opacity: 0, rotateY: -180 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentSide === "heads" ? "H" : "T"}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            <div className="mt-8 bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Probability Calculation:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Probability of Heads:</p>
                  <div className="mt-2 p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                    <p className="text-center">
                      P(heads) = <span className="font-bold">1/2 = 0.5 = 50%</span>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Probability of Tails:</p>
                  <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-center">
                      P(tails) = <span className="font-bold">1/2 = 0.5 = 50%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

