'use server'

import { revalidatePath } from 'next/cache'

type Player = 'X' | 'O'
type Cell = Player | null
type Board = Cell[][]

interface GameState {
  board: Board
  current_player: Player
  winner: Player | null
  is_terminal: boolean
}

const API_URL = 'http://127.0.0.1:8000/tic-tac-toe'

// Server Actions for tic-tac-toe
export async function createNewGame(): Promise<GameState> {
  try {
    const response = await fetch(`${API_URL}/new-game`, { 
      method: 'POST',
      cache: 'no-store' // Always fresh game state
    })
    
    if (!response.ok) {
      throw new Error('Failed to create new game')
    }
    
    return response.json()
  } catch (error) {
    console.error('New game error:', error)
    // Fallback to empty game
    return {
      board: [[null, null, null], [null, null, null], [null, null, null]],
      current_player: 'X',
      winner: null,
      is_terminal: false
    }
  }
}

export async function makePlayerMove(
  board: Board, 
  row: number, 
  col: number
): Promise<GameState> {
  try {
    const response = await fetch(`${API_URL}/make-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board, row, col }),
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Invalid move')
    }
    
    const gameState = await response.json()
    
    // Revalidate the game page to ensure fresh state
    revalidatePath('/notes/tic-tac-toe')
    
    return gameState
  } catch (error) {
    console.error('Move error:', error)
    throw error
  }
}

export async function getAIMove(board: Board): Promise<{
  board: Board
  current_player: Player
  winner: Player | null
  is_terminal: boolean
  move: [number, number] | null
  analysis: {
    difficulty: string
    possible_moves: number
    algorithm: string
  }
}> {
  try {
    const response = await fetch(`${API_URL}/ai-move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board }),
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('AI move failed')
    }
    
    const aiResponse = await response.json()
    
    // Revalidate for fresh state
    revalidatePath('/notes/tic-tac-toe')
    
    return aiResponse
  } catch (error) {
    console.error('AI move error:', error)
    throw error
  }
}

// Combined action for full game turn (human + AI)
export async function playTurn(
  board: Board,
  row: number,
  col: number,
  gameMode: 'human-vs-ai' | 'human-vs-human'
): Promise<{
  gameState: GameState
  aiAnalysis?: any
  error?: string
}> {
  try {
    // Make human move
    const afterHumanMove = await makePlayerMove(board, row, col)
    
    // If vs AI and game continues and it's AI's turn
    if (gameMode === 'human-vs-ai' && 
        !afterHumanMove.is_terminal && 
        afterHumanMove.current_player === 'O') {
      
      const aiResponse = await getAIMove(afterHumanMove.board)
      
      return {
        gameState: aiResponse,
        aiAnalysis: aiResponse.analysis
      }
    }
    
    return {
      gameState: afterHumanMove
    }
    
  } catch (error) {
    return {
      gameState: {
        board,
        current_player: 'X',
        winner: null,
        is_terminal: false
      },
      error: error instanceof Error ? error.message : 'Move failed'
    }
  }
}