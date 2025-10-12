import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProblemsStats({
  total,
  totalFiltered,
  easy,
  medium,
  hard,
}: {
  total: number
  totalFiltered: number
  easy: number
  medium: number
  hard: number
}) {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out mb-2',
        'grid grid-cols-4 gap-2'
      )}
    >
      <div
        className={cn(
          'bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <BookOpen className="text-blue-600 h-3 w-3" />
          <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
            {totalFiltered !== total && <span>{totalFiltered}/</span>}
            {total}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Target className="text-emerald-600 h-3 w-3" />
          <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{easy}</span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <Clock className="text-amber-600 h-3 w-3" />
          <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{medium}</span>
        </div>
      </div>

      <div
        className={cn(
          'bg-linear-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900',
          'rounded-lg text-center transition-all duration-300',
          'p-1.5'
        )}
      >
        <div className="flex items-center justify-center gap-1 mb-1">
          <TrendingUp className="text-rose-600 h-3 w-3" />
          <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">{hard}</span>
        </div>
      </div>
    </div>
  )
}
