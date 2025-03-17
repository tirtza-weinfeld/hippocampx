import { checkWinner, getAvailableMoves, isBoardFull } from "@/lib/tic-tac-toe/game-utils"

interface Move {
  boardIndex: number
  cellIndex: number
}

// Evaluate the state of a small board
function evaluateSmallBoard(board: (string | null)[], player: string): number {
  const opponent = player === "O" ? "X" : "O"

  // Check if the board is already won
  const winner = checkWinner(board)
  if (winner === player) return 10
  if (winner === opponent) return -10
  if (isBoardFull(board)) return 0

  // Evaluate potential winning positions
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  let score = 0

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    const patternValues = [board[a], board[b], board[c]]

    // Count player and opponent marks in this pattern
    const playerCount = patternValues.filter((v) => v === player).length
    const opponentCount = patternValues.filter((v) => v === opponent).length
    const emptyCount = patternValues.filter((v) => v === null).length

    // Assign scores based on pattern state
    if (playerCount === 2 && emptyCount === 1) score += 3
    if (playerCount === 1 && emptyCount === 2) score += 1
    if (opponentCount === 2 && emptyCount === 1) score -= 4 // Block opponent wins (higher priority)
  }

  // Center position is strategically valuable
  if (board[4] === player) score += 2

  return score
}

// Evaluate the entire game state
function evaluateGameState(boards: (string | null)[][], mainBoard: (string | null)[], player: string): number {
  const opponent = player === "O" ? "X" : "O"

  // Check if the game is already won
  const winner = checkWinner(mainBoard)
  if (winner === player) return 1000
  if (winner === opponent) return -1000

  // Evaluate main board patterns
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  let score = 0

  // Evaluate each winning pattern on the main board
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    const patternValues = [mainBoard[a], mainBoard[b], mainBoard[c]]

    const playerCount = patternValues.filter((v) => v === player).length
    const opponentCount = patternValues.filter((v) => v === opponent).length
    const emptyCount = patternValues.filter((v) => v === null).length

    // Assign scores based on main board pattern state
    if (playerCount === 2 && emptyCount === 1) score += 50
    if (playerCount === 1 && emptyCount === 2) score += 10
    if (opponentCount === 2 && emptyCount === 1) score -= 60 // Block opponent wins (higher priority)
  }

  // Add scores for each small board
  for (let i = 0; i < 9; i++) {
    if (mainBoard[i] === null) {
      score += evaluateSmallBoard(boards[i], player)
    }
  }

  return score
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  boards: (string | null)[][],
  mainBoard: (string | null)[],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  activeBoard: number | null,
  player: string,
): number {
  const opponent = player === "O" ? "X" : "O"

  // Base case: check if game is over or max depth reached
  const winner = checkWinner(mainBoard)
  if (winner === player) return 1000 - depth // Prefer winning sooner
  if (winner === opponent) return -1000 + depth // Prefer losing later
  if (mainBoard.every((cell, idx) => cell !== null || isBoardFull(boards[idx]))) return 0 // Draw
  if (depth === 0) return evaluateGameState(boards, mainBoard, player)

  // Determine which boards are available to play in
  let availableBoards: number[]
  if (activeBoard !== null && mainBoard[activeBoard] === null && !isBoardFull(boards[activeBoard])) {
    availableBoards = [activeBoard]
  } else {
    availableBoards = mainBoard
      .map((cell, index) => (cell === null && !isBoardFull(boards[index]) ? index : -1))
      .filter((index) => index !== -1)
  }

  if (isMaximizing) {
    let maxEval = Number.NEGATIVE_INFINITY

    // Try each available board
    for (const boardIndex of availableBoards) {
      const availableCells = getAvailableMoves(boards[boardIndex])

      // Try each available cell in this board
      for (const cellIndex of availableCells) {
        // Make the move
        const boardsCopy = boards.map((board) => [...board])
        boardsCopy[boardIndex][cellIndex] = player

        // Check if this move wins a small board
        const mainBoardCopy = [...mainBoard]
        const smallBoardWinner = checkWinner(boardsCopy[boardIndex])
        if (smallBoardWinner) {
          mainBoardCopy[boardIndex] = smallBoardWinner
        }

        // Determine next active board
        const nextActiveBoard =
          mainBoardCopy[cellIndex] !== null || isBoardFull(boardsCopy[cellIndex]) ? null : cellIndex

        // Recursive call
        const evalScore = minimax(boardsCopy, mainBoardCopy, depth - 1, alpha, beta, false, nextActiveBoard, player)

        maxEval = Math.max(maxEval, evalScore)
        alpha = Math.max(alpha, evalScore)

        // Alpha-beta pruning
        if (beta <= alpha) break
      }

      // Alpha-beta pruning at board level
      if (beta <= alpha) break
    }

    return maxEval
  } else {
    let minEval = Number.POSITIVE_INFINITY

    // Try each available board
    for (const boardIndex of availableBoards) {
      const availableCells = getAvailableMoves(boards[boardIndex])

      // Try each available cell in this board
      for (const cellIndex of availableCells) {
        // Make the move
        const boardsCopy = boards.map((board) => [...board])
        boardsCopy[boardIndex][cellIndex] = opponent

        // Check if this move wins a small board
        const mainBoardCopy = [...mainBoard]
        const smallBoardWinner = checkWinner(boardsCopy[boardIndex])
        if (smallBoardWinner) {
          mainBoardCopy[boardIndex] = smallBoardWinner
        }

        // Determine next active board
        const nextActiveBoard =
          mainBoardCopy[cellIndex] !== null || isBoardFull(boardsCopy[cellIndex]) ? null : cellIndex

        // Recursive call
        const evalScore = minimax(boardsCopy, mainBoardCopy, depth - 1, alpha, beta, true, nextActiveBoard, player)

        minEval = Math.min(minEval, evalScore)
        beta = Math.min(beta, evalScore)

        // Alpha-beta pruning
        if (beta <= alpha) break
      }

      // Alpha-beta pruning at board level
      if (beta <= alpha) break
    }

    return minEval
  }
}

// Find the best move using minimax
function findBestMove(
  boards: (string | null)[][],
  mainBoard: (string | null)[],
  activeBoard: number | null,
  player: string,
  maxDepth = 3,
): Move {
  let bestScore = Number.NEGATIVE_INFINITY
  let bestMove: Move = { boardIndex: 0, cellIndex: 0 }

  // Determine which boards are available to play in
  let availableBoards: number[]
  if (activeBoard !== null && mainBoard[activeBoard] === null && !isBoardFull(boards[activeBoard])) {
    availableBoards = [activeBoard]
  } else {
    availableBoards = mainBoard
      .map((cell, index) => (cell === null && !isBoardFull(boards[index]) ? index : -1))
      .filter((index) => index !== -1)
  }

  // Try each available board
  for (const boardIndex of availableBoards) {
    const availableCells = getAvailableMoves(boards[boardIndex])

    // Try each available cell in this board
    for (const cellIndex of availableCells) {
      // Make the move
      const boardsCopy = boards.map((board) => [...board])
      boardsCopy[boardIndex][cellIndex] = player

      // Check if this move wins a small board
      const mainBoardCopy = [...mainBoard]
      const smallBoardWinner = checkWinner(boardsCopy[boardIndex])
      if (smallBoardWinner) {
        mainBoardCopy[boardIndex] = smallBoardWinner

        // If this move wins the game, choose it immediately
        if (checkWinner(mainBoardCopy) === player) {
          return { boardIndex, cellIndex }
        }
      }

      // Determine next active board
      const nextActiveBoard = mainBoardCopy[cellIndex] !== null || isBoardFull(boardsCopy[cellIndex]) ? null : cellIndex

      // Calculate score using minimax
      const score = minimax(
        boardsCopy,
        mainBoardCopy,
        maxDepth - 1,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        false,
        nextActiveBoard,
        player,
      )

      // Update best move if this is better
      if (score > bestScore) {
        bestScore = score
        bestMove = { boardIndex, cellIndex }
      }
    }
  }

  return bestMove
}

// Make a move for the AI with adaptive difficulty
export function makeAIMove(
  boards: (string | null)[][],
  mainBoard: (string | null)[],
  activeBoard: number | null,
): Move {
  // Count the number of moves made to adjust difficulty
  const movesMade = boards.flat().filter((cell) => cell !== null).length

  // Determine search depth based on game progress
  // Early game: shallow search for faster moves
  // Mid game: deeper search for better strategy
  // Late game: deepest search for optimal endgame
  let searchDepth = 2
  if (movesMade > 30)
    searchDepth = 4 // Endgame: deeper search
  else if (movesMade > 15) searchDepth = 3 // Mid-game: medium search

  // For very early moves, use a simpler strategy occasionally to add variety
  if (movesMade < 8 && Math.random() < 0.3) {
    return makeSimpleMove(boards, mainBoard, activeBoard)
  }

  // Use minimax to find the best move
  return findBestMove(boards, mainBoard, activeBoard, "O", searchDepth)
}

// Simple move strategy for variety in early game
function makeSimpleMove(boards: (string | null)[][], mainBoard: (string | null)[], activeBoard: number | null): Move {
  // If there's an active board, play in that board
  if (activeBoard !== null && mainBoard[activeBoard] === null) {
    const availableMoves = getAvailableMoves(boards[activeBoard])

    // Try to win the small board
    for (const cellIndex of availableMoves) {
      const boardCopy = [...boards[activeBoard]]
      boardCopy[cellIndex] = "O"
      if (checkWinner(boardCopy) === "O") {
        return { boardIndex: activeBoard, cellIndex }
      }
    }

    // Block player from winning the small board
    for (const cellIndex of availableMoves) {
      const boardCopy = [...boards[activeBoard]]
      boardCopy[cellIndex] = "X"
      if (checkWinner(boardCopy) === "X") {
        return { boardIndex: activeBoard, cellIndex }
      }
    }

    // Try to play in the center
    if (availableMoves.includes(4)) {
      return { boardIndex: activeBoard, cellIndex: 4 }
    }

    // Try to play in a corner
    const corners = [0, 2, 6, 8].filter((corner) => availableMoves.includes(corner))
    if (corners.length > 0) {
      return { boardIndex: activeBoard, cellIndex: corners[Math.floor(Math.random() * corners.length)] }
    }

    // Play randomly
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    return { boardIndex: activeBoard, cellIndex: randomIndex }
  }

  // If there's no active board, choose a strategic board and cell
  const availableBoards = mainBoard
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1 && getAvailableMoves(boards[index]).length > 0)

  // Prioritize boards that can lead to winning the main board
  for (const boardIndex of availableBoards) {
    const availableCells = getAvailableMoves(boards[boardIndex])

    for (const cellIndex of availableCells) {
      // Check if this move would send the player to a won or full board
      if (mainBoard[cellIndex] !== null || getAvailableMoves(boards[cellIndex]).length === 0) {
        // This is a strategic advantage - play here
        return { boardIndex, cellIndex }
      }

      // Check if this move would allow us to win a small board
      const boardCopy = [...boards[boardIndex]]
      boardCopy[cellIndex] = "O"
      if (checkWinner(boardCopy) === "O") {
        // Winning a small board is a priority
        return { boardIndex, cellIndex }
      }
    }
  }

  // If no strategic advantage, choose a random valid move
  const randomBoardIndex = availableBoards[Math.floor(Math.random() * availableBoards.length)]
  const availableCells = getAvailableMoves(boards[randomBoardIndex])
  const randomCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)]

  return { boardIndex: randomBoardIndex, cellIndex: randomCellIndex }
}

