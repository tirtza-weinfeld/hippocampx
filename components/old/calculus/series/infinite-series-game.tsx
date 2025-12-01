"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, Play, Pause } from "lucide-react"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/old/calculus/confetti"
import { TutorialPopup } from "@/components/old/calculus/tutorial-popup"

export function InfiniteSeriesGame() {
  const [terms, setTerms] = useState(10)
  const [currentTerm, setCurrentTerm] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [seriesType, setSeriesType] = useState<"geometric" | "harmonic">("geometric")
  const [sum, setSum] = useState(0)

  // Calculate the value of the nth term
  const calculateTerm = useCallback((n: number) => {
    if (seriesType === "geometric") {
      return 1 / Math.pow(2, n)
    } else {
      return 1 / (n + 1)
    }
  }, [seriesType])

  // Calculate the sum up to the nth term
  const calculateSum = useCallback((n: number) => {
    let total = 0
    for (let i = 0; i <= n; i++) {
      total += calculateTerm(i)
    }
    return total
  }, [calculateTerm])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTerm((prev) => {
        if (prev >= terms) {
          setIsPlaying(false)
          setShowConfetti(true)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, terms])

  // Update sum when current term changes
  useEffect(() => {
    setSum(calculateSum(currentTerm))
  }, [currentTerm, calculateSum])

  const handlePlay = () => {
    if (currentTerm >= terms) {
      setCurrentTerm(0)
    }
    setIsPlaying(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentTerm(0)
  }

  const toggleSeriesType = () => {
    setSeriesType((prev) => (prev === "geometric" ? "harmonic" : "geometric"))
    handleReset()
  }

  // Format the term for display
  const formatTerm = (n: number) => {
    if (seriesType === "geometric") {
      if (n === 0) return "1"
      return `1/${Math.pow(2, n)}`
    } else {
      return `1/${n + 1}`
    }
  }

  // Get the limit of the series
  const getLimit = () => {
    if (seriesType === "geometric") {
      return "2"
    } else {
      return "∞ (diverges)"
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Infinite Series Explorer!",
      content:
        "This game helps you understand what happens when we add up infinitely many numbers - a fascinating concept in calculus!",
      emoji: "✨",
    },
    {
      title: "Geometric Series",
      content: "We start with a geometric series: 1 + 1/2 + 1/4 + 1/8 + ... Each term is half of the previous term.",
      emoji: "📉",
    },
    {
      title: "Harmonic Series",
      content:
        "You can also explore the harmonic series: 1 + 1/2 + 1/3 + 1/4 + ... Each term uses the next whole number as the denominator.",
      emoji: "📊",
    },
    {
      title: "Convergence vs. Divergence",
      content:
        "Some infinite series approach a finite sum (they converge), while others grow without bound (they diverge)!",
      emoji: "🔍",
    },
    {
      title: "Let's Explore!",
      content:
        "Press Play to watch the sum build up term by term. Try switching between series types to see different behaviors!",
      emoji: "🎮",
    },
  ]

  return (
    <section className="py-6 relative">
      <Confetti trigger={showConfetti} count={100} />
    

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <div className="flex justify-center gap-4 items-center mb-4">
              <h2 className="text-2xl font-bold">Infinite Series Explorer</h2>
              <TutorialPopup steps={tutorialSteps} gameName="infinite-series" className="bg-pink-500 text-white" />
            </div>
            <CardTitle className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="ml-auto rounded-full" onClick={toggleSeriesType}>
                Switch to {seriesType === "geometric" ? "Harmonic" : "Geometric"} Series
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Watch how the {seriesType} series builds up term by term</p>
                <p className="text-sm text-foreground/80">
                  {seriesType === "geometric"
                    ? "This series converges to exactly 2 as we add more terms!"
                    : "This series grows without bound - it diverges to infinity!"}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.from({ length: Math.min(currentTerm + 1, 20) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="badge-fun bg-gradient-to-r from-pink-500 to-rose-400 text-white"
                    >
                      {formatTerm(i)}
                    </motion.div>
                  ))}
                  {currentTerm >= 20 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="badge-fun bg-gradient-to-r from-pink-500 to-rose-400 text-white"
                    >
                      + ...
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    Sum = <span className="text-pink-600 dark:text-pink-400">{sum.toFixed(6)}</span>
                  </div>
                  <div className="text-lg">
                    Limit: <span className="text-pink-600 dark:text-pink-400">{getLimit()}</span>
                  </div>
                </div>

                <div className="mt-4 h-8 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                    style={{
                      width: seriesType === "geometric" ? `${(sum / 2) * 100}%` : `${Math.min((sum / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Number of Terms: {terms}</h3>
                  <Slider
                    value={[terms]}
                    min={5}
                    max={50}
                    step={5}
                    onValueChange={(value) => {
                      setTerms(value[0])
                      setCurrentTerm(0)
                    }}
                    disabled={isPlaying}
                  />
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>Fewer Terms</span>
                    <span>More Terms</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    size="sm"
                    onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                    className="bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:from-pink-600 hover:to-rose-500"
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play Animation"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg border-2 border-muted">
                <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                <p className="text-sm">
                  {seriesType === "geometric"
                    ? "This geometric series (1 + 1/2 + 1/4 + 1/8 + ...) converges to exactly 2."
                    : "This harmonic series (1 + 1/2 + 1/3 + 1/4 + ...) grows without bound - it diverges!"}
                </p>
                <p className="text-sm mt-2">
                  {seriesType === "geometric"
                    ? "Even though we're adding infinitely many numbers, the sum approaches a finite value."
                    : "Even though each term gets smaller and smaller, the sum still grows to infinity!"}
                </p>
                <p className="text-sm mt-2 font-medium text-pink-600 dark:text-pink-400">
                  This is one of the fascinating paradoxes of infinite series!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

