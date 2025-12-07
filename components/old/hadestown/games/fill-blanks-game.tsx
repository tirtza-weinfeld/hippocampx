"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Check, X, Sparkles } from "lucide-react"
import type { FillBlanksSentence } from "@/lib/data/vocabulary/types"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type FillBlanksGameProps = {
  sentences: FillBlanksSentence[]
  onComplete?: () => void
}

type GameState = {
  currentIndex: number
  selectedOption: string | null
  isCorrect: boolean | null
  score: number
  completedItems: Set<number>
}

export function FillBlanksGame({ sentences, onComplete }: FillBlanksGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const [state, setState] = useState<GameState>({
    currentIndex: 0,
    selectedOption: null,
    isCorrect: null,
    score: 0,
    completedItems: new Set(),
  })

  const currentSentence = sentences[state.currentIndex]
  const isAnswered = state.isCorrect !== null
  const canCheck = state.selectedOption !== null && !isAnswered

  function selectOption(option: string) {
    if (isAnswered) return
    setState(prev => ({ ...prev, selectedOption: option }))
  }

  function checkAnswer() {
    if (!state.selectedOption) return

    const correct = state.selectedOption === currentSentence.answer
    const isNewCompletion = correct && !state.completedItems.has(state.currentIndex)

    setState(prev => {
      const newCompletedItems = isNewCompletion
        ? new Set([...prev.completedItems, prev.currentIndex])
        : prev.completedItems

      const newScore = isNewCompletion ? prev.score + 1 : prev.score

      if (newCompletedItems.size === sentences.length && onComplete) {
        setTimeout(onComplete, 800)
      }

      return {
        ...prev,
        isCorrect: correct,
        score: newScore,
        completedItems: newCompletedItems,
      }
    })
  }

  function navigate(direction: 1 | -1) {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + direction + sentences.length) % sentences.length,
      selectedOption: null,
      isCorrect: null,
    }))
  }

  function renderSentence() {
    const parts = currentSentence.sentence.split("_____")

    return (
      <p className="text-lg leading-relaxed text-game-text">
        {parts[0]}
        <span className={`
          inline-block min-w-[100px] px-3 py-1 mx-1 rounded-lg font-semibold text-center
          border-2 border-dashed transition-all duration-200
          ${state.selectedOption
            ? isAnswered
              ? state.isCorrect
                ? "bg-game-success-light border-game-success text-game-success-text"
                : "bg-game-error-light border-game-error text-game-error-text"
              : "bg-game-selected border-game-primary text-game-selected-text"
            : "bg-game-surface-soft border-game-border text-game-text-muted"
          }
        `}>
          {state.selectedOption ?? "???"}
        </span>
        {parts[1]}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <NavButton direction="prev" onClick={() => navigate(-1)} shouldReduceMotion={shouldReduceMotion} />

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-game-text-muted">Sentence {state.currentIndex + 1} of {sentences.length}</span>
            <motion.span
              key={state.score}
              initial={shouldReduceMotion ? false : { scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-game-primary font-semibold"
            >
              {state.score} correct
            </motion.span>
          </div>
          <div className="h-1.5 bg-game-primary-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-game-gradient rounded-full"
              initial={false}
              animate={{ width: `${((state.currentIndex + 1) / sentences.length) * 100}%` }}
              transition={smoothSpring}
            />
          </div>
        </div>

        <NavButton direction="next" onClick={() => navigate(1)} shouldReduceMotion={shouldReduceMotion} />
      </div>

      {/* Sentence Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentIndex}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
          transition={smoothSpring}
          className="p-6 rounded-xl bg-game-surface border border-game-border"
        >
          {renderSentence()}
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {currentSentence.options.map((option, index) => {
          const isSelected = state.selectedOption === option
          const isCorrectAnswer = option === currentSentence.answer
          const showCorrect = isAnswered && isCorrectAnswer
          const showWrong = isAnswered && isSelected && !isCorrectAnswer

          return (
            <motion.button
              key={option}
              onClick={() => selectOption(option)}
              disabled={isAnswered}
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...smoothSpring, delay: shouldReduceMotion ? 0 : index * 0.05 }}
              whileTap={shouldReduceMotion || isAnswered ? undefined : { scale: 0.98 }}
              className={`
                p-3 rounded-xl text-sm font-medium
                border-2 transition-all duration-200
                flex items-center justify-center gap-2
                ${showCorrect
                  ? "bg-game-success-light border-game-success text-game-success-text"
                  : showWrong
                    ? "bg-game-error-light border-game-error text-game-error-text"
                    : isSelected
                      ? "bg-game-selected border-game-primary text-game-selected-text shadow-md"
                      : "bg-game-surface border-transparent hover:border-game-primary hover:bg-game-surface-soft text-game-text"
                }
                disabled:cursor-default
              `}
            >
              {showCorrect && <Check className="h-4 w-4" />}
              {showWrong && <X className="h-4 w-4" />}
              {option}
            </motion.button>
          )
        })}
      </div>

      {/* Action Button */}
      <AnimatePresence mode="wait">
        {!isAnswered ? (
          <motion.button
            key="check"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: canCheck ? 1 : 0.4 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={smoothSpring}
            onClick={checkAnswer}
            disabled={!canCheck}
            className="w-full py-4 text-base font-semibold rounded-2xl bg-game-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            key="next"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={smoothSpring}
            onClick={() => navigate(1)}
            className={`w-full py-4 text-base font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              state.isCorrect
                ? "bg-gradient-to-r from-game-success to-emerald-600"
                : "bg-game-gradient"
            }`}
          >
            {state.isCorrect && <Sparkles className="h-5 w-5" />}
            <span>{state.currentIndex < sentences.length - 1 ? "Next Sentence" : "Finish"}</span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

type NavButtonProps = {
  direction: "prev" | "next"
  onClick: () => void
  shouldReduceMotion: boolean | null
}

function NavButton({ direction, onClick, shouldReduceMotion }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight

  return (
    <motion.button
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      className="p-2.5 rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary hover:bg-game-surface-soft transition-colors"
      aria-label={direction === "prev" ? "Previous sentence" : "Next sentence"}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  )
}
