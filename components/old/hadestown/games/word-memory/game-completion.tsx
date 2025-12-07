"use client"

import { Sparkles, Trophy } from "lucide-react"

type GameCompletionProps = {
  moves: number
  onPlayAgain: () => void
}

export function GameCompletion({ moves, onPlayAgain }: GameCompletionProps) {
  return (
    <div className="text-center p-5 sm:p-6 rounded-xl bg-game-success-light border-2 border-game-success">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-game-success" />
      </div>
      <div className="flex items-center justify-center gap-2 text-game-success-text mb-2">
        <Sparkles className="h-4 w-4" />
        <span className="text-lg sm:text-xl font-bold">All pairs matched!</span>
        <Sparkles className="h-4 w-4" />
      </div>
      <p className="text-sm sm:text-base text-game-success-text mb-4">
        Completed in <span className="font-bold tabular-nums">{moves}</span> moves
      </p>
      <button
        onClick={onPlayAgain}
        className="px-5 py-2 bg-game-success text-white font-medium rounded-full hover:opacity-90 transition-opacity"
      >
        Play Again
      </button>
    </div>
  )
}
