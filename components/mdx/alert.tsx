"use client"; // Required for Framer Motion components

import { AlertCircle, Info, Lightbulb, Notebook, AlertTriangle, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useRef, useLayoutEffect } from "react";

const ICONS = {
  tip: Lightbulb,
  note: Notebook,
  warning: AlertTriangle,
  important: AlertCircle,
  caution: Info,
  example: Notebook,
  comment: MessageCircle,
  deepdive: Notebook,
} as const;

// Statically mapping types to full class names ensures Tailwind's JIT compiler
// can find and generate these classes. This is the correct approach.
const STYLES = {
  tip: {
    gradient: "from-white to-alert-tip/20 dark:from-gray-900 dark:to-alert-tip/20",
    border: "border-alert-tip",
    text: "text-alert-tip",
    iconBg: "bg-alert-tip/10",
  },
  note: {
    gradient: "from-white to-alert-note/20 dark:from-gray-900 dark:to-alert-note/20",
    border: "border-alert-note",
    text: "text-alert-note",
    iconBg: "bg-alert-note/10",
  },
  warning: {
    gradient: "from-white to-alert-warning/20 dark:from-gray-900 dark:to-alert-warning/20",
    border: "border-alert-warning",
    text: "text-alert-warning",
    iconBg: "bg-alert-warning/10",
  },
  important: {
    gradient: "from-white to-alert-important/20 dark:from-gray-900 dark:to-alert-important/20",
    border: "border-alert-important",
    text: "text-alert-important",
    iconBg: "bg-alert-important/10",
  },
  caution: {
    gradient: "from-white to-alert-caution/20 dark:from-gray-900 dark:to-alert-caution/20",
    border: "border-alert-caution",
    text: "text-alert-caution",
    iconBg: "bg-alert-caution/10",
  },
  example: {
    gradient: "from-white to-alert-example/20 dark:from-gray-900 dark:to-alert-example/20",
    border: "border-alert-example",
    text: "text-alert-example",
    iconBg: "bg-alert-example/10",
  },
  comment: {
    gradient: "from-white to-alert-comment/20 dark:from-gray-900 dark:to-alert-comment/20",
    border: "border-alert-comment",
    text: "text-alert-comment",
    iconBg: "bg-alert-comment/10",
  },
  deepdive: {
    gradient: "from-white to-alert-example/20 dark:from-gray-900 dark:to-alert-example/20",
    border: "border-alert-example",
    text: "text-alert-example",
    iconBg: "bg-alert-example/10",
  },
} as const;

type AlertProps = {
  type: keyof typeof ICONS;
  children: React.ReactNode;
  collapsible?: boolean;
  summary?: string;
  details?: string;
};

export default function Alert({ type, children, collapsible = false }: AlertProps) {
  const Icon = ICONS[type] || Notebook;
  const styles = STYLES[type] || STYLES.example;

  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, expanded]);

  // Extract content as string from children
  const getContentString = (): string => {
    if (typeof children === 'string') {
      return children;
    }
    if (children && typeof children === 'object' && 'props' in children && children.props && typeof children.props === 'object' && 'children' in children.props) {
      return String(children.props.children || '');
    }
    return '';
  };

  const content = getContentString();

  // Parse content: lines with brackets [] are summary, rest are details
  const parseContent = (text: string): { summary: string; details: string } => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const summaryLines: string[] = [];
    const detailsLines: string[] = [];
    
    for (const line of lines) {
      // Check if line contains brackets (summary)
      if (/\[.*\]/.test(line)) {
        // Remove all [ ... ] patterns from the summary line
        summaryLines.push(line.replace(/\[.*?\]/g, '').trim());
      } else {
        detailsLines.push(line);
      }
    }
    
    return {
      summary: summaryLines.join(' ').trim(),
      details: detailsLines.join('\n').trim()
    };
  };

  const { summary, details } = parseContent(content);

  // For debugging
  // console.log('Parsed content:', { summary, details, originalContent: content });

  if (collapsible) {
    return (
      <motion.div
        initial={false}
        animate={{ height: 'auto' }}
        transition={{ type: "spring", damping: 15, stiffness: 150 }}
        className={cn(
          styles.gradient,
          styles.border,
          "shadow-lg dark:shadow-2xl",
          "rounded-md",
          "border-l-2",
          "bg-gradient-to-br",
        )}
        role="region"
        aria-label={`Expandable ${type} alert`}
      >
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            "flex items-center gap-4 p-4 w-full text-left cursor-pointer",
            "rounded-none border-b-1 border-opacity-10",
          )}
          aria-expanded={expanded}
        >
          <div className={cn("flex-shrink-0 rounded-full p-1.5", styles.iconBg)}>
            <Icon className={cn("w-5 h-5", styles.text)} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className={cn(
              "font-semibold text-sm uppercase tracking-wider mb-1",
              styles.text,
            )}>
              {type}
            </div>
            <div className={cn(
              "text-sm leading-relaxed text-gray-600 dark:text-gray-400"
            )}>
              {summary}
            </div>
          </div>
          <span
            style={{ transition: 'transform 0.3s' }}
            className={cn("transition-transform duration-200", expanded ? 'rotate-180' : '')}
          >
            <ChevronDown className={cn("w-4 h-4", styles.text)} />
          </span>
        </button>
        {details && (
          <motion.div
            initial={false}
            animate={{ height: expanded ? contentHeight : 0, opacity: expanded ? 1 : 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
              opacity: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }
            }}
            style={{ overflow: 'hidden' }}
          >
            <div
              ref={contentRef}
              className={cn(
                "p-4 pt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400",
                "[&_p]:m-0 [&_a]:font-medium",
                `[&_a]:${styles.text} [&_a]:underline [&_a]:underline-offset-2`,
                "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
                "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
                "whitespace-pre-wrap overflow-x-scroll w-full bg-transparent"
              )}
            >
              {details}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Non-collapsible: show all content
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl p-4 m-4 bg-gradient-to-br",
        styles.gradient,
        "border-l-4",
        styles.border,
        "shadow-lg dark:shadow-2xl"
      )}
      role="alert"
    >
      <div className={cn("flex-shrink-0 rounded-full p-1.5", styles.iconBg)}>
        <Icon className={cn("w-5 h-5", styles.text)} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className={cn(
          "font-semibold text-sm uppercase tracking-wider mb-1",
          styles.text,
        )}>
          {type}
        </div>
        <div className={cn(
          "text-sm leading-relaxed text-gray-600 dark:text-gray-400",
          "[&_p]:m-0 [&_a]:font-medium",
          `[&_a]:${styles.text} [&_a]:underline [&_a]:underline-offset-2`,
          "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
          "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
          "whitespace-pre-wrap overflow-x-scroll w-full"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}


