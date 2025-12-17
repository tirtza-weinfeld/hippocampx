"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { RotateCcw, Check, X, Sparkles, ChevronRight } from "lucide-react"
import type { Season, SeasonItem } from "@/lib/data/vocabulary/types"

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type SeasonsSortGameProps = {
  seasons: Season[]
  onComplete?: () => void
}

type GameState = {
  selectedItem: SeasonItem | null
  placements: Record<string, string> // itemId -> seasonId
  checked: boolean
  correctCount: number
  level: number
}

export function SeasonsSortGame({ seasons, onComplete }: SeasonsSortGameProps) {
  const shouldReduceMotion = useReducedMotion()

  const [allItems] = useState(() => {
    return seasons.flatMap(s => s.items).sort(() => Math.random() - 0.5)
  })

  const [state, setState] = useState<GameState>({
    selectedItem: null,
    placements: {},
    checked: false,
    correctCount: 0,
    level: 1,
  })

  const unplacedItems = allItems.filter(item => !state.placements[item.id])
  const totalItems = allItems.length
  const placedCount = Object.keys(state.placements).length
  const isAllPlaced = placedCount === totalItems

  function selectItem(item: SeasonItem) {
    if (state.checked) return
    setState(prev => ({
      ...prev,
      selectedItem: prev.selectedItem?.id === item.id ? null : item,
    }))
  }

  function placeInSeason(seasonId: string) {
    if (!state.selectedItem || state.checked) return

    const itemToPlace = state.selectedItem
    setState(prev => ({
      ...prev,
      placements: { ...prev.placements, [itemToPlace.id]: seasonId },
      selectedItem: null,
    }))
  }

  function removeFromSeason(itemId: string) {
    if (state.checked) return

    setState(prev => {
      const { [itemId]: _removed, ...restPlacements } = prev.placements
      void _removed // Explicitly mark as intentionally unused
      return { ...prev, placements: restPlacements }
    })
  }

  function checkAnswers() {
    let correct = 0

    for (const [itemId, placedSeasonId] of Object.entries(state.placements)) {
      const actualSeason = seasons.find(s => s.items.some(i => i.id === itemId))
      if (actualSeason?.id === placedSeasonId) {
        correct++
      }
    }

    setState(prev => ({
      ...prev,
      checked: true,
      correctCount: correct,
    }))

    if (correct === totalItems && onComplete) {
      setTimeout(onComplete, 800)
    }
  }

  function reset() {
    setState({
      selectedItem: null,
      placements: {},
      checked: false,
      correctCount: 0,
      level: state.level,
    })
  }

  function nextLevel() {
    setState(prev => ({
      selectedItem: null,
      placements: {},
      checked: false,
      correctCount: 0,
      level: prev.level + 1,
    }))
  }

  function isItemCorrect(itemId: string): boolean | null {
    if (!state.checked) return null
    const placedSeasonId = state.placements[itemId]
    const actualSeason = seasons.find(s => s.items.some(i => i.id === itemId))
    return actualSeason?.id === placedSeasonId
  }

  function getItemById(itemId: string): SeasonItem | undefined {
    return allItems.find(i => i.id === itemId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-old-game-text-muted">
            Placed: <span className="font-semibold text-old-game-primary">{placedCount}</span> / {totalItems}
          </p>
          <div className="h-1.5 w-32 bg-old-game-primary-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-old-game-gradient rounded-full"
              initial={false}
              animate={{ width: `${(placedCount / totalItems) * 100}%` }}
              transition={smoothSpring}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full old-game-primary-soft text-old-game-primary font-medium">
            Level {state.level}
          </span>
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
      </div>

      {/* Item Bank */}
      <div className="p-4 rounded-xl bg-old-game-surface border border-old-game-border">
        <p className="text-xs font-medium text-old-game-text-muted mb-3">Items to Sort</p>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence>
            {unplacedItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => selectItem(item)}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  border-2 transition-all duration-200
                  flex items-center gap-1.5
                  ${state.selectedItem?.id === item.id
                    ? "bg-old-game-selected border-old-game-primary text-old-game-selected-text shadow-md"
                    : "bg-old-game-surface-soft border-transparent hover:border-old-game-primary text-old-game-text"
                  }
                `}
              >
                <span className="text-base">{item.emoji}</span>
                {item.name}
              </motion.button>
            ))}
          </AnimatePresence>
          {unplacedItems.length === 0 && !state.checked && (
            <p className="text-sm text-old-game-text-muted italic">All items placed!</p>
          )}
        </div>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {seasons.map(season => {
          const itemsInSeason = Object.entries(state.placements)
            .filter(([, seasonId]) => seasonId === season.id)
            .map(([itemId]) => getItemById(itemId))
            .filter((item): item is SeasonItem => item !== undefined)

          return (
            <motion.div
              key={season.id}
              onClick={() => placeInSeason(season.id)}
              className={`
                p-3 rounded-xl border-2 min-h-[140px]
                transition-all duration-200
                ${state.selectedItem && !state.checked
                  ? "border-dashed border-old-game-primary old-game-primary-soft cursor-pointer"
                  : "border-old-game-border bg-old-game-surface"
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{season.id === "spring" ? "🌸" : season.id === "summer" ? "☀️" : season.id === "fall" ? "🍂" : "❄️"}</span>
                <p className="text-xs font-semibold text-old-game-primary">{season.name}</p>
              </div>
              <p className="text-xs text-old-game-text-muted mb-2">{season.description}</p>
              <div className="flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {itemsInSeason.map(item => {
                    const correct = isItemCorrect(item.id)

                    return (
                      <motion.button
                        key={item.id}
                        onClick={e => {
                          e.stopPropagation()
                          if (!state.checked) removeFromSeason(item.id)
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
                        <span>{item.emoji}</span>
                        {item.name}
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
              ${state.correctCount === totalItems
                ? "bg-old-game-success-light border border-old-game-success"
                : "bg-old-game-surface border border-old-game-border"
              }
            `}
          >
            {state.correctCount === totalItems ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-old-game-success-text">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Perfect! All items sorted correctly!</span>
                  <Sparkles className="h-5 w-5" />
                </div>
                <motion.button
                  onClick={nextLevel}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-old-game-success to-emerald-600 text-white font-semibold shadow-md"
                >
                  Next Level
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-old-game-text">
                  {state.correctCount} / {totalItems} correct
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
