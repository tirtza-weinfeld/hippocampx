'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type InlineCodeProps = ComponentPropsWithoutRef<'code'> & { children: ReactNode };

export default function InlineCode({ children }: InlineCodeProps) {
  return (
    <motion.code
      {...fadeIn}
      className="bg-gradient-to-r  from-transparent via-teal-500/20  to-transparent dark:from-teal-800/50 
      dark:to-teal-700/50 text-teal-600 dark:text-teal-400 px-1 py-0.5 rounded-md
      border-b-2 border-teal-500/20 dark:border-b-teal-600/20
      hover:bg-gradient-to-l
      text-sm font-mono "
    >
      {children}
    </motion.code>
  )
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
}