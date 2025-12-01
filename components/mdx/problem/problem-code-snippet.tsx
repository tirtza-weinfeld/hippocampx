"use client";

import { cn } from "@/lib/utils";
// import CodeBlock from "../code/code-block";

interface ProblemCodeSnippetProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemCodeSnippetHeader({ children, className }: ProblemCodeSnippetProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function ProblemCodeSnippetContent({ children, className, ...props }: ProblemCodeSnippetProps) {
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

