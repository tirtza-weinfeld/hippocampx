import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchFormulaLemmaPairs } from "@/lib/db/queries/games/formula-match";
import { FormulaMatchGame } from "@/components/games/formula-match/game";

export const metadata: Metadata = {
  title: "Formula Match",
  description: "Match mathematical formulas to their names",
};

export default function FormulaMatchPage() {
  const pairsPromise = fetchFormulaLemmaPairs();

  return (
    <div>
      <h1>Formula Match</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <FormulaMatchGame pairsPromise={pairsPromise} />
      </Suspense>
    </div>
  );
}
