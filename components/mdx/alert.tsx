"use client"; // Required for Framer Motion components

import { AlertCircle, Info, Lightbulb, Notebook, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ICONS = {
  tip: Lightbulb,
  note: Notebook,
  warning: AlertTriangle,
  important: AlertCircle,
  caution: Info,
  example: Notebook,
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
} as const;

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 120,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Alert({ type, children }: { type: keyof typeof ICONS, children: React.ReactNode }) {
  const Icon = ICONS[type];
  const styles = STYLES[type];
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", damping: 15, stiffness: 150 }}
      className={cn(
        "flex items-start gap-4 rounded-xl p-4 m-4",
        "bg-gradient-to-br",
        styles.gradient,
        "border-l-4",
        styles.border,
        "shadow-lg dark:shadow-2xl"
      )}
      role="alert"
    >
      <motion.div
        variants={iconVariants}
        className={cn(
          "flex-shrink-0 rounded-full p-1.5",
          styles.iconBg
        )}
      >
        <Icon className={cn("w-5 h-5", styles.text)} />
      </motion.div>
      
      <motion.div 
        variants={contentVariants}
        className="flex-1 min-w-0 pt-0.5"
      >
        <div className={cn(
          "font-semibold text-sm uppercase tracking-wider mb-1",
          styles.text,
        )}>
          {type}
        </div>
        
        <div className={cn(
          "text-sm leading-relaxed",
          "text-gray-600 dark:text-gray-400",
          "[&_p]:m-0",
          "[&_a]:font-medium",
          `[&_a]:${styles.text} [&_a]:underline [&_a]:underline-offset-2`,
          "[&_code]:bg-black/[0.07] dark:[&_code]:bg-white/[0.07]",
          "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-xs",
          "whitespace-pre-wrap overflow-x-scroll w-full",


        )}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

