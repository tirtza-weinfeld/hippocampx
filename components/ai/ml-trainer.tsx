"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Check, X, Sparkles, BarChart } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import SwipeContainer from "./swipe-container"

export default function MLTrainer() {
  // State for the pet classifier
  const [trainedExamples, setTrainedExamples] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [isTrained, setIsTrained] = useState(false)
  const [currentPet, setCurrentPet] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isTraining, setIsTraining] = useState(false)

  // Pet examples
  const pets = [
    { name: "Dog", features: "4 legs, barks, wags tail, fur" },
    { name: "Cat", features: "4 legs, meows, whiskers, fur" },
    { name: "Bird", features: "2 legs, wings, beak, feathers" },
    { name: "Fish", features: "0 legs, fins, scales, lives in water" },
  ]

  // Train the model
  const trainModel = () => {
    // Reset if already trained
    if (isTrained) {
      setTrainedExamples(0)
      setAccuracy(0)
      setIsTrained(false)
      setCurrentPet(null)
      setPrediction(null)
      setIsCorrect(null)
    }

    setIsTraining(true)

    // Simulate training progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTrainedExamples(progress)

      // Calculate simulated accuracy based on training examples
      const newAccuracy = Math.min(30 + progress * 0.7, 95)
      setAccuracy(Math.round(newAccuracy))

      if (progress >= 100) {
        clearInterval(interval)
        setIsTrained(true)
        setIsTraining(false)
      }
    }, 300)
  }

  // Test the model with a random pet
  const testModel = () => {
    if (!isTrained) return

    // Reset previous test
    setIsCorrect(null)
    setPrediction(null)

    // Select a random pet
    const randomPet = pets[Math.floor(Math.random() * pets.length)]
    setCurrentPet(randomPet.name)

    // Simulate thinking
    setTimeout(() => {
      // Simulate prediction with some randomness but mostly correct
      const correctPrediction = Math.random() < accuracy / 100

      if (correctPrediction) {
        setPrediction(randomPet.name)
        setIsCorrect(true)
      } else {
        // Pick a different pet for incorrect prediction
        const otherPets = pets.filter((p) => p.name !== randomPet.name)
        const wrongPrediction = otherPets[Math.floor(Math.random() * otherPets.length)]
        setPrediction(wrongPrediction.name)
        setIsCorrect(false)
      }
    }, 1500)
  }

  return (
    <SwipeContainer className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold gradient-text gradient-green-blue mb-4">Train Your Own ML Model!</h2>
        <p className="text-lg mb-4 dark:text-gray-300">
          Machine Learning is how AI learns from examples. Let&apos;s train a model to recognize different pets!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="p-6 hover-card h-full dark:bg-slate-800">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-green-500" />
              Step 1: Training Data
            </h3>
            <p className="mb-4 dark:text-gray-300">Here are examples we&apos;ll use to train our pet classifier:</p>

            <div className="space-y-4">
              {pets.map((pet, index) => (
                <motion.div
                  key={pet.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-100 dark:border-green-800"
                >
                  <div className="font-bold text-lg text-green-700 dark:text-green-300">{pet.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Features: {pet.features}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="p-6 hover-card h-full dark:bg-slate-800">
            <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <BarChart className="h-6 w-6 mr-2 text-blue-500" />
              Step 2: Train the Model
            </h3>
            <p className="mb-4 dark:text-gray-300">Click the button to start training your pet classifier!</p>

            {!isTrained ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={trainModel}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 h-12 text-lg"
                  disabled={isTraining}
                  aria-label={isTraining ? "Training in progress" : "Start training the model"}
                >
                  <Brain className="mr-2 h-5 w-5" />
                  {isTraining ? "Training..." : "Start Training"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
              >
                <Check className="inline-block mr-2 h-6 w-6" />
                Training complete!
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3">
                  <Button
                    onClick={trainModel}
                    variant="outline"
                    className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                    size="sm"
                    aria-label="Reset and train again"
                  >
                    Reset & Train Again
                  </Button>
                </motion.div>
              </motion.div>
            )}

            <AnimatePresence>
              {(trainedExamples > 0 || isTrained) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 space-y-4 overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium dark:text-gray-300">Training progress:</span>
                      <span className="font-bold dark:text-gray-300">{trainedExamples}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${trainedExamples}%` }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium dark:text-gray-300">Model accuracy:</span>
                      <span className="font-bold dark:text-gray-300">{accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${accuracy}%` }}
                        className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="p-6 hover-card dark:bg-slate-800">
          <h3 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            Step 3: Test Your Model
          </h3>
          <p className="mb-4 text-lg dark:text-gray-300">
            Now let&apos;s see if your trained model can correctly identify pets!
          </p>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={testModel}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mb-6 h-12 text-lg"
              disabled={!!(!isTrained || (currentPet && prediction === null))}
              aria-label="Test the model with a random pet"
            >
              Test with Random Pet
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentPet && (
              <motion.div
                key={currentPet + (prediction || "thinking")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
              >
                <p className="font-medium text-lg mb-4 dark:text-gray-300">
                  Testing with: <span className="text-purple-700 dark:text-purple-300 font-bold">{currentPet}</span>
                </p>

                {prediction === null ? (
                  <motion.div
                    className="flex items-center justify-center p-8 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
                    animate={{
                      boxShadow: [
                        "0px 0px 0px rgba(0,0,0,0.1)",
                        "0px 4px 20px rgba(0,0,0,0.1)",
                        "0px 0px 0px rgba(0,0,0,0.1)",
                      ],
                    }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <div className="flex space-x-3 items-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, repeatDelay: 0.2 }}
                        className="h-4 w-4 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2, repeatDelay: 0.2 }}
                        className="h-4 w-4 bg-purple-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4, repeatDelay: 0.2 }}
                        className="h-4 w-4 bg-purple-400 rounded-full"
                      />
                    </div>
                    <span className="ml-3 text-lg dark:text-gray-300">AI is thinking...</span>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-center"
                    >
                      <p className="text-lg mb-2 dark:text-gray-300">The AI predicts this is a:</p>
                      <motion.p
                        className="text-3xl font-bold gradient-text gradient-purple-blue"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        {prediction}
                      </motion.p>
                    </motion.div>

                    {isCorrect !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`p-4 rounded-lg flex items-center ${
                          isCorrect
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <Check className="h-6 w-6 mr-3" />
                            <div>
                              <p className="font-bold">Correct! Great job!</p>
                              <p className="text-sm">The model successfully identified the pet.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <X className="h-6 w-6 mr-3" />
                            <div>
                              <p className="font-bold">Oops! The AI made a mistake.</p>
                              <p className="text-sm">
                                This is why AI needs lots of training data and continuous improvement!
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-900/20 dark:to-green-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
      >
        <h3 className="text-2xl font-semibold gradient-text gradient-green-blue mb-4">How Machine Learning Works</h3>
        <ol className="list-decimal list-inside space-y-3 text-lg">
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          >
            <span className="font-medium dark:text-gray-300">Collect lots of examples</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm block ml-6">
              Like our pet pictures with labels
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          >
            <span className="font-medium dark:text-gray-300">Show these examples to the computer</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm block ml-6">
              The computer analyzes the features of each pet
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          >
            <span className="font-medium dark:text-gray-300">The computer finds patterns in the data</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm block ml-6">
              It learns that animals with feathers and beaks are usually birds
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.3 }}
            className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          >
            <span className="font-medium dark:text-gray-300">The computer uses these patterns to make predictions</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm block ml-6">
              When it sees a new animal, it can guess what type it is
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.3 }}
            className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          >
            <span className="font-medium dark:text-gray-300">The more examples it sees, the better it gets!</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm block ml-6">
              That&apos;s why our accuracy improved as we trained more
            </span>
          </motion.li>
        </ol>
      </motion.div>
    </SwipeContainer>
  )
}

