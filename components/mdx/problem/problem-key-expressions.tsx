"use client";

import { cn } from "@/lib/utils";
import { Braces } from "lucide-react";

interface ProblemKeyExpressionsProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemKeyExpressionsHeader({ children, className }: ProblemKeyExpressionsProps) {
  return (
  <div className={cn("flex flex-col gap-2", className)}>
    <div className="flex  items-center gap-2 mb-2">
      <div className="flex-shrink-0 rounded-full p-1 bg-alert-keyexpressions/10">
        <Braces className="w-4 h-4 text-alert-keyexpressions" />
      </div>
      <div className="font-semibold text-sm uppercase tracking-wider ">
        {children}
      </div>

    </div>
    <div className="w-full h-1 bg-linear-to-r from-amber-500 via-sky-300 to-orange-200/80   opacity-50" />

    

  </div>
)
}

export function ProblemKeyExpressions({ children, className, ...props }: ProblemKeyExpressionsProps) {
  return (
    <div
      {...props}
      className={cn(
      
        className
      )}
      role="region"
      aria-label="Problem key expressions"
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