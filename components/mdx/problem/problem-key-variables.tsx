"use client";

import { cn } from "@/lib/utils";
import { Variable } from "lucide-react";

interface ProblemKeyVariablesProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemKeyVariablesHeader({ children, className }: ProblemKeyVariablesProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-2", className)}>
      <div className="flex-shrink-0 rounded-full p-1 bg-emerald-100 dark:bg-emerald-900/30">
        <Variable className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        {children}
      </div>
    </div>
  )
}

export function ProblemKeyVariables({ children, className, ...props }: ProblemKeyVariablesProps) {

  return (
    <div
      {...props}
      className={cn(
        className
      )}
      role="region"
      aria-label="Problem key variables"
    >
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-sm leading-relaxed text-gray-600 dark:text-gray-400",
          "w-full mb-0",
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}