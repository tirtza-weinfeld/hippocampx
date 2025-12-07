"use client"

import type { Difficulty } from "./types"
import { getDifficultyConfig, DIFFICULTIES } from "./utils"

type DifficultyButtonProps = {
  difficulty: Difficulty
  isActive: boolean
  onClick: () => void
}

function DifficultyButton({ difficulty, isActive, onClick }: DifficultyButtonProps) {
  const config = getDifficultyConfig(difficulty)

  function getButtonClasses(): string {
    const baseClasses = "px-3 sm:px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 capitalize"

    if (isActive) {
      return `${baseClasses} bg-game-gradient text-white shadow-md`
    }
    return `${baseClasses} bg-game-surface border border-game-border text-game-text-muted hover:border-game-primary hover:text-game-primary`
  }

  return (
    <button
      onClick={onClick}
      className={getButtonClasses()}
    >
      {difficulty}
      <span className="text-xs opacity-70 ml-1">({config.label})</span>
    </button>
  )
}

type DifficultySelectorProps = {
  currentDifficulty: Difficulty
  onChangeDifficulty: (difficulty: Difficulty) => void
}

export function DifficultySelector({ currentDifficulty, onChangeDifficulty }: DifficultySelectorProps) {
  return (
    <div className="flex justify-center gap-2">
      {DIFFICULTIES.map(function(diff) {
        return (
          <DifficultyButton
            key={diff}
            difficulty={diff}
            isActive={currentDifficulty === diff}
            onClick={function() { onChangeDifficulty(diff) }}
          />
        )
      })}
    </div>
  )
}
