/**
 * Disjoint Set Union (Union-Find) Illustration
 * Shows forest of trees with union and find operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { IllustrationProps } from '../type';

export function DisjointSetUnionIcon({ 
  className = '', 
  size = 32, 
  animated = true 
}: IllustrationProps) {
  const [step, setStep] = useState(0);
  
  // Different union states to animate through
  const states = [
    { groups: [[0], [1], [2], [3], [4]] },
    { groups: [[0, 1], [2], [3], [4]] },
    { groups: [[0, 1], [2, 3], [4]] },
    { groups: [[0, 1, 2, 3], [4]] },
    { groups: [[0, 1, 2, 3, 4]] }
  ];
  
  const nodes = [
    { id: 0, x: 6, y: 12, label: '0' },
    { id: 1, x: 12, y: 8, label: '1' },
    { id: 2, x: 18, y: 12, label: '2' },
    { id: 3, x: 24, y: 8, label: '3' },
    { id: 4, x: 15, y: 20, label: '4' }
  ];

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setStep(prev => (prev + 1) % states.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animated, states.length]);

  const currentState = states[step];
  
  const getGroupColor = (nodeId: number) => {
    const groupIndex = currentState.groups.findIndex(group => group.includes(nodeId));
    const colors = [
      'oklch(0.7 0.3 0)',      // Red group
      'oklch(0.7 0.3 120)',    // Green group  
      'oklch(0.7 0.3 240)',    // Blue group
      'oklch(0.7 0.3 60)',     // Yellow group
      'oklch(0.7 0.3 300)'     // Purple group
    ];
    return colors[groupIndex] || 'oklch(0.85 0.05 285)';
  };

  const getParentConnections = () => {
    const connections: Array<{from: number, to: number}> = [];
    
    currentState.groups.forEach(group => {
      if (group.length > 1) {
        const root = group[0]; // First element as root
        for (let i = 1; i < group.length; i++) {
          connections.push({ from: group[i], to: root });
        }
      }
    });
    
    return connections;
  };

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <filter id="dsu-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <marker id="parent-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.6 0.2 285)" />
          </marker>
        </defs>
        
        {/* Parent connections (edges pointing to root) */}
        {getParentConnections().map((conn, i) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          
          return (
            <motion.path
              key={`conn-${i}-${step}`}
              d={`M${fromNode.x} ${fromNode.y} L${toNode.x} ${toNode.y}`}
              stroke="oklch(0.6 0.2 285)"
              strokeWidth="1.5"
              markerEnd="url(#parent-arrow)"
              strokeDasharray="3,2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          );
        })}
        
        {/* Nodes with group coloring */}
        {nodes.map((node, i) => (
          <motion.g key={`node-${i}`}>
            <motion.circle
              cx={node.x} 
              cy={node.y} 
              r="2.5"
              fill={getGroupColor(node.id)}
              filter="url(#dsu-glow)"
              animate={animated ? {
                scale: [1, 1.1, 1],
                fill: getGroupColor(node.id)
              } : {}}
              transition={{ 
                scale: { duration: 0.6, delay: i * 0.1 },
                fill: { duration: 0.5 }
              }}
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
          </motion.g>
        ))}
        
        {/* Group boundaries visualization */}
        {currentState.groups.map((group, groupIndex) => {
          if (group.length > 1) {
            const groupNodes = group.map(id => nodes[id]);
            const minX = Math.min(...groupNodes.map(n => n.x)) - 4;
            const maxX = Math.max(...groupNodes.map(n => n.x)) + 4;
            const minY = Math.min(...groupNodes.map(n => n.y)) - 4;
            const maxY = Math.max(...groupNodes.map(n => n.y)) + 4;
            
            return (
              <motion.rect
                key={`group-${groupIndex}-${step}`}
                x={minX}
                y={minY}
                width={maxX - minX}
                height={maxY - minY}
                rx="3"
                fill={getGroupColor(group[0])}
                fillOpacity="0.1"
                stroke={getGroupColor(group[0])}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="2,2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            );
          }
          return null;
        })}
        
        {/* Operation label */}
        <motion.text 
          x="16" 
          y="30" 
          fontSize="6" 
          fill="oklch(0.6 0.25 285)" 
          fontWeight="bold" 
          textAnchor="middle"
          key={`label-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {step === 0 ? 'INITIAL' : 
           step === 1 ? 'UNION(0,1)' : 
           step === 2 ? 'UNION(2,3)' :
           step === 3 ? 'UNION(1,2)' : 'UNION(3,4)'}
        </motion.text>
        
        {/* Title */}
        <text x="16" y="4" fontSize="6" fill="oklch(0.6 0.25 285)" fontWeight="bold" textAnchor="middle">
          UNION-FIND
        </text>
      </svg>
    </motion.div>
  );
}