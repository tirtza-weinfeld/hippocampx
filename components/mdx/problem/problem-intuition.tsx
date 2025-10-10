"use client";

import { cn } from "@/lib/utils";

interface ProblemIntuitionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemIntuitionHeader({ children, className }: ProblemIntuitionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}


export function ProblemIntuitionContent({ children, className, ...props }: ProblemIntuitionProps) {
  return (
    <div
      {...props}
      className={cn(
        className
      )}
      data-section-type="problem-intuition"
      role="region"
      aria-label="Problem intuition"
    >
      <div className="flex-1 min-w-0">

        <div className={cn(
          
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}