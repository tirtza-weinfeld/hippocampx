"use client";

import { useState } from "react";
import type { AttentionPuzzle } from "@/lib/games/word-vault/types";

interface AttentionBoardProps {
  puzzle: AttentionPuzzle;
  onComplete: (score: number) => void;
}

export function AttentionBoard({ puzzle, onComplete }: AttentionBoardProps) {
  const [distribution, setDistribution] = useState<number[]>(
    () => puzzle.words.map(() => 0)
  );
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalPoints = distribution.reduce((sum, p) => sum + p, 0);
  const pointsRemaining = 10 - totalPoints;

  const handleSliderChange = (index: number, value: number) => {
    if (submitted) return;

    const current = distribution[index];
    const diff = value - current;

    // Don't allow going over 10 total
    const newValue = diff > pointsRemaining ? current + pointsRemaining : value;

    const newDistribution = [...distribution];
    newDistribution[index] = newValue;
    setDistribution(newDistribution);
  };

  const handleSubmit = () => {
    if (totalPoints !== 10 || submitted || !answer) return;

    setSubmitted(true);
    const isCorrect = answer.toUpperCase() === puzzle.correctAnswer.toUpperCase();
    onComplete(isCorrect ? 10 : 0);
  };

  // Split sentence at blank
  const sentenceParts = puzzle.sentence.split("___");

  return (
    <div className="space-y-6">
      {/* Goal header */}
      <div className="text-sm text-muted-foreground text-center">
        Give 10 attention points to the most important words
      </div>

      {/* Sentence with blank */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Fill in the blank
        </h3>
        <div className="rounded-2xl bg-wv-surface/30 p-6 text-lg text-center">
          {sentenceParts[0]}
          <span className="inline-block min-w-20 mx-1 px-3 py-1 rounded-lg bg-wv-available/20 border-2 border-dashed border-wv-available font-medium">
            {answer || "?"}
          </span>
          {sentenceParts[1]}
        </div>
      </section>

      {/* Points remaining */}
      <div className="text-center">
        <span className={`text-2xl font-bold ${pointsRemaining === 0 ? "text-wv-completed" : "text-wv-available"}`}>
          {pointsRemaining}
        </span>
        <span className="text-muted-foreground ml-2">points left</span>
      </div>

      {/* Word attention sliders */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Drag to give attention
        </h3>
        <div className="space-y-4">
          {puzzle.words.map((word, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium truncate" title={word.word}>
                {word.word}
              </span>
              <input
                type="range"
                min={0}
                max={10}
                value={distribution[index]}
                onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                disabled={submitted}
                className="flex-1 h-2 rounded-full appearance-none bg-wv-surface/50 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:size-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-wv-available
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="w-8 text-center font-mono font-bold">
                {distribution[index]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Answer input */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your answer
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Type the missing word..."
            className="flex-1 px-4 py-3 rounded-xl bg-wv-surface/30 border border-wv-primary/20
              focus:outline-none focus:ring-2 focus:ring-wv-available/50
              disabled:opacity-50 text-lg"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={totalPoints !== 10 || !answer || submitted}
            className="px-8 py-3 rounded-xl bg-wv-available text-white font-medium text-lg
              hover:bg-wv-available/90 active:scale-95 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check
          </button>
        </div>
      </section>

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-4 rounded-xl text-center font-medium text-lg ${
            answer.toUpperCase() === puzzle.correctAnswer.toUpperCase()
              ? "bg-wv-completed/20 text-wv-completed"
              : "bg-wv-error/20 text-wv-error"
          }`}
        >
          {answer.toUpperCase() === puzzle.correctAnswer.toUpperCase()
            ? "Correct!"
            : `The answer was: ${puzzle.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
