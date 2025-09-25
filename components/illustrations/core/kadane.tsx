/**
 * Kadane's Algorithm Illustration
 * Shows maximum subarray sum with dynamic programming approach
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function KadaneIcon({
  className = '',
  size = 48,
  animated = true
}: IllustrationProps) {
  const [step, setStep] = useState(0);
  const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

  // Pre-calculate all steps of Kadane's algorithm
  const steps = [];
  let maxSoFar = array[0];
  let maxEndingHere = array[0];
  let start = 0, end = 0, tempStart = 0;

  steps.push({
    index: 0,
    value: array[0],
    maxEndingHere: array[0],
    maxSoFar: array[0],
    decision: "Initialize",
    start: 0,
    end: 0,
    subarraySum: array[0]
  });

  for (let i = 1; i < array.length; i++) {
    const extend = maxEndingHere + array[i];
    const restart = array[i];

    if (restart > extend) {
      maxEndingHere = restart;
      tempStart = i;
    } else {
      maxEndingHere = extend;
    }

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      start = tempStart;
      end = i;
    }

    steps.push({
      index: i,
      value: array[i],
      maxEndingHere,
      maxSoFar,
      decision: restart > extend ? "Restart subarray" : "Extend subarray",
      start,
      end,
      subarraySum: array.slice(start, end + 1).reduce((a, b) => a + b, 0)
    });
  }

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % steps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [animated, steps.length]);

  const currentStep = steps[step];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="kadane-positive" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 125)" />
            <stop offset="100%" stopColor="oklch(0.8 0.4 145)" />
          </linearGradient>
          <linearGradient id="kadane-negative" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 15)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 35)" />
          </linearGradient>
          <linearGradient id="kadane-max" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.75 0.4 85)" />
            <stop offset="100%" stopColor="oklch(0.85 0.45 105)" />
          </linearGradient>
          <filter id="kadane-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Array elements */}
        {array.map((value, i) => {
          const isInCurrentSubarray = i >= currentStep.start && i <= currentStep.end;
          const isCurrent = i === currentStep.index;
          const isProcessed = i <= currentStep.index;

          return (
            <motion.g key={i}>
              {/* Array element box */}
              <motion.rect
                x={1 + i * 3.3}
                y="10"
                width="3"
                height="6"
                rx="1.5"
                fill={
                  isCurrent ? "oklch(0.8 0.4 25)" :
                  isInCurrentSubarray ? "oklch(0.75 0.35 120)" :
                  value >= 0 ? "oklch(0.7 0.3 200)" : "oklch(0.6 0.3 15)"
                }
                stroke={isCurrent ? "oklch(0.9 0.5 25)" : "oklch(0.5 0.2 200)"}
                strokeWidth={isCurrent ? "2" : "1"}
                opacity={isProcessed ? 1 : 0.3}
                animate={{
                  scale: isCurrent ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Array values */}
              <text
                x={2.5 + i * 3.3}
                y="14"
                fontSize="4"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
              >
                {value}
              </text>

              {/* Array indices */}
              <text
                x={2.5 + i * 3.3}
                y="8"
                fontSize="3"
                fill="oklch(0.5 0.2 200)"
                textAnchor="middle"
              >
                {i}
              </text>
            </motion.g>
          );
        })}
        
        {/* Current subarray bracket */}
        <motion.path
          d={`M${1 + currentStep.start * 3.3} 17 L${1 + currentStep.start * 3.3} 18 L${4 + currentStep.end * 3.3} 18 L${4 + currentStep.end * 3.3} 17`}
          stroke="oklch(0.75 0.35 120)"
          strokeWidth="2"
          fill="none"
          animate={{ opacity: 1 }}
        />

        {/* Algorithm state display */}
        <text x="2" y="4" fontSize="3" fill="oklch(0.6 0.3 200)" fontWeight="bold">
          Step {step + 1}: {currentStep.decision}
        </text>

        <text x="2" y="22" fontSize="3" fill="oklch(0.7 0.3 25)" fontWeight="bold">
          Current Element: {currentStep.value}
        </text>

        <text x="2" y="25" fontSize="3" fill="oklch(0.6 0.3 120)" fontWeight="bold">
          Max Ending Here: {currentStep.maxEndingHere}
        </text>

        <text x="2" y="28" fontSize="3" fill="oklch(0.8 0.4 85)" fontWeight="bold">
          Max So Far: {currentStep.maxSoFar}
        </text>

        {/* Best subarray info */}
        <text x="16" y="31" fontSize="4" fill="oklch(0.75 0.35 120)" fontWeight="bold" textAnchor="middle">
          Best: [{currentStep.start}...{currentStep.end}] = {currentStep.subarraySum}
        </text>
        
        <defs>
          <marker id="current-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.8 0.4 85)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}