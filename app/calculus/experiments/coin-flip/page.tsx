"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RewardBadge } from "@/components/calculus/reward-badge"
import { Confetti } from "@/components/calculus/confetti"
import { TutorialPopup } from "@/components/calculus/tutorial-popup"
import { BarChart, PieChart } from "@/components/calculus/data-visualization"
import { PageTransition } from "@/components/calculus/page-transition"

export default function CoinFlipPage() {
  const [flips, setFlips] = useState<string[]>([])
  const [isFlipping, setIsFlipping] = useState(false)
  const [currentCoin, setCurrentCoin] = useState<"heads" | "tails">("heads")
  // const [showReward, setShowReward] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState("experiment")
  const [prediction, setPrediction] = useState<"heads" | "tails" | null>(null)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const shouldReduceMotion = useReducedMotion()

  // Calculate statistics
  const totalFlips = flips.length
  const headsCount = flips.filter((flip) => flip === "heads").length
  const tailsCount = flips.filter((flip) => flip === "tails").length
  const headsPercentage = totalFlips > 0 ? (headsCount / totalFlips) * 100 : 0
  const tailsPercentage = totalFlips > 0 ? (tailsCount / totalFlips) * 100 : 0

  // Chart data
  const barChartData = [
    { name: "Heads", value: headsCount },
    { name: "Tails", value: tailsCount },
  ]

  const pieChartData = [
    { name: "Heads", value: headsCount },
    { name: "Tails", value: tailsCount },
  ]

  // Flip the coin
  const flipCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)

    // Animate coin flipping
    let flips = 0
    const maxFlips = 10
    const interval = setInterval(() => {
      setCurrentCoin((prev) => (prev === "heads" ? "tails" : "heads"))
      flips++

      if (flips >= maxFlips) {
        clearInterval(interval)
        const result = Math.random() < 0.5 ? "heads" : "tails"
        setCurrentCoin(result)
        setFlips((prev) => [...prev, result])

        // Check prediction
        if (prediction === result) {
          const newStreak = streak + 1
          setStreak(newStreak)
          if (newStreak > bestStreak) {
            setBestStreak(newStreak)
            if (newStreak >= 3) {
              // setShowReward(true)
              setShowConfetti(true)
            }
          }
        } else if (prediction !== null) {
          setStreak(0)
        }

        setIsFlipping(false)
        setPrediction(null)
      }
    }, 100)
  }

  // Reset experiment
  const resetExperiment = () => {
    setFlips([])
    setStreak(0)
    setPrediction(null)
  }

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to the Coin Flip Experiment!",
      content: "This experiment helps you understand probability through coin flips.",
      emoji: "🪙",
    },
    {
      title: "Make a Prediction",
      content: "Before flipping the coin, try to predict whether it will land on heads or tails.",
      emoji: "🔮",
    },
    {
      title: "Flip the Coin",
      content: "Click the 'Flip Coin' button to flip the coin and see the result.",
      emoji: "👆",
    },
    {
      title: "Track Your Results",
      content:
        "Watch how your results are tracked in real-time. As you flip more coins, you'll see the probability approach 50/50.",
      emoji: "📊",
    },
    {
      title: "Analyze the Data",
      content: "Switch to the 'Data' tab to see charts and statistics about your coin flips.",
      emoji: "📈",
    },
  ]

  // Tab change animation variants
  const tabContentVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -20,
    },
  }

  const tabTransition = {
    duration: shouldReduceMotion ? 0 : 0.3,
    type: "tween" as const,
  }

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:py-12">
        <TutorialPopup steps={tutorialSteps} gameName="coin-flip" />
        <Confetti trigger={showConfetti} count={100} />
        {/* <RewardBadge
          title="Prediction Streak!"
          description={`Amazing! You correctly predicted ${bestStreak} coin flips in a row!`}
          icon="award"
          color="violet"
          show={showReward}
          onClose={() => setShowReward(false)}
        /> */}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
              Coin Flip Experiment
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">Flip a virtual coin to explore probability and chance</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="experiment">Experiment</TabsTrigger>
              <TabsTrigger value="data">Data & Analysis</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait" initial={false}>
              {activeTab === "experiment" && (
                <motion.div
                  key="experiment"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={tabTransition}
                >
                  <TabsContent value="experiment" className="mt-6" forceMount>
                    <Card className="border-2 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Coin Flip Simulator</CardTitle>
                        <CardDescription>
                          Flip a virtual coin and track the results to see probability in action
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Coin display */}
                        <div className="flex justify-center">
                          <motion.div
                            className="relative h-40 w-40 cursor-pointer"
                            animate={isFlipping && !shouldReduceMotion ? { rotateY: [0, 180, 360], rotateX: [0, 180, 360] } : {}}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                            onClick={flipCoin}
                          >
                            <AnimatePresence initial={false}>
                              <motion.div
                                key={currentCoin}
                                className={`absolute inset-0 rounded-full flex items-center justify-center text-4xl ${
                                  currentCoin === "heads"
                                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                                } text-white font-bold shadow-lg border-4 border-white dark:border-gray-800`}
                                initial={{ opacity: 0, rotateY: shouldReduceMotion ? 0 : -180 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: shouldReduceMotion ? 0 : 180 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                              >
                                {currentCoin === "heads" ? "H" : "T"}
                              </motion.div>
                            </AnimatePresence>
                          </motion.div>
                        </div>

                        {/* Prediction buttons */}
                        <div className="flex justify-center gap-4">
                          <Button
                            variant={prediction === "heads" ? "default" : "outline"}
                            className={`border-2 ${prediction === "heads" ? "bg-violet-500 text-white" : ""}`}
                            onClick={() => setPrediction("heads")}
                            disabled={isFlipping}
                          >
                            Predict Heads
                          </Button>
                          <Button
                            variant={prediction === "tails" ? "default" : "outline"}
                            className={`border-2 ${prediction === "tails" ? "bg-amber-500 text-white" : ""}`}
                            onClick={() => setPrediction("tails")}
                            disabled={isFlipping}
                          >
                            Predict Tails
                          </Button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={flipCoin}
                            disabled={isFlipping}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                          >
                            Flip Coin
                          </Button>
                          <Button
                            variant="outline"
                            onClick={resetExperiment}
                            disabled={isFlipping || flips.length === 0}
                          >
                            Reset
                          </Button>
                        </div>

                        {/* Results */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">Total Flips: {totalFlips}</p>
                              <p className="text-sm font-medium">Current Streak: {streak}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Best Streak: {bestStreak}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Heads: {headsCount} ({headsPercentage.toFixed(1)}%)
                              </span>
                              <span className="text-sm font-medium">
                                Tails: {tailsCount} ({tailsPercentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="flex h-4 overflow-hidden rounded-full">
                              <motion.div
                                className="bg-violet-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${headsPercentage}%` }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                              />
                              <motion.div
                                className="bg-amber-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${tailsPercentage}%` }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Recent flips */}
                        <div>
                          <h3 className="text-sm font-medium mb-2">Recent Flips:</h3>
                          <div className="flex flex-wrap gap-2">
                            {flips.slice(-20).map((flip, index) => (
                              <motion.div
                                key={index}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  flip === "heads"
                                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                                }`}
                                initial={{ scale: shouldReduceMotion ? 1 : 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                              >
                                {flip === "heads" ? "H" : "T"}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div key="data" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" transition={tabTransition}>
                  <TabsContent value="data" className="mt-6" forceMount>
                    <Card className="border-2 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Data Analysis</CardTitle>
                        <CardDescription>Visualize and analyze your coin flip results</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {totalFlips === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Flip some coins to see data analysis</p>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-medium mb-4">Distribution</h3>
                                <BarChart data={barChartData} />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium mb-4">Percentage</h3>
                                <PieChart data={pieChartData} />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Statistics</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  className="bg-violet-100 dark:bg-violet-900/20 p-4 rounded-lg"
                                  initial={{ x: shouldReduceMotion ? 0 : -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                                >
                                  <p className="text-sm text-muted-foreground">Heads Probability</p>
                                  <p className="text-2xl font-bold">{headsPercentage.toFixed(1)}%</p>
                                  <p className="text-sm text-muted-foreground">Expected: 50%</p>
                                  <motion.div
                                    initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
                                    style={{ transformOrigin: "left" }}
                                  >
                                    <Progress value={headsPercentage} className="mt-2" />
                                  </motion.div>
                                </motion.div>
                                <motion.div
                                  className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg"
                                  initial={{ x: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
                                >
                                  <p className="text-sm text-muted-foreground">Tails Probability</p>
                                  <p className="text-2xl font-bold">{tailsPercentage.toFixed(1)}%</p>
                                  <p className="text-sm text-muted-foreground">Expected: 50%</p>
                                  <motion.div
                                    initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
                                    style={{ transformOrigin: "left" }}
                                  >
                                    <Progress value={tailsPercentage} className="mt-2" />
                                  </motion.div>
                                </motion.div>
                              </div>
                            </div>

                            <motion.div
                              className="bg-muted p-4 rounded-lg"
                              initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
                            >
                              <h3 className="font-medium mb-2">What&apos;s happening here?</h3>
                              <p className="text-sm">
                                As you flip the coin more times, the probability of heads and tails should get closer to
                                50% each. This is called the <strong>Law of Large Numbers</strong> - with more trials,
                                the experimental probability approaches the theoretical probability.
                              </p>
                              {totalFlips > 20 && Math.abs(headsPercentage - 50) < 5 && (
                                <p className="text-sm mt-2 text-green-600 dark:text-green-400">
                                  Great job! Your results are getting close to the expected 50/50 distribution.
                                </p>
                              )}
                              {totalFlips > 20 && Math.abs(headsPercentage - 50) >= 10 && (
                                <p className="text-sm mt-2 text-amber-600 dark:text-amber-400">
                                  Interesting! Your results are showing some deviation from the expected 50/50
                                  distribution. Try flipping more coins to see if it evens out.
                                </p>
                              )}
                            </motion.div>
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
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  )
}

