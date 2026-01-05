"use client";

import type { Card } from "./game";
import { MathRenderer } from "@/components/mdx/parse/renderers/math-renderer";

type DataState = "selected" | "success" | "error" | undefined;

const getDataState = (
  isFlipped: boolean,
  isMatched: boolean,
  isError: boolean
): DataState => {
  if (isError) return "error";
  if (isMatched) return "success";
  if (isFlipped) return "selected";
  return undefined;
};

export function MemoryCard({
  card,
  isFlipped,
  isMatched,
  isError,
  onClick,
}: {
  card: Card;
  isFlipped: boolean;
  isMatched: boolean;
  isError: boolean;
  onClick: () => void;
}) {
  const dataState = getDataState(isFlipped, isMatched, isError);
  const showFront = isFlipped || isMatched;

  return (
    <button
      type="button"
      data-state={dataState}
      onClick={onClick}
      disabled={isMatched}
      className="relative w-full aspect-[4/5] rounded-2xl
        transition-all duration-200 ease-out
        hover:not-disabled:-translate-y-1
        active:not-disabled:scale-[0.98]
        disabled:cursor-default
        selected:animate-mm-flip
        error:animate-mm-shake
        success:animate-mm-glow"
    >
      {/* Back - visible when not flipped */}
      <div
        className={`!absolute inset-0 grid place-items-center rounded-2xl
          bg-gradient-mm-back glow-mm-back/25
          transition-opacity duration-300
          ${showFront ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <span className="text-4xl font-bold text-gradient-mm-text">?</span>
      </div>

      {/* Front - visible when flipped */}
      <div
        data-state={dataState}
        className={`!absolute inset-0 grid place-items-center rounded-2xl p-3
          backdrop-blur-sm transition-all duration-300
          bg-gradient-mm-front/10
          selected:bg-gradient-mm-selected/15 selected:glow-mm-front/25
          success:bg-gradient-mm-success/15 success:opacity-70
          error:bg-gradient-mm-error/15 error:glow-mm-error/30
          ${showFront ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {card.type === "formula" ? (
          <MathRenderer latex={card.content} />
        ) : (
          <span
            className="text-sm font-medium text-center
              text-gradient-mm-front-text
              success:text-gradient-mm-success-text
              error:text-gradient-mm-error-text"
          >
            {card.content}
          </span>
        )}
      </div>
    </button>
  );
}
