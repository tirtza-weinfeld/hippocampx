/**
 * Problem-Specific Illustrations - 2025 Edition
 * Cutting-edge SVG illustrations for specific algorithmic problems
 * 
 * Design Philosophy:
 * - Advanced gradients with OKLCH color space
 * - Micro-animations and morphing elements
 * - 3D perspective and depth
 * - Interactive hover states
 * - Modern glassmorphism effects
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ProblemIllustrationProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

// Advanced gradient definitions for 2025
// const modernGradients = {
//   stock: 'linear-gradient(135deg, oklch(0.7 0.3 142) 0%, oklch(0.6 0.25 178) 100%)',
//   array: 'linear-gradient(135deg, oklch(0.65 0.28 258) 0%, oklch(0.55 0.22 285) 100%)',
//   tree: 'linear-gradient(135deg, oklch(0.68 0.25 145) 0%, oklch(0.58 0.2 172) 100%)',
//   graph: 'linear-gradient(135deg, oklch(0.62 0.32 315) 0%, oklch(0.52 0.28 342) 100%)',
//   dp: 'linear-gradient(135deg, oklch(0.7 0.35 65) 0%, oklch(0.6 0.3 92) 100%)',
// };

// Two Pointers Problem
export const TwoPointersIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{
          filter: isHovered ? 'drop-shadow(0 8px 25px rgba(66, 153, 225, 0.4))' : 'drop-shadow(0 4px 12px rgba(66, 153, 225, 0.2))',
          transition: 'filter 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <defs>
          <linearGradient id="array-bg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.95 0.02 258)" />
            <stop offset="100%" stopColor="oklch(0.92 0.03 285)" />
          </linearGradient>
          <linearGradient id="pointer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.28 258)" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 285)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Array container with glassmorphism */}
        <rect 
          x="4" y="12" width="24" height="8" rx="4" 
          fill="url(#array-bg)"
          stroke="oklch(0.8 0.05 258)"
          strokeWidth="0.5"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        />
        
        {/* Array elements with micro-animations */}
        {[6, 9, 12, 15, 18, 21, 24].map((x, i) => (
          <motion.rect
            key={i}
            x={x} y="13.5" width="2.5" height="5" rx="1.25"
            fill={i === 0 || i === 6 ? "url(#pointer-gradient)" : "oklch(0.85 0.03 258)"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.2, y: -2 }}
          />
        ))}
        
        {/* Left pointer with advanced animation */}
        <motion.g
          animate={animated ? { 
            y: [0, -2, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          <path 
            d="M7 8 L7 11" 
            stroke="url(#pointer-gradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle cx="7" cy="6.5" r="2" fill="url(#pointer-gradient)" filter="url(#glow)" />
          <text x="7" y="7.5" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">L</text>
        </motion.g>
        
        {/* Right pointer */}
        <motion.g
          animate={animated ? { 
            y: [0, -2, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 1
          }}
        >
          <path 
            d="M25 8 L25 11" 
            stroke="url(#pointer-gradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <circle cx="25" cy="6.5" r="2" fill="url(#pointer-gradient)" filter="url(#glow)" />
          <text x="25" y="7.5" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">R</text>
        </motion.g>
        
        {/* Movement arrows with morphing animation */}
        <motion.path 
          d="M10 24 L14 24" 
          stroke="oklch(0.6 0.25 258)" 
          strokeWidth="2" 
          strokeLinecap="round"
          markerEnd="url(#arrowhead-modern)"
          animate={animated ? { 
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0]
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path 
          d="M22 24 L18 24" 
          stroke="oklch(0.6 0.25 258)" 
          strokeWidth="2" 
          strokeLinecap="round"
          markerEnd="url(#arrowhead-modern)"
          animate={animated ? { 
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0]
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        <defs>
          <marker id="arrowhead-modern" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="oklch(0.6 0.25 258)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
};

// Stock Trading Problem with 3D Chart Effect
export const StockTradingIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '100px' }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{
          filter: isHovered ? 'drop-shadow(0 12px 30px rgba(34, 197, 94, 0.4))' : 'drop-shadow(0 6px 15px rgba(34, 197, 94, 0.2))',
          transformStyle: 'preserve-3d'
        }}
        whileHover={{ rotateY: 10, rotateX: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <defs>
          <linearGradient id="stock-chart" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 142)" />
            <stop offset="50%" stopColor="oklch(0.75 0.25 165)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 178)" />
          </linearGradient>
          <linearGradient id="profit-area" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 142)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.7 0.3 142)" stopOpacity="0.1" />
          </linearGradient>
          <filter id="chart-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Chart background with neumorphism */}
        <rect 
          x="2" y="2" width="28" height="28" rx="6"
          fill="oklch(0.96 0.01 145)"
          stroke="oklch(0.9 0.02 145)"
          strokeWidth="0.5"
          style={{
            boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.1)'
          }}
        />
        
        {/* Price line with morphing animation */}
        <motion.path
          d="M4 24 Q8 20 12 18 T20 10 Q24 8 28 12"
          stroke="url(#stock-chart)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#chart-glow)"
          animate={animated ? {
            pathLength: [0, 1],
            opacity: [0, 1]
          } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Profit area */}
        <motion.path
          d="M4 24 Q8 20 12 18 T20 10 Q24 8 28 12 L28 28 L4 28 Z"
          fill="url(#profit-area)"
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? [0, 0.6, 0.4] : 0.4 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Buy/Sell indicators with 3D effect */}
        <motion.g
          animate={animated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <circle cx="8" cy="20" r="3" fill="oklch(0.65 0.3 142)" filter="url(#chart-glow)" />
          <text x="8" y="21" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">BUY</text>
        </motion.g>
        
        <motion.g
          animate={animated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        >
          <circle cx="24" cy="8" r="3" fill="oklch(0.6 0.35 25)" filter="url(#chart-glow)" />
          <text x="24" y="9" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">SELL</text>
        </motion.g>
        
        {/* Profit arrow with advanced morphing */}
        <motion.path
          d="M10 18 Q16 12 22 10"
          stroke="oklch(0.7 0.3 142)"
          strokeWidth="2"
          strokeDasharray="2,2"
          fill="none"
          markerEnd="url(#profit-arrow)"
          animate={animated ? {
            strokeDashoffset: [0, -8],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <defs>
          <marker id="profit-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="oklch(0.7 0.3 142)" />
          </marker>
        </defs>
      </motion.svg>
    </motion.div>
  );
};

// Sliding Window Problem
export const SlidingWindowIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="window-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.68 0.25 285)" />
            <stop offset="100%" stopColor="oklch(0.58 0.2 312)" />
          </linearGradient>
          <filter id="window-blur">
            <feGaussianBlur stdDeviation="0.8" result="blur"/>
            <feOffset in="blur" dx="0" dy="2" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Array elements */}
        {[4, 7, 10, 13, 16, 19, 22, 25, 28].map((x, i) => (
          <rect
            key={i}
            x={x} y="14" width="2.5" height="6" rx="1.25"
            fill="oklch(0.88 0.03 285)"
            stroke="oklch(0.82 0.05 285)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Sliding window with glassmorphism */}
        <motion.rect
          x="7" y="12" width="12" height="10" rx="2"
          fill="url(#window-gradient)"
          fillOpacity="0.2"
          stroke="url(#window-gradient)"
          strokeWidth="2"
          filter="url(#window-blur)"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
          animate={animated ? {
            x: [7, 13, 7],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        />
        
        {/* Window label */}
        <motion.text
          x="13" y="8" 
          fontSize="8" 
          fill="oklch(0.58 0.2 312)"
          fontWeight="bold" 
          textAnchor="middle"
          animate={animated ? {
            x: [13, 19, 13],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        >
          WINDOW
        </motion.text>
        
        {/* Movement indicators */}
        <motion.path
          d="M4 26 L28 26"
          stroke="oklch(0.58 0.2 312)"
          strokeWidth="1"
          strokeDasharray="1,2"
          animate={animated ? {
            strokeDashoffset: [0, -6],
            transition: { duration: 2, repeat: Infinity }
          } : {}}
        />
      </svg>
    </motion.div>
  );
};

// Tree Traversal Problem
export const TreeTraversalIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  const [traversalStep, setTraversalStep] = useState(0);
  
  React.useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setTraversalStep(prev => (prev + 1) % 7);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [animated]);
  
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="node-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.8 0.15 145)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 172)" />
          </radialGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Tree edges with 3D effect */}
        {[
          { d: "M16 8 L10 16", delay: 0 },
          { d: "M16 8 L22 16", delay: 1 },
          { d: "M10 16 L6 24", delay: 2 },
          { d: "M10 16 L14 24", delay: 3 },
          { d: "M22 16 L18 24", delay: 4 },
          { d: "M22 16 L26 24", delay: 5 }
        ].map((edge, i) => (
          <motion.path
            key={i}
            d={edge.d}
            stroke="oklch(0.7 0.1 145)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={animated ? {
              stroke: traversalStep >= edge.delay ? "oklch(0.65 0.25 145)" : "oklch(0.85 0.05 145)",
              strokeWidth: traversalStep >= edge.delay ? 3.5 : 2.5
            } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
        
        {/* Tree nodes with traversal animation */}
        {[
          { cx: 16, cy: 8, label: "1", step: 0 },
          { cx: 10, cy: 16, label: "2", step: 1 },
          { cx: 22, cy: 16, label: "3", step: 6 },
          { cx: 6, cy: 24, label: "4", step: 2 },
          { cx: 14, cy: 24, label: "5", step: 3 },
          { cx: 18, cy: 24, label: "6", step: 4 },
          { cx: 26, cy: 24, label: "7", step: 5 }
        ].map((node, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={node.cx} cy={node.cy} r="3.5"
              fill="url(#node-gradient)"
              filter="url(#node-glow)"
              animate={animated ? {
                scale: traversalStep >= node.step ? [1, 1.3, 1] : 1,
                fill: traversalStep >= node.step ? "oklch(0.7 0.3 142)" : "url(#node-gradient)"
              } : {}}
              transition={{ duration: 0.4 }}
            />
            <text 
              x={node.cx} y={node.cy + 1} 
              fontSize="8" 
              fill="white" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};

// Matrix Problem (2D Array)
export const MatrixIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <pattern id="matrix-pattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="oklch(0.95 0.02 258)" />
            <rect width="3.5" height="3.5" x="0.25" y="0.25" fill="oklch(0.88 0.03 285)" rx="0.5" />
          </pattern>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.32 315)" />
            <stop offset="100%" stopColor="oklch(0.55 0.28 342)" />
          </linearGradient>
        </defs>
        
        {/* Matrix grid */}
        <rect x="4" y="4" width="24" height="24" fill="url(#matrix-pattern)" rx="2" />
        
        {/* Path through matrix */}
        <motion.path
          d="M6 6 L10 6 L10 10 L14 10 L14 14 L18 14 L18 18 L22 18 L22 22 L26 22 L26 26"
          stroke="url(#path-gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2,1"
          animate={animated ? {
            pathLength: [0, 1],
            strokeDashoffset: [0, -6]
          } : {}}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" },
            strokeDashoffset: { duration: 1, repeat: Infinity }
          }}
        />
        
        {/* Start and end markers */}
        <circle cx="6" cy="6" r="2" fill="oklch(0.7 0.3 142)" />
        <circle cx="26" cy="26" r="2" fill="oklch(0.6 0.35 25)" />
        <text x="6" y="7" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">S</text>
        <text x="26" y="27" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">E</text>
      </svg>
    </motion.div>
  );
};

// Dynamic Programming Problem
export const DynamicProgrammingIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="dp-table" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.35 65)" />
            <stop offset="100%" stopColor="oklch(0.6 0.3 92)" />
          </linearGradient>
          <radialGradient id="dp-cell" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.1 65)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 92)" />
          </radialGradient>
        </defs>
        
        {/* DP Table Grid */}
        {[0, 1, 2, 3, 4].map(row => 
          [0, 1, 2, 3, 4].map(col => (
            <motion.rect
              key={`${row}-${col}`}
              x={4 + col * 5} y={4 + row * 5} 
              width="4.5" height="4.5" 
              rx="1"
              fill={row <= col ? "url(#dp-cell)" : "oklch(0.92 0.02 65)"}
              stroke="oklch(0.8 0.1 65)"
              strokeWidth="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                fill: animated && row + col < 6 ? 
                  ["oklch(0.92 0.02 65)", "url(#dp-cell)", "oklch(0.92 0.02 65)"] :
                  row <= col ? "url(#dp-cell)" : "oklch(0.92 0.02 65)"
              }}
              transition={{ 
                delay: (row + col) * 0.1,
                scale: { type: "spring", stiffness: 400, damping: 25 },
                fill: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))
        )}
        
        {/* Arrows showing dependency */}
        <motion.path
          d="M8 12 L12 8"
          stroke="url(#dp-table)"
          strokeWidth="1.5"
          markerEnd="url(#dp-arrow)"
          animate={animated ? {
            opacity: [0, 1, 0],
            pathLength: [0, 1, 0]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <defs>
          <marker id="dp-arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="oklch(0.6 0.3 92)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
};

// Graph Problem
export const GraphIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="graph-node" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="oklch(0.75 0.25 315)" />
            <stop offset="100%" stopColor="oklch(0.55 0.3 342)" />
          </radialGradient>
          <linearGradient id="graph-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.2 315)" />
            <stop offset="100%" stopColor="oklch(0.45 0.25 342)" />
          </linearGradient>
        </defs>
        
        {/* Graph edges */}
        {[
          { d: "M8 8 L16 12", delay: 0 },
          { d: "M8 8 L12 20", delay: 0.3 },
          { d: "M16 12 L24 8", delay: 0.6 },
          { d: "M16 12 L20 24", delay: 0.9 },
          { d: "M12 20 L20 24", delay: 1.2 },
          { d: "M24 8 L20 24", delay: 1.5 }
        ].map((edge, i) => (
          <motion.path
            key={i}
            d={edge.d}
            stroke="url(#graph-edge)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animated ? {
              pathLength: 1,
              opacity: [0, 1, 0.7]
            } : { pathLength: 1, opacity: 0.7 }}
            transition={{ 
              delay: edge.delay,
              duration: 0.8,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Graph nodes */}
        {[
          { cx: 8, cy: 8, label: "A" },
          { cx: 24, cy: 8, label: "B" },
          { cx: 16, cy: 12, label: "C" },
          { cx: 12, cy: 20, label: "D" },
          { cx: 20, cy: 24, label: "E" }
        ].map((node, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={node.cx} cy={node.cy} r="4"
              fill="url(#graph-node)"
              stroke="oklch(0.9 0.05 315)"
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ 
                delay: i * 0.2, 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }}
            />
            <text 
              x={node.cx} y={node.cy + 1} 
              fontSize="8" 
              fill="white" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};

// Backtracking Problem
export const BacktrackingIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  const [currentPath, setCurrentPath] = useState(0);
  
  React.useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setCurrentPath(prev => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [animated]);

  const paths = [
    "M6 6 L16 6 L26 6",
    "M6 6 L16 6 L16 16 L26 16", 
    "M6 6 L6 16 L16 16 L26 16",
    "M6 6 L6 16 L6 26 L16 26 L26 26"
  ];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="backtrack-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 258)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 285)" />
          </linearGradient>
          <filter id="trail-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid dots */}
        {[6, 16, 26].map(x =>
          [6, 16, 26].map(y => (
            <circle
              key={`${x}-${y}`}
              cx={x} cy={y} r="1.5"
              fill="oklch(0.8 0.1 258)"
            />
          ))
        )}
        
        {/* Exploration paths (faded) */}
        {paths.slice(0, currentPath).map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke="oklch(0.8 0.1 258)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            fill="none"
            opacity="0.3"
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
        
        {/* Current active path */}
        <motion.path
          d={paths[currentPath]}
          stroke="url(#backtrack-gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#trail-glow)"
          animate={animated ? {
            pathLength: [0, 1],
            opacity: [0, 1, 0.7]
          } : { pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* Decision points */}
        {[
          { cx: 6, cy: 6, label: "START" },
          { cx: 26, cy: 26, label: "GOAL" }
        ].map((point, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={point.cx} cy={point.cy} r="3"
              fill="url(#backtrack-gradient)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i }}
            />
            <text 
              x={point.cx} y={point.cy - 6} 
              fontSize="6" 
              fill="oklch(0.6 0.2 285)" 
              fontWeight="bold" 
              textAnchor="middle"
            >
              {point.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};

// Binary Search Problem
export const BinarySearchIcon: React.FC<ProblemIllustrationProps> = ({ 
  className = '', 
  size = 32, 
  animated = true 
}) => {
  const [searchStep, setSearchStep] = useState(0);
  
  React.useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setSearchStep(prev => (prev + 1) % 4);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [animated]);

  const elements = [1, 3, 5, 7, 9, 11, 13, 15];
  const searchRanges = [
    { left: 0, right: 7, mid: 3 },
    { left: 4, right: 7, mid: 5 },
    { left: 6, right: 7, mid: 6 },
    { left: 6, right: 6, mid: 6 }
  ];

  return (
    <motion.div className={className}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="binary-array" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.9 0.05 258)" />
            <stop offset="100%" stopColor="oklch(0.85 0.08 285)" />
          </linearGradient>
          <radialGradient id="target-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.7 0.3 142)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 165)" />
          </radialGradient>
        </defs>
        
        {/* Array elements */}
        {elements.map((val, i) => {
          const x = 2 + i * 3.5;
          const range = searchRanges[searchStep];
          const isInRange = i >= range.left && i <= range.right;
          const isMid = i === range.mid;
          
          return (
            <motion.g key={i}>
              <motion.rect
                x={x} y="12" width="3" height="8" rx="1.5"
                fill={isMid ? "url(#target-glow)" : isInRange ? "url(#binary-array)" : "oklch(0.95 0.02 258)"}
                stroke={isMid ? "oklch(0.6 0.25 142)" : "oklch(0.8 0.05 258)"}
                strokeWidth={isMid ? "2" : "0.5"}
                animate={animated ? {
                  scale: isMid ? [1, 1.2, 1] : 1,
                  y: isMid ? [12, 10, 12] : 12
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <text 
                x={x + 1.5} y="17" 
                fontSize="6" 
                fill={isMid ? "white" : "oklch(0.5 0.1 258)"} 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {val}
              </text>
            </motion.g>
          );
        })}
        
        {/* Search range indicator */}
        <motion.rect
          x={2 + searchRanges[searchStep].left * 3.5}
          y="10"
          width={(searchRanges[searchStep].right - searchRanges[searchStep].left + 1) * 3.5}
          height="12"
          rx="2"
          fill="none"
          stroke="oklch(0.65 0.25 258)"
          strokeWidth="2"
          strokeDasharray="4,2"
          animate={animated ? {
            strokeDashoffset: [0, -12],
            opacity: [0.7, 1, 0.7]
          } : {}}
          transition={{ 
            strokeDashoffset: { duration: 2, repeat: Infinity },
            opacity: { duration: 1.5, repeat: Infinity }
          }}
        />
        
        {/* Left/Right pointers */}
        <motion.text
          x={2 + searchRanges[searchStep].left * 3.5 + 1.5}
          y="8"
          fontSize="6"
          fill="oklch(0.6 0.25 258)"
          fontWeight="bold"
          textAnchor="middle"
        >
          L
        </motion.text>
        <motion.text
          x={2 + searchRanges[searchStep].right * 3.5 + 1.5}
          y="8"
          fontSize="6"
          fill="oklch(0.6 0.25 258)"
          fontWeight="bold"
          textAnchor="middle"
        >
          R
        </motion.text>
        
        {/* Target value */}
        <text x="16" y="28" fontSize="8" fill="oklch(0.6 0.25 142)" fontWeight="bold" textAnchor="middle">
          Target: 13
        </text>
      </svg>
    </motion.div>
  );
};

// Comprehensive problem illustration mapping
export const problemIllustrations = {
  // Array problems
  two_sum: TwoPointersIcon,
  three_sum: TwoPointersIcon,
  container_with_most_water: TwoPointersIcon,
  trapping_rain_water: TwoPointersIcon,
  
  // Stock problems
  best_time_to_buy_and_sell_stock: StockTradingIcon,
  best_time_to_buy_and_sell_stock_II: StockTradingIcon,
  best_time_to_buy_and_sell_stock_III: StockTradingIcon,
  best_time_to_buy_and_sell_stock_IV: StockTradingIcon,
  
  // Sliding window
  longest_substring_without_repeating: SlidingWindowIcon,
  minimum_window_substring: SlidingWindowIcon,
  sliding_window_maximum: SlidingWindowIcon,
  
  // Tree problems
  binary_tree_inorder_traversal: TreeTraversalIcon,
  binary_tree_level_order_traversal: TreeTraversalIcon,
  binary_tree_maximum_path_sum: TreeTraversalIcon,
  validate_binary_search_tree: TreeTraversalIcon,
  
  // Matrix problems
  word_search: MatrixIcon,
  number_of_islands: MatrixIcon,
  rotting_oranges: MatrixIcon,
  path_with_minimum_effort: MatrixIcon,
  
  // Default fallback
  default: TwoPointersIcon
};

export const getProblemIllustration = (problemName: string) => {
  const key = problemName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return problemIllustrations[key as keyof typeof problemIllustrations] || problemIllustrations.default;
};