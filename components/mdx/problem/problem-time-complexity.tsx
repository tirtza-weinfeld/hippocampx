
"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ProblemTimeComplexityProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemTimeComplexityHeader({ children, className }: ProblemTimeComplexityProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-2", className)}>
      <div className="flex-shrink-0 rounded-full p-1 bg-alert-timecomplexity/10">
        <Clock className="w-4 h-4 text-alert-timecomplexity" />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider text-alert-timecomplexity">
        {children}
      </div>
    </div>
  )
}

export function ProblemTimeComplexity({ children, className, ...props }: ProblemTimeComplexityProps) {
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
        {/* <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0 rounded-full p-1 bg-alert-timecomplexity/10">
            <Clock className="w-4 h-4 text-alert-timecomplexity" />
          </div>
          <div className="font-semibold text-sm uppercase tracking-wider text-alert-timecomplexity">
            Time Complexity
          </div>
        </div> */}
        <div  className="">
          {children}
        </div>
      </div>
    </div>
  );
}