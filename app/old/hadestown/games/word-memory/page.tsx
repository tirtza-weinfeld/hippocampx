"use client"

import { Suspense, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { HelpCircleIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  WordMemoryGame,
  GuideModal,
  CelebrationModal,
  PageHeader,
  GUIDE_STEPS_COUNT,
} from "@/components/old/hadestown/games/word-memory"
import { HADESTOWN_MEMORY_PAIRS } from "@/lib/data/vocabulary"

export default function WordMemoryPage() {
  const shouldReduceMotion = useReducedMotion()
  const [showGuide, setShowGuide] = useState(true)
  const [guideStep, setGuideStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  function handleGameComplete() {
    setShowCelebration(true)
  }

  function handleOpenGuide() {
    setShowGuide(true)
  }

  function handleCloseGuide() {
    setShowGuide(false)
    setGuideStep(0)
  }

  function handleNextGuideStep() {
    if (guideStep < GUIDE_STEPS_COUNT - 1) {
      setGuideStep(function(prev) { return prev + 1 })
    } else {
      handleCloseGuide()
    }
  }

  function handlePrevGuideStep() {
    if (guideStep > 0) {
      setGuideStep(function(prev) { return prev - 1 })
    }
  }

  function handleCloseCelebration() {
    setShowCelebration(false)
  }

  return (
    <main className="hadestown @container min-h-screen py-8 bg-gradient-to-b from-amber-50/30 to-amber-100/20 dark:from-gray-900 dark:to-amber-950/30 text-foreground">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 dark:from-amber-500/10 dark:to-amber-500/10" />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-100/10 to-transparent dark:from-amber-700/10" />
        <div className="railroad-pattern absolute inset-0 opacity-5 dark:opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative">
        <PageHeader shouldReduceMotion={shouldReduceMotion} />

        {/* How to Play button */}
        <motion.div
          className="flex justify-center mb-6"
          initial={shouldReduceMotion ? { opacity: 0 } : { y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.25 }}
        >
          <button
            onClick={handleOpenGuide}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow text-game-primary border border-game-border font-medium"
          >
            <HelpCircleIcon className="h-5 w-5" />
            <span>How to Play</span>
          </button>
        </motion.div>

        {/* Game container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.35 }}
        >
          <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl border-none rounded-2xl">
            <CardContent className="p-4 sm:p-6 md:p-8 bg-game-surface">
              <Suspense fallback={<div className="flex items-center justify-center h-64 text-game-text-muted">Loading game...</div>}>
                <WordMemoryGame
                  pairs={HADESTOWN_MEMORY_PAIRS}
                  onComplete={handleGameComplete}
                />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <GuideModal
        isOpen={showGuide}
        currentStep={guideStep}
        onClose={handleCloseGuide}
        onNext={handleNextGuideStep}
        onPrev={handlePrevGuideStep}
        shouldReduceMotion={shouldReduceMotion}
      />

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCloseCelebration}
        shouldReduceMotion={shouldReduceMotion}
      />
    </main>
  )
}
