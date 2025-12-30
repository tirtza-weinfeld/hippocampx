import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFormulaLemmaPairs } from "@/lib/db/queries/games/formula-match";
import { FormulaMatchGame } from "@/components/games/formula-match/game";

export const metadata: Metadata = {
  title: "Formula Match",
  description: "Match mathematical formulas with their names",
};

function LoadingSkeleton() {
  return (
    <div>
      <div>
        <div />
      </div>
      <div>
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} />
          ))}
        </div>
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FormulaMatchPage() {
  const pairsPromise = fetchFormulaLemmaPairs();

  return (
    <main>
      <header>
        <h1>
          Formula Match
        </h1>
        <p>
          Match each mathematical formula with its name
        </p>
      </header>

      <Suspense fallback={<LoadingSkeleton />}>
        <FormulaMatchGame pairsPromise={pairsPromise} />
      </Suspense>
    </main>
  );
}
