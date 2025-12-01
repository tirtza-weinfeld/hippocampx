"use client";

import { cn } from "@/lib/utils";

interface ProblemReturnsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemReturnsHeader({ children, className }: ProblemReturnsProps) {
  return (
    <div className={className}>
    {children}
  </div>
  )
}
export function ProblemReturnsContent({ children, className, ...props }: ProblemReturnsProps) {
  return (
    <div
      {...props}
      className={cn(
        className
      )}
      role="region"
      aria-label="Problem returns"
    >
      <div className="flex-1 min-w-0">

        <div className={cn(
          "text-sm leading-relaxed ",
          
          "w-full mb-0"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}