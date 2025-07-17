"use client"; // Required for Framer Motion components

import { AlertCircle, Info, Lightbulb, Notebook, AlertTriangle, ChevronDown, Clock, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

const ICONS = {
  tip: Lightbulb,
  note: Notebook,
  warning: AlertTriangle,
  important: AlertCircle,
  caution: Info,
  example: Notebook,
  comment: Notebook,
  deepdive: Notebook,
  definition: Notebook,
  timecomplexity: Clock,
  complexity: Clock,
  spacecomplexity: Database,
  insight: Lightbulb,
} as const;

const LABELS = {
  complexity: "Complexity",
  tip: "Tip",
  note: "Note",
  warning: "Warning",
  important: "Important",
  caution: "Caution",
  example: "Example",
  comment: "Comment",
  deepdive: "Deep Dive",
  definition: "Definition",
  timecomplexity: "Time Complexity",
  spacecomplexity: "Space Complexity",
  insight: "Insight",
} as const; // static mapping of types to labels

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
    gradient: "from-white to-alert-note/10 dark:from-gray-900 dark:to-alert-note/20",
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
    gradient: "from-white to-alert-note/20 dark:from-gray-900 dark:to-alert-note/20",
    border: "border-alert-note",
    text: "text-alert-note",
    iconBg: "bg-alert-note/10",
  },
  // comment: {
  //   gradient: "from-white to-alert-comment/20 dark:from-gray-900 dark:to-alert-comment/20",
  //   border: "border-alert-comment",
  //   text: "text-alert-comment",
  //   iconBg: "bg-alert-comment/10",
  // },
  deepdive: {
    gradient: "from-white to-alert-deepdive/20 dark:from-gray-900 dark:to-alert-deepdive/20",
    border: "border-alert-deepdive",
    text: "text-alert-deepdive",
    iconBg: "bg-alert-deepdive/10",
  },
  definition: {
    // gradient: "from-white to-alert-definition/20 dark:from-gray-900 dark:to-alert-definition/20",
    gradient: "from-white to-alert-definition/10 dark:from-gray-900 dark:to-alert-definition/20",
    border: "border-alert-definition",
    text: "text-alert-definition",
    iconBg: "bg-alert-definition/10",
  },
  timecomplexity : {
    gradient: "from-white to-alert-timecomplexity/20 dark:from-gray-900 dark:to-alert-timecomplexity/20",
    border: "border-alert-timecomplexity",
    text: "text-alert-timecomplexity",
    iconBg: "bg-alert-timecomplexity/10",
  },
  spacecomplexity: {
    gradient: "from-white to-alert-spacecomplexity/20 dark:from-gray-900 dark:to-alert-spacecomplexity/20",
    border: "border-alert-spacecomplexity",
    text: "text-alert-spacecomplexity",
    iconBg: "bg-alert-spacecomplexity/10",
  },
  complexity: {
    gradient: "from-white to-alert-complexity/20 dark:from-gray-900 dark:to-alert-complexity/20",
    border: "border-alert-complexity",
    text: "text-alert-complexity",
    iconBg: "bg-alert-complexity/10",
  },
  insight: {
    gradient: "from-white to-alert-insight/20 dark:from-gray-900 dark:to-alert-insight/20",
    border: "border-alert-insight",
    text: "text-alert-insight",
    iconBg: "bg-alert-insight/10",
  },

} as const;

type AlertProps = {
  type: keyof typeof ICONS;
  children: React.ReactNode;
  collapse?: boolean;
  summary?: string;
  details?: string;
};

// Helper function to split React children into summary and details
const splitReactChildren = (children: React.ReactNode): { summary: React.ReactNode; details: React.ReactNode } => {
  if (typeof children === 'string') {
    const lines = children.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) {
      return { summary: '', details: '' };
    }

    // First line is summary, rest are details
    const summary = lines[0];
    const details = lines.slice(1).join('\n').trim();

    return {
      summary,
      details
    };
  }

  if (Array.isArray(children)) {
    if (children.length === 0) {
      return { summary: null, details: null };
    }

    // First element is summary, rest are details
    const summary = children[0];
    const details = children.slice(1);

    return {
      summary,
      details
    };
  }

  // For single React element, treat as details
  return {
    summary: null,
    details: children
  };
};

export default function Alert({ type, children, collapse = false }: AlertProps) {
  const Icon = ICONS[type] || Notebook;
  const styles = STYLES[type] || STYLES.example;

  const [expanded, setExpanded] = useState(false);

  // Split children into summary and details
  const { summary, details } = splitReactChildren(children);

  // For collapse mode, we need a summary to show
  const hasSummary = summary && (typeof summary === 'string' ? summary.length > 0 : true);
  const hasDetails = details && (typeof details === 'string' ? details.length > 0 : true);

  if (collapse && hasSummary) {
    return (
      <motion.div
        initial={false}
        className={cn(
          styles.gradient,
          styles.border,
          "shadow-lg dark:shadow-2xl",
          "rounded-md",
          "border-l-2",
          "bg-linear-to-br",
          "my-2 p-0",


        )}
        role="region"
        aria-label={`Expandable ${type} alert`}
      >
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            "flex items-center gap-3 px-3 pt-3  w-full text-left cursor-pointer",
            "rounded-none ",
            "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors",
            expanded && "border-b-1 border-opacity-10",
          )}
          aria-expanded={expanded}
        >
          <div className="flex-1 min-w-0">
            <div className={cn(
              "flex items-center gap-2 mb-0.5",
            )}>
              <div className={cn("flex-shrink-0 rounded-full p-1", styles.iconBg)}>
                <Icon className={cn("w-3.5 h-3.5", styles.text)} />
              </div>
              <div className={cn(
                "font-semibold text-xs uppercase tracking-wider",
                styles.text,
              )}>
                {LABELS[type]}
              </div>
            </div>

            <div className={cn(
              "text-xs leading-tight text-gray-600 dark:text-gray-400 mb-0 "
            )}>
              {summary}
            </div>
          </div>
          <motion.div
            animate={{
              rotate: expanded ? 180 : 0,
              scale: expanded ? 1.1 : 1
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
              scale: { duration: 0.15 }
            }}
            className={cn(
              "flex-shrink-0 rounded-full p-1",
              "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]",
              "transition-colors duration-200",
            )}
          >
            <ChevronDown className={cn("w-4 h-4", styles.text)} />
          </motion.div>
        </button>

        <AnimatePresence>
          {expanded && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                opacity: { duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }
              }}
              style={{ overflow: 'hidden' }}
            >
              <div
                className={cn(
                  "px-3 pb-3 pt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400",
                  "[&_p]:m-0 [&_a]:font-medium",
                  // `[&_a]:${styles.text} [&_a]:underline [&_a]:underline-offset-2`,
                  "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
                  "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
                  "whitespace-pre-wrap w-full bg-transparent mb-0"
                )}
              >
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Non-collapse: show all content
  return (
    <div
      className={cn(

        "flex items-start gap-4",
        "rounded-md bg-linear-to-br",
        "p-4",
        styles.gradient,
        // "border-l-4",
        styles.border,
        "shadow-sm ",
        "mb-3"
      )}
      role="alert"
    >
      <div className="flex-1 min-w-0">
        <div className={cn(
          "flex items-center gap-2 mb-0.5",
        )}>
          {type != "note" && <>
          <div className={cn("flex-shrink-0 rounded-full p-1", styles.iconBg)}>
            <Icon className={cn("w-4 h-4", styles.text)} />
          </div>
          <div className={cn(
            "font-semibold text-sm uppercase tracking-wider",
            styles.text,
          )}>
            { `${type === "comment" ? "Note" : LABELS[type]}`}
          </div></>}

          {/* <div className={cn(
            "pb-0  place-self-center ",
          )}>
            {summary}
          </div> */}
        </div>
        <div className={cn(
          "text-sm leading-relaxed text-gray-600 dark:text-gray-400",
          "[&_p]:m-0 [&_a]:font-medium",
          // `[&_a]:${styles.text} [&_a]:underline [&_a]:underline-offset-2`,
          "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
          "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
          // "[&_p]:whitespace-pre-wrap ",
          styles.text,

          "w-full mb-0",
        )}>
          <div className="flex flex-col gap-2">
            <div className="">{summary}</div>
            <div className={cn(
              // `[&_p]:${styles.text}`,
              // `[&_p]:text-red-500`,

            )}>
              {details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


