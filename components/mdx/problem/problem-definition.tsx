"use client";

import { Em } from "@/components/mdx/typography";

interface ProblemDefinitionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemDefinitionHeader({ children, className }: ProblemDefinitionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function ProblemDefinitionContent({ children, ...props }: ProblemDefinitionProps) {
  return (
    // <div {...props} className={cn(
    //   "mb-3", className,
    //   "[&_p]:text-em-gradient [&_p]:italic"
    // )}>
      <Em {...props}>
      {children}
      </Em>

  );
}