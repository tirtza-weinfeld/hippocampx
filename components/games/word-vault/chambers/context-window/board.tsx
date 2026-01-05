"use client";

import { useState, useEffect, useRef } from "react";
import type { ContextPuzzle } from "@/lib/games/word-vault/types";

interface ContextWindowBoardProps {
  puzzle: ContextPuzzle;
  onComplete: (score: number) => void;
}

export function ContextWindowBoard({ puzzle, onComplete }: ContextWindowBoardProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => puzzle.questions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Visible text window
  const visibleStart = Math.max(0, scrollPosition - puzzle.windowSize / 2);
  const visibleEnd = Math.min(puzzle.fullText.length, scrollPosition + puzzle.windowSize / 2);
  const visibleText = puzzle.fullText.slice(visibleStart, visibleEnd);

  const isComplete = scrollPosition >= puzzle.fullText.length;

  // Auto-scroll
  useEffect(() => {
    if (submitted || isPaused || isComplete) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        if (prev >= puzzle.fullText.length) return prev;
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [puzzle.fullText.length, submitted, isPaused, isComplete]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (submitted) return;

    setSubmitted(true);

    let correctCount = 0;
    puzzle.questions.forEach((q, i) => {
      if (answers[i].toUpperCase() === q.answer.toUpperCase()) {
        correctCount++;
      }
    });

    onComplete(Math.round((correctCount / puzzle.questions.length) * 10));
  };

  const progressPercent = (scrollPosition / puzzle.fullText.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress and controls */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Reading...</span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            disabled={isComplete}
            className="px-3 py-1 rounded-lg bg-wv-surface/50 hover:bg-wv-surface transition-colors
              disabled:opacity-50"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
        <div className="h-2 rounded-full bg-wv-surface/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-wv-available transition-[width] duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Context window display */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          AI can only see this window
        </h3>
        <div
          ref={containerRef}
          className="rounded-2xl bg-wv-surface/30 p-6 min-h-28 relative overflow-hidden"
        >
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/90 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/90 to-transparent pointer-events-none z-10" />

          <p className="font-mono text-lg text-center leading-relaxed">
            {visibleText || "Starting..."}
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Window: {puzzle.windowSize} characters
        </p>
      </section>

      {/* Tip */}
      <div className="rounded-xl bg-wv-available/10 p-3 text-center text-sm">
        Remember important details — you can&apos;t scroll back!
      </div>

      {/* Questions */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Answer the question
        </h3>
        {puzzle.questions.map((q, i) => (
          <div key={i} className="space-y-2">
            <p className="font-medium">{q.question}</p>
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              className={`w-full px-4 py-3 rounded-xl bg-wv-surface/30 border
                focus:outline-none focus:ring-2 focus:ring-wv-available/50
                disabled:opacity-50 text-lg
                ${
                  submitted
                    ? answers[i].toUpperCase() === q.answer.toUpperCase()
                      ? "border-wv-completed"
                      : "border-wv-error"
                    : "border-wv-primary/20"
                }
              `}
            />
            {submitted && answers[i].toUpperCase() !== q.answer.toUpperCase() && (
              <p className="text-sm text-wv-error">
                Correct answer: {q.answer}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitted || answers.some((a) => !a)}
        className="w-full py-4 rounded-xl bg-wv-available text-white font-medium text-lg
          hover:bg-wv-available/90 active:scale-[0.98] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted ? "Submitted" : "Submit Answer"}
      </button>
    </div>
  );
}
