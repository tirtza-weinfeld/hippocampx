"""
API models for Tic-Tac-Toe backend.
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Tuple, Literal, Dict, Any
from enum import Enum

# Type definitions
Player = Literal["X", "O"]
Cell = Optional[Player]
Board = List[List[Cell]]
FlatBoard = List[Cell]  # For API serialization


class Difficulty(str, Enum):
    """AI difficulty levels."""
    EASY = "easy"      # Random moves with some strategy
    MEDIUM = "medium"  # Minimax with limited depth
    HARD = "hard"      # Full minimax with alpha-beta pruning
    IMPOSSIBLE = "impossible"  # Optimized minimax with caching


class GameState(BaseModel):
    """Current game state."""
    board: Board = Field(..., description="3x3 board representation")
    current_player: Player = Field(..., description="Current player's turn")
    winner: Optional[Player] = Field(None, description="Winner if game is over")
    is_terminal: bool = Field(..., description="Whether game is finished")
    score: Dict[str, int] = Field(default_factory=lambda: {"X": 0, "O": 0, "draw": 0})
    
    @field_validator('board')
    @classmethod
    def validate_board(cls, v):
        if len(v) != 3 or any(len(row) != 3 for row in v):
            raise ValueError('Board must be 3x3')
        return v


class MoveRequest(BaseModel):
    """Request to make a move."""
    board: Board = Field(..., description="Current board state")
    row: int = Field(..., ge=0, le=2, description="Row index (0-2)")
    col: int = Field(..., ge=0, le=2, description="Column index (0-2)")
    
    @field_validator('board')
    @classmethod
    def validate_board(cls, v):
        if len(v) != 3 or any(len(row) != 3 for row in v):
            raise ValueError('Board must be 3x3')
        return v


class MoveResponse(BaseModel):
    """Response after making a move."""
    game_state: GameState = Field(..., description="Updated game state")
    move_valid: bool = Field(..., description="Whether the move was valid")
    error_message: Optional[str] = Field(None, description="Error message if move invalid")


class AIRequest(BaseModel):
    """Request for AI move."""
    board: Board = Field(..., description="Current board state")
    difficulty: Difficulty = Field(default=Difficulty.HARD, description="AI difficulty")
    
    @field_validator('board')
    @classmethod
    def validate_board(cls, v):
        if len(v) != 3 or any(len(row) != 3 for row in v):
            raise ValueError('Board must be 3x3')
        return v


class AIResponse(BaseModel):
    """AI move response."""
    move: Optional[Tuple[int, int]] = Field(None, description="AI chosen move (row, col)")
    game_state: GameState = Field(..., description="Game state after AI move")
    analysis: Dict[str, Any] = Field(default_factory=dict, description="Move analysis for educational purposes")
    computation_time: float = Field(..., description="Time taken to compute move (ms)")


class GameAnalysis(BaseModel):
    """Detailed game analysis for educational purposes."""
    move: Tuple[int, int] = Field(..., description="The move being analyzed")
    move_value: int = Field(..., description="Minimax value of the move")
    possible_moves: List[Tuple[int, int]] = Field(..., description="All possible moves")
    move_values: Dict[str, int] = Field(..., description="Values for all possible moves")
    pruned_branches: int = Field(default=0, description="Number of pruned branches (if alpha-beta)")
    total_states_evaluated: int = Field(..., description="Total game states evaluated")
    depth_reached: int = Field(..., description="Maximum search depth reached")


class GameStatsRequest(BaseModel):
    """Request for game statistics."""
    games: List[GameState] = Field(..., description="List of completed games")


class GameStatsResponse(BaseModel):
    """Game statistics response."""
    total_games: int = Field(..., description="Total number of games")
    wins_by_player: Dict[str, int] = Field(..., description="Wins per player")
    average_game_length: float = Field(..., description="Average number of moves per game")
    ai_performance: Dict[str, Any] = Field(default_factory=dict, description="AI performance metrics")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field("healthy", description="Service status")
    version: str = Field("1.0.0", description="API version")
    endpoints: List[str] = Field(..., description="Available endpoints")


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Human readable error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")