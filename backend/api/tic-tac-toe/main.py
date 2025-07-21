from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Tic Tac Toe API", version="1.0.0")

# Types
Player = str  # 'X' or 'O'
Cell = Optional[Player]  # Player or None
Board = List[Cell]  # List of 9 cells

# Game constants
X = 'X'
O = 'O'
EMPTY = None
WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
    [0, 4, 8], [2, 4, 6],             # Diagonals
]

# Request/Response models
class ApplyMoveRequest(BaseModel):
    board: Board
    index: int

class ApplyMoveResponse(BaseModel):
    board: Board
    success: bool
    error: Optional[str] = None

class MinimaxRequest(BaseModel):
    board: Board

class MinimaxResponse(BaseModel):
    move: Optional[int]
    success: bool
    error: Optional[str] = None

# Game logic functions
def player(board: Board) -> Player:
    """Determine whose turn it is based on the board state."""
    xs = sum(1 for cell in board if cell == X)
    os = sum(1 for cell in board if cell == O)
    return X if xs <= os else O

def actions(board: Board) -> List[int]:
    """Get all available moves (empty cells)."""
    return [i for i, cell in enumerate(board) if cell == EMPTY]

def result(board: Board, index: int) -> Board:
    """Apply a move and return the new board state."""
    if board[index] != EMPTY:
        raise ValueError("Invalid move: cell is not empty")
    
    new_board = board.copy()
    new_board[index] = player(board)
    return new_board

def winner(board: Board) -> Optional[Player]:
    """Check if there's a winner."""
    for combo in WIN_COMBOS:
        a, b, c = combo
        if board[a] and board[a] == board[b] and board[a] == board[c]:
            return board[a]
    return None

def terminal(board: Board) -> bool:
    """Check if the game is over."""
    return winner(board) is not None or all(cell != EMPTY for cell in board)

def utility(board: Board) -> int:
    """Get the utility value for a terminal state."""
    w = winner(board)
    if w == X:
        return 1
    elif w == O:
        return -1
    return 0

# Minimax algorithm with memoization
cache = {}

def minimax_value(board: Board) -> tuple[int, Optional[int]]:
    """Minimax algorithm with memoization."""
    board_key = tuple(cell or '-' for cell in board)
    
    if board_key in cache:
        return cache[board_key]
    
    if terminal(board):
        util = utility(board)
        result = (util, None)
        cache[board_key] = result
        return result
    
    current_player = player(board)
    best_val = float('-inf') if current_player == X else float('inf')
    best_move = None
    
    for action in actions(board):
        new_board = result(board, action)
        val, _ = minimax_value(new_board)
        
        if current_player == X and val > best_val:
            best_val = val
            best_move = action
        elif current_player == O and val < best_val:
            best_val = val
            best_move = action
    
    result = (best_val, best_move)
    cache[board_key] = result
    return result

def minimax(board: Board) -> Optional[int]:
    """Get the best move using minimax algorithm."""
    return minimax_value(board)[1]

# API endpoints
@app.post("/apply_move", response_model=ApplyMoveResponse)
async def apply_move(request: ApplyMoveRequest):
    """Apply a move to the board and return the updated board."""
    try:
        # Validate board
        if len(request.board) != 9:
            raise ValueError("Board must have exactly 9 cells")
        
        # Validate index
        if not 0 <= request.index < 9:
            raise ValueError("Index must be between 0 and 8")
        
        # Check if move is valid
        if request.board[request.index] != EMPTY:
            raise ValueError("Cell is not empty")
        
        # Check if game is already over
        if winner(request.board) is not None:
            raise ValueError("Game is already over")
        
        # Apply the move
        new_board = result(request.board, request.index)
        
        return ApplyMoveResponse(board=new_board, success=True)
        
    except ValueError as e:
        return ApplyMoveResponse(
            board=request.board,
            success=False,
            error=str(e)
        )

@app.post("/minimax", response_model=MinimaxResponse)
async def get_minimax_move(request: MinimaxRequest):
    """Get the best move using minimax algorithm."""
    try:
        # Validate board
        if len(request.board) != 9:
            raise ValueError("Board must have exactly 9 cells")
        
        # Check if game is over
        if terminal(request.board):
            raise ValueError("Game is already over")
        
        # Get the best move
        best_move = minimax(request.board)
        
        return MinimaxResponse(move=best_move, success=True)
        
    except ValueError as e:
        return MinimaxResponse(
            move=None,
            success=False,
            error=str(e)
        )

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Tic Tac Toe API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 