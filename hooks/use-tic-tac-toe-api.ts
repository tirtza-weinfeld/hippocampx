/**
 * React hook for Tic-Tac-Toe API integration
 * Manages game state and API calls with proper error handling and loading states.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ticTacToeApi, 
  TicTacToeApiError, 
  BoardUtils,
  type Board, 
  type GameState, 
  type Difficulty,
  type AIResponse,
  type GameStats 
} from '@/lib/tic-tac-toe/api-client';
import { type State as FlatState } from '@/components/tic-tac-toe/tictactoe';

export interface ApiGameState {
  // Game state
  board: FlatState;  // Keep frontend as flat for UI consistency
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | null;
  isGameOver: boolean;
  
  // API state
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // AI state
  isAIThinking: boolean;
  aiDifficulty: Difficulty;
  lastAIAnalysis: AIResponse['analysis'] | null;
  
  // Statistics
  stats: GameStats | null;
}

export interface ApiGameActions {
  // Game actions
  newGame: () => Promise<void>;
  makePlayerMove: (index: number) => Promise<boolean>;
  makeAIMove: () => Promise<boolean>;
  
  // Settings
  setDifficulty: (difficulty: Difficulty) => void;
  
  // API management
  checkConnection: () => Promise<boolean>;
  refreshStats: () => Promise<void>;
  resetStats: () => Promise<void>;
  
  // Error handling
  clearError: () => void;
  
  // Development helpers
  getBoardAs2D: () => Board;
  getDebugInfo: () => Record<string, unknown>;
}

export function useTicTacToeApi(initialDifficulty: Difficulty = 'hard') {
  // Game state
  const [gameState, setGameState] = useState<ApiGameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameOver: false,
    
    isConnected: false,
    isLoading: false,
    error: null,
    
    isAIThinking: false,
    aiDifficulty: initialDifficulty,
    lastAIAnalysis: null,
    
    stats: null,
  });

  // Refs for managing API calls
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitializedRef = useRef(false);

  // Helper to update game state from API response
  const updateFromGameState = useCallback((apiGameState: GameState) => {
    const flatBoard = BoardUtils.boardTo1D(apiGameState.board);
    
    setGameState(prev => ({
      ...prev,
      board: flatBoard,
      currentPlayer: apiGameState.current_player,
      winner: apiGameState.winner,
      isGameOver: apiGameState.is_terminal,
    }));
  }, []);

  // Helper to handle API errors
  const handleApiError = useCallback((error: unknown) => {
    const errorMessage = error instanceof TicTacToeApiError 
      ? error.message 
      : error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
    
    setGameState(prev => ({
      ...prev,
      isLoading: false,
      isAIThinking: false,
      error: errorMessage,
      isConnected: false,
    }));
    
    console.error('Tic-Tac-Toe API Error:', error);
  }, []);

  // Check API connection
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      await ticTacToeApi.healthCheck();
      setGameState(prev => ({ ...prev, isConnected: true, error: null }));
      return true;
    } catch (error) {
      setGameState(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  }, []);

  // Start new game
  const newGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const apiGameState = await ticTacToeApi.newGame();
      updateFromGameState(apiGameState);
      
      setGameState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isConnected: true,
        lastAIAnalysis: null 
      }));
    } catch (error) {
      handleApiError(error);
    }
  }, [updateFromGameState, handleApiError]);

  // Make player move
  const makePlayerMove = useCallback(async (index: number): Promise<boolean> => {
    if (gameState.isGameOver || gameState.isLoading || gameState.isAIThinking) {
      return false;
    }

    const [row, col] = BoardUtils.indexToCoords(index);
    const board2D = BoardUtils.flatTo2D(gameState.board);

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await ticTacToeApi.makeMove(board2D, row, col);
      
      if (!response.move_valid) {
        setGameState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: response.error_message || 'Invalid move' 
        }));
        return false;
      }

      updateFromGameState(response.game_state);
      setGameState(prev => ({ ...prev, isLoading: false, isConnected: true }));
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  }, [gameState.board, gameState.isGameOver, gameState.isLoading, gameState.isAIThinking, updateFromGameState, handleApiError]);

  // Make AI move
  const makeAIMove = useCallback(async (): Promise<boolean> => {
    if (gameState.isGameOver || gameState.isLoading || gameState.isAIThinking) {
      return false;
    }

    const board2D = BoardUtils.flatTo2D(gameState.board);
    
    setGameState(prev => ({ ...prev, isAIThinking: true, error: null }));

    try {
      const response = await ticTacToeApi.getAIMove(board2D, gameState.aiDifficulty);
      
      updateFromGameState(response.game_state);
      
      setGameState(prev => ({ 
        ...prev, 
        isAIThinking: false, 
        isConnected: true,
        lastAIAnalysis: response.analysis 
      }));
      
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  }, [gameState.board, gameState.aiDifficulty, gameState.isGameOver, gameState.isLoading, gameState.isAIThinking, updateFromGameState, handleApiError]);

  // Set AI difficulty
  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, aiDifficulty: difficulty }));
  }, []);

  // Refresh statistics
  const refreshStats = useCallback(async () => {
    try {
      const stats = await ticTacToeApi.getStats();
      setGameState(prev => ({ ...prev, stats, isConnected: true }));
    } catch (error) {
      console.warn('Failed to fetch stats:', error);
    }
  }, []);

  // Reset statistics
  const resetStats = useCallback(async () => {
    try {
      await ticTacToeApi.resetStats();
      await refreshStats();
    } catch (error) {
      handleApiError(error);
    }
  }, [refreshStats, handleApiError]);

  // Clear error
  const clearError = useCallback(() => {
    setGameState(prev => ({ ...prev, error: null }));
  }, []);

  // Helper functions
  const getBoardAs2D = useCallback((): Board => {
    return BoardUtils.flatTo2D(gameState.board);
  }, [gameState.board]);

  const getDebugInfo = useCallback((): Record<string, unknown> => {
    return {
      gameState,
      board2D: getBoardAs2D(),
      apiConnected: gameState.isConnected,
      lastError: gameState.error,
      aiAnalysis: gameState.lastAIAnalysis,
    };
  }, [gameState, getBoardAs2D]);

  // Initialize connection on mount
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      checkConnection().then(connected => {
        if (connected) {
          newGame();
          refreshStats();
        }
      });
    }
  }, [checkConnection, newGame, refreshStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const actions: ApiGameActions = {
    newGame,
    makePlayerMove,
    makeAIMove,
    setDifficulty,
    checkConnection,
    refreshStats,
    resetStats,
    clearError,
    getBoardAs2D,
    getDebugInfo,
  };

  return [gameState, actions] as const;
}

// Utility hook for development/debugging
export function useTicTacToeDebug() {
  const [gameState, actions] = useTicTacToeApi();
  
  const debugLog = useCallback(() => {
    console.log('🎮 Tic-Tac-Toe Debug Info:', actions.getDebugInfo());
  }, [actions]);
  
  const testConnection = useCallback(async () => {
    console.log('🔌 Testing API connection...');
    const connected = await actions.checkConnection();
    console.log(connected ? '✅ API connected' : '❌ API disconnected');
    return connected;
  }, [actions]);
  
  const simulateGame = useCallback(async () => {
    console.log('🎲 Starting simulated game...');
    await actions.newGame();
    
    // Make a few moves for testing
    await actions.makePlayerMove(4); // Center
    await actions.makeAIMove();
    await actions.makePlayerMove(0); // Top-left
    await actions.makeAIMove();
    
    debugLog();
  }, [actions, debugLog]);
  
  return {
    gameState,
    actions,
    debugLog,
    testConnection,
    simulateGame,
  };
}