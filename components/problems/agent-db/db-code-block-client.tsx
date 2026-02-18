"use client"

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Maximize2, Minimize2 } from 'lucide-react';
import CopyCode from '@/components/mdx/code/copy-code';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type DbCodeBlockClientProps = {
  code: string;
  highlightedCode: ReactNode;
  tooltipMap: Record<string, ReactNode>;
  totalLines: number;
  className?: string;
};

const MAX_LINES_COLLAPSED = 20;
const LINE_HEIGHT = 24;

const EXPAND_ANIMATION = {
  duration: 0.4,
  ease: [0.4, 0.0, 0.2, 1],
} as const;

const ICON_ANIMATION = {
  duration: 0.2,
  ease: "easeInOut",
} as const;

export function DbCodeBlockClient({
  code,
  highlightedCode,
  tooltipMap,
  totalLines,
  className,
}: DbCodeBlockClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [heights, setHeights] = useState({ collapsed: MAX_LINES_COLLAPSED * LINE_HEIGHT, expanded: MAX_LINES_COLLAPSED * LINE_HEIGHT });
  const [activeQname, setActiveQname] = useState<string | null>(null);
  const anchorRef = useRef<Element | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const shouldShowToggle = totalLines > MAX_LINES_COLLAPSED;

  const contentRef = (node: HTMLDivElement | null) => {
    if (node !== null) {
      setHeights({ collapsed: MAX_LINES_COLLAPSED * LINE_HEIGHT, expanded: node.scrollHeight });
    }
  };

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  const handleClick = (e: React.MouseEvent) => {
    const span = (e.target as Element).closest('[data-tooltip-symbol]');
    if (!span) { setActiveQname(null); return; }
    anchorRef.current = span;
    setActiveQname(span.getAttribute('data-tooltip-symbol'));
  };

  return (
    <div className={cn("my-1 rounded-md bg-gray-100 px-4 py-1 shadow-2xl dark:bg-gray-800", className)}>
      <div className="relative">
        <CopyCode code={code} className="absolute right-2 top-2 z-20" />

        {shouldShowToggle && (
          <div className="absolute right-14 top-2 z-20 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onClick={toggleExpanded}
                  className="cursor-pointer rounded-lg bg-white/80 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-gray-900/80 dark:hover:bg-gray-900/90"
                  aria-label={isExpanded ? "Collapse code" : "Expand code"}
                  aria-expanded={isExpanded}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isExpanded ? (
                      <motion.div
                        key="minimize"
                        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotate: 90 }}
                        transition={shouldReduceMotion ? { duration: 0 } : ICON_ANIMATION}
                      >
                        <Minimize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="maximize"
                        initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0, rotate: -90 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotate: 90 }}
                        transition={shouldReduceMotion ? { duration: 0 } : ICON_ANIMATION}
                      >
                        <Maximize2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isExpanded ? "Collapse code" : "Expand code"}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <motion.div
          ref={contentRef}
          initial={false}
          animate={{ height: shouldShowToggle ? (isExpanded ? heights.expanded : heights.collapsed) : "auto" }}
          transition={shouldReduceMotion ? { duration: 0 } : EXPAND_ANIMATION}
          className="line-numbers relative overflow-x-auto py-8"
          style={{
            overflowX: "auto",
            overflowY: shouldShowToggle && !isExpanded ? "auto" : "visible",
            maxHeight: shouldShowToggle && !isExpanded ? `${heights.collapsed}px` : undefined,
          }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            onClick={handleClick}
          >
            {highlightedCode}
          </motion.div>
        </motion.div>

        {shouldShowToggle && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-800"
          />
        )}
      </div>

      <Popover
        open={activeQname !== null}
        onOpenChange={(open) => { if (!open) setActiveQname(null); }}
      >
        <PopoverAnchor virtualRef={anchorRef as React.RefObject<Element>} />
        <PopoverContent className="max-h-96 w-96 overflow-y-auto rounded-lg border-none p-0">
          <AnimatePresence mode="wait">
            {activeQname && (
              <motion.div
                key={activeQname}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                {tooltipMap[activeQname]}
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
}
