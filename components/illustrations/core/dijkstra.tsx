/**
 * Dijkstra's Algorithm Illustration
 * Shows shortest path finding with priority queue and distance updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function DijkstraIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [step, setStep] = useState(0);
  
  // Graph nodes
  const nodes = [
    { x: 6, y: 8, id: 'A', distance: 0 },
    { x: 16, y: 6, id: 'B', distance: 4 },
    { x: 26, y: 8, id: 'C', distance: 7 },
    { x: 12, y: 14, id: 'D', distance: 9 },
    { x: 20, y: 16, id: 'E', distance: 6 }
  ];
  
  // Graph edges with weights
  const edges = [
    { from: 0, to: 1, weight: 4, points: [6, 8, 16, 6] },
    { from: 0, to: 3, weight: 8, points: [6, 8, 12, 14] },
    { from: 1, to: 2, weight: 3, points: [16, 6, 26, 8] },
    { from: 1, to: 3, weight: 5, points: [16, 6, 12, 14] },
    { from: 1, to: 4, weight: 2, points: [16, 6, 20, 16] },
    { from: 2, to: 4, weight: 1, points: [26, 8, 20, 16] },
    { from: 3, to: 4, weight: 3, points: [12, 14, 20, 16] }
  ];
  
  // Dijkstra's algorithm steps
  const algorithmSteps = [
    { visited: [0], current: 0, distances: [0, Infinity, Infinity, Infinity, Infinity] },
    { visited: [0], current: 1, distances: [0, 4, Infinity, 8, Infinity] },
    { visited: [0, 1], current: 4, distances: [0, 4, Infinity, 8, 6] },
    { visited: [0, 1, 4], current: 2, distances: [0, 4, 7, 8, 6] },
    { visited: [0, 1, 4, 2], current: 3, distances: [0, 4, 7, 8, 6] },
    { visited: [0, 1, 4, 2, 3], current: -1, distances: [0, 4, 7, 8, 6] }
  ];
  
  const maxSteps = algorithmSteps.length;

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % maxSteps);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [animated, maxSteps]);

  const currentStep = algorithmSteps[step];
  const shortestPath = [0, 1, 4, 2]; // A → B → E → C

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="dijkstra-visited" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.35 125)" />
            <stop offset="100%" stopColor="oklch(0.65 0.3 145)" />
          </linearGradient>
          <radialGradient id="dijkstra-current" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.8 0.4 25)" />
            <stop offset="100%" stopColor="oklch(0.7 0.35 45)" />
          </radialGradient>
          <linearGradient id="dijkstra-unvisited" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.85 0.1 220)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 240)" />
          </linearGradient>
          <filter id="dijkstra-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Graph edges */}
        {edges.map((edge, i) => {
          const isInShortestPath = (
            (shortestPath.includes(edge.from) && shortestPath.includes(edge.to)) &&
            Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1
          );
          
          return (
            <motion.g key={i}>
              <motion.line
                x1={edge.points[0]} 
                y1={edge.points[1]} 
                x2={edge.points[2]} 
                y2={edge.points[3]}
                stroke={isInShortestPath ? "oklch(0.7 0.35 25)" : "oklch(0.6 0.2 220)"}
                strokeWidth={isInShortestPath ? "2.5" : "1.5"}
                opacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
              
              {/* Edge weight labels */}
              <motion.text
                x={(edge.points[0] + edge.points[2]) / 2} 
                y={(edge.points[1] + edge.points[3]) / 2 - 1} 
                fontSize="3"
                fill="oklch(0.5 0.2 220)"
                fontWeight="bold"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {edge.weight}
              </motion.text>
            </motion.g>
          );
        })}
        
        {/* Graph nodes */}
        {nodes.map((node, i) => {
          const isVisited = currentStep.visited.includes(i);
          const isCurrent = currentStep.current === i;
          const distance = currentStep.distances[i];
          
          return (
            <motion.g key={i}>
              <motion.circle
                cx={node.x} 
                cy={node.y} 
                r="3.5"
                fill={
                  isCurrent ? "url(#dijkstra-current)" :
                  isVisited ? "url(#dijkstra-visited)" : 
                  "url(#dijkstra-unvisited)"
                }
                stroke={isCurrent ? "oklch(0.8 0.4 25)" : "oklch(0.5 0.2 220)"}
                strokeWidth={isCurrent ? "2" : "1"}
                filter={isCurrent ? "url(#dijkstra-glow)" : undefined}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isCurrent ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  delay: i * 0.1,
                  scale: { duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }
                }}
              />
              
              <motion.text
                x={node.x} 
                y={node.y + 1} 
                fontSize="4"
                fill="white"
                fontWeight="bold"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {node.id}
              </motion.text>
              
              {/* Distance labels */}
              <motion.text
                x={node.x} 
                y={node.y - 5} 
                fontSize="3"
                fill={isVisited ? "oklch(0.7 0.35 125)" : "oklch(0.6 0.2 220)"}
                fontWeight="bold"
                textAnchor="middle"
                animate={{ opacity: animated ? [1, 0.7, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {distance === Infinity ? '∞' : distance}
              </motion.text>
            </motion.g>
          );
        })}
        
        {/* Priority queue visualization */}
        <rect x="1" y="22" width="12" height="8" rx="2" fill="oklch(0.9 0.05 220)" stroke="oklch(0.7 0.15 220)" strokeWidth="0.5" />
        <text x="2" y="25" fontSize="3" fill="oklch(0.6 0.2 220)" fontWeight="bold">QUEUE</text>
        
        {/* Current distances in queue */}
        <text x="2" y="28" fontSize="2.5" fill="oklch(0.5 0.15 220)" fontWeight="bold">
          {nodes
            .map((node, i) => ({ node, i }))
            .filter(({ i }) => !currentStep.visited.includes(i))
            .map(({ node, i }) => `${node.id}:${currentStep.distances[i] === Infinity ? '∞' : currentStep.distances[i]}`)
            .join(' ')}
        </text>
        
        {/* Algorithm status */}
        <text x="16" y="25" fontSize="4" fill="oklch(0.7 0.35 25)" fontWeight="bold" textAnchor="middle">
          Step {step + 1}/{maxSteps}
        </text>
        
        {/* Dijkstra label */}
        <text x="16" y="31" fontSize="6" fill="oklch(0.5 0.2 220)" fontWeight="bold" textAnchor="middle">
          DIJKSTRA&apos;S ALGORITHM
        </text>
      </svg>
    </motion.div>
  );
}