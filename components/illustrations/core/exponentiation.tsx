/**
 * Fast Exponentiation (Binary Exponentiation) Illustration
 * Shows power calculation with binary decomposition optimization
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function ExponentiationIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Calculating 2^10 = 1024 using binary exponentiation
  // 10 in binary is 1010, so 2^10 = 2^8 * 2^2
  const steps = [
    { power: 1, binary: "1", result: 2, operation: "2^1" },
    { power: 2, binary: "10", result: 4, operation: "2^2 = (2^1)^2" },
    { power: 4, binary: "100", result: 16, operation: "2^4 = (2^2)^2" },
    { power: 8, binary: "1000", result: 256, operation: "2^8 = (2^4)^2" },
    { power: 10, binary: "1010", result: 1024, operation: "2^10 = 2^8 * 2^2" }
  ];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animated, steps.length]);

  const current = steps[currentStep];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="exp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 45)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 75)" />
          </linearGradient>
          <linearGradient id="binary-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.65 0.25 220)" />
            <stop offset="100%" stopColor="oklch(0.55 0.2 245)" />
          </linearGradient>
          <filter id="exp-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Base and exponent display */}
        <motion.g
          animate={animated ? {
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <rect x="2" y="4" width="28" height="8" rx="4" fill="oklch(0.95 0.02 45)" stroke="oklch(0.8 0.05 45)" strokeWidth="1" />
          <text x="6" y="9" fontSize="8" fill="oklch(0.6 0.32 45)" fontWeight="bold">2</text>
          <text x="10" y="7" fontSize="6" fill="oklch(0.6 0.28 75)" fontWeight="bold">{current.power}</text>
          <text x="16" y="9" fontSize="8" fill="oklch(0.5 0.1 45)" fontWeight="bold">=</text>
          <motion.text 
            x="22" y="9" 
            fontSize="8" 
            fill="url(#exp-gradient)" 
            fontWeight="bold"
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {current.result}
          </motion.text>
        </motion.g>
        
        {/* Binary representation */}
        <rect x="2" y="14" width="28" height="6" rx="3" fill="oklch(0.95 0.02 220)" stroke="oklch(0.8 0.05 220)" strokeWidth="0.5" />
        <text x="4" y="18" fontSize="5" fill="oklch(0.6 0.25 220)" fontWeight="bold">BINARY:</text>
        
        {/* Binary digits */}
        {current.binary.split('').map((digit, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={14 + i * 4} 
              cy={17} 
              r="1.5"
              fill={digit === '1' ? "url(#binary-gradient)" : "oklch(0.85 0.05 220)"}
              animate={animated ? {
                scale: digit === '1' ? [1, 1.2, 1] : 1
              } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
            <text 
              x={14 + i * 4} 
              y={18} 
              fontSize="6" 
              fill="white" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {digit}
            </text>
          </motion.g>
        ))}
        
        {/* Operation visualization */}
        <motion.rect
          x="2" y="22" width="28" height="6" rx="3"
          fill="oklch(0.95 0.01 45)"
          stroke="oklch(0.8 0.05 45)"
          strokeWidth="0.5"
          animate={animated ? {
            fill: ["oklch(0.95 0.01 45)", "oklch(0.98 0.02 75)", "oklch(0.95 0.01 45)"]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.text 
          x="16" 
          y="26" 
          fontSize="5" 
          fill="oklch(0.6 0.28 75)" 
          fontWeight="bold" 
          textAnchor="middle"
          key={`op-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {current.operation}
        </motion.text>
        
        {/* Optimization arrows */}
        <motion.path
          d="M8 13 Q12 11 16 13 Q20 15 24 13"
          stroke="url(#exp-gradient)"
          strokeWidth="2"
          strokeDasharray="2,1"
          fill="none"
          animate={animated ? {
            strokeDashoffset: [0, -6],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Algorithm label */}
        <text x="16" y="31" fontSize="5" fill="oklch(0.6 0.28 75)" fontWeight="bold" textAnchor="middle">
          O(log n) - FAST EXPONENTIATION
        </text>
      </svg>
    </motion.div>
  );
}