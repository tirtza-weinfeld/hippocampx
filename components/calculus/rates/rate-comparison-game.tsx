"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { Play, Pause, RefreshCw } from "lucide-react"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"

export function RateComparisonGame() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [rateA, setRateA] = useState(1)
  const [rateB, setRateB] = useState(2)
  const [positionA, setPositionA] = useState(0)
  const [positionB, setPositionB] = useState(0)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [winner, setWinner] = useState<"A" | "B" | null>(null)
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const deltaTime = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      setPositionA((prev) => {
        const newPos = prev + rateA * deltaTime * 20
        return newPos >= 100 ? 100 : newPos
      })

      setPositionB((prev) => {
        const newPos = prev + rateB * deltaTime * 20
        return newPos >= 100 ? 100 : newPos
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, rateA, rateB])

  // Check for winner
  useEffect(() => {
    if (positionA >= 100 && winner === null) {
      setWinner("A")
      setIsPlaying(false)
      // setShowReward(true)
      setShowConfetti(true)
    } else if (positionB >= 100 && winner === null) {
      setWinner("B")
      setIsPlaying(false)
      // setShowReward(true)
      setShowConfetti(true)
    }
  }, [positionA, positionB, winner])

  const handlePlay = () => {
    if (positionA >= 100 || positionB >= 100) {
      handleReset()
    }
    setIsPlaying(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setPositionA(0)
    setPositionB(0)
    setWinner(null)
    lastTimeRef.current = 0
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Rate Race!",
      content: "This game helps you understand rates of change - a fundamental concept in calculus!",
      emoji: "🏎️",
    },
    {
      title: "Comparing Rates",
      content:
        "In this game, two cars move at different speeds (rates). You can adjust their speeds using the sliders.",
      emoji: "⚡",
    },
    {
      title: "Rates and Distance",
      content: "A higher rate means the car moves faster and covers more distance in the same amount of time.",
      emoji: "📏",
    },
    {
      title: "Calculus Connection",
      content:
        "In calculus, rates of change are represented by derivatives. The derivative of position with respect to time is velocity!",
      emoji: "📊",
    },
    {
      title: "Let's Race!",
      content: "Adjust the speeds of both cars and press Start Race to see which one reaches the finish line first!",
      emoji: "🎮",
    },
  ]

  return (
    <section className="py-6 relative">
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title={`${winner === "A" ? "Car A" : "Car B"} Wins!`}
        description={`The ${winner === "A" ? "blue" : "green"} car was faster with a rate of ${winner === "A" ? rateA : rateB} units per second.`}
        icon="trophy"
        color={winner === "A" ? "blue" : "green"}
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Rate Race: Compare Speeds</span>
              <TutorialPopup steps={tutorialSteps} gameName="rate-race" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  Adjust the speeds of the two cars and see which one reaches the finish line first!
                </p>
                <p className="text-sm font-medium">
                  This shows how different rates of change lead to different outcomes over time.
                </p>
              </div>

              {/* Car A track */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Car A (Blue)</h3>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Speed: {rateA} units/second
                  </span>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden border-2 border-muted">
                  <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-blue-500 to-cyan-400">
                    <div className="text-xs font-bold text-white rotate-90 whitespace-nowrap">FINISH</div>
                  </div>
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold"
                    style={{ left: `${positionA}%` }}
                    animate={{
                      rotate: isPlaying ? [0, 360] : 0,
                    }}
                    transition={{
                      rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    }}
                  >
                    A
                  </motion.div>
                </div>
              </div>

              {/* Car B track */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Car B (Green)</h3>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Speed: {rateB} units/second
                  </span>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden border-2 border-muted">
                  <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-green-500 to-emerald-400">
                    <div className="text-xs font-bold text-white rotate-90 whitespace-nowrap">FINISH</div>
                  </div>
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold"
                    style={{ left: `${positionB}%` }}
                    animate={{
                      rotate: isPlaying ? [0, 360] : 0,
                    }}
                    transition={{
                      rotate: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    }}
                  >
                    B
                  </motion.div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Car A Speed: {rateA}</h3>
                  <Slider
                    value={[rateA]}
                    min={0.5}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setRateA(value[0])}
                    disabled={isPlaying}
                    className="bg-blue-100 dark:bg-blue-900/20"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Car B Speed: {rateB}</h3>
                  <Slider
                    value={[rateB]}
                    min={0.5}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setRateB(value[0])}
                    disabled={isPlaying}
                    className="bg-green-100 dark:bg-green-900/20"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={isPlaying ? "outline" : "default"}
                  size="sm"
                  onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"
                >
                  {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isPlaying ? "Pause" : "Start Race"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-lg border-2 border-muted">
                <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                <p className="text-sm">
                  This race demonstrates different rates of change. Each car moves at a constant speed (rate).
                </p>
                <p className="text-sm mt-2">
                  The car with the higher rate of change (faster speed) will reach the finish line first.
                </p>
                <p className="text-sm mt-2">
                  In calculus, we use derivatives to find rates of change. The derivative of position with respect to
                  time is velocity!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

