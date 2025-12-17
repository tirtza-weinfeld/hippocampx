"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "motion/react"
import { ChevronLeft, ChevronRight, Check, X, Lightbulb, Sparkles } from "lucide-react"
import type { VocabularyItem } from "@/lib/data/vocabulary/types"

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
}

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type QuizGameProps = {
  items: VocabularyItem[]
  onComplete?: () => void
}

type QuizState = {
  currentIndex: number
  selectedOption: string | null
  isCorrect: boolean | null
  showHint: boolean
  score: number
  completedItems: Set<number>
}

export function QuizGame({ items, onComplete }: QuizGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    selectedOption: null,
    isCorrect: null,
    showHint: false,
    score: 0,
    completedItems: new Set(),
  })

  const currentItem = items[state.currentIndex]
  const isAnswered = state.isCorrect !== null
  const canCheck = state.selectedOption !== null && !isAnswered
  const maxOptions = useMemo(() => Math.max(...items.map(item => item.options.length)), [items])

  function selectOption(option: string) {
    if (isAnswered) return
    setState(prev => ({ ...prev, selectedOption: option }))
  }

  function checkAnswer() {
    if (!state.selectedOption) return

    const correct = state.selectedOption === currentItem.definition
    const isNewCompletion = correct && !state.completedItems.has(state.currentIndex)

    setState(prev => {
      const newCompletedItems = isNewCompletion
        ? new Set([...prev.completedItems, prev.currentIndex])
        : prev.completedItems

      const newScore = isNewCompletion ? prev.score + 1 : prev.score

      if (newCompletedItems.size === items.length && onComplete) {
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
      currentIndex: (prev.currentIndex + direction + items.length) % items.length,
      selectedOption: null,
      isCorrect: null,
      showHint: false,
    }))
  }

  function toggleHint() {
    setState(prev => ({ ...prev, showHint: !prev.showHint }))
  }

  const motionConfig = shouldReduceMotion ? { transition: { duration: 0 } } : {}

  return (
    <LayoutGroup>
      <div className="flex flex-col h-full min-h-[500px]">
        {/* Progress Header */}
        <header className="flex items-center gap-3 pb-4 mb-4 border-b border-old-game-border">
          <NavButton direction="prev" onClick={() => navigate(-1)} disabled={false} {...motionConfig} />

          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-old-game-text-muted">Question {state.currentIndex + 1} of {items.length}</span>
              <motion.span
                key={state.score}
                initial={shouldReduceMotion ? false : { scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-old-game-primary font-semibold"
              >
                {state.score} correct
              </motion.span>
            </div>
            <div className="h-1.5 bg-old-game-primary-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-old-game-gradient rounded-full"
                initial={false}
                animate={{ width: `${((state.currentIndex + 1) / items.length) * 100}%` }}
                transition={smoothSpring}
              />
            </div>
          </div>

          <NavButton direction="next" onClick={() => navigate(1)} disabled={false} {...motionConfig} />
        </header>

        {/* Question Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentIndex}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={smoothSpring}
              className="flex-1 flex flex-col"
            >
              {/* Word */}
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-old-game-gradient mb-3">
                  {currentItem.word}
                </h2>

                <button
                  onClick={toggleHint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-old-game-surface-soft text-old-game-text-muted hover:text-old-game-primary transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {state.showHint ? "Hide hint" : "Show hint"}
                </button>

                <AnimatePresence>
                  {state.showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={smoothSpring}
                      className="overflow-hidden"
                    >
                      <p className="p-3 text-sm italic text-old-game-text-muted bg-old-game-surface-soft rounded-lg max-w-md mx-auto">
                        &quot;{currentItem.example}&quot;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Options */}
              <div className="space-y-2.5" style={{ minHeight: `${maxOptions * 68}px` }}>
                {currentItem.options.map((option, index) => (
                  <OptionCard
                    key={`${state.currentIndex}-${index}`}
                    option={option}
                    letter={String.fromCharCode(65 + index)}
                    isSelected={state.selectedOption === option}
                    isCorrect={option === currentItem.definition}
                    isAnswered={isAnswered}
                    onSelect={() => selectOption(option)}
                    index={index}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>

              {/* Action Button - inline with content */}
              <div className="mt-6">
                <ActionButton
                  isAnswered={isAnswered}
                  isCorrect={state.isCorrect}
                  canCheck={canCheck}
                  isLastItem={state.currentIndex === items.length - 1}
                  onCheck={checkAnswer}
                  onNext={() => navigate(1)}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  )
}

type NavButtonProps = {
  direction: "prev" | "next"
  onClick: () => void
  disabled: boolean
  transition?: { duration: number }
}

function NavButton({ direction, onClick, disabled, transition }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={transition?.duration === 0 ? undefined : { scale: 1.1 }}
      whileTap={transition?.duration === 0 ? undefined : { scale: 0.95 }}
      transition={spring}
      className="p-2.5 rounded-full bg-old-game-surface border border-old-game-border text-old-game-text-muted hover:text-old-game-primary hover:border-old-game-primary hover:bg-old-game-surface-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label={direction === "prev" ? "Previous question" : "Next question"}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  )
}

type OptionCardProps = {
  option: string
  letter: string
  isSelected: boolean
  isCorrect: boolean
  isAnswered: boolean
  onSelect: () => void
  index: number
  shouldReduceMotion: boolean | null
}

function OptionCard({
  option,
  letter,
  isSelected,
  isCorrect,
  isAnswered,
  onSelect,
  index,
  shouldReduceMotion,
}: OptionCardProps) {
  function getVariant(): "default" | "selected" | "correct" | "incorrect" {
    if (isAnswered && isCorrect) return "correct"
    if (isAnswered && isSelected && !isCorrect) return "incorrect"
    if (isSelected) return "selected"
    return "default"
  }

  const variant = getVariant()

  const styles = {
    default: "bg-old-game-surface border-transparent hover:border-old-game-primary hover:bg-old-game-surface-soft",
    selected: "bg-old-game-selected border-old-game-primary shadow-md",
    correct: "bg-old-game-success-light border-old-game-success shadow-md",
    incorrect: "bg-old-game-error-light border-old-game-error shadow-md",
  }

  const letterStyles = {
    default: "old-game-primary-soft text-old-game-primary",
    selected: "bg-old-game-primary text-white",
    correct: "bg-old-game-success text-white",
    incorrect: "bg-old-game-error text-white",
  }

  return (
    <motion.button
      onClick={onSelect}
      disabled={isAnswered}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothSpring, delay: shouldReduceMotion ? 0 : index * 0.05 }}
      whileHover={shouldReduceMotion || isAnswered ? undefined : { scale: 1.01 }}
      whileTap={shouldReduceMotion || isAnswered ? undefined : { scale: 0.99 }}
      className={`w-full text-left p-3.5 rounded-xl border-2 transition-colors duration-200 ${styles[variant]}`}
    >
      <div className="flex items-center gap-3">
        <motion.span
          layout
          className={`flex-shrink-0 w-8 h-8 rounded-full font-semibold text-sm flex items-center justify-center transition-colors ${letterStyles[variant]}`}
        >
          {isAnswered && isCorrect ? <Check className="h-4 w-4" /> : isAnswered && isSelected && !isCorrect ? <X className="h-4 w-4" /> : letter}
        </motion.span>
        <span className={`flex-1 text-sm leading-snug ${variant === "default" ? "text-old-game-text" : variant === "correct" ? "text-old-game-success-text" : variant === "incorrect" ? "text-old-game-error-text" : "text-old-game-selected-text"}`}>
          {option}
        </span>
      </div>
    </motion.button>
  )
}

type ActionButtonProps = {
  isAnswered: boolean
  isCorrect: boolean | null
  canCheck: boolean
  isLastItem: boolean
  onCheck: () => void
  onNext: () => void
  shouldReduceMotion: boolean | null
}

function ActionButton({
  isAnswered,
  isCorrect,
  canCheck,
  isLastItem,
  onCheck,
  onNext,
  shouldReduceMotion,
}: ActionButtonProps) {
  return (
    <AnimatePresence mode="wait">
      {!isAnswered ? (
        <motion.button
          key="check"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: canCheck ? 1 : 0.4 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
          transition={smoothSpring}
          onClick={onCheck}
          disabled={!canCheck}
          className="w-full py-4 text-base font-semibold rounded-2xl bg-old-game-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed"
        >
          Check Answer
        </motion.button>
      ) : (
        <motion.button
          key="next"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={spring}
          onClick={onNext}
          className={`w-full py-4 text-base font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            isCorrect
              ? "bg-gradient-to-r from-old-game-success to-emerald-600"
              : "bg-old-game-gradient"
          }`}
        >
          {isCorrect && <Sparkles className="h-5 w-5" />}
          <span>{isLastItem ? "Finish Quiz" : "Next Question"}</span>
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
