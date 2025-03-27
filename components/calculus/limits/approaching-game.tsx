"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"

export function ApproachingGame() {
  const [gameState, setGameState] = useState("ready") // ready, playing, success, failure
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState("")
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const dragX = useMotionValue(0)
  const constraintsRef = useRef(null)

  // Target zone is between 90-95% of the way
  const targetMin = 90
  const targetMax = 95

  // Transform the dragX to a percentage (0-100)
  const dragPercentage = useTransform(dragX, [0, 300], [0, 100])

  const handleDragEnd = () => {
    const currentPercentage = dragPercentage.get()
    setAttempts(attempts + 1)

    if (currentPercentage >= targetMin && currentPercentage <= targetMax) {
      setGameState("success")
      setFeedback("Perfect! You found the limit without crossing the boundary.")
      // setShowReward(true)
      setShowConfetti(true)
    } else if (currentPercentage > targetMax) {
      setGameState("failure")
      setFeedback("Oops! You went too far and crossed the boundary.")
    } else {
      setGameState("failure")
      setFeedback(`You're at ${Math.round(currentPercentage)}%. Get closer to the boundary without crossing it.`)
    }
  }

  const resetGame = () => {
    dragX.set(0)
    setGameState("ready")
    setFeedback("")
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Approaching Game!",
      content:
        "This game helps you understand the concept of limits in calculus - getting closer and closer to a value without actually reaching it.",
      emoji: "🔍",
    },
    {
      title: "The Challenge",
      content:
        "Your goal is to drag the ball as close as possible to the boundary line without crossing it. This is just like finding a limit!",
      emoji: "🎯",
    },
    {
      title: "The Target Zone",
      content:
        "The purple highlighted area is your target zone. Try to get the ball into this zone without going past the boundary line.",
      emoji: "💜",
    },
    {
      title: "Understanding Limits",
      content:
        "In calculus, a limit is about what value a function approaches as the input gets closer and closer to a certain point.",
      emoji: "📊",
    },
    {
      title: "Let's Play!",
      content: "Drag the ball carefully toward the boundary. Can you find the perfect limit?",
      emoji: "🎮",
    },
  ]

  return (
    <section className="py-6 relative">
      <TutorialPopup steps={tutorialSteps} gameName="approaching-game" />
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title="Limit Master"
        description="You've found the perfect limit! Getting as close as possible without crossing the boundary."
        icon="medal"
        color="indigo"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>The Approaching Game</span>
              <span className="ml-2 text-sm badge-fun bg-gradient-to-r from-purple-500 to-indigo-400 text-white">
                lim x→a
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  Drag the ball as close as possible to the boundary without crossing it
                </p>
                <p className="text-sm font-medium">
                  This is like finding a limit - getting as close as possible without reaching the actual point
                </p>
              </div>

              <div
                className="relative h-24 bg-muted rounded-lg overflow-hidden border-2 border-muted"
                ref={constraintsRef}
              >
                {/* Target zone indicator */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-purple-500/10 to-indigo-400/20"
                  style={{
                    left: `${targetMin}%`,
                    right: `${100 - targetMax}%`,
                  }}
                />

                {/* Boundary line */}
                <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-purple-500 to-indigo-400 flex items-center justify-center">
                  <div className="text-xs font-bold text-white rotate-90">LIMIT</div>
                </div>

                {/* Draggable ball */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-400 flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing shadow-lg"
                  drag="x"
                  dragConstraints={constraintsRef}
                  dragElastic={0}
                  dragMomentum={false}
                  style={{ x: dragX }}
                  onDragEnd={handleDragEnd}
                  animate={
                    gameState === "success"
                      ? {
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            "0 0 0 rgba(168, 85, 247, 0.4)",
                            "0 0 20px rgba(168, 85, 247, 0.6)",
                            "0 0 0 rgba(168, 85, 247, 0.4)",
                          ],
                        }
                      : gameState === "failure"
                        ? {
                            x: [dragX.get(), dragX.get() - 20, dragX.get()],
                            rotate: [0, -10, 0, 10, 0],
                          }
                        : {}
                  }
                  transition={{ duration: 0.5 }}
                  whileDrag={{ scale: 1.1 }}
                >
                  x
                </motion.div>

                {/* Percentage indicator */}
                <motion.div
                  className="absolute bottom-1 left-0 text-xs font-medium text-foreground"
                  style={{ x: dragX }}
                >
                  {Math.round(dragPercentage.get())}%
                </motion.div>

                {/* Distance markers */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between px-4">
                  <div className="h-2 w-0.5 bg-foreground/30"></div>
                  <div className="h-2 w-0.5 bg-foreground/30"></div>
                  <div className="h-2 w-0.5 bg-foreground/30"></div>
                  <div className="h-2 w-0.5 bg-foreground/30"></div>
                  <div className="h-2 w-0.5 bg-foreground/30"></div>
                </div>
              </div>

              {feedback && (
                <motion.div
                  className={`p-4 rounded-lg ${
                    gameState === "success"
                      ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                      : gameState === "failure"
                        ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">
                      {gameState === "success" ? "🎉" : gameState === "failure" ? "😢" : ""}
                    </span>
                    {feedback}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGame}
                  className="rounded-full border-2 border-purple-500/50 hover:bg-purple-500/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-lg border-2 border-muted">
                <h3 className="font-medium mb-2">Understanding Limits</h3>
                <p className="text-sm">
                  In calculus, we often need to find out what happens as we get closer and closer to a point, without
                  actually reaching it.
                </p>
                <p className="text-sm mt-2">
                  This is exactly what a limit does - it tells us the value a function approaches as the input gets
                  closer to a specific value.
                </p>
                <p className="text-sm mt-2 font-medium text-purple-600 dark:text-purple-400">
                  We write this as: <code className="bg-background px-1 py-0.5 rounded">lim x→a f(x) = L</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

