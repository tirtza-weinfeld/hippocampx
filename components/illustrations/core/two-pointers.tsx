/**
 * Two Pointers Algorithm Illustration
 * Shows how two pointers work to find a target sum
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function TwoPointersIcon({
  className = '',
  size = 48,
  animated = true
}: IllustrationProps) {
  const [step, setStep] = useState(0);
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const target = 10;

  // Generate all two pointers steps
  const steps = [];
  let left = 0;
  let right = array.length - 1;

  while (left < right) {
    const sum = array[left] + array[right];
    const isTarget = sum === target;
    steps.push({
      left,
      right,
      sum,
      isTarget,
      leftVal: array[left],
      rightVal: array[right],
      action: isTarget ? "Found pair!" :
              sum < target ? "Sum too small, move left pointer →" :
              "Sum too large, move right pointer ←"
    });

    if (sum === target) {
      left++;
      right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % steps.length);
      }, 1400);
      return () => clearInterval(interval);
    }
  }, [animated, steps.length]);

  const currentStep = steps[step] || steps[0];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="left-pointer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 220)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 245)" />
          </linearGradient>
          <linearGradient id="right-pointer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 25)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 45)" />
          </linearGradient>
          <linearGradient id="target-found" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.4 120)" />
            <stop offset="100%" stopColor="oklch(0.65 0.35 140)" />
          </linearGradient>
        </defs>

        {/* Array elements */}
        {array.map((value, i) => {
          const isLeft = i === currentStep.left;
          const isRight = i === currentStep.right;
          const isPair = (isLeft || isRight) && currentStep.isTarget;

          return (
            <motion.g key={i}>
              <motion.rect
                x={1 + i * 3.3}
                y="10"
                width="3"
                height="6"
                rx="1.5"
                fill={
                  isPair ? "url(#target-found)" :
                  isLeft ? "url(#left-pointer)" :
                  isRight ? "url(#right-pointer)" :
                  "oklch(0.9 0.05 220)"
                }
                stroke={
                  isLeft ? "oklch(0.7 0.35 220)" :
                  isRight ? "oklch(0.7 0.35 25)" :
                  "oklch(0.7 0.2 220)"
                }
                strokeWidth={isLeft || isRight ? "2" : "1"}
                animate={{
                  scale: isLeft || isRight ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              />
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
                fill="oklch(0.5 0.2 220)"
                textAnchor="middle"
              >
                {i}
              </text>
            </motion.g>
          );
        })}

        {/* Left pointer label */}
        <text
          x={2.5 + currentStep.left * 3.3}
          y="20"
          fontSize="3"
          fill="oklch(0.7 0.35 220)"
          fontWeight="bold"
          textAnchor="middle"
        >
          L
        </text>

        {/* Right pointer label */}
        <text
          x={2.5 + currentStep.right * 3.3}
          y="20"
          fontSize="3"
          fill="oklch(0.7 0.35 25)"
          fontWeight="bold"
          textAnchor="middle"
        >
          R
        </text>

        {/* Algorithm state */}
        <text x="2" y="4" fontSize="3" fill="oklch(0.6 0.3 220)" fontWeight="bold">
          Target: {target} | Step {step + 1}
        </text>

        <text x="2" y="24" fontSize="3" fill="oklch(0.7 0.3 25)" fontWeight="bold">
          {currentStep.leftVal} + {currentStep.rightVal} = {currentStep.sum}
        </text>

        <motion.text
          x="2"
          y="27"
          fontSize="3"
          fill={currentStep.isTarget ? "oklch(0.75 0.4 120)" : "oklch(0.6 0.3 220)"}
          fontWeight="bold"
          animate={{ opacity: 1 }}
        >
          {currentStep.action}
        </motion.text>

        {/* Visual connection between pointers */}
        <motion.path
          d={`M${2.5 + currentStep.left * 3.3} 17 Q16 22 ${2.5 + currentStep.right * 3.3} 17`}
          stroke={currentStep.isTarget ? "oklch(0.75 0.4 120)" : "oklch(0.6 0.3 220)"}
          strokeWidth="2"
          fill="none"
          strokeDasharray={currentStep.isTarget ? "0" : "3,2"}
          animate={{
            d: `M${2.5 + currentStep.left * 3.3} 17 Q16 22 ${2.5 + currentStep.right * 3.3} 17`
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Target info */}
        <text x="16" y="31" fontSize="4" fill="oklch(0.6 0.3 220)" fontWeight="bold" textAnchor="middle">
          Two Pointers: O(n) time, O(1) space
        </text>
      </svg>
    </motion.div>
  );
}