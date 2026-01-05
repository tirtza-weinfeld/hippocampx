"use client";

import type { ReactNode } from "react";
import type {
  ChamberId,
  ChamberConfig,
  VaultProgress,
} from "@/lib/games/word-vault/types";
import { ProgressIndicator } from "./progress-indicator";
import { ChamberNavigation } from "./chamber-navigation";

interface ChamberShellProps {
  chamber: ChamberConfig;
  children: ReactNode;
  progress: VaultProgress;
  onNavigate: (chamberId: ChamberId) => void;
}

export function ChamberShell({
  chamber,
  children,
  progress,
  onNavigate,
}: ChamberShellProps) {
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <ProgressIndicator
        currentChamber={progress.currentChamber}
        chambers={progress.chambers}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gradient-wv-title">
          {chamber.title}
        </h1>
        <p className="text-sm text-gradient-wv-muted">
          {chamber.subtitle}
          <span className="mx-2 text-muted-foreground/30">|</span>
          <span className="italic opacity-80">{chamber.aiConcept}</span>
        </p>
      </header>

      {/* Chamber content (the actual game board) */}
      <div className="min-h-[300px]">{children}</div>

      {/* Navigation */}
      <ChamberNavigation progress={progress} onNavigate={onNavigate} />
    </div>
  );
}
