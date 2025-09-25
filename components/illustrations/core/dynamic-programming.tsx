/**
 * Dynamic Programming Algorithm Illustration
 * Shows DP table with optimal substructure and memoization
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';


export function DynamicProgrammingIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="dp-table" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 65)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 92)" />
          </linearGradient>
          <radialGradient id="dp-cell" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.1 65)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 92)" />
          </radialGradient>
          <filter id="dp-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* DP Table Grid */}
        {[0, 1, 2, 3, 4].map(row => 
          [0, 1, 2, 3, 4].map(col => (
            <motion.rect
              key={`${row}-${col}`}
              x={4 + col * 5} y={4 + row * 5} 
              width="4.5" height="4.5" 
              rx="1"
              fill={row <= col ? "url(#dp-cell)" : "oklch(0.92 0.02 65)"}
              stroke="oklch(0.8 0.1 65)"
              strokeWidth="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                fill: animated && row + col < 6 ? 
                  ["oklch(0.92 0.02 65)", "url(#dp-cell)", "oklch(0.92 0.02 65)"] :
                  row <= col ? "url(#dp-cell)" : "oklch(0.92 0.02 65)"
              }}
              transition={{ 
                delay: (row + col) * 0.1,
                scale: { type: "spring", stiffness: 400, damping: 25 },
                fill: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))
        )}
        
        {/* Arrows showing dependency */}
        <motion.path
          d="M8 12 L12 8"
          stroke="url(#dp-table)"
          strokeWidth="1.5"
          markerEnd="url(#dp-arrow)"
          animate={animated ? {
            opacity: [0, 1, 0],
            pathLength: [0, 1, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.path
          d="M12 12 L16 8"
          stroke="url(#dp-table)"
          strokeWidth="1.5"
          markerEnd="url(#dp-arrow)"
          animate={animated ? {
            opacity: [0, 1, 0],
            pathLength: [0, 1, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        
        {/* Memoization indicator */}
        <rect x="26" y="2" width="4" height="14" rx="2" fill="oklch(0.95 0.02 65)" stroke="oklch(0.8 0.1 65)" strokeWidth="0.5" />
        <text x="28" y="5" fontSize="4" fill="oklch(0.6 0.25 65)" fontWeight="bold" textAnchor="middle">MEMO</text>
        
        {/* Computed values */}
        {[1, 1, 2, 3, 5].map((val, i) => (
          <text key={i} x="28" y={7 + i * 2} fontSize="3" fill="oklch(0.6 0.3 92)" fontWeight="bold" textAnchor="middle">
            {val}
          </text>
        ))}
        
        {/* DP label */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.6 0.3 92)" fontWeight="bold" textAnchor="middle">
          DYNAMIC PROGRAMMING
        </text>
        
        <defs>
          <marker id="dp-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.3 92)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}