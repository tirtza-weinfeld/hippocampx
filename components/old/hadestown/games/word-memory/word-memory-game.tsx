"use client"

import { useState, useCallback, useRef } from "react"
import { useReducedMotion } from "motion/react"
import type { CardType, Difficulty, WordMemoryGameProps } from "./types"
import { generateCards, getDifficultyConfig, createInitialState, GRID_SLOTS } from "./utils"
import { MemoryCard } from "./memory-card"
import { DifficultySelector } from "./difficulty-selector"
import { GameStats } from "./game-stats"
import { GameCompletion } from "./game-completion"

export function WordMemoryGame({ pairs, onComplete }: WordMemoryGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const isProcessingRef = useRef(false)
  const [state, setState] = useState(function() {
    return createInitialState(pairs)
  })

  const totalPairs = state.cards.length / 2
  const difficultyConfig = getDifficultyConfig(state.difficulty)

  const changeDifficulty = useCallback(function(newDifficulty: Difficulty) {
    isProcessingRef.current = false
    setState({
      cards: generateCards(pairs, newDifficulty),
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      difficulty: newDifficulty,
      isComplete: false,
      lastMatchedId: null,
      streak: 0,
    })
  }, [pairs])

  const resetGame = useCallback(function() {
    isProcessingRef.current = false
    setState(function(prev) {
      return {
        cards: generateCards(pairs, prev.difficulty),
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        difficulty: prev.difficulty,
        isComplete: false,
        lastMatchedId: null,
        streak: 0,
      }
    })
  }, [pairs])

  const handleCardClick = useCallback(function(cardId: number) {
    if (isProcessingRef.current) return

    setState(function(prev) {
      const clickedCard = prev.cards.find(function(card) { return card.id === cardId })

      if (!clickedCard || clickedCard.flipped || clickedCard.matched || prev.flippedCards.length >= 2) {
        return prev
      }

      const newCards = prev.cards.map(function(card) {
        return card.id === cardId ? { ...card, flipped: true } : card
      })
      const newFlippedCards = [...prev.flippedCards, cardId]

      if (newFlippedCards.length === 2) {
        isProcessingRef.current = true
        const firstCard = newCards.find(function(card) { return card.id === newFlippedCards[0] })
        const secondCard = newCards.find(function(card) { return card.id === newFlippedCards[1] })

        if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
          const matchedCards = newCards.map(function(card) {
            return card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, matched: true }
              : card
          })
          const newMatchedPairs = prev.matchedPairs + 1
          const isComplete = newMatchedPairs === prev.cards.length / 2
          const newStreak = prev.streak + 1

          setTimeout(function() {
            isProcessingRef.current = false
            if (isComplete && onComplete) {
              onComplete()
            }
          }, 500)

          return {
            ...prev,
            cards: matchedCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: prev.moves + 1,
            isComplete,
            lastMatchedId: firstCard.matchId,
            streak: newStreak,
          }
        } else {
          setTimeout(function() {
            setState(function(s) {
              return {
                ...s,
                cards: s.cards.map(function(card) {
                  return card.id === newFlippedCards[0] || card.id === newFlippedCards[1]
                    ? { ...card, flipped: false }
                    : card
                }),
                flippedCards: [],
                lastMatchedId: null,
              }
            })
            isProcessingRef.current = false
          }, 1200)

          return {
            ...prev,
            cards: newCards,
            flippedCards: newFlippedCards,
            moves: prev.moves + 1,
            lastMatchedId: null,
            streak: 0,
          }
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
      }
    })
  }, [onComplete])

  return (
    <div className="space-y-4 sm:space-y-6">
      <GameStats
        matchedPairs={state.matchedPairs}
        totalPairs={totalPairs}
        moves={state.moves}
        streak={state.streak}
        onReset={resetGame}
      />

      <DifficultySelector
        currentDifficulty={state.difficulty}
        onChangeDifficulty={changeDifficulty}
      />

      <div className={`grid ${difficultyConfig.columns} gap-2 sm:gap-3`}>
        {Array.from({ length: GRID_SLOTS }).map(function(_, index) {
          const card = state.cards[index] as CardType | undefined

          if (card === undefined) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const isDisabled = card.flipped || card.matched || state.flippedCards.length >= 2

          return (
            <MemoryCard
              key={`${state.difficulty}-${card.id}`}
              card={card}
              isDisabled={isDisabled}
              shouldReduceMotion={shouldReduceMotion}
              onClick={function() { handleCardClick(card.id) }}
            />
          )
        })}
      </div>

      {state.isComplete && (
        <GameCompletion moves={state.moves} onPlayAgain={resetGame} />
      )}
    </div>
  )
}
