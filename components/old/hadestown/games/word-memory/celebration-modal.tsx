"use client"

import { motion, AnimatePresence } from "motion/react"
import { Trophy, Sparkles } from "lucide-react"

export type CelebrationModalProps = {
  isOpen: boolean
  onClose: () => void
  shouldReduceMotion: boolean | null
}

export function CelebrationModal({ isOpen, onClose, shouldReduceMotion }: CelebrationModalProps) {
  function handleBackdropClick() {
    onClose()
  }

  function handleModalClick(event: React.MouseEvent) {
    event.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-game-surface rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center border border-game-border"
          onClick={handleModalClick}
        >
          <div className="relative inline-block mb-5">
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, 5, 0, -5, 0], y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="h-16 w-16 text-game-primary" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="h-5 w-5 text-game-primary" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -left-2"
              animate={shouldReduceMotion ? undefined : { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            >
              <Sparkles className="h-5 w-5 text-game-primary" />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-game-primary mb-2">
            Congratulations!
          </h2>
          <p className="text-game-text mb-6">
            You&apos;ve matched all the pairs! Your memory is impressive!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-game-gradient text-white font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            Play Again
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
