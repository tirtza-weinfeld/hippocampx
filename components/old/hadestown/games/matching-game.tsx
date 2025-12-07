"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { RotateCcw, Sparkles } from "lucide-react"
import type { MatchingPair } from "@/lib/data/vocabulary/types"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type MatchingGameProps = {
  pairs: MatchingPair[]
  onComplete?: () => void
}

type MatchingState = {
  selectedWord: string | null
  matchedPairs: Set<string>
  wrongPair: { word: string; match: string } | null
  attempts: number
}

export function MatchingGame({ pairs, onComplete }: MatchingGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const [state, setState] = useState<MatchingState>({
    selectedWord: null,
    matchedPairs: new Set(),
    wrongPair: null,
    attempts: 0,
  })

  const [shuffledMatches] = useState(() => {
    return [...pairs].map(p => p.match).sort(() => Math.random() - 0.5)
  })

  const isComplete = state.matchedPairs.size === pairs.length
  const accuracy = state.attempts > 0 ? Math.round((state.matchedPairs.size / state.attempts) * 100) : 0

  function selectWord(word: string) {
    if (state.matchedPairs.has(word)) return
    setState(prev => ({ ...prev, selectedWord: word, wrongPair: null }))
  }

  function selectMatch(match: string) {
    if (!state.selectedWord) return

    const correctPair = pairs.find(p => p.word === state.selectedWord)
    const isCorrect = correctPair?.match === match

    const currentSelectedWord = state.selectedWord
    if (!currentSelectedWord) return

    setState(prev => {
      const newAttempts = prev.attempts + 1

      if (isCorrect) {
        const newMatched = new Set([...prev.matchedPairs, currentSelectedWord])

        if (newMatched.size === pairs.length && onComplete) {
          setTimeout(onComplete, 800)
        }

        return {
          ...prev,
          selectedWord: null,
          matchedPairs: newMatched,
          wrongPair: null,
          attempts: newAttempts,
        }
      }

      return {
        ...prev,
        wrongPair: { word: currentSelectedWord, match },
        attempts: newAttempts,
      }
    })

    if (!isCorrect) {
      setTimeout(() => {
        setState(prev => ({ ...prev, wrongPair: null }))
      }, 600)
    }
  }

  function reset() {
    setState({
      selectedWord: null,
      matchedPairs: new Set(),
      wrongPair: null,
      attempts: 0,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-game-text-muted">
            Matched: <span className="font-semibold text-game-primary">{state.matchedPairs.size}</span> / {pairs.length}
          </p>
          <div className="h-1.5 w-32 bg-game-primary-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-game-gradient rounded-full"
              initial={false}
              animate={{ width: `${(state.matchedPairs.size / pairs.length) * 100}%` }}
              transition={smoothSpring}
            />
          </div>
        </div>

        <motion.button
          onClick={reset}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </motion.button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Words Column */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-game-text-muted mb-3">Words</p>
          {pairs.map((pair, index) => {
            const isMatched = state.matchedPairs.has(pair.word)
            const isSelected = state.selectedWord === pair.word
            const isWrong = state.wrongPair?.word === pair.word

            return (
              <motion.button
                key={pair.word}
                onClick={() => selectWord(pair.word)}
                disabled={isMatched}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...smoothSpring, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                whileTap={shouldReduceMotion || isMatched ? undefined : { scale: 0.98 }}
                className={`
                  w-full p-3 rounded-xl text-left text-sm font-medium
                  border-2 transition-all duration-200
                  ${isMatched
                    ? "bg-game-success-light border-game-success text-game-success-text"
                    : isWrong
                      ? "bg-game-error-light border-game-error text-game-error-text animate-shake"
                      : isSelected
                        ? "bg-game-selected border-game-primary text-game-selected-text shadow-md"
                        : "bg-game-surface border-transparent hover:border-game-primary hover:bg-game-surface-soft text-game-text"
                  }
                  disabled:cursor-default
                `}
              >
                {pair.word}
              </motion.button>
            )
          })}
        </div>

        {/* Matches Column */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-game-text-muted mb-3">Definitions</p>
          {shuffledMatches.map((match, index) => {
            const matchedWord = pairs.find(p => p.match === match && state.matchedPairs.has(p.word))
            const isMatched = !!matchedWord
            const isWrong = state.wrongPair?.match === match
            const canSelect = state.selectedWord && !isMatched

            return (
              <motion.button
                key={match}
                onClick={() => selectMatch(match)}
                disabled={isMatched || !state.selectedWord}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...smoothSpring, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                whileTap={shouldReduceMotion || isMatched || !canSelect ? undefined : { scale: 0.98 }}
                className={`
                  w-full p-3 rounded-xl text-left text-sm
                  border-2 transition-all duration-200
                  ${isMatched
                    ? "bg-game-success-light border-game-success text-game-success-text"
                    : isWrong
                      ? "bg-game-error-light border-game-error text-game-error-text animate-shake"
                      : canSelect
                        ? "bg-game-surface border-transparent hover:border-game-primary hover:bg-game-surface-soft text-game-text cursor-pointer"
                        : "bg-game-surface border-transparent text-game-text-muted cursor-default opacity-60"
                  }
                `}
              >
                {match}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={smoothSpring}
            className="text-center p-4 rounded-xl bg-game-success-light border border-game-success"
          >
            <div className="flex items-center justify-center gap-2 text-game-success-text">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">All matched!</span>
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm text-game-success-text mt-1">
              Accuracy: {accuracy}% ({state.matchedPairs.size}/{state.attempts} attempts)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
