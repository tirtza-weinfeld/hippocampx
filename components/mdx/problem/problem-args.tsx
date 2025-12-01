"use client";

import { cn } from "@/lib/utils";

interface ProblemArgumentsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemArgumentsHeader({ children, className }: ProblemArgumentsProps) {
  return (
    <div className={className}>
    {children}
  </div>
  )
}
export function ProblemArgumentsContent({ children, className, ...props }: ProblemArgumentsProps) {
  return (
    <div
      {...props}
      className={cn(

        className
      )}
      role="region"
      aria-label="Problem args"
    >
      <div className="flex-1 min-w-0">

        <div className={cn(
          "text-sm leading-relaxed ",
       
          "w-full mb-0",


        )}>
          {children}
        </div>
      </div>
    </div>
  );
}