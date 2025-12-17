"use client"

import { Suspense, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { FlowerIcon, HelpCircleIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SeasonsSortGame } from "@/components/old/hadestown/games"
import { HADESTOWN_SEASONS, HADESTOWN_SEASONS_GAME_GUIDE, HADESTOWN_THEME } from "@/lib/data/vocabulary"

export default function SeasonsSortPage() {
  const shouldReduceMotion = useReducedMotion()
  const [showGuide, setShowGuide] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  function handleGameComplete() {
    setShowCelebration(true)
  }

  return (
    <main className="hadestown @container min-h-screen py-8 bg-gradient-to-b from-amber-50/30 to-amber-100/20 dark:from-gray-900 dark:to-amber-950/30 text-foreground">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 dark:from-amber-500/10 dark:to-amber-500/10" />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/10" />
        <div className="railroad-pattern absolute inset-0 opacity-5 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-block relative mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-old-game-primary/20 via-old-game-primary-dark/20 to-old-game-primary/20 rounded-lg blur-md" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <FlowerIcon className="h-8 w-8 text-old-game-primary" />
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-old-game-gradient">
                  Seasons Sort
                </h1>
                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <FlowerIcon className="h-8 w-8 text-old-game-primary" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-old-game-text-muted max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
          >
            Help Persephone organize items for each season!
          </motion.p>
        </div>

        {/* How to Play button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => setShowGuide(true)}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all text-old-game-primary border border-old-game-border"
          >
            <HelpCircleIcon className="h-5 w-5" />
            <span>How to Play</span>
          </motion.button>
        </div>

        {/* Game container */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg border-none">
          <CardContent className="p-6 bg-old-game-surface min-h-[500px]">
            <Suspense fallback={<div className="flex items-center justify-center h-64 text-old-game-text-muted">Loading game...</div>}>
              <SeasonsSortGame
                seasons={HADESTOWN_SEASONS}
                onComplete={handleGameComplete}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-old-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-old-game-primary">
                  How to Play: {HADESTOWN_SEASONS_GAME_GUIDE.title}
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-old-game-text-muted hover:text-old-game-text"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {HADESTOWN_SEASONS_GAME_GUIDE.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full old-game-primary-soft text-old-game-primary flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-old-game-text">{step}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-old-game-gradient text-white rounded-full shadow-md"
                  onClick={() => setShowGuide(false)}
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-old-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4 text-6xl"
              >
                🌸
              </motion.div>
              <h2 className="text-2xl font-bold text-old-game-primary mb-4">
                Congratulations!
              </h2>
              <p className="text-old-game-text mb-6">
                {HADESTOWN_THEME.celebrationMessage}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-old-game-gradient text-white rounded-full shadow-md"
                onClick={() => setShowCelebration(false)}
              >
                Continue Learning
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
