"use client";

import type { Card } from "./game";
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";

type CardState = "facedown" | "faceup" | "matched" | "error";

const getState = (
  isFlipped: boolean,
  isMatched: boolean,
  isError: boolean
): CardState => {
  if (isError) return "error";
  if (isMatched) return "matched";
  if (isFlipped) return "faceup";
  return "facedown";
};

export function MemoryCard({
  card,
  isFlipped,
  isMatched,
  isError,
  onClick,
  onAnimationEnd,
}: {
  card: Card;
  isFlipped: boolean;
  isMatched: boolean;
  isError: boolean;
  onClick: () => void;
  onAnimationEnd: () => void;
}) {
  const state = getState(isFlipped, isMatched, isError);

  return (
    <button
      type="button"
      data-state={state}
      onClick={onClick}
      onAnimationEnd={onAnimationEnd}
      disabled={isMatched}
    >
      <div>
        <div />
        <div>
          {card.type === "formula" ? (
            <MathRenderer latex={card.content} />
          ) : (
            <span>{card.content}</span>
          )}
        </div>
      </div>
    </button>
  );
}
