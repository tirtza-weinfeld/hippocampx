import React from 'react';
import CopyCode from './copy-code';

interface SimpleCodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

export default function SimpleCodeBlock({ className, children }: SimpleCodeBlockProps) {
  const language = className?.replace('language-', '') || 'text';
  
  return (
    <div className="shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4">
      <div className="relative">
        <CopyCode className="absolute top-0 right-0" code={children as string} />
        <div className="overflow-x-auto py-8 line-numbers">
          <pre className={`language-${language}`}>
            <code className={className}>
              {children}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
} 