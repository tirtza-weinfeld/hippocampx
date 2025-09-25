"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";


interface ProblemReturnsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemReturnsHeader({ children, className }: ProblemReturnsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex  items-center gap-2 mb-2">
        <div className="flex-shrink-0 rounded-full p-1 bg-alert-intuition/10">
          <Lightbulb className="w-4 h-4 text-alert-intuition" />
        </div>
        <div className="font-semibold text-sm uppercase tracking-wider text-alert-intuition">
          {children}
        </div>

      </div>

      

    </div>
  )
}
export function ProblemReturns({ children, className, ...props }: ProblemReturnsProps) {
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