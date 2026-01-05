"use client";

import { Trophy, RotateCcw } from "lucide-react";
import { PUZZLES } from "@/lib/games/word-vault/puzzles";

interface FinalMessageProps {
  onReset: () => void;
}

export function FinalMessage({ onReset }: FinalMessageProps) {
  const transformerPuzzle = PUZZLES.transformer[0];
  const finalMessage =
    "finalMessage" in transformerPuzzle ? transformerPuzzle.finalMessage : "";

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div
        className="relative max-w-lg w-full overflow-hidden rounded-3xl
          bg-gradient-wv-surface p-10 text-center
          glow-wv-success/25 animate-wv-complete"
      >
        {/* Decorative gradient orbs */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 size-48
            rounded-full bg-gradient-wv-success/15 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 size-40
            rounded-full bg-gradient-wv-available/15 blur-3xl"
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64
            rounded-full bg-gradient-wv-completed/10 blur-3xl"
        />

        {/* Trophy icon */}
        <div
          className="relative mx-auto mb-8 flex size-24 items-center justify-center
            rounded-full bg-gradient-wv-success/30"
        >
          <Trophy className="size-12 text-wv-success" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-gradient-wv-title">
          Vault Unlocked!
        </h1>

        <p className="mb-6 text-muted-foreground">
          You trained an AI through 6 chambers, then used it to complete this
          message:
        </p>

        {/* The completed message */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-wv-hint-bg/50">
          <p className="text-2xl font-bold text-gradient-wv-success tracking-wide whitespace-pre-line">
            {finalMessage}
          </p>
        </div>

        {/* Learning summary */}
        <div className="mb-8 text-sm text-muted-foreground">
          <p>This is how real language models work!</p>
          <p className="mt-1 opacity-75">
            Tokenization → Attention → Embeddings → Temperature → Training →
            Context → Completion
          </p>
        </div>

        {/* Play again button */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-2xl
            bg-gradient-wv-button px-8 py-3 font-semibold text-white
            glow-wv-primary/15 transition-all duration-200 ease-out
            hover:bg-gradient-wv-button-hover hover:glow-wv-primary/30
            hover:-translate-y-0.5 active:scale-95"
        >
          <RotateCcw className="size-4" />
          Play Again
        </button>
      </div>
    </div>
  );
}
