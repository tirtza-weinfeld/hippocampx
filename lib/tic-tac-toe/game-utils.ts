// Check if there's a winner in a board
export function checkWinner(board: (string | null)[]): string | null {
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

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }

  return null
}

// Get all available moves in a board
export function getAvailableMoves(board: (string | null)[]): number[] {
  return board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1)
}

// Check if a board is full
export function isBoardFull(board: (string | null)[]): boolean {
  return !board.includes(null)
}

