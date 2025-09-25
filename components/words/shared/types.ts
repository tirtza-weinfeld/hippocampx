// export interface GameState {
//   readonly score: number;
//   readonly level: number;
//   readonly isComplete: boolean;
//   readonly timeStarted: Date;
//   readonly timeElapsed: number;
// }

// export type Difficulty = 'easy' | 'medium' | 'hard';

// export interface WordCoachQuestion {
//   readonly id: string;
//   readonly word: string;
//   readonly correctDefinition: string;
//   readonly incorrectOptions: readonly string[];
//   readonly difficulty: Difficulty;
// }

// export interface WordleGuess {
//   readonly word: string;
//   readonly feedback: readonly LetterFeedback[];
// }

// export type LetterStatus = 'correct' | 'present' | 'absent';

// export interface LetterFeedback {
//   readonly letter: string;
//   readonly status: LetterStatus;
// }

// export interface SpellingBeeGame {
//   readonly centerLetter: string;
//   readonly outerLetters: readonly string[];
//   readonly foundWords: readonly string[];
//   readonly totalWords: readonly string[];
//   readonly pangrams: readonly string[];
//   readonly maxScore: number;
//   readonly currentScore: number;
// }

// export interface LetterBoxedGame {
//   readonly sides: readonly (readonly string[])[];
//   readonly foundWords: readonly string[];
//   readonly currentWord: string;
//   readonly targetWordCount: number;
//   readonly isComplete: boolean;
// }

// export interface WordStats {
//   readonly gamesPlayed: number;
//   readonly gamesWon: number;
//   readonly currentStreak: number;
//   readonly maxStreak: number;
//   readonly averageGuesses: number;
// }