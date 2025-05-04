"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code, ChevronRight, Lightbulb, ArrowRight, Check, Shuffle, Search, SortAsc, Sparkles } from "lucide-react"

export default function AlgorithmsLesson() {
  const [step, setStep] = useState(1)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  })

  // Sorting algorithm visualization
  const [array, setArray] = useState<number[]>([])
  const [sortingStep, setSortingStep] = useState(0)
  const [sortingSteps, setSortingSteps] = useState<number[][]>([])
  const [isSorting, setIsSorting] = useState(false)

  const totalSteps = 5

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const showInfoPopup = (title: string, content: string) => {
    setPopupContent({ title, content })
    setShowPopup(true)
  }

  // Initialize sorting visualization
  useEffect(() => {
    if (step === 3) {
      generateRandomArray()
    }
  }, [step])

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 10)
    setArray(newArray)
    setSortingStep(0)
    setSortingSteps([newArray])
    setIsSorting(false)
  }

  const bubbleSort = () => {
    setIsSorting(true)
    const steps: number[][] = [array.slice()]
    const arr = array.slice()

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          steps.push(arr.slice())
        }
      }
    }

    setSortingSteps(steps)

    // Animate through steps
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps.length) {
        clearInterval(interval)
        setIsSorting(false)
      } else {
        setSortingStep(currentStep)
      }
    }, 500)

    return () => clearInterval(interval)
  }

  // Report progress to parent
  // useEffect(() => {
  //   const progress = Math.round((step / totalSteps) * 100)
  //   // In a real app, we would communicate with the parent frame
  //   // window.parent.postMessage({ type: 'progress', lesson: 'algorithms', value: progress }, '*')
  // }, [step])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 p-6 relative overflow-hidden">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  className="inline-block"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl inline-block">
                    <Code className="h-16 w-16 text-white" />
                  </div>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl font-bold mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Algorithms & Logic
                </motion.h1>

                <motion.p
                  className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Discover how computers solve problems step by step!
                </motion.p>
              </div>

              <motion.div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">What are Algorithms?</h2>

                  <p className="text-slate-600 dark:text-slate-300">
                    Algorithms are step-by-step instructions that tell computers how to solve problems or perform tasks.
                  </p>

                  <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                    <h3 className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Real-World Example
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      Think of a recipe for baking cookies. It has clear steps: mix ingredients, shape the dough, bake
                      at a specific temperature for a set time. That&apos;s an algorithm!
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Did you know?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        The word &quot;algorithm&quot; comes from the name of a Persian mathematician, Muhammad ibn Musa
                        al-Khwarizmi, who lived in the 9th century!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <Button onClick={nextStep} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Let&apos;s Explore Algorithms
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Characteristics
                </span>{" "}
                of Algorithms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="h-2 bg-emerald-500" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">Clear & Precise</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      Algorithms must have clear, unambiguous instructions that can be followed exactly.
                    </p>

                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        &quot;Add 5 to x&quot; is clear.
                        <br />
                        &quot;Make x bigger&quot; is not clear enough.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="h-2 bg-teal-500" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">Finite</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      Algorithms must eventually terminate after a finite number of steps.
                    </p>

                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        &quot;Repeat until the list is sorted&quot; will eventually end.
                        <br />
                        &quot;Keep adding 1 to x forever&quot; would never end.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="h-2 bg-cyan-500" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">Effective</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      Each step must be simple enough to be carried out exactly as intended.
                    </p>

                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        &quot;Compare these two numbers&quot; is doable.
                        <br />
                        &quot;Find the meaning of life&quot; is too complex.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="h-2 bg-blue-500" />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">Input & Output</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      Algorithms take input data and produce output results.
                    </p>

                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        Input: A list of numbers
                        <br />
                        Output: The same list sorted in order
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500 text-white p-2 rounded-lg">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Why Algorithms Matter</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      Algorithms are everywhere in computing! They power search engines, social media feeds, video
                      games, and even the route your GPS calculates.
                    </p>
                    <button
                      onClick={() =>
                        showInfoPopup(
                          "Algorithms in Daily Life",
                          "Algorithms are all around us! When you use a search engine, an algorithm determines which results to show you. When you watch videos online, algorithms recommend what to watch next. Even traffic lights use algorithms to manage traffic flow efficiently.",
                        )
                      }
                      className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Sorting Algorithms
                </span>{" "}
                in Action
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Bubble Sort Algorithm</h3>

                  <p className="text-slate-600 dark:text-slate-300">
                    Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent
                    elements, and swaps them if they &apos;re in the wrong order.
                  </p>

                  <div className="mt-6 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">How Bubble Sort Works:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        Start at the beginning of the list
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        Compare the first two elements
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        If the first is greater than the second, swap them
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        Move to the next pair of elements and repeat
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        Continue until the end of the list
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        Repeat the process until no more swaps are needed
                      </motion.li>
                    </ol>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-4">Visualization:</h4>

                  <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg p-4 flex flex-col">
                    <div className="flex-1 flex items-end justify-around">
                      {sortingSteps[sortingStep]?.map((value, index) => (
                        <motion.div
                          key={index}
                          className="w-8 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md"
                          style={{ height: `${value * 2}px` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${value * 2}px` }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="text-xs text-center mt-2 text-white font-medium">{value}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                      <Button
                        onClick={generateRandomArray}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={isSorting}
                      >
                        <Shuffle className="h-4 w-4" />
                        New Array
                      </Button>

                      <Button
                        onClick={bubbleSort}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center gap-2"
                        disabled={isSorting}
                      >
                        <SortAsc className="h-4 w-4" />
                        Sort
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Common Types
                </span>{" "}
                of Algorithms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="p-5">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg inline-block">
                      <SortAsc className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Sorting Algorithms</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      Arrange items in a specific order (ascending, descending, etc.)
                    </p>
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-xs">
                      <p className="font-medium">Examples:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                        <li>Bubble Sort</li>
                        <li>Merge Sort</li>
                        <li>Quick Sort</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <div className="p-5">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg inline-block">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Search Algorithms</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      Find specific items within a collection of data
                    </p>
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-xs">
                      <p className="font-medium">Examples:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                        <li>Linear Search</li>
                        <li>Binary Search</li>
                        <li>Depth-First Search</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500" />
                  <div className="p-5">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg inline-block">
                      <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Graph Algorithms</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      Process relationships between objects in a network
                    </p>
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-xs">
                      <p className="font-medium">Examples:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                        <li>Dijkstra&apos;s Algorithm</li>
                        <li>Breadth-First Search</li>
                        <li>Minimum Spanning Tree</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="p-5">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg inline-block">
                      <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Machine Learning Algorithms</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      Learn patterns from data to make predictions or decisions
                    </p>
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg text-xs">
                      <p className="font-medium">Examples:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-300">
                        <li>Decision Trees</li>
                        <li>Neural Networks</li>
                        <li>K-Means Clustering</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button onClick={nextStep} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  className="inline-block"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl inline-block">
                    <Check className="h-16 w-16 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-bold mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Great Job!
                </motion.h2>

                <motion.p
                  className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  You&apos;ve completed the Algorithms & Logic lesson! Now you understand how computers solve problems step
                  by step.
                </motion.p>
              </div>

              <motion.div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-4">What You&apos;ve Learned:</h3>

                  <div className="space-y-3">
                    {[
                      "What algorithms are and why they&apos;re important",
                      "Key characteristics of algorithms: clear, finite, effective, with inputs and outputs",
                      "How sorting algorithms like Bubble Sort work",
                      "Different types of algorithms and their applications",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.2, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-1 rounded-full text-white">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-lg mb-3">Ready to continue your AI journey?</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Next up, we&apos;ll explore Neural Networks and discover how computers learn to recognize patterns!
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <Button
                  onClick={() => {
                    // In a real app, we would communicate with the parent frame
                    // window.parent.postMessage({ type: 'lessonComplete', lesson: 'algorithms' }, '*')
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  Complete Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold">{popupContent.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{popupContent.content}</p>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowPopup(false)} variant="outline">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
