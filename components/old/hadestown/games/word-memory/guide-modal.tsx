"use client"

import { motion, AnimatePresence } from "motion/react"
import { XIcon, ChevronLeft, ChevronRight, Trophy, Sparkles, BookOpen, BrainIcon } from "lucide-react"

type GuideStepData = {
  title: string
  content: string
}

const GUIDE_STEPS: GuideStepData[] = [
  {
    title: "Welcome to Word Memory!",
    content: "Match words with their definitions in this fun memory game.",
  },
  {
    title: "Flip a Card",
    content: "Click on any card to flip it over and see what's underneath.",
  },
  {
    title: "Find a Match",
    content: "Flip another card to try to find its matching pair. Words match with their definitions!",
  },
  {
    title: "Remember Locations",
    content: "If the cards don't match, they'll flip back over. Try to remember where each word and definition is!",
  },
  {
    title: "Complete the Game",
    content: "Find all the matching pairs to win! Choose your difficulty level to change the challenge.",
  },
]

type MiniCardProps = {
  flipped?: boolean
  matched?: boolean
  content?: string
  isWord?: boolean
  className?: string
}

function MiniCard({ flipped = false, matched = false, content, isWord = false, className = "" }: MiniCardProps) {
  if (matched) {
    return (
      <div className={`w-9 h-12 rounded bg-game-success-light border border-game-success flex items-center justify-center ${className}`}>
        <Sparkles className="h-3 w-3 text-game-success" />
      </div>
    )
  }
  if (flipped && content) {
    return (
      <div className={`w-9 h-12 rounded bg-game-surface border-2 border-game-primary flex items-center justify-center p-0.5 ${className}`}>
        <span className={`text-[7px] text-center leading-tight ${isWord ? "text-game-primary font-bold" : "text-game-text"}`}>
          {content}
        </span>
      </div>
    )
  }
  return (
    <div className={`w-9 h-12 rounded bg-game-gradient flex items-center justify-center shadow-sm ${className}`}>
      <BookOpen className="h-4 w-4 text-white" />
    </div>
  )
}

type StepIllustrationProps = {
  step: number
  shouldReduceMotion: boolean | null
}

function StepIllustration({ step, shouldReduceMotion }: StepIllustrationProps) {
  const cycleDuration = 3.5

  if (step === 0) {
    return (
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-28 h-28 bg-game-primary/10 rounded-full blur-xl"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
            return (
              <motion.div
                key={i}
                animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              >
                <MiniCard />
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="relative flex items-center justify-center" style={{ perspective: "800px" }}>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
            if (i === 5) {
              return (
                <motion.div
                  key={i}
                  className="w-9 h-12 rounded shadow-sm"
                  animate={shouldReduceMotion ? undefined : { rotateY: [0, 0, 180, 180, 180, 0] }}
                  transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.25, 0.4, 0.75, 0.9, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 rounded bg-game-gradient flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded bg-game-surface border-2 border-game-primary flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-game-primary font-bold text-[8px]">Lyre</span>
                  </div>
                </motion.div>
              )
            }
            return <MiniCard key={i} />
          })}
        </div>
        <motion.div
          className="absolute pointer-events-none z-10"
          animate={shouldReduceMotion ? undefined : {
            x: [50, 18, 18, 18, 50],
            y: [40, 8, 8, 8, 40],
          }}
          transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.2, 0.35, 0.85, 1] }}
        >
          <svg width="18" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="white" stroke="currentColor" strokeWidth="1.5" className="text-game-text" />
          </svg>
          <motion.div
            className="absolute top-0 left-0 w-3 h-3 bg-game-primary rounded-full"
            animate={shouldReduceMotion ? undefined : { scale: [0, 0, 1.3, 0, 0], opacity: [0, 0, 0.7, 0, 0] }}
            transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.22, 0.32, 0.42, 1] }}
          />
        </motion.div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="relative flex items-center justify-center" style={{ perspective: "800px" }}>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
            if (i === 2) {
              return (
                <motion.div
                  key={i}
                  className="w-9 h-12 rounded shadow-sm"
                  animate={shouldReduceMotion ? undefined : { rotateY: [0, 0, 180, 180, 180, 180] }}
                  transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.12, 0.22, 0.7, 0.95, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 rounded bg-game-gradient flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded bg-game-surface border-2 border-game-primary flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-game-primary font-bold text-[7px]">Echo</span>
                  </div>
                </motion.div>
              )
            }
            if (i === 5) {
              return (
                <motion.div
                  key={i}
                  className="w-9 h-12 rounded shadow-sm"
                  animate={shouldReduceMotion ? undefined : { rotateY: [0, 0, 0, 180, 180, 180] }}
                  transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.3, 0.35, 0.45, 0.95, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 rounded bg-game-gradient flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded bg-game-surface border-2 border-game-primary flex items-center justify-center p-0.5" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-game-text text-[6px] text-center leading-tight">Sound reflected</span>
                  </div>
                </motion.div>
              )
            }
            return <MiniCard key={i} />
          })}
        </div>
        <motion.div
          className="absolute z-20"
          animate={shouldReduceMotion ? undefined : { scale: [0, 0, 0, 1.3, 1, 0], opacity: [0, 0, 0, 1, 1, 0] }}
          transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.45, 0.5, 0.6, 0.8, 1] }}
        >
          <Sparkles className="h-8 w-8 text-game-primary" />
        </motion.div>
        <motion.div
          className="absolute pointer-events-none z-10"
          animate={shouldReduceMotion ? undefined : {
            x: [-50, -22, -22, 18, 18, 50],
            y: [40, -18, -18, 8, 8, 40],
          }}
          transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.1, 0.18, 0.28, 0.4, 1] }}
        >
          <svg width="16" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="white" stroke="currentColor" strokeWidth="1.5" className="text-game-text" />
          </svg>
          <motion.div
            className="absolute top-0 left-0 w-3 h-3 bg-game-primary rounded-full"
            animate={shouldReduceMotion ? undefined : { scale: [0, 1.2, 0, 0, 1.2, 0], opacity: [0, 0.6, 0, 0, 0.6, 0] }}
            transition={{ duration: cycleDuration, repeat: Infinity, times: [0, 0.12, 0.2, 0.28, 0.35, 0.45] }}
          />
        </motion.div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="relative flex items-center justify-center gap-4">
        <div className="grid grid-cols-4 gap-1.5" style={{ perspective: "600px" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
            if (i === 1 || i === 6) {
              return (
                <motion.div
                  key={i}
                  className="w-9 h-12 rounded shadow-sm"
                  animate={shouldReduceMotion ? undefined : { rotateY: [180, 180, 0, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.3, 0.5, 1], delay: i === 6 ? 0.15 : 0 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 rounded bg-game-gradient flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded bg-game-surface border-2 border-game-error flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-[6px] text-game-error">X</span>
                  </div>
                </motion.div>
              )
            }
            return <MiniCard key={i} />
          })}
        </div>
        <div className="relative ml-2">
          <motion.div
            className="absolute -inset-2 rounded-full bg-game-primary/15"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <BrainIcon className="h-10 w-10 text-game-primary" />
          </motion.div>
        </div>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="relative flex items-center justify-center gap-4">
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(function(i) {
            return (
              <motion.div
                key={i}
                animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08 }}
              >
                <MiniCard matched />
              </motion.div>
            )
          })}
        </div>
        <motion.div
          className="relative ml-2"
          animate={shouldReduceMotion ? undefined : { y: [0, -4, 0], rotate: [0, 3, 0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="h-12 w-12 text-game-primary" />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={shouldReduceMotion ? undefined : { scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-game-primary" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return null
}

export type GuideModalProps = {
  isOpen: boolean
  currentStep: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  shouldReduceMotion: boolean | null
}

export function GuideModal({ isOpen, currentStep, onClose, onNext, onPrev, shouldReduceMotion }: GuideModalProps) {
  const step = GUIDE_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === GUIDE_STEPS.length - 1

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
          className="bg-game-surface rounded-2xl p-6 w-[340px] h-[400px] shadow-2xl border border-game-border flex flex-col"
          onClick={handleModalClick}
        >
          <div className="flex justify-between items-start mb-3 flex-shrink-0">
            <h2 className="text-lg font-bold text-game-primary pr-4 line-clamp-1">
              {step.title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-game-text-muted hover:text-game-text hover:game-primary-soft transition-colors flex-shrink-0"
              aria-label="Close guide"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="h-28 flex items-center justify-center flex-shrink-0 mb-3">
            <StepIllustration step={currentStep} shouldReduceMotion={shouldReduceMotion} />
          </div>

          <div className="flex-1 flex items-center justify-center px-2">
            <p className="text-game-text text-center leading-relaxed text-sm">
              {step.content}
            </p>
          </div>

          <div className="flex justify-center gap-1.5 py-3 flex-shrink-0">
            {GUIDE_STEPS.map(function(_, index) {
              const isActive = currentStep === index
              return (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "w-4 bg-game-primary"
                      : "w-1.5 bg-game-border"
                  }`}
                />
              )
            })}
          </div>

          <div className="flex justify-between items-center gap-3 flex-shrink-0">
            <button
              onClick={onPrev}
              disabled={isFirstStep}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-game-border text-sm text-game-text-muted hover:text-game-primary hover:border-game-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-5 py-2 bg-game-gradient text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              {isLastStep ? "Start Playing" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export const GUIDE_STEPS_COUNT = GUIDE_STEPS.length
