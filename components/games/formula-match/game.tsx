"use client";

import { use, useState } from "react";
import type { FormulaLemmaPair } from "@/lib/db/queries/games/formula-match";
import { RoundPlayer } from "./round-player";

export function FormulaMatchGame({
  pairsPromise,
}: {
  pairsPromise: Promise<FormulaLemmaPair[]>;
}) {
  const pairs = use(pairsPromise);
  const [roundKey, setRoundKey] = useState(0);
  const [score, setScore] = useState(0);

  if (pairs.length === 0) {
    return (
      <p>No formulas available. Add formula notations to the dictionary first.</p>
    );
  }

  const handleRoundComplete = (correct: number) => {
    setScore((s) => s + correct);
    setRoundKey((k) => k + 1);
  };

  return (
    <div>
      <p>
        Score: <span>{score}</span>
      </p>
      <RoundPlayer
        key={roundKey}
        pairs={pairs}
        onComplete={handleRoundComplete}
      />
    </div>
  );
}
