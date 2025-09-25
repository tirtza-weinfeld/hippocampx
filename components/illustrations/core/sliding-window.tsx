/**
 * Sliding Window Algorithm Illustration
 * Modern SVG animation showing window sliding across array
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function SlidingWindowIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="window-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.68 0.25 285)" />
            <stop offset="100%" stopColor="oklch(0.58 0.2 312)" />
          </linearGradient>
          <filter id="window-blur">
            <feGaussianBlur stdDeviation="0.8" result="blur"/>
            <feOffset in="blur" dx="0" dy="2" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Array elements */}
        {[4, 7, 10, 13, 16, 19, 22, 25, 28].map((x, i) => (
          <rect
            key={i}
            x={x} y="14" width="2.5" height="6" rx="1.25"
            fill="oklch(0.88 0.03 285)"
            stroke="oklch(0.82 0.05 285)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Sliding window with glassmorphism */}
        <motion.rect
          x="7" y="12" width="12" height="10" rx="2"
          fill="url(#window-gradient)"
          fillOpacity="0.2"
          stroke="url(#window-gradient)"
          strokeWidth="2"
          filter="url(#window-blur)"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
          animate={animated ? {
            x: [7, 13, 7],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        />
        
        {/* Window label */}
        <motion.text
          x="13" y="8" 
          fontSize="8" 
          fill="oklch(0.58 0.2 312)"
          fontWeight="bold" 
          textAnchor="middle"
          animate={animated ? {
            x: [13, 19, 13],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        >
          WINDOW
        </motion.text>
        
        {/* Movement indicators */}
        <motion.path
          d="M4 26 L28 26"
          stroke="oklch(0.58 0.2 312)"
          strokeWidth="1"
          strokeDasharray="1,2"
          animate={animated ? {
            strokeDashoffset: [0, -6],
            transition: { duration: 2, repeat: Infinity }
          } : {}}
        />
      </svg>
    </motion.div>
  );
}