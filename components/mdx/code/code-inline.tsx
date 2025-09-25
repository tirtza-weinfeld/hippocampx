import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { InlineCodeClient } from './code-inline-client';
import highlightCode from './code-highlighter';
import { tooltipifyJSX } from './tooltipify-jsx';
import { renderTooltipContent } from './render-tooltip-content';
import { getTooltipContent } from './tooltip-content';



// 1. New attribute syntax:
// - [language="python", meta="/[red!]k//[green!]for/"]code
// - [meta="/[red!]k//[green!]for/"]code
// - [language="python"]code
// Note: Basic step/color syntax ([1!]code, [red!]code) is now handled by the remark-typography plugin


// Helper: parse attributes like language="python", meta="/[red!]k//[green!]for/"
function parseAttributes(attrStr: string): { language?: string; meta?: string } {
  const result: { language?: string; meta?: string } = {};

  // Match attribute patterns: key="value" or key='value' with optional spaces and commas
  const attrMatches = attrStr.matchAll(/(\w+)\s*=\s*["']([^"']*)["']/g);

  for (const match of attrMatches) {
    const [, key, value] = match;
    if (key === 'language') {
      result.language = value;
    } else if (key === 'meta') {
      result.meta = value;
    }
  }

  // Handle shorthand meta syntax: meta="/[red!]k//[green!]for/" (without explicit key=value)
  if (!result.language && !result.meta && attrStr.startsWith('meta=')) {
    const metaMatch = attrStr.match(/^meta=["']([^"']*)["']$/);
    if (metaMatch) {
      result.meta = metaMatch[1];
    }
  }

  return result;
}


type InlineCodeProps = ComponentPropsWithoutRef<'code'> & { children: ReactNode } &{[key: string]: unknown};

export default async function InlineCode({ children, ...restProps }: InlineCodeProps) {
  const codeText = typeof children === 'string' ? children : String(children || '');
  const tooltipContent = await getTooltipContent();

  // Check for new attribute syntax: [language="python", meta="/[red!]k//[green!]for/"]code
  // Use a more sophisticated regex that handles nested brackets in quoted strings
  const newSyntaxMatch = codeText.match(/^\[((?:[^"\]]+|"[^"]*")*)\](.+)$/);
  if (newSyntaxMatch && newSyntaxMatch[1].includes('=')) {
    const [, attrStr, code] = newSyntaxMatch;
    const { language, meta } = parseAttributes(attrStr);

    // Handle language with optional meta, or just meta without language
    if (language || meta) {
      // Handle language highlighting (python, javascript, etc.) or just meta highlighting
      const highlighted = await highlightCode(code.trim(), language ||
        'text', meta, true, true);

 
   
      // Use tooltipifyJSX which internally handles both tooltips and highlighting
      const highlightedWithTooltips = tooltipifyJSX(
        highlighted,
        (qname) => renderTooltipContent(qname, tooltipContent)
      );


      return (
        <InlineCodeClient highlighted={true} {...restProps}>
          <span className="inline-block">{highlightedWithTooltips}</span>
        </InlineCodeClient>
      );
    }
  }

  // Check for basic step syntax: [purple!]cols, [1!]code, etc.
  const stepSyntaxMatch = codeText.match(/^\[([^!]+)!\](.+)$/);
  if (stepSyntaxMatch) {
    const [, stepOrColor, code] = stepSyntaxMatch;
    const { isValidColorName, getStepColor } = await import('@/lib/step-colors');

    let stepColor: string | undefined;

    if (/^\d+$/.test(stepOrColor)) {
      // Numeric step - convert to color
      const stepNumber = parseInt(stepOrColor, 10);
      stepColor = getStepColor(stepNumber);
    } else if (isValidColorName(stepOrColor)) {
      // Color name
      stepColor = stepOrColor;
    }

    if (stepColor) {
      return (
        <InlineCodeClient highlighted={true} data-step={stepColor} {...restProps}>
          {code}
        </InlineCodeClient>
      );
    }
  }

  // Default styling for regular inline code (CSS only, no JS overhead)
  const hasStep = 'data-step' in restProps;
  // console.log('hasStep', hasStep);
  return (
    <InlineCodeClient highlighted={hasStep} {...restProps}>
      {children}
    </InlineCodeClient>
  );
} 