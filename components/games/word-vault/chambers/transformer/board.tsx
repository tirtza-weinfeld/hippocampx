"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { TransformerPuzzle, CompletionSlot } from "@/lib/games/word-vault/types";

interface TransformerBoardProps {
  puzzle: TransformerPuzzle;
  onComplete: (score: number) => void;
}

type Step = "attention" | "embeddings" | "temperature" | "select";

export function TransformerBoard({ puzzle, onComplete }: TransformerBoardProps) {
  const [slotIndex, setSlotIndex] = useState(0);
  const [step, setStep] = useState<Step>("attention");
  const [filledWords, setFilledWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(1.0);
  const [score, setScore] = useState(0);

  const currentSlot = puzzle.slots[slotIndex];
  const isComplete = slotIndex >= puzzle.slots.length;

  // Calculate probabilities based on temperature
  const calculateProbabilities = (slot: CompletionSlot) => {
    // Base scores: correct word gets highest, others get random lower scores
    const baseScores = slot.embeddings.map((e) => (e.isCorrect ? 10 : 3 + Math.random() * 4));
    const scaledScores = baseScores.map((s) => Math.pow(s, 1 / temperature));
    const total = scaledScores.reduce((sum, s) => sum + s, 0);
    return slot.embeddings.map((e, i) => ({
      word: e.word,
      probability: (scaledScores[i] / total) * 100,
      isCorrect: e.isCorrect,
    }));
  };

  const handleNextStep = () => {
    if (step === "attention") setStep("embeddings");
    else if (step === "embeddings") setStep("temperature");
    else if (step === "temperature") setStep("select");
  };

  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
  };

  const handleConfirmWord = () => {
    if (!selectedWord) return;

    const isCorrect = selectedWord === currentSlot.correctWord;
    const newScore = score + (isCorrect ? 10 : 0);
    setScore(newScore);

    const newFilledWords = [...filledWords, selectedWord];
    setFilledWords(newFilledWords);

    // Move to next slot or complete
    if (slotIndex < puzzle.slots.length - 1) {
      setSlotIndex(slotIndex + 1);
      setStep("attention");
      setSelectedWord(null);
      setTemperature(1.0);
    } else {
      // All done
      setTimeout(() => onComplete(newScore), 500);
    }
  };

  // Render the message with filled words and current blank
  const renderMessage = () => {
    const lines = puzzle.finalMessage.split("\n");
    let slotIdx = 0;

    return lines.map((line, lineIdx) => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let partIdx = 0;

      // Find words that were blanks
      const blankWords = puzzle.slots.map((s) => s.correctWord);

      for (const blankWord of blankWords) {
        const idx = remaining.indexOf(blankWord);
        if (idx === -1) continue;

        // Add text before the blank
        if (idx > 0) {
          parts.push(<span key={`${lineIdx}-${partIdx++}`}>{remaining.slice(0, idx)}</span>);
        }

        // Add the blank/filled word
        const thisSlotIdx = slotIdx++;
        if (thisSlotIdx < filledWords.length) {
          // Already filled
          parts.push(
            <span key={`${lineIdx}-${partIdx++}`} className="text-wv-completed font-bold">
              {filledWords[thisSlotIdx]}
            </span>
          );
        } else if (thisSlotIdx === slotIndex && !isComplete) {
          // Current blank
          parts.push(
            <span
              key={`${lineIdx}-${partIdx++}`}
              className="inline-block px-2 py-0.5 mx-1 rounded-lg
                bg-wv-available/30 border-2 border-dashed border-wv-available
                min-w-16 text-center animate-pulse"
            >
              {selectedWord || "___"}
            </span>
          );
        } else {
          // Future blank
          parts.push(
            <span
              key={`${lineIdx}-${partIdx++}`}
              className="inline-block px-2 py-0.5 mx-1 rounded-lg
                bg-wv-surface/30 border border-dashed border-wv-surface
                min-w-16 text-center text-muted-foreground"
            >
              ___
            </span>
          );
        }

        remaining = remaining.slice(idx + blankWord.length);
      }

      // Add any remaining text
      if (remaining) {
        parts.push(<span key={`${lineIdx}-${partIdx++}`}>{remaining}</span>);
      }

      return (
        <div key={lineIdx} className="text-xl sm:text-2xl">
          {parts}
        </div>
      );
    });
  };

  if (isComplete) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-wv-completed uppercase tracking-wider">Message Complete!</p>
        </div>
        <div className="rounded-3xl bg-wv-surface/20 p-8 text-center space-y-2">
          {puzzle.finalMessage.split("\n").map((line, i) => (
            <p key={i} className="text-2xl sm:text-3xl font-bold text-wv-completed">
              {line}
            </p>
          ))}
        </div>
        <div className="text-center p-6 rounded-2xl bg-wv-completed/10 border border-wv-completed/20">
          <p className="text-lg text-wv-completed font-medium">
            You used the AI you built! Attention, embeddings, temperature — all together.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Blank {slotIndex + 1} of {puzzle.slots.length}
        </span>
        <div className="flex gap-1">
          {puzzle.slots.map((_, i) => (
            <div
              key={i}
              className={`size-2 rounded-full transition-colors ${
                i < slotIndex
                  ? "bg-wv-completed"
                  : i === slotIndex
                    ? "bg-wv-available"
                    : "bg-wv-surface/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Message display */}
      <div className="rounded-2xl bg-wv-surface/10 p-6 space-y-1">{renderMessage()}</div>

      {/* Current context */}
      <div className="text-center">
        <span className="text-lg font-medium">&quot;{currentSlot.context}&quot;</span>
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2">
        {(["attention", "embeddings", "temperature", "select"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                step === s
                  ? "bg-wv-available text-white"
                  : i < ["attention", "embeddings", "temperature", "select"].indexOf(step)
                    ? "bg-wv-completed/30 text-wv-completed"
                    : "bg-wv-surface/30 text-muted-foreground"
              }`}
            >
              {s === "attention" ? "Attention" : s === "embeddings" ? "Embeddings" : s === "temperature" ? "Temperature" : "Select"}
            </div>
            {i < 3 && <span className="mx-1 text-muted-foreground">→</span>}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === "attention" && (
          <motion.div
            key="attention"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">
              Which words should the AI pay attention to?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {currentSlot.attention.map(({ word, score }) => (
                <motion.div
                  key={word}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <div
                    className="px-4 py-2 rounded-xl font-medium"
                    style={{
                      backgroundColor: `rgba(var(--wv-available-rgb), ${score / 15})`,
                      boxShadow: `0 0 ${score * 2}px rgba(var(--wv-available-rgb), ${score / 20})`,
                    }}
                  >
                    {word}
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-wv-available text-white text-xs font-bold">
                    {score}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 rounded-xl bg-wv-available text-white font-medium
                  hover:bg-wv-available/90 active:scale-95 transition-all"
              >
                Next: Embeddings →
              </button>
            </div>
          </motion.div>
        )}

        {step === "embeddings" && (
          <motion.div
            key="embeddings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">
              Words that are close together have similar meanings
            </p>
            <div className="flex justify-center">
              <div className="relative w-64 h-48 rounded-xl bg-wv-surface/20 border border-wv-surface/30">
                {currentSlot.embeddings.map((emb, i) => (
                  <motion.div
                    key={emb.word}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`absolute px-2 py-1 rounded-lg text-sm font-medium cursor-default
                      ${emb.isCorrect ? "bg-wv-available/30 text-wv-available ring-2 ring-wv-available" : "bg-wv-surface/50"}`}
                    style={{
                      left: `${(emb.x / 10) * 100}%`,
                      top: `${100 - (emb.y / 10) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {emb.word}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 rounded-xl bg-wv-available text-white font-medium
                  hover:bg-wv-available/90 active:scale-95 transition-all"
              >
                Next: Temperature →
              </button>
            </div>
          </motion.div>
        )}

        {step === "temperature" && (
          <motion.div
            key="temperature"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">
              Set temperature: low = safe choice, high = creative
            </p>
            <div className="space-y-3 px-4">
              <div className="flex justify-between text-sm">
                <span>Safe</span>
                <span className="font-mono font-bold">{temperature.toFixed(1)}</span>
                <span>Creative</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={2.0}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:size-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-foreground
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-wv-primary
                  [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>
            <div className="space-y-2">
              {calculateProbabilities(currentSlot).map(({ word, probability, isCorrect }) => (
                <div key={word} className="flex items-center gap-3">
                  <span className={`w-20 text-sm font-medium ${isCorrect ? "text-wv-available" : ""}`}>
                    {word}
                  </span>
                  <div className="flex-1 h-4 rounded-full bg-wv-surface/30 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isCorrect ? "bg-wv-available" : "bg-wv-surface"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${probability}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-sm">{probability.toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 rounded-xl bg-wv-available text-white font-medium
                  hover:bg-wv-available/90 active:scale-95 transition-all"
              >
                Next: Select Word →
              </button>
            </div>
          </motion.div>
        )}

        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground text-center">Pick a word for the blank</p>
            <div className="flex flex-wrap justify-center gap-3">
              {currentSlot.embeddings.map((emb) => (
                <button
                  key={emb.word}
                  type="button"
                  onClick={() => handleSelectWord(emb.word)}
                  className={`px-5 py-2 rounded-xl font-medium transition-all
                    ${
                      selectedWord === emb.word
                        ? "bg-wv-available text-white ring-2 ring-wv-available ring-offset-2 ring-offset-background"
                        : "bg-wv-surface/30 hover:bg-wv-surface/50"
                    }`}
                >
                  {emb.word}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleConfirmWord}
                disabled={!selectedWord}
                className="px-8 py-3 rounded-xl bg-wv-completed text-white font-semibold
                  hover:bg-wv-completed/90 active:scale-95 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm: {selectedWord || "..."}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
