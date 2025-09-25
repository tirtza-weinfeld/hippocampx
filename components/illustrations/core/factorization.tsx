/**
 * Integer Factorization Illustration
 * Shows prime factorization process with trial division
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function FactorizationIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Factorizing 60 = 2^2 * 3 * 5
  const steps = [
    { number: 60, divisor: 2, quotient: 30, factors: [] },
    { number: 30, divisor: 2, quotient: 15, factors: [2] },
    { number: 15, divisor: 3, quotient: 5, factors: [2, 2] },
    { number: 5, divisor: 5, quotient: 1, factors: [2, 2, 3] },
    { number: 1, divisor: null, quotient: null, factors: [2, 2, 3, 5] }
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
          <linearGradient id="factor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 285)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 315)" />
          </linearGradient>
          <linearGradient id="prime-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 45)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 75)" />
          </linearGradient>
          <radialGradient id="number-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.8 0.15 285)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 315)" />
          </radialGradient>
          <filter id="factor-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Current number being factored */}
        <motion.g
          animate={animated ? {
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <circle cx="16" cy="8" r="4" fill="url(#number-glow)" filter="url(#factor-glow)" />
          <motion.text 
            x="16" 
            y="9" 
            fontSize="8" 
            fill="white" 
            fontWeight="bold" 
            textAnchor="middle"
            key={`number-${currentStep}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {current.number}
          </motion.text>
        </motion.g>
        
        {/* Division operation */}
        {current.divisor && (
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Division symbol and divisor */}
            <rect x="8" y="14" width="16" height="4" rx="2" fill="oklch(0.95 0.02 285)" stroke="oklch(0.8 0.05 285)" strokeWidth="0.5" />
            <text x="12" y="17" fontSize="6" fill="oklch(0.6 0.3 285)" fontWeight="bold">{current.number}</text>
            <text x="16" y="17" fontSize="6" fill="oklch(0.5 0.1 285)" fontWeight="bold">÷</text>
            <text x="20" y="17" fontSize="6" fill="url(#prime-gradient)" fontWeight="bold">{current.divisor}</text>
            
            {/* Equals and result */}
            <text x="12" y="23" fontSize="6" fill="oklch(0.5 0.1 285)" fontWeight="bold">=</text>
            <motion.text 
              x="16" 
              y="23" 
              fontSize="6" 
              fill="url(#factor-gradient)" 
              fontWeight="bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {current.quotient}
            </motion.text>
          </motion.g>
        )}
        
        {/* Collected prime factors */}
        <rect x="2" y="26" width="28" height="4" rx="2" fill="oklch(0.95 0.01 45)" stroke="oklch(0.8 0.05 45)" strokeWidth="0.5" />
        <text x="4" y="28.5" fontSize="5" fill="oklch(0.6 0.28 75)" fontWeight="bold">FACTORS:</text>
        
        {current.factors.map((factor, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={12 + i * 4} 
              cy={28} 
              r="1.5"
              fill="url(#prime-gradient)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 400 }}
            />
            <text 
              x={12 + i * 4} 
              y={29} 
              fontSize="5" 
              fill="white" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {factor}
            </text>
          </motion.g>
        ))}
        
        {/* Factor tree visualization */}
        {currentStep > 0 && (
          <motion.path
            d="M16 12 L8 16 M16 12 L24 16"
            stroke="url(#factor-gradient)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            animate={animated ? {
              strokeDashoffset: [0, -8],
              opacity: [0.5, 1, 0.5]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Progress indicator */}
        <motion.rect
          x="2" y="2" 
          width={28 * (currentStep / (steps.length - 1))} 
          height="2" 
          rx="1"
          fill="url(#prime-gradient)"
          initial={{ width: 0 }}
          animate={{ width: 28 * (currentStep / (steps.length - 1)) }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Algorithm label */}
        <text x="16" y="32" fontSize="5" fill="oklch(0.6 0.28 75)" fontWeight="bold" textAnchor="middle">
          PRIME FACTORIZATION
        </text>
      </svg>
    </motion.div>
  );
};