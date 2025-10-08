"use client"

import React from 'react';
// import { Activity } from "react";
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useCodeTabs } from './code-tabs-context'

type CodeTabProps = {
  file: string
  children: React.ReactNode
  className?: string
}
export function CodeTab({ file, children, className }: CodeTabProps) {
  const { activeFile } = useCodeTabs()
  const isActive = activeFile === file
  const shouldReduceMotion = useReducedMotion()

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1] as const
      }

  return (
    // <Activity mode={isActive ? "visible" : "hidden"}>
    isActive && (
      <motion.div
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          zIndex: isActive ? 1 : 0
        }}
        transition={transition}
        className={cn(
          'w-full',
          isActive ? 'relative' : 'absolute top-0 left-0 pointer-events-none',
          className
        )}
        aria-hidden={!isActive}
      >
        {children}
      </motion.div>
    // </Activity>
  ))
}

