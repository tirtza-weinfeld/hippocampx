"use client";

import { useState } from "react";
import type { Card } from "./game";
import { MemoryCard } from "./card";

export function MemoryBoard({
  cards,
  pairCount,
  onComplete,
}: {
  cards: Card[];
  pairCount: number;
  onComplete: (matchedCount: number) => void;
}) {
  const [flippedIds, setFlippedIds] = useState<Set<string>>(() => new Set());
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(
    () => new Set()
  );
  const [errorIds, setErrorIds] = useState<Set<string>>(() => new Set());

  const handleCardClick = (card: Card) => {
    if (matchedPairIds.has(card.pairId)) return;

    // Clear error state on next click and start fresh with new card
    if (errorIds.size > 0) {
      setErrorIds(new Set());
      setFlippedIds(new Set([card.id]));
      return;
    }

    if (flippedIds.has(card.id)) return;
    if (flippedIds.size >= 2) return;

    const newFlipped = new Set(flippedIds).add(card.id);
    setFlippedIds(newFlipped);

    if (newFlipped.size === 2) {
      const flippedCards = cards.filter((c) => newFlipped.has(c.id));
      if (flippedCards.length !== 2) return;

      const [firstCard, secondCard] = flippedCards;

      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairIds((prev) => new Set(prev).add(firstCard.pairId));
        setFlippedIds(new Set());

        if (matchedPairIds.size + 1 === pairCount) {
          onComplete(pairCount);
        }
      } else {
        setErrorIds(new Set([firstCard.id, secondCard.id]));
      }
    }
  };

  const progress = (matchedPairIds.size / pairCount) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gradient-mm-back/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-mm-success glow-mm-success/30
            transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {cards.map((card) => {
          const isFlipped = flippedIds.has(card.id);
          const isMatched = matchedPairIds.has(card.pairId);
          const isError = errorIds.has(card.id);

          return (
            <MemoryCard
              key={card.id}
              card={card}
              isFlipped={isFlipped || isMatched}
              isMatched={isMatched}
              isError={isError}
              onClick={() => handleCardClick(card)}
            />
          );
        })}
      </div>

      {/* Match counter */}
      <p className="text-center text-sm text-muted-foreground">
        <span className="font-bold text-gradient-mm-text">{matchedPairIds.size}</span>
        <span className="mx-1">/</span>
        <span>{pairCount} matched</span>
      </p>
    </div>
  );
}
