

"use client";

import { cn } from "@/lib/utils";
import { Tags } from "lucide-react";

interface ProblemTopicsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemTopicsHeader({ children, className }: ProblemTopicsProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-2 ", className)}>
      <div className="flex-shrink-0 rounded-full p-1 bg-blue-100 dark:bg-blue-900/30 ">
        <Tags className="w-4 h-4 text-blue-600 dark:text-blue-400 " />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400">
        {children}
      </div>
    </div>
  )
}

export function ProblemTopics({ children, className }: ProblemTopicsProps) {
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

