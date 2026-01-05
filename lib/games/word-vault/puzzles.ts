import type {
  ChamberId,
  TokenizationPuzzle,
  EmbeddingsPuzzle,
  AttentionPuzzle,
  TrainingPuzzle,
  ContextPuzzle,
  TemperaturePuzzle,
  TransformerPuzzle,
  WordVaultPuzzle,
} from "./types";

/**
 * Word Vault Puzzle Content
 *
 * Phase A (Chambers 1-6): Training - teaches how AI learns
 * Phase B (Chamber 7): Inference - use the trained model to complete a message
 *
 * Final message: "Happy New Year, bright thinker. So loved. So kind. Keep shining."
 *
 * Vocabulary themes:
 * - Wicked/Hadestown
 * - Italian (Duolingo Section 1)
 * - Anatomy (muscles, brain parts)
 * - AI models (Claude, GPT, LLaMA)
 * - Math (π, binary, Greek letters)
 * - Piano/Music
 */

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 1: TOKENIZATION (BPE)
// Theme: Wicked + AI vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const tokenizationPuzzle: TokenizationPuzzle = {
  id: "tokenization-1",
  chamberId: "tokenization",
  initialText: "CLAUDE DEFIES GRAVITY INFINITELY",
  targetMerges: 3,
  expectedSequence: ["IN", "DE", "IT"],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 2: EMBEDDINGS (Word Coordinates)
// Theme: Anatomy (muscles and brain parts)
// ─────────────────────────────────────────────────────────────────────────────
const embeddingsPuzzle: EmbeddingsPuzzle = {
  id: "embeddings-1",
  chamberId: "embeddings",
  gridSize: { width: 10, height: 10 },
  words: [
    { word: "QUADRICEPS", x: 6, y: 4 },
    { word: "HAMSTRINGS", x: 4, y: 3 },
    { word: "BICEPS", x: 8, y: 8 },
    { word: "HIPPOCAMPUS", x: 2, y: 8 },
    { word: "AMYGDALA", x: 3, y: 9 },
  ],
  questions: [
    {
      type: "nearest",
      prompt: "Which word is closest to QUADRICEPS?",
      expectedAnswer: "HAMSTRINGS",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 3: ATTENTION
// Theme: Wicked vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const attentionPuzzle: AttentionPuzzle = {
  id: "attention-1",
  chamberId: "attention",
  sentence: "The WIZARD flew DEFYING ___ on her broom",
  blankIndex: 4,
  words: [
    { word: "The", values: [] },
    { word: "WIZARD", values: ["magic", "flying", "spells", "gravity"] },
    { word: "flew", values: ["flying", "air", "gravity"] },
    { word: "DEFYING", values: ["against", "breaking", "gravity", "rules"] },
    { word: "on", values: [] },
    { word: "her", values: [] },
    { word: "broom", values: ["flying", "witch", "magic"] },
  ],
  correctAnswer: "GRAVITY",
  optimalDistribution: [0, 4, 1, 4, 0, 0, 1],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 4: TRAINING (Gradient Descent)
// Theme: Music vocabulary
// ─────────────────────────────────────────────────────────────────────────────
const trainingPuzzle: TrainingPuzzle = {
  id: "training-1",
  chamberId: "training",
  wordList: ["ALLEGRO", "FORTE", "PIANO", "ADAGIO"],
  initialWeights: [0, 0, 0, 0],
  trainingExamples: [
    {
      sentence: "The ALLEGRO FORTE section was exciting!",
      words: ["ALLEGRO", "FORTE"],
      targetScore: 5,
    },
    {
      sentence: "The ADAGIO PIANO passage was peaceful",
      words: ["ADAGIO", "PIANO"],
      targetScore: 1,
    },
    {
      sentence: "ALLEGRO brings energy to the piece",
      words: ["ALLEGRO"],
      targetScore: 3,
    },
  ],
  learningRate: 1,
  targetWeights: [3, 2, 1, 0],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 5: CONTEXT WINDOW
// Theme: Math (π)
// ─────────────────────────────────────────────────────────────────────────────
const contextPuzzle: ContextPuzzle = {
  id: "context-1",
  chamberId: "context-window",
  fullText:
    "Remember the number PI equals THREE POINT ONE FOUR " +
    "ONE FIVE NINE and it goes on forever " +
    "into infinity like an endless river flowing " +
    "through time now what was that number?",
  windowSize: 40,
  questions: [
    {
      question: "What is π rounded to 2 decimal places?",
      answer: "3.14",
      appearsAtPosition: 10,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 6: TEMPERATURE (Sampling)
// Theme: AI Models
// ─────────────────────────────────────────────────────────────────────────────
const temperaturePuzzle: TemperaturePuzzle = {
  id: "temperature-1",
  chamberId: "temperature",
  context: "The AI assistant made by Anthropic is called ___",
  options: [
    { token: "CLAUDE", baseScore: 10 },
    { token: "GPT", baseScore: 4 },
    { token: "LLAMA", baseScore: 3 },
    { token: "GEMINI", baseScore: 2 },
  ],
  targetTemperature: 0.2,
  targetOutcome: "CLAUDE",
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAMBER 7: TRANSFORMER (Using the Model - Inference)
// The trained model completes the message - INTERACTIVE
// Child uses attention → embeddings → temperature for each blank
// ─────────────────────────────────────────────────────────────────────────────
const transformerPuzzle: TransformerPuzzle = {
  id: "transformer-1",
  chamberId: "transformer",
  slots: [
    {
      context: "Happy ___ Year",
      correctWord: "New",
      attention: [
        { word: "Happy", score: 8 },
        { word: "Year", score: 9 },
      ],
      embeddings: [
        { word: "New", x: 7, y: 8, isCorrect: true },
        { word: "Fresh", x: 6, y: 7 },
        { word: "Good", x: 5, y: 6 },
        { word: "Old", x: 2, y: 3 },
      ],
      optimalTemperature: 0.3,
    },
    {
      context: "bright _____",
      correctWord: "thinker",
      attention: [
        { word: "bright", score: 10 },
        { word: "Happy", score: 3 },
        { word: "New", score: 2 },
      ],
      embeddings: [
        { word: "thinker", x: 8, y: 7, isCorrect: true },
        { word: "star", x: 7, y: 8 },
        { word: "mind", x: 6, y: 6 },
        { word: "light", x: 5, y: 9 },
      ],
      optimalTemperature: 0.5,
    },
    {
      context: "So _____",
      correctWord: "loved",
      attention: [
        { word: "So", score: 6 },
        { word: "bright", score: 4 },
        { word: "thinker", score: 5 },
      ],
      embeddings: [
        { word: "loved", x: 8, y: 8, isCorrect: true },
        { word: "happy", x: 7, y: 7 },
        { word: "blessed", x: 6, y: 8 },
        { word: "proud", x: 5, y: 6 },
      ],
      optimalTemperature: 0.4,
    },
    {
      context: "So _____",
      correctWord: "kind",
      attention: [
        { word: "So", score: 6 },
        { word: "loved", score: 7 },
      ],
      embeddings: [
        { word: "kind", x: 8, y: 7, isCorrect: true },
        { word: "sweet", x: 7, y: 8 },
        { word: "gentle", x: 6, y: 6 },
        { word: "nice", x: 5, y: 7 },
      ],
      optimalTemperature: 0.4,
    },
    {
      context: "Keep _____",
      correctWord: "shining",
      attention: [
        { word: "Keep", score: 9 },
        { word: "bright", score: 6 },
        { word: "thinker", score: 4 },
      ],
      embeddings: [
        { word: "shining", x: 8, y: 9, isCorrect: true },
        { word: "glowing", x: 7, y: 8 },
        { word: "growing", x: 6, y: 5 },
        { word: "going", x: 4, y: 4 },
      ],
      optimalTemperature: 0.3,
    },
  ],
  finalMessage: "Happy New Year, bright thinker.\nSo loved. So kind.\nKeep shining.",
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const PUZZLES: Record<ChamberId, WordVaultPuzzle[]> = {
  tokenization: [tokenizationPuzzle],
  embeddings: [embeddingsPuzzle],
  attention: [attentionPuzzle],
  training: [trainingPuzzle],
  "context-window": [contextPuzzle],
  temperature: [temperaturePuzzle],
  transformer: [transformerPuzzle],
};

export function getPuzzle(chamberId: ChamberId): WordVaultPuzzle {
  return PUZZLES[chamberId][0];
}
