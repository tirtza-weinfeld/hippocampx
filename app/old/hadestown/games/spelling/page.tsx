"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { PencilIcon, HelpCircleIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SpellingGame } from "@/components/old/hadestown/games"
import { HADESTOWN_SPELLING_WORDS, HADESTOWN_SPELLING_GUIDE } from "@/lib/data/vocabulary"

export default function SpellingChallengePage() {
  const shouldReduceMotion = useReducedMotion()
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  function handleGameComplete() {
    setShowCelebration(true)
  }

  function nextGuideStep() {
    if (guideStep < HADESTOWN_SPELLING_GUIDE.length - 1) {
      setGuideStep(prev => prev + 1)
    } else {
      setShowGuide(false)
      setGuideStep(0)
    }
  }

  function prevGuideStep() {
    if (guideStep > 0) {
      setGuideStep(prev => prev - 1)
    }
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
            <div className="absolute inset-0 bg-gradient-to-r from-game-primary/20 via-game-primary-dark/20 to-game-primary/20 rounded-lg blur-md" />
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <PencilIcon className="h-8 w-8 text-game-primary" />
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-game-gradient">
                  Spelling Challenge
                </h1>
                <motion.div
                  animate={shouldReduceMotion ? undefined : { rotate: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <PencilIcon className="h-8 w-8 text-game-primary" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-game-text-muted max-w-xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
          >
            Unscramble the letters to spell Hadestown words!
          </motion.p>
        </div>

        {/* How to Play button */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={() => setShowGuide(true)}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all text-game-primary border border-game-border"
          >
            <HelpCircleIcon className="h-5 w-5" />
            <span>How to Play</span>
          </motion.button>
        </div>

        {/* Game container */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg border-none">
          <CardContent className="p-6 bg-game-surface min-h-[500px]">
            <SpellingGame
              words={HADESTOWN_SPELLING_WORDS}
              onComplete={handleGameComplete}
            />
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
              className="bg-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-game-primary">
                  {HADESTOWN_SPELLING_GUIDE[guideStep].title}
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-game-text-muted hover:text-game-text"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 min-h-[100px] flex items-center justify-center">
                <motion.p
                  key={guideStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-game-text text-center"
                >
                  {HADESTOWN_SPELLING_GUIDE[guideStep].content}
                </motion.p>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-6">
                {HADESTOWN_SPELLING_GUIDE.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      guideStep === index ? "bg-game-primary" : "bg-game-border"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  onClick={prevGuideStep}
                  disabled={guideStep === 0}
                  whileHover={{ scale: guideStep === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: guideStep === 0 ? 1 : 0.95 }}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </motion.button>

                <motion.button
                  onClick={nextGuideStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-game-gradient text-white rounded-full shadow-md flex items-center gap-1"
                >
                  {guideStep === HADESTOWN_SPELLING_GUIDE.length - 1 ? "Start Playing" : "Next"}
                  {guideStep < HADESTOWN_SPELLING_GUIDE.length - 1 && <ChevronRight className="h-4 w-4" />}
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
              className="bg-game-surface rounded-xl p-6 max-w-md w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4 text-6xl"
              >
                🏆
              </motion.div>
              <h2 className="text-2xl font-bold text-game-primary mb-4">
                Amazing Job!
              </h2>
              <p className="text-game-text mb-6">
                You&apos;ve completed all the spelling challenges! You&apos;re a true Hadestown spelling champion!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-game-gradient text-white rounded-full shadow-md"
                onClick={() => setShowCelebration(false)}
              >
                Continue Playing
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
