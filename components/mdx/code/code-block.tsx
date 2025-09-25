import React from 'react';
// import { NewTooltipifyClient } from './new-tooltipify-client';
import highlightCode from './code-highlighter';
import { CodeBlockClient } from './code-block-client';
import { tooltipifyJSX } from './tooltipify-jsx';
import { renderTooltipContent } from './render-tooltip-content';
import { getTooltipContent } from './tooltip-content';

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
  const { className, meta, children: code } = { ...props }


  const tooltipContent = await getTooltipContent()
  const highlightedCode = await highlightCode(code as string, className.replace('language-', ''), meta as string)
  const highlightedCodeWithTooltips = tooltipifyJSX(
    highlightedCode,
    (qname) => renderTooltipContent(qname, tooltipContent)
  )

  const codeLines = (code as string).split('\n');
  const totalLines = codeLines.length;

  return (
    <CodeBlockClient
      code={code as string}
      highlightedCodeWithTooltips={highlightedCodeWithTooltips}
      totalLines={totalLines}
    />
  )
}

