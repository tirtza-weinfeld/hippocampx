interface CellProps {
    value: string | null
    onClick: () => void
    disabled: boolean
  }
  
  export function Cell({ value, onClick, disabled }: CellProps) {
    return (
      <button
        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg font-bold rounded-sm
          ${disabled ? "cursor-not-allowed" : "hover:bg-muted/80 cursor-pointer"}
          ${value ? "bg-muted" : "bg-background"}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={value === "X" ? "text-blue-500" : value === "O" ? "text-red-500" : ""}>{value}</span>
      </button>
    )
  }
  
  