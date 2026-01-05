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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="relative max-w-sm overflow-hidden rounded-3xl p-8 text-center
            bg-gradient-mm-front/10 backdrop-blur-xl glow-mm-front/10
            starting:scale-95 starting:opacity-0
            transition-all duration-500"
        >
          <div
            className="pointer-events-none absolute -right-12 -top-12 size-32
              rounded-full bg-gradient-mm-back/20 blur-3xl"
          />
          <div
            className="relative mx-auto mb-4 flex size-16 items-center justify-center
              rounded-2xl bg-gradient-mm-back/20"
          >
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gradient-mm-text">
            No Formulas Yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Add formula notations to the dictionary first.
          </p>
        </div>
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
    const isPerfect = percentage === 100;

    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="relative max-w-sm overflow-hidden rounded-3xl p-10 text-center
            bg-gradient-mm-success/15 backdrop-blur-xl glow-mm-success/20
            starting:scale-90 starting:opacity-0
            transition-all duration-700"
        >
          {/* Decorative gradient orbs */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 size-40
              rounded-full bg-gradient-mm-success/25 blur-3xl"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-12 size-32
              rounded-full bg-gradient-mm-back/20 blur-3xl"
          />

          <div
            className="relative mx-auto mb-6 flex size-20 items-center justify-center
              rounded-full bg-gradient-mm-success/30 animate-mm-glow"
          >
            <span className="text-4xl">
              {isPerfect ? "🏆" : percentage >= 80 ? "🌟" : "✨"}
            </span>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gradient-mm-success-text">
            {isPerfect ? "Perfect Score!" : "Session Complete!"}
          </h2>

          <p className="mb-2 text-lg">
            <span className="font-bold text-gradient-mm-success-text">{score}</span>
            <span className="text-muted-foreground"> / {totalPairs}</span>
          </p>

          <p className="mb-8 text-sm text-muted-foreground">
            {isPerfect
              ? "Amazing! You matched everything."
              : percentage >= 80
                ? "Great recall! Keep it up."
                : "Practice makes perfect!"}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="rounded-2xl px-8 py-3 font-semibold
              bg-gradient-mm-success/25 text-gradient-mm-success-text glow-mm-success/15
              transition-all duration-200
              hover:bg-gradient-mm-success/35 hover:glow-mm-success/30
              hover:-translate-y-0.5 active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const cards = generateCards(currentRound);

  return (
    <div
      className="space-y-6
        starting:opacity-0 starting:translate-y-4
        transition-all duration-500"
    >
      {/* Stats bar */}
      <div
        className="relative flex items-center justify-between overflow-hidden rounded-2xl
          bg-gradient-mm-back/8 p-4 backdrop-blur-sm"
      >
        {/* Subtle decorative orb */}
        <div
          className="pointer-events-none absolute -left-8 -top-8 size-24
            rounded-full bg-gradient-mm-back/15 blur-2xl"
        />

        <div className="relative flex flex-col items-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Round
          </span>
          <span className="text-xl font-bold text-gradient-mm-text">
            {currentRoundIndex + 1}
            <span className="text-muted-foreground font-normal">/{rounds.length}</span>
          </span>
        </div>

        <div
          className="relative flex items-center gap-3 rounded-xl
            bg-gradient-mm-success/15 px-5 py-2 glow-mm-success/10"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Score
            </span>
            <span className="text-2xl font-bold text-gradient-mm-success-text">
              {score}
            </span>
          </div>
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
