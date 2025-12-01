

"use client";

import { cn } from "@/lib/utils";

interface ProblemTopicsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemTopicsHeader({ children, className }: ProblemTopicsProps) {
  return (
     <div className={className}>
      {children}
    </div>
  )
}

export function ProblemTopicsContent({ children, className }: ProblemTopicsProps) {
  return (
    <div
      className={cn(
    
        className
      )}
      role="region"
      aria-label="Problem topics"
    >
  
        <div className={cn(
        
        )}>
          {children}
        </div>
    </div>
  );
}

