import type { MemoryPair } from "@/lib/data/vocabulary/types"

export type CardType = {
  id: number
  content: string
  type: "word" | "definition"
  matched: boolean
  flipped: boolean
  matchId: number
}

export type Difficulty = "easy" | "medium" | "hard"

export type DifficultyConfig = {
  pairs: number
  columns: string
  label: string
}

export type GameState = {
  cards: CardType[]
  flippedCards: number[]
  matchedPairs: number
  moves: number
  difficulty: Difficulty
  isComplete: boolean
  lastMatchedId: number | null
  streak: number
}

export type WordMemoryGameProps = {
  pairs: MemoryPair[]
  onComplete?: () => void
}
