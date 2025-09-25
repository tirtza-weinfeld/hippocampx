/**
 * Stack Data Structure Illustration
 * Shows LIFO (Last In, First Out) behavior with push/pop animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function StackIcon({
  className = '',
  size = 48,
  animated = true
}: IllustrationProps) {
  const [stackHeight, setStackHeight] = useState(3);
  const [operation, setOperation] = useState<'push' | 'pop'>('push');
  const maxHeight = 5;
  const stackElements = ['A', 'B', 'C', 'D', 'E'];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStackHeight(prev => {
          if (prev >= maxHeight) {
            setOperation('pop');
            return prev - 1;
          } else if (prev <= 1) {
            setOperation('push');
            return prev + 1;
          } else {
            return operation === 'push' ? prev + 1 : prev - 1;
          }
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [animated, operation]);

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="stack-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.25 15)" />
            <stop offset="100%" stopColor="oklch(0.75 0.3 25)" />
          </linearGradient>
          <linearGradient id="base-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.85 0.05 15)" />
            <stop offset="100%" stopColor="oklch(0.8 0.08 25)" />
          </linearGradient>
          <filter id="stack-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Stack base */}
        <rect 
          x="8" y="26" width="16" height="4" rx="2" 
          fill="url(#base-gradient)"
          stroke="oklch(0.7 0.15 15)"
          strokeWidth="0.5"
        />
        
        {/* Stack elements */}
        {Array.from({ length: stackHeight }, (_, i) => (
          <motion.g key={i}>
            <motion.rect
              x="10"
              y={24 - (i + 1) * 3.5}
              width="12"
              height="3"
              rx="1.5"
              fill={i === stackHeight - 1 ? "oklch(0.8 0.3 25)" : "url(#stack-gradient)"}
              stroke="oklch(0.55 0.2 15)"
              strokeWidth="0.5"
              filter="url(#stack-shadow)"
              initial={{ scale: 0, y: 24 - (i + 1) * 3.5 - 10 }}
              animate={{
                scale: i === stackHeight - 1 ? 1.1 : 1,
                y: 24 - (i + 1) * 3.5,
                opacity: i < stackHeight ? 1 : 0
              }}
              exit={{ scale: 0, y: 24 - (i + 1) * 3.5 - 10, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: animated ? i * 0.1 : 0
              }}
            />
            {/* Element labels */}
            <motion.text
              x="16"
              y={24 - (i + 1) * 3.5 + 2}
              fontSize="4"
              fill="white"
              fontWeight="bold"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: i < stackHeight ? 1 : 0 }}
            >
              {stackElements[i]}
            </motion.text>
          </motion.g>
        ))}
        
        {/* Stack pointer/top indicator */}
        <motion.path
          d={`M6 ${24 - stackHeight * 3.5 + 1.5} L9 ${24 - stackHeight * 3.5 + 1.5}`}
          stroke="oklch(0.6 0.25 15)"
          strokeWidth="2"
          markerEnd="url(#stack-pointer)"
          animate={animated ? {
            y: [0, -2, 0],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* LIFO arrows */}
        <motion.path
          d="M26 8 L26 12"
          stroke="oklch(0.6 0.25 15)"
          strokeWidth="2"
          markerEnd="url(#lifo-arrow)"
          animate={animated ? {
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.path
          d="M28 12 L28 8"
          stroke="oklch(0.6 0.25 15)"
          strokeWidth="2"
          markerEnd="url(#lifo-arrow)"
          animate={animated ? {
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        
        {/* Operation indicator */}
        <motion.text
          x="26"
          y="6"
          fontSize="5"
          fill={operation === 'push' ? "oklch(0.7 0.3 120)" : "oklch(0.6 0.25 15)"}
          fontWeight="bold"
          textAnchor="middle"
          animate={animated && operation === 'push' ? { scale: 1.2 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          PUSH
        </motion.text>
        <motion.text
          x="28"
          y="16"
          fontSize="5"
          fill={operation === 'pop' ? "oklch(0.7 0.3 0)" : "oklch(0.6 0.25 15)"}
          fontWeight="bold"
          textAnchor="middle"
          animate={animated && operation === 'pop' ? { scale: 1.2 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          POP
        </motion.text>

        {/* Top indicator */}
        <text x="4" y={24 - stackHeight * 3.5 - 1} fontSize="5" fill="oklch(0.6 0.25 15)" fontWeight="bold">TOP</text>

        {/* Current operation */}
        <motion.text
          x="16"
          y="3"
          fontSize="5"
          fill="oklch(0.6 0.25 15)"
          fontWeight="bold"
          textAnchor="middle"
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {operation === 'push' ? `Push(${stackElements[stackHeight]})` : `Pop() → ${stackElements[stackHeight]}`}
        </motion.text>

        {/* Stack info */}
        <text x="16" y="31" fontSize="5" fill="oklch(0.5 0.1 15)" fontWeight="bold" textAnchor="middle">
          LIFO • Size: {stackHeight}
        </text>
        
        <defs>
          <marker id="stack-pointer" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.25 15)" />
          </marker>
          <marker id="lifo-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.25 15)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}