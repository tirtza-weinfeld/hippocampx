"use client";

import { cn } from "@/lib/utils";

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

export function ProblemDefinitionContent({ children, className, ...props }: ProblemDefinitionProps) {
  return (
    <div {...props} className={cn(

      // "border-l-4", "bg-link-gradient",


      "mb-3", className,
      // "[&_p]:bg-red-500",
      "[&_p]:text-em-gradient [&_p]:italic"
    )}>
      {/* <Em {...props}> */}
      {children}
      {/* </Em> */}

    </div>
  );
}