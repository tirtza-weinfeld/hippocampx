"use client";

import { useState, startTransition, ViewTransition } from "react";
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";
import type { FormulaLemmaPair } from "@/lib/db/queries/games/formula-match";

type GameState = "playing" | "correct" | "incorrect";

type Round = {
  pairs: FormulaLemmaPair[];
  options: string[];
};

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRound(pairs: FormulaLemmaPair[], count = 4): Round {
  const selected = shuffle(pairs).slice(0, count);
  return {
    pairs: selected,
    options: shuffle(selected.map((p) => p.lemma)),
  };
}

export function RoundPlayer({
  pairs,
  onComplete,
}: {
  pairs: FormulaLemmaPair[];
  onComplete: (correct: number) => void;
}) {
  const [round] = useState(() => createRound(pairs));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [state, setState] = useState<GameState>("playing");

  const current = round.pairs[currentIndex];
  const isLastQuestion = currentIndex >= round.pairs.length - 1;

  const handleAnswer = (selected: string) => {
    if (state !== "playing") return;

    startTransition(() => {
      if (selected === current.lemma) {
        setState("correct");
        setCorrectCount((c) => c + 1);
      } else {
        setState("incorrect");
      }
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      startTransition(() => {
        setCurrentIndex((i) => i + 1);
        setState("playing");
      });
    } else {
      onComplete(correctCount + (state === "correct" ? 1 : 0));
    }
  };

  return (
    <>
      <p>
        Question {currentIndex + 1} of {round.pairs.length}
      </p>

      <ViewTransition>
        <div key={currentIndex}>
          <MathRenderer latex={current.formula} />
        </div>
      </ViewTransition>

      <div>
        {round.options.map((lemma) => (
          <button
            key={lemma}
            onClick={() => handleAnswer(lemma)}
            disabled={state !== "playing"}
          >
            {lemma}
          </button>
        ))}
      </div>

      <ViewTransition>
        {state !== "playing" && (
          <div data-state={state}>
            <p>
              {state === "correct" ? "Correct!" : `Wrong! It was: ${current.lemma}`}
            </p>
            <button onClick={handleNext}>
              {isLastQuestion ? "New Round" : "Next"}
            </button>
          </div>
        )}
      </ViewTransition>
    </>
  );
}
