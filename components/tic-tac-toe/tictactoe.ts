// simple implementation of tic tac toe copy 

type Player = 'X' | 'O';
type Cell = Player | null;
export type State = Cell[];  // mutable array for easy indexing

export const X: Player = 'X';
export const O: Player = 'O';
export const EMPTY: null = null;
const WIN_COMBOS: readonly [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const initialState = (): State => Array(9).fill(EMPTY);

export const player = (state: State): Player => {
  const xs = state.filter(c => c === X).length;
  const os = state.filter(c => c === O).length;
  return xs <= os ? X : O;
};

export const actions = (state: State): number[] =>
  state
    .map((c, i) => (c === EMPTY ? i : -1))
    .filter(i => i >= 0);

export const result = (state: State, i: number): State => {
  if (state[i] !== EMPTY) throw new Error('Invalid move');
  const next = state.slice();
  next[i] = player(state);
  return next;
};

export const winner = (state: State): Player | null => {
  for (const [a, b, c] of WIN_COMBOS) {
    const v = state[a];
    if (v && v === state[b] && v === state[c]) return v;
  }
  return null;
};

export const terminal = (state: State): boolean =>
  Boolean(winner(state)) || state.every(c => c !== EMPTY);

export const utility = (state: State): number => {
  const w = winner(state);
  return w === X ? 1 : w === O ? -1 : 0;
};

// Simple memoization cache for minimax
const cache = new Map<string, [number, number | null]>();
const keyOf = (state: State) => state.map(c => c ?? '-').join('');

const minimaxValue = (state: State): [number, number | null] => {
  const key = keyOf(state);
  if (cache.has(key)) return cache.get(key)!;

  if (terminal(state)) {
    const util = utility(state);
    const res: [number, null] = [util, null];
    cache.set(key, res);
    return res;
  }

  const turn = player(state);
  let bestVal = turn === X ? -Infinity : Infinity;
  let bestAct: number | null = null;

  for (const a of actions(state)) {
    const [val] = minimaxValue(result(state, a));
    if ((turn === X && val > bestVal) || (turn === O && val < bestVal)) {
      bestVal = val;
      bestAct = a;
    }
  }

  const res: [number, number | null] = [bestVal, bestAct];
  cache.set(key, res);
  return res;
};

export const minimax = (state: State): number | null => minimaxValue(state)[1];

/**
 * Apply a move for current player, or return null if invalid or game over.
 */
export function applyMove(state: State, i: number): State | null {
  if (state[i] !== EMPTY || winner(state) !== null) {
    return null;
  }
  return result(state, i);
}
