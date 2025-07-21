# Tic-Tac-Toe Backend API

Educational Tic-Tac-Toe backend with AI powered by minimax algorithm, designed for CS50 AI course integration.

## Features

- **Clean Architecture**: Separation of game logic, AI, and API layers
- **Educational AI**: Minimax with alpha-beta pruning for CS50 AI concepts
- **Multiple Difficulty Levels**: Easy, Medium, Hard, Impossible
- **Performance Optimized**: Caching and optimized algorithms
- **Educational Analysis**: Move analysis and algorithm insights
- **Modern Python**: Type hints, async/await, Pydantic validation

## Architecture

```
├── game_logic.py      # Pure game logic (no I/O dependencies)
├── api_models.py      # Pydantic models for API validation
├── api_server.py      # FastAPI server and endpoints
├── main.py           # Entry point (legacy)
└── requirements.txt   # Dependencies
```

### Clean Separation of Concerns

- **`game_logic.py`**: Pure functions, no HTTP/API dependencies
- **`api_models.py`**: Data validation and serialization
- **`api_server.py`**: HTTP endpoints and business logic

## Setup & Development

### 1. Install Dependencies

```bash
cd tic-tac-toe-backend
pip install -r requirements.txt
```

### 2. Run Development Server

```bash
# Method 1: Using uvicorn directly
uvicorn api_server:app --reload --host 127.0.0.1 --port 8000

# Method 2: Using Python
python api_server.py

# Method 3: Using the legacy main.py
python main.py
```

### 3. Access API Documentation

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Health Check**: http://127.0.0.1:8000/

## API Endpoints

### Core Game Endpoints

```http
POST /new-game           # Create new game
POST /make-move          # Make player move  
POST /ai-move            # Get AI move with analysis
GET  /game-state         # Get current state (debugging)
```

### Statistics & Monitoring

```http
GET  /stats              # Game statistics
POST /reset-stats        # Reset statistics
GET  /                   # Health check
```

### Example Usage

#### Create New Game
```bash
curl -X POST http://127.0.0.1:8000/new-game
```

#### Make Player Move
```bash
curl -X POST http://127.0.0.1:8000/make-move \
  -H "Content-Type: application/json" \
  -d '{
    "board": [
      [null, null, null],
      [null, null, null], 
      [null, null, null]
    ],
    "row": 1,
    "col": 1
  }'
```

#### Get AI Move
```bash
curl -X POST http://127.0.0.1:8000/ai-move \
  -H "Content-Type: application/json" \
  -d '{
    "board": [
      [null, null, null],
      [null, "X", null],
      [null, null, null]
    ],
    "difficulty": "hard"
  }'
```

## AI Difficulty Levels

- **Easy**: 70% random moves, 30% optimal (good for beginners)
- **Medium**: Basic minimax without optimizations
- **Hard**: Minimax with alpha-beta pruning
- **Impossible**: Optimized minimax with caching (unbeatable)

## Educational Features

### Algorithm Analysis
Each AI move includes:
- Computation time
- States evaluated
- Search depth reached
- Branches pruned (alpha-beta)
- Move evaluation scores

### Learning Integration
Perfect for CS50 AI course:
- Clear minimax implementation
- Alpha-beta pruning demonstration
- Performance optimization techniques
- Caching strategies

## Development Debugging

### Backend Debugging
```bash
# Debug mode with breakpoints
python -m pdb api_server.py

# Or with debugpy for IDE integration
python -m debugpy --listen 5678 --wait-for-client api_server.py
```

### Testing Game Logic
```python
from game_logic import TicTacToeGame, TicTacToeAI

# Create game
board = TicTacToeGame.initial_state()

# Make move
board = TicTacToeGame.result(board, (1, 1))

# Get AI move
ai_move = TicTacToeAI.minimax(board)
print(f"AI suggests: {ai_move}")
```

### Frontend Integration

The API is CORS-enabled for localhost:3000 (Next.js dev server). Frontend should make requests to:

```typescript
const API_BASE = 'http://127.0.0.1:8000';

// Get AI move
const response = await fetch(`${API_BASE}/ai-move`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    board: currentBoard,
    difficulty: 'hard'
  })
});
```

## Performance Notes

- **Caching**: Optimized AI uses `@cache` for repeated states
- **Immutable States**: Flat board representation for efficient caching
- **Alpha-Beta Pruning**: Reduces search space significantly
- **Type Safety**: Full type hints for better IDE support

## File Structure Rationale

1. **`game_logic.py`**: Zero dependencies, pure functions, easily testable
2. **`api_models.py`**: Centralized validation, type safety
3. **`api_server.py`**: Clean HTTP layer, separated from business logic

This structure allows you to:
- Test game logic independently
- Swap out AI algorithms easily
- Add new API endpoints without touching game logic
- Maintain clean separation of concerns