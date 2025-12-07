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
    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-game-surface-soft">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm text-game-text-muted">
            Matched: <span className="font-bold text-game-primary">{matchedPairs}</span>/{totalPairs}
          </span>
          {streak > 1 && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full game-primary-soft text-game-primary text-xs font-medium">
              <Zap className="h-3 w-3" />
              {streak}x
            </span>
          )}
        </div>
        <div className="h-1.5 w-full max-w-32 bg-game-primary-light rounded-full overflow-hidden">
          <div
            className="h-full bg-game-gradient rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs text-game-text-muted">Moves</p>
          <p className="text-base font-bold text-game-primary tabular-nums">{moves}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary transition-colors"
          aria-label="Reset game"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  )
}
