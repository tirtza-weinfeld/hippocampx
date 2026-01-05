"use client";

import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import type { ChamberId, VaultProgress } from "@/lib/games/word-vault/types";
import { CHAMBER_ORDER } from "@/lib/games/word-vault/constants";

interface ChamberNavigationProps {
  progress: VaultProgress;
  onNavigate: (chamberId: ChamberId) => void;
}

export function ChamberNavigation({
  progress,
  onNavigate,
}: ChamberNavigationProps) {
  const currentIndex = CHAMBER_ORDER.indexOf(progress.currentChamber);
  const prevChamber = currentIndex > 0 ? CHAMBER_ORDER[currentIndex - 1] : null;
  const nextChamber =
    currentIndex < CHAMBER_ORDER.length - 1
      ? CHAMBER_ORDER[currentIndex + 1]
      : null;

  const canGoNext =
    nextChamber && progress.chambers[nextChamber].status !== "locked";
  const nextIsLocked =
    nextChamber && progress.chambers[nextChamber].status === "locked";

  return (
    <nav className="flex items-center justify-between">
      <button
        type="button"
        disabled={!prevChamber}
        onClick={() => prevChamber && onNavigate(prevChamber)}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-xl
          text-sm font-medium transition-all duration-200
          ${
            prevChamber
              ? "bg-gradient-wv-surface/50 text-gradient-wv-text hover:bg-gradient-wv-surface"
              : "opacity-40 cursor-not-allowed"
          }
        `}
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <span className="text-sm text-gradient-wv-muted">
        Chamber {currentIndex + 1} of {CHAMBER_ORDER.length}
      </span>

      <button
        type="button"
        disabled={!canGoNext}
        onClick={() => nextChamber && canGoNext && onNavigate(nextChamber)}
        className={`
          flex items-center gap-1.5 px-4 py-2 rounded-xl
          text-sm font-medium transition-all duration-200
          ${
            nextIsLocked
              ? "bg-gradient-wv-locked/30 text-wv-locked cursor-not-allowed"
              : canGoNext
                ? "bg-gradient-wv-surface/50 text-gradient-wv-text hover:bg-gradient-wv-surface"
                : "opacity-40 cursor-not-allowed"
          }
        `}
      >
        {nextIsLocked ? (
          <>
            <Lock className="size-3.5" />
            <span className="hidden sm:inline">Locked</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </>
        )}
      </button>
    </nav>
  );
}
