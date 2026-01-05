"use client";

import { useState } from "react";
import type { TrainingPuzzle } from "@/lib/games/word-vault/types";

interface TrainingBoardProps {
  puzzle: TrainingPuzzle;
  onComplete: (score: number) => void;
}

export function TrainingBoard({ puzzle, onComplete }: TrainingBoardProps) {
  const [weights, setWeights] = useState<number[]>([...puzzle.initialWeights]);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentExample = puzzle.trainingExamples[exampleIndex];
  const isLastExample = exampleIndex === puzzle.trainingExamples.length - 1;

  // Calculate output for current example
  const output = currentExample.words.reduce((sum, word) => {
    const idx = puzzle.wordList.indexOf(word);
    return sum + (idx !== -1 ? weights[idx] : 0);
  }, 0);

  const error = currentExample.targetScore - output;

  const handleWeightChange = (index: number, value: number) => {
    if (submitted) return;
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleTrain = () => {
    if (submitted) return;

    // Apply gradient descent - adjust weights in direction of error
    const newWeights = [...weights];
    currentExample.words.forEach((word) => {
      const idx = puzzle.wordList.indexOf(word);
      if (idx !== -1) {
        newWeights[idx] += puzzle.learningRate * Math.sign(error);
      }
    });
    setWeights(newWeights);

    if (isLastExample) {
      setSubmitted(true);
      // Score based on how close to target weights
      const totalDiff = puzzle.targetWeights.reduce((sum, target, i) => {
        return sum + Math.abs(target - newWeights[i]);
      }, 0);
      onComplete(Math.max(0, 10 - Math.round(totalDiff)));
    } else {
      setExampleIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Example {exampleIndex + 1} of {puzzle.trainingExamples.length}</span>
        <span>Learning rate: {puzzle.learningRate}</span>
      </div>

      {/* Training sentence */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Training example
        </h3>
        <div className="rounded-2xl bg-wv-surface/30 p-5 text-center space-y-3">
          <p className="text-lg">{currentExample.sentence}</p>
          <div className="flex justify-center gap-6 text-sm">
            <span>
              Output: <span className="font-mono font-bold text-lg">{output.toFixed(1)}</span>
            </span>
            <span>
              Target: <span className="font-mono font-bold text-lg">{currentExample.targetScore}</span>
            </span>
            <span className={Math.abs(error) < 0.5 ? "text-wv-completed" : "text-wv-error"}>
              Error: <span className="font-mono font-bold text-lg">{error.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Weight sliders */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Adjust weights to reduce error
        </h3>
        <div className="space-y-4">
          {puzzle.wordList.map((word, index) => {
            const isActive = currentExample.words.includes(word);
            return (
              <div key={word} className="flex items-center gap-4">
                <span
                  className={`w-20 text-sm font-medium ${
                    isActive ? "text-wv-available font-bold" : "text-muted-foreground"
                  }`}
                >
                  {word}
                </span>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={weights[index]}
                  onChange={(e) => handleWeightChange(index, parseFloat(e.target.value))}
                  disabled={submitted}
                  className={`flex-1 h-2 rounded-full appearance-none cursor-pointer
                    ${isActive ? "bg-wv-available/30" : "bg-wv-surface/30"}
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:size-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-wv-available
                    [&::-webkit-slider-thumb]:cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <span
                  className={`w-14 text-center font-mono font-bold ${
                    weights[index] >= 0 ? "text-wv-completed" : "text-wv-error"
                  }`}
                >
                  {weights[index] >= 0 ? "+" : ""}
                  {weights[index].toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Train button */}
      <button
        type="button"
        onClick={handleTrain}
        disabled={submitted}
        className="w-full py-4 rounded-xl bg-wv-available text-white font-medium text-lg
          hover:bg-wv-available/90 active:scale-[0.98] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted ? "Training Complete" : isLastExample ? "Finish Training" : "Train & Next Example"}
      </button>

      {/* Final weights */}
      {submitted && (
        <section className="rounded-xl bg-wv-completed/10 p-4">
          <p className="text-sm text-muted-foreground mb-3">Final weights:</p>
          <div className="flex flex-wrap gap-4">
            {puzzle.wordList.map((word, i) => (
              <div key={word} className="text-center">
                <span className="text-xs text-muted-foreground">{word}</span>
                <div className="font-mono font-bold text-lg">{weights[i].toFixed(1)}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
