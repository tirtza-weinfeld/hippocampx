/**
 * Heap Data Structure Illustration
 * Shows min/max heap property with parent-child relationships
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function HeapIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [isMaxHeap, setIsMaxHeap] = useState(true);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIsMaxHeap(prev => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animated]);

  // Max heap values
  const maxHeapValues = [50, 30, 40, 10, 20, 35, 25];
  // Min heap values  
  const minHeapValues = [10, 20, 15, 30, 25, 40, 35];
  
  const currentValues = isMaxHeap ? maxHeapValues : minHeapValues;
  
  // Node positions for a complete binary tree
  const positions = [
    { x: 16, y: 6 },   // root
    { x: 8, y: 12 },   // left child
    { x: 24, y: 12 },  // right child
    { x: 4, y: 18 },   // left-left
    { x: 12, y: 18 },  // left-right
    { x: 20, y: 18 },  // right-left
    { x: 28, y: 18 }   // right-right
  ];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="heap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMaxHeap ? "oklch(0.7 0.35 15)" : "oklch(0.7 0.35 195)"} />
            <stop offset="100%" stopColor={isMaxHeap ? "oklch(0.6 0.3 35)" : "oklch(0.6 0.3 220)"} />
          </linearGradient>
          <radialGradient id="node-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.95 0.02 15)" />
            <stop offset="100%" stopColor="url(#heap-gradient)" />
          </radialGradient>
          <filter id="heap-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Heap edges */}
        {[
          [0, 1], [0, 2], // root to children
          [1, 3], [1, 4], // left subtree
          [2, 5], [2, 6]  // right subtree
        ].map(([parent, child], i) => (
          <motion.line
            key={i}
            x1={positions[parent].x} 
            y1={positions[parent].y} 
            x2={positions[child].x} 
            y2={positions[child].y}
            stroke={isMaxHeap ? "oklch(0.6 0.3 15)" : "oklch(0.6 0.3 195)"}
            strokeWidth="1.5"
            opacity="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}
        
        {/* Heap nodes */}
        {currentValues.map((value, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={positions[i].x} 
              cy={positions[i].y} 
              r="3"
              fill="url(#node-gradient)"
              stroke={isMaxHeap ? "oklch(0.6 0.3 15)" : "oklch(0.6 0.3 195)"}
              strokeWidth="1"
              filter="url(#heap-shadow)"
              initial={{ scale: 0 }}
              animate={{ 
                scale: animated ? [1, 1.1, 1] : 1,
                fill: `url(#node-gradient)`
              }}
              transition={{ 
                delay: i * 0.15,
                scale: { duration: 0.5, repeat: animated ? Infinity : 0, repeatDelay: 2.5 }
              }}
            />
            <motion.text
              x={positions[i].x} 
              y={positions[i].y + 1} 
              fontSize="4"
              fill="white"
              fontWeight="bold"
              textAnchor="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.3 }}
            >
              {value}
            </motion.text>
          </motion.g>
        ))}
        
        {/* Heap property indicators */}
        {animated && (
          <>
            {/* Parent-child relationship arrows */}
            <motion.path
              d="M16 9 L8 11"
              stroke={isMaxHeap ? "oklch(0.7 0.35 15)" : "oklch(0.7 0.35 195)"}
              strokeWidth="2"
              markerEnd="url(#heap-arrow)"
              animate={{
                opacity: [0, 1, 0],
                pathLength: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            
            <motion.path
              d="M16 9 L24 11"
              stroke={isMaxHeap ? "oklch(0.7 0.35 15)" : "oklch(0.7 0.35 195)"}
              strokeWidth="2"
              markerEnd="url(#heap-arrow)"
              animate={{
                opacity: [0, 1, 0],
                pathLength: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )}
        
        {/* Heap type indicator */}
        <motion.text
          x="2" y="4" 
          fontSize="6" 
          fill={isMaxHeap ? "oklch(0.6 0.3 15)" : "oklch(0.6 0.3 195)"}
          fontWeight="bold"
          animate={{ opacity: animated ? [1, 0.5, 1] : 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {isMaxHeap ? "MAX" : "MIN"}
        </motion.text>
        
        {/* Property description */}
        <text 
          x="2" y="25" 
          fontSize="4" 
          fill={isMaxHeap ? "oklch(0.6 0.3 15)" : "oklch(0.6 0.3 195)"}
          fontWeight="bold"
        >
          Parent {isMaxHeap ? "≥" : "≤"} Children
        </text>
        
        {/* Heap label */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.5 0.1 15)" fontWeight="bold" textAnchor="middle">
          HEAP
        </text>
        
        <defs>
          <marker id="heap-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon 
              points="0 0, 6 2, 0 4" 
              fill={isMaxHeap ? "oklch(0.7 0.35 15)" : "oklch(0.7 0.35 195)"} 
            />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}