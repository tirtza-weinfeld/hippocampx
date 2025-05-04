"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, BookOpen, Sparkles, Zap } from "lucide-react"

export default function HippocampusPage() {
  const [activeSection, setActiveSection] = useState("intro")

  const sections = [
    {
      id: "intro",
      title: "Meet Your Hippocampus",
      icon: Brain,
      description: "Your brain&apos;s memory superstar! This seahorse-shaped structure helps you learn and remember everything from your first day of school to what you had for breakfast.",
    },
    {
      id: "memory",
      title: "Memory Maker",
      icon: BookOpen,
      description: "The hippocampus is like a librarian for your brain, organizing and storing new memories. It helps you remember facts, events, and even how to ride a bike!",
    },
    {
      id: "learning",
      title: "Learning Powerhouse",
      icon: Sparkles,
      description: "Every time you learn something new, your hippocampus gets to work. It&apos;s especially active when you&apos;re learning new skills or studying for a test!",
    },
    {
      id: "fun",
      title: "Fun Facts",
      icon: Zap,
      description: "Did you know? The hippocampus is one of the few parts of the brain that can grow new neurons throughout your life! This is called neurogenesis.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Hippocampus
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Your brain&apos;s amazing memory center! Let&apos;s explore how it helps you learn and remember.
          </motion.p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-white dark:bg-slate-800 shadow-lg scale-105"
                    : "bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {section.title}
                </span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fun fact: The word &quot;hippocampus&quot; comes from the Greek words for &quot;seahorse&quot; because of its shape!
          </p>
        </motion.div>
      </div>
    </main>
  )
} 