// Chamber identification
export type ChamberId =
  | "tokenization"
  | "embeddings"
  | "attention"
  | "training"
  | "context-window"
  | "temperature"
  | "transformer";

export type ChamberStatus = "locked" | "available" | "completed";

export interface ChamberConfig {
  id: ChamberId;
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  subtitle: string;
  aiConcept: string;
  icon: string;
}

// Progress & State
export interface ChamberProgress {
  status: ChamberStatus;
  bestScore: number | null;
  completedAt: string | null;
}

export interface VaultProgress {
  currentChamber: ChamberId;
  chambers: Record<ChamberId, ChamberProgress>;
  completedAt: string | null;
}

// Base puzzle type - all chambers extend this
export interface BasePuzzle {
  id: string;
  chamberId: ChamberId;
}

// Chamber 1: Tokenization (BPE)
export interface TokenizationPuzzle extends BasePuzzle {
  chamberId: "tokenization";
  initialText: string;
  targetMerges: number;
  expectedSequence: string[];
}

export interface CharPairFrequency {
  pair: string;
  count: number;
}

// Chamber 2: Embeddings
export interface WordCoordinate {
  word: string;
  x: number;
  y: number;
}

export interface EmbeddingsQuestion {
  type: "nearest" | "arithmetic" | "find";
  prompt: string;
  expectedAnswer: string;
}

export interface EmbeddingsPuzzle extends BasePuzzle {
  chamberId: "embeddings";
  gridSize: { width: number; height: number };
  words: WordCoordinate[];
  questions: EmbeddingsQuestion[];
}

// Chamber 3: Attention
export interface AttentionPuzzle extends BasePuzzle {
  chamberId: "attention";
  sentence: string;
  blankIndex: number;
  words: Array<{
    word: string;
    values: string[];
  }>;
  correctAnswer: string;
  optimalDistribution: number[];
}

// Chamber 4: Training (Gradient Descent)
export interface TrainingExample {
  sentence: string;
  words: string[];
  targetScore: number;
}

export interface TrainingPuzzle extends BasePuzzle {
  chamberId: "training";
  wordList: string[];
  initialWeights: number[];
  trainingExamples: TrainingExample[];
  learningRate: number;
  targetWeights: number[];
}

// Chamber 5: Context Window
export interface ContextQuestion {
  question: string;
  answer: string;
  appearsAtPosition: number;
}

export interface ContextPuzzle extends BasePuzzle {
  chamberId: "context-window";
  fullText: string;
  windowSize: number;
  questions: ContextQuestion[];
}

// Chamber 6: Temperature (Sampling)
export interface TemperatureOption {
  token: string;
  baseScore: number;
}

export interface TemperaturePuzzle extends BasePuzzle {
  chamberId: "temperature";
  context: string;
  options: TemperatureOption[];
  targetTemperature: number;
  targetOutcome: string;
}

// Chamber 7: Transformer (Using the Model)
export interface SlotAttention {
  word: string;
  score: number; // 0-10 attention weight
}

export interface SlotEmbedding {
  word: string;
  x: number;
  y: number;
  isCorrect?: boolean; // The word that should be selected
}

export interface CompletionSlot {
  context: string; // The sentence fragment for this blank (e.g., "Happy ___ Year")
  correctWord: string; // The word to fill in
  attention: SlotAttention[]; // Words with their attention scores
  embeddings: SlotEmbedding[]; // Word options in embedding space
  optimalTemperature: number; // Temperature that makes correct word most likely
}

export interface TransformerPuzzle extends BasePuzzle {
  chamberId: "transformer";
  slots: CompletionSlot[]; // Interactive slots to fill
  finalMessage: string; // Complete message after all blanks filled
}

// Union type for all puzzles
export type WordVaultPuzzle =
  | TokenizationPuzzle
  | EmbeddingsPuzzle
  | AttentionPuzzle
  | TrainingPuzzle
  | ContextPuzzle
  | TemperaturePuzzle
  | TransformerPuzzle;

// Board component props - consistent across all chambers
export interface ChamberBoardProps<T extends WordVaultPuzzle> {
  puzzle: T;
  onComplete: (score: number) => void;
}
