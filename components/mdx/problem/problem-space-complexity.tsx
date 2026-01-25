
"use client";

import { cn } from "@/lib/utils";

interface ProblemSpaceComplexityProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemSpaceComplexityHeader({ children, className }: ProblemSpaceComplexityProps ) {
  return (
    <div className={className}>
    {children}
  </div>
  )
}

export function ProblemSpaceComplexityContent({ children, className, ...props }: ProblemSpaceComplexityProps) {
  return (
    <div
      {...props}
      className={cn(
        
        className
      )}
      role="region"
      aria-label="Problem space complexity"
    >
      <div >
      
        <div  className="">
          {children}
        </div>
      </div>
    </div>
  );
}