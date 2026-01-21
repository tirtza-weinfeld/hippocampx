"use client";

import { useState } from "react";
import type { TemperaturePuzzle } from "@/lib/games/word-vault/types";

interface TemperatureBoardProps {
  puzzle: TemperaturePuzzle;
  onComplete: (score: number) => void;
}

export function TemperatureBoard({ puzzle, onComplete }: TemperatureBoardProps) {
  const [temperature, setTemperature] = useState(1.0);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Calculate probabilities based on temperature
  const probabilities = puzzle.options.map((opt) => {
    const scaledScores = puzzle.options.map((o) => o.baseScore / temperature);
    const total = scaledScores.reduce((sum, s) => sum + s, 0);
    const scaled = opt.baseScore / temperature;
    return {
      token: opt.token,
      probability: (scaled / total) * 100,
    };
  });

  const handleSubmit = () => {
    if (!selectedToken || submitted) return;

    setSubmitted(true);

    const tempMatch = Math.abs(temperature - puzzle.targetTemperature) < 0.2;
    const tokenMatch = selectedToken === puzzle.targetOutcome;
    const score = tokenMatch && tempMatch ? 10 : tokenMatch ? 5 : 0;

    onComplete(score);
  };

  return (
    <div className="space-y-6">
      {/* Context sentence */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Complete this sentence
        </h3>
        <div className="rounded-2xl bg-wv-surface/30 p-6 text-lg text-center">
          {puzzle.context}{" "}
          <span className="inline-block min-w-20 mx-1 px-3 py-1 rounded-lg bg-wv-available/20 border-2 border-dashed border-wv-available font-bold">
            {selectedToken || "?"}
          </span>
        </div>
      </section>

      {/* Temperature slider */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Set the temperature
        </h3>
        <div className="rounded-xl bg-wv-surface/20 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Cold (predictable)</span>
            <span className="font-mono font-bold text-xl">{temperature.toFixed(1)}</span>
            <span className="text-sm">Hot (random)</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={submitted}
            className="w-full h-3 rounded-full appearance-none bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:size-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-foreground
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-wv-primary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </section>

      {/* Token options with probability bars */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pick the best word
        </h3>
        <div className="space-y-2">
          {probabilities.map(({ token, probability }) => (
            <button
              key={token}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedToken(token)}
              data-state={selectedToken === token ? "selected" : "default"}
              className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                bg-wv-surface/20
                selected:bg-wv-available/20 selected:ring-2 selected:ring-wv-available
                hover:not-disabled:bg-wv-surface/40
                disabled:cursor-not-allowed"
            >
              <span className="w-20 font-bold text-left">{token}</span>
              <div className="flex-1 h-6 rounded-full bg-wv-surface/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-wv-available transition-[width] duration-300"
                  style={{ width: `${probability}%` }}
                />
              </div>
              <span className="w-16 font-mono text-right">
                {probability.toFixed(0)}%
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedToken || submitted}
        className="w-full py-4 rounded-xl bg-wv-available text-white font-medium text-lg
          hover:bg-wv-available/90 active:scale-[0.98] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted ? "Submitted" : "Confirm Choice"}
      </button>

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-4 rounded-xl text-center font-medium text-lg ${
            selectedToken === puzzle.targetOutcome
              ? "bg-wv-completed/20 text-wv-completed"
              : "bg-wv-error/20 text-wv-error"
          }`}
        >
          {selectedToken === puzzle.targetOutcome
            ? `Correct! At low temperature, ${puzzle.targetOutcome} wins.`
            : `Try ${puzzle.targetOutcome} at temperature ${puzzle.targetTemperature}`}
        </div>
      )}
    </div>
  );
}
