import { cn } from "@/lib/utils";

/**
 * Base badge component for problem cards with clean, modern styling.
 */
export function ProblemCardBadge({ children, className }: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn(
            "inline-flex items-center justify-center",
            "rounded-md px-2.5 py-1",
            "text-xs font-medium",
            "border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-900",
            "transition-colors duration-150",
            className
        )}>
            {children}
        </div>
    )
}

type ComplexityType =
    | "none"
    | "constant"
    | "logarithmic"
    | "linear"
    | "linearithmic"
    | "quadratic"
    | "cubic"
    | "polynomial"
    | "exponential"
    | "factorial"

/**
 * Mapping of time complexity types to their color styles.
 */
const complexityStyles: Record<ComplexityType, string> = {
    none: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    constant: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    logarithmic: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    linear: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
    linearithmic: "border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
    quadratic: "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
    cubic: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    polynomial: "border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
    exponential: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    factorial: "border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300",
}

/**
 * Badge component for displaying time complexity with color-coded styling.
 */
export function ProblemTimeComplexityBadge({ children, className, complexity = "none" }: {
    children: React.ReactNode;
    className?: string;
    complexity?: ComplexityType;
}) {
    return (
        <ProblemCardBadge className={cn(
            complexityStyles[complexity],
            "font-mono font-semibold",
            className
        )}>
            {children}
        </ProblemCardBadge>
    )
}

type DifficultyType = "easy" | "medium" | "hard"

/**
 * Mapping of problem difficulty to color styles.
 */
const difficultyStyles: Record<DifficultyType, string> = {
    easy: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    medium: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    hard: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
}

/**
 * Badge component for displaying LeetCode problem numbers with difficulty-based styling.
 */
export function ProblemCardLeetCodeBadge({ children, className, difficulty }: {
    children: React.ReactNode;
    className?: string;
    difficulty: DifficultyType;
}) {
    return (
        <ProblemCardBadge className={cn(
            difficultyStyles[difficulty],
            "font-semibold",
            className
        )}>
            {children}
        </ProblemCardBadge>
    )
}

/**
 * Badge component for displaying problem difficulty with color-coded styling.
 */
export function ProblemCardDifficultyBadge({ children, className, difficulty }: {
    children: React.ReactNode;
    className?: string;
    difficulty: DifficultyType;
}) {
    return (
        <ProblemCardBadge className={cn(
            difficultyStyles[difficulty],
            "font-semibold capitalize",
            className
        )}>
            {children}
        </ProblemCardBadge>
    )
}
