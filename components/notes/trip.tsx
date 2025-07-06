'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bus, Dumbbell, Briefcase } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- Data Configuration ---
// Defines the locations, their positions on the map, and the icon to use.
const locations = {
  Home: { x: 15, y: 50, Icon: Home },
  'Station A': { x: 35, y: 20, Icon: Bus },
  'Station B': { x: 40, y: 80, Icon: Bus },
  Gym: { x: 70, y: 90, Icon: Dumbbell },
  Work: { x: 85, y: 60, Icon: Briefcase },
};

// Defines the paths (edges) between locations and their travel times (weights).
const paths = [
  { from: 'Home', to: 'Station A', time: 5 },
  { from: 'Home', to: 'Station B', time: 12 },
  { from: 'Station A', to: 'Gym', time: 10 },
  { from: 'Station B', to: 'Gym', time: 2 },
  { from: 'Station B', to: 'Work', time: 20 },
];

// --- Algorithm Steps ---
// Each object in this array represents a single state in the algorithm's execution.
const animationSteps: AnimationStep[] = [
  {
    title: "Start",
    description: "You begin at **Home** (`d[Home] = 0`). The initial frontier of reachable locations is `{Station A: 5, Station B: 12}`.",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: Infinity, Work: Infinity },
    finalized: new Set<string>(['Home']),
    frontier: new Set<string>(['Station A', 'Station B']),
    visiting: 'Home',
    updatedPath: null,
  },
  {
    title: "Step 1: Finalize Station A",
    description: "The closest location is **Station A** (5 mins). Its path is **finalized**. We explore from it: a path to the **Gym** is found with a time of `d[Station A] + 10 = 15` mins.\n\n**Current Frontier:** `{Station B: 12, Gym: 15}`",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 15, Work: Infinity },
    finalized: new Set<string>(['Home', 'Station A']),
    frontier: new Set<string>(['Station B', 'Gym']),
    visiting: 'Station A',
    updatedPath: { from: 'Station A', to: 'Gym' },
  },
  {
    title: "Step 2: Finalize Station B",
    description: "The next closest location on the entire frontier is **Station B** (12 mins). Its path is **finalized**. We explore from it:\n\n* A path to the **Work** location is found: `d[Station B] + 20 = 32` mins.",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 15, Work: 32 },
    finalized: new Set<string>(['Home', 'Station A', 'Station B']),
    frontier: new Set<string>(['Gym', 'Work']),
    visiting: 'Station B',
    updatedPath: { from: 'Station B', to: 'Work' },
  },
  {
    title: "Step 2.1: Update Gym Path",
    description: "* A new path to the **Gym** is found via Station B: `d[Station B] + 2 = 14` mins. Since 14 is less than the Gym's current best time of 15, we **update** its estimate.\n\n**Current Frontier:** `{Gym: 14, Work: 32}`",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 14, Work: 32 },
    finalized: new Set<string>(['Home', 'Station A', 'Station B']),
    frontier: new Set<string>(['Gym', 'Work']),
    visiting: 'Station B',
    updatedPath: { from: 'Station B', to: 'Gym' },
  },
  {
    title: "Step 3: Finalize the Gym",
    description: "The next closest location is now the **Gym** at 14 minutes. Its path is **finalized**. Once a location like the Gym is finalized, its distance is **locked in**. The algorithm will **never update it again**, even if other paths to it are discovered later.",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 14, Work: 32 },
    finalized: new Set<string>(['Home', 'Station A', 'Station B', 'Gym']),
    frontier: new Set<string>(['Work']),
    visiting: 'Gym',
    updatedPath: null,
  },
  {
    title: "Step 4: Finalize Work",
    description: "The last location on the frontier is **Work** at 32 minutes. It becomes **finalized**.",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 14, Work: 32 },
    finalized: new Set<string>(['Home', 'Station A', 'Station B', 'Gym', 'Work']),
    frontier: new Set<string>(),
    visiting: 'Work',
    updatedPath: null,
  },
  {
    title: "Algorithm Complete",
    description: "The algorithm finishes, having built a complete guide with the guaranteed shortest path from your home to every key location: d[Station A]=5, d[Station B]=12, d[Gym]=14, and d[Work]=32.",
    distances: { Home: 0, 'Station A': 5, 'Station B': 12, Gym: 14, Work: 32 },
    finalized: new Set<string>(['Home', 'Station A', 'Station B', 'Gym', 'Work']),
    frontier: new Set<string>(),
    visiting: null,
    updatedPath: null,
  },
];

// --- Helper Functions & Components ---

// SVG Edges and Weights (all in one SVG for textPath to work)
type PathType = { from: string; to: string; time: number };

interface AnimationStep {
  title: string;
  description: string;
  distances: Record<string, number>;
  finalized: Set<string>;
  frontier: Set<string>;
  visiting: string | null;
  updatedPath: { from: string; to: string } | null;
}

interface EdgesWithWeightsProps {
  paths: PathType[];
  currentStep: AnimationStep;
}

const EdgesWithWeights = ({ paths, currentStep }: EdgesWithWeightsProps) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full overflow-visible" style={{ zIndex: 0 }}>
      <defs>
        {paths.map((path: PathType) => {
          const lineId = `line-${path.from.replace(/\s/g, '')}-${path.to.replace(/\s/g, '')}`;
          const color = (() => {
            const fromFinalized = currentStep.finalized.has(path.from);
            const toFinalized = currentStep.finalized.has(path.to);
            if (fromFinalized && toFinalized && currentStep.distances[path.to] === currentStep.distances[path.from] + path.time) return '#10B981';
            if (currentStep.visiting === path.from && !currentStep.finalized.has(path.to)) return '#3B82F6';
            if (currentStep.updatedPath && ((currentStep.updatedPath.from === path.from && currentStep.updatedPath.to === path.to) || (currentStep.updatedPath.from === path.to && currentStep.updatedPath.to === path.from))) return '#F59E0B';
            return '#6B7280';
          })();
          return (
            <marker key={`arrow-${lineId}`} id={`arrow-${lineId}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
            </marker>
          );
        })}
      </defs>
      {paths.map((path: PathType) => {
        const from = locations[path.from as keyof typeof locations];
        const to = locations[path.to as keyof typeof locations];
        const lineId = `line-${path.from.replace(/\s/g, '')}-${path.to.replace(/\s/g, '')}`;
        const markerId = `arrow-${lineId}`;
        const color = (() => {
          const fromFinalized = currentStep.finalized.has(path.from);
          const toFinalized = currentStep.finalized.has(path.to);
          if (fromFinalized && toFinalized && currentStep.distances[path.to] === currentStep.distances[path.from] + path.time) return '#10B981';
          if (currentStep.visiting === path.from && !currentStep.finalized.has(path.to)) return '#3B82F6';
          if (currentStep.updatedPath && ((currentStep.updatedPath.from === path.from && currentStep.updatedPath.to === path.to) || (currentStep.updatedPath.from === path.to && currentStep.updatedPath.to === path.from))) return '#F59E0B';
          return '#6B7280';
        })();
        const strokeWidth = color === '#10B981' ? 3.5 : color === '#3B82F6' ? 3 : 2.5;
        // Midpoint for label
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        return (
          <g key={lineId}>
            <line
              id={lineId}
              x1={`${from.x}%`} y1={`${from.y}%`}
              x2={`${to.x}%`} y2={`${to.y}%`}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray="5 5"
              markerEnd={`url(#${markerId})`}
            />
            <text
              x={`${mx}%`} y={`${my - 2}%`}
              fill={color}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
              style={{
                paintOrder: 'stroke',
                stroke: 'white',
                strokeOpacity: 0.9,
                strokeWidth: '6px',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              {path.time} min
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Add a mapping for short labels
const shortLabels: Record<string, string> = {
  Home: 'Home',
  'Station A': 'A',
  'Station B': 'B',
  Gym: 'Gym',
  Work: 'Work',
};

// Component for each location on the map.
const LocationNode = ({ name, pos, isFinalized, isVisiting, isFrontier }: { name: string, pos: { x: number, y: number }, isFinalized: boolean, isVisiting: boolean, isFrontier: boolean }) => {
  const { Icon } = locations[name as keyof typeof locations];
  const scale = isVisiting ? 1.2 : isFinalized ? 1.1 : 1;
  const zIndex = isVisiting ? 10 : 5;

  let bgColor = 'bg-gray-200 dark:bg-gray-600';
  let textColor = 'text-gray-700 dark:text-gray-200';
  let ringColor = 'ring-gray-300 dark:ring-gray-500';

  if (isFinalized) {
    bgColor = 'bg-emerald-500';
    textColor = 'text-white';
    ringColor = 'ring-emerald-300';
  } else if (isVisiting) {
    bgColor = 'bg-blue-500';
    textColor = 'text-white';
    ringColor = 'ring-blue-300';
  } else if (isFrontier) {
    bgColor = 'bg-amber-400';
    textColor = 'text-gray-800';
    ringColor = 'ring-amber-200';
  }

  // Dynamic label positioning based on node location to prevent overlap
  const getLabelPosition = (x: number, y: number) => {
    if (y < 40) return { layout: 'flex-col', labelClass: 'mt-2', order: 'order-last' }; // Top nodes: label below
    if (y > 70) return { layout: 'flex-col', labelClass: 'mb-2', order: 'order-first' }; // Bottom nodes: label above
    if (x < 30) return { layout: 'flex-row', labelClass: 'ml-2', order: 'order-last' }; // Left nodes: label to the right
    if (x > 70) return { layout: 'flex-row', labelClass: 'mr-2', order: 'order-first' }; // Right nodes: label to the left
    return { layout: 'flex-col', labelClass: 'mt-2', order: 'order-last' }; // Default: label above
  };
  
  const { layout, labelClass, order } = getLabelPosition(pos.x, pos.y);

  return (
    <motion.div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex ${layout} items-center`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.div
        className={`w-8 h-8 @sm:w-12 @md:w-16 @lg:w-20 rounded-full flex flex-col items-center
           justify-center shadow-lg ring-4 ${ringColor} ${bgColor} ${textColor} ${order}`}
        animate={{ scale }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="@container-[map]:size-4 @sm:size-5 @md:size-6 @lg:size-7" />
      </motion.div>
      <span className={`@container-[map]:text-[10px] @sm:text-xs @md:text-base @lg:text-lg 
         px-1 @sm:px-2 @md:px-3 py-1 
        rounded-md shadow font-bold text-gray-900 dark:text-gray-50 ${labelClass}`}>
        <span className={`@container-[map]:inline @sm:hidden ${!isFinalized ? 'text-yellow-500' : 'text-green-500'}`}>{shortLabels[name]}</span>
        <span className={`hidden @sm:inline text-sm px-1 ${!isFinalized ? 'text-yellow-500' : 'text-green-500'}`}>{name}</span>
      </span>
    </motion.div>
  );
};

// Main App Component
export default function TransitMapAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = animationSteps[stepIndex];

  const handleNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, animationSteps.length - 1));
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleReset = () => {
    setStepIndex(0);
  };

  return (
    <div className="flex flex-col  w-full h-screen  font-sans gap-4 mt-4">
      {/* Map Visualization */}

      <div className="w-full h-1/2  bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-500 via-pink-500 text-transparent bg-clip-text mb-4">Your Personal Transit Map </h1>
        <div className="relative flex-grow w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg container container-[map]">
          <EdgesWithWeights paths={paths} currentStep={currentStep} />
          {Object.entries(locations).map(([name, pos]) => (
            <LocationNode
              key={name}
              name={name}
              pos={pos}
              isFinalized={currentStep.finalized.has(name)}
              isVisiting={currentStep.visiting === name}
              isFrontier={currentStep.frontier.has(name)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold bg-linear-to-r from-blue-500 to-purple-500 via-pink-500 text-transparent bg-clip-text mb-3 ">Distances from Home</h3>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px] flex flex-col">
              <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                {Object.keys(currentStep.distances).map((name) => (
                  <span key={name} className="flex-1 text-center whitespace-nowrap">
                    <span className="inline sm:hidden">{shortLabels[name]}</span>
                    <span className="hidden sm:inline">{name}</span>
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-base sm:text-lg font-mono">
                {Object.entries(currentStep.distances).map(([name, dist]) => {
                  const isFinalized = currentStep.finalized.has(name);
                  const isVisiting = currentStep.visiting === name;
                  const colorClass = isFinalized
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : isVisiting
                    ? 'text-blue-500 dark:text-blue-400 font-bold animate-pulse'
                    : 'text-gray-400 dark:text-gray-500';
                  return (
                    <span key={name} className={`flex-1 text-center whitespace-nowrap ${colorClass}`}>{dist === Infinity ? '∞' : `${dist} `}</span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* Controls and Explanation */}
      <div className="w-full  h-1/2 @lg:h-1/4  flex flex-col gap-4">
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-500 to-purple-500 via-pink-500 text-transparent bg-clip-text mb-2">{currentStep.title}</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              className="text-gray-600 dark:text-gray-300 flex-grow prose prose-sm dark:prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ReactMarkdown>
                {currentStep.description}
              </ReactMarkdown>
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto flex justify-between items-center pt-4">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className="px-4 py-2 font-semibold  rounded-lg 
              hover:bg-linear-to-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              
                bg-linear-to-r from-blue-500/10 via-sky-400/10 to-sky-300/40
                hover:bg-gradient-to-l"
            >
              <span className="bg-gradient-to-r from-blue-500 to-sky-600 via-sky-500 text-transparent bg-clip-text">
                Previous
              </span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 font-semibold  rounded-lg 
              hover:bg-linear-to-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              
                bg-linear-to-r from-blue-500/5 via-sky-400/5 to-sky-300/5
                hover:bg-gradient-to-l"
            >
              <span className="bg-gradient-to-r from-blue-500 to-sky-600 via-sky-500 text-transparent bg-clip-text">
                Reset
              </span>
            </button>
            <button
              onClick={handleNext}
              disabled={stepIndex === animationSteps.length - 1}
              className="px-4 py-2 font-semibold  rounded-lg 
              hover:bg-linear-to-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors
              
                bg-linear-to-r from-blue-500/10 via-sky-400/10 to-sky-300/40
                hover:bg-gradient-to-l"
                
            >
              <span className="bg-gradient-to-r from-blue-500 to-sky-600 via-sky-500 text-transparent bg-clip-text">
                Next
              </span>
            </button>
          </div>
        </div>
        

      </div>
    </div>
  );
}
