/**
 * Stock Trading Problem Illustration (from existing problems-illustrations.tsx)
 * Shows price chart with buy/sell indicators and profit visualization
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function StockTradingIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '100px' }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{
          filter: isHovered ? 'drop-shadow(0 12px 30px rgba(34, 197, 94, 0.4))' : 'drop-shadow(0 6px 15px rgba(34, 197, 94, 0.2))',
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ rotateY: 10, rotateX: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <defs>
          <linearGradient id="stock-chart" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 142)" />
            <stop offset="50%" stopColor="oklch(0.75 0.25 165)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 178)" />
          </linearGradient>
          <linearGradient id="profit-area" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 142)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.7 0.3 142)" stopOpacity="0.1" />
          </linearGradient>
          <filter id="chart-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Chart background with neumorphism */}
        <rect 
          x="2" y="2" width="28" height="28" rx="6"
          fill="oklch(0.96 0.01 145)"
          stroke="oklch(0.9 0.02 145)"
          strokeWidth="0.5"
          style={{
            boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.1)'
          }}
        />
        
        {/* Price line with morphing animation */}
        <motion.path
          d="M4 24 Q8 20 12 18 T20 10 Q24 8 28 12"
          stroke="url(#stock-chart)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#chart-glow)"
          animate={animated ? {
            pathLength: [0, 1],
            opacity: [0, 1]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Profit area */}
        <motion.path
          d="M4 24 Q8 20 12 18 T20 10 Q24 8 28 12 L28 28 L4 28 Z"
          fill="url(#profit-area)"
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? [0, 0.6, 0.4] : 0.4 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Buy/Sell indicators with 3D effect */}
        <motion.g
          animate={animated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <circle cx="8" cy="20" r="3" fill="oklch(0.65 0.3 142)" filter="url(#chart-glow)" />
          <text x="8" y="21" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">BUY</text>
        </motion.g>
        
        <motion.g
          animate={animated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        >
          <circle cx="24" cy="8" r="3" fill="oklch(0.6 0.35 25)" filter="url(#chart-glow)" />
          <text x="24" y="9" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">SELL</text>
        </motion.g>
        
        {/* Profit arrow with advanced morphing */}
        <motion.path
          d="M10 18 Q16 12 22 10"
          stroke="oklch(0.7 0.3 142)"
          strokeWidth="2"
          strokeDasharray="2,2"
          fill="none"
          markerEnd="url(#profit-arrow)"
          animate={animated ? {
            strokeDashoffset: [0, -8],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <defs>
          <marker id="profit-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="oklch(0.7 0.3 142)" />
          </marker>
        </defs>
      </motion.svg>
    </motion.div>
  );
}