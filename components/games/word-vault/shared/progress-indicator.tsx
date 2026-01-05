"use client";

import { Check, Lock } from "lucide-react";
import type { ChamberId, ChamberProgress } from "@/lib/games/word-vault/types";
import { CHAMBER_ORDER, CHAMBERS } from "@/lib/games/word-vault/constants";

interface ProgressIndicatorProps {
  currentChamber: ChamberId;
  chambers: Record<ChamberId, ChamberProgress>;
  onNavigate?: (chamberId: ChamberId) => void;
}

export function ProgressIndicator({
  currentChamber,
  chambers,
  onNavigate,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {CHAMBER_ORDER.map((chamberId, index) => {
        const config = CHAMBERS[chamberId];
        const progress = chambers[chamberId];
        const isCurrent = chamberId === currentChamber;

        return (
          <div key={chamberId} className="flex items-center">
            <button
              type="button"
              onClick={() => onNavigate?.(chamberId)}
              className={`
                relative flex size-7 sm:size-8 items-center justify-center rounded-full
                text-xs sm:text-sm font-medium
                transition-all duration-300
                flex 
                ${onNavigate ? "cursor-pointer" : "cursor-default"}
                ${
                  progress.status === "locked"
                    ? "bg-gradient-wv-locked/50 text-wv-locked"
                    : progress.status === "completed"
                      ? "bg-gradient-wv-completed text-white glow-wv-completed/20"
                      : "bg-gradient-wv-available text-white glow-wv-available/25"
                }
                ${isCurrent ? "ring-2 ring-wv-primary ring-offset-2 ring-offset-background" : ""}
              `}
              title={`${config.title} - ${config.aiConcept}`}
            >
              {progress.status === "locked" && (
                <Lock className="size-3 sm:size-3.5" />
                
              )}
              {progress.status === "completed" && (
                <Check className="size-3.5 sm:size-4" strokeWidth={2.5} />
              )}
              {progress.status === "available" && config.number}
            </button>

            {/* Connector line */}
            {index < CHAMBER_ORDER.length - 1 && (
              <div
                className={`
                  mx-0.5 sm:mx-1 h-0.5 w-4 sm:w-6 transition-colors duration-300
                  ${
                    chambers[CHAMBER_ORDER[index + 1]].status !== "locked"
                      ? "bg-gradient-wv-completed"
                      : "bg-gradient-wv-locked/30"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
