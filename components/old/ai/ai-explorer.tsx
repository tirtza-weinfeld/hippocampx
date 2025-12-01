"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Image as ImageIcon, MessageSquare, Music, Sparkles, Zap, Lightbulb, Cpu, Globe } from "lucide-react"
import { motion } from "motion/react"
import SwipeContainer from "./swipe-container"

export default function AIExplorer() {
  const [selectedExample, setSelectedExample] = useState<string | null>(null)

  const examples = [
    {
      id: "chat",
      title: "Chatbots",
      description: "AI can talk with you and answer questions!",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      explanation:
        "Chatbots are computer programs that can have conversations with people. They use AI to understand what you're asking and try to give helpful answers. They learn from lots of examples of conversations to get better at talking with humans.",
    },
    {
      id: "image",
      title: "Image Recognition",
      description: "AI can see and understand pictures!",
      icon: <ImageIcon className="h-8 w-8 text-green-500" />,
      explanation:
        "AI can look at pictures and tell you what&apos;s in them! It learns by looking at millions of pictures that humans have labeled. After seeing enough cats, it can recognize a cat in a new picture it&apos;s never seen before.",
    },
    {
      id: "music",
      title: "Music Creation",
      description: "AI can create new songs and music!",
      icon: <Music className="h-8 w-8 text-purple-500" />,
      explanation:
        "AI can create brand new music! It listens to lots of songs and learns patterns in the music. Then it can create new songs that sound similar to what it learned from, but are completely new.",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <SwipeContainer className="space-y-8">
      <div className="space-y-4 ">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent"
        >

          What is Artificial Intelligence?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg dark:text-gray-300"
        >
          Artificial Intelligence (AI) is like teaching computers to think and learn, almost like humans do!
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover-card"
        >
          <Brain className="h-12 w-12 text-blue-500 mr-6 flex-shrink-0 animate-float" />
          <div>
            <p className="font-medium text-lg mb-2 dark:text-gray-200">
              AI is like giving a computer a brain that can:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Learn from examples
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Recognize patterns
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Make decisions
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Solve problems
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Understand language
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                className="flex items-center dark:text-gray-300"
              >
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                Improve over time
              </motion.li>
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">Examples of AI in the World</h3>
        <p className="mb-4 dark:text-gray-300">Tap or click on each card to learn more!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
          {examples.map((example) => (
            <motion.div key={example.id} variants={itemVariants}>
              <Card
                className={`cursor-pointer transition-all interactive-card ${selectedExample === example.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedExample(example.id)}
              >
                <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                  {example.icon}
                  <CardTitle>{example.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base dark:text-gray-400">{example.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {selectedExample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
          >
            <p className="text-lg dark:text-gray-300">{examples.find((e) => e.id === selectedExample)?.explanation}</p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 hover-card">
          <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
            Fun Fact!
          </h3>
          <p className="dark:text-gray-300">
            AI doesn&apos;t actually &quot;think&quot; like humans do. It uses math and patterns from data to make predictions. It&apos;s
            like how you learn to recognize your friend&apos;s face after seeing them many times!
          </p>
        </div>

        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 hover-card">
          <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-purple-500" />
            AI vs. Human Brains
          </h3>
          <p className="dark:text-gray-300">
            Human brains are still much more complex than AI! Your brain can learn from just a few examples, understand
            feelings, and be creative in ways that are still challenging for AI.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
      >
        <h3 className="text-xl font-semibold gradient-text gradient-purple-blue mb-3">Why is AI Important?</h3>
        <p className="mb-4 dark:text-gray-300">
          AI is changing how we live, learn, and work! It can help us solve big problems and do things that would be too
          hard or take too long for humans alone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
          >
            <Cpu className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="font-medium dark:text-gray-300">Makes life easier</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
          >
            <Sparkles className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="font-medium dark:text-gray-300">Helps discover new things</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
          >
            <Globe className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <p className="font-medium dark:text-gray-300">Creates new possibilities</p>
          </motion.div>
        </div>
      </motion.div>
    </SwipeContainer>
  )
}

