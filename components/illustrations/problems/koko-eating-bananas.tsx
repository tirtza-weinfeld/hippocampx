/**
 * Koko Eating Bananas Problem Illustration
 * Shows binary search on eating speed with time constraint visualization
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IllustrationProps } from '../type';

export function KokoEatingBananasIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [currentSpeed, setCurrentSpeed] = useState(4);
  
  const piles = useMemo(() => [3, 6, 7, 11], []); // banana piles - memoized to prevent dependency issues
  const maxTime = 8; // hours limit
  const shouldReduceMotion = useReducedMotion();

  const getTimeForSpeed = (speed: number) => {
    return piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0);
  };

  const currentTime = getTimeForSpeed(currentSpeed);
  const isValidSpeed = currentTime <= maxTime;

  return (
    <motion.div 
      className={className}
      animate={animated && !shouldReduceMotion ? {
        scale: [1, 1.02, 1]
      } : {}}
      transition={{
        duration: 2.5,
        repeat: animated && !shouldReduceMotion ? Infinity : 0,
        onRepeat: () => {
          setCurrentSpeed(prev => prev === 4 ? 7 : prev === 7 ? 2 : 4);
        }
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="banana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.8 0.15 85)" />
            <stop offset="100%" stopColor="oklch(0.7 0.12 70)" />
          </linearGradient>
          <linearGradient id="koko-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 35)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 45)" />
          </linearGradient>
          <linearGradient id="time-ok" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 165)" />
          </linearGradient>
          <linearGradient id="time-bad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 0)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 25)" />
          </linearGradient>
          <filter id="koko-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Banana piles */}
        {piles.map((pile, i) => (
          <motion.g key={i}>
            {/* Pile representation */}
            {Array.from({ length: Math.min(pile, 4) }, (_, j) => (
              <motion.ellipse
                key={j}
                cx={5 + i * 6} 
                cy={22 - j * 1.5} 
                rx="1.5" 
                ry="0.8"
                fill="url(#banana-gradient)"
                animate={animated && !shouldReduceMotion ? {
                  scale: [1, 1.05],
                  opacity: j < Math.ceil(pile / currentSpeed) ? [0.8, 1, 0.8] : 0.6
                } : {}}
                transition={{ 
                  duration: 1.5, 
                  repeat: animated && !shouldReduceMotion ? Infinity : 0, 
                  delay: i * 0.3 + j * 0.1,
                  repeatDelay: 2.5
                }}
              />
            ))}
            
            {/* Pile count */}
            <motion.text 
              x={5 + i * 6} 
              y={26} 
              fontSize="6" 
              fill="oklch(0.6 0.15 85)" 
              fontWeight="bold" 
              textAnchor="middle"
              animate={animated && !shouldReduceMotion ? {
                color: isValidSpeed ? "oklch(0.6 0.28 165)" : "oklch(0.6 0.3 25)"
              } : {}}
              transition={{
                duration: 0.5,
                repeat: animated && !shouldReduceMotion ? Infinity : 0,
                repeatDelay: 2.5
              }}
            >
              {pile}
            </motion.text>
            
            {/* Time needed for this pile */}
            <motion.text 
              x={5 + i * 6} 
              y={28} 
              fontSize="4" 
              fill={isValidSpeed ? "oklch(0.6 0.28 165)" : "oklch(0.6 0.3 25)"} 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {Math.ceil(pile / currentSpeed)}h
            </motion.text>
          </motion.g>
        ))}
        
        {/* Koko (monkey) */}
        <motion.circle
          cx="2" 
          cy="16" 
          r="3"
          fill="url(#koko-gradient)"
          filter="url(#koko-glow)"
          animate={animated && !shouldReduceMotion ? {
            scale: [1, 1.1],
            x: [0, 2, 0]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 2.5
          }}
        />
        
        {/* Koko's eyes */}
        <circle cx="1" cy="15" r="0.5" fill="white" />
        <circle cx="3" cy="15" r="0.5" fill="white" />
        <circle cx="1" cy="15" r="0.2" fill="black" />
        <circle cx="3" cy="15" r="0.2" fill="black" />
        
        {/* Speed indicator */}
        <motion.rect
          x="2" y="8" width="28" height="4" rx="2"
          fill={isValidSpeed ? "url(#time-ok)" : "url(#time-bad)"}
          fillOpacity="0.2"
          stroke={isValidSpeed ? "oklch(0.6 0.28 165)" : "oklch(0.6 0.3 25)"}
          strokeWidth="1"
          animate={animated && !shouldReduceMotion ? {
            strokeOpacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ 
            duration: 1.5, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 2.5
          }}
        />
        
        <text x="16" y="11" fontSize="6" fill={isValidSpeed ? "oklch(0.6 0.28 165)" : "oklch(0.6 0.3 25)"} fontWeight="bold" textAnchor="middle">
          SPEED: {currentSpeed} bananas/h
        </text>
        
        {/* Time constraint */}
        <rect x="2" y="2" width="28" height="4" rx="2" fill="oklch(0.95 0.02 220)" stroke="oklch(0.8 0.05 220)" strokeWidth="0.5" />
        <text x="16" y="5" fontSize="6" fill="oklch(0.6 0.25 220)" fontWeight="bold" textAnchor="middle">
          TIME: {currentTime}/{maxTime}h {isValidSpeed ? "✓" : "✗"}
        </text>
        
        {/* Binary search range indicator */}
        <motion.path
          d="M8 30 L24 30"
          stroke={isValidSpeed ? "oklch(0.6 0.28 165)" : "oklch(0.6 0.3 25)"}
          strokeWidth="2"
          strokeDasharray="2,2"
          animate={animated && !shouldReduceMotion ? {
            strokeDashoffset: [0, -8]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 2.5
          }}
        />
        <text x="16" y="32" fontSize="5" fill="oklch(0.5 0.15 220)" textAnchor="middle">
          Binary Search on Speed
        </text>
      </svg>
    </motion.div>
  );
}