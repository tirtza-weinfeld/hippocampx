import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFormulaLemmaPairs } from "@/lib/db/queries/games/formula-match";
import { FormulaMatchGame } from "@/components/games/formula-match/game";
import { GameSkeleton } from "@/components/games/formula-match/game-skeleton";

export const metadata: Metadata = {
  title: "Formula Match",
  description: "Match mathematical formulas with their names",
};

export default function FormulaMatchPage() {
  const pairsPromise = fetchFormulaLemmaPairs();

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <header className="text-center space-y-2">
        <h1 className="mx-auto w-fit text-3xl font-bold tracking-tight text-gradient-fm-title">
          Formula Match
        </h1>
        <p className=" text-gradient-fm-title/50">
          Match each mathematical formula with its name
        </p>
      </header>

      <Suspense fallback={<GameSkeleton />}>
        <FormulaMatchGame pairsPromise={pairsPromise} />
      </Suspense>
    </main>
  );
}
