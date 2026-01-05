import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFormulaLemmaPairs } from "@/lib/db/queries/games/formula-match";
import { MemoryMatchGame } from "@/components/games/memory-match/game";
import { GameSkeleton } from "@/components/games/memory-match/game-skeleton";

export const metadata: Metadata = {
  title: "Memory Match",
  description: "Find matching pairs of formulas and their names",
};

export default function MemoryMatchPage() {
  const pairsPromise = fetchFormulaLemmaPairs();

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-8">
      <header className="text-center space-y-2">
        <h1 className="mx-auto w-fit text-3xl font-bold tracking-tight text-gradient-mm-text">
          Memory Match
        </h1>
        <p className="text-gradient-mm-text/50">
          Flip cards to find matching formula pairs
        </p>
      </header>

      <Suspense fallback={<GameSkeleton />}>
        <MemoryMatchGame pairsPromise={pairsPromise} />
      </Suspense>
    </div>
  );
}
