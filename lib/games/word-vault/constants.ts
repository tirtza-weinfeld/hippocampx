import type { ChamberId, ChamberConfig, VaultProgress } from "./types";

export const CHAMBER_ORDER: ChamberId[] = [
  "tokenization",   // 1. Tokenization (BPE)
  "attention",      // 2. Attention
  "embeddings",     // 3. Embeddings
  "temperature",    // 4. Temperature (Sampling)
  "training",       // 5. Training (Gradient Descent)
  "context-window", // 6. Context Window
  "transformer",    // 7. Transformer (Using the Model)
];

export const CHAMBERS: Record<ChamberId, ChamberConfig> = {
  tokenization: {
    id: "tokenization",
    number: 1,
    title: "Tokenization",
    subtitle: "Count pairs, merge the most common",
    aiConcept: "BPE",
    icon: "Merge",
  },
  attention: {
    id: "attention",
    number: 2,
    title: "Attention",
    subtitle: "Decide what matters",
    aiConcept: "Self-Attention",
    icon: "Focus",
  },
  embeddings: {
    id: "embeddings",
    number: 3,
    title: "Embeddings",
    subtitle: "Words in vector space",
    aiConcept: "Word Embeddings",
    icon: "Map",
  },
  temperature: {
    id: "temperature",
    number: 4,
    title: "Temperature",
    subtitle: "Control randomness",
    aiConcept: "Sampling",
    icon: "Dices",
  },
  training: {
    id: "training",
    number: 5,
    title: "Training",
    subtitle: "Learn from errors",
    aiConcept: "Gradient Descent",
    icon: "SlidersHorizontal",
  },
  "context-window": {
    id: "context-window",
    number: 6,
    title: "Context Window",
    subtitle: "Limited memory",
    aiConcept: "Context Length",
    icon: "ScrollText",
  },
  transformer: {
    id: "transformer",
    number: 7,
    title: "Transformer",
    subtitle: "Use your trained model",
    aiConcept: "Inference",
    icon: "Workflow",
  },
};

function createInitialChamberProgress(): VaultProgress["chambers"] {
  const chambers = {} as VaultProgress["chambers"];

  for (const id of CHAMBER_ORDER) {
    chambers[id] = {
      status: id === "tokenization" ? "available" : "locked",
      bestScore: null,
      completedAt: null,
    };
  }

  return chambers;
}

export const INITIAL_PROGRESS: VaultProgress = {
  currentChamber: "tokenization",
  chambers: createInitialChamberProgress(),
  completedAt: null,
};

// Scoring
export const SCORE_PER_CORRECT = 10;
