'use client'
import React, { useState, useCallback } from 'react';
import { initialState, State, X, O, EMPTY, terminal, winner, minimax, applyMove } from './tictactoe';


export default function Runner() {
  const [state, setState] = useState<State>(initialState());

  const handleClick = useCallback((i: number) => {

    const next = applyMove(state, i);
    if (!next) return;
    setState(next);

    const aiMove = minimax(next);
    if (aiMove !== null) {
      const next2 = applyMove(next, aiMove)!;
      setTimeout(() => setState(next2), 100);
    }
  }, [state]);

  // Game status
  const gameOver = terminal(state);
  const winnerPlayer = winner(state);

  return (
    <>
      {gameOver && (
        <div className="mb-2 text-center font-bold">
          {winnerPlayer ? `${winnerPlayer} wins!` : 'Draw!'}
        </div>
      )}
      <div className="grid grid-cols-3 gap-1 w-48">
        {state.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="h-16 text-2xl border border-gray-300 rounded-md"
          >
            {cell}
          </button>
        ))}
      </div>
    </>
  );
};
