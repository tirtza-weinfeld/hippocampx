/**
 * Prefix Sum Algorithm Illustration
 * Shows cumulative sum visualization with animated bars
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function PrefixSumIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const originalArray = [2, 4, 1, 5, 3];
  const prefixSums = [2, 6, 7, 12, 15];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="prefix-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.28 142)" />
            <stop offset="100%" stopColor="oklch(0.75 0.32 165)" />
          </linearGradient>
          <linearGradient id="original-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.75 0.15 258)" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 285)" />
          </linearGradient>
          <filter id="prefix-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Original array bars */}
        {originalArray.map((value, i) => (
          <motion.rect
            key={`orig-${i}`}
            x={4 + i * 4.8} 
            y={24 - value * 2} 
            width="3" 
            height={value * 2}
            rx="1.5"
            fill="url(#original-gradient)"
            opacity="0.6"
            initial={{ height: 0, y: 24 }}
            animate={{ height: value * 2, y: 24 - value * 2 }}
            transition={{ delay: i * 0.2, type: "spring", stiffness: 300 }}
          />
        ))}
        
        {/* Prefix sum bars with staggered animation */}
        {prefixSums.map((sum, i) => (
          <motion.rect
            key={`prefix-${i}`}
            x={4 + i * 4.8} 
            y={24 - sum * 0.8} 
            width="3" 
            height={sum * 0.8}
            rx="1.5"
            fill="url(#prefix-gradient)"
            filter="url(#prefix-glow)"
            initial={{ height: 0, y: 24 }}
            animate={animated ? {
              height: [0, sum * 0.8],
              y: [24, 24 - sum * 0.8],
              scale: [1, 1.05]
            } : { height: sum * 0.8, y: 24 - sum * 0.8 }}
            transition={{ 
              delay: 0.5 + i * 0.3, 
              duration: 0.8,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          />
        ))}
        
        {/* Addition symbols between elements */}
        {prefixSums.slice(0, -1).map((_, i) => (
          <motion.text
            key={`plus-${i}`}
            x={7 + i * 4.8}
            y="8"
            fontSize="8"
            fill="oklch(0.65 0.28 142)"
            fontWeight="bold"
            textAnchor="middle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.3 }}
          >
            +
          </motion.text>
        ))}
        
        {/* Values shown above bars */}
        {prefixSums.map((sum, i) => (
          <motion.text
            key={`val-${i}`}
            x={5.5 + i * 4.8}
            y={24 - sum * 0.8 - 2}
            fontSize="5"
            fill="oklch(0.65 0.28 142)"
            fontWeight="bold"
            textAnchor="middle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 24 - sum * 0.8 - 2 }}
            transition={{ delay: 0.8 + i * 0.3 }}
          >
            {sum}
          </motion.text>
        ))}
        
        {/* Cumulative flow arrows */}
        <motion.path
          d="M7.5 15 L11 15"
          stroke="oklch(0.65 0.28 142)"
          strokeWidth="1.5"
          markerEnd="url(#sum-arrow)"
          animate={animated ? {
            opacity: [0, 1, 0],
            pathLength: [0, 1, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        
        {/* Sum symbol */}
        <text x="2" y="6" fontSize="10" fill="oklch(0.65 0.28 142)" fontWeight="bold">Σ</text>
        
        {/* Labels */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.5 0.1 258)" textAnchor="middle">PREFIX SUMS</text>
        
        <defs>
          <marker id="sum-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.65 0.28 142)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}