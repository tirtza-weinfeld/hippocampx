"use client"

import { RotateCcw, Zap } from "lucide-react"

type GameStatsProps = {
  matchedPairs: number
  totalPairs: number
  moves: number
  streak: number
  onReset: () => void
}

export function GameStats({ matchedPairs, totalPairs, moves, streak, onReset }: GameStatsProps) {
  const progressPercent = (matchedPairs / totalPairs) * 100

  return (
    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-old-game-surface-soft">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm text-old-game-text-muted">
            Matched: <span className="font-bold text-old-game-primary">{matchedPairs}</span>/{totalPairs}
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full old-game-primary-soft text-old-game-primary text-xs font-medium">
              <Zap className="h-3 w-3" />
              {streak}x
            </span>
          )}
        </div>
        <div className="h-1.5 w-full max-w-32 bg-old-game-primary-light rounded-full overflow-hidden">
          <div
            className="h-full bg-old-game-gradient rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs text-old-game-text-muted">Moves</p>
          <p className="text-base font-bold text-old-game-primary tabular-nums">{moves}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-old-game-surface border border-old-game-border text-old-game-text-muted hover:text-old-game-primary hover:border-old-game-primary transition-colors"
          aria-label="Reset game"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  )
}
