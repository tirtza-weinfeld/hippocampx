"""
Tic Tac Toe Player

Implementation of a two-player tic-tac-toe game using the abstract Game framework.
Provides optimal AI player using minimax algorithm with alpha-beta pruning.
"""

from game import Game

X = "X"
O = "O"
EMPTY = None

# Type aliases for clarity
Board = list[list[str | None]]
Action = tuple[int, int]
Player = str


class TicTacToe(Game[Board, Action, Player]):
    """
    Tic-tac-toe game implementation with optimal AI player.

    Game Rules:
        - 3x3 grid
        - Players alternate placing X and O
        - First to get 3 in a row (horizontal, vertical, diagonal) wins
        - Draw if board fills without winner

    Time Complexity Summary:
        - State generation: O(1)
        - Move generation: O(1) - fixed 3x3 board
        - Minimax: O(b^d) where b≈5 avg, d≈9 max
        - With alpha-beta pruning: O(b^(d/2)) average case
        - Persistent memoization across moves for performance
    """

    def __init__(self):
        """Initialize with empty memoization cache for persistent optimization."""
        self._memo: dict[tuple[str, str], int] = {}

    def initial_state(self) -> Board:
        """3x3 grid filled with EMPTY (None) values."""
        return [[EMPTY] * 3 for _ in range(3)]

    def player(self, board: Board) -> Player:
        """X if move counts are equal (X goes first), otherwise O."""
        x_count = sum(row.count(X) for row in board)
        o_count = sum(row.count(O) for row in board)
        return X if x_count == o_count else O

    def actions(self, board: Board) -> set[Action]:
        """All empty cell positions (i, j) on the 3x3 board."""
        return {(i, j) for i in range(3) for j in range(3) if board[i][j] == EMPTY}

    def result(self, board: Board, action: Action) -> Board:
        """Deep copy of board with current player's mark at action position."""
        i, j = action
        if board[i][j] != EMPTY:
            raise ValueError("Invalid action: cell already occupied")

        current_player = self.player(board)
        new_board = [row[:] for row in board]
        new_board[i][j] = current_player
        return new_board

    def winner(self, board: Board) -> Player | None:
        """Player with 3-in-a-row (horizontal, vertical, or diagonal), or None."""
        # Check rows
        for row in board:
            if row[0] == row[1] == row[2] != EMPTY:
                return row[0]

        # Check columns
        for j in range(3):
            if board[0][j] == board[1][j] == board[2][j] != EMPTY:
                return board[0][j]

        # Check diagonals
        if board[0][0] == board[1][1] == board[2][2] != EMPTY:
            return board[0][0]
        if board[0][2] == board[1][1] == board[2][0] != EMPTY:
            return board[0][2]

        return None

    def terminal(self, board: Board) -> bool:
        """True if there's a winner or board is full."""
        return self.winner(board) is not None or all(cell != EMPTY for row in board for cell in row)

    def utility(self, board: Board) -> int:
        """1 if X won, -1 if O won, 0 for draw."""
        game_winner = self.winner(board)
        return 1 if game_winner == X else (-1 if game_winner == O else 0)

    def minimax(self, board: Board) -> Action | None:
        """Optimal move using classical minimax with alpha-beta pruning."""
        if self.terminal(board):
            return None

        def dp(state: Board, curr_player: Player, alpha: float, beta: float) -> int:
            key = (str(state), curr_player)
            if key in self._memo:
                return self._memo[key]

            if self.terminal(state):
                # utility is always from X's perspective
                val = self.utility(state)
                self._memo[key] = val
                return val

            maximizing = (curr_player == X)
            next_player = O if curr_player == X else X

            if maximizing:
                value = float("-inf")
                for action in self.actions(state):
                    value = max(value, dp(self.result(state, action), next_player, alpha, beta))
                    alpha = max(alpha, value)
                    if alpha >= beta:
                        break
            else:
                value = float("inf")
                for action in self.actions(state):
                    value = min(value, dp(self.result(state, action), next_player, alpha, beta))
                    beta = min(beta, value)
                    if alpha >= beta:
                        break

            self._memo[key] = int(value)
            return self._memo[key]

        curr = self.player(board)
        next_player = O if curr == X else X

        # X wants max, O wants min — pick accordingly
        if curr == X:
            return max(
                self.actions(board),
                key=lambda action: dp(self.result(board, action), next_player, float("-inf"), float("inf")),
            )
        else:
            return min(
                self.actions(board),
                key=lambda action: dp(self.result(board, action), next_player, float("-inf"), float("inf")),
            )
    def reset_cache(self) -> None:
        """Clear the memoization cache (useful when starting a new game)."""
        self._memo.clear()
