"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface ProblemIntuitionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemIntuitionHeader({ children, className }: ProblemIntuitionProps) {
  return (
      <div className={cn("flex items-center gap-2 mb-2", className)}>
        <div className="flex-shrink-0 rounded-full p-1 bg-alert-intuition/10 ">
          <Lightbulb className="w-4 h-4 text-alert-intuition" />
        </div>
        <div className="uppercase  text-link-gradient  font-bold ">
        {/* text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6 max-w-none */}
       {children}
        </div>
      </div>
  )
}


export function ProblemIntuition({ children, className, ...props }: ProblemIntuitionProps) {
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