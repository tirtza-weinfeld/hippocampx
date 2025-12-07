"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "motion/react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Sparkles, Check } from "lucide-react"
import type { SpellingWord } from "@/lib/data/vocabulary/types"

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
}

const smoothSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

type LetterTile = {
  id: string
  letter: string
  originalIndex: number
}

type SpellingGameProps = {
  words: SpellingWord[]
  onComplete?: () => void
}

type GameState = {
  currentIndex: number
  availableLetters: LetterTile[]
  placedLetters: (LetterTile | null)[]
  isCorrect: boolean | null
  showHint: boolean
  score: number
  completedWords: Set<number>
}

function createShuffledLetters(word: string): LetterTile[] {
  const letters = word.split("").map((letter, index) => ({
    id: `letter-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    letter,
    originalIndex: index,
  }))
  return [...letters].sort(() => Math.random() - 0.5)
}

function createInitialState(words: SpellingWord[]): GameState {
  const firstWord = words[0]
  return {
    currentIndex: 0,
    availableLetters: createShuffledLetters(firstWord.word),
    placedLetters: Array.from<null>({ length: firstWord.word.length }).fill(null),
    isCorrect: null,
    showHint: false,
    score: 0,
    completedWords: new Set(),
  }
}

export function SpellingGame({ words, onComplete }: SpellingGameProps) {
  const shouldReduceMotion = useReducedMotion()
  const [state, setState] = useState<GameState>(() => createInitialState(words))
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const currentWord = words[state.currentIndex]
  const isAnswered = state.isCorrect !== null
  const allPlaced = state.placedLetters.every((tile) => tile !== null)
  const canCheck = allPlaced && !isAnswered

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const maxSlots = useMemo(
    () => Math.max(1, ...words.map((w) => w.word.length)),
    [words]
  )

  function resetCurrentWord() {
    setState((prev) => ({
      ...prev,
      availableLetters: createShuffledLetters(currentWord.word),
      placedLetters: Array.from<null>({ length: currentWord.word.length }).fill(null),
      isCorrect: null,
      showHint: false,
    }))
  }

  function navigate(direction: 1 | -1) {
    const newIndex = (state.currentIndex + direction + words.length) % words.length
    const newWord = words[newIndex]

    setState((prev) => ({
      ...prev,
      currentIndex: newIndex,
      availableLetters: createShuffledLetters(newWord.word),
      placedLetters: Array.from<null>({ length: newWord.word.length }).fill(null),
      isCorrect: null,
      showHint: false,
    }))
  }

  function toggleHint() {
    setState((prev) => ({ ...prev, showHint: !prev.showHint }))
  }

  function handleLetterClick(tile: LetterTile) {
    if (isAnswered) return

    const firstEmptyIndex = state.placedLetters.findIndex((item) => item === null)
    if (firstEmptyIndex === -1) return

    setState((prev) => {
      const newPlaced = [...prev.placedLetters]
      newPlaced[firstEmptyIndex] = tile

      return {
        ...prev,
        availableLetters: prev.availableLetters.filter((t) => t.id !== tile.id),
        placedLetters: newPlaced,
      }
    })
  }

  function handlePlacedLetterClick(index: number) {
    if (isAnswered) return

    const tile = state.placedLetters[index]
    if (!tile) return

    setState((prev) => {
      const newPlaced = [...prev.placedLetters]
      newPlaced[index] = null

      return {
        ...prev,
        availableLetters: [...prev.availableLetters, tile],
        placedLetters: newPlaced,
      }
    })
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return
    if (isAnswered) return

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)

    // Find if dragging from available or placed
    const fromAvailable = state.availableLetters.find((t) => t.id === activeIdStr)
    const fromPlacedIndex = state.placedLetters.findIndex((t) => t?.id === activeIdStr)

    // Dropping onto a slot
    if (overIdStr.startsWith("slot-")) {
      const slotIndex = parseInt(overIdStr.replace("slot-", ""), 10)

      if (fromAvailable) {
        // Moving from available to slot
        setState((prev) => {
          const existingTile = prev.placedLetters[slotIndex]
          const newPlaced = [...prev.placedLetters]
          newPlaced[slotIndex] = fromAvailable

          const newAvailable = prev.availableLetters.filter((t) => t.id !== activeIdStr)
          if (existingTile) {
            newAvailable.push(existingTile)
          }

          return {
            ...prev,
            availableLetters: newAvailable,
            placedLetters: newPlaced,
          }
        })
      } else if (fromPlacedIndex !== -1 && fromPlacedIndex !== slotIndex) {
        // Swapping between placed slots
        setState((prev) => {
          const newPlaced = [...prev.placedLetters]
          const draggedTile = newPlaced[fromPlacedIndex]
          const targetTile = newPlaced[slotIndex]

          // Swap the tiles
          newPlaced[fromPlacedIndex] = targetTile
          newPlaced[slotIndex] = draggedTile

          return {
            ...prev,
            placedLetters: newPlaced,
          }
        })
      }
    }
    // Dropping back to available area
    else if (overIdStr === "available-area" && fromPlacedIndex !== -1) {
      const tile = state.placedLetters[fromPlacedIndex]
      if (tile) {
        setState((prev) => {
          const newPlaced = [...prev.placedLetters]
          newPlaced[fromPlacedIndex] = null

          return {
            ...prev,
            availableLetters: [...prev.availableLetters, tile],
            placedLetters: newPlaced,
          }
        })
      }
    }
  }

  function checkAnswer() {
    const currentAnswer = state.placedLetters.map((tile) => tile?.letter ?? "").join("")
    const correct = currentAnswer === currentWord.word

    setState((prev) => {
      const isNewCompletion = correct && !prev.completedWords.has(prev.currentIndex)

      const newCompletedWords = isNewCompletion
        ? new Set([...prev.completedWords, prev.currentIndex])
        : prev.completedWords

      const newScore = isNewCompletion ? prev.score + 1 : prev.score

      if (newCompletedWords.size === words.length && onComplete) {
        setTimeout(onComplete, 800)
      }

      return {
        ...prev,
        isCorrect: correct,
        score: newScore,
        completedWords: newCompletedWords,
      }
    })
  }

  const activeTile = activeId
    ? state.availableLetters.find((t) => t.id === activeId) ??
      state.placedLetters.find((t) => t?.id === activeId)
    : null

  const motionConfig = shouldReduceMotion ? { transition: { duration: 0 } } : {}

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <LayoutGroup>
        <div className="flex flex-col h-full min-h-[500px]">
          {/* Progress Header */}
          <header className="flex items-center gap-3 pb-4 mb-4 border-b border-game-border">
            <NavButton direction="prev" onClick={() => { navigate(-1) }} {...motionConfig} />

            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-game-text-muted">
                  Word {state.currentIndex + 1} of {words.length}
                </span>
                <motion.span
                  key={state.score}
                  initial={shouldReduceMotion ? false : { scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-game-primary font-semibold"
                >
                  {state.score} correct
                </motion.span>
              </div>
              <div className="h-1.5 bg-game-primary-light rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-game-gradient rounded-full"
                  initial={false}
                  animate={{ width: `${((state.currentIndex + 1) / words.length) * 100}%` }}
                  transition={smoothSpring}
                />
              </div>
            </div>

            <NavButton direction="next" onClick={() => { navigate(1) }} {...motionConfig} />
          </header>

          {/* Question Content */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentIndex}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                transition={smoothSpring}
                className="flex-1 flex flex-col"
              >
                {/* Hint Section */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <motion.button
                      onClick={toggleHint}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-game-surface-soft text-game-text-muted hover:text-game-primary transition-colors"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      {state.showHint ? "Hide hint" : "Show hint"}
                    </motion.button>

                    <motion.button
                      onClick={resetCurrentWord}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-game-surface-soft text-game-text-muted hover:text-game-primary transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {state.showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={smoothSpring}
                        className="overflow-hidden"
                      >
                        <p className="p-3 text-sm italic text-game-text-muted bg-game-surface-soft rounded-lg max-w-md mx-auto">
                          {currentWord.hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Letter Slots - Drop Targets */}
                <div
                  className="flex justify-center mb-6"
                  style={{ minHeight: `${Math.ceil(maxSlots / 8) * 64}px` }}
                >
                  <div className="flex flex-wrap justify-center gap-2">
                    {state.placedLetters.map((tile, index) => (
                      <LetterSlot
                        key={`slot-${index}`}
                        slotId={`slot-${index}`}
                        tile={tile}
                        isCorrect={state.isCorrect}
                        onClick={() => handlePlacedLetterClick(index)}
                        disabled={isAnswered}
                        shouldReduceMotion={shouldReduceMotion}
                      />
                    ))}
                  </div>
                </div>

                {/* Available Letters */}
                <AvailableLettersArea
                  letters={state.availableLetters}
                  onLetterClick={handleLetterClick}
                  disabled={isAnswered}
                  shouldReduceMotion={shouldReduceMotion}
                />

                {/* Feedback */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={smoothSpring}
                      className={`mt-4 p-4 rounded-xl text-center ${
                        state.isCorrect
                          ? "bg-game-success-light border border-game-success"
                          : "bg-game-error-light border border-game-error"
                      }`}
                    >
                      {state.isCorrect ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 text-game-success-text">
                            <Sparkles className="h-5 w-5" />
                            <span className="font-semibold">Correct! Great job!</span>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          {currentWord.funFact && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-game-success-text mt-2"
                            >
                              <span className="font-semibold">Fun Fact:</span> {currentWord.funFact}
                            </motion.p>
                          )}
                        </div>
                      ) : (
                        <div className="text-game-error-text">
                          <p className="font-semibold">Not quite right. Try again!</p>
                          <p className="text-sm mt-1">
                            Drag letters back and try a different order.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="mt-6">
                  <ActionButton
                    isAnswered={isAnswered}
                    isCorrect={state.isCorrect}
                    canCheck={canCheck}
                    isLastItem={state.currentIndex === words.length - 1}
                    onCheck={checkAnswer}
                    onNext={() => navigate(1)}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeTile ? (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.15, rotate: 3 }}
            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg font-bold text-xl bg-game-gradient text-white shadow-2xl cursor-grabbing ring-2 ring-white/50"
          >
            {activeTile.letter}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

type NavButtonProps = {
  direction: "prev" | "next"
  onClick: () => void
  transition?: { duration: number }
}

function NavButton({ direction, onClick, transition }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight

  return (
    <motion.button
      onClick={onClick}
      whileHover={transition?.duration === 0 ? undefined : { scale: 1.1 }}
      whileTap={transition?.duration === 0 ? undefined : { scale: 0.95 }}
      transition={spring}
      className="p-2.5 rounded-full bg-game-surface border border-game-border text-game-text-muted hover:text-game-primary hover:border-game-primary hover:bg-game-surface-soft transition-colors"
      aria-label={direction === "prev" ? "Previous word" : "Next word"}
    >
      <Icon className="h-5 w-5" />
    </motion.button>
  )
}

type LetterSlotProps = {
  slotId: string
  tile: LetterTile | null
  isCorrect: boolean | null
  onClick: () => void
  disabled: boolean
  shouldReduceMotion: boolean | null
}

function LetterSlot({ slotId, tile, isCorrect, onClick, disabled, shouldReduceMotion }: LetterSlotProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: slotId,
    disabled,
  })

  const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
    id: tile?.id ?? `empty-${slotId}`,
    disabled: disabled || !tile,
  })

  function getVariant(): "empty" | "filled" | "correct" | "incorrect" {
    if (!tile) return "empty"
    if (isCorrect === true) return "correct"
    if (isCorrect === false) return "incorrect"
    return "filled"
  }

  const variant = getVariant()

  const styles = {
    empty: "border-dashed border-game-border bg-game-surface-soft",
    filled:
      "bg-game-selected border-game-primary text-game-selected-text cursor-grab shadow-md",
    correct:
      "bg-game-success-light border-game-success text-game-success-text shadow-md",
    incorrect:
      "bg-game-error-light border-game-error text-game-error-text shadow-md",
  }

  return (
    <motion.div
      ref={(node) => {
        setDroppableRef(node)
        setDraggableRef(node)
      }}
      onClick={onClick}
      whileTap={shouldReduceMotion || disabled || !tile ? undefined : { scale: 0.95 }}
      className={`
        w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 font-bold text-xl transition-all duration-200
        ${styles[variant]}
        ${isOver ? "ring-2 ring-game-primary ring-offset-2 scale-105" : ""}
        ${isDragging ? "opacity-50" : ""}
        ${tile && !disabled ? "active:cursor-grabbing" : ""}
      `}
      {...(tile && !disabled ? { ...attributes, ...listeners } : {})}
    >
      <AnimatePresence mode="wait">
        {tile && !isDragging && (
          <motion.span
            key={tile.id}
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.8, opacity: 0 }}
            transition={spring}
            className="flex items-center justify-center"
          >
            {isCorrect === true ? <Check className="h-5 w-5" /> : tile.letter}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

type AvailableLettersAreaProps = {
  letters: LetterTile[]
  onLetterClick: (tile: LetterTile) => void
  disabled: boolean
  shouldReduceMotion: boolean | null
}

function AvailableLettersArea({ letters, onLetterClick, disabled, shouldReduceMotion }: AvailableLettersAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "available-area",
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl bg-game-surface border border-game-border transition-all ${
        isOver ? "ring-2 ring-game-primary bg-game-surface-soft" : ""
      }`}
    >
      <p className="text-xs font-medium text-game-text-muted mb-3 text-center">
        Drag letters to spell the word
      </p>
      <div className="flex flex-wrap justify-center gap-2 min-h-[56px]">
        <AnimatePresence mode="popLayout">
          {letters.map((tile, index) => (
            <DraggableLetter
              key={tile.id}
              tile={tile}
              index={index}
              onClick={() => onLetterClick(tile)}
              disabled={disabled}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </AnimatePresence>
        {letters.length === 0 && !disabled && (
          <p className="text-sm text-game-text-muted italic py-3">
            All letters placed!
          </p>
        )}
      </div>
    </div>
  )
}

type DraggableLetterProps = {
  tile: LetterTile
  index: number
  onClick: () => void
  disabled: boolean
  shouldReduceMotion: boolean | null
}

function DraggableLetter({ tile, index, onClick, disabled, shouldReduceMotion }: DraggableLetterProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  return (
    <motion.button
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
      transition={{ ...smoothSpring, delay: shouldReduceMotion ? 0 : index * 0.03 }}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.1, y: -2 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.95 }}
      className={`
        w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg font-bold text-xl
        bg-game-gradient text-white shadow-md cursor-grab active:cursor-grabbing touch-manipulation
        ${isDragging ? "opacity-50" : ""}
      `}
      {...attributes}
      {...listeners}
    >
      {tile.letter}
    </motion.button>
  )
}

type ActionButtonProps = {
  isAnswered: boolean
  isCorrect: boolean | null
  canCheck: boolean
  isLastItem: boolean
  onCheck: () => void
  onNext: () => void
  shouldReduceMotion: boolean | null
}

function ActionButton({
  isAnswered,
  isCorrect,
  canCheck,
  isLastItem,
  onCheck,
  onNext,
  shouldReduceMotion,
}: ActionButtonProps) {
  return (
    <AnimatePresence mode="wait">
      {!isAnswered ? (
        <motion.button
          key="check"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: canCheck ? 1 : 0.4 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
          transition={smoothSpring}
          onClick={onCheck}
          disabled={!canCheck}
          className="w-full py-4 text-base font-semibold rounded-2xl bg-game-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:cursor-not-allowed"
        >
          Check Spelling
        </motion.button>
      ) : (
        <motion.button
          key="next"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={spring}
          onClick={onNext}
          className={`w-full py-4 text-base font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
            isCorrect
              ? "bg-gradient-to-r from-game-success to-emerald-600"
              : "bg-game-gradient"
          }`}
        >
          {isCorrect && <Sparkles className="h-5 w-5" />}
          <span>{isLastItem ? "Finish Game" : "Next Word"}</span>
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
