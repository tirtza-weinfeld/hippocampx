"use client";

import { type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useReducedMotion } from "motion/react";

interface SensesAnimationProps {
  children: ReactNode;
}

export function SensesAnimation({ children }: SensesAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-4"
    >
      {children}
    </motion.section>
  );
}

interface SenseItemAnimationProps {
  children: ReactNode;
  index: number;
}

export function SenseItemAnimation({ children, index }: SenseItemAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.25,
        delay: shouldReduceMotion ? 0 : index * 0.05,
      }}
      className="flex gap-4"
    >
      {children}
    </motion.li>
  );
}
