'use client';

import React from 'react';
import { MessageSquareCode, Hash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CommentTooltipProps {
  content: string;
  type: 'inline' | 'full-line';
  children: React.ReactNode;
  className?: string;
}

export function CommentTooltip({ content, type, children, className }: CommentTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const isInline = type === 'inline';
  
  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <span 
          className={cn(
            "relative inline-flex items-center gap-1 cursor-help transition-all duration-200",
            isInline ? "ml-2" : "w-full",
            "hover:bg-amber-50/30 dark:hover:bg-amber-900/20",
            "hover:shadow-sm rounded-sm px-1",
            className
          )}
        >
          {children}
          <span 
            className={cn(
              "inline-flex items-center justify-center transition-all duration-200",
              "text-amber-600 dark:text-amber-400",
              "hover:text-amber-700 dark:hover:text-amber-300",
              isInline ? "w-3.5 h-3.5" : "w-4 h-4"
            )}
          >
            {isInline ? (
              <Hash className="w-full h-full" />
            ) : (
              <MessageSquareCode className="w-full h-full" />
            )}
          </span>
        </span>
      </TooltipTrigger>
      
      <TooltipContent 
        side="top" 
        align={isInline ? "end" : "start"}
        className={cn(
          "max-w-sm p-3 bg-gradient-to-br from-amber-50 to-orange-50",
          "dark:from-amber-950/90 dark:to-orange-950/90",
          "border-amber-200 dark:border-amber-800",
          "shadow-lg shadow-amber-100/50 dark:shadow-amber-950/30",
          "backdrop-blur-sm"
        )}
        sideOffset={8}
      >
        <div className="flex items-start gap-2">
          <div className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
            "bg-amber-200 dark:bg-amber-800",
            "text-amber-700 dark:text-amber-300"
          )}>
            {isInline ? (
              <Hash className="w-3 h-3" />
            ) : (
              <MessageSquareCode className="w-3 h-3" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-xs font-medium uppercase tracking-wide mb-1",
              "text-amber-600 dark:text-amber-400"
            )}>
              {isInline ? "Inline Comment" : "Comment"}
            </div>
            
            <div className={cn(
              "text-sm leading-relaxed",
              "text-gray-800 dark:text-gray-200"
            )}>
              {content.startsWith('[') && content.endsWith(']') ? (
                // Special formatting for bracketed comments like [Early Exit]
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                  "bg-amber-100 dark:bg-amber-900/50",
                  "text-amber-800 dark:text-amber-200",
                  "border border-amber-200 dark:border-amber-700"
                )}>
                  {content}
                </span>
              ) : content.includes('---') ? (
                // Special formatting for section dividers
                <span className={cn(
                  "block text-center py-1 px-2 rounded border-l-2",
                  "border-amber-300 dark:border-amber-600",
                  "bg-amber-50/50 dark:bg-amber-900/30",
                  "font-mono text-xs tracking-wide",
                  "text-amber-700 dark:text-amber-300"
                )}>
                  {content}
                </span>
              ) : (
                // Regular comment content
                <span className="break-words">{content}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Subtle accent */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r from-transparent via-amber-300 to-transparent",
          "dark:via-amber-600"
        )} />
      </TooltipContent>
    </Tooltip>
  );
}

export default CommentTooltip;