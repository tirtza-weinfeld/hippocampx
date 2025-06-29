'use client';

import { useState, useCallback } from 'react';
import type { SymbolMetadata } from '@/lib/types';

interface CodeTooltipProps {
  symbolName: string;
  metadata: string;
  children: React.ReactNode;
}

export default function CodeTooltip({ symbolName, metadata, children }: CodeTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Parse metadata if it's a string
  const symbolMetadata: SymbolMetadata = typeof metadata === 'string' 
    ? JSON.parse(metadata) 
    : metadata;

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      setPosition({ x: rect.left + rect.width / 2, y: rect.top });
      setIsOpen(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close tooltip when clicking outside
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <>
      <span
        className="
        cursor-pointer text-blue-600 dark:text-blue-400
         hover:text-blue-800 dark:hover:text-blue-200 
         underline decoration-dotted underline-offset-2"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Show tooltip for ${symbolName}`}
      >
        {children}
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={handleBackdropClick}
        >
          <div
            className="relative max-w-md rounded-lg bg-white dark:bg-gray-800 p-4 shadow-xl border border-gray-200 dark:border-gray-700"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close tooltip"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {symbolMetadata.parent ? `${symbolMetadata.parent}.${symbolName}` : symbolName}
              </h3>
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {symbolMetadata.type}
              </span>
            </div>

            {/* Signature */}
            <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded font-mono text-sm">
              {symbolMetadata.signature}
            </div>

            {/* Description */}
            {symbolMetadata.description && (
              <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                {symbolMetadata.description}
              </div>
            )}

            {/* Parameters */}
            {symbolMetadata.parameters && symbolMetadata.parameters.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Parameters:
                </h4>
                <ul className="space-y-1">
                  {symbolMetadata.parameters.map((param, index) => (
                    <li key={index} className="text-sm">
                      <code className="text-blue-600 dark:text-blue-400">
                        {param.name}
                      </code>
                      {param.type && (
                        <span className="text-gray-500 dark:text-gray-400">
                          : {param.type}
                        </span>
                      )}
                      {param.description && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          - {param.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Return type */}
            {symbolMetadata.return_type && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                  Returns:
                </h4>
                <div className="text-sm">
                  <code className="text-green-600 dark:text-green-400">
                    {symbolMetadata.return_type}
                  </code>
                  {symbolMetadata.return_description && (
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      - {symbolMetadata.return_description}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* File info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-2">
              {symbolMetadata.file}:{symbolMetadata.line}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 