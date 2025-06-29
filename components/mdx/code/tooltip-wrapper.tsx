'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { SymbolMetadata, Parameter } from '@/lib/types';

// ParameterTooltip type for discriminated union
export type ParameterTooltip = Parameter & { type: 'parameter'; parent: string };
export type TooltipMetadata = SymbolMetadata | ParameterTooltip;

interface TooltipWrapperProps {
  symbol: string;
  metadata: TooltipMetadata;
  children: React.ReactNode;
}

export function TooltipWrapper({ symbol, metadata, children }: TooltipWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isVisible) return;
    function handleClick(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isVisible]);

  return (
    <span
      ref={wrapperRef}
      className="tooltip-wrapper cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        setIsVisible(v => !v);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Show tooltip for ${symbol}`}
    >
      {children}
      {isVisible && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md backdrop-blur-sm"
          style={{ left: '50%', top: '100%', transform: 'translateX(-50%) translateY(8px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tooltip-title"
          aria-describedby="tooltip-content"
        >
          <TooltipContent symbol={symbol} metadata={metadata} />
        </div>
      )}
    </span>
  );
}

function TooltipContent({ symbol, metadata }: { symbol: string; metadata: TooltipMetadata }) {
  if (metadata.type === 'parameter') {
    // Parameter tooltip
    return (
      <div id="tooltip-content" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="tooltip-title" className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {metadata.parent}.{symbol}
          </h3>
        </div>
        <div className="font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          {metadata.type || ''}
        </div>
        {metadata.description && (
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {metadata.description}
          </div>
        )}
        {metadata.default && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Default: <span className="font-mono">{metadata.default}</span>
          </div>
        )}
      </div>
    );
  }
  // Symbol tooltip
  return (
    <div id="tooltip-content" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 id="tooltip-title" className="font-semibold text-sm text-gray-900 dark:text-gray-100">
          {metadata.parent ? `${metadata.parent}.${symbol}` : symbol}
        </h3>
      </div>
      <div className="font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
        {metadata.signature}
      </div>
      {metadata.description && (
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {metadata.description}
        </div>
      )}
      {Array.isArray(metadata.parameters) && metadata.parameters.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Parameters:</h4>
          <div className="space-y-1">
            {metadata.parameters.map((param, index) => (
              <div key={index} className="text-sm">
                <span className="font-mono text-blue-600 dark:text-blue-400">{param.name}</span>
                {param.type && (
                  <span className="text-gray-500 dark:text-gray-400">: {param.type}</span>
                )}
                {param.description && (
                  <span className="text-gray-600 dark:text-gray-300"> — {param.description}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {metadata.return_type && (
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Returns: </span>
          <span className="font-mono text-green-600 dark:text-green-400">{metadata.return_type}</span>
          {metadata.return_description && (
            <span className="text-gray-600 dark:text-gray-300"> — {metadata.return_description}</span>
          )}
        </div>
      )}
      {metadata.code && (
        <div className="mt-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">Code:</h4>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
            <code>{metadata.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
} 