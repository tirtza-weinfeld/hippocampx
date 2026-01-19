"use client";

import { use, useState } from "react";
import {
  FileQuestion,
  Sparkles,
  Trophy,
  Sigma,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { FormulaLemmaPair } from "@/lib/db/queries/games/formula-match";
import { shuffle, chunkArray, PAIRS_PER_ROUND } from "@/lib/games/utils";
import { MatchingBoard } from "./matching-board";

export function FormulaMatchGame({
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
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div
          className="relative max-w-md overflow-hidden rounded-3xl bg-gradient-fm-term/10 p-8 text-center
            backdrop-blur-xl glow-fm-term/10
            starting:scale-95 starting:opacity-0
            transition-all duration-500 ease-out"
        >
          {/* Decorative gradient orb */}
          <div
            className="pointer-events-none absolute -right-12 -top-12 size-32
              rounded-full bg-gradient-fm-term/20 blur-3xl"
          />
          <div
            className="relative mx-auto mb-6 flex size-20 items-center justify-center
              rounded-2xl bg-gradient-fm-term/30"
          >
            <FileQuestion className="size-10 text-fm-term" strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gradient-fm-term-text">
            No Formulas Yet
          </h3>
          <p className="text-muted-foreground">
            Add formula notations to the dictionary first to start playing.
          </p>
        </div>
      </div>
    );
  }

  const currentRound = rounds[viewingIndex];
  const isSessionComplete = progressIndex >= rounds.length;
  const isViewingCompletedRound = completedRounds.has(viewingIndex);
  const totalPairs = shuffledPairs.length;
  const progressPercent = Math.round((score / totalPairs) * 100);

  const handleRoundComplete = (correctCount: number) => {
    setCompletedRounds((prev) => new Set(prev).add(viewingIndex));
    setScore((s) => s + correctCount);
    setProgressIndex((i) => i + 1);
    setViewingIndex((i) => i + 1);
    setCurrentRoundMatched(0);
  };

  const handleRestart = () => {
    setProgressIndex(0);
    setViewingIndex(0);
    setScore(0);
    setCompletedRounds(new Set());
  };

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < progressIndex && viewingIndex < rounds.length - 1;

  if (isSessionComplete) {
    const isPerfect = score === totalPairs;
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div
          className="relative max-w-md overflow-hidden rounded-3xl bg-gradient-fm-success/15 p-10 text-center
            backdrop-blur-xl glow-fm-success/20
            starting:scale-90 starting:opacity-0
            transition-all duration-700 ease-out"
        >
          {/* Decorative gradient orbs */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 size-40
              rounded-full bg-gradient-fm-success/25 blur-3xl"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-12 size-32
              rounded-full bg-gradient-fm-formula/20 blur-3xl"
          />
          <div
            className="relative mx-auto mb-6 flex size-24 items-center justify-center
              rounded-full bg-gradient-fm-success/30 animate-fm-celebrate"
          >
            {isPerfect ? (
              <Trophy className="size-12 text-fm-success" strokeWidth={1.5} />
            ) : (
              <Sparkles className="size-12 text-fm-success" strokeWidth={1.5} />
            )}
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gradient-fm-success">
            {isPerfect ? "Perfect Score!" : "Session Complete!"}
          </h2>
          <p className="mb-2 text-lg text-foreground">
            You matched{" "}
            <span className="font-bold text-gradient-fm-success">
              {score} / {totalPairs}
            </span>{" "}
            formulas
          </p>
          <p className="mb-8 text-muted-foreground">
            {isPerfect
              ? "Amazing work! You know your formulas perfectly."
              : `That's ${progressPercent}% correct. Keep practicing!`}
          </p>
          <button
            onClick={handleRestart}
            className="rounded-2xl bg-gradient-fm-success/25 px-8 py-3 font-semibold
              text-gradient-fm-success glow-fm-success/15
              transition-all duration-200 ease-out
              hover:bg-gradient-fm-success/35 hover:glow-fm-success/30
              hover:-translate-y-0.5 active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-4xl space-y-8 p-4 md:p-8
        starting:opacity-0 starting:translate-y-4
        transition-all duration-500 ease-out"
    >
      {/* Game Header */}
      <div
        className="relative flex items-center justify-between overflow-hidden rounded-2xl
          bg-gradient-fm-term/8 p-4 backdrop-blur-sm"
      >
        {/* Subtle decorative orb */}
        <div
          className="pointer-events-none absolute -left-8 -top-8 size-24
            rounded-full bg-gradient-fm-term/15 blur-2xl"
        />

        {/* Left: Round navigation */}
        <div className="relative flex items-center gap-3">
          <div
            className="flex size-12 items-center justify-center rounded-xl
              bg-gradient-fm-term/20"
          >
            <Sigma className="size-6 text-fm-term" strokeWidth={1.5} />
          </div>

          <div className="flex items-center gap-2">
            {completedRounds.size > 0 && (
              <button
                type="button"
                onClick={() => setViewingIndex((i) => i - 1)}
                disabled={!canGoBack}
                className="flex size-7 items-center justify-center rounded-md
                  text-fm-term transition-all duration-200
                  hover:bg-gradient-fm-term/20
                  disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" strokeWidth={2.5} />
              </button>
            )}

            <div className="text-center">
              <p className="font-semibold text-gradient-fm-term-text tabular-nums">
                Round {viewingIndex + 1}
                <span className="text-muted-foreground/60 font-normal">
                  {" "}/ {rounds.length}
                </span>
              </p>
              {isViewingCompletedRound && (
                <p className="text-xs text-fm-success">Reviewing</p>
              )}
            </div>

            {completedRounds.size > 0 && (
              <button
                type="button"
                onClick={() => setViewingIndex((i) => i + 1)}
                disabled={!canGoForward}
                className="flex size-7 items-center justify-center rounded-md
                  text-fm-term transition-all duration-200
                  hover:bg-gradient-fm-term/20
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
            <span className="font-semibold text-gradient-fm-success">
              {isViewingCompletedRound ? currentRound.length : currentRoundMatched}
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-muted-foreground">{currentRound.length}</span>
          </div>

          <div className="h-6 w-px bg-border/50" />

          {/* Total score */}
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-fm-success" strokeWidth={2} />
            <span className="text-lg font-bold text-gradient-fm-success tabular-nums">
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Matching Board */}
      <MatchingBoard
        key={viewingIndex}
        pairs={currentRound}
        onComplete={handleRoundComplete}
        onProgress={setCurrentRoundMatched}
        reviewMode={isViewingCompletedRound}
      />
    </div>
  );
}
