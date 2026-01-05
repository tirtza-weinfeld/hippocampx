"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import type { ChamberConfig } from "@/lib/games/word-vault/types";

interface CompletionModalProps {
  chamber: ChamberConfig;
  score: number;
  onContinue: () => void;
}

export function CompletionModal({
  chamber,
  score,
  onContinue,
}: CompletionModalProps) {
  const isFinalChamber = chamber.number === 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative max-w-md w-full overflow-hidden rounded-3xl
          bg-gradient-wv-surface p-8 text-center
          glow-wv-success/20 animate-wv-complete"
      >
        {/* Decorative gradient orbs */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 size-40
            rounded-full bg-gradient-wv-success/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -right-12 size-32
            rounded-full bg-gradient-wv-available/15 blur-3xl"
        />

        {/* Icon */}
        <div
          className="relative mx-auto mb-6 flex size-20 items-center justify-center
            rounded-2xl bg-gradient-wv-success/30"
        >
          <Sparkles className="size-10 text-wv-success" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-gradient-wv-success">
          {isFinalChamber ? "Vault Unlocked!" : "Chamber Complete!"}
        </h2>

        {/* Score */}
        <p className="mb-4 text-lg text-foreground">
          Score:{" "}
          <span className="font-bold text-gradient-wv-success">{score}</span>
        </p>

        {/* AI concept learned */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-wv-hint-bg/50">
          <p className="text-xs text-muted-foreground mb-1">You learned:</p>
          <p className="text-xl font-bold text-gradient-wv-title">
            {chamber.aiConcept}
          </p>
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-2xl
            bg-gradient-wv-button px-8 py-3 font-semibold text-white
            glow-wv-primary/15 transition-all duration-200 ease-out
            hover:bg-gradient-wv-button-hover hover:glow-wv-primary/30
            hover:-translate-y-0.5 active:scale-95"
        >
          {isFinalChamber ? "See Full Message" : "Continue"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
