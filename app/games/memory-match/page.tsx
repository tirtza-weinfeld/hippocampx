import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFormulaLemmaPairs } from "@/lib/db/queries/games/formula-match";
import { MemoryMatchGame } from "@/components/games/memory-match/game";

export const metadata: Metadata = {
  title: "Memory Match",
  description: "Find matching pairs of formulas and their names",
};

export default function MemoryMatchPage() {
  const pairsPromise = fetchFormulaLemmaPairs();

  return (
    <main>
      <div>
        <header>
          <h1>Memory Match</h1>
          <p>Find matching formula pairs</p>
        </header>
        <Suspense
          fallback={
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} />
              ))}
            </div>
          }
        >
          <MemoryMatchGame pairsPromise={pairsPromise} />
        </Suspense>
      </div>
    </main>
  );
}
