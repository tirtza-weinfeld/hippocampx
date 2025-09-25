"use client";

import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

interface ProblemSectionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemSectionHeader({ children, className }: ProblemSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex  items-center gap-2 mb-2">
        <div className="flex-shrink-0 rounded-full p-1 bg-alert-intuition/10">
          <Lightbulb className="w-4 h-4 text-section-header" />
        </div>
        <div className="font-semibold text-sm uppercase tracking-wider text-section-header">
          {children}
        </div>

      </div>
      {/* <div className="w-full h-0.5 bg-linear-to-r from-teal-500 via-blue-500 to-bg-red-500 my-2" /> */}

      

    </div>
  )
}
export function ProblemSection({ children, className, ...props }: ProblemSectionProps) {
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