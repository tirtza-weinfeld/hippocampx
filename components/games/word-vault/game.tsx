"use client";

import { useState } from "react";
import type { ChamberId, VaultProgress } from "@/lib/games/word-vault/types";
import {
  INITIAL_PROGRESS,
  CHAMBERS,
  CHAMBER_ORDER,
} from "@/lib/games/word-vault/constants";
import { PUZZLES } from "@/lib/games/word-vault/puzzles";
import { ChamberShell } from "./shared/chamber-shell";
import { CompletionModal } from "./shared/completion-modal";
import { FinalMessage } from "./shared/final-message";

// Chamber board components
import { TokenizationBoard } from "./chambers/tokenization/board";
import { EmbeddingsBoard } from "./chambers/embeddings/board";
import { AttentionBoard } from "./chambers/attention/board";
import { TrainingBoard } from "./chambers/training/board";
import { ContextWindowBoard } from "./chambers/context-window/board";
import { TemperatureBoard } from "./chambers/temperature/board";
import { TransformerBoard } from "./chambers/transformer/board";

export function WordVaultGame() {
  const [progress, setProgress] = useState<VaultProgress>(INITIAL_PROGRESS);
  const [showCompletion, setShowCompletion] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);

  const handleChamberComplete = (score: number) => {
    setPendingScore(score);
    setShowCompletion(true);
  };

  const handleContinue = () => {
    setProgress((prev) => {
      const updated = { ...prev };
      const chamberId = prev.currentChamber;

      // Update current chamber
      updated.chambers = {
        ...updated.chambers,
        [chamberId]: {
          ...updated.chambers[chamberId],
          status: "completed" as const,
          bestScore: Math.max(
            pendingScore,
            prev.chambers[chamberId].bestScore ?? 0
          ),
          completedAt: new Date().toISOString(),
        },
      };

      // Unlock and navigate to next chamber
      const currentIndex = CHAMBER_ORDER.indexOf(chamberId);
      if (currentIndex < CHAMBER_ORDER.length - 1) {
        const nextChamber = CHAMBER_ORDER[currentIndex + 1];
        updated.chambers = {
          ...updated.chambers,
          [nextChamber]: {
            ...updated.chambers[nextChamber],
            status: "available" as const,
          },
        };
        updated.currentChamber = nextChamber;
      } else {
        // Final chamber complete
        updated.completedAt = new Date().toISOString();
      }

      return updated;
    });

    setShowCompletion(false);
  };

  const handleNavigate = (chamberId: ChamberId) => {
    setProgress((prev) => ({ ...prev, currentChamber: chamberId }));
  };

  // Check if vault is fully complete
  if (progress.completedAt) {
    return <FinalMessage onReset={() => setProgress(INITIAL_PROGRESS)} />;
  }

  const currentChamber = progress.currentChamber;
  const chamberConfig = CHAMBERS[currentChamber];
  const currentPuzzle = PUZZLES[currentChamber][0];

  // Render the appropriate board based on current chamber
  const renderBoard = () => {
    const boardProps = {
      onComplete: handleChamberComplete,
    };

    switch (currentChamber) {
      case "tokenization":
        return (
          <TokenizationBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "tokenization" }}
            {...boardProps}
          />
        );
      case "embeddings":
        return (
          <EmbeddingsBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "embeddings" }}
            {...boardProps}
          />
        );
      case "attention":
        return (
          <AttentionBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "attention" }}
            {...boardProps}
          />
        );
      case "training":
        return (
          <TrainingBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "training" }}
            {...boardProps}
          />
        );
      case "context-window":
        return (
          <ContextWindowBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "context-window" }}
            {...boardProps}
          />
        );
      case "temperature":
        return (
          <TemperatureBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "temperature" }}
            {...boardProps}
          />
        );
      case "transformer":
        return (
          <TransformerBoard
            puzzle={currentPuzzle as typeof currentPuzzle & { chamberId: "transformer" }}
            {...boardProps}
          />
        );
    }
  };

  return (
    <>
      <ChamberShell
        chamber={chamberConfig}
        progress={progress}
        onNavigate={handleNavigate}
      >
        {renderBoard()}
      </ChamberShell>

      {showCompletion && (
        <CompletionModal
          chamber={chamberConfig}
          score={pendingScore}
          onContinue={handleContinue}
        />
      )}
    </>
  );
}
