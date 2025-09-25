/**
 * Binary Tree Data Structure Illustration
 * Shows tree traversal and hierarchical structure
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function TreeIcon({
  className = '',
  size = 48,
  animated = true
}: IllustrationProps) {
  const [traversalStep, setTraversalStep] = useState(0);
  const [traversalType, setTraversalType] = useState<'preorder' | 'inorder' | 'postorder'>('preorder');

  // Different traversal sequences
  const traversalOrders = {
    preorder: [0, 1, 3, 4, 2, 5, 6],  // Root, Left, Right
    inorder: [3, 1, 4, 0, 5, 2, 6],   // Left, Root, Right
    postorder: [3, 4, 1, 5, 6, 2, 0]  // Left, Right, Root
  };

  const currentOrder = traversalOrders[traversalType];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setTraversalStep(prev => {
          if (prev >= currentOrder.length) {
            // Switch to next traversal type
            const types: Array<'preorder' | 'inorder' | 'postorder'> = ['preorder', 'inorder', 'postorder'];
            const currentIndex = types.indexOf(traversalType);
            setTraversalType(types[(currentIndex + 1) % types.length]);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [animated, currentOrder.length, traversalType]);

  const nodeValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  // Node positions for binary tree
  const positions = [
    { x: 16, y: 6 },   // A (root)
    { x: 10, y: 12 },  // B 
    { x: 22, y: 12 },  // C
    { x: 6, y: 18 },   // D
    { x: 14, y: 18 },  // E
    { x: 18, y: 18 },  // F
    { x: 26, y: 18 }   // G
  ];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="tree-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 125)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 145)" />
          </linearGradient>
          <radialGradient id="active-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.8 0.35 45)" />
            <stop offset="100%" stopColor="oklch(0.7 0.3 65)" />
          </radialGradient>
          <filter id="tree-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Tree edges */}
        {[
          [0, 1], [0, 2], // root connections
          [1, 3], [1, 4], // B's children
          [2, 5], [2, 6]  // C's children
        ].map(([parent, child], i) => (
          <motion.line
            key={i}
            x1={positions[parent].x} 
            y1={positions[parent].y} 
            x2={positions[child].x} 
            y2={positions[child].y}
            stroke="oklch(0.6 0.25 125)"
            strokeWidth="2"
            opacity="0.7"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              stroke: (traversalStep > 0 &&
                      (currentOrder.slice(0, traversalStep).includes(parent) &&
                       currentOrder.slice(0, traversalStep).includes(child)))
                      ? "oklch(0.7 0.3 65)" : "oklch(0.6 0.25 125)"
            }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}
        
        {/* Tree nodes */}
        {nodeValues.map((value, i) => {
          const isActive = traversalStep > 0 && currentOrder.slice(0, traversalStep).includes(i);
          const isCurrent = traversalStep > 0 && currentOrder[traversalStep - 1] === i;
          const visitOrder = currentOrder.indexOf(i) + 1;
          
          return (
            <motion.g key={i}>
              <motion.circle
                cx={positions[i].x} 
                cy={positions[i].y} 
                r="3.5"
                fill={isCurrent ? "url(#active-gradient)" : isActive ? "oklch(0.8 0.2 125)" : "url(#tree-gradient)"}
                stroke={isCurrent ? "oklch(0.7 0.3 65)" : "oklch(0.5 0.2 125)"}
                strokeWidth={isCurrent ? "2" : "1"}
                filter={isCurrent ? "url(#tree-glow)" : undefined}
                initial={{ scale: 0 }}
                animate={{
                  scale: isCurrent ? 1.2 : 1
                }}
                transition={{ 
                  delay: i * 0.1,
                  scale: { duration: 0.3, repeat: isCurrent ? Infinity : 0, repeatDelay: 0.5 }
                }}
              />
              <motion.text
                x={positions[i].x}
                y={positions[i].y + 1.5}
                fontSize="5"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {value}
              </motion.text>
              {/* Visit order number */}
              {isActive && (
                <motion.text
                  x={positions[i].x + 5}
                  y={positions[i].y - 4}
                  fontSize="3"
                  fill="oklch(0.7 0.3 65)"
                  fontWeight="bold"
                  textAnchor="middle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {visitOrder}
                </motion.text>
              )}
            </motion.g>
          );
        })}
        
        {/* Traversal type indicator */}
        <motion.text
          x="16"
          y="2"
          fontSize="5"
          fill="oklch(0.6 0.25 125)"
          fontWeight="bold"
          textAnchor="middle"
          animate={animated ? { scale: 1.1 } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {traversalType.toUpperCase()}
        </motion.text>

        {/* Current traversal sequence */}
        <motion.text
          x="16"
          y="26"
          fontSize="4"
          fill="oklch(0.6 0.25 125)"
          fontWeight="bold"
          textAnchor="middle"
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {currentOrder.slice(0, traversalStep).map(i => nodeValues[i]).join(' → ')}
        </motion.text>

        {/* Traversal rules */}
        <text x="16" y="29" fontSize="3" fill="oklch(0.5 0.15 125)" textAnchor="middle">
          {traversalType === 'preorder' && 'Root → Left → Right'}
          {traversalType === 'inorder' && 'Left → Root → Right'}
          {traversalType === 'postorder' && 'Left → Right → Root'}
        </text>

        {/* Step indicator */}
        <text x="16" y="31" fontSize="4" fill="oklch(0.4 0.1 125)" textAnchor="middle">
          Step {traversalStep} of {currentOrder.length}
        </text>
        
        <defs>
          <marker id="root-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.25 125)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}