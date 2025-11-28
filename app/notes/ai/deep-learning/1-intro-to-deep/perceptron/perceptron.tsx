'use client';

import * as React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Types
interface InputNodeConfig {
  label: string;
  color: string;
  weightLabel: string;
  yPosition: number;
}

interface PerceptronSlideProps {
  title: string;
  inputs: InputNodeConfig[];
  hasBias?: boolean;
  rightSideContent?: React.ReactNode;
}

// KaTeX renderer component - wrapper around InlineMath for display mode support
interface KaTeXProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

function KaTeX({ latex, displayMode = false, className = '' }: KaTeXProps) {
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    try {
      katex.render(latex, containerRef.current, {
        throwOnError: false,
        displayMode,
        strict: false,
        trust: true,
        output: 'html',
      });
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      if (containerRef.current) {
        containerRef.current.textContent = latex;
      }
    }
  }, [latex, displayMode]);

  return <span ref={containerRef} className={className} />;
}

// SVG text with subscript support
interface SVGMathTextProps {
  x: number;
  y: number;
  text: string;
  subscript?: string;
  color?: string;
  fontSize?: number;
}

function SVGMathText({ x, y, text, subscript, color = '#000', fontSize = 12 }: SVGMathTextProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      fontStyle="italic"
      fill={color}
    >
      {text}
      {subscript && (
        <tspan fontSize={fontSize * 0.7} dy={fontSize * 0.3}>
          {subscript}
        </tspan>
      )}
    </text>
  );
}

// Main Perceptron Diagram Component
interface PerceptronDiagramProps {
  inputs: InputNodeConfig[];
  hasBias?: boolean;
  width?: number;
  height?: number;
}

function PerceptronDiagram({ inputs, hasBias = false, width = 420, height = 220 }: PerceptronDiagramProps) {
  const inputX = 60;
  const sumX = 240;
  const sumY = height / 2;
  const nonLinX = 310;
  const outputX = 380;
  const nodeRadius = 20;
  const smallRadius = 16;
  const biasY = 35;

  // Helper to parse "x_1" into {text: "x", subscript: "1"}
  function parseLabel(label: string): { text: string; subscript?: string } {
    const parts = label.split('_');
    if (parts.length === 2) {
      return { text: parts[0], subscript: parts[1] };
    }
    return { text: label };
  }

  // Calculate positions for bias weight label
  const biasEndX = sumX - nodeRadius;
  const biasEndY = sumY - 5;
  const biasMidX = inputX + (biasEndX - inputX) * 0.4;
  const biasMidY = biasY + (biasEndY - biasY) * 0.4;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Bias node and connection */}
      {hasBias && (
        <>
          <line x1={inputX + smallRadius} y1={biasY} x2={biasEndX} y2={biasEndY} stroke="#22C55E" strokeWidth={2} />
          <circle cx={inputX} cy={biasY} r={smallRadius} fill="#BBF7D0" />
          <text x={inputX} y={biasY} textAnchor="middle" dominantBaseline="middle" fontSize={12}>1</text>
          <SVGMathText x={biasMidX + 15} y={biasMidY - 8} text="w" subscript="0" color="#22C55E" fontSize={11} />
        </>
      )}

      {/* Input nodes and connections */}
      {inputs.map((input, index) => {
        const yPos = hasBias ? input.yPosition + 25 : input.yPosition;
        const startX = inputX + smallRadius;
        const endX = sumX - nodeRadius;
        const midX = startX + (endX - startX) * 0.35;
        const midY = yPos + (sumY - yPos) * 0.35;
        const inputLabel = parseLabel(input.label);
        const weightLabel = parseLabel(input.weightLabel);

        return (
          <React.Fragment key={index}>
            {/* Connection line */}
            <line x1={startX} y1={yPos} x2={endX} y2={sumY} stroke={input.color} strokeWidth={2} />
            {/* Input node */}
            <circle cx={inputX} cy={yPos} r={smallRadius} fill="#BFDBFE" />
            {/* Input label */}
            <SVGMathText x={inputX - 25} y={yPos} text={inputLabel.text} subscript={inputLabel.subscript} fontSize={12} />
            {/* Weight label along the line */}
            <SVGMathText
              x={midX + 15}
              y={midY - 8}
              text={weightLabel.text}
              subscript={weightLabel.subscript}
              color={input.color}
              fontSize={11}
            />
          </React.Fragment>
        );
      })}

      {/* Sum node */}
      <circle cx={sumX} cy={sumY} r={nodeRadius} fill="#FDBA74" />
      <text x={sumX} y={sumY} textAnchor="middle" dominantBaseline="middle" fontSize={20}>
        S
      </text>

      {/* Arrow from sum to non-linearity */}
      <line x1={sumX + nodeRadius} y1={sumY} x2={nonLinX - smallRadius - 5} y2={sumY} stroke="#B45309" strokeWidth={2} />
      <polygon
        points={`${nonLinX - smallRadius},${sumY} ${nonLinX - smallRadius - 8},${sumY - 4} ${nonLinX - smallRadius - 8},${sumY + 4}`}
        fill="#B45309"
      />

      {/* Non-linearity node */}
      <circle cx={nonLinX} cy={sumY} r={smallRadius} fill="#FEF08A" />
      <text x={nonLinX} y={sumY} textAnchor="middle" dominantBaseline="middle" fontSize={16}>
        f
      </text>

      {/* Arrow from non-linearity to output */}
      <line x1={nonLinX + smallRadius} y1={sumY} x2={outputX - smallRadius - 5} y2={sumY} stroke="#B45309" strokeWidth={2} />
      <polygon
        points={`${outputX - smallRadius},${sumY} ${outputX - smallRadius - 8},${sumY - 4} ${outputX - smallRadius - 8},${sumY + 4}`}
        fill="#B45309"
      />

      {/* Output node */}
      <circle cx={outputX} cy={sumY} r={smallRadius} fill="#DDD6FE" />
      <text x={outputX} y={outputX === 380 ? sumY - 2 : sumY} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontStyle="italic">
        y
      </text>

      {/* Labels */}
      <text x={inputX} y={height - 8} textAnchor="middle" fontSize={9} fill="#6B7280">Inputs</text>
      <text x={140} y={height - 8} textAnchor="middle" fontSize={9} fill="#6B7280">Weights</text>
      <text x={sumX} y={height - 8} textAnchor="middle" fontSize={9} fill="#6B7280">Sum</text>
      <text x={nonLinX} y={height - 8} textAnchor="middle" fontSize={9} fill="#6B7280">Non-Linearity</text>
      <text x={outputX} y={height - 8} textAnchor="middle" fontSize={9} fill="#6B7280">Output</text>
    </svg>
    </div>
  );
}

// Sigmoid graph component
function SigmoidGraph({ width = 180, height = 100 }: { width?: number; height?: number }) {
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    const z = ((i / 100) * 12) - 6;
    const sigmoid = 1 / (1 + Math.exp(-z));
    const y = height - (sigmoid * height * 0.8) - 10;
    points.push(`${x},${y}`);
  }

  return (
    <svg width={width} height={height}>
      {/* Axes */}
      <line x1={width / 2} y1={5} x2={width / 2} y2={height - 5} stroke="#E5E7EB" strokeWidth={1} />
      <line x1={5} y1={height * 0.5} x2={width - 5} y2={height * 0.5} stroke="#E5E7EB" strokeWidth={1} />

      {/* Sigmoid curve */}
      <polyline points={points.join(' ')} fill="none" stroke="#3B82F6" strokeWidth={2} />

      {/* Labels */}
      <text x={width - 8} y={height * 0.5 + 12} fontSize={10} fill="#6B7280">z</text>
      <text x={width / 2 + 5} y={15} fontSize={8} fill="#6B7280">1</text>
      <text x={width / 2 + 5} y={height * 0.5 + 3} fontSize={8} fill="#6B7280">0.5</text>
      <text x={10} y={height * 0.5 + 12} fontSize={8} fill="#6B7280">-6</text>
      <text x={width - 20} y={height * 0.5 + 12} fontSize={8} fill="#6B7280">6</text>
    </svg>
  );
}

// Main Slide Component
function PerceptronSlide({ title, inputs, hasBias = false, rightSideContent }: PerceptronSlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">{title}</h2>

      <div className="flex flex-col @lg:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="h-full w-full">
          <PerceptronDiagram inputs={inputs} hasBias={hasBias} />
        </div>

        <div className="">
          {rightSideContent}
        </div>
      </div>
    </div>
  );
}

// Export all components
export {
  KaTeX,
  SVGMathText,
  PerceptronDiagram,
  PerceptronSlide,
  SigmoidGraph,
};

export type {
  InputNodeConfig,
  PerceptronSlideProps,
  KaTeXProps,
  PerceptronDiagramProps,
  SVGMathTextProps,
};
