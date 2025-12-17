"use client"

import { motion } from "motion/react"
import { Sparkles, BookOpen } from "lucide-react"
import type { CardType } from "./types"

type MemoryCardProps = {
  card: CardType
  isDisabled: boolean
  shouldReduceMotion: boolean | null
  onClick: () => void
}

function getContentClasses(card: CardType): string {
  if (card.matched) {
    return "text-old-game-success-text font-semibold text-xs sm:text-sm"
  }
  if (card.type === "word") {
    return "text-old-game-primary font-bold text-xs sm:text-sm"
  }
  return "text-old-game-text text-xs sm:text-sm leading-snug"
}

function getFrontClasses(card: CardType): string {
  if (card.matched) {
    return "bg-old-game-success-light border border-old-game-success"
  }
  return "bg-old-game-surface border border-old-game-primary shadow-sm"
}

export function MemoryCard({ card, isDisabled, shouldReduceMotion, onClick }: MemoryCardProps) {
  const isRevealed = card.flipped || card.matched

  return (
    <div className="aspect-square [perspective:600px]">
      <motion.button
        onClick={onClick}
        disabled={isDisabled}
        whileHover={shouldReduceMotion || isRevealed || isDisabled ? undefined : { scale: 1.02 }}
        whileTap={shouldReduceMotion || isRevealed || isDisabled ? undefined : { scale: 0.98 }}
        className="relative w-full h-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-old-game-primary focus-visible:ring-offset-1 [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        aria-label={isRevealed ? card.content : "Hidden card"}
      >
        {/* Back of card (hidden content) */}
        <div className="absolute inset-0 rounded-lg p-1.5 sm:p-2 flex items-center justify-center bg-old-game-gradient border border-transparent shadow-sm [backface-visibility:hidden]">
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white/90" />
        </div>

        {/* Front of card (revealed content) */}
        <div className={`absolute inset-0 rounded-lg p-1 sm:p-1.5 flex flex-col items-center justify-center ${getFrontClasses(card)} [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
          {card.matched && (
            <Sparkles className="h-3 w-3 text-old-game-success flex-shrink-0" />
          )}
          <div className="w-full max-h-full overflow-y-auto overflow-x-hidden text-center scrollbar-thin">
            <span className={getContentClasses(card)}>
              {card.content}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  )
}
