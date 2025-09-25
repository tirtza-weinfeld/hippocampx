/**
 * Trie Data Structure Illustration
 * Shows prefix tree with word storage and search
 */

'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IllustrationProps } from '../type';

export function TrieIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [searchStep, setSearchStep] = useState(0);
  const searchWord = "CAT";
  const maxSteps = searchWord.length + 1;
  const shouldReduceMotion = useReducedMotion();

  // Trie structure for words: CAR, CAT, CARD
  const nodes = [
    { x: 16, y: 4, char: '●', id: 0, parent: -1 },   // root
    { x: 16, y: 8, char: 'C', id: 1, parent: 0 },    // C
    { x: 16, y: 12, char: 'A', id: 2, parent: 1 },   // CA
    { x: 12, y: 16, char: 'R', id: 3, parent: 2 },   // CAR
    { x: 20, y: 16, char: 'T', id: 4, parent: 2 },   // CAT
    { x: 12, y: 20, char: 'D', id: 5, parent: 3 },   // CARD
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [2, 4], [3, 5]
  ];

  // Words stored in trie
  const wordEndings = [3, 4, 5]; // CAR, CAT, CARD
  const searchPath = [0, 1, 2, 4]; // Path for "CAT"

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
          setSearchStep(prev => (prev + 1) % maxSteps);
        }
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="trie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 275)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 295)" />
          </linearGradient>
          <radialGradient id="active-node" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.8 0.35 85)" />
            <stop offset="100%" stopColor="oklch(0.7 0.3 105)" />
          </radialGradient>
          <radialGradient id="word-end" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.8 0.3 25)" />
            <stop offset="100%" stopColor="oklch(0.7 0.25 45)" />
          </radialGradient>
          <filter id="trie-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Trie edges */}
        {edges.map(([parent, child], i) => {
          const isInPath = searchStep > 0 && 
            searchPath.slice(0, searchStep).includes(parent) && 
            searchPath.slice(0, searchStep + 1).includes(child);
          
          return (
            <motion.line
              key={i}
              x1={nodes[parent].x} 
              y1={nodes[parent].y} 
              x2={nodes[child].x} 
              y2={nodes[child].y}
              stroke={isInPath ? "oklch(0.7 0.3 85)" : "oklch(0.6 0.28 275)"}
              strokeWidth={isInPath ? "2.5" : "1.5"}
              opacity={isInPath ? 1 : 0.7}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          );
        })}
        
        {/* Trie nodes */}
        {nodes.map((node, i) => {
          const isCurrent = searchStep > 0 && searchPath[searchStep - 1] === i;
          const isWordEnd = wordEndings.includes(i);
          
          return (
            <motion.g key={i}>
              <motion.circle
                cx={node.x} 
                cy={node.y} 
                r={node.char === '●' ? "2.5" : "3"}
                fill={
                  isCurrent ? "url(#active-node)" : 
                  isWordEnd ? "url(#word-end)" : 
                  "url(#trie-gradient)"
                }
                stroke={
                  isCurrent ? "oklch(0.7 0.3 85)" : 
                  isWordEnd ? "oklch(0.7 0.25 25)" : 
                  "oklch(0.5 0.25 275)"
                }
                strokeWidth={isCurrent ? "2" : isWordEnd ? "1.5" : "1"}
                filter={isCurrent ? "url(#trie-glow)" : undefined}
                initial={{ scale: 0 }}
                animate={animated && !shouldReduceMotion ? { 
                  scale: isCurrent ? [1, 1.15, 1] : 1
                } : {}}
                transition={{ 
                  delay: i * 0.1,
                  scale: { 
                    duration: 0.4, 
                    repeat: animated && !shouldReduceMotion && isCurrent ? Infinity : 0, 
                    repeatDelay: 0.8 
                  }
                }}
              />
              
              {node.char !== '●' && (
                <motion.text
                  x={node.x} 
                  y={node.y + 1.5} 
                  fontSize="5"
                  fill="white"
                  fontWeight="bold"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  {node.char}
                </motion.text>
              )}
            </motion.g>
          );
        })}
        
        {/* Search visualization */}
        <motion.text
          x="2" y="26" 
          fontSize="5" 
          fill="oklch(0.7 0.3 85)"
          fontWeight="bold"
          animate={animated && !shouldReduceMotion ? { opacity: [1, 0.6, 1] } : {}}
          transition={{ 
            duration: 1, 
            repeat: animated && !shouldReduceMotion ? Infinity : 0,
            repeatDelay: 1.2
          }}
        >
          SEARCH: {searchWord.slice(0, Math.max(0, searchStep - 1))}
          {searchStep > 0 && searchStep <= searchWord.length && (
            <tspan fill="oklch(0.8 0.35 85)">
              {searchWord[searchStep - 1]}
            </tspan>
          )}
        </motion.text>
        
        {/* Word endings indicator */}
        {wordEndings.map((nodeId, i) => (
          <motion.circle
            key={`end-${nodeId}`}
            cx={nodes[nodeId].x + 4} 
            cy={nodes[nodeId].y - 2} 
            r="1"
            fill="oklch(0.8 0.3 25)"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
          />
        ))}
        
        {/* Labels */}
        <text x="26" y="6" fontSize="4" fill="oklch(0.6 0.28 275)" fontWeight="bold">ROOT</text>
        <text x="26" y="26" fontSize="4" fill="oklch(0.7 0.25 25)" fontWeight="bold">WORD END</text>
        
        {/* Trie label */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.5 0.2 275)" fontWeight="bold" textAnchor="middle">
          TRIE (PREFIX TREE)
        </text>
      </svg>
    </motion.div>
  );
}