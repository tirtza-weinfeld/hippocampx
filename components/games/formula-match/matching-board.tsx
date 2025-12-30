"use client";

import { useState } from "react";
import type { FormulaLemmaPair } from "@/lib/db/queries/games/formula-match";
import { shuffle } from "@/lib/games/utils";
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";

type Selection = { type: "lemma" | "formula"; id: number };
type CardState = "default" | "selected" | "success" | "error";

export function MatchingBoard({
  pairs,
  onComplete,
}: {
  pairs: FormulaLemmaPair[];
  onComplete: (correctCount: number) => void;
}) {
  const [shuffledLemmas] = useState(() => shuffle(pairs));
  const [shuffledFormulas] = useState(() => shuffle(pairs));
  const [selected, setSelected] = useState<Selection | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(() => new Set());
  const [errorCards, setErrorCards] = useState<Set<string>>(() => new Set());

  const getCardState = (pairId: number, type: "lemma" | "formula"): CardState => {
    if (matchedIds.has(pairId)) return "success";
    if (errorCards.has(`${type}-${pairId}`)) return "error";
    if (selected?.type === type && selected.id === pairId) return "selected";
    return "default";
  };

  const handleCardClick = (pair: FormulaLemmaPair, type: "lemma" | "formula") => {
    if (matchedIds.has(pair.id)) return;
    setErrorCards(new Set());

    const oppositeType = type === "lemma" ? "formula" : "lemma";

    if (selected?.type === oppositeType) {
      if (selected.id === pair.id) {
        const newMatched = new Set(matchedIds).add(pair.id);
        setMatchedIds(newMatched);
        setSelected(null);
        if (newMatched.size === pairs.length) {
          onComplete(pairs.length);
        }
      } else {
        setErrorCards(new Set([`${oppositeType}-${selected.id}`, `${type}-${pair.id}`]));
        setSelected(null);
      }
    } else {
      setSelected({ type, id: pair.id });
    }
  };

  const progress = (matchedIds.size / pairs.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      {/* Progress */}
      <div className="h-2 rounded-full bg-gradient-fm-term/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-fm-success
           transition-[width] 
           duration-500 ease-out
            glow-gradient-fm-success"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Terms */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gradient-fm-term-text">
            Terms
          </h3>
          <ul className="space-y-3">
            {shuffledLemmas.map((pair) => (
              <li key={pair.id}>
                <button
                  type="button"
                  onClick={() => handleCardClick(pair, "lemma")}
                  disabled={getCardState(pair.id, "lemma") === "success"}
                  data-state={getCardState(pair.id, "lemma")}
                  className="w-full min-h-14 px-5 py-4 rounded-2xl text-start font-medium 
                  text-sm sm:text-base
                  backdrop-blur-sm transition-all duration-200 ease-out
                    
                    bg-gradient-fm-term/10
                    
                    selected:bg-gradient-fm-term-selected/15
                    selected:glow-gradient-fm-term
                    selected:animate-fm-term-selected

                    error:bg-gradient-fm-error/15
                    error:glow-gradient-fm-error
                    error:animate-fm-error

                    success:bg-gradient-fm-success/15
                    success:animate-fm-success 
                    success:opacity-70
                    
                    hover:not-disabled:-translate-y-0.5 active:not-disabled:scale-[0.98]"
                >
                  <span className="text-gradient-fm-term-text selected:text-gradient-fm-term-selected error:text-gradient-fm-error success:text-gradient-fm-success">{pair.lemma}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Formulas */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gradient-fm-formula-text">
            Formulas
          </h3>
          <ul className="space-y-3">
            {shuffledFormulas.map((pair) => (
              <li key={pair.id}>
                <button
                  type="button"
                  onClick={() => handleCardClick(pair, "formula")}
                  disabled={getCardState(pair.id, "formula") === "success"}
                  data-state={getCardState(pair.id, "formula")}
                  className="w-full min-h-14 px-5 py-4 rounded-2xl text-start font-medium text-sm sm:text-base
                    backdrop-blur-sm transition-all duration-200 ease-out
                    bg-gradient-fm-formula/10
                    selected:bg-gradient-fm-formula-selected/15 selected:glow-gradient-fm-formula selected:animate-fm-formula-selected
                    error:bg-gradient-fm-error/15 error:glow-gradient-fm-error error:animate-fm-error
                    success:bg-gradient-fm-success/15 success:animate-fm-success success:opacity-70
                    hover:not-disabled:-translate-y-0.5 active:not-disabled:scale-[0.98]"
                >
                  <span
                    data-step={{
                      default: "cyan",
                      selected: "cyan",
                      error: "red",
                      success: "emerald",
                    }[getCardState(pair.id, "formula")]}
                  
                  // className="text-gradient-fm-formula-text selected:text-gradient-fm-formula-selected error:text-gradient-fm-error success:text-gradient-fm-success"
                  
                  >
                  
                   <MathRenderer latex={pair.formula} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-muted-foreground">
        <span className="font-bold text-gradient-fm-success">{matchedIds.size}</span>
        <span className="mx-1">/</span>
        <span>{pairs.length} matched</span>
      </p>
    </div>
  );
}
