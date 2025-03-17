"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/games/tic-tac-toe/button"
import Board from "@/components/games/tic-tac-toe/Board"
import { makeAIMove } from "@/lib/tic-tac-toe/ai-agent"
import { checkWinner, getAvailableMoves } from "@/lib/tic-tac-toe/game-utils"

export default function SuperTicTacToe() {
  // Initialize the game state
  // null = empty, 'X' = player, 'O' = AI
  const [boards, setBoards] = useState<(string | null)[][]>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  )
  const [mainBoard, setMainBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [activeBoard, setActiveBoard] = useState<number | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")

  // Handle player move
  const handleMove = (boardIndex: number, cellIndex: number) => {
    if (gameOver || currentPlayer !== "X") return

    // Check if the move is valid
    if (
      (activeBoard === null || activeBoard === boardIndex) &&
      boards[boardIndex][cellIndex] === null &&
      mainBoard[boardIndex] === null
    ) {
      // Update the boards state
      const newBoards = [...boards]
      newBoards[boardIndex][cellIndex] = currentPlayer
      setBoards(newBoards)

      // Check if the small board is won
      const smallBoardWinner = checkWinner(newBoards[boardIndex])
      if (smallBoardWinner) {
        const newMainBoard = [...mainBoard]
        newMainBoard[boardIndex] = smallBoardWinner
        setMainBoard(newMainBoard)

        // Check if the game is won
        const gameWinner = checkWinner(newMainBoard)
        if (gameWinner) {
          setWinner(gameWinner)
          setGameOver(true)
          return
        }
      }

      // Set the next active board based on the cell that was just played
      // If the target board is already won or full, allow play on any board
      if (mainBoard[cellIndex] !== null || getAvailableMoves(boards[cellIndex]).length === 0) {
        setActiveBoard(null)
      } else {
        setActiveBoard(cellIndex)
      }

      // Switch to AI's turn
      setCurrentPlayer("O")
    }
  }

  // AI's turn
  useEffect(() => {
    if (currentPlayer === "O" && !gameOver && gameStarted) {
      const timer = setTimeout(() => {
        const { boardIndex, cellIndex } = makeAIMove(boards, mainBoard, activeBoard, difficulty)

        // Update the boards state
        const newBoards = [...boards]
        newBoards[boardIndex][cellIndex] = "O"
        setBoards(newBoards)

        // Check if the small board is won
        const smallBoardWinner = checkWinner(newBoards[boardIndex])
        if (smallBoardWinner) {
          const newMainBoard = [...mainBoard]
          newMainBoard[boardIndex] = smallBoardWinner
          setMainBoard(newMainBoard)

          // Check if the game is won
          const gameWinner = checkWinner(newMainBoard)
          if (gameWinner) {
            setWinner(gameWinner)
            setGameOver(true)
            return
          }
        }

        // Set the next active board
        if (mainBoard[cellIndex] !== null || getAvailableMoves(boards[cellIndex]).length === 0) {
          setActiveBoard(null)
        } else {
          setActiveBoard(cellIndex)
        }

        // Switch back to player's turn
        setCurrentPlayer("X")
      }, 700)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, boards, mainBoard, activeBoard, gameOver, gameStarted, difficulty])

  // Check for a draw
  useEffect(() => {
    if (!gameOver && gameStarted) {
      // Check if all boards are either won or full
      const isDraw = mainBoard.every((cell, index) => cell !== null || getAvailableMoves(boards[index]).length === 0)

      if (isDraw) {
        setGameOver(true)
      }
    }
  }, [boards, mainBoard, gameOver, gameStarted])

  // Reset the game
  const resetGame = () => {
    setBoards(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null)),
    )
    setMainBoard(Array(9).fill(null))
    setActiveBoard(null)
    setCurrentPlayer("X")
    setGameOver(false)
    setWinner(null)
    setGameStarted(true)
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "easy":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "hard":
        return "text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {!gameStarted ? (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How to Play</h2>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li>• The board consists of 9 smaller tic-tac-toe boards arranged in a 3×3 grid</li>
              <li>• To win, you need to win 3 small boards in a row, column, or diagonal</li>
              <li>• Your move determines which board your opponent must play in next</li>
              <li>• If sent to a board that's already won or full, your opponent can play in any board</li>
            </ul>
          </div>
          <Button size="lg" onClick={resetGame}>
            Start Game
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center mb-2">
            {gameOver ? (
              <Alert variant={winner ? "default" : "destructive"} className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{winner ? `${winner} Wins!` : "It's a Draw!"}</AlertTitle>
                <AlertDescription>
                  {winner ? `Player ${winner} has won the game.` : "The game ended in a draw."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="text-lg font-medium mb-4">
                Current Player: <span className="font-bold">{currentPlayer}</span>
                {activeBoard !== null && <span className="ml-2">(Play in board {activeBoard + 1})</span>}
                {activeBoard === null && <span className="ml-2">(Play in any available board)</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 w-full max-w-md">
            {Array(9)
              .fill(null)
              .map((_, boardIndex) => (
                <div
                  key={boardIndex}
                  className={`relative ${
                    activeBoard === null || activeBoard === boardIndex ? "ring-2 ring-primary" : "opacity-70"
                  } ${mainBoard[boardIndex] ? "pointer-events-none" : ""}`}
                >
                  {mainBoard[boardIndex] && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                      <span
                        className={`text-6xl font-bold ${
                          mainBoard[boardIndex] === "X" ? "text-blue-500" : "text-red-500"
                        }`}
                      >
                        {mainBoard[boardIndex]}
                      </span>
                    </div>
                  )}
                  <Board
                    board={boards[boardIndex]}
                    boardIndex={boardIndex}
                    onCellClick={handleMove}
                    isActive={activeBoard === null || activeBoard === boardIndex}
                    isDisabled={gameOver || currentPlayer !== "X"}
                  />
                </div>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Button onClick={resetGame}>{gameOver ? "Play Again" : "Restart Game"}</Button>

            {!gameOver && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Difficulty:</span>
                <div className="flex gap-1">
                  <Button
                    variant={difficulty === "easy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty("easy")}
                    className="text-xs px-2 py-1 h-8"
                  >
                    Easy
                  </Button>
                  <Button
                    variant={difficulty === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty("medium")}
                    className="text-xs px-2 py-1 h-8"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={difficulty === "hard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficulty("hard")}
                    className="text-xs px-2 py-1 h-8"
                  >
                    Hard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

