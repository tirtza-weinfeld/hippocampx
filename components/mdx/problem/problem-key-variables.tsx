"use client";

import { cn } from "@/lib/utils";

interface ProblemKeyVariablesProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemKeyVariablesHeader({ children, className }: ProblemKeyVariablesProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function ProblemKeyVariablesContent({ children, className, ...props }: ProblemKeyVariablesProps) {

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