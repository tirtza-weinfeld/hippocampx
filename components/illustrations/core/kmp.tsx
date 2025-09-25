/**
 * Knuth-Morris-Pratt (KMP) String Matching Illustration
 * Shows pattern matching with failure function and smart skipping
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function KMPIcon({
  className = '',
  size = 48,
  animated = true
}: IllustrationProps) {
  const [step, setStep] = useState(0);

  const text = "ABABCABABA";
  const pattern = "ABAB";
  const lps = [0, 0, 1, 2]; // Longest Prefix Suffix array

  // Pre-calculate KMP algorithm steps
  const steps = [];
  let i = 0; // text index
  let j = 0; // pattern index

  while (i < text.length) {
    const isMatch = text[i] === pattern[j];
    steps.push({
      textIndex: i,
      patternIndex: j,
      textChar: text[i],
      patternChar: pattern[j],
      isMatch,
      action: isMatch ?
        (j === pattern.length - 1 ? "MATCH FOUND!" : "Characters match, advance both") :
        (j > 0 ? `Mismatch, use LPS[${j-1}]=${lps[j-1]}` : "Mismatch, advance text"),
      textStart: i - j,
      found: false
    });

    if (isMatch) {
      i++;
      j++;
      if (j === pattern.length) {
        steps[steps.length - 1].found = true;
        j = lps[j - 1];
      }
    } else {
      if (j > 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % steps.length);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [animated, steps.length]);

  const currentStep = steps[step] || steps[0];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="kmp-match" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 165)" />
          </linearGradient>
          <linearGradient id="kmp-pattern" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 220)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 245)" />
          </linearGradient>
          <linearGradient id="kmp-mismatch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 0)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 25)" />
          </linearGradient>
          <filter id="kmp-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Text string */}
        {text.split('').map((char, i) => {
          const isCurrent = i === currentStep.textIndex;
          const isInPattern = i >= currentStep.textStart && i < currentStep.textStart + pattern.length;

          return (
            <motion.g key={`text-${i}`}>
              <motion.rect
                x={1 + i * 2.9}
                y="8"
                width="2.5"
                height="4"
                rx="1"
                fill={
                  currentStep.found && isInPattern ? "oklch(0.75 0.4 120)" :
                  isCurrent ? "oklch(0.8 0.4 25)" :
                  "oklch(0.9 0.05 220)"
                }
                stroke={isCurrent ? "oklch(0.9 0.5 25)" : "oklch(0.7 0.2 220)"}
                strokeWidth={isCurrent ? "2" : "1"}
                animate={{
                  scale: isCurrent ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              />
              <text
                x={2.25 + i * 2.9}
                y="11"
                fontSize="3"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
              >
                {char}
              </text>
              {/* Text indices */}
              <text
                x={2.25 + i * 2.9}
                y="6"
                fontSize="2"
                fill="oklch(0.5 0.2 220)"
                textAnchor="middle"
              >
                {i}
              </text>
            </motion.g>
          );
        })}
        
        {/* Pattern string */}
        {pattern.split('').map((char, i) => {
          const patternPos = currentStep.textStart + i;
          const isCurrent = i === currentStep.patternIndex;

          return (
            <motion.g key={`pattern-${i}`}>
              <motion.rect
                x={1 + patternPos * 2.9}
                y="15"
                width="2.5"
                height="4"
                rx="1"
                fill={
                  currentStep.found ? "oklch(0.75 0.4 120)" :
                  isCurrent ? "oklch(0.7 0.35 270)" :
                  "oklch(0.7 0.3 270)"
                }
                stroke={isCurrent ? "oklch(0.8 0.4 270)" : "oklch(0.6 0.25 270)"}
                strokeWidth={isCurrent ? "2" : "1"}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  x: 1 + patternPos * 2.9
                }}
                transition={{ duration: 0.4 }}
              />
              <motion.text
                x={2.25 + patternPos * 2.9}
                y="18"
                fontSize="3"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
                animate={{
                  x: 2.25 + patternPos * 2.9
                }}
                transition={{ duration: 0.4 }}
              >
                {char}
              </motion.text>
            </motion.g>
          );
        })}
        
        {/* Comparison indicator */}
        <motion.path
          d={`M${2.25 + currentStep.textIndex * 2.9} 13 L${2.25 + (currentStep.textStart + currentStep.patternIndex) * 2.9} 14`}
          stroke={currentStep.isMatch ? "oklch(0.7 0.4 120)" : "oklch(0.7 0.4 0)"}
          strokeWidth="2"
          animate={{
            d: `M${2.25 + currentStep.textIndex * 2.9} 13 L${2.25 + (currentStep.textStart + currentStep.patternIndex) * 2.9} 14`
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Algorithm state */}
        <text x="2" y="3" fontSize="3" fill="oklch(0.6 0.3 220)" fontWeight="bold">
          Step {step + 1}: Comparing {currentStep.textChar} vs {currentStep.patternChar}
        </text>

        <motion.text
          x="2"
          y="23"
          fontSize="3"
          fill={currentStep.isMatch ? "oklch(0.7 0.4 120)" : "oklch(0.7 0.4 0)"}
          fontWeight="bold"
          animate={{ opacity: 1 }}
        >
          {currentStep.action}
        </motion.text>

        {/* LPS Array */}
        <text x="2" y="27" fontSize="3" fill="oklch(0.6 0.3 270)" fontWeight="bold">
          LPS: [{lps.join(', ')}]
        </text>

        {/* Current positions */}
        <text x="2" y="30" fontSize="3" fill="oklch(0.5 0.2 220)">
          Text[{currentStep.textIndex}] = {currentStep.textChar} | Pattern[{currentStep.patternIndex}] = {currentStep.patternChar}
        </text>
        
        <defs>
          <marker id="kmp-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.7 0.35 0)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
}