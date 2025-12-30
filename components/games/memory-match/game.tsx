"use client";

import { use, useState } from "react";
import type { FormulaLemmaPair } from "@/lib/db/queries/games/formula-match";
import { shuffle, chunkArray, PAIRS_PER_ROUND } from "@/lib/games/utils";
import { MemoryBoard } from "./board";

export type Card = {
  id: string;
  pairId: number;
  type: "lemma" | "formula";
  content: string;
};

function generateCards(pairs: FormulaLemmaPair[]): Card[] {
  const cards: Card[] = [];
  for (const pair of pairs) {
    cards.push({
      id: `lemma-${pair.id}`,
      pairId: pair.id,
      type: "lemma",
      content: pair.lemma,
    });
    cards.push({
      id: `formula-${pair.id}`,
      pairId: pair.id,
      type: "formula",
      content: pair.formula,
    });
  }
  return shuffle(cards);
}

export function MemoryMatchGame({
  pairsPromise,
}: {
  pairsPromise: Promise<FormulaLemmaPair[]>;
}) {
  const allPairs = use(pairsPromise);
  const [shuffledPairs] = useState(() => shuffle(allPairs));
  const [rounds] = useState(() => chunkArray(shuffledPairs, PAIRS_PER_ROUND));
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);

  if (allPairs.length === 0) {
    return (
      <div>
        <p>
          No formulas available yet.
        </p>
        <p>
          Add formula notations to the dictionary first.
        </p>
      </div>
    );
  }

  const currentRound = rounds[currentRoundIndex];
  const isSessionComplete = currentRoundIndex >= rounds.length;
  const totalPairs = shuffledPairs.length;

  const handleRoundComplete = (matchedCount: number) => {
    setScore((s) => s + matchedCount);
    setCurrentRoundIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setScore(0);
  };

  if (isSessionComplete) {
    const percentage = Math.round((score / totalPairs) * 100);
    return (
      <div>
        <div>
          {percentage === 100 ? "🎉" : percentage >= 80 ? "🌟" : "✨"}
        </div>
        <h2>Session Complete!</h2>
        <div>
          <span>{score}</span>
          <span>/{totalPairs}</span>
        </div>
        <p>
          {percentage === 100
            ? "Perfect memory!"
            : percentage >= 80
              ? "Excellent recall!"
              : "Keep practicing!"}
        </p>
        <button
          type="button"
          onClick={handleRestart}
        >
          Play Again
        </button>
      </div>
    );
  }

  const cards = generateCards(currentRound);

  return (
    <div>
      <div>
        <div>
          <span>Round</span>
          <span>{currentRoundIndex + 1}/{rounds.length}</span>
        </div>
        <div>
          <span>Score</span>
          <span>{score}</span>
        </div>
      </div>
      <MemoryBoard
        key={currentRoundIndex}
        cards={cards}
        pairCount={currentRound.length}
        onComplete={handleRoundComplete}
      />
    </div>
  );
}
