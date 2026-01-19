"use client";

import { use, useState } from "react";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
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
  const [progressIndex, setProgressIndex] = useState(0);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<Set<number>>(
    () => new Set()
  );
  const [currentRoundMatched, setCurrentRoundMatched] = useState(0);

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

  const currentRound = rounds[viewingIndex];
  const isSessionComplete = progressIndex >= rounds.length;
  const isViewingCompletedRound = completedRounds.has(viewingIndex);
  const totalPairs = shuffledPairs.length;

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < progressIndex && viewingIndex < rounds.length - 1;

  const handleRoundComplete = (matchedCount: number) => {
    setCompletedRounds((prev) => new Set(prev).add(viewingIndex));
    setScore((s) => s + matchedCount);
    setProgressIndex((i) => i + 1);
    setViewingIndex((i) => i + 1);
    setCurrentRoundMatched(0);
  };

  const handleRestart = () => {
    setProgressIndex(0);
    setViewingIndex(0);
    setScore(0);
    setCompletedRounds(new Set());
    setCurrentRoundMatched(0);
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

        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            {completedRounds.size > 0 && (
              <button
                type="button"
                onClick={() => setViewingIndex((i) => i - 1)}
                disabled={!canGoBack}
                className="flex size-7 items-center justify-center rounded-md
                  text-gradient-mm-text transition-all duration-200
                  hover:bg-gradient-mm-back/20
                  disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" strokeWidth={2.5} />
              </button>
            )}

            <div className="text-center">
              <p className="font-semibold text-gradient-mm-text tabular-nums">
                Round {viewingIndex + 1}
                <span className="text-muted-foreground/60 font-normal">
                  {" "}/ {rounds.length}
                </span>
              </p>
              {isViewingCompletedRound && (
                <p className="text-xs text-gradient-mm-success-text">Reviewing</p>
              )}
            </div>

            {completedRounds.size > 0 && (
              <button
                type="button"
                onClick={() => setViewingIndex((i) => i + 1)}
                disabled={!canGoForward}
                className="flex size-7 items-center justify-center rounded-md
                  text-gradient-mm-text transition-all duration-200
                  hover:bg-gradient-mm-back/20
                  disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Round Progress + Score */}
        <div className="relative flex items-center gap-4">
          {/* Round progress */}
          <div className="flex items-center gap-1.5 text-sm tabular-nums">
            <span className="font-semibold text-gradient-mm-success-text">
              {isViewingCompletedRound ? currentRound.length : currentRoundMatched}
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-muted-foreground">{currentRound.length}</span>
          </div>

          <div className="h-6 w-px bg-border/50" />

          {/* Total score */}
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-gradient-mm-success-text" strokeWidth={2} />
            <span className="text-lg font-bold text-gradient-mm-success-text tabular-nums">
              {score}
            </span>
          </div>
        </div>
      </div>

      <MemoryBoard
        key={viewingIndex}
        cards={cards}
        pairCount={currentRound.length}
        onComplete={handleRoundComplete}
        onProgress={setCurrentRoundMatched}
        reviewMode={isViewingCompletedRound}
      />
    </div>
  );
}
