/**
 * Sieve of Eratosthenes Algorithm Illustration
 * Shows prime number discovery by eliminating multiples
 */

'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IllustrationProps } from '../type';

export function SieveOfEratosthenesIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [currentPrime, setCurrentPrime] = useState(2);
  const [crossedOut, setCrossedOut] = useState<number[]>([]);
  
  const numbers = Array.from({ length: 15 }, (_, i) => i + 2); // 2 to 16
  const primes = [2, 3, 5, 7, 11, 13];
  const shouldReduceMotion = useReducedMotion();

  const getNumberState = (num: number) => {
    if (crossedOut.includes(num)) return 'crossed';
    if (primes.includes(num) && num <= currentPrime) return 'prime';
    if (num === currentPrime) return 'current';
    return 'normal';
  };

  return (
    <motion.div 
      className={className}
      animate={animated && !shouldReduceMotion ? {
        scale: [1, 1.02, 1]
      } : {}}
      transition={{
        duration: 2,
        repeat: animated && !shouldReduceMotion ? Infinity : 0,
        onRepeat: () => {
          setCurrentPrime(prev => {
            const nextPrimeIndex = primes.findIndex(p => p > prev);
            if (nextPrimeIndex === -1) {
              setCrossedOut([]);
              return 2;
            }
            
            // Add multiples of current prime to crossed out list
            const multiples = numbers.filter(n => n > prev && n % prev === 0);
            setCrossedOut(prevCrossed => [...prevCrossed, ...multiples]);
            
            return primes[nextPrimeIndex];
          });
        }
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="prime-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 165)" />
          </linearGradient>
          <linearGradient id="current-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 25)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 45)" />
          </linearGradient>
          <filter id="sieve-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Number grid (3x5 grid) */}
        {numbers.slice(0, 15).map((num, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const x = 4 + col * 4.8;
          const y = 8 + row * 6;
          const state = getNumberState(num);
          
          return (
            <motion.g key={num}>
              <motion.circle
                cx={x} 
                cy={y} 
                r="2"
                fill={
                  state === 'prime' ? 'url(#prime-gradient)' :
                  state === 'current' ? 'url(#current-gradient)' :
                  state === 'crossed' ? 'oklch(0.4 0.1 0)' :
                  'oklch(0.85 0.05 285)'
                }
                filter={state === 'prime' || state === 'current' ? 'url(#sieve-glow)' : undefined}
                animate={animated && !shouldReduceMotion ? {
                  scale: state === 'current' ? [1, 1.3, 1] : state === 'prime' ? [1, 1.1, 1] : 1,
                  opacity: state === 'crossed' ? [1, 0.3] : 1
                } : {}}
                transition={{ 
                  duration: 0.5,
                  repeat: animated && !shouldReduceMotion ? Infinity : 0,
                  repeatDelay: 2
                }}
              />
              
              {/* Number label */}
              <motion.text 
                x={x} 
                y={y + 1} 
                fontSize="6" 
                fill={state === 'crossed' ? 'oklch(0.6 0.1 0)' : 'white'} 
                fontWeight="bold" 
                textAnchor="middle"
                animate={animated && !shouldReduceMotion ? {
                  opacity: state === 'crossed' ? [1, 0.5] : 1
                } : {}}
                transition={{ 
                  duration: 0.5,
                  repeat: animated && !shouldReduceMotion ? Infinity : 0,
                  repeatDelay: 2
                }}
              >
                {num}
              </motion.text>
              
              {/* Cross out line for composites */}
              {state === 'crossed' && (
                <motion.path
                  d={`M${x - 1.5} ${y - 1.5} L${x + 1.5} ${y + 1.5}`}
                  stroke="oklch(0.6 0.3 0)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={animated && !shouldReduceMotion ? { pathLength: 1 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.2,
                    repeat: animated && !shouldReduceMotion ? Infinity : 0,
                    repeatDelay: 2
                  }}
                />
              )}
            </motion.g>
          );
        })}
        
        {/* Current prime indicator */}
        <motion.text 
          x="2" 
          y="30" 
          fontSize="7" 
          fill="oklch(0.7 0.35 25)" 
          fontWeight="bold"
          animate={animated && !shouldReduceMotion ? {
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ 
            duration: 1, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 2
          }}
        >
          P = {currentPrime}
        </motion.text>
        
        {/* Sieve title */}
        <text x="16" y="4" fontSize="6" fill="oklch(0.6 0.28 165)" fontWeight="bold" textAnchor="middle">
          SIEVE OF ERATOSTHENES
        </text>
        
        {/* Legend */}
        <circle cx="20" cy="29" r="1.5" fill="url(#prime-gradient)" />
        <text x="23" y="31" fontSize="5" fill="oklch(0.6 0.28 165)">PRIME</text>
        
        <circle cx="26" cy="29" r="1.5" fill="oklch(0.4 0.1 0)" opacity="0.6" />
        <text x="29" y="31" fontSize="5" fill="oklch(0.4 0.1 0)">×</text>
      </svg>
    </motion.div>
  );
}