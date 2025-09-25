/**
 * Pascal's Triangle Illustration
 * Shows triangle with binomial coefficients and generation pattern
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function PascalsTriangleIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const triangle = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1]
  ];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="pascal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 270)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 300)" />
          </linearGradient>
          <radialGradient id="pascal-node" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="oklch(0.8 0.15 270)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 300)" />
          </radialGradient>
          <filter id="pascal-glow">
            <feGaussianBlur stdDeviation="0.8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Triangle values */}
        {triangle.map((row, rowIndex) => 
          row.map((value, colIndex) => {
            const x = 16 + (colIndex - row.length / 2 + 0.5) * 4;
            const y = 4 + rowIndex * 5;
            
            return (
              <motion.g key={`${rowIndex}-${colIndex}`}>
                <motion.circle
                  cx={x} 
                  cy={y} 
                  r="1.8"
                  fill="url(#pascal-node)"
                  filter="url(#pascal-glow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: (rowIndex + colIndex) * 0.15,
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                />
                <motion.text 
                  x={x} 
                  y={y + 0.5} 
                  fontSize="5" 
                  fill="white" 
                  fontWeight="bold" 
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (rowIndex + colIndex) * 0.15 + 0.5 }}
                >
                  {value}
                </motion.text>
                
                {/* Connection lines to parents */}
                {rowIndex > 0 && colIndex > 0 && (
                  <motion.path
                    d={`M${x} ${y - 1.8} L${16 + (colIndex - 1 - (row.length - 1) / 2 + 0.5) * 4} ${y - 3.2}`}
                    stroke="oklch(0.7 0.15 270)"
                    strokeWidth="1"
                    opacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ delay: rowIndex * 0.3, duration: 0.5 }}
                  />
                )}
                {rowIndex > 0 && colIndex < row.length - 1 && (
                  <motion.path
                    d={`M${x} ${y - 1.8} L${16 + (colIndex + 1 - (row.length - 1) / 2 + 0.5) * 4} ${y - 3.2}`}
                    stroke="oklch(0.7 0.15 270)"
                    strokeWidth="1"
                    opacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ delay: rowIndex * 0.3, duration: 0.5 }}
                  />
                )}
              </motion.g>
            );
          })
        )}
        
        {/* Formula visualization */}
        <motion.path
          d="M8 15 Q12 13 16 15 Q20 17 24 15"
          stroke="url(#pascal-gradient)"
          strokeWidth="2"
          strokeDasharray="3,2"
          fill="none"
          animate={animated ? {
            strokeDashoffset: [0, -10],
            opacity: [0.3, 0.8, 0.3]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Combinatorial formula */}
        <text x="16" y="31" fontSize="5" fill="oklch(0.6 0.2 300)" fontWeight="bold" textAnchor="middle">
          C(n,k) = C(n-1,k-1) + C(n-1,k)
        </text>
        
        {/* Pascal's Triangle label */}
        <text x="16" y="2" fontSize="6" fill="oklch(0.6 0.2 300)" fontWeight="bold" textAnchor="middle">
          PASCAL&apos;S TRIANGLE
        </text>
      </svg>
    </motion.div>
  );
}