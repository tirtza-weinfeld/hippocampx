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

  const handleAnimationEnd = (cardId: string) => {
    if (errorIds.has(cardId)) {
      setErrorIds(new Set());
      setFlippedIds(new Set());
    }
  };

  return (
    <div>
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
            onAnimationEnd={() => handleAnimationEnd(card.id)}
          />
        );
      })}
    </div>
  );
}
