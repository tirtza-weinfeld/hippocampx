import type { MemoryPair } from "@/lib/data/vocabulary/types"
import type { CardType, Difficulty, DifficultyConfig, GameState } from "./types"

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

export function generateCards(pairs: MemoryPair[], difficulty: Difficulty): CardType[] {
  const numPairs = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8
  const selectedPairs = shuffleArray(pairs).slice(0, numPairs)
  const cards: CardType[] = []

  for (let index = 0; index < selectedPairs.length; index++) {
    const pair = selectedPairs[index]
    cards.push({
      id: index * 2,
      content: pair.word,
      type: "word",
      matched: false,
      flipped: false,
      matchId: index,
    })
    cards.push({
      id: index * 2 + 1,
      content: pair.definition,
      type: "definition",
      matched: false,
      flipped: false,
      matchId: index,
    })
  }

  return shuffleArray(cards)
}

export function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  const configs: Record<Difficulty, DifficultyConfig> = {
    easy: { pairs: 4, columns: "grid-cols-4 grid-rows-4 max-w-2xl mx-auto", label: "4 pairs" },
    medium: { pairs: 6, columns: "grid-cols-4 grid-rows-4 max-w-2xl mx-auto", label: "6 pairs" },
    hard: { pairs: 8, columns: "grid-cols-4 grid-rows-4 max-w-2xl mx-auto", label: "8 pairs" },
  }
  return configs[difficulty]
}

export function createInitialState(pairs: MemoryPair[]): GameState {
  return {
    cards: generateCards(pairs, "medium"),
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    difficulty: "medium",
    isComplete: false,
    lastMatchedId: null,
    streak: 0,
  }
}

export const GRID_SLOTS = 16
export const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"] as const
