"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { RotateCcw, Check, X, Sparkles } from "lucide-react"
import type { WordCategory } from "@/lib/data/vocabulary/types"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type CategorySortGameProps = {
  categories: WordCategory[]
  onComplete?: () => void
}

type GameState = {
  selectedWord: string | null
  placements: Record<string, string> // word -> category
  checked: boolean
  correctCount: number
}

export function CategorySortGame({ categories, onComplete }: CategorySortGameProps) {
  const shouldReduceMotion = useReducedMotion()

  const [allWords] = useState(() => {
    return categories.flatMap(c => c.words).sort(() => Math.random() - 0.5)
  })

  const [state, setState] = useState<GameState>({
    selectedWord: null,
    placements: {},
    checked: false,
    correctCount: 0,
  })

  const unplacedWords = allWords.filter(word => !state.placements[word])
  const totalWords = allWords.length
  const placedCount = Object.keys(state.placements).length
  const isAllPlaced = placedCount === totalWords

  function selectWord(word: string) {
    if (state.checked) return
    setState(prev => ({
      ...prev,
      selectedWord: prev.selectedWord === word ? null : word,
    }))
  }

  function placeInCategory(categoryName: string) {
    if (!state.selectedWord || state.checked) return

    const wordToPlace = state.selectedWord
    setState(prev => ({
      ...prev,
      placements: { ...prev.placements, [wordToPlace]: categoryName },
      selectedWord: null,
    }))
  }

  function removeFromCategory(word: string) {
    if (state.checked) return

    setState(prev => {
      const { [word]: _removed, ...restPlacements } = prev.placements
      void _removed // Explicitly mark as intentionally unused
      return { ...prev, placements: restPlacements }
    })
  }

  function checkAnswers() {
    let correct = 0

    for (const [word, placedCategory] of Object.entries(state.placements)) {
      const actualCategory = categories.find(c => c.words.includes(word))
      if (actualCategory?.category === placedCategory) {
        correct++
      }
    }

    setState(prev => ({
      ...prev,
      checked: true,
      correctCount: correct,
    }))

    if (correct === totalWords && onComplete) {
      setTimeout(onComplete, 800)
    }
  }

  function reset() {
    setState({
      selectedWord: null,
      placements: {},
      checked: false,
      correctCount: 0,
    })
  }

  function isWordCorrect(word: string): boolean | null {
    if (!state.checked) return null
    const placedCategory = state.placements[word]
    const actualCategory = categories.find(c => c.words.includes(word))
    return actualCategory?.category === placedCategory
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-old-game-text-muted">
            Placed: <span className="font-semibold text-old-game-primary">{placedCount}</span> / {totalWords}
          </p>
          <div className="h-1.5 w-32 bg-old-game-primary-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-old-game-gradient rounded-full"
              initial={false}
              animate={{ width: `${(placedCount / totalWords) * 100}%` }}
              transition={smoothSpring}
            />
          </div>
        </div>

        <motion.button
          onClick={reset}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-old-game-surface border border-old-game-border text-old-game-text-muted hover:text-old-game-primary hover:border-old-game-primary transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </motion.button>
      </div>

      {/* Word Bank */}
      <div className="p-4 rounded-xl bg-old-game-surface border border-old-game-border">
        <p className="text-xs font-medium text-old-game-text-muted mb-3">Available Words</p>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence>
            {unplacedWords.map(word => (
              <motion.button
                key={word}
                onClick={() => selectWord(word)}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  border-2 transition-all duration-200
                  ${state.selectedWord === word
                    ? "bg-old-game-selected border-old-game-primary text-old-game-selected-text shadow-md"
                    : "bg-old-game-surface-soft border-transparent hover:border-old-game-primary text-old-game-text"
                  }
                `}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
          {unplacedWords.length === 0 && !state.checked && (
            <p className="text-sm text-old-game-text-muted italic">All words placed!</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map(category => {
          const wordsInCategory = Object.entries(state.placements)
            .filter(([, cat]) => cat === category.category)
            .map(([word]) => word)

          return (
            <motion.div
              key={category.category}
              onClick={() => placeInCategory(category.category)}
              className={`
                p-3 rounded-xl border-2 min-h-[120px]
                transition-all duration-200
                ${state.selectedWord && !state.checked
                  ? "border-dashed border-old-game-primary old-game-primary-soft cursor-pointer"
                  : "border-old-game-border bg-old-game-surface"
                }
              `}
            >
              <p className="text-xs font-semibold text-old-game-primary mb-2">{category.category}</p>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {wordsInCategory.map(word => {
                    const correct = isWordCorrect(word)

                    return (
                      <motion.button
                        key={word}
                        onClick={e => {
                          e.stopPropagation()
                          if (!state.checked) removeFromCategory(word)
                        }}
                        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                        className={`
                          px-2 py-1 rounded-md text-xs font-medium
                          flex items-center gap-1
                          transition-all duration-200
                          ${state.checked
                            ? correct
                              ? "bg-old-game-success-light text-old-game-success-text"
                              : "bg-old-game-error-light text-old-game-error-text"
                            : "bg-old-game-selected text-old-game-selected-text hover:opacity-80"
                          }
                          ${!state.checked ? "cursor-pointer" : "cursor-default"}
                        `}
                      >
                        {state.checked && (correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />)}
                        {word}
                      </motion.button>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Action Button */}
      <AnimatePresence mode="wait">
        {!state.checked ? (
          <motion.button
            key="check"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: isAllPlaced ? 1 : 0.4 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            transition={smoothSpring}
            onClick={checkAnswers}
            disabled={!isAllPlaced}
            className="w-full py-4 text-base font-semibold rounded-2xl bg-old-game-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed"
          >
            Check Answers
          </motion.button>
        ) : (
          <motion.div
            key="result"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothSpring}
            className={`
              text-center p-4 rounded-xl
              ${state.correctCount === totalWords
                ? "bg-old-game-success-light border border-old-game-success"
                : "bg-old-game-surface border border-old-game-border"
              }
            `}
          >
            {state.correctCount === totalWords ? (
              <div className="flex items-center justify-center gap-2 text-old-game-success-text">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Perfect! All words sorted correctly!</span>
                <Sparkles className="h-5 w-5" />
              </div>
            ) : (
              <div>
                <p className="font-semibold text-old-game-text">
                  {state.correctCount} / {totalWords} correct
                </p>
                <button
                  onClick={reset}
                  className="mt-2 text-sm text-old-game-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
