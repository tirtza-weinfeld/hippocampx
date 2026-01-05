import React from 'react';
// import { NewTooltipifyClient } from './new-tooltipify-client';
import highlightCode from './code-highlighter';
import { CodeBlockClient } from './code-block-client';
import { tooltipifyJSX } from './tooltipify-jsx';
import { renderTooltipContent } from './render-tooltip-content';
import { getTooltipContent } from './tooltip-content';
import { Skeleton } from '@/components/ui/skeleton';
/**
 * Props for the CodeBlock server component.
 */
export type CodeBlockProps = {
  /** Language class from MDX (e.g., "language-python") */
  className: string;
  /** Optional meta attributes for code highlighting and tooltips */
  meta?: string;
  /** Raw code content as string */
  children: React.ReactNode;
};

/**
 * Server-side React component that renders syntax-highlighted code blocks with interactive tooltips.
 * 
 * This component coordinates the entire tooltip pipeline:
 * 1. **Metadata Loading**: Loads symbol metadata from extracted JSON files
 * 2. **Code Highlighting**: Uses Shiki with custom transformers to add tooltip data attributes  
 * 3. **Tooltip Processing**: Converts tooltip attributes to interactive Radix UI Popover components
 * 4. **Client Handoff**: Passes processed content to client component for expand/collapse functionality
 * 
 * The tooltip system supports two types of symbols:
 * - **Symbol tooltips** (functions, classes, parameters) from uses.json + symbol_tags.json
 * - **Expression tooltips** (complex expressions) from expressions.json
 * 
 * Symbol resolution uses qualified names (qnames) like "function_name:function_name.parameter".
 * 
 * @param props - CodeBlock configuration
 * @returns JSX element with syntax highlighting and interactive tooltips
 * 
 * @example
 * ```mdx
 * ```python source=algorithm.py:binary_search meta="highlight=3-5"
 * def binary_search(arr, target):
 *     left, right = 0, len(arr) - 1
 *     # Highlighted lines with tooltips on hover
 * ```
 * ```
 */
export default async function CodeBlock(props: CodeBlockProps) {
  // await new Promise(resolve => setTimeout(resolve, 3000))
  const { className, meta, children } = { ...props }
  const code = (children as string).trimEnd()

  const tooltipContent = await getTooltipContent()
  const highlightedCode = await highlightCode(code, className.replace('language-', ''), meta as string)
  const highlightedCodeWithTooltips = tooltipifyJSX(
    highlightedCode,
    (qname) => renderTooltipContent(qname, tooltipContent)
  )

  const codeLines = code.split('\n');
  const totalLines = codeLines.length;

  return (
    <CodeBlockClient
      code={code}
      highlightedCodeWithTooltips={highlightedCodeWithTooltips}
      totalLines={totalLines}
    />
  )
}


export function CodeBlockSkeleton() {
  return (
    <div className="shadow-2xl rounded-md dark:bg-gray-800 bg-gray-100 p-4 my-4 transition-all duration-500 ease-in-out">
      <div className="relative">
        {/* Copy button skeleton */}
        <div className="absolute top-0 right-0 z-20">
          <Skeleton className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-gray-600" />
        </div>
        
        {/* Expand/collapse button skeleton */}
        <div className="absolute top-0 right-12 z-20">
          <Skeleton className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Code content skeleton with line numbers */}
        <div className="overflow-x-auto py-8 line-numbers relative">
          <div className="space-y-1">
            {/* Line 1 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-32 bg-blue-200 dark:bg-blue-800" />
              </div>
            </div>
            
            {/* Line 2 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            
            {/* Line 3 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-40 bg-green-200 dark:bg-green-800" />
              </div>
            </div>
            
            {/* Line 4 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-28 bg-yellow-200 dark:bg-yellow-800" />
              </div>
            </div>
            
            {/* Line 5 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-36 bg-purple-200 dark:bg-purple-800" />
              </div>
            </div>
            
            {/* Line 6 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-20 bg-red-200 dark:bg-red-800" />
              </div>
            </div>
            
            {/* Line 7 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-44 bg-indigo-200 dark:bg-indigo-800" />
              </div>
            </div>
            
            {/* Line 8 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-32 bg-pink-200 dark:bg-pink-800" />
              </div>
            </div>
            
            {/* Line 9 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-24 bg-teal-200 dark:bg-teal-800" />
              </div>
            </div>
            
            {/* Line 10 */}
            <div className="flex items-center">
              <div className="w-12 flex-shrink-0 text-right pr-2">
                <Skeleton className="h-4 w-6 bg-gray-300 dark:bg-gray-600 ml-auto" />
              </div>
              <div className="flex-1 ml-2">
                <Skeleton className="h-4 w-40 bg-orange-200 dark:bg-orange-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}