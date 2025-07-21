"""
Tic-Tac-Toe API Routes
Professional modular API endpoints.
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from games.tic_tac_toe import TicTacToeGame

# Create router for tic-tac-toe endpoints
router = APIRouter(prefix="/tic-tac-toe", tags=["tic-tac-toe"])


# Request/Response Models
class GameStateResponse(BaseModel):
    """Standard game state response."""
    board: List[List[Optional[str]]] = Field(..., description="3x3 game board")
    current_player: str = Field(..., description="Current player ('X' or 'O')")
    winner: Optional[str] = Field(None, description="Winner if game is over")
    is_terminal: bool = Field(..., description="Whether game has ended")


class MoveRequest(BaseModel):
    """Request model for making a move."""
    board: List[List[Optional[str]]] = Field(..., description="Current board state")
    row: int = Field(..., ge=0, le=2, description="Row index (0-2)")
    col: int = Field(..., ge=0, le=2, description="Column index (0-2)")


class AIRequest(BaseModel):
    """Request model for AI move."""
    board: List[List[Optional[str]]] = Field(..., description="Current board state")


class AIResponse(GameStateResponse):
    """AI move response with analysis."""
    move: Optional[List[int]] = Field(None, description="AI move coordinates [row, col]")
    analysis: dict = Field(default_factory=dict, description="Move analysis")


# API Endpoints
@router.post("/new-game", response_model=GameStateResponse)
async def new_game():
    """Start a new tic-tac-toe game."""
    game = TicTacToeGame()
    return GameStateResponse(
        board=game.board,
        current_player=game.current_player,
        winner=game.winner,
        is_terminal=game.is_terminal
    )


@router.post("/make-move", response_model=GameStateResponse)
async def make_move(request: MoveRequest):
    """Make a human move in tic-tac-toe."""
    try:
        game = TicTacToeGame(request.board)
        
        if not game.make_move(request.row, request.col):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid move: position already occupied or game over"
            )
        
        return GameStateResponse(
            board=game.board,
            current_player=game.current_player,
            winner=game.winner,
            is_terminal=game.is_terminal
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/ai-move", response_model=AIResponse)
async def ai_move(request: AIRequest):
    """Get AI move for tic-tac-toe with analysis."""
    try:
        game = TicTacToeGame(request.board)
        
        if game.is_terminal:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Game is already over"
            )
        
        move, detailed_analysis = game.get_ai_move()
        
        if move:
            game.make_move(move[0], move[1])
            # Add remaining moves count after AI move
            detailed_analysis['remaining_moves'] = len(game.get_available_moves())
        
        analysis = detailed_analysis
        
        return AIResponse(
            board=game.board,
            current_player=game.current_player,
            winner=game.winner,
            is_terminal=game.is_terminal,
            move=[move[0], move[1]] if move else None,
            analysis=analysis
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )