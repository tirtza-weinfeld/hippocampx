"""
Tic-Tac-Toe Game Logic
Professional, type-safe game implementation with minimax AI.
"""

from typing import List, Optional, Tuple


class TicTacToeGame:
    """
    Professional tic-tac-toe game implementation.
    
    Features:
    - Type-safe implementation
    - Minimax AI with multiple difficulty levels
    - Clean separation of concerns
    - Comprehensive validation
    """
    
    EMPTY_BOARD: List[List[Optional[str]]] = [[None] * 3 for _ in range(3)]
    PLAYERS = ('X', 'O')
    WIN_PATTERNS = [
        # Rows
        [(0, 0), (0, 1), (0, 2)],
        [(1, 0), (1, 1), (1, 2)],
        [(2, 0), (2, 1), (2, 2)],
        # Columns  
        [(0, 0), (1, 0), (2, 0)],
        [(0, 1), (1, 1), (2, 1)],
        [(0, 2), (1, 2), (2, 2)],
        # Diagonals
        [(0, 0), (1, 1), (2, 2)],
        [(0, 2), (1, 1), (2, 0)],
    ]
    
    def __init__(self, board: Optional[List[List[Optional[str]]]] = None) -> None:
        """Initialize game with optional board state."""
        self.board = [row[:] for row in board] if board else [row[:] for row in self.EMPTY_BOARD]
        self._validate_board()
    
    def _validate_board(self) -> None:
        """Validate board state and structure."""
        if len(self.board) != 3 or any(len(row) != 3 for row in self.board):
            raise ValueError("Board must be 3x3")
        
        # Validate cell values
        for row in self.board:
            for cell in row:
                if cell is not None and cell not in self.PLAYERS:
                    raise ValueError(f"Invalid cell value: {cell}")
        
        # Validate turn logic (X and O counts should differ by at most 1)
        x_count = sum(row.count('X') for row in self.board)
        o_count = sum(row.count('O') for row in self.board)
        if abs(x_count - o_count) > 1:
            raise ValueError("Invalid board state: turn logic violated")
    
    @property
    def current_player(self) -> str:
        """Return current player based on move count."""
        x_count = sum(row.count('X') for row in self.board)
        o_count = sum(row.count('O') for row in self.board)
        return 'X' if x_count <= o_count else 'O'
    
    @property
    def winner(self) -> Optional[str]:
        """Check for game winner using win patterns."""
        for pattern in self.WIN_PATTERNS:
            cells = [self.board[row][col] for row, col in pattern]
            if cells[0] and all(cell == cells[0] for cell in cells):
                return cells[0]
        return None
    
    @property
    def is_terminal(self) -> bool:
        """Check if game has ended (winner or draw)."""
        return self.winner is not None or all(
            cell is not None for row in self.board for cell in row
        )
    
    @property
    def is_draw(self) -> bool:
        """Check if game is a draw."""
        return self.is_terminal and self.winner is None
    
    def make_move(self, row: int, col: int) -> bool:
        """
        Make a move at specified position.
        
        Args:
            row: Row index (0-2)
            col: Column index (0-2)
            
        Returns:
            True if move was successful, False otherwise
        """
        if not (0 <= row <= 2 and 0 <= col <= 2):
            return False
        
        if self.board[row][col] is not None or self.is_terminal:
            return False
        
        self.board[row][col] = self.current_player
        return True
    
    def get_available_moves(self) -> List[Tuple[int, int]]:
        """Get list of all available moves."""
        return [
            (row, col) 
            for row in range(3) 
            for col in range(3) 
            if self.board[row][col] is None
        ]
    
    def get_ai_move(self) -> Tuple[Optional[Tuple[int, int]], dict]:
        """Get optimal AI move with detailed analysis."""
        available_moves = self.get_available_moves()
        if not available_moves:
            return None, {}
        
        move, analysis = self._get_minimax_move_with_analysis()
        return move, analysis
    
    def _get_minimax_move_with_analysis(self) -> Tuple[Optional[Tuple[int, int]], dict]:
        """Get optimal move with detailed analysis for educational purposes."""
        import time
        
        start_time = time.time()
        analysis = {
            'states_evaluated': 0,
            'max_depth_reached': 0,
            'move_evaluations': {},
            'best_move_reasoning': '',
            'game_tree_size': 0,
            'algorithm': 'minimax',
            'pruning_efficiency': 0
        }
        
        available_moves = self.get_available_moves()
        best_move = None
        
        if self.current_player == 'X':
            best_score = float('-inf')
            for row, col in available_moves:
                self.board[row][col] = 'X'
                score, _ = self._minimax_with_analysis(depth=0, is_maximizing=False, analysis=analysis)
                self.board[row][col] = None
                
                analysis['move_evaluations'][f"({row},{col})"] = {
                    'score': score,
                    'evaluation': self._get_move_evaluation(score, 'X')
                }
                
                if score > best_score:
                    best_score = score
                    best_move = (row, col)
                    analysis['best_move_reasoning'] = self._get_move_reasoning(score, row, col, 'X')
        else:
            best_score = float('inf')
            for row, col in available_moves:
                self.board[row][col] = 'O'
                score, _ = self._minimax_with_analysis(depth=0, is_maximizing=True, analysis=analysis)
                self.board[row][col] = None
                
                analysis['move_evaluations'][f"({row},{col})"] = {
                    'score': score,
                    'evaluation': self._get_move_evaluation(score, 'O')
                }
                
                if score < best_score:
                    best_score = score
                    best_move = (row, col)
                    analysis['best_move_reasoning'] = self._get_move_reasoning(score, row, col, 'O')
        
        # Calculate metrics
        computation_time = (time.time() - start_time) * 1000
        analysis.update({
            'computation_time_ms': round(computation_time, 2),
            'possible_moves': len(available_moves),
            'difficulty': 'impossible',
            'best_score': best_score,
            'best_move': f"({best_move[0]},{best_move[1]})" if best_move else None,
            'total_positions': len(available_moves),
        })
        
        return best_move, analysis
    
    def _minimax_with_analysis(self, depth: int, is_maximizing: bool, analysis: dict) -> Tuple[int, dict]:
        """Minimax with analysis tracking."""
        analysis['states_evaluated'] += 1
        analysis['max_depth_reached'] = max(analysis['max_depth_reached'], depth)
        
        # Terminal states
        winner = self.winner
        if winner == 'X':
            return 10 - depth, {}
        elif winner == 'O':
            return -10 + depth, {}
        elif self.is_terminal:
            return 0, {}
        
        if is_maximizing:
            best_score = float('-inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'X'
                score, _ = self._minimax_with_analysis(depth + 1, False, analysis)
                self.board[row][col] = None
                best_score = max(score, best_score)
            return best_score, {}
        else:
            best_score = float('inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'O'
                score, _ = self._minimax_with_analysis(depth + 1, True, analysis)
                self.board[row][col] = None
                best_score = min(score, best_score)
            return best_score, {}
    
    def _get_move_evaluation(self, score: int, player: str) -> str:
        """Get human-readable evaluation of move."""
        if score > 5:
            return "Winning move" if player == 'X' else "Losing move"
        elif score < -5:
            return "Losing move" if player == 'X' else "Winning move"
        elif score > 0:
            return "Advantageous" if player == 'X' else "Disadvantageous"
        elif score < 0:
            return "Disadvantageous" if player == 'X' else "Advantageous"
        else:
            return "Neutral"
    
    def _get_move_reasoning(self, score: int, row: int, col: int, player: str) -> str:
        """Get reasoning for why this move was chosen."""
        position_names = {
            (0,0): "top-left corner", (0,1): "top center", (0,2): "top-right corner",
            (1,0): "middle left", (1,1): "center", (1,2): "middle right", 
            (2,0): "bottom-left corner", (2,1): "bottom center", (2,2): "bottom-right corner"
        }
        
        position = position_names.get((row, col), f"position ({row},{col})")
        
        if score > 5:
            return f"Playing {position} guarantees a win for {player}"
        elif score == 0:
            return f"Playing {position} leads to optimal play (draw with perfect opponent)"
        elif score > 0:
            return f"Playing {position} gives {player} a slight advantage"
        elif score < 0:
            return f"Playing {position} is defensive, preventing opponent advantage"
        else:
            return f"Playing {position} maintains balance"
    
    def _get_minimax_move(self) -> Optional[Tuple[int, int]]:
        """Get optimal move using minimax algorithm."""
        best_move = None
        
        if self.current_player == 'X':
            # X maximizes
            best_score = float('-inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'X'
                score = self._minimax(depth=0, is_maximizing=False)  # Next is O's turn
                self.board[row][col] = None
                if score > best_score:
                    best_score = score
                    best_move = (row, col)
        else:
            # O minimizes
            best_score = float('inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'O'
                score = self._minimax(depth=0, is_maximizing=True)  # Next is X's turn
                self.board[row][col] = None
                if score < best_score:
                    best_score = score
                    best_move = (row, col)
        
        return best_move
    
    def _minimax(self, depth: int, is_maximizing: bool) -> int:
        """
        Standard minimax: X=maximizing player, O=minimizing player
        Score: +10 for X win, -10 for O win, 0 for draw
        """
        # Terminal states
        winner = self.winner
        if winner == 'X':
            return 10 - depth
        elif winner == 'O':
            return -10 + depth
        elif self.is_terminal:
            return 0
        
        if is_maximizing:
            # X's turn - wants to maximize score
            best_score = float('-inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'X'
                score = self._minimax(depth + 1, False)
                self.board[row][col] = None
                best_score = max(score, best_score)
            return best_score
        else:
            # O's turn - wants to minimize score
            best_score = float('inf')
            for row, col in self.get_available_moves():
                self.board[row][col] = 'O'
                score = self._minimax(depth + 1, True)
                self.board[row][col] = None
                best_score = min(score, best_score)
            return best_score
    
    def copy(self) -> 'TicTacToeGame':
        """Create a copy of the current game state."""
        return TicTacToeGame(self.board)
    
    def __repr__(self) -> str:
        """String representation for debugging."""
        lines = []
        for row in self.board:
            line = "|".join(cell or " " for cell in row)
            lines.append(f"|{line}|")
        return "\n".join(lines)