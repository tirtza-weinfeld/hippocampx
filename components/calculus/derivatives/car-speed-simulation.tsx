"use client"

import { useState, useRef, useCallback } from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimationFrame } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw } from "lucide-react"
// import { RewardBadge } from "@/components/calculus/reward-badge" 
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"

export function CarSpeedSimulation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [acceleration, setAcceleration] = useState(50)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const carPosition = useMotionValue(0)
  const carSpeed = useMotionValue(0)
  const lastTimeRef = useRef(0)
  const completedRef = useRef(false)

  // Transform the position to a visual position on screen
  const x = useTransform(carPosition, [0, 100], ["0%", "100%"])

  // Create a spring for smoother speed changes
  const smoothSpeed = useSpring(carSpeed, { damping: 20, stiffness: 100 })

  // Transform the speed to a visual representation (0-100 scale)
  const speedDisplay = useTransform(smoothSpeed, [0, 2], [0, 100])

  // Reset the simulation
  const resetSimulation = useCallback(() => {
    setIsPlaying(false)
    carPosition.set(0)
    carSpeed.set(0)
    completedRef.current = false
  }, [carPosition, carSpeed])

  // Animation frame for physics calculation
  useAnimationFrame((time) => {
    if (!isPlaying) {
      lastTimeRef.current = time
      return
    }

    // Calculate delta time in seconds
    const deltaTime = (time - lastTimeRef.current) / 1000
    lastTimeRef.current = time

    // Calculate new speed based on acceleration (0-100 scale converted to useful units)
    const accelValue = (acceleration - 50) / 25 // -2 to 2 range
    const newSpeed = carSpeed.get() + accelValue * deltaTime
    carSpeed.set(newSpeed)

    // Update position based on speed
    const newPosition = carPosition.get() + newSpeed * deltaTime * 10

    // If car reaches the end, reset
    if (newPosition >= 100 || newPosition <= 0) {
      if (newPosition >= 100 && !completedRef.current) {
        completedRef.current = true
        // setShowReward(true)
        setShowConfetti(true)
      }

      if (newPosition >= 100) {
        carPosition.set(100)
        carSpeed.set(0)
        setIsPlaying(false)
      } else {
        carPosition.set(0)
        carSpeed.set(0)
        setIsPlaying(false)
      }
    } else {
      carPosition.set(newPosition)
    }
  })

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Car Speed Simulation!",
      content:
        "This fun game helps you understand the relationship between position, speed, and acceleration - the key concepts in calculus!",
      emoji: "🚗",
    },
    {
      title: "Position (x)",
      content:
        "The position of the car shows where it is on the track. In calculus, we often call this x. Watch how it changes as the car moves!",
      emoji: "📍",
    },
    {
      title: "Speed (dx/dt)",
      content:
        "Speed tells us how quickly the position is changing. In calculus, we write this as dx/dt - the derivative of position with respect to time!",
      emoji: "⚡",
    },
    {
      title: "Acceleration (d²x/dt²)",
      content:
        "Acceleration tells us how quickly the speed is changing. It's the second derivative of position! Use the slider to control acceleration.",
      emoji: "🔄",
    },
    {
      title: "Let's Play!",
      content:
        "Try different acceleration values and watch how they affect the car's movement. Can you get the car to the finish line?",
      emoji: "🎮",
    },
  ]

  return (
    <section className="py-6 relative">
      <TutorialPopup steps={tutorialSteps} gameName="car-speed" />
      <Confetti trigger={showConfetti} count={100} />
      {/* <RewardBadge
        title="Speed Demon"
        description="You've mastered the relationship between position, speed, and acceleration!"
        icon="award"
        color="blue"
        show={showReward}
        onClose={() => setShowReward(false)}
      /> */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="card-fun">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>Car Speed Simulation</span>
              <span className="ml-2 text-sm badge-fun bg-gradient-to-r from-blue-500 to-sky-400 text-white">
                dx/dt = v(t)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="relative h-20 bg-muted rounded-lg overflow-hidden border-2 border-muted">
                <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50 opacity-20" />
                <motion.div className="absolute bottom-0 left-0 w-12 h-8" style={{ x }}>
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-sky-400 rounded-md w-10 h-6 flex items-center justify-center text-white text-xs font-bold"
                    animate={{
                      y: [0, -2, 0],
                      rotate: carSpeed.get() > 0 ? [0, 5, 0] : [0, -5, 0],
                    }}
                    transition={{
                      y: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
                      rotate: { repeat: Number.POSITIVE_INFINITY, duration: 0.3 },
                    }}
                  >
                    🚗
                  </motion.div>
                </motion.div>
                <div className="absolute bottom-0 left-0 w-full border-t-2 border-dashed border-blue-400/50" />

                {/* Finish line */}
                <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-b from-green-500 to-green-400 flex items-center justify-center">
                  <div className="text-xs font-bold text-white rotate-90">FINISH</div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-2">Position (x)</h3>
                  <motion.div
                    className="h-4 bg-muted rounded-full overflow-hidden border border-muted"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                  >
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: x }} />
                  </motion.div>
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>x = 0</span>
                    <motion.span>{carPosition.get().toFixed(1)}</motion.span>
                    <span>x = 100</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Speed (dx/dt)</h3>
                  <motion.div
                    className="h-4 bg-muted rounded-full overflow-hidden border border-muted"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-600"
                      style={{ width: speedDisplay.get() + "%" }}
                    />
                  </motion.div>
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>v = 0</span>
                    <motion.span>{carSpeed.get().toFixed(1)}</motion.span>
                    <span>v = 2</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Acceleration (d²x/dt²)</h3>
                  <Slider
                    value={[acceleration]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAcceleration(value[0])}
                    disabled={isPlaying}
                  />
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>Backward</span>
                    <span>No Acceleration</span>
                    <span>Forward</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isPlaying ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-gradient-to-r from-blue-500 to-sky-400 text-white hover:from-blue-600 hover:to-sky-500"
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetSimulation}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg border-2 border-muted">
                <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                <p className="text-sm font-medium">
                  In this simulation, you can see how <strong>position</strong>, <strong>speed</strong>, and{" "}
                  <strong>acceleration</strong> are related:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Position (x) is where the car is on the track</li>
                  <li>Speed (dx/dt) is how fast the position is changing</li>
                  <li>Acceleration (d²x/dt²) is how fast the speed is changing</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  This is exactly what derivatives do - they tell us the rate of change!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

