"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WindowShapeVisualizerProps {
  differences: number[];
  lower: number;
  upper: number;
}

export default function WindowShapeVisualizer({ differences, lower, upper }: WindowShapeVisualizerProps) {
  // 1) Compute prefix sums starting from 0
  const prefixSums = differences.reduce<number[]>((acc, diff) => {
    acc.push(acc[acc.length - 1] + diff);
    return acc;
  }, [0]);

  // 2) Determine shift bounds k
  const minPrefix = Math.min(...prefixSums);
  const maxPrefix = Math.max(...prefixSums);
  const minK = lower - minPrefix;
  const maxK = upper - maxPrefix;

  // 3) State: current shift k
  const [k, setK] = useState(minK);
  const increment = () => setK((prev) => Math.min(prev + 1, maxK));
  const decrement = () => setK((prev) => Math.max(prev - 1, minK));
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setK(Math.max(minK, Math.min(maxK, val)));
  };

  // 4) Compute actual heights after shift
  const heights = prefixSums.map((ps) => ps + k);
  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);

  // 5) Metrics
  const windowHeight = upper - lower;
  const shapeHeight = maxHeight - minHeight;

  // 6) SVG layout
  const unit = 24; // px per unit
  const margin = 40;
  const svgWidth = 400;
  const svgHeight = windowHeight * unit + margin * 2;
  const x0 = svgWidth * 0.3;
  const boxWidth = svgWidth * 0.4;
  const valueToY = (v: number) => margin + (upper - v) * unit;

  return (
    <div className="p-6 border rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Window & Shape Visualizer</h2>
      {/* Parameters Display */}
      <div className="mb-4 text-sm">
        <strong>differences:</strong> [{differences.join(', ')}] &nbsp;|&nbsp;
        <strong>lower:</strong> {lower} &nbsp;|&nbsp;
        <strong>upper:</strong> {upper} &nbsp;|&nbsp;
        <strong>k:</strong> {k}
      </div>
      <svg width={svgWidth} height={svgHeight} className="bg-white">
        {/* Window rectangle */}
        <rect
          x={x0}
          y={valueToY(upper)}
          width={boxWidth}
          height={windowHeight * unit}
          fill="rgba(200,200,200,0.3)"
          stroke="black"
          strokeWidth={2}
        />
        {/* Window labels */}
        <text x={x0 - 10} y={valueToY(upper) + 4} textAnchor="end" fontSize={12} fill="black">
          upper = {upper}
        </text>
        <text x={x0 - 10} y={valueToY(lower) + 4} textAnchor="end" fontSize={12} fill="black">
          lower = {lower}
        </text>
        {/* Shape rectangle */}
        <motion.rect
          x={x0}
          y={valueToY(maxHeight)}
          width={boxWidth}
          height={shapeHeight * unit}
          fill="rgba(100,150,250,0.3)"
          stroke="rgba(0,0,150,0.8)"
          animate={{ y: valueToY(maxHeight) }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
        {/* Prefix-sum dots and labels */}
        {heights.map((h, i) => (
          <g key={i} transform={`translate(${x0 + boxWidth / 2}, ${valueToY(h)})`}>
            <circle r={5} fill="red" />
            <text x={10} y={4} fontSize={12} fill="red">
              {h}
            </text>
          </g>
        ))}
        {/* Y-axis ticks and labels */}
        {Array.from({ length: windowHeight + 1 }, (_, i) => upper - i).map((v) => (
          <g key={v} transform={`translate(0, ${valueToY(v)})`}>
            <line x1={x0 - 5} x2={x0} stroke="black" />
            <text x={x0 - 10} y={4} textAnchor="end" fontSize={12} fill="black">
              {v}
            </text>
          </g>
        ))}
      </svg>
      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mt-6">
        <button onClick={decrement} disabled={k <= minK} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400">
          −
        </button>
        <input
          type="number"
          value={k}
          min={minK}
          max={maxK}
          onChange={onInputChange}
          className="w-20 text-center border rounded"
        />
        <button onClick={increment} disabled={k >= maxK} className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400">
          +
        </button>
      </div>
      <div className="mt-2 text-sm">
        <span>k range: [{minK}, {maxK}]</span> &nbsp;|&nbsp; <span>shapeHeight = {shapeHeight}</span> &nbsp;|&nbsp; <span>windowHeight = {windowHeight}</span>
      </div>
    </div>
  );
}
