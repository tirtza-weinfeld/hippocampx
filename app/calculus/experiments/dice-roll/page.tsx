"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { BarChart } from "@/components/calculus/data-visualization"
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"
import { PageTransition } from "@/components/calculus/page-transition"

export default function DiceRollPage() {
  const [rolls, setRolls] = useState<number[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [currentDice, setCurrentDice] = useState(1)
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("experiment")
  const [prediction, setPrediction] = useState<number | null>(null)
  const [numDice, setNumDice] = useState(1)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Calculate statistics
  const totalRolls = rolls.length / numDice

  // Count occurrences of each dice value
  const countResults = () => {
    const counts: Record<number, number> = {}
    for (let i = 1; i <= 6; i++) {
      counts[i] = rolls.filter((roll) => roll === i).length
    }
    return counts
  }

  const resultCounts = countResults()

  // Chart data
  const barChartData = Object.entries(resultCounts).map(([value, count]) => ({
    name: value,
    value: count,
  }))

  // Roll the dice
  const rollDice = () => {
    if (isRolling) return

    setIsRolling(true)

    // Animate dice rolling
    let rolls = 0
    const maxRolls = 10
    const interval = setInterval(() => {
      const newDiceValues = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1)
      setCurrentDice(newDiceValues[0]) // Just show the first dice in the animation
      rolls++

      if (rolls >= maxRolls) {
        clearInterval(interval)

        // Final dice values
        const finalDiceValues = Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1)
        setCurrentDice(finalDiceValues[0])
        setRolls((prev) => [...prev, ...finalDiceValues])

        // Check prediction (for single dice only)
        if (numDice === 1 && prediction === finalDiceValues[0]) {
          const newStreak = streak + 1
          setStreak(newStreak)
          if (newStreak > bestStreak) {
            setBestStreak(newStreak)
            if (newStreak >= 2) {
              // setShowReward(true)
              setShowConfetti(true)
            }
          }
        } else if (prediction !== null) {
          setStreak(0)
        }

        setIsRolling(false)
        setPrediction(null)
      }
    }, 100)
  }

  // Reset experiment
  const resetExperiment = () => {
    setRolls([])
    setStreak(0)
    setPrediction(null)
  }

  // Render dice face
  const DiceFace = ({ value }: { value: number }) => {
    switch (value) {
      case 1:
        return <Dice1 className="h-full w-full" />
      case 2:
        return <Dice2 className="h-full w-full" />
      case 3:
        return <Dice3 className="h-full w-full" />
      case 4:
        return <Dice4 className="h-full w-full" />
      case 5:
        return <Dice5 className="h-full w-full" />
      case 6:
        return <Dice6 className="h-full w-full" />
      default:
        return <Dice1 className="h-full w-full" />
    }
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Dice Roll Experiment!",
      content: "This experiment helps you understand probability through dice rolls.",
      emoji: "🎲",
    },
    {
      title: "Make a Prediction",
      content: "Before rolling the dice, try to predict what number will come up.",
      emoji: "🔮",
    },
    {
      title: "Roll the Dice",
      content: "Click the 'Roll Dice' button to roll the dice and see the result.",
      emoji: "👆",
    },
    {
      title: "Multiple Dice",
      content: "You can roll multiple dice at once to explore more complex probability scenarios.",
      emoji: "🎯",
    },
    {
      title: "Analyze the Data",
      content: "Switch to the 'Data' tab to see charts and statistics about your dice rolls.",
      emoji: "📊",
    },
  ]

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">
        <TutorialPopup steps={tutorialSteps} gameName="dice-roll" />
        <Confetti trigger={showConfetti} count={100} />
        {/* <RewardBadge
          title="Dice Master!"
          description={`Amazing! You correctly predicted ${bestStreak} dice rolls in a row!`}
          icon="trophy"
          color="amber"
          show={showReward}
          onClose={() => setShowReward(false)}
        /> */}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-transparent bg-clip-text">
              Dice Roll Experiment
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Roll virtual dice to explore probability and random chance
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experiment">Experiment</TabsTrigger>
              <TabsTrigger value="data">Data & Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="experiment" className="mt-6">
              <Card className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Dice Roll Simulator</CardTitle>
                  <CardDescription>
                    Roll virtual dice and track the results to see probability in action
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Dice display */}
                  <div className="flex justify-center">
                    <motion.div
                      className="relative h-32 w-32 cursor-pointer text-amber-500 dark:text-amber-400"
                      animate={isRolling ? { rotate: [0, 15, -15, 10, -10, 5, -5, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      onClick={rollDice}
                    >
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={currentDice}
                          className="absolute inset-0"
                          initial={{ opacity: 0, rotateY: -180 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DiceFace value={currentDice} />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Number of dice slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Number of Dice: {numDice}</label>
                    </div>
                    <Slider
                      value={[numDice]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => {
                        setNumDice(value[0])
                        if (value[0] > 1) {
                          setPrediction(null) // Disable prediction for multiple dice
                        }
                      }}
                      disabled={isRolling}
                    />
                  </div>

                  {/* Prediction buttons (only for single dice) */}
                  {numDice === 1 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Predict the outcome:</label>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <Button
                            key={num}
                            variant={prediction === num ? "default" : "outline"}
                            className={`w-12 h-12 p-0 ${prediction === num ? "bg-amber-500 text-white" : "text-amber-500"}`}
                            onClick={() => setPrediction(num)}
                            disabled={isRolling}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={rollDice}
                      disabled={isRolling}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                    >
                      Roll {numDice > 1 ? `${numDice} Dice` : "Dice"}
                    </Button>
                    <Button variant="outline" onClick={resetExperiment} disabled={isRolling || rolls.length === 0}>
                      Reset
                    </Button>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Total Rolls: {totalRolls}</p>
                        {numDice === 1 && <p className="text-sm font-medium">Current Streak: {streak}</p>}
                      </div>
                      <div>{numDice === 1 && <p className="text-sm font-medium">Best Streak: {bestStreak}</p>}</div>
                    </div>

                    {/* Recent rolls */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Recent Rolls:</h3>
                      <div className="flex flex-wrap gap-2">
                        {rolls.slice(-20).map((roll, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
                          >
                            {roll}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="mt-6">
              <Card className="border-2 bg-background/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>Visualize and analyze your dice roll results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {totalRolls === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Roll some dice to see data analysis</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Distribution of Results</h3>
                        <BarChart data={barChartData} />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Statistics</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map((num) => {
                            const count = resultCounts[num] || 0
                            const percentage = totalRolls > 0 ? (count / rolls.length) * 100 : 0
                            const expectedPercentage = 100 / 6 // 16.67%

                            return (
                              <div key={num} className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 text-amber-500">
                                    <DiceFace value={num} />
                                  </div>
                                  <p className="text-sm font-medium">Dice {num}</p>
                                </div>
                                <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
                                <p className="text-xs text-muted-foreground">
                                  Expected: {expectedPercentage.toFixed(1)}%
                                </p>
                                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: `${percentage}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                        <p className="text-sm">
                          With a fair dice, each number (1-6) has an equal probability of 1/6 or about 16.67%. As you
                          roll the dice more times, the experimental probability should get closer to this theoretical
                          probability.
                        </p>
                        {totalRolls > 30 && (
                          <p className="text-sm mt-2 text-amber-600 dark:text-amber-400">
                            {Object.values(resultCounts).every(
                              (count) => Math.abs((count / rolls.length) * 100 - 16.67) < 5,
                            )
                              ? "Great job! Your results are getting close to the expected distribution."
                              : "Interesting! Your results are showing some deviation from the expected distribution. Try rolling more dice to see if it evens out."}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("experiment")} className="w-full">
                    Back to Experiment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}

