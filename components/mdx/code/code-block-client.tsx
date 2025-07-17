"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import CopyCode from './copy-code';

type CodeBlockClientProps = {
  code: string;
  highlightedCodeWithTooltips: React.ReactNode;
  totalLines: number;
};

const MAX_LINES_COLLAPSED = 20;

export function CodeBlockClient({ 
  code, 
  highlightedCodeWithTooltips, 
  totalLines 
}: CodeBlockClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const shouldShowToggle = totalLines > MAX_LINES_COLLAPSED;
  
  useEffect(() => {
    if (contentRef.current && shouldShowToggle) {
      // Calculate heights more precisely
      const fullHeight = contentRef.current.scrollHeight;
      const lineHeight = 24; // Approximate line height in pixels
      const collapsed = MAX_LINES_COLLAPSED * lineHeight;
      
      setExpandedHeight(fullHeight);
      setCollapsedHeight(collapsed);
    }
  }, [shouldShowToggle, highlightedCodeWithTooltips]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4">
      <div className="relative">
        <CopyCode className="absolute top-0 right-0 z-20" code={code} />
        
        {/* Toggle button with semantic expand/collapse animations */}
        {shouldShowToggle && (
          <div className="absolute top-0 right-12 z-20 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ 
                    scale: 1.07,
                    // Different hover effects for expand vs collapse
                    ...(isExpanded ? {
                      // Collapse hover: arrows come closer
                      scaleX: 0.7,
                      scaleY: 0.7
                    } : {
                      // Expand hover: arrows spread apart
                      scaleX: 1.05,
                      scaleY: 1.05
                    })
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleExpanded}
                  className="p-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.div
                        key="minimize"
                        initial={{ scale: 1.2, y: -2 }}
                        animate={{ 
                          scale: 1, 
                          y: 0,
                          transition: { 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                          }
                        }}
                        exit={{ 
                          scale: 0.8, 
                          y: 2,
                          transition: { duration: 0.15 }
                        }}
                      >
                        <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="maximize"
                        initial={{ scale: 0.8, y: 2 }}
                        animate={{ 
                          scale: 1, 
                          y: 0,
                          transition: { 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                          }
                        }}
                        exit={{ 
                          scale: 1.2, 
                          y: -2,
                          transition: { duration: 0.15 }
                        }}
                      >
                        <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
          animate={{ 
            height: shouldShowToggle ? (isExpanded ? expandedHeight : collapsedHeight) : "auto"
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1] // Smooth easing curve
          }}
          className="overflow-x-auto py-8 line-numbers"
          style={{
            overflowX: "auto",
            overflowY: shouldShowToggle && !isExpanded ? "auto" : "visible",
            maxHeight: shouldShowToggle && !isExpanded ? `${collapsedHeight}px` : undefined
          }}
        >
          {highlightedCodeWithTooltips}
        </motion.div>
        
        {/* Line count indicator */}
        {/* {shouldShowToggle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
          >
            <motion.span
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isExpanded ? `${totalLines} lines` : `${MAX_LINES_COLLAPSED}/${totalLines} lines`}
            </motion.span>
          </motion.div>
        )} */}
      </div>
    </div>
  );
} 