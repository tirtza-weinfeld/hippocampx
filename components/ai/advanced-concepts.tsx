"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Sparkles,
  Network,
  Bot,
  ImageIcon,
  MessageSquare,
  Zap,
  Lightbulb,
  Layers,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import SwipeContainer from "./swipe-container"

export default function AdvancedConcepts() {
  const [activeTab, setActiveTab] = useState("generative")
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? ("tween" as const) : ("spring" as const),
        stiffness: 300,
        damping: 24,
        duration: shouldReduceMotion ? 0.2 : undefined,
      },
    },
  }

  const handleSwipeLeft = () => {
    const tabs = ["generative", "neural", "agents", "future"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleSwipeRight = () => {
    const tabs = ["generative", "neural", "agents", "future"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const handleShowTooltip = (id: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    setShowTooltip(id)
  }

  const handleHideTooltip = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(null)
    }, 200)
  }

  const tabData = {
    generative: {
      title: "Generative AI",
      description: "AI that can create new content like images, text, and music",
      color: "from-purple-500 to-pink-500",
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
      ariaLabel: "Generative AI section",
    },
    neural: {
      title: "Neural Networks",
      description: "Computer systems inspired by the human brain",
      color: "from-blue-500 to-cyan-500",
      icon: <Network className="h-5 w-5" aria-hidden="true" />,
      ariaLabel: "Neural Networks section",
    },
    agents: {
      title: "AI Agents",
      description: "AI systems that can make decisions and take actions",
      color: "from-green-500 to-teal-500",
      icon: <Bot className="h-5 w-5" aria-hidden="true" />,
      ariaLabel: "AI Agents section",
    },
    future: {
      title: "Future of AI",
      description: "What's next for artificial intelligence",
      color: "from-purple-500 to-blue-500",
      icon: <Brain className="h-5 w-5" aria-hidden="true" />,
      ariaLabel: "Future of AI section",
    },
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-3xl font-bold gradient-text gradient-purple-blue">Advanced AI Concepts</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Let&apos;s explore some more exciting types of AI that are changing our world!
        </p>
      </motion.div>

      <div className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="horizontal">
          {/* Desktop Navigation */}
          <TabsList
            className="hidden md:grid w-full grid-cols-4 mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-1 sticky top-0 z-10 shadow-md"
            aria-label="Advanced AI topics"
          >
            {Object.entries(tabData).map(([key, data]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${data.color} data-[state=active]:text-white transition-all duration-300 relative`}
                aria-label={data.ariaLabel}
                onMouseEnter={() => handleShowTooltip(`tooltip-${key}`)}
                onMouseLeave={handleHideTooltip}
                onFocus={() => handleShowTooltip(`tooltip-${key}`)}
                onBlur={handleHideTooltip}
              >
                <span className="flex items-center justify-center">
                  {data.icon}
                  <span className="ml-2">{data.title}</span>
                </span>
                <AnimatePresence>
                  {showTooltip === `tooltip-${key}` && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/80 dark:bg-white/80 text-white dark:text-black text-xs rounded-md whitespace-nowrap z-50"
                      role="tooltip"
                      aria-hidden="true"
                    >
                      {data.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between mb-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwipeRight}
              disabled={activeTab === "generative"}
              aria-label="Previous topic"
              className="text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center">
              {tabData[activeTab as keyof typeof tabData].icon}
              <span className="ml-2 font-medium">{tabData[activeTab as keyof typeof tabData].title}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwipeLeft}
              disabled={activeTab === "future"}
              aria-label="Next topic"
              className="text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Generative AI Section */}
          <TabsContent value="generative">
            <SwipeContainer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-6"
              >
                <motion.div variants={itemVariants} className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2" aria-hidden="true" />
                    Generative AI: AI That Creates!
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Generative AI is like having a super creative robot friend who can make brand new things that never
                    existed before!
                  </p>
                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 mb-4"
                  >
                    <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                      What can Generative AI create?
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <motion.li variants={itemVariants}>
                        Pictures of things that don&apos;t exist (like a cat-dragon)
                      </motion.li>
                      <motion.li variants={itemVariants}>Stories and poems</motion.li>
                      <motion.li variants={itemVariants}>Music that no one has heard before</motion.li>
                      <motion.li variants={itemVariants}>Videos with talking animals</motion.li>
                      <motion.li variants={itemVariants}>New game levels and characters</motion.li>
                    </ul>
                  </motion.div>
                  <motion.p variants={itemVariants} className="text-gray-700 dark:text-gray-300">
                    Generative AI learns patterns from lots of examples, then creates new things that follow those
                    patterns but are completely original!
                  </motion.p>
                </motion.div>
                <motion.div variants={itemVariants} className="flex-1 space-y-4">
                  <motion.div
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden border-purple-100 dark:border-purple-800">
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardTitle className="flex items-center">
                          <ImageIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Image Generation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You type:</p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm text-gray-700 dark:text-gray-300">
                              &quot;A friendly robot teaching kids on a colorful planet&quot;
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI creates:</p>
                            <motion.div
                              className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40 h-24 rounded flex items-center justify-center"
                              animate={{
                                background: shouldReduceMotion
                                  ? undefined
                                  : [
                                      "linear-gradient(to bottom right, rgb(233, 213, 255), rgb(251, 207, 232))",
                                      "linear-gradient(to bottom right, rgb(216, 180, 254), rgb(244, 114, 182))",
                                      "linear-gradient(to bottom right, rgb(233, 213, 255), rgb(251, 207, 232))",
                                    ],
                              }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <div className="text-center">
                                <Sparkles
                                  className={`h-8 w-8 mx-auto text-purple-500 ${shouldReduceMotion ? "" : "animate-pulse-slow"}`}
                                  aria-hidden="true"
                                />
                                <span className="text-xs text-purple-700 dark:text-purple-300">AI-generated image</span>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden border-blue-100 dark:border-blue-800">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <CardTitle className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2" aria-hidden="true" />
                          Text Generation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-slate-800">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You ask:</p>
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm text-gray-700 dark:text-gray-300">
                            &quot;Write a short poem about robots and friendship&quot;
                          </div>
                          <p className="text-sm font-medium mt-3 text-gray-700 dark:text-gray-300">AI writes:</p>
                          <motion.div
                            className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-800 text-sm italic text-gray-700 dark:text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                          >
                            Metal friends with hearts so true,
                            <br />
                            Beeping, helping me and you.
                            <br />
                            Robots learn and robots grow,
                            <br />
                            In friendship&apos;s light, they start to glow.
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" aria-hidden="true" />
                  Fun Fact!
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The images and art created by generative AI aren&apos;t copied from anywhere - they&apos;re brand new
                  creations! The AI learned from millions of pictures, then mixed all those ideas together to make
                  something new, just like how you might combine different LEGO pieces to build something no one has
                  ever seen before.
                </p>
              </motion.div>
            </SwipeContainer>
          </TabsContent>

          {/* Neural Networks Section */}
          <TabsContent value="neural">
            <SwipeContainer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-6"
              >
                <motion.div variants={itemVariants} className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
                    <Network className="h-6 w-6 mr-2" aria-hidden="true" />
                    Neural Networks: AI Brains!
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Neural networks are special computer programs that work a bit like your brain! They have layers of
                    &quot;neurons&quot; that pass information to each other.
                  </p>

                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 mb-4"
                  >
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                      <Network className="h-5 w-5 mr-2" aria-hidden="true" />
                      How Neural Networks Work:
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <motion.li variants={itemVariants}>They take in information (like a picture)</motion.li>
                      <motion.li variants={itemVariants}>The information travels through layers of &quot;neurons&quot;</motion.li>
                      <motion.li variants={itemVariants}>Each neuron decides what&apos;s important</motion.li>
                      <motion.li variants={itemVariants}>
                        The final layer gives an answer (like &quot;that&apos;s a cat!&quot;)
                      </motion.li>
                      <motion.li variants={itemVariants}>If they make a mistake, they learn and get better!</motion.li>
                    </ol>
                  </motion.div>

                  <motion.p variants={itemVariants} className="text-gray-700 dark:text-gray-300">
                    Neural networks can learn to recognize patterns that are too complicated for humans to program
                    directly. That&apos;s why the AI&apos;s so good at things like recognizing faces or understanding speech!
                  </motion.p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1">
                  <motion.div
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full border-blue-100 dark:border-blue-800">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <CardTitle className="flex items-center">
                          <Layers className="h-5 w-5 mr-2" aria-hidden="true" />
                          Inside a Neural Network
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-slate-800">
                        <div className="relative h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                          {/* Input Layer */}
                          <div className="absolute left-4 h-full flex flex-col justify-center">
                            <div className="space-y-3">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs ${shouldReduceMotion ? "" : "animate-pulse-slow"}`}
                                  style={{ animationDelay: `${i * 0.2}s` }}
                                  aria-hidden="true"
                                >
                                  In
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hidden Layer 1 */}
                          <div className="absolute left-1/3 transform -translate-x-1/2 h-full flex flex-col justify-center">
                            <div className="space-y-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs ${shouldReduceMotion ? "" : "animate-pulse-slow"}`}
                                  style={{ animationDelay: `${i * 0.15}s` }}
                                  aria-hidden="true"
                                >
                                  H1
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hidden Layer 2 */}
                          <div className="absolute left-2/3 transform -translate-x-1/2 h-full flex flex-col justify-center">
                            <div className="space-y-2">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs ${shouldReduceMotion ? "" : "animate-pulse-slow"}`}
                                  style={{ animationDelay: `${i * 0.25}s` }}
                                  aria-hidden="true"
                                >
                                  H2
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Output Layer */}
                          <div className="absolute right-4 h-full flex flex-col justify-center">
                            <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs ${shouldReduceMotion ? "" : "animate-pulse-slow"}`}
                                  style={{ animationDelay: `${i * 0.3}s` }}
                                  aria-hidden="true"
                                >
                                  Out
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Connection lines would be drawn here in a real implementation */}
                          <div className="text-center text-xs text-gray-500 dark:text-gray-400 absolute bottom-2 w-full">
                            Information flows from left to right through the network
                          </div>
                        </div>

                        <div className="mt-4 text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">What&apos;s happening here?</p>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">
                            Just like your brain has billions of connected cells called neurons, neural networks have
                            digital &quot;neurons&quot; arranged in layers. Each connection can become stronger or weaker as the
                            network learns!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" aria-hidden="true" />
                  Fun Fact!
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The biggest neural networks today have hundreds of billions of connections - that&apos;s more than the
                  number of stars in our galaxy! These huge AI brains can do amazing things like write stories, create
                  art, and even help scientists discover new medicines.
                </p>
              </motion.div>
            </SwipeContainer>
          </TabsContent>

          {/* AI Agents Section */}
          <TabsContent value="agents">
            <SwipeContainer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-6"
              >
                <motion.div variants={itemVariants} className="flex-1">
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center">
                    <Bot className="h-6 w-6 mr-2" aria-hidden="true" />
                    AI Agents: AI That Takes Action!
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    AI agents are programs that can make decisions and take actions on their own to achieve goals.
                    They&apos;re like little AI helpers that can do tasks for you!
                  </p>

                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 mb-4"
                  >
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                      <Bot className="h-5 w-5 mr-2" aria-hidden="true" />
                      What AI Agents Can Do:
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      <motion.li variants={itemVariants}>Play games and learn to win</motion.li>
                      <motion.li variants={itemVariants}>Drive cars without a human driver</motion.li>
                      <motion.li variants={itemVariants}>Help you find information and answer questions</motion.li>
                      <motion.li variants={itemVariants}>Control robots to help people</motion.li>
                      <motion.li variants={itemVariants}>Schedule appointments and send messages for you</motion.li>
                    </ul>
                  </motion.div>

                  <motion.p variants={itemVariants} className="text-gray-700 dark:text-gray-300">
                    AI agents use something called &quot;reinforcement learning&quot; - they try different actions, see what works
                    best, and learn from their experiences. It&apos;s like how you learn to ride a bike by practicing!
                  </motion.p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1 space-y-4">
                  <motion.div
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden border-green-100 dark:border-green-800">
                      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        <CardTitle className="flex items-center">
                          <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
                          AI Agent in Action
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-slate-800">
                        <div className="space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <p className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">
                              Goal: Help a student with homework
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 mt-1">
                                  <MessageSquare
                                    className="h-3 w-3 text-blue-700 dark:text-blue-300"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                                  &quot;I need help with my math homework about fractions.&quot;
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-1">
                                  <Bot className="h-3 w-3 text-green-700 dark:text-green-300" aria-hidden="true" />
                                </div>
                                <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-sm">
                                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                                    AI Agent thinks: I should explain fractions clearly and provide examples
                                  </p>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    &quot;Fractions are parts of a whole! If you have a pizza cut into 8 slices and you eat 3
                                    slices, you&apos;ve eaten 3/8 of the pizza. Let me show you how to add fractions...&quot;
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mr-2 mt-1">
                                  <MessageSquare
                                    className="h-3 w-3 text-blue-700 dark:text-blue-300"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                                  &quot;I don&apos;t understand how to add 1/4 + 2/3&quot;
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mr-2 mt-1">
                                  <Bot className="h-3 w-3 text-green-700 dark:text-green-300" aria-hidden="true" />
                                </div>
                                <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-sm">
                                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                                    AI Agent thinks: I should break this down step by step with a visual example
                                  </p>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    &quot;Let&apos;s solve this step by step! First, we need a common denominator. The least
                                    common multiple of 4 and 3 is 12. So we convert: 1/4 = 3/12 and 2/3 = 8/12. Now we
                                    can add: 3/12 + 8/12 = 11/12&quot;
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800"
                  >
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                      How AI Agents Make Decisions:
                    </h4>
                    <ol className="list-decimal list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <motion.li variants={itemVariants}>Observe the situation</motion.li>
                      <motion.li variants={itemVariants}>Think about possible actions</motion.li>
                      <motion.li variants={itemVariants}>Predict what might happen for each action</motion.li>
                      <motion.li variants={itemVariants}>Choose the best action to reach the goal</motion.li>
                      <motion.li variants={itemVariants}>
                        Learn from the results to make better decisions next time
                      </motion.li>
                    </ol>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800"
              >
                <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" aria-hidden="true" />
                  Fun Fact!
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  AI agents have learned to play games like chess and Go better than any human in history! In 2016, an
                  AI called AlphaGo beat the world champion at Go, which is considered one of the most complex games
                  ever created. The AI made moves that human experts thought were mistakes at first, but they turned out
                  to be brilliant strategies!
                </p>
              </motion.div>
            </SwipeContainer>
          </TabsContent>

          {/* Future of AI Section */}
          <TabsContent value="future">
            <SwipeContainer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-6"
              >
                <motion.div variants={itemVariants} className="flex-1">
                  <h3 className="text-2xl font-bold gradient-text gradient-pink-purple mb-4 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2" aria-hidden="true" />
                    The Future of AI
                  </h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    AI is changing quickly and will be even more amazing in the future! Here are some exciting things
                    that might happen as AI continues to develop.
                  </p>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <motion.div
                      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-purple-100 dark:border-purple-800">
                        <CardHeader className="pb-2 bg-white dark:bg-slate-800">
                          <CardTitle className="text-lg flex items-center text-purple-600 dark:text-purple-400">
                            <Bot className="h-5 w-5 mr-2" aria-hidden="true" />
                            Helpful Robots
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-slate-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Robots with AI brains might help around the house, take care of people who are sick or
                            elderly, and do dangerous jobs to keep humans safe.
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-blue-100 dark:border-blue-800">
                        <CardHeader className="pb-2 bg-white dark:bg-slate-800">
                          <CardTitle className="text-lg flex items-center text-blue-600 dark:text-blue-400">
                            <Cpu className="h-5 w-5 mr-2" aria-hidden="true" />
                            Smarter Computers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-slate-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Computers might get so smart that they can solve big problems like climate change, discover
                            new medicines, and help us understand space better!
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-green-100 dark:border-green-800">
                        <CardHeader className="pb-2 bg-white dark:bg-slate-800">
                          <CardTitle className="text-lg flex items-center text-green-600 dark:text-green-400">
                            <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                            Creative Partners
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-slate-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            AI might help people make amazing art, music, stories, and games by working together with
                            human creators to come up with new ideas.
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-red-100 dark:border-red-800">
                        <CardHeader className="pb-2 bg-white dark:bg-slate-800">
                          <CardTitle className="text-lg flex items-center text-red-600 dark:text-red-400">
                            <Brain className="h-5 w-5 mr-2" aria-hidden="true" />
                            Learning Helpers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white dark:bg-slate-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            AI tutors might help kids learn in ways that are perfect for how each person learns best,
                            making school more fun and helping everyone succeed!
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex-1">
                  <motion.div
                    whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="h-full border-purple-100 dark:border-purple-800">
                      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardTitle className="flex items-center">
                          <Lightbulb className="h-5 w-5 mr-2" aria-hidden="true" />
                          Important Things to Think About
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-white dark:bg-slate-800">
                        <div className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            As AI gets more powerful, there are important things we need to think about:
                          </p>

                          <motion.div variants={itemVariants} className="space-y-3">
                            <motion.div
                              variants={itemVariants}
                              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                            >
                              <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Fairness</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                We need to make sure AI treats everyone fairly and doesn&apos;t learn bad habits or biases
                                from humans.
                              </p>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800"
                            >
                              <h5 className="font-medium text-green-700 dark:text-green-300 mb-1">Privacy</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                AI can learn a lot about people, so we need to be careful about what information it
                                collects and how it&apos;s used.
                              </p>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
                            >
                              <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Safety</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                As AI gets smarter, we need to make sure it always does what humans want and doesn&apos;t
                                cause problems.
                              </p>
                            </motion.div>

                            <motion.div
                              variants={itemVariants}
                              className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800"
                            >
                              <h5 className="font-medium text-orange-700 dark:text-orange-300 mb-1">Jobs</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                Some jobs might change because of AI, so we need to think about new kinds of jobs people
                                can do and how to prepare for them.
                              </p>
                            </motion.div>
                          </motion.div>

                          <motion.div
                            variants={itemVariants}
                            className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 mt-4"
                          >
                            <h5 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                              Your Role in the AI Future
                            </h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              Kids like you will help decide how AI is used in the future! By learning about AI now, you
                              can help make sure it&apos;s used in ways that are helpful, fair, and safe for everyone.
                            </p>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
              >
                <h4 className="font-semibold gradient-text gradient-purple-blue mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                  The Most Important Thing to Remember
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  AI is a tool created by humans to help humans. Even the smartest AI is designed to work with people,
                  not replace them. The best future is one where AI and humans work together, with AI handling boring or
                  difficult tasks while humans focus on creativity, caring for each other, and making important
                  decisions about how we want to live.
                </p>
              </motion.div>
            </SwipeContainer>
          </TabsContent>
        </Tabs>

        {/* Accessibility helper - screen reader only */}
        <div className="sr-only" aria-live="polite">
          Currently viewing {tabData[activeTab as keyof typeof tabData].title} section
        </div>

        {/* Mobile navigation indicator */}
        <div className="md:hidden flex justify-center mt-4">
          <div className="flex space-x-2">
            {Object.keys(tabData).map((key) => (
              <div
                key={key}
                className={`w-2 h-2 rounded-full ${activeTab === key ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Reduced motion indicator */}
        {shouldReduceMotion && (
          <div
            className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-full p-2 shadow-md z-50 text-xs flex items-center"
            role="status"
            aria-label="Reduced motion mode is enabled for accessibility"
          >
            <Info className="h-4 w-4 mr-1 text-blue-500" aria-hidden="true" />
            <span className="text-gray-700 dark:text-gray-300">Reduced motion enabled</span>
          </div>
        )}
      </div>
    </div>
  )
}

