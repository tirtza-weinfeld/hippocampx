"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Check, X, Sparkles, Music, HelpCircle } from "lucide-react"
import type { LyricChallenge } from "@/lib/data/vocabulary/types"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type LyricChallengeGameProps = {
  lyrics: LyricChallenge[]
  onComplete?: () => void
}

type GameState = {
  currentIndex: number
  userInputs: string[]
  isChecked: boolean
  showHint: boolean
  score: number
  completedItems: Set<number>
}

function checkLyricMatch(userInput: string, actualLine: string): boolean {
  const actualWords = actualLine.toLowerCase().split(/\s+/)
  const userWords = userInput.toLowerCase().split(/\s+/)
  const matchCount = actualWords.filter(word =>
    userWords.some(userWord => userWord === word)
  ).length
  return matchCount / actualWords.length > 0.7
}

export function LyricChallengeGame({ lyrics, onComplete }: LyricChallengeGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const currentLyric = lyrics[0]

  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    userInputs: Array.from({ length: currentLyric.missing.length }, () => ""),
    isChecked: false,
    showHint: false,
    score: 0,
    completedItems: new Set(),
  })

  const current = lyrics[state.currentIndex]
  const totalLyrics = lyrics.length
  const allCorrect = current.missing.every((lineIndex, inputIndex) =>
    checkLyricMatch(state.userInputs[inputIndex] || "", current.lyrics[lineIndex])
  )

  function handleInputChange(index: number, value: string) {
    setState(prev => {
      const newInputs = [...prev.userInputs]
      newInputs[index] = value
      return { ...prev, userInputs: newInputs }
    })
  }

  function checkAnswers() {
    const isCorrect = allCorrect && state.userInputs.every(input => input.trim())

    setState(prev => {
      const isNewCompletion = isCorrect && !prev.completedItems.has(prev.currentIndex)

      const newCompletedItems = isNewCompletion
        ? new Set([...prev.completedItems, prev.currentIndex])
        : prev.completedItems

      const newScore = isNewCompletion ? prev.score + 1 : prev.score

      if (newCompletedItems.size === totalLyrics && onComplete) {
        setTimeout(onComplete, 800)
      }

      return {
        ...prev,
        isChecked: true,
        score: newScore,
        completedItems: newCompletedItems,
      }
    })
  }

  function navigate(direction: 1 | -1) {
    const newIndex = (state.currentIndex + direction + totalLyrics) % totalLyrics
    const newLyric = lyrics[newIndex]

    setState(prev => ({
      ...prev,
      currentIndex: newIndex,
      userInputs: Array.from({ length: newLyric.missing.length }, () => ""),
      isChecked: false,
      showHint: false,
    }))
  }

  function resetCurrent() {
    setState(prev => ({
      ...prev,
      userInputs: Array.from({ length: current.missing.length }, () => ""),
      isChecked: false,
      showHint: false,
    }))
  }

  const canCheck = state.userInputs.every(input => input.trim()) && !state.isChecked

  return (
    <div className="space-y-6 bg-game-surface">
      {/* Header */}
      <div className="flex items-center gap-3">
        
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="p-2.5 rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-game-text-muted">Song {state.currentIndex + 1} of {totalLyrics}</span>
            <span className="text-game-primary font-semibold">{state.score} correct</span>
          </div>
          <div className="h-1.5 bg-game-primary-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-game-gradient rounded-full"
              initial={false}
              animate={{ width: `${((state.currentIndex + 1) / totalLyrics) * 100}%` }}
              transition={smoothSpring}
            />
          </div>
        </div>

        <motion.button
          onClick={() => navigate(1)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="p-2.5 rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Song Title */}
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Music className="h-5 w-5 text-game-primary" />
          <h2 className="text-xl font-bold text-game-primary">{current.title}</h2>
          <Music className="h-5 w-5 text-game-primary" />
        </motion.div>

        <motion.button
          onClick={() => setState(prev => ({ ...prev, showHint: !prev.showHint }))}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="flex items-center gap-1 mx-auto px-3 py-1 text-xs rounded-full bg-game-surface border border-game-border text-game-primary"
        >
          <HelpCircle className="h-3 w-3" />
          {state.showHint ? "Hide Context" : "Show Context"}
        </motion.button>

        <AnimatePresence>
          {state.showHint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-xl bg-game-primary-soft text-game-text text-sm"
            >
              {current.context}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Lyrics Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
          className="p-4 rounded-xl bg-game-surface border border-game-border space-y-3"
        >
          {current.lyrics.map((line, lineIndex) => {
            const isMissing = current.missing.includes(lineIndex)
            const missingIndex = current.missing.indexOf(lineIndex)

            return (
              <div key={lineIndex} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-game-primary-soft text-game-primary flex items-center justify-center font-medium text-sm">
                  {lineIndex + 1}
                </div>

                {isMissing ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={state.userInputs[missingIndex] || ""}
                      onChange={e => handleInputChange(missingIndex, e.target.value)}
                      disabled={state.isChecked}
                      placeholder="Type the missing lyric..."
                      className={`
                        w-full px-3 py-2 rounded-lg border-2 text-sm
                        bg-game-surface placeholder-game-text-muted
                        transition-colors focus:outline-none
                        ${state.isChecked
                          ? checkLyricMatch(state.userInputs[missingIndex] || "", line)
                            ? "border-game-success text-game-success-text"
                            : "border-game-error text-game-error-text"
                          : "border-game-border text-game-text focus:border-game-primary"
                        }
                      `}
                    />
                    {state.isChecked && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 mt-1 text-xs"
                      >
                        {checkLyricMatch(state.userInputs[missingIndex] || "", line) ? (
                          <Check className="h-3 w-3 text-game-success" />
                        ) : (
                          <X className="h-3 w-3 text-game-error" />
                        )}
                        <span className="text-game-text-muted">
                          Actual: <span className="text-game-text">{line}</span>
                        </span>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <p className="flex-1 px-3 py-2 rounded-lg bg-game-surface-soft text-game-text">
                    {line}
                  </p>
                )}
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence mode="wait">
        {!state.isChecked ? (
          <motion.button
            key="check"
            onClick={checkAnswers}
            disabled={!canCheck}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: canCheck ? 1 : 0.4 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={smoothSpring}
            className="w-full py-4 text-base font-semibold rounded-2xl bg-game-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed"
          >
            Check Answers
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              key="retry"
              onClick={resetCurrent}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 py-3 text-sm font-semibold rounded-xl bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary transition-colors"
            >
              Try Again
            </motion.button>
            <motion.button
              key="next"
              onClick={() => navigate(1)}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl text-white shadow-md flex items-center justify-center gap-2 ${
                allCorrect ? "bg-gradient-to-r from-game-success to-emerald-600" : "bg-game-gradient"
              }`}
            >
              {allCorrect && <Sparkles className="h-4 w-4" />}
              Next Song
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {state.completedItems.size === totalLyrics && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={smoothSpring}
            className="text-center p-4 rounded-xl bg-game-success-light border border-game-success"
          >
            <div className="flex items-center justify-center gap-2 text-game-success-text">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">All lyrics completed!</span>
              <Sparkles className="h-5 w-5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
