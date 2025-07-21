/**
 * Tic-Tac-Toe API Client
 * Clean separation between frontend game logic and backend API calls.
 * No game logic here - only HTTP communication.
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_TICTACTOE_API_URL || 'http://127.0.0.1:8000';

// Type definitions matching backend
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];  // 2D board for API
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface GameState {
  board: Board;
  current_player: Player;
  winner: Player | null;
  is_terminal: boolean;
  score: { X: number; O: number; draw: number };
}

export interface MoveRequest {
  board: Board;
  row: number;
  col: number;
}

export interface MoveResponse {
  game_state: GameState;
  move_valid: boolean;
  error_message?: string;
}

export interface AIRequest {
  board: Board;
  difficulty?: Difficulty;
}

export interface AIResponse {
  move: [number, number] | null;  // [row, col]
  game_state: GameState;
  analysis: {
    difficulty: string;
    possible_moves: number;
    states_evaluated: number;
    pruned_branches: number;
    search_depth: number;
  };
  computation_time: number;
}

export interface GameStats {
  total_games: number;
  wins: { X: number; O: number; draw: number };
  ai_stats: {
    moves_computed: number;
    average_computation_time_ms: number;
    total_computation_time_ms: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

// API Client Class
export class TicTacToeApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'NetworkError',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new TicTacToeApiError(errorData.message, errorData, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TicTacToeApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new TicTacToeApiError(
        `Failed to connect to game server: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { error: 'NetworkError', message: String(error) }
      );
    }
  }

  /**
   * Create a new game
   */
  async newGame(): Promise<GameState> {
    return this.request<GameState>('/new-game', { method: 'POST' });
  }

  /**
   * Make a player move
   */
  async makeMove(board: Board, row: number, col: number): Promise<MoveResponse> {
    const request: MoveRequest = { board, row, col };
    return this.request<MoveResponse>('/make-move', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get AI move with analysis
   */
  async getAIMove(board: Board, difficulty: Difficulty = 'hard'): Promise<AIResponse> {
    const request: AIRequest = { board, difficulty };
    return this.request<AIResponse>('/ai-move', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get game statistics
   */
  async getStats(): Promise<GameStats> {
    return this.request<GameStats>('/stats');
  }

  /**
   * Reset game statistics
   */
  async resetStats(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/reset-stats', { method: 'POST' });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; version: string; endpoints: string[] }> {
    return this.request('/');
  }
}

// Custom Error Class
export class TicTacToeApiError extends Error {
  public readonly apiError: ApiError;
  public readonly statusCode?: number;

  constructor(message: string, apiError: ApiError, statusCode?: number) {
    super(message);
    this.name = 'TicTacToeApiError';
    this.apiError = apiError;
    this.statusCode = statusCode;
  }
}

// Utility functions for board conversion
export class BoardUtils {
  /**
   * Convert 1D flat state to 2D board for API
   */
  static flatTo2D(flat: Cell[]): Board {
    if (flat.length !== 9) {
      throw new Error('Flat board must have exactly 9 cells');
    }
    return [
      [flat[0], flat[1], flat[2]],
      [flat[3], flat[4], flat[5]],
      [flat[6], flat[7], flat[8]],
    ];
  }

  /**
   * Convert 2D board from API to 1D flat state
   */
  static boardTo1D(board: Board): Cell[] {
    if (board.length !== 3 || board.some(row => row.length !== 3)) {
      throw new Error('Board must be 3x3');
    }
    return board.flat();
  }

  /**
   * Convert flat index to 2D coordinates
   */
  static indexToCoords(index: number): [number, number] {
    if (index < 0 || index > 8) {
      throw new Error('Index must be between 0 and 8');
    }
    return [Math.floor(index / 3), index % 3];
  }

  /**
   * Convert 2D coordinates to flat index
   */
  static coordsToIndex(row: number, col: number): number {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      throw new Error('Coordinates must be between 0 and 2');
    }
    return row * 3 + col;
  }
}

// Default client instance
export const ticTacToeApi = new TicTacToeApiClient();

// Environment configuration
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  isLocalDevelopment: API_BASE_URL.includes('127.0.0.1') || API_BASE_URL.includes('localhost'),
  timeout: 10000, // 10 seconds
} as const;

// Type guards
export function isValidBoard(board: unknown): board is Board {
  return (
    Array.isArray(board) &&
    board.length === 3 &&
    board.every(
      row =>
        Array.isArray(row) &&
        row.length === 3 &&
        row.every(cell => cell === null || cell === 'X' || cell === 'O')
    )
  );
}

export function isValidDifficulty(difficulty: unknown): difficulty is Difficulty {
  return typeof difficulty === 'string' && 
         ['easy', 'medium', 'hard', 'impossible'].includes(difficulty);
}