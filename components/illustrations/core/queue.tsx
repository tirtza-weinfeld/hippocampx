/**
 * Queue Data Structure Illustration
 * Shows FIFO (First In, First Out) behavior with enqueue/dequeue animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function QueueIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [queueElements, setQueueElements] = useState([1, 2, 3, 4]);
  const maxElements = 5;

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setQueueElements(prev => {
          // Simulate enqueue/dequeue operations
          const newQueue = [...prev];
          if (newQueue.length >= maxElements) {
            // Dequeue (remove from front)
            newQueue.shift();
          } else {
            // Enqueue (add to back)
            const newElement = Math.max(...prev, 0) + 1;
            newQueue.push(newElement);
          }
          return newQueue;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [animated]);

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="queue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.28 195)" />
            <stop offset="100%" stopColor="oklch(0.75 0.32 220)" />
          </linearGradient>
          <linearGradient id="queue-container" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.9 0.05 195)" />
            <stop offset="100%" stopColor="oklch(0.85 0.08 220)" />
          </linearGradient>
          <filter id="queue-shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Queue container */}
        <rect 
          x="3" y="12" width="26" height="8" rx="4" 
          fill="url(#queue-container)"
          stroke="oklch(0.7 0.15 195)"
          strokeWidth="1"
        />
        
        {/* Queue elements */}
        {queueElements.map((element, i) => (
          <motion.rect
            key={`${element}-${i}`}
            x={5 + i * 4.5} 
            y="14" 
            width="3.5" 
            height="4" 
            rx="1.75"
            fill="url(#queue-gradient)"
            stroke="oklch(0.55 0.25 195)"
            strokeWidth="0.5"
            filter="url(#queue-shadow)"
            initial={{ scale: 0, x: 29 }}
            animate={{ 
              scale: 1, 
              x: 5 + i * 4.5,
              opacity: 1
            }}
            exit={{ scale: 0, x: -5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.5
            }}
          />
        ))}
        
        {/* Front pointer */}
        <motion.path
          d="M3 8 L5 10"
          stroke="oklch(0.6 0.28 195)"
          strokeWidth="2"
          markerEnd="url(#front-arrow)"
          animate={animated ? {
            y: [0, -1, 0],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Rear pointer */}
        <motion.path
          d={`M${3 + queueElements.length * 4.5} 8 L${5 + (queueElements.length - 1) * 4.5 + 1.75} 10`}
          stroke="oklch(0.6 0.28 195)"
          strokeWidth="2"
          markerEnd="url(#rear-arrow)"
          animate={animated ? {
            y: [0, -1, 0],
            opacity: [0.7, 1, 0.7],
            x: [0, 0, 0] // Keep it positioned correctly
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        />
        
        {/* FIFO flow indicators */}
        <motion.path
          d="M1 24 L8 24"
          stroke="oklch(0.6 0.28 195)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          markerEnd="url(#fifo-arrow)"
          animate={animated ? {
            strokeDashoffset: [0, -8],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.path
          d="M24 24 L31 24"
          stroke="oklch(0.6 0.28 195)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          markerEnd="url(#fifo-arrow)"
          animate={animated ? {
            strokeDashoffset: [0, -8],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Labels */}
        <text x="2" y="6" fontSize="5" fill="oklch(0.6 0.28 195)" fontWeight="bold">FRONT</text>
        <text x={3 + queueElements.length * 4.5 - 6} y="6" fontSize="5" fill="oklch(0.6 0.28 195)" fontWeight="bold">REAR</text>
        <text x="4" y="27" fontSize="5" fill="oklch(0.6 0.28 195)" fontWeight="bold">DEQUEUE</text>
        <text x="26" y="27" fontSize="5" fill="oklch(0.6 0.28 195)" fontWeight="bold">ENQUEUE</text>
        
        {/* Queue label */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.5 0.1 195)" fontWeight="bold" textAnchor="middle">
          QUEUE (FIFO)
        </text>
        
        <defs>
          <marker id="front-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.28 195)" />
          </marker>
          <marker id="rear-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.28 195)" />
          </marker>
          <marker id="fifo-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.28 195)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}