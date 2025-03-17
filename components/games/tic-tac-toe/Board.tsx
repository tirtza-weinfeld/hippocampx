import { Cell } from "@/components/games/tic-tac-toe/Cell"

interface BoardProps {
  board: (string | null)[]
  boardIndex: number
  onCellClick: (boardIndex: number, cellIndex: number) => void
  isActive: boolean
  isDisabled: boolean
}

export default function Board({ board, boardIndex, onCellClick, isActive, isDisabled }: BoardProps) {
  return (
    <div className={`grid grid-cols-3 gap-1 p-2 bg-muted/30 rounded-md ${isActive ? "bg-muted/50" : ""}`}>
      {board.map((cell, cellIndex) => (
        <Cell
          key={cellIndex}
          value={cell}
          onClick={() => onCellClick(boardIndex, cellIndex)}
          disabled={isDisabled || !isActive || cell !== null}
        />
      ))}
    </div>
  )
}

