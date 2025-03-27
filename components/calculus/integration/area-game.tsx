"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RefreshCw, Play, Pause } from "lucide-react"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"

export function AreaGame() {
  const [rectangles, setRectangles] = useState(4)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [score, setScore] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to calculate y value for our curve
  const curve = (x: number) => {
    return 50 + 40 * Math.sin(x / 30)
  }

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 150)
    ctx.lineTo(300, 150)
    ctx.stroke()

    // Draw curve
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, curve(0))
    for (let x = 1; x <= 300; x++) {
      ctx.lineTo(x, curve(x))
    }
    ctx.stroke()

    // Draw rectangles
    if (currentStep > 0) {
      const rectWidth = 300 / rectangles
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)"

      for (let i = 0; i < Math.min(currentStep, rectangles); i++) {
        const x = i * rectWidth
        const height = 150 - curve(x + rectWidth / 2)
        ctx.fillRect(x, curve(x + rectWidth / 2), rectWidth, height)
      }
    }
  }, [rectangles, currentStep])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= rectangles) {
          setIsPlaying(false)
          // setShowReward(true)
          setShowConfetti(true)
          setScore((prev) => prev + 10 * rectangles)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, rectangles])

  const handlePlay = () => {
    if (currentStep >= rectangles) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Area Game!",
      content: "This game helps you understand integration - one of the most important concepts in calculus!",
      emoji: "📏",
    },
    {
      title: "Finding Areas Under Curves",
      content:
        "Integration helps us find the exact area under a curve. But that can be tricky! So we use rectangles to approximate it.",
      emoji: "📊",
    },
    {
      title: "Rectangle Approximation",
      content:
        "We can divide the area into rectangles and add them up. The more rectangles we use, the more accurate our approximation!",
      emoji: "🧩",
    },
    {
      title: "Watch the Animation",
      content:
        "Press Play to see how the rectangles fill in the area under the curve. Try changing the number of rectangles to see how it affects accuracy!",
      emoji: "▶️",
    },
    {
      title: "Let's Integrate!",
      content: "This is the fundamental idea behind integration in calculus. Ready to play?",
      emoji: "🎮",
    },
  ]

  return (
    <section className="py-6 relative">
      <TutorialPopup steps={tutorialSteps} gameName="area-game" />
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title="Area Master"
        description={`You've discovered the area under the curve using ${rectangles} rectangles!`}
        icon="trophy"
        color="green"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Area Under the Curve Game</span>
              <div className="badge-fun bg-gradient-to-r from-green-500 to-emerald-400 text-white ml-auto">
                Score: {score}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  Watch how we can approximate the area under a curve using rectangles
                </p>
                <p className="text-sm text-foreground/80">
                  The more rectangles we use, the more accurate our approximation becomes!
                </p>
              </div>

              {/* <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-muted">
                <canvas ref={canvasRef} width={300} height={200} className="w-full  h-auto" />
              </div> */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className="border border-muted rounded-lg bg-white dark:bg-gray-900 @xs:w-full @lg:w-auto"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Number of Rectangles: {rectangles}</h3>
                  <Slider
                    value={[rectangles]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => {
                      setRectangles(value[0])
                      setCurrentStep(0)
                    }}
                    disabled={isPlaying}
                  />
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>Fewer (Less Accurate)</span>
                    <span>More (More Accurate)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    size="sm"
                    onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                    className="bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:from-green-600 hover:to-emerald-500"
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
                  Integration helps us find the exact area under a curve. But sometimes that&apos;s hard to calculate!
                </p>
                <p className="text-sm mt-2">
                  So we can approximate it by dividing the area into rectangles and adding them up.
                </p>
                <p className="text-sm mt-2">
                  As we use more and more rectangles, our approximation gets closer and closer to the exact area.
                </p>
                <p className="text-sm mt-2 font-medium text-green-600 dark:text-green-400">
                  This is the fundamental idea behind integration!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

