
"use client";

import { cn } from "@/lib/utils";

interface ProblemTimeComplexityProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemTimeComplexityHeader({ children, className }: ProblemTimeComplexityProps) {
  return (
    <div className={className}>
    {children}
  </div>
  )
}

export function ProblemTimeComplexityContent({ children, className, ...props }: ProblemTimeComplexityProps) {
  return (
    <div
      {...props}
      className={cn(
        
        className
      )}
      role="region"
      aria-label="Problem time complexity"
    >
      <div >
      
        <div  className="">
          {children}
        </div>
      </div>
    </div>
  );
}