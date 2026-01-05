"use client";

import { useState } from "react";
import type { EmbeddingsPuzzle } from "@/lib/games/word-vault/types";

interface EmbeddingsBoardProps {
  puzzle: EmbeddingsPuzzle;
  onComplete: (score: number) => void;
}

export function EmbeddingsBoard({ puzzle, onComplete }: EmbeddingsBoardProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = puzzle.questions[questionIndex];
  const isLastQuestion = questionIndex === puzzle.questions.length - 1;

  const handleSubmit = () => {
    if (!answer || submitted) return;

    const isCorrect = answer.toUpperCase() === currentQuestion.expectedAnswer.toUpperCase();
    const newScore = score + (isCorrect ? 10 : 0);
    setScore(newScore);
    setSubmitted(true);

    if (isLastQuestion) {
      setTimeout(() => onComplete(newScore), 500);
    }
  };

  const handleNext = () => {
    setQuestionIndex((i) => i + 1);
    setAnswer("");
    setSubmitted(false);
  };

  // Grid dimensions
  const cellSize = 40;
  const padding = 40;
  const width = puzzle.gridSize.width * cellSize + padding * 2;
  const height = puzzle.gridSize.height * cellSize + padding * 2;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {questionIndex + 1} of {puzzle.questions.length}</span>
        <span className="font-mono font-bold">Score: {score}</span>
      </div>

      {/* Coordinate grid */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Word Map
        </h3>
        <div className="flex justify-center overflow-x-auto py-2">
          <svg
            width={width}
            height={height}
            className="rounded-2xl bg-wv-surface/20"
          >
            {/* Grid lines */}
            {Array.from({ length: puzzle.gridSize.width + 1 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={padding + i * cellSize}
                y1={padding}
                x2={padding + i * cellSize}
                y2={height - padding}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
            ))}
            {Array.from({ length: puzzle.gridSize.height + 1 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1={padding}
                y1={padding + i * cellSize}
                x2={width - padding}
                y2={padding + i * cellSize}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
            ))}

            {/* Axis labels */}
            {Array.from({ length: puzzle.gridSize.width + 1 }, (_, i) => (
              <text
                key={`xl-${i}`}
                x={padding + i * cellSize}
                y={height - 15}
                textAnchor="middle"
                className="text-xs fill-current opacity-40"
              >
                {i}
              </text>
            ))}
            {Array.from({ length: puzzle.gridSize.height + 1 }, (_, i) => (
              <text
                key={`yl-${i}`}
                x={15}
                y={height - padding - i * cellSize + 4}
                textAnchor="middle"
                className="text-xs fill-current opacity-40"
              >
                {i}
              </text>
            ))}

            {/* Word points */}
            {puzzle.words.map((word) => (
              <g key={word.word}>
                <circle
                  cx={padding + word.x * cellSize}
                  cy={height - padding - word.y * cellSize}
                  r={8}
                  className="fill-wv-available"
                />
                <text
                  x={padding + word.x * cellSize}
                  y={height - padding - word.y * cellSize - 14}
                  textAnchor="middle"
                  className="text-xs fill-current font-bold"
                >
                  {word.word}
                </text>
                <text
                  x={padding + word.x * cellSize}
                  y={height - padding - word.y * cellSize + 22}
                  textAnchor="middle"
                  className="text-[10px] fill-current opacity-50 font-mono"
                >
                  ({word.x},{word.y})
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* Question */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Question
        </h3>
        <div className="rounded-xl bg-wv-available/10 p-4">
          <p className="text-lg font-medium">{currentQuestion.prompt}</p>
        </div>
      </section>

      {/* Answer input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Type your answer..."
          className="flex-1 px-4 py-3 rounded-xl bg-wv-surface/30 border border-wv-primary/20
            focus:outline-none focus:ring-2 focus:ring-wv-available/50
            disabled:opacity-50 text-lg"
        />
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answer}
            className="px-8 py-3 rounded-xl bg-wv-available text-white font-medium text-lg
              hover:bg-wv-available/90 active:scale-95 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check
          </button>
        ) : !isLastQuestion ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 rounded-xl bg-wv-available text-white font-medium text-lg
              hover:bg-wv-available/90 active:scale-95 transition-all"
          >
            Next
          </button>
        ) : null}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-4 rounded-xl text-center font-medium text-lg ${
            answer.toUpperCase() === currentQuestion.expectedAnswer.toUpperCase()
              ? "bg-wv-completed/20 text-wv-completed"
              : "bg-wv-error/20 text-wv-error"
          }`}
        >
          {answer.toUpperCase() === currentQuestion.expectedAnswer.toUpperCase()
            ? "Correct!"
            : `The answer was: ${currentQuestion.expectedAnswer}`}
        </div>
      )}
    </div>
  );
}
