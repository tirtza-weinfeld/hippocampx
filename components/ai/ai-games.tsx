"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Network, Bot, Lightbulb, CheckCircle } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
export default function AIGames() {
  const [activeGame, setActiveGame] = useState("pattern-finder")
  const [, setIsReducedMotion] = useState(false)

  // Check for user's motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = () => setIsReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Pattern Finder Game State
  const [patternSequence, setPatternSequence] = useState<number[]>([])
  const [userGuess, setUserGuess] = useState("")
  const [patternFeedback, setPatternFeedback] = useState("")
  const [patternScore, setPatternScore] = useState(0)
  const [patternLevel, setPatternLevel] = useState(1)

  // Image Classifier Game State
  const [classifierImages, setClassifierImages] = useState<string[]>([])
  const [classifierCategory, setClassifierCategory] = useState("")
  const [classifierSelections, setClassifierSelections] = useState<boolean[]>([])
  const [classifierScore, setClassifierScore] = useState(0)
  const [classifierFeedback, setClassifierFeedback] = useState("")

  // Neural Network Trainer Game State
  const [networkWeights, setNetworkWeights] = useState<number[]>([50, 50, 50])
  const [networkTarget, setNetworkTarget] = useState<number[]>([])
  const [networkOutput, setNetworkOutput] = useState<number[]>([0, 0, 0])
  const [networkScore, setNetworkScore] = useState(0)
  const [networkAttempts, setNetworkAttempts] = useState(0)

  const games = [
    {
      id: "pattern-finder",
      title: "Pattern Finder",
      description: "Can you figure out the pattern and predict what comes next?",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-blue-500 to-purple-500",
      aiConcept: "Predictive Algorithms",
    },
    {
      id: "image-classifier",
      title: "Image Classifier",
      description: "Help train an AI by selecting images that match a category!",
      icon: <Bot className="h-5 w-5" />,
      color: "from-green-500 to-teal-500",
      aiConcept: "Image Classification",
    },
    {
      id: "neural-trainer",
      title: "Neural Network Trainer",
      description: "Adjust the neural network weights to get the right output!",
      icon: <Network className="h-5 w-5" />,
      color: "from-orange-500 to-red-500",
      aiConcept: "Neural Networks",
    },
  ]

  // Initialize Pattern Finder Game
  const initPatternFinder = useCallback(() => {
    // Generate a simple pattern based on level
    let newPattern: number[] = []

    if (patternLevel === 1) {
      // Simple counting pattern (e.g., 2, 4, 6, 8, ...)
      const start = Math.floor(Math.random() * 5) + 1
      const step = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < 4; i++) {
        newPattern.push(start + i * step)
      }
    } else if (patternLevel === 2) {
      // Fibonacci-like pattern (each number is sum of two previous)
      const start1 = Math.floor(Math.random() * 5) + 1
      const start2 = Math.floor(Math.random() * 5) + 1
      newPattern = [start1, start2]
      for (let i = 0; i < 2; i++) {
        newPattern.push(newPattern[newPattern.length - 1] + newPattern[newPattern.length - 2])
      }
    } else {
      // More complex pattern (e.g., multiply by 2, add 1)
      const start = Math.floor(Math.random() * 3) + 1
      let current = start
      newPattern = [current]
      for (let i = 0; i < 3; i++) {
        current = current * 2 + 1
        newPattern.push(current)
      }
    }

    setPatternSequence(newPattern)
    setUserGuess("")
    setPatternFeedback("")
  }, [patternLevel])

  // Check Pattern Finder guess
  const checkPatternGuess = () => {
    const guess = Number.parseInt(userGuess)
    let nextInSequence: number

    if (patternLevel === 1) {
      // For simple counting pattern
      const diff = patternSequence[1] - patternSequence[0]
      nextInSequence = patternSequence[patternSequence.length - 1] + diff
    } else if (patternLevel === 2) {
      // For Fibonacci-like pattern
      nextInSequence = patternSequence[patternSequence.length - 1] + patternSequence[patternSequence.length - 2]
    } else {
      // For complex pattern
      nextInSequence = patternSequence[patternSequence.length - 1] * 2 + 1
    }

    if (guess === nextInSequence) {
      setPatternFeedback("Correct! You found the pattern!")
      setPatternScore(patternScore + patternLevel * 10)

      // Level up after 3 correct answers at current level
      if (patternScore >= patternLevel * 30 && patternLevel < 3) {
        setPatternLevel(patternLevel + 1)
        setPatternFeedback(`Great job! You've advanced to level ${patternLevel + 1}!`)
      }

      // Generate a new pattern
      setTimeout(() => {
        initPatternFinder()
      }, 1500)
    } else {
      setPatternFeedback(`Not quite! The next number was ${nextInSequence}. Try again!`)
      setPatternScore(Math.max(0, patternScore - 5))
      setTimeout(() => {
        initPatternFinder()
      }, 2000)
    }
  }

  // Initialize Image Classifier Game
  const initImageClassifier = useCallback(() => {
    const categories = ["Animals", "Vehicles", "Food", "Sports"]
    const newCategory = categories[Math.floor(Math.random() * categories.length)]
    setClassifierCategory(newCategory)

    // Reset selections
    setClassifierSelections(Array(8).fill(false))
    setClassifierFeedback("")

    // In a real app, we would load actual images
    // Here we're just simulating with placeholders
    setClassifierImages(Array(8).fill("placeholder"))
  }, [])

  // Check Image Classifier selections
  const checkClassifierSelections = () => {
    // In a real app, we would check against actual image categories
    // Here we're simulating correct answers based on selection indices

    // Simulate which images match the category (in a real app, this would be based on actual image content)
    const correctIndices = Array(8)
      .fill(false)
      .map((_, i) => {
        // Randomly determine if this image should match the category
        // For simulation, we'll say even indices are correct for simplicity
        return i % 2 === 0
      })

    // Check user selections against correct indices
    let correct = 0
    let incorrect = 0

    classifierSelections.forEach((selected, i) => {
      if (selected && correctIndices[i]) correct++
      if (selected && !correctIndices[i]) incorrect++
    })

    const newScore = correct * 10 - incorrect * 5
    setClassifierScore(classifierScore + newScore)

    if (correct > incorrect) {
      setClassifierFeedback(`Good job! You correctly identified ${correct} ${classifierCategory.toLowerCase()}.`)
    } else {
      setClassifierFeedback(
        `Try again! You missed some ${classifierCategory.toLowerCase()} and selected ${incorrect} wrong images.`,
      )
    }

    // Generate new round after feedback
    setTimeout(() => {
      initImageClassifier()
    }, 2000)
  }

  // Initialize Neural Network Trainer Game
  const initNeuralTrainer = useCallback(() => {
    // Generate a random target output
    const newTarget = [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())]
    setNetworkTarget(newTarget)

    // Reset weights to middle values
    setNetworkWeights([50, 50, 50])

    // Reset output
    calculateNetworkOutput([50, 50, 50])

    // Reset attempts
    setNetworkAttempts(0)
  }, [])

  // Calculate Neural Network output based on weights
  const calculateNetworkOutput = (weights: number[]) => {
    // In a real neural network, this would involve complex calculations
    // Here we're using a simplified model for educational purposes

    // Convert slider values (0-100) to weights (-1 to 1)
    const normalizedWeights = weights.map((w) => (w - 50) / 50)

    // Calculate outputs based on weights
    // This is a very simplified model!
    const outputs = [
      normalizedWeights[0] > 0.2 ? 1 : 0,
      normalizedWeights[1] > 0 ? 1 : 0,
      normalizedWeights[2] < -0.3 ? 1 : 0,
    ]

    setNetworkOutput(outputs)
    return outputs
  }

  // Check Neural Network output against target
  const checkNetworkOutput = () => {
    const currentOutput = calculateNetworkOutput(networkWeights)
    setNetworkAttempts(networkAttempts + 1)

    // Check if output matches target
    const matches = currentOutput.every((val, i) => val === networkTarget[i])

    if (matches) {
      setNetworkScore(networkScore + Math.max(10, 50 - networkAttempts * 5))
      setTimeout(() => {
        initNeuralTrainer()
      }, 1500)
    }
  }

  // Update Neural Network weights
  const updateNetworkWeight = (index: number, value: number[]) => {
    const newWeights = [...networkWeights]
    newWeights[index] = value[0]
    setNetworkWeights(newWeights)
    calculateNetworkOutput(newWeights)
  }

  // Initialize games on first load
  useEffect(() => {
    initPatternFinder()
    initImageClassifier()
    initNeuralTrainer()
  }, [initPatternFinder, initImageClassifier, initNeuralTrainer])

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold gradient-text gradient-purple-blue">AI Games & Challenges</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Have fun with these interactive games that teach you how AI algorithms work!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <motion.div key={game.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card
              className={`cursor-pointer h-full border ${
                activeGame === game.id
                  ? "border-blue-500 dark:border-blue-400 shadow-md"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setActiveGame(game.id)}
            >
              <CardHeader className={`bg-gradient-to-r ${game.color} text-white pb-3`}>
                <CardTitle className="flex items-center text-lg">
                  {game.icon}
                  <span className="ml-2">{game.title}</span>
                </CardTitle>
                <CardDescription className="text-white/90 text-sm">AI Concept: {game.aiConcept}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 bg-white dark:bg-slate-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">{game.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pattern Finder Game */}
      {activeGame === "pattern-finder" && (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Pattern Finder</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Level {patternLevel}</div>
                <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Score: {patternScore}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-slate-800">
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">How AI Uses Patterns</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  AI algorithms look for patterns in data to make predictions. This is how AI can predict weather,
                  recommend products, or complete sentences!
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                  What number comes next in this pattern?
                </h3>

                <div className="flex justify-center">
                  <div className="flex space-x-4">
                    {patternSequence.map((num, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2, duration: 0.3 }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md"
                      >
                        {num}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: patternSequence.length * 0.2, duration: 0.3 }}
                      className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-800 dark:text-gray-200 text-2xl font-bold border-2 border-dashed border-gray-400 dark:border-gray-500"
                    >
                      ?
                    </motion.div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <div className="w-full max-w-xs space-y-4">
                    <Input
                      type="number"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      placeholder="Enter your guess"
                      className="text-center text-lg"
                      aria-label="Enter your guess for the next number in the pattern"
                    />

                    <Button
                      onClick={checkPatternGuess}
                      disabled={!userGuess}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                    >
                      Check Answer
                    </Button>
                  </div>
                </div>

                {patternFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center ${
                      patternFeedback.includes("Correct") || patternFeedback.includes("Great job")
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {patternFeedback}
                  </motion.div>
                )}
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Pattern Recognition Tips
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li>Look for simple operations: adding, subtracting, multiplying</li>
                  <li>Check if each number depends on the previous one or two numbers</li>
                  <li>As you level up, patterns will get more complex!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Classifier Game */}
      {activeGame === "image-classifier" && (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                <span>Image Classifier</span>
              </CardTitle>
              <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Score: {classifierScore}</div>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-slate-800">
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">How AI Classifies Images</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  AI learns to recognize objects in images by being trained on thousands of labeled examples. Help train
                  this AI by selecting all images that match the category!
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                  Select all images that contain:{" "}
                  <span className="text-green-600 dark:text-green-400">{classifierCategory}</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {classifierImages.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        const newSelections = [...classifierSelections]
                        newSelections[index] = !newSelections[index]
                        setClassifierSelections(newSelections)
                      }}
                      className={`relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer overflow-hidden border-2 ${
                        classifierSelections[index] ? "border-green-500 dark:border-green-400" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={`/placeholder.svg?height=150&width=150&text=${index + 1}`}
                        alt={`Sample image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {classifierSelections[index] && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    onClick={checkClassifierSelections}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
                  >
                    Submit Selection
                  </Button>
                </div>

                {classifierFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center ${
                      classifierFeedback.includes("Good job")
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
                    }`}
                  >
                    {classifierFeedback}
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Neural Network Trainer Game */}
      {activeGame === "neural-trainer" && (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2" />
                <span>Neural Network Trainer</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  Attempts: {networkAttempts}
                </div>
                <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Score: {networkScore}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-slate-800">
            <div className="space-y-6">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <h3 className="font-medium text-orange-700 dark:text-orange-300 mb-2">How Neural Networks Learn</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Neural networks learn by adjusting &quot;weights&quot; between neurons. Adjust the weights below to make the
                  network output match the target values!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="w-full md:w-1/2 space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Adjust Network Weights</h3>

                    <div className="space-y-6">
                      {networkWeights.map((weight, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Weight {index + 1}</span>
                            <span className="text-gray-700 dark:text-gray-300">{weight}%</span>
                          </div>
                          <Slider
                            value={[weight]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => updateNetworkWeight(index, value)}
                            aria-label={`Adjust weight ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={checkNetworkOutput}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                    >
                      Check Output
                    </Button>
                  </div>

                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Network Visualization</h4>

                      <div className="relative h-64">
                        {/* Input Layer */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around">
                          {[1, 2, 3].map((_, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white"
                            >
                              I{i + 1}
                            </div>
                          ))}
                        </div>

                        {/* Hidden Layer */}
                        <div className="absolute left-1/2 top-0 bottom-0 flex flex-col justify-around transform -translate-x-1/2">
                          {[1, 2, 3].map((_, i) => (
                            <div
                              key={i}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                networkWeights[i] > 70
                                  ? "bg-green-500"
                                  : networkWeights[i] > 30
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            >
                              H{i + 1}
                            </div>
                          ))}
                        </div>

                        {/* Output Layer */}
                        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around">
                          {networkOutput.map((output, i) => (
                            <div
                              key={i}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                output === networkTarget[i] ? "bg-green-500" : "bg-gray-400"
                              }`}
                            >
                              {output}
                            </div>
                          ))}
                        </div>

                        {/* Connection lines would be drawn here in a real implementation */}
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Target Output:</h4>
                      <div className="flex justify-around">
                        {networkTarget.map((target, i) => (
                          <div key={i} className="text-center">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mx-auto">
                              {target}
                            </div>
                            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Target {i + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {networkOutput.every((val, i) => val === networkTarget[i]) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg text-center bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300"
                  >
                    Great job! You&apos;ve trained the network to produce the correct output!
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
