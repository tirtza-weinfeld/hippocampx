/**
 * SVG Illustrations for Algorithm Dictionary
 * Beautiful, modern, accessible SVG icons for algorithms, data structures, and topics
 * 
 * Design principles:
 * - Consistent visual style across all illustrations
 * - Accessible with proper ARIA labels
 * - Scalable and performant
 * - Modern 2025 aesthetic with subtle gradients and clean lines
 */

import React from 'react';

// Common props for all SVG illustrations
interface IllustrationProps {
  className?: string;
  size?: number;
}

// Algorithm Illustrations
export const BinarySearchIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Binary Search Algorithm"
  >
    <defs>
      <linearGradient id="binary-search-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    {/* Array representation */}
    <rect x="2" y="8" width="20" height="8" rx="1" fill="url(#binary-search-gradient)" opacity="0.1" />
    {/* Array elements */}
    <rect x="3" y="9" width="2" height="6" rx="0.5" fill="#e5e7eb" />
    <rect x="6" y="9" width="2" height="6" rx="0.5" fill="#e5e7eb" />
    <rect x="9" y="9" width="2" height="6" rx="0.5" fill="url(#binary-search-gradient)" />
    <rect x="12" y="9" width="2" height="6" rx="0.5" fill="#e5e7eb" />
    <rect x="15" y="9" width="2" height="6" rx="0.5" fill="#e5e7eb" />
    <rect x="18" y="9" width="2" height="6" rx="0.5" fill="#e5e7eb" />
    {/* Search arrows */}
    <path d="M10 4 L10 7" stroke="url(#binary-search-gradient)" strokeWidth="2" markerEnd="url(#arrowhead)" />
    <path d="M6 18 L10 18" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrowhead-gray)" />
    <path d="M14 18 L10 18" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arrowhead-gray)" />
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="url(#binary-search-gradient)" />
      </marker>
      <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
      </marker>
    </defs>
  </svg>
);

export const DFSIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Depth-First Search Algorithm"
  >
    <defs>
      <linearGradient id="dfs-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Tree nodes */}
    <circle cx="12" cy="4" r="2" fill="url(#dfs-gradient)" />
    <circle cx="8" cy="10" r="2" fill="#d1d5db" />
    <circle cx="16" cy="10" r="2" fill="#d1d5db" />
    <circle cx="6" cy="16" r="2" fill="#d1d5db" />
    <circle cx="10" cy="16" r="2" fill="#d1d5db" />
    <circle cx="14" cy="16" r="2" fill="#d1d5db" />
    <circle cx="18" cy="16" r="2" fill="#d1d5db" />
    {/* Tree edges */}
    <path d="M11 5.5 L9 8.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M13 5.5 L15 8.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M7.2 11.5 L6.8 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M8.8 11.5 L9.2 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M15.2 11.5 L14.8 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M16.8 11.5 L17.2 14.5" stroke="#e5e7eb" strokeWidth="2" />
    {/* DFS path - animated */}
    <path 
      d="M12 6 L8 8 L6 14" 
      stroke="url(#dfs-gradient)" 
      strokeWidth="3" 
      strokeLinecap="round"
      fill="none"
      opacity="0.8"
    />
    {/* Path numbers */}
    <text x="12" y="5" fontSize="8" fill="white" textAnchor="middle">1</text>
    <text x="8" y="11" fontSize="8" fill="white" textAnchor="middle">2</text>
    <text x="6" y="17" fontSize="8" fill="white" textAnchor="middle">3</text>
  </svg>
);

export const BFSIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Breadth-First Search Algorithm"
  >
    <defs>
      <linearGradient id="bfs-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    {/* Tree nodes with level indicators */}
    <circle cx="12" cy="4" r="2" fill="url(#bfs-gradient)" />
    <circle cx="8" cy="10" r="2" fill="url(#bfs-gradient)" opacity="0.7" />
    <circle cx="16" cy="10" r="2" fill="url(#bfs-gradient)" opacity="0.7" />
    <circle cx="6" cy="16" r="2" fill="url(#bfs-gradient)" opacity="0.4" />
    <circle cx="10" cy="16" r="2" fill="url(#bfs-gradient)" opacity="0.4" />
    <circle cx="14" cy="16" r="2" fill="url(#bfs-gradient)" opacity="0.4" />
    <circle cx="18" cy="16" r="2" fill="url(#bfs-gradient)" opacity="0.4" />
    {/* Tree edges */}
    <path d="M11 5.5 L9 8.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M13 5.5 L15 8.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M7.2 11.5 L6.8 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M8.8 11.5 L9.2 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M15.2 11.5 L14.8 14.5" stroke="#e5e7eb" strokeWidth="2" />
    <path d="M16.8 11.5 L17.2 14.5" stroke="#e5e7eb" strokeWidth="2" />
    {/* Level indicators */}
    <text x="2" y="5" fontSize="8" fill="#8b5cf6" fontWeight="bold">L0</text>
    <text x="2" y="11" fontSize="8" fill="#8b5cf6" fontWeight="bold">L1</text>
    <text x="2" y="17" fontSize="8" fill="#8b5cf6" fontWeight="bold">L2</text>
  </svg>
);

export const DynamicProgrammingIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Dynamic Programming Algorithm"
  >
    <defs>
      <linearGradient id="dp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* DP table/grid */}
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#dp-gradient)" opacity="0.1" />
    {/* Grid lines */}
    <path d="M3 9 L21 9" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
    <path d="M3 15 L21 15" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
    <path d="M9 3 L9 21" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
    <path d="M15 3 L15 21" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
    {/* Filled cells showing optimal substructure */}
    <rect x="4" y="4" width="4" height="4" rx="0.5" fill="url(#dp-gradient)" opacity="0.8" />
    <rect x="10" y="4" width="4" height="4" rx="0.5" fill="url(#dp-gradient)" opacity="0.6" />
    <rect x="4" y="10" width="4" height="4" rx="0.5" fill="url(#dp-gradient)" opacity="0.6" />
    <rect x="10" y="10" width="4" height="4" rx="0.5" fill="url(#dp-gradient)" opacity="0.9" />
    {/* Arrows showing dependencies */}
    <path d="M8 6 L10 6" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#dp-arrow)" />
    <path d="M6 8 L6 10" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#dp-arrow)" />
    <defs>
      <marker id="dp-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
      </marker>
    </defs>
  </svg>
);

export const GreedyIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Greedy Algorithm"
  >
    <defs>
      <linearGradient id="greedy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Path with multiple choices */}
    <circle cx="4" cy="12" r="2" fill="url(#greedy-gradient)" />
    <circle cx="10" cy="8" r="1.5" fill="#d1d5db" />
    <circle cx="10" cy="12" r="2" fill="url(#greedy-gradient)" />
    <circle cx="10" cy="16" r="1.5" fill="#d1d5db" />
    <circle cx="16" cy="6" r="1.5" fill="#d1d5db" />
    <circle cx="16" cy="12" r="2" fill="url(#greedy-gradient)" />
    <circle cx="16" cy="18" r="1.5" fill="#d1d5db" />
    <circle cx="20" cy="12" r="2" fill="url(#greedy-gradient)" />
    {/* Greedy path - always chooses locally optimal */}
    <path d="M6 12 L8 12" stroke="url(#greedy-gradient)" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 12 L14 12" stroke="url(#greedy-gradient)" strokeWidth="3" strokeLinecap="round" />
    <path d="M18 12 L18 12" stroke="url(#greedy-gradient)" strokeWidth="3" strokeLinecap="round" />
    {/* Non-chosen paths */}
    <path d="M6 11 L8.5 8.5" stroke="#d1d5db" strokeWidth="2" strokeDasharray="2,2" />
    <path d="M6 13 L8.5 15.5" stroke="#d1d5db" strokeWidth="2" strokeDasharray="2,2" />
    {/* "Best choice" indicator */}
    <path d="M12 9 L16 9" stroke="url(#greedy-gradient)" strokeWidth="2" strokeDasharray="3,2" />
    <text x="14" y="8" fontSize="8" fill="#ef4444" fontWeight="bold">BEST</text>
  </svg>
);

// Data Structure Illustrations
export const ArrayIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Array Data Structure"
  >
    <defs>
      <linearGradient id="array-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    {/* Array container */}
    <rect x="2" y="9" width="20" height="6" rx="1" fill="url(#array-gradient)" opacity="0.1" />
    {/* Array elements */}
    <rect x="3" y="10" width="3" height="4" rx="0.5" fill="url(#array-gradient)" />
    <rect x="7" y="10" width="3" height="4" rx="0.5" fill="url(#array-gradient)" opacity="0.8" />
    <rect x="11" y="10" width="3" height="4" rx="0.5" fill="url(#array-gradient)" opacity="0.6" />
    <rect x="15" y="10" width="3" height="4" rx="0.5" fill="url(#array-gradient)" opacity="0.4" />
    <rect x="19" y="10" width="2" height="4" rx="0.5" fill="#e5e7eb" />
    {/* Index labels */}
    <text x="4.5" y="8" fontSize="8" fill="#6366f1" fontWeight="bold">0</text>
    <text x="8.5" y="8" fontSize="8" fill="#6366f1" fontWeight="bold">1</text>
    <text x="12.5" y="8" fontSize="8" fill="#6366f1" fontWeight="bold">2</text>
    <text x="16.5" y="8" fontSize="8" fill="#6366f1" fontWeight="bold">3</text>
  </svg>
);

export const LinkedListIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Linked List Data Structure"
  >
    <defs>
      <linearGradient id="linkedlist-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    {/* Node boxes */}
    <rect x="2" y="10" width="5" height="4" rx="1" fill="url(#linkedlist-gradient)" />
    <rect x="9" y="10" width="5" height="4" rx="1" fill="url(#linkedlist-gradient)" />
    <rect x="16" y="10" width="5" height="4" rx="1" fill="url(#linkedlist-gradient)" />
    {/* Pointer arrows */}
    <path d="M7.5 12 L8.5 12" stroke="url(#linkedlist-gradient)" strokeWidth="2" markerEnd="url(#ll-arrow)" />
    <path d="M14.5 12 L15.5 12" stroke="url(#linkedlist-gradient)" strokeWidth="2" markerEnd="url(#ll-arrow)" />
    <path d="M21.5 12 L22.5 12" stroke="#6b7280" strokeWidth="2" />
    <text x="23" y="13" fontSize="10" fill="#6b7280">NULL</text>
    {/* Data indicators */}
    <circle cx="4" cy="12" r="1" fill="white" opacity="0.8" />
    <circle cx="11" cy="12" r="1" fill="white" opacity="0.8" />
    <circle cx="18" cy="12" r="1" fill="white" opacity="0.8" />
    <defs>
      <marker id="ll-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#ec4899" />
      </marker>
    </defs>
  </svg>
);

export const BinaryTreeIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Binary Tree Data Structure"
  >
    <defs>
      <linearGradient id="tree-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Tree nodes */}
    <circle cx="12" cy="4" r="2.5" fill="url(#tree-gradient)" />
    <circle cx="7" cy="11" r="2" fill="url(#tree-gradient)" opacity="0.8" />
    <circle cx="17" cy="11" r="2" fill="url(#tree-gradient)" opacity="0.8" />
    <circle cx="4" cy="18" r="1.5" fill="url(#tree-gradient)" opacity="0.6" />
    <circle cx="10" cy="18" r="1.5" fill="url(#tree-gradient)" opacity="0.6" />
    <circle cx="14" cy="18" r="1.5" fill="url(#tree-gradient)" opacity="0.6" />
    <circle cx="20" cy="18" r="1.5" fill="url(#tree-gradient)" opacity="0.6" />
    {/* Tree edges */}
    <path d="M10.5 5.8 L8.5 9.2" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M13.5 5.8 L15.5 9.2" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M5.8 12.5 L5.2 16.5" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.2 12.5 L8.8 16.5" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M15.8 12.5 L15.2 16.5" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M18.2 12.5 L18.8 16.5" stroke="url(#tree-gradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HeapIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Heap Data Structure"
  >
    <defs>
      <linearGradient id="heap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Heap structure - max heap */}
    <circle cx="12" cy="5" r="2.5" fill="url(#heap-gradient)" />
    <text x="12" y="6" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">9</text>
    
    <circle cx="7" cy="11" r="2" fill="url(#heap-gradient)" opacity="0.8" />
    <text x="7" y="12" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">7</text>
    
    <circle cx="17" cy="11" r="2" fill="url(#heap-gradient)" opacity="0.8" />
    <text x="17" y="12" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">8</text>
    
    <circle cx="4" cy="17" r="1.5" fill="url(#heap-gradient)" opacity="0.6" />
    <text x="4" y="18" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">3</text>
    
    <circle cx="10" cy="17" r="1.5" fill="url(#heap-gradient)" opacity="0.6" />
    <text x="10" y="18" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">5</text>
    
    <circle cx="14" cy="17" r="1.5" fill="url(#heap-gradient)" opacity="0.6" />
    <text x="14" y="18" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">2</text>
    
    <circle cx="20" cy="17" r="1.5" fill="url(#heap-gradient)" opacity="0.6" />
    <text x="20" y="18" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">1</text>
    
    {/* Heap edges */}
    <path d="M10.5 6.8 L8.5 9.2" stroke="url(#heap-gradient)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13.5 6.8 L15.5 9.2" stroke="url(#heap-gradient)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M5.8 12.5 L5.2 15.5" stroke="url(#heap-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.2 12.5 L8.8 15.5" stroke="url(#heap-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M15.8 12.5 L15.2 15.5" stroke="url(#heap-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M18.2 12.5 L18.8 15.5" stroke="url(#heap-gradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const GraphIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Graph Data Structure"
  >
    <defs>
      <linearGradient id="graph-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    {/* Graph nodes */}
    <circle cx="6" cy="6" r="2" fill="url(#graph-gradient)" />
    <circle cx="18" cy="6" r="2" fill="url(#graph-gradient)" />
    <circle cx="6" cy="18" r="2" fill="url(#graph-gradient)" />
    <circle cx="18" cy="18" r="2" fill="url(#graph-gradient)" />
    <circle cx="12" cy="12" r="2" fill="url(#graph-gradient)" />
    {/* Graph edges */}
    <path d="M7.5 7.5 L10.5 10.5" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M13.5 10.5 L16.5 7.5" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M7.5 16.5 L10.5 13.5" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M13.5 13.5 L16.5 16.5" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 6 L16 6" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 8 L6 16" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 18 L16 18" stroke="url(#graph-gradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Topic/Concept Illustrations
export const ComplexityIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Algorithm Complexity"
  >
    <defs>
      <linearGradient id="complexity-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    {/* Axes */}
    <path d="M3 20 L21 20" stroke="#6b7280" strokeWidth="2" />
    <path d="M3 20 L3 4" stroke="#6b7280" strokeWidth="2" />
    {/* Complexity curves */}
    <path d="M3 19 Q12 15 21 5" stroke="url(#complexity-gradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M3 18 L21 10" stroke="url(#complexity-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    <path d="M3 17 L21 17" stroke="url(#complexity-gradient)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    {/* Labels */}
    <text x="22" y="18" fontSize="8" fill="#6b7280">n</text>
    <text x="4" y="3" fontSize="8" fill="#6b7280">T</text>
    <text x="18" y="7" fontSize="8" fill="#8b5cf6" fontWeight="bold">O(n²)</text>
    <text x="18" y="12" fontSize="8" fill="#3b82f6" fontWeight="bold">O(n)</text>
    <text x="18" y="19" fontSize="8" fill="#06b6d4" fontWeight="bold">O(1)</text>
  </svg>
);

export const RecursionIcon: React.FC<IllustrationProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    role="img"
    aria-label="Recursion Concept"
  >
    <defs>
      <linearGradient id="recursion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    {/* Recursive calls - nested boxes */}
    <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="url(#recursion-gradient)" strokeWidth="2" />
    <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="url(#recursion-gradient)" strokeWidth="2" opacity="0.8" />
    <rect x="7" y="7" width="10" height="10" rx="2" fill="none" stroke="url(#recursion-gradient)" strokeWidth="2" opacity="0.6" />
    <rect x="9" y="9" width="6" height="6" rx="1" fill="url(#recursion-gradient)" opacity="0.4" />
    {/* Recursion arrows */}
    <path d="M12 3 C18 3 21 6 21 12" stroke="url(#recursion-gradient)" strokeWidth="2" fill="none" markerEnd="url(#recursion-arrow)" />
    <path d="M21 12 C21 18 18 21 12 21" stroke="url(#recursion-gradient)" strokeWidth="2" fill="none" markerEnd="url(#recursion-arrow)" opacity="0.7" />
    <defs>
      <marker id="recursion-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
      </marker>
    </defs>
    <text x="12" y="13" fontSize="10" fill="#f97316" fontWeight="bold" textAnchor="middle">f(n)</text>
  </svg>
);

// Create a comprehensive mapping of all illustrations
export const algorithmIllustrations = {
  // Searching
  binary_search: BinarySearchIcon,
  linear_search: ArrayIcon,
  
  // Graph algorithms
  dfs: DFSIcon,
  bfs: BFSIcon,
  
  // Dynamic Programming
  dynamic_programming: DynamicProgrammingIcon,
  dp: DynamicProgrammingIcon,
  
  // Greedy
  greedy: GreedyIcon,
  
  // Data Structures
  array: ArrayIcon,
  linked_list: LinkedListIcon,
  binary_tree: BinaryTreeIcon,
  heap: HeapIcon,
  graph: GraphIcon,
  
  // Concepts
  complexity: ComplexityIcon,
  recursion: RecursionIcon,
  
  // Default fallback
  default: ComplexityIcon
};

export const topicIllustrations = {
  searching: BinarySearchIcon,
  'divide-conquer': BinarySearchIcon,
  trees: BinaryTreeIcon,
  graphs: GraphIcon,
  'dynamic-programming': DynamicProgrammingIcon,
  dp: DynamicProgrammingIcon,
  greedy: GreedyIcon,
  arrays: ArrayIcon,
  'linked-lists': LinkedListIcon,
  heaps: HeapIcon,
  recursion: RecursionIcon,
  complexity: ComplexityIcon,
  default: ComplexityIcon
};

// Helper function to get illustration component
export const getAlgorithmIllustration = (algorithmName: string) => {
  const key = algorithmName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return algorithmIllustrations[key as keyof typeof algorithmIllustrations] || algorithmIllustrations.default;
};

export const getTopicIllustration = (topicName: string) => {
  const key = topicName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return topicIllustrations[key as keyof typeof topicIllustrations] || topicIllustrations.default;
};