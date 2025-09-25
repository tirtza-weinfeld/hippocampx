import { cn } from '@/lib/utils'

interface DifficultyBadgeProps {
  difficulty: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs'
}

const difficultyStyles = {
  easy: ' from-green-400/80 to-emerald-500/80  shadow-lg shadow-green-500/25',
  medium: ' from-yellow-400/80 to-orange-500/80  shadow-lg shadow-orange-500/25', 
  hard: ' from-red-400/80 via-red-500/80 to-pink-500/80  shadow-lg shadow-red-500/25'
} as const

export function DifficultyBadge({ difficulty, className, size = 'sm' }: DifficultyBadgeProps) {
  const normalizedDifficulty = difficulty.toLowerCase() as keyof typeof difficultyStyles
  const style = difficultyStyles[normalizedDifficulty] || difficultyStyles.medium

  return (
    <span 
      className={cn(
        'absolute top-0 right-0 flex items-center rounded-full font-semibold uppercase ',
        'transform translate-x-2 -translate-y-1',
        "bg-linear-to-r",
        style,
        "hover:bg-linear-to-l",
        className,
        size === 'xs' && "p-0.5",
        size === 'sm' && "px-2 py-1",
        size === 'md' && "px-3 py-1.5 tracking-wide",
        size === 'lg' && "px-4 py-2 tracking-wide",
        size === 'xl' && "px-5 py-2.5 tracking-wide"

      )}
    >
      <span className={cn("text-white ",
       size === 'xs' && "text-xs", 
       size === 'sm' && "text-sm",
       size === 'md' && "text-md",
       size === 'lg' && "text-lg",
       size === 'xl' && "text-xl"
       )}>{difficulty}</span>
    </span>
  )
}