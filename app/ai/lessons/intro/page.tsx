"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Brain, ChevronRight, Lightbulb, Sparkles, BotIcon as Robot, ArrowRight, Check } from "lucide-react"

export default function IntroLesson() {
  const [step, setStep] = useState(1)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  })

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

  // Report progress to parent
  useEffect(() => {
    const progress = Math.round((step / totalSteps) * 100)
    window.parent.postMessage({ type: "progress", lesson: "intro", value: progress }, "*")
  }, [step])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 p-6 relative overflow-hidden">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
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
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full inline-block">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl font-bold mt-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Welcome to AI Explorer!
                </motion.h1>

                <motion.p
                  className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Get ready for an exciting journey into the world of Artificial Intelligence!
                </motion.p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800">
                  <div className="bg-indigo-500 text-white p-3 rounded-full inline-block">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mt-4">Learn AI Concepts</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                    Discover how AI works through fun, interactive lessons
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-5 border border-purple-100 dark:border-purple-800">
                  <div className="bg-purple-500 text-white p-3 rounded-full inline-block">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mt-4">Explore Algorithms</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                    See how computers solve problems step by step
                  </p>
                </div>

                <div className="bg-pink-50 dark:bg-pink-900/30 rounded-2xl p-5 border border-pink-100 dark:border-pink-800">
                  <div className="bg-pink-500 text-white p-3 rounded-full inline-block">
                    <Robot className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mt-4">Build AI Projects</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                    Create your own AI models and see them in action
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                >
                  Let&apos;s Get Started
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
                What is{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
                ?
              </h2>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    Artificial Intelligence (AI) is technology that enables computers to:
                  </p>

                  <div className="mt-6 space-y-4">
                    {[
                      { text: "Learn from examples and experiences", delay: 0.2 },
                      { text: "Recognize patterns in data", delay: 0.4 },
                      { text: "Make decisions and solve problems", delay: 0.6 },
                      { text: "Adapt to new situations", delay: 0.8 },
                      { text: "Perform tasks that normally require human intelligence", delay: 1.0 },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                        className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl"
                      >
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-full text-white">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500 text-white p-2 rounded-full">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Did you know?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        The term &quot;Artificial Intelligence&quot; was first coined in 1956 by computer scientist John McCarthy
                        for a conference at Dartmouth College.
                      </p>
                      <button
                        onClick={() =>
                          showInfoPopup(
                            "AI History",
                            "The field of AI research was founded at a workshop held on the campus of Dartmouth College during the summer of 1956. The attendees, including John McCarthy, Marvin Minsky, and Claude Shannon, became the leaders of AI research for decades.",
                          )
                        }
                        className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 flex items-center"
                      >
                        Learn more
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="rounded-full">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                >
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
                How AI{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Works
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                    <h3 className="font-semibold text-lg">Data & Patterns</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        className="relative w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {/* Animated data visualization */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          <div className="grid grid-cols-5 grid-rows-5 gap-2">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-6 h-6 rounded-full"
                                style={{
                                  backgroundColor: i % 3 === 0 ? "#818cf8" : i % 3 === 1 ? "#c084fc" : "#f472b6",
                                }}
                                animate={{
                                  opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                  duration: 2 + (i % 5),
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                  delay: i * 0.05,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>

                      <div className="text-center">
                        <p className="text-slate-700 dark:text-slate-300">
                          AI systems learn by analyzing large amounts of data to find patterns.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                          Just like how you learn to recognize cats after seeing many cat pictures!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                    <h3 className="font-semibold text-lg">Algorithms</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        className="relative w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        {/* Animated algorithm visualization */}
                        <div className="h-full flex flex-col justify-between">
                          <motion.div
                            className="h-6 bg-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              repeatDelay: 1,
                            }}
                          />

                          <motion.div
                            className="h-6 bg-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "80%" }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              repeatDelay: 1.5,
                              delay: 0.5,
                            }}
                          />

                          <motion.div
                            className="h-6 bg-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              repeatDelay: 2,
                              delay: 1,
                            }}
                          />
                        </div>
                      </motion.div>

                      <div className="text-center">
                        <p className="text-slate-700 dark:text-slate-300">
                          Algorithms are step-by-step instructions that tell AI how to learn and make decisions.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                          They&apos;re like recipes that computers follow to solve problems!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="rounded-full">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                >
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
                Types of{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <div className="p-5">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full inline-block">
                      <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Machine Learning</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      AI systems that learn from data and improve over time without being explicitly programmed.
                    </p>
                    <button
                      onClick={() =>
                        showInfoPopup(
                          "Machine Learning",
                          "Machine Learning is a subset of AI that focuses on developing algorithms that allow computers to learn from and make predictions based on data. Instead of following explicit instructions, these systems identify patterns and make decisions with minimal human intervention.",
                        )
                      }
                      className="text-xs text-blue-600 dark:text-blue-400 mt-4 flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500" />
                  <div className="p-5">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full inline-block">
                      <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Neural Networks</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      Computing systems inspired by the human brain that can recognize patterns and learn from examples.
                    </p>
                    <button
                      onClick={() =>
                        showInfoPopup(
                          "Neural Networks",
                          "Neural networks are computing systems vaguely inspired by the biological neural networks in animal brains. They consist of artificial neurons that can learn to perform tasks by considering examples, without being programmed with task-specific rules.",
                        )
                      }
                      className="text-xs text-purple-600 dark:text-purple-400 mt-4 flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
                  <div className="p-5">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full inline-block">
                      <Robot className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">Generative AI</h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                      AI that can create new content like images, text, music, and more based on what it has learned.
                    </p>
                    <button
                      onClick={() =>
                        showInfoPopup(
                          "Generative AI",
                          "Generative AI refers to artificial intelligence systems that can generate new content such as text, images, audio, and video that resembles human-created content. These systems learn patterns from existing data and use that knowledge to create new, original outputs.",
                        )
                      }
                      className="text-xs text-amber-600 dark:text-amber-400 mt-4 flex items-center"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} className="rounded-full">
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full"
                >
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
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full inline-block">
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
                  You&apos;ve completed the introduction to AI! Now you understand the basics of what AI is and how it works.
                </motion.p>
              </div>

              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-4">What You&apos;ve Learned:</h3>

                  <div className="space-y-3">
                    {[
                      "What Artificial Intelligence is and how it works",
                      "How AI systems learn from data and find patterns",
                      "Different types of AI including Machine Learning, Neural Networks, and Generative AI",
                      "How algorithms help computers make decisions and solve problems",
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

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="font-semibold text-lg mb-3">Ready to continue your AI journey?</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Next up, we&apos;ll dive into algorithms and explore how computers solve problems step by step!
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
                    window.parent.postMessage({ type: "lessonComplete", lesson: "intro" }, "*")
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full"
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <h3 className="text-xl font-bold">{popupContent.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{popupContent.content}</p>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowPopup(false)} variant="outline" className="rounded-full">
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
