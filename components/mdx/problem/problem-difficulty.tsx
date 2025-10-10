

"use client";

import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

interface ProblemDifficultyProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemDifficultyHeader({ children, className }: ProblemDifficultyProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-2", className)}>
      <div className="flex-shrink-0 rounded-full p-1 bg-purple-100 dark:bg-purple-900/30">
        <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400">
        {children}
      </div>
    </div>
  )
}

export function ProblemDifficultyContent({ children, className, ...props }: ProblemDifficultyProps) {
  return (
    <div
      {...props}
      className={cn(
    
        className
      )}
      role="region"
      aria-label="Problem difficulty"
    >
      <div >

        <div >
          {children}
        </div>
      </div>
    </div>
  );
}