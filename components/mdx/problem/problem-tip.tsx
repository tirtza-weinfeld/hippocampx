"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface ProblemTipProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemTipHeader({ children, className }: ProblemTipProps) {
  return (
    <div className={className}>
    {children}
  </div>
  )
}
export function ProblemTipContent({ children, className, ...props }: ProblemTipProps) {
  return (
    <div
      {...props}
      className={cn(

        className
      )}
      role="region"
      aria-label="Problem section"
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