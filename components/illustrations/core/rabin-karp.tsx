/**
 * Rabin-Karp String Matching Algorithm Illustration
 * Shows rolling hash technique for pattern matching
 */

'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IllustrationProps } from '../type';

export function RabinKarpIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [currentWindow, setCurrentWindow] = useState(0);
  
  const text = "ABCABCAB";
  const pattern = "CAB";
  const patternHash = 456; // Mock hash value for pattern
  
  const windowHashes = [123, 234, 456, 567, 456, 678]; // Mock hash values
  const hashValue = windowHashes[currentWindow];
  const isMatch = hashValue === patternHash;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div 
      className={className}
      animate={animated && !shouldReduceMotion ? {
        scale: [1, 1.02, 1]
      } : {}}
      transition={{
        duration: 1.2,
        repeat: animated && !shouldReduceMotion ? Infinity : 0,
        onRepeat: () => {
          setCurrentWindow(prev => (prev + 1) % (text.length - pattern.length + 1));
        }
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="rk-text" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.75 0.15 258)" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 285)" />
          </linearGradient>
          <linearGradient id="rk-window" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 340)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 10)" />
          </linearGradient>
          <linearGradient id="rk-match" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 165)" />
          </linearGradient>
          <filter id="rk-glow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Text string */}
        {text.split('').map((char, i) => {
          const isInWindow = i >= currentWindow && i < currentWindow + pattern.length;
          
          return (
            <motion.g key={`text-${i}`}>
              <motion.rect
                x={2 + i * 3.5} 
                y="8" 
                width="3" 
                height="6" 
                rx="1.5"
                fill={isInWindow ? (isMatch ? "url(#rk-match)" : "url(#rk-window)") : "url(#rk-text)"}
                stroke={isInWindow ? "oklch(0.6 0.25 340)" : "oklch(0.8 0.05 258)"}
                strokeWidth={isInWindow ? "1.5" : "0.5"}
                filter={isInWindow ? "url(#rk-glow)" : undefined}
                animate={animated && !shouldReduceMotion ? {
                  scale: isInWindow ? [1, 1.05, 1] : 1
                } : {}}
                transition={{ 
                  duration: 0.5,
                  repeat: animated && !shouldReduceMotion ? Infinity : 0,
                  repeatDelay: 1.2
                }}
              />
              <text 
                x={3.5 + i * 3.5} 
                y="12" 
                fontSize="6" 
                fill="white" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {char}
              </text>
            </motion.g>
          );
        })}
        
        {/* Pattern reference */}
        <rect x="2" y="16" width="28" height="4" rx="2" fill="oklch(0.95 0.02 340)" stroke="oklch(0.8 0.05 340)" strokeWidth="0.5" />
        <text x="4" y="19" fontSize="5" fill="oklch(0.6 0.25 340)" fontWeight="bold">PATTERN:</text>
        <text x="16" y="19" fontSize="6" fill="oklch(0.6 0.25 340)" fontWeight="bold">{pattern}</text>
        <text x="24" y="19" fontSize="5" fill="oklch(0.6 0.25 340)" fontWeight="bold">H={patternHash}</text>
        
        {/* Current window hash */}
        <motion.rect
          x="2" y="22" width="28" height="4" rx="2"
          fill={isMatch ? "url(#rk-match)" : "oklch(0.95 0.02 340)"}
          fillOpacity="0.3"
          stroke={isMatch ? "oklch(0.6 0.28 142)" : "oklch(0.8 0.05 340)"}
          strokeWidth="1"
          animate={animated && !shouldReduceMotion ? {
            strokeOpacity: isMatch ? [0.5, 1, 0.5] : 0.5
          } : {}}
          transition={{ 
            duration: 1, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 1.2
          }}
        />
        <text x="4" y="25" fontSize="5" fill="oklch(0.6 0.25 340)" fontWeight="bold">WINDOW:</text>
        <motion.text 
          x={16 + currentWindow * 3.5} 
          y="25" 
          fontSize="6" 
          fill={isMatch ? "oklch(0.6 0.28 142)" : "oklch(0.6 0.25 340)"} 
          fontWeight="bold"
          animate={animated && !shouldReduceMotion ? {
            x: 16 + currentWindow * 3.5
          } : {}}
          transition={{ 
            duration: 0.5,
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 1.2
          }}
        >
          {text.slice(currentWindow, currentWindow + pattern.length)}
        </motion.text>
        <motion.text 
          x="24" 
          y="25" 
          fontSize="5" 
          fill={isMatch ? "oklch(0.6 0.28 142)" : "oklch(0.6 0.25 340)"} 
          fontWeight="bold"
          key={currentWindow}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          H={hashValue}
        </motion.text>
        
        {/* Rolling hash visualization */}
        <motion.path
          d={`M${5.5 + currentWindow * 3.5} 7 Q${5.5 + (currentWindow + 1) * 3.5} 5 ${5.5 + (currentWindow + 2) * 3.5} 7`}
          stroke="url(#rk-window)"
          strokeWidth="2"
          strokeDasharray="2,1"
          fill="none"
          animate={animated && !shouldReduceMotion ? {
            x: currentWindow * 3.5,
            strokeDashoffset: [0, -6]
          } : {}}
          transition={{ 
            x: { duration: 0.5 },
            strokeDashoffset: { 
              duration: 1.5, 
              repeat: animated && !shouldReduceMotion ? Infinity : 0,
              repeatDelay: 1.2
            }
          }}
        />
        
        {/* Match indicator */}
        {isMatch && (
          <motion.text
            x="16" 
            y="4" 
            fontSize="8" 
            fill="oklch(0.6 0.28 142)" 
            fontWeight="bold" 
            textAnchor="middle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            MATCH!
          </motion.text>
        )}
        
        {/* Algorithm name */}
        <text x="16" y="30" fontSize="5" fill="oklch(0.6 0.25 340)" fontWeight="bold" textAnchor="middle">
          RABIN-KARP O(n+m)
        </text>
      </svg>
    </motion.div>
  );
}