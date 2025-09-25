"use client";

import { cn } from "@/lib/utils";
import { Code } from "lucide-react";
// import CodeBlock from "../code/code-block";

interface ProblemCodeSnippetProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemCodeSnippetHeader({ children, className }: ProblemCodeSnippetProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-2", className)}>
      <div className="flex-shrink-0 rounded-full p-1 bg-slate-100 dark:bg-slate-900/30">
        <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  )
}

export function ProblemCodeSnippet({ children, className, ...props }: ProblemCodeSnippetProps) {
  return (
    <div
      {...props}
      className={cn(

        className
      )}
      role="region"
      aria-label="Problem code snippet"
    >
 
          {children}
    </div>
  );
}

