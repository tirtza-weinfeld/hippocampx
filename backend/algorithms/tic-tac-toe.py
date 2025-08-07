# INF = float("inf")
# WIN = (
#     (0, 1, 2), (3, 4, 5), (6, 7, 8),    # rows
#     (0, 3, 6), (1, 4, 7), (2, 5, 8),    # columns
#     (0, 4, 8), (2, 4, 6),               # diagonals
# )

# # Manual cache for winner(): maps board states → 'X', 'O', or None
# _winner_cache: dict[tuple[str | None, ...], str | None] = {}

# def initial_state() -> tuple[str | None, ...]:
#     """Return an empty 3×3 board as a flat 9-tuple."""
#     return (None,) * 9

# def player(state: tuple[str | None, ...]) -> str:
#     """Next player: X if X has ≤ moves than O, else O."""
#     return "X" if state.count("X") <= state.count("O") else "O"

# def actions(state: tuple[str | None, ...]) -> set[int]:
#     """All empty positions (0–8) available for play."""
#     return {i for i, v in enumerate(state) if v is None}

# def result(state: tuple[str | None, ...], move: int) -> tuple[str | None, ...]:
#     """Return new state after current player plays at index move."""
#     b = list(state)
#     b[move] = player(state)
#     return tuple(b)

# def winner(state: tuple[str | None, ...]) -> str | None:
#     """
#     Check for a winner. Uses _winner_cache to avoid re-scanning the same board.
#     Stores result on first compute, returns cached on subsequent calls.
#     """
#     if state in _winner_cache:
#         return _winner_cache[state]
#     for i, j, k in WIN:
#         v = state[i]
#         if v and v == state[j] == state[k]:
#             _winner_cache[state] = v
#             return v
#     _winner_cache[state] = None
#     return None



# def terminal(state: tuple[str | None, ...]) -> bool:
#     """Game over if someone won or no empty cells remain."""
#     return winner(state) is not None or all(v is not None for v in state)

# def utility(state: tuple[str | None, ...]) -> int:
#     """Score: +1 if X wins, -1 if O wins, else 0."""
#     w = winner(state)
#     return 1 if w == "X" else -1 if w == "O" else 0

# def minimax(state: tuple[str | None, ...]) -> int | None:
#     """
#     Return the optimal move index for the current player.
#     Implements alpha-beta pruning: α tracks the best already explored option
#     for the maximizer, β for the minimizer, allowing us to cut branches
#     that cannot possibly affect the final decision.
#     """
#     if terminal(state):
#         return None
#     turn = player(state)
#     best_val = -INF if turn == "X" else INF
#     best_move: int | None = None

#     for m in actions(state):
#         # Choose minimizer or maximizer step accordingly
#         val = (_min_value if turn == "X" else _max_value)(result(state, m), -INF, INF)
#         if (turn == "X" and val > best_val) or (turn == "O" and val < best_val):
#             best_val, best_move = val, m

#     return best_move

# def _max_value(state: tuple[str | None, ...], α: float, β: float) -> float:
#     """Maximizer’s step: try to increase v, prune when α ≥ β."""
#     if terminal(state):
#         return utility(state)
#     v = -INF
#     for m in actions(state):
#         v = max(v, _min_value(result(state, m), α, β))
#         α = max(α, v)
#         if α >= β:  # prune: opponent won’t allow this branch
#             break
#     return v

# def _min_value(state: tuple[str | None, ...], α: float, β: float) -> float:
#     """Minimizer’s step: try to decrease v, prune when α ≥ β."""
#     if terminal(state):
#         return utility(state)
#     v = INF
#     for m in actions(state):
#         v = min(v, _max_value(result(state, m), α, β))
#         β = min(β, v)
#         if α >= β:  # prune: maximizer won’t allow this branch
#             break
#     return v








# state = initial_state()
# print("Initial state:", state)
# move = minimax(state)
# print("Best move for X on the empty board:", move)
# state = result(state, move)
# print("State after X plays:", state)
# move_o = minimax(state)
# print("Best move for O:", move_o)
# state = result(state, move_o)
# print("State after O plays:", state)