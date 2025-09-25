/**
 * Binary Search Algorithm Illustration
 * Shows divide and conquer approach with animated search space
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';


export function BinarySearchIcon({ className = '', size = 48, animated = true}: IllustrationProps) {
  
  const [searchStep, setSearchStep] = useState(0);
  const target = 9;
  const array = [1, 3, 4, 7, 9, 11, 15];
  const steps = [
    { left: 0, right: 6, mid: 3, comparison: "9 > 7", direction: "right" },
    { left: 4, right: 6, mid: 5, comparison: "9 < 11", direction: "left" },
    { left: 4, right: 4, mid: 4, comparison: "9 = 9", direction: "found" }
  ];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setSearchStep(prev => (prev + 1) % (steps.length + 1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animated, steps.length]);

  const currentStep = steps[searchStep] || steps[0];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="search-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 220)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 245)" />
          </linearGradient>
          <linearGradient id="target-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 25)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 45)" />
          </linearGradient>
          <filter id="search-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Array elements */}
        {array.map((value, i) => (
          <motion.g key={i}>
            <motion.rect
              x={3 + i * 3.7}
              y="12"
              width="3"
              height="8"
              rx="1.5"
              fill={
                i === currentStep.mid && currentStep.direction === "found" ? "oklch(0.7 0.4 120)" :
                i === currentStep.mid ? "url(#target-gradient)" :
                i >= currentStep.left && i <= currentStep.right ? "url(#search-gradient)" :
                "oklch(0.85 0.05 258)"
              }
              opacity={i >= currentStep.left && i <= currentStep.right ? 1 : 0.3}
              animate={animated ? {
                scale: i === currentStep.mid ? 1.3 : 1,
                opacity: i >= currentStep.left && i <= currentStep.right ? 1 : 0.3
              } : {}}
              transition={{ duration: 0.6 }}
            />
            <text
              x={4.5 + i * 3.7}
              y="17"
              fontSize="6"
              fill="white"
              fontWeight="bold"
              textAnchor="middle"
            >
              {value}
            </text>
            {/* Array indices */}
            <text
              x={4.5 + i * 3.7}
              y="10"
              fontSize="4"
              fill="oklch(0.5 0.1 220)"
              textAnchor="middle"
            >
              {i}
            </text>
          </motion.g>
        ))}
        
        {/* Search space indicator */}
        <motion.rect
          x={3 + currentStep.left * 3.7 - 0.5}
          y="11"
          width={(currentStep.right - currentStep.left + 1) * 3.7}
          height="10"
          rx="2"
          fill="none"
          stroke="url(#search-gradient)"
          strokeWidth="2"
          strokeDasharray="3,2"
          animate={animated ? {
            strokeDashoffset: [0, -10],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Target arrow */}
        <motion.path
          d={`M${4.5 + currentStep.mid * 3.7} 8 L${4.5 + currentStep.mid * 3.7} 11`}
          stroke="url(#target-gradient)"
          strokeWidth="2"
          markerEnd="url(#target-arrow)"
          animate={animated ? {
            y: -2,
            opacity: 1
          } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        
        {/* Left and right pointers */}
        <text x={4.5 + currentStep.left * 3.7} y="6" fontSize="5" fill="oklch(0.6 0.28 245)" fontWeight="bold" textAnchor="middle">L</text>
        <text x={4.5 + currentStep.right * 3.7} y="6" fontSize="5" fill="oklch(0.6 0.28 245)" fontWeight="bold" textAnchor="middle">R</text>
        <text x={4.5 + currentStep.mid * 3.7} y="6" fontSize="5" fill="oklch(0.7 0.35 25)" fontWeight="bold" textAnchor="middle">M</text>

        {/* Search target */}
        <text x="2" y="4" fontSize="6" fill="oklch(0.6 0.35 25)" fontWeight="bold">Target: {target}</text>

        {/* Comparison text */}
        <motion.text
          x="16"
          y="26"
          fontSize="6"
          fill="oklch(0.6 0.28 245)"
          fontWeight="bold"
          textAnchor="middle"
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {currentStep.comparison}
        </motion.text>

        {/* Step indicator */}
        <text x="16" y="30" fontSize="5" fill="oklch(0.5 0.15 245)" textAnchor="middle">
          Step {searchStep + 1} of {steps.length}
        </text>
        
        <defs>
          <marker id="target-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.7 0.35 25)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}