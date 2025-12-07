/**
 * Types for vocabulary game data
 * These types are generic and can be used for any themed vocabulary content
 */

export type VocabularyItem = {
  word: string
  definition: string
  example: string
  options: string[]
}

export type MatchingPair = {
  word: string
  match: string
}

export type FillBlanksSentence = {
  sentence: string
  answer: string
  options: string[]
}

export type WordCategory = {
  category: string
  words: string[]
}

export type VocabularyData = {
  quiz: VocabularyItem[]
  matching: MatchingPair[]
  fillBlanks: FillBlanksSentence[]
  categories: WordCategory[]
}

export type GameGuideContent = {
  title: string
  steps: string[]
}

export type GameGuides = {
  quiz: GameGuideContent
  matching: GameGuideContent
  fillBlanks: GameGuideContent
  categories: GameGuideContent
}

/**
 * Types for spelling game data
 */
export type SpellingWord = {
  word: string
  hint: string
  funFact?: string
  character?: string
}

export type SpellingGuideStep = {
  title: string
  content: string
  target?: string | null
  image?: string
}

/**
 * Types for word memory game data
 */
export type MemoryPair = {
  word: string
  definition: string
}

/**
 * Types for lyrics challenge game data
 */
export type LyricChallenge = {
  title: string
  lyrics: string[]
  missing: number[]
  context: string
}

/**
 * Types for seasons sorting game data
 */
export type SeasonItem = {
  id: string
  name: string
  emoji: string
}

export type Season = {
  id: string
  name: string
  description: string
  color: string
  items: SeasonItem[]
}
