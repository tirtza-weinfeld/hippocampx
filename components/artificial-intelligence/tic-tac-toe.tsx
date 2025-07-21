'use client'

import { useState, useActionState, useOptimistic, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Play } from 'lucide-react'
import { createNewGame, playTurn } from '@/lib/tic-tac-toe-actions'

type Player = 'X' | 'O'
type Cell = Player | null
type Board = Cell[][]

interface GameState {
  board: Board
  current_player: Player
  winner: Player | null
  is_terminal: boolean
}

const EMPTY_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

const initialGameState: GameState = {
  board: EMPTY_BOARD,
  current_player: 'X',
  winner: null,
  is_terminal: false
}

export default function TicTacToe() {
  // Modern React 19 state management
  const [isPending, startTransition] = useTransition()
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  
  // Optimistic updates for instant UI feedback
  const [optimisticGameState, setOptimisticGameState] = useOptimistic(
    gameState,
    (current, optimisticMove: { row: number; col: number; player: Player }): GameState => ({
      ...current,
      board: current.board.map((boardRow, r) =>
        boardRow.map((cell, c) =>
          r === optimisticMove.row && c === optimisticMove.col
            ? optimisticMove.player
            : cell
        )
      ) as Board,
      current_player: (optimisticMove.player === 'X' ? 'O' : 'X') as Player,
      winner: current.winner,
      is_terminal: current.is_terminal
    })
  )

  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human'>('human-vs-ai')
  const [aiAnalysis, setAiAnalysis] = useState<{
    difficulty: string;
    possible_moves: number;
    algorithm: string;
    states_evaluated: number;
    max_depth_reached: number;
    computation_time_ms: number;
    best_move_reasoning: string;
    best_score: number;
    move_evaluations: Record<string, { score: number; evaluation: string }>;
    remaining_moves: number;
  } | null>(null)
  
  
  // Server Action state management
  const [newGameState, newGameAction] = useActionState(
    async (prevState: { success: boolean }, formData: FormData): Promise<{ success: boolean }> => {
      try {
        const newGame = await createNewGame()
        setGameState(newGame)
        setAiAnalysis(null)
        return { success: true }
      } catch (error) {
        console.error('Failed to create new game:', error)
        return { success: false }
      }
    },
    { success: false }
  )

  // Modern move action with optimistic updates
  const makeMove = (row: number, col: number) => {
    if (optimisticGameState.board[row][col] || optimisticGameState.is_terminal || isPending) {
      return
    }

    const currentPlayer = optimisticGameState.current_player
    
    // Optimistic update must happen inside transition
    startTransition(async () => {
      // Instant optimistic update
      setOptimisticGameState({ row, col, player: currentPlayer })
      
      try {
        const result = await playTurn(gameState.board, row, col, gameMode)
        
        if (result.error) {
          console.error('Move failed:', result.error)
          return
        }
        
        setGameState(result.gameState)
        
        if (result.aiAnalysis) {
          setAiAnalysis(result.aiAnalysis)
        }
      } catch (error) {
        console.error('Move failed:', error)
        // Revert optimistic update on error by resetting to current game state
        setGameState(gameState)
      }
    })
  }


  // UI helpers with optimistic state
  const getStatus = () => {
    if (isPending) return 'Processing...'
    if (optimisticGameState.winner) return `${optimisticGameState.winner} wins!`
    if (optimisticGameState.is_terminal) return "It's a draw!"
    if (gameMode === 'human-vs-ai') {
      return optimisticGameState.current_player === 'X' ? 'Your turn' : "AI's turn"
    }
    return `${optimisticGameState.current_player}'s turn`
  }

  const getCellContent = (cell: Cell) => {
    if (cell === 'X') return '×'
    if (cell === 'O') return '○'
    return ''
  }

  const getCellStyle = (cell: Cell) => {
    const base = "aspect-square bg-background border-2 border-border hover:bg-accent transition-colors flex items-center justify-center text-4xl font-bold disabled:opacity-50"
    if (cell === 'X') return `${base} text-blue-600`
    if (cell === 'O') return `${base} text-red-600`
    return `${base} text-muted-foreground`
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tic-Tac-Toe</span>
            <Badge variant="outline">{getStatus()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex gap-2">
            <Select value={gameMode} onValueChange={(value: 'human-vs-ai' | 'human-vs-human') => setGameMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-vs-ai">vs AI</SelectItem>
                <SelectItem value="human-vs-human">vs Human</SelectItem>
              </SelectContent>
            </Select>

            {gameMode === 'human-vs-ai' && (
              <Badge variant="secondary">Impossible Mode</Badge>
            )}

            {/* Modern Server Action form */}
            <form action={newGameAction}>
              <Button type="submit" disabled={isPending} size="sm">
                {isPending ? 'Starting...' : 'New Game'}
              </Button>
            </form>
          </div>

          {/* Board with optimistic updates */}
          <div className="grid grid-cols-3 gap-1 max-w-48 mx-auto">
            {optimisticGameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellStyle(cell)}
                  onClick={() => makeMove(rowIndex, colIndex)}
                  disabled={
                    cell !== null || 
                    optimisticGameState.is_terminal || 
                    isPending ||
                    (gameMode === 'human-vs-ai' && optimisticGameState.current_player === 'O')
                  }
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>

          {/* Enhanced AI Analysis with Step-through Dialog */}
          {aiAnalysis && gameMode === 'human-vs-ai' && (
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-3 rounded-lg border border-purple-200/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-purple-500" />
                    AI Analysis
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-7 bg-purple-500/10 border-purple-400/30 hover:bg-purple-500/20"
                    disabled
                  >
                    <Play className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Analysis Coming Soon</span>
                    <span className="sm:hidden">Soon</span>
                  </Button>
                </div>
                
                {/* Quick Summary */}
                <div className="mb-3 p-2 bg-background/50 rounded text-xs">
                  <strong>Decision:</strong> {aiAnalysis.best_move_reasoning}
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-background/30 p-2 rounded">
                    <div className="font-medium text-blue-600">States Evaluated</div>
                    <div className="text-lg font-bold">{aiAnalysis.states_evaluated}</div>
                  </div>
                  <div className="bg-background/30 p-2 rounded">
                    <div className="font-medium text-green-600">Computation</div>
                    <div className="text-lg font-bold">{aiAnalysis.computation_time_ms}ms</div>
                  </div>
                </div>
                
                {/* Move Evaluations Grid */}
                {aiAnalysis.move_evaluations && Object.keys(aiAnalysis.move_evaluations).length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium mb-2 text-purple-700">Move Evaluations</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(aiAnalysis.move_evaluations).map(([move, evaluation], idx) => (
                        <motion.div 
                          key={move}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-2 rounded-lg border-2 ${
                            evaluation.score > 0 
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : evaluation.score < 0
                              ? 'bg-red-50 border-red-200 text-red-800' 
                              : 'bg-blue-50 border-blue-200 text-blue-800'
                          }`}
                        >
                          <div className="font-mono text-xs font-bold">{move}</div>
                          <div className="text-xs">{evaluation.evaluation}</div>
                          <div className="text-xs font-semibold">Score: {evaluation.score}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}