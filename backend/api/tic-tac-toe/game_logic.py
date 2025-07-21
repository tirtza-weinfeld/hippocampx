"""
Pure game logic for Tic-Tac-Toe with minimax AI.
Educational implementation for CS50 AI concepts.
"""

from functools import cache
from typing import Optional, Tuple, List, Set

# Game constants
X, O = "X", "O"
EMPTY = None

# Type definitions
Player = str  # 'X' or 'O'  
Cell = Optional[Player]  # Player or None
Board = List[List[Cell]]  # 3x3 board
FlatBoard = Tuple[Cell, ...]  # 1D immutable board for caching


class TicTacToeGame:
    """Pure game logic without any I/O dependencies."""
    
    @staticmethod
    def initial_state() -> Board:
        """Returns starting state of the board."""
        return [[EMPTY] * 3 for _ in range(3)]
    
    @staticmethod
    def player(board: Board) -> Player:
        """Returns player who has the next turn on a board."""
        xs = sum(row.count(X) for row in board)
        os = sum(row.count(O) for row in board)
        return X if xs <= os else O
    
    @staticmethod
    def actions(board: Board) -> Set[Tuple[int, int]]:
        """Returns set of all possible actions (i, j) available on the board."""
        return {
            (i, j)
            for i, row in enumerate(board)
            for j, cell in enumerate(row)
            if cell is EMPTY
        }
    
    @staticmethod
    def result(board: Board, action: Tuple[int, int]) -> Board:
        """Returns the board that results from making move (i, j) on the board."""
        i, j = action
        if board[i][j] is not EMPTY:
            raise ValueError("Invalid action: cell is not empty")
        
        # Create deep copy
        new_board = [row[:] for row in board]
        new_board[i][j] = TicTacToeGame.player(board)
        return new_board
    
    @staticmethod
    def winner(board: Board) -> Optional[Player]:
        """Returns the winner of the game, if there is one."""
        # Check rows, columns, and diagonals
        lines = (
            board[:]  # rows
            + [[board[r][c] for r in range(3)] for c in range(3)]  # columns
            + [
                [board[i][i] for i in range(3)],  # main diagonal
                [board[i][2 - i] for i in range(3)],  # anti-diagonal
            ]
        )
        
        for line in lines:
            if line[0] is not EMPTY and line.count(line[0]) == 3:
                return line[0]
        return None
    
    @staticmethod
    def terminal(board: Board) -> bool:
        """Returns True if game is over, False otherwise."""
        return (TicTacToeGame.winner(board) is not None or 
                all(cell is not EMPTY for row in board for cell in row))
    
    @staticmethod
    def utility(board: Board) -> int:
        """Returns 1 if X has won, -1 if O has won, 0 otherwise."""
        win = TicTacToeGame.winner(board)
        return 1 if win == X else -1 if win == O else 0


class TicTacToeAI:
    """AI implementation with minimax and alpha-beta pruning."""
    
    @staticmethod
    def minimax(board: Board) -> Optional[Tuple[int, int]]:
        """
        Returns the optimal action for the current player using minimax with alpha-beta pruning.
        This is the educational version showing the algorithm structure clearly.
        """
        if TicTacToeGame.terminal(board):
            return None
        
        def max_value(b: Board, alpha: float, beta: float) -> Tuple[int, Optional[Tuple[int, int]]]:
            """Maximizing player (X) logic."""
            if TicTacToeGame.terminal(b):
                return TicTacToeGame.utility(b), None
                
            v, best_action = float("-inf"), None
            
            for action in TicTacToeGame.actions(b):
                min_val, _ = min_value(TicTacToeGame.result(b, action), alpha, beta)
                if min_val > v:
                    v, best_action = min_val, action
                    alpha = max(alpha, v)
                if alpha >= beta:
                    break  # Alpha-beta pruning
                    
            return v, best_action
        
        def min_value(b: Board, alpha: float, beta: float) -> Tuple[int, Optional[Tuple[int, int]]]:
            """Minimizing player (O) logic."""
            if TicTacToeGame.terminal(b):
                return TicTacToeGame.utility(b), None
                
            v, best_action = float("inf"), None
            
            for action in TicTacToeGame.actions(b):
                max_val, _ = max_value(TicTacToeGame.result(b, action), alpha, beta)
                if max_val < v:
                    v, best_action = max_val, action
                    beta = min(beta, v)
                if alpha >= beta:
                    break  # Alpha-beta pruning
                    
            return v, best_action
        
        # Determine starting function based on current player
        current_player = TicTacToeGame.player(board)
        if current_player == X:
            _, move = max_value(board, float("-inf"), float("inf"))
        else:
            _, move = min_value(board, float("-inf"), float("inf"))
            
        return move


class OptimizedTicTacToeAI:
    """
    Optimized AI implementation with flat board representation and caching.
    Better performance for educational demonstrations.
    """
    
    WIN_COMBOS: Tuple[Tuple[int, int, int], ...] = (
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # rows
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # columns
        (0, 4, 8), (2, 4, 6),             # diagonals
    )
    
    @staticmethod
    def board_to_flat(board: Board) -> FlatBoard:
        """Convert 2D board to flat tuple for caching."""
        return tuple(cell for row in board for cell in row)
    
    @staticmethod
    def flat_to_board(flat: FlatBoard) -> Board:
        """Convert flat tuple back to 2D board."""
        return [[flat[i*3 + j] for j in range(3)] for i in range(3)]
    
    @staticmethod
    @cache
    def _cached_minimax_value(state: FlatBoard) -> int:
        """Cached minimax value computation for flat board state."""
        # Check terminal state
        if OptimizedTicTacToeAI._is_terminal(state):
            return OptimizedTicTacToeAI._utility(state)
        
        # Determine current player
        current_player = X if state.count(X) <= state.count(O) else O
        
        # Get all possible moves
        actions = [i for i, cell in enumerate(state) if cell is EMPTY]
        
        # Calculate minimax values
        values = []
        for action in actions:
            new_state = state[:action] + (current_player,) + state[action+1:]
            values.append(OptimizedTicTacToeAI._cached_minimax_value(new_state))
        
        return max(values) if current_player == X else min(values)
    
    @staticmethod
    @cache
    def _is_terminal(state: FlatBoard) -> bool:
        """Check if flat state is terminal."""
        return (OptimizedTicTacToeAI._winner(state) is not None or 
                EMPTY not in state)
    
    @staticmethod
    @cache
    def _winner(state: FlatBoard) -> Optional[Player]:
        """Check winner for flat state."""
        for a, b, c in OptimizedTicTacToeAI.WIN_COMBOS:
            if state[a] is not EMPTY and state[a] == state[b] == state[c]:
                return state[a]
        return None
    
    @staticmethod
    @cache
    def _utility(state: FlatBoard) -> int:
        """Utility value for flat state."""
        winner = OptimizedTicTacToeAI._winner(state)
        return 1 if winner == X else -1 if winner == O else 0
    
    @staticmethod
    def minimax(board: Board) -> Optional[Tuple[int, int]]:
        """Optimized minimax with caching."""
        if TicTacToeGame.terminal(board):
            return None
        
        flat_state = OptimizedTicTacToeAI.board_to_flat(board)
        current_player = TicTacToeGame.player(board)
        
        best_val = float('-inf') if current_player == X else float('inf')
        best_action = None
        
        for i, j in TicTacToeGame.actions(board):
            # Convert to flat index
            flat_index = i * 3 + j
            new_state = flat_state[:flat_index] + (current_player,) + flat_state[flat_index+1:]
            
            value = OptimizedTicTacToeAI._cached_minimax_value(new_state)
            
            if ((current_player == X and value > best_val) or 
                (current_player == O and value < best_val)):
                best_val = value
                best_action = (i, j)
        
        return best_action


# Convenience functions for easy access
def create_game() -> Board:
    """Create a new game."""
    return TicTacToeGame.initial_state()

def get_ai_move(board: Board, use_optimized: bool = True) -> Optional[Tuple[int, int]]:
    """Get AI move using specified algorithm."""
    if use_optimized:
        return OptimizedTicTacToeAI.minimax(board)
    else:
        return TicTacToeAI.minimax(board)

def make_move(board: Board, row: int, col: int) -> Board:
    """Make a move and return new board state."""
    return TicTacToeGame.result(board, (row, col))

def is_game_over(board: Board) -> bool:
    """Check if game is finished."""
    return TicTacToeGame.terminal(board)

def get_winner(board: Board) -> Optional[Player]:
    """Get game winner."""
    return TicTacToeGame.winner(board)