"use client";

import { cn } from "@/lib/utils";
import { NotepadText } from "lucide-react";

interface ProblemDefinitionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemDefinitionHeader({ children, className }: ProblemDefinitionProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-shrink-0 rounded-full p-1
      bg-gradient-to-r from-teal-500/20 to-sky-600/20 via-sky-400/20 
      hover:bg-gradient-to-l
      ">
        <NotepadText className="w-4 h-4 text-sky-500 dark:text-sky-800  " />
      </div>
      <div className={cn(
        "uppercase tracking-tight leading-tight font-bold ",
        className,
      )}
      >
        {children}
      </div>
    </div>
  )
}

export function ProblemDefinition({ children, className, ...props }: ProblemDefinitionProps) {
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