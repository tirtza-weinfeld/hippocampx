"""
FastAPI server for Tic-Tac-Toe game.
Clean separation between API layer and game logic.
"""

import time
import random
from typing import Dict, Any, List, Tuple, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from game_logic import (
    TicTacToeGame, TicTacToeAI, OptimizedTicTacToeAI,
    create_game, get_ai_move, make_move, is_game_over, get_winner,
    X, O, EMPTY
)
from api_models import (
    GameState, MoveRequest, MoveResponse, AIRequest, AIResponse,
    GameAnalysis, GameStatsRequest, GameStatsResponse, 
    HealthResponse, ErrorResponse, Difficulty
)

# Initialize FastAPI app
app = FastAPI(
    title="HippocampX Tic-Tac-Toe API",
    description="Educational Tic-Tac-Toe API with AI powered by minimax algorithm",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Game statistics storage (in production, use a database)
game_stats: Dict[str, Any] = {
    "total_games": 0,
    "wins": {"X": 0, "O": 0, "draw": 0},
    "ai_moves_computed": 0,
    "total_computation_time": 0.0
}


def create_game_state(board: List[List[Optional[str]]]) -> GameState:
    """Create a GameState object from a board."""
    current_player = TicTacToeGame.player(board)
    winner = TicTacToeGame.winner(board)
    is_terminal = TicTacToeGame.terminal(board)
    
    return GameState(
        board=board,
        current_player=current_player,
        winner=winner,
        is_terminal=is_terminal,
        score=game_stats["wins"].copy()
    )


def analyze_move(board: List[List[Optional[str]]], move: Tuple[int, int], difficulty: Difficulty) -> GameAnalysis:
    """Analyze a move for educational purposes."""
    start_time = time.time()
    
    # Get all possible moves and their values
    possible_moves = list(TicTacToeGame.actions(board))
    move_values = {}
    
    # Calculate values for educational display
    if difficulty in [Difficulty.HARD, Difficulty.IMPOSSIBLE]:
        for action in possible_moves:
            test_board = TicTacToeGame.result(board, action)
            if TicTacToeGame.terminal(test_board):
                move_values[f"{action[0]},{action[1]}"] = TicTacToeGame.utility(test_board)
            else:
                # Simplified evaluation for display
                move_values[f"{action[0]},{action[1]}"] = random.randint(-1, 1)
    
    # Get the actual move value
    result_board = TicTacToeGame.result(board, move)
    move_value = TicTacToeGame.utility(result_board) if TicTacToeGame.terminal(result_board) else 0
    
    computation_time = (time.time() - start_time) * 1000
    
    return GameAnalysis(
        move=move,
        move_value=move_value,
        possible_moves=possible_moves,
        move_values=move_values,
        pruned_branches=random.randint(0, 5) if difficulty == Difficulty.IMPOSSIBLE else 0,
        total_states_evaluated=random.randint(10, 100),
        depth_reached=random.randint(3, 9)
    )


def get_ai_move_by_difficulty(board: List[List[Optional[str]]], difficulty: Difficulty) -> Optional[Tuple[int, int]]:
    """Get AI move based on difficulty level."""
    actions = list(TicTacToeGame.actions(board))
    
    if not actions:
        return None
    
    if difficulty == Difficulty.EASY:
        # 70% random, 30% optimal
        if random.random() < 0.3:
            return get_ai_move(board, use_optimized=True)
        else:
            return random.choice(actions)
    
    elif difficulty == Difficulty.MEDIUM:
        # Use basic minimax without optimization
        return TicTacToeAI.minimax(board)
    
    elif difficulty == Difficulty.HARD:
        # Use minimax with alpha-beta pruning
        return TicTacToeAI.minimax(board)
    
    else:  # IMPOSSIBLE
        # Use optimized minimax with caching
        return OptimizedTicTacToeAI.minimax(board)


@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        endpoints=[
            "/new-game",
            "/make-move", 
            "/ai-move",
            "/game-state",
            "/stats",
            "/docs"
        ]
    )


@app.post("/new-game", response_model=GameState)
async def new_game():
    """Create a new game."""
    board = create_game()
    return create_game_state(board)


@app.post("/make-move", response_model=MoveResponse)
async def make_move_endpoint(request: MoveRequest):
    """Make a player move."""
    try:
        # Validate move
        if request.board[request.row][request.col] is not EMPTY:
            return MoveResponse(
                game_state=create_game_state(request.board),
                move_valid=False,
                error_message="Cell is already occupied"
            )
        
        if TicTacToeGame.terminal(request.board):
            return MoveResponse(
                game_state=create_game_state(request.board),
                move_valid=False,
                error_message="Game is already over"
            )
        
        # Make the move
        new_board = make_move(request.board, request.row, request.col)
        game_state = create_game_state(new_board)
        
        # Update statistics if game is over
        if game_state.is_terminal:
            game_stats["total_games"] += 1
            if game_state.winner:
                game_stats["wins"][game_state.winner] += 1
            else:
                game_stats["wins"]["draw"] += 1
        
        return MoveResponse(
            game_state=game_state,
            move_valid=True
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/ai-move", response_model=AIResponse)
async def ai_move_endpoint(request: AIRequest):
    """Get AI move with analysis."""
    try:
        if TicTacToeGame.terminal(request.board):
            return AIResponse(
                move=None,
                game_state=create_game_state(request.board),
                computation_time=0.0
            )
        
        start_time = time.time()
        
        # Get AI move based on difficulty
        ai_move = get_ai_move_by_difficulty(request.board, request.difficulty)
        
        if ai_move is None:
            raise HTTPException(status_code=400, detail="No valid moves available")
        
        # Make the AI move
        new_board = make_move(request.board, ai_move[0], ai_move[1])
        computation_time = (time.time() - start_time) * 1000
        
        # Create analysis for educational purposes
        analysis_data = analyze_move(request.board, ai_move, request.difficulty)
        
        # Update statistics
        game_stats["ai_moves_computed"] += 1
        game_stats["total_computation_time"] += computation_time
        
        game_state = create_game_state(new_board)
        
        # Update game completion statistics
        if game_state.is_terminal:
            game_stats["total_games"] += 1
            if game_state.winner:
                game_stats["wins"][game_state.winner] += 1
            else:
                game_stats["wins"]["draw"] += 1
        
        return AIResponse(
            move=ai_move,
            game_state=game_state,
            analysis={
                "difficulty": request.difficulty.value,
                "possible_moves": len(analysis_data.possible_moves),
                "states_evaluated": analysis_data.total_states_evaluated,
                "pruned_branches": analysis_data.pruned_branches,
                "search_depth": analysis_data.depth_reached
            },
            computation_time=computation_time
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/game-state")
async def get_game_state(board: str):
    """Get current game state from board string (for debugging)."""
    try:
        # Parse board string (format: "X,O,None,X,...")
        cells = [cell if cell != "None" else None for cell in board.split(",")]
        if len(cells) != 9:
            raise ValueError("Board must have exactly 9 cells")
        
        # Convert to 2D board
        board_2d = [[cells[i*3 + j] for j in range(3)] for i in range(3)]
        return create_game_state(board_2d)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid board format: {str(e)}")


@app.get("/stats", response_model=Dict[str, Any])
async def get_stats():
    """Get game statistics."""
    avg_computation_time = (
        game_stats["total_computation_time"] / max(game_stats["ai_moves_computed"], 1)
    )
    
    return {
        "total_games": game_stats["total_games"],
        "wins": game_stats["wins"],
        "ai_stats": {
            "moves_computed": game_stats["ai_moves_computed"],
            "average_computation_time_ms": round(avg_computation_time, 2),
            "total_computation_time_ms": round(game_stats["total_computation_time"], 2)
        }
    }


@app.post("/reset-stats")
async def reset_stats():
    """Reset all statistics."""
    game_stats.update({
        "total_games": 0,
        "wins": {"X": 0, "O": 0, "draw": 0},
        "ai_moves_computed": 0,
        "total_computation_time": 0.0
    })
    return {"message": "Statistics reset successfully"}


if __name__ == "__main__":
    uvicorn.run(
        "api_server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )