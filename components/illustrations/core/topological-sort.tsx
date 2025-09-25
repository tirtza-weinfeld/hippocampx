/**
 * Topological Sort (Kahn's Algorithm) Illustration
 * Shows directed graph with nodes being processed in topological order
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function TopologicalSortIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [processedNodes, setProcessedNodes] = useState<number[]>([]);
  const [currentQueue, setCurrentQueue] = useState<number[]>([0]);
  
  const nodes = [
    { id: 0, x: 8, y: 6, label: 'A', indegree: 0 },
    { id: 1, x: 16, y: 6, label: 'B', indegree: 1 },
    { id: 2, x: 24, y: 6, label: 'C', indegree: 1 },
    { id: 3, x: 8, y: 20, label: 'D', indegree: 1 },
    { id: 4, x: 16, y: 20, label: 'E', indegree: 2 },
    { id: 5, x: 24, y: 20, label: 'F', indegree: 1 }
  ];

  const edges = [
    { from: 0, to: 1 }, { from: 0, to: 3 },
    { from: 1, to: 2 }, { from: 1, to: 4 },
    { from: 3, to: 4 }, { from: 2, to: 5 }
  ];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setProcessedNodes(prev => {
          const next = prev.length < 6 ? [...prev, prev.length] : [];
          return next;
        });
        setCurrentQueue(prev => {
          if (prev.length === 0) return [0];
          const nextQueue = [];
          // Simulate Kahn's algorithm queue updates
          if (prev.includes(0) && !processedNodes.includes(0)) nextQueue.push(1);
          if (processedNodes.includes(0) && processedNodes.includes(1)) nextQueue.push(2);
          return nextQueue;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [animated, processedNodes]);

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="topo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 285)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 312)" />
          </linearGradient>
          <linearGradient id="processed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.32 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.28 165)" />
          </linearGradient>
          <filter id="topo-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="topo-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.6 0.15 285)" />
          </marker>
        </defs>
        
        {/* Directed edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];
          const isProcessed = processedNodes.includes(edge.from) && processedNodes.includes(edge.to);
          
          return (
            <motion.path
              key={i}
              d={`M${fromNode.x + 1.5} ${fromNode.y} L${toNode.x - 1.5} ${toNode.y}`}
              stroke={isProcessed ? "oklch(0.7 0.32 142)" : "oklch(0.75 0.1 285)"}
              strokeWidth="1.5"
              markerEnd="url(#topo-arrow)"
              animate={animated ? {
                opacity: isProcessed ? [0.5, 1, 0.8] : 0.5,
                strokeWidth: isProcessed ? [1.5, 2.5, 1.5] : 1.5
              } : {}}
              transition={{ duration: 0.8 }}
            />
          );
        })}
        
        {/* Graph nodes */}
        {nodes.map((node, i) => {
          const isProcessed = processedNodes.includes(node.id);
          const inQueue = currentQueue.includes(node.id);
          
          return (
            <motion.g key={i}>
              <motion.circle
                cx={node.x} 
                cy={node.y} 
                r="2.5"
                fill={
                  isProcessed ? "url(#processed-gradient)" :
                  inQueue ? "url(#topo-gradient)" : 
                  "oklch(0.85 0.05 285)"
                }
                filter={isProcessed || inQueue ? "url(#topo-glow)" : undefined}
                animate={animated ? {
                  scale: isProcessed ? [1, 1.3, 1] : inQueue ? [1, 1.1, 1] : 1,
                  opacity: isProcessed ? 1 : inQueue ? 0.9 : 0.6
                } : {}}
                transition={{ duration: 0.5 }}
              />
              <text 
                x={node.x} 
                y={node.y + 1} 
                fontSize="7" 
                fill="white" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {node.label}
              </text>
              
              {/* In-degree indicator */}
              {!isProcessed && (
                <text 
                  x={node.x + 4} 
                  y={node.y - 3} 
                  fontSize="5" 
                  fill="oklch(0.6 0.2 285)" 
                  fontWeight="bold"
                >
                  {node.indegree}
                </text>
              )}
            </motion.g>
          );
        })}
        
        {/* Queue indicator */}
        <rect x="2" y="26" width="28" height="4" rx="2" fill="oklch(0.92 0.03 285)" />
        <text x="3" y="29" fontSize="6" fill="oklch(0.6 0.25 312)" fontWeight="bold">QUEUE</text>
        
        {/* Processed order */}
        <text x="16" y="4" fontSize="6" fill="oklch(0.6 0.28 165)" fontWeight="bold" textAnchor="middle">
          TOPOLOGICAL ORDER
        </text>
      </svg>
    </motion.div>
  );
}